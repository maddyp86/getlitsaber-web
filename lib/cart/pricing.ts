export const MAX_QTY = 5;
export const BASE_UNIT_PRICE = 59.99;

// Optimistic UI fallback and PDP display only.
// Once an item is in the cart, Shopify's cost.totalAmount is the source of
// truth for prices (stored as CartLine.lineTotal). These constants are used
// for: (a) the instant between add-click and Shopify's response, and
// (b) the PDP quantity selector, which has no cart line to read from yet.
export const TIER_PRICES: Record<number, number> = {
  1: 59.99,
  2: 99.99,
  3: 134.99,
  4: 169.99,
  5: 199.99,
};

function clamp(qty: number): number {
  return Math.max(1, Math.min(MAX_QTY, Math.round(qty)));
}

/** Total line price for the given quantity, clamped to [1, MAX_QTY]. */
export function getTierPrice(qty: number): number {
  return TIER_PRICES[clamp(qty)];
}

/** Total dollars saved vs. MSRP for the given quantity. */
export function getTierSavings(qty: number): number {
  const q = clamp(qty);
  return parseFloat((BASE_UNIT_PRICE * q - TIER_PRICES[q]).toFixed(2));
}

/** Effective per-unit price at the given quantity tier. */
export function getTierUnitPrice(qty: number): number {
  const q = clamp(qty);
  return parseFloat((TIER_PRICES[q] / q).toFixed(2));
}
