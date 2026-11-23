// SINGLE SOURCE for all storefront display pricing (D2C only; wholesale and
// B2B pricing live elsewhere and are not governed by this file).
//
// Pricing model (locked 2026-10-05, ADR-009): every unit sells at MAP, $39.99,
// permanently. MSRP is $49.99 and is only ever shown struck through as the
// anchor. There are no quantity tiers: N units cost N x $39.99. The only perk
// for buying two or more is free shipping (see lib/shipping.ts).
//
// Shopify is the source of truth for charged amounts (the Silver variant's
// price and compare-at price). This file mirrors it so the storefront never
// quotes a price checkout does not honor. If the Shopify variant price changes,
// update BASE_UNIT_PRICE to match.
//
// Campaign exception (ADR-012): while a campaign is active (lib/campaign), an
// order of two or more takes the campaign's multi-unit discount once, mirroring
// a Shopify automatic discount. The floor moves by exactly that amount and no
// further. With no campaign active every function below behaves as ADR-009.

import { currentCampaign } from "@/lib/campaign/runtime";
import type { Campaign } from "@/lib/campaign/types";

export const MAX_QTY = 5;

/** The permanent sell price (MAP). Fallback when no live Shopify price is passed in. */
export const BASE_UNIT_PRICE = 39.99;

/** MSRP. Display-only anchor, always rendered struck through and labeled "MSRP". */
export const MSRP_UNIT_PRICE = 49.99;

/**
 * No displayed unit price may ever go below this, for any quantity. Equal to
 * MAP. A multi-unit price must be at least PRICE_FLOOR x qty.
 */
export const PRICE_FLOOR = 39.99;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Clamp a requested quantity to the 1..MAX_QTY range the cart accepts. */
export function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.min(MAX_QTY, Math.round(qty)));
}

/**
 * The unit price the storefront may display. A live Shopify price below the
 * floor (a misconfigured variant) is raised to the floor rather than shown.
 */
export function getDisplayUnitPrice(base: number = BASE_UNIT_PRICE): number {
  if (!Number.isFinite(base)) return PRICE_FLOOR;
  return round2(Math.max(base, PRICE_FLOOR));
}

/** Dollars a campaign takes off an order of `qty` units. 0 with no campaign. */
export function getCampaignDiscount(
  qty: number,
  campaign: Campaign | null = currentCampaign()
): number {
  if (!campaign || qty < 2) return 0;
  return campaign.pricing.multiUnitDiscount;
}

/** Total line price for the given quantity: unit price x qty, never below the floor. */
export function getLinePrice(
  qty: number,
  base: number = BASE_UNIT_PRICE,
  campaign: Campaign | null = currentCampaign()
): number {
  const q = clampQty(qty);
  return round2(getDisplayUnitPrice(base) * q - getCampaignDiscount(q, campaign));
}

/** Regular (non-campaign) total for the given quantity. */
export function getRegularLinePrice(qty: number, base: number = BASE_UNIT_PRICE): number {
  return getLinePrice(qty, base, null);
}

/** MSRP total for the given quantity, for the struck-through anchor. */
export function getMsrpLinePrice(qty: number): number {
  return round2(MSRP_UNIT_PRICE * clampQty(qty));
}

/**
 * The struck-through anchor for a line. Normally MSRP x qty. On a line a
 * campaign discounts, it is the regular price instead, so the anchor is what
 * the shopper would have paid last week.
 */
export function getAnchorLinePrice(
  qty: number,
  campaign: Campaign | null = currentCampaign()
): number {
  const q = clampQty(qty);
  const discount = getCampaignDiscount(q, campaign);
  if (campaign && discount > 0) {
    // Sale price plus the saving the campaign states for it.
    return round2(getRegularLinePrice(q) - discount + campaign.pricing.multiUnitSaving);
  }
  return getMsrpLinePrice(q);
}

/** "MSRP" normally; "was" when the anchor is the regular price of a discounted line. */
export function getAnchorLabel(
  qty: number,
  campaign: Campaign | null = currentCampaign()
): "MSRP" | "was" {
  return getCampaignDiscount(clampQty(qty), campaign) > 0 ? "was" : "MSRP";
}

/** Lowest total, in cents, the storefront will display for qty units. */
function floorCents(qty: number, campaign: Campaign | null): number {
  return Math.round(PRICE_FLOOR * 100) * qty - Math.round(getCampaignDiscount(qty, campaign) * 100);
}

/** True when a total for qty units works out below the floor. */
export function isBelowFloor(
  total: number,
  qty: number,
  campaign: Campaign | null = currentCampaign()
): boolean {
  if (qty <= 0) return false;
  // Compare in cents so float noise (79.97999…) cannot trip the guard.
  return Math.round(total * 100) < floorCents(qty, campaign);
}

/**
 * Raise a total for qty units to the floor if it falls below it. Used on
 * Shopify-provided cart totals: the storefront never displays a sub-floor
 * price, and the caller reports the violation so the Shopify config gets fixed.
 */
export function clampTotalToFloor(
  total: number,
  qty: number,
  campaign: Campaign | null = currentCampaign()
): number {
  if (!isBelowFloor(total, qty, campaign)) return round2(total);
  return round2(floorCents(qty, campaign) / 100);
}

/** Format dollars for display: 39.99 -> "$39.99". */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** "$10" for whole dollars, "$9.99" otherwise. For savings and per-unit notes. */
export function formatAmountShort(amount: number): string {
  const cents = Math.round(amount * 100);
  return cents % 100 === 0 ? `$${cents / 100}` : formatPrice(cents / 100);
}
