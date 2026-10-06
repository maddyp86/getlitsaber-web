# ADR-009: D2C MAP Pricing, Two Offers, No Discounts

**Status:** Accepted (2026-10-05)
**Supersedes:** the 2026-05-27 quantity tier ladder (CLAUDE.md "Bundle SKU strategy"), ADR-004 (welcome discount)
**Related:** ADR-005 (event taxonomy), ADR-006 (customer data), the shipping-surcharge A/B (ended 2026-10-05)

## Context

The storefront sold at $49.99 with a five-step quantity discount ladder down to
$36 a unit, a $5-off welcome popup, and the same offer in the footer signup.
Together they made a durable, well-built device read like a discount 510
battery: constant "save" badges, a percentage-driven ladder, and a coupon
offered to every visitor. The single-unit shipping A/B also ended on
2026-10-05 with the surcharge rolled out to everyone.

## Decision

**Price.** Every unit sells at **$39.99**, our published MAP, permanently. It
is not a sale. **$49.99 is MSRP** and appears only struck through and labeled
"MSRP". No "Was", "Sale" or "Save" labels, no percentage badges, no countdowns.

**Offers.** The PDP shows two merchandised offers and a plain quantity stepper:

| Offer | MSRP anchor | Price | Shipping |
|---|---|---|---|
| Single | $49.99 | $39.99 | + $5.99 (shown on the PDP) |
| Two Pack ("Most popular") | $99.98 | $79.98 | Free |

The 2-pack's only perk over two singles is free shipping. The 3-, 4- and
5-unit merchandised options are gone.

**Floor.** No displayed unit price may be below $39.99, and a multi-unit total
is never below $39.99 × quantity. `lib/cart/pricing.ts` enforces this on every
computed price (a sub-floor live Shopify price is raised to the floor), and the
cart raises any sub-floor Shopify line total to the floor while firing
`price_floor_violation` so the Shopify misconfiguration gets fixed. Charged
amounts are Shopify's: the variant price ($39.99, compare-at $49.99) and the
absence of automatic discounts are what actually enforce the floor at checkout.

**Discounts.** The $5 welcome popup is deleted and the footer signup no longer
offers a discount. No replacement. The `?discount=` passthrough stays because
affiliate links use it; affiliate codes must be attribution-only in Shopify,
since any customer discount would charge below the floor.

**Shipping.** Unchanged from the end of the A/B: $5.99 for one unit, free for
two or more, enforced by the `shipping-surcharge-gate` Function reading the
`_shipping_variant=surcharge` cart attribute. The stamp stays.

**Analytics.** `product_offer_selected` fires when a shopper picks an offer or
steps the quantity. `purchase` carries `offer_selected`
(`single` | `two_pack` | `custom_qty`), derived from item count by the same rule
(`lib/cart/offers.ts`). The retired `$feature/single-unit-shipping-surcharge`
property is no longer written.

## Amendment (2026-10-05, after review on the preview)

- Price order is now sell price first, then the struck-through MSRP, with no
  visible "MSRP" label (screen readers still hear "MSRP $49.99").
- The quantity stepper is gone. The two offers are the whole choice; the cart
  still caps at 5 units across repeat adds.
- "Add a second and shipping's free." is removed from the PDP (the cart's
  free-shipping meter keeps it).
- The "Built to last" block is removed as redundant with the accordion tabs.
  The PDP still links the warranty policy from the comparison table.
- Hero and nav CTAs show "GET YOURS · $39.99" only.

## Consequences

- Any Shopify discount (automatic or code) can now break the floor at checkout.
  Treat creating one as a pricing decision, not a marketing toggle.
- Contribution per unit drops by $10 at the same COGS, so the weekly agent's
  targets (Supabase `litsaber_targets`) need a retune.
- The 2-pack is the only multi-unit merchandising; larger orders route to the
  stepper and, at the cap, to wholesale.
