// Shipping policy (locked 2026-10-05, ends the single-unit surcharge A/B):
// a single Litsaber ships for $5.99; two or more ship free.
//
// Shopify's delivery customization Function (`shipping-surcharge-gate`) is the
// source of truth for the actual charge. It reads the `_shipping_variant` cart
// attribute: "surcharge" means a single unit pays $5.99, and anything else
// ships free. So every cart is stamped with SHIPPING_ATTRIBUTE_VALUE, and this
// file mirrors the Function so the UI never contradicts checkout. It must never
// drive a charge.

// Campaign exception (ADR-012): a campaign with `freeShippingAll` ships every
// order free. The storefront then stamps the campaign's own attribute value,
// which the Function treats as "not surcharge", so checkout agrees.

import { currentCampaign } from "@/lib/campaign/runtime";
import type { Campaign } from "@/lib/campaign/types";

export const SINGLE_UNIT_SHIPPING = 5.99;

/** Value stamped on `_shipping_variant` so the Function charges singles. */
export const SHIPPING_ATTRIBUTE_VALUE = "surcharge";

/** The `_shipping_variant` value to stamp on carts right now. */
export function shippingAttributeValue(campaign: Campaign | null = currentCampaign()): string {
  return campaign?.pricing.freeShippingAll
    ? campaign.pricing.shippingAttribute
    : SHIPPING_ATTRIBUTE_VALUE;
}

// Returns the shipping cost to display, or null when units are unknown so the
// caller can show "Calculated at checkout" rather than guessing.
//   units >= 2 → 0 (free)
//   single     → 5.99
export function getDisplayShipping(
  units: number | undefined,
  campaign: Campaign | null = currentCampaign()
): number | null {
  if (units === undefined) return null;
  if (campaign?.pricing.freeShippingAll) return 0;
  return units >= 2 ? 0 : SINGLE_UNIT_SHIPPING;
}

// Renders a getDisplayShipping result. 0 reads as "FREE"; null defers to checkout.
export function formatDisplayShipping(amount: number | null): string {
  if (amount === null) return "Calculated at checkout";
  if (amount === 0) return "FREE";
  return `$${amount.toFixed(2)}`;
}
