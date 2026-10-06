// Storefront promises that were retired (roadmap Phase 1, 2026-10-06). Shared
// by the source-level test (components/storefront-promises.test.ts) and the
// rendered-page check (scripts/check-promises.ts), so a retired claim cannot
// come back on the product page, cart or policies without failing one of them.
//
// Current, owner-confirmed wording: orders ship within 2 business days via
// USPS Ground Advantage, 2–5 business days in transit; $5.99 shipping on one
// unit, free on two or more; 14-day returns on unopened devices; 6-month
// limited warranty, replacement only; 10 colors.

export const RETIRED_CLAIMS: ReadonlyArray<readonly [label: string, pattern: RegExp]> = [
  ["Free 14-day returns", /free 14-day returns/i],
  ["free shipping on all US orders", /free (usps )?shipping on all (us )?orders/i],
  ["12 colors", /\b(12|twelve) (selectable )?colou?r/i],
  ["$45.99", /\$45\.99/],
  ["$44.99", /\$44\.99/],
  ["$89.99", /\$89\.99/],
  ["24-hour dispatch", /\bships? in 24 ?h(ou)?rs?\b/i],
  ["same-day fulfillment", /same[- ]day fulfil/i],
  ["up to 5 business days", /up to 5 business days/i],
  ["5 to 7 business days", /\b5 (to|–|-) ?7 business days/i],
  ["ships within 1 to 2 business days", /ship\w* within 1 (to|–|-) ?2 business days/i],
  ["If it's 510, it works", /if it(['’]|&#x27;)?s 510, it works/i],
  ["repair or replace", /repair or replace/i],
  ["dated Gold launch", /gold edition (launches|drops)[^.]*\b20\d\d\b/i],
  ["glowstick that hits 510", /glowstick that hits 510/i],
  ["repair or store credit", /replacement, repair,? or store credit/i],
];

/** Labels of every retired claim found in the text. */
export function findRetiredClaims(text: string): string[] {
  return RETIRED_CLAIMS.filter(([, re]) => re.test(text)).map(([label]) => label);
}
