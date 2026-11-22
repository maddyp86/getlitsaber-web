// Rendered-page check for retired storefront promises (roadmap Phase 1).
// Fetches the product, cart and policy pages from a running site and fails if
// any retired claim is in the served HTML, or if the PDP is missing the
// current offer and shipping wording.
//
//   pnpm check-promises                          # http://localhost:3000
//   pnpm check-promises https://<preview>.vercel.app
//   pnpm check-promises https://<preview>.vercel.app --holiday
//
// --holiday checks the Holiday Sale 2026 offer (ADR-012) instead of the
// regular one: use it while the holiday switch is on for the site under test.
//
// Client-only UI (the cart drawer, a cart with items) is not in served HTML;
// components/storefront-promises.test.ts covers that at the source level.

import { findRetiredClaims } from "../lib/copy/retiredClaims";

const HOLIDAY = process.argv.includes("--holiday");
const BASE = (process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");

const PAGES = [
  "/shop/litsaber-og",
  "/cart",
  "/policies/shipping-returns",
  "/policies/warranty",
  "/policies/terms",
  "/",
  "/about",
  "/the-tech",
  "/contact",
];

// What the PDP must say (owner-confirmed, roadmap Phase 1 and ADR-009).
const PDP_OFFER = HOLIDAY
  ? ["$39.99", "$49.99", "$69.99", "$79.98", "Holiday Sale", "Free US shipping on every order"]
  : ["$39.99", "$49.99", "$79.98", "$99.98", "+ $5.99 shipping", "Free shipping"];

const PDP_REQUIRED = [
  ...PDP_OFFER,
  "SHIPS WITHIN 2 BUSINESS DAYS",
  "Orders ship within 2 business days.",
  "6-month limited warranty against manufacturing defects.",
];

function toText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<!-- -->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

async function main() {
  let failures = 0;
  for (const path of PAGES) {
    const res = await fetch(`${BASE}${path}`, { headers: { cookie: "litsaber_age_verified=true" } });
    if (!res.ok) {
      console.log(`FAIL ${path}: HTTP ${res.status}`);
      failures++;
      continue;
    }
    const text = toText(await res.text());
    const hits = findRetiredClaims(text);
    const missing = path === "/shop/litsaber-og" ? PDP_REQUIRED.filter((s) => !text.includes(s)) : [];
    if (hits.length || missing.length) {
      failures++;
      if (hits.length) console.log(`FAIL ${path}: retired claims: ${hits.join(", ")}`);
      if (missing.length) console.log(`FAIL ${path}: missing: ${missing.join(" | ")}`);
    } else {
      console.log(`ok   ${path}`);
    }
  }
  if (failures) {
    console.log(`\n${failures} page(s) failed against ${BASE}`);
    process.exit(1);
  }
  console.log(`\nAll ${PAGES.length} pages clean against ${BASE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
