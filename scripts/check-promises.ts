// Rendered-page check for retired storefront promises (roadmap Phase 1).
// Fetches the product, cart and policy pages from a running site and fails if
// any retired claim is in the served HTML, or if the PDP is missing the
// current offer and shipping wording.
//
//   pnpm check-promises                          # http://localhost:3000
//   pnpm check-promises https://<preview>.vercel.app
//
// Client-only UI (the cart drawer, a cart with items) is not in served HTML;
// components/storefront-promises.test.ts covers that at the source level.

import { findRetiredClaims } from "../lib/copy/retiredClaims";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

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
const PDP_REQUIRED = [
  "$39.99",
  "$49.99",
  "$79.98",
  "$99.98",
  "+ $5.99 shipping",
  "Free shipping",
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
