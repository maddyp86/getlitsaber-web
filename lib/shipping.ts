// Shipping policy (locked 2026-10-05, ends the single-unit surcharge A/B):
// a single Litsaber ships for $5.99; two or more ship free.
//
// Shopify's delivery customization Function (`shipping-surcharge-gate`) is the
// source of truth for the actual charge. It reads the `_shipping_variant` cart
// attribute: "surcharge" means a single unit pays $5.99, and anything else
// ships free. So every cart is stamped with SHIPPING_ATTRIBUTE_VALUE, and this
// file mirrors the Function so the UI never contradicts checkout. It must never
// drive a charge.

export const SINGLE_UNIT_SHIPPING = 5.99;

/** Value stamped on `_shipping_variant` so the Function charges singles. */
export const SHIPPING_ATTRIBUTE_VALUE = "surcharge";

// Returns the shipping cost to display, or null when units are unknown so the
// caller can show "Calculated at checkout" rather than guessing.
//   units >= 2 → 0 (free)
//   single     → 5.99
export function getDisplayShipping(units: number | undefined): number | null {
  if (units === undefined) return null;
  return units >= 2 ? 0 : SINGLE_UNIT_SHIPPING;
}

// Renders a getDisplayShipping result. 0 reads as "FREE"; null defers to checkout.
export function formatDisplayShipping(amount: number | null): string {
  if (amount === null) return "Calculated at checkout";
  if (amount === 0) return "FREE";
  return `$${amount.toFixed(2)}`;
}
