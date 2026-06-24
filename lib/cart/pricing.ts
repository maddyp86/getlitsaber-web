export const MAX_QTY = 5;

// SINGLE SOURCE for all pre-cart display pricing.
// Shopify is the source of truth for charged amounts (variant price + automatic
// discounts at checkout). Shopify's discounts are configured as FIXED AMOUNTS;
// the per-quantity values below are a display-only mirror tuned to produce the
// SAME locked cart totals (99.99 / 134.99 / 169.99 / 199.99 at a 59.99 base).
// If the Shopify discount amounts change, update this map so the four totals
// still match, or the PDP will show a price the checkout does not honor.

// Fallback base, used only when a live Shopify variant price is not passed in
// (e.g. navigational CTAs that do not fetch the variant). Keep this matching the
// Shopify Silver variant price.
export const BASE_UNIT_PRICE = 59.99;

// Per-quantity discount off the base line total. Display-only mirror of the
// Shopify fixed-amount discount rules, chosen so the charm-rounded totals land on
// the locked ladder at a 59.99 base: 99.99 / 134.99 / 169.99 / 199.99.
const TIER_DISCOUNTS: Record<number, number> = {
  1: 0,
  2: 0.10,
  3: 0.20,
  4: 0.25,
  5: 0.28,
};

function clamp(qty: number): number {
  return Math.max(1, Math.min(MAX_QTY, Math.round(qty)));
}

// Round to the nearest dollar, then drop a penny, for a clean .99 ending.
function charm(value: number): number {
  return Math.round(value) - 0.01;
}

/** Total line price for the given quantity. Pass the live Shopify base when available. */
export function getTierPrice(qty: number, base: number = BASE_UNIT_PRICE): number {
  const q = clamp(qty);
  if (q === 1) return base;
  return charm(base * q * (1 - TIER_DISCOUNTS[q]));
}

/** Total dollars saved vs base x qty, charm-rounded to a .99 ending. */
export function getTierSavings(qty: number, base: number = BASE_UNIT_PRICE): number {
  const q = clamp(qty);
  if (q === 1) return 0;
  return charm(base * q - getTierPrice(q, base));
}

/** Effective per-unit price at the given quantity tier. */
export function getTierUnitPrice(qty: number, base: number = BASE_UNIT_PRICE): number {
  const q = clamp(qty);
  return parseFloat((getTierPrice(q, base) / q).toFixed(2));
}
