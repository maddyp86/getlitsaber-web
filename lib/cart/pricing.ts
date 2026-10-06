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

/** Total line price for the given quantity: unit price x qty, never below the floor. */
export function getLinePrice(qty: number, base: number = BASE_UNIT_PRICE): number {
  return round2(getDisplayUnitPrice(base) * clampQty(qty));
}

/** MSRP total for the given quantity, for the struck-through anchor. */
export function getMsrpLinePrice(qty: number): number {
  return round2(MSRP_UNIT_PRICE * clampQty(qty));
}

/** True when a total for qty units works out below the per-unit floor. */
export function isBelowFloor(total: number, qty: number): boolean {
  if (qty <= 0) return false;
  // Compare in cents so float noise (79.97999…) cannot trip the guard.
  return Math.round(total * 100) < Math.round(PRICE_FLOOR * 100) * qty;
}

/**
 * Raise a total for qty units to the floor if it falls below it. Used on
 * Shopify-provided cart totals: the storefront never displays a sub-floor
 * price, and the caller reports the violation so the Shopify config gets fixed.
 */
export function clampTotalToFloor(total: number, qty: number): number {
  if (!isBelowFloor(total, qty)) return round2(total);
  return round2(PRICE_FLOOR * qty);
}

/** Format dollars for display: 39.99 -> "$39.99". */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
