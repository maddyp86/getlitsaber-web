// Display-only shipping logic for the single-unit surcharge A/B test.
// Shopify's delivery customization Function is the source of truth for the
// actual charge; this mirrors it so the UI never contradicts checkout. It must
// never drive a charge.

export type ShippingVariant = "control" | "surcharge";

// Returns the shipping cost to display, or null when we cannot know it yet
// (units or variant unresolved) so the caller can show "Calculated at checkout"
// rather than guessing.
//   units >= 2        → 0 (free, both arms)
//   single · surcharge → 5.99
//   single · control   → 0
export function getDisplayShipping(
  units: number | undefined,
  variant: ShippingVariant | undefined,
): number | null {
  if (units === undefined || variant === undefined) return null;
  if (units >= 2) return 0;
  return variant === "surcharge" ? 5.99 : 0;
}

// Renders a getDisplayShipping result. 0 reads as "FREE"; null defers to checkout.
export function formatDisplayShipping(amount: number | null): string {
  if (amount === null) return "Calculated at checkout";
  if (amount === 0) return "FREE";
  return `$${amount.toFixed(2)}`;
}
