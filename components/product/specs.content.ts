// The six spec pills, shared by the homepage hero and the PDP so the two can
// never drift. USB-C and 510 thread are deliberately not here: they live in the
// PDP Tech Specs accordion and on /the-tech for compatibility shoppers.
// Labels locked 2026-10-06 (Matt). Confirmed materials: aluminum, brass,
// plastic and silicone. There is no steel in the device. Never name the LED chip brand in
// customer-facing copy (storefront-copy.test.ts enforces it).
export const SPEC_PILLS = [
  "41 ADDRESSABLE LEDS",
  "10 SELECTABLE COLORS",
  "3 INTERACTIVE MODES",
  "800 MAH BATTERY",
  "ALUMINUM + BRASS BUILD",
  "WARRANTY INCLUDED",
] as const;

// Compatibility statement, wording supplied by Matt 2026-10-06. It replaces the
// absolute "works with any 510" style claims (see lib/copy/retiredClaims.ts).
// The full caveats (10.5 to 14.5mm, backing off deeper-pin carts) stay in the
// PDP Tech Specs and the contact FAQ.
export const COMPATIBILITY_STATEMENT =
  "Compatible with live resin, rosin, distillate and liquid diamonds. Has a 4.0mm pin depth, tuned for 95 to 99% cart compatibility. If it's 510, it likely works.";
