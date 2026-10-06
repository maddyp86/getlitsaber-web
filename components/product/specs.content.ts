// The six spec pills, shared by the homepage hero and the PDP so the two can
// never drift. USB-C and 510 thread are deliberately not here: they live in the
// PDP Tech Specs accordion and on /the-tech for compatibility shoppers.
// Labels locked 2026-10-06 (Matt). Build is aluminum + steel. Copy elsewhere
// that says "aluminum and brass at the connection" describes the 510
// connector and is intentionally left alone. Never name the LED chip brand in
// customer-facing copy (storefront-copy.test.ts enforces it).
export const SPEC_PILLS = [
  "41 ADDRESSABLE LEDS",
  "10 SELECTABLE COLORS",
  "3 INTERACTIVE MODES",
  "800 MAH BATTERY",
  "ALUMINUM + STEEL BUILD",
  "WARRANTY INCLUDED",
] as const;
