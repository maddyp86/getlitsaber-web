# ADR-012: Holiday Sale 2026, a Switchable Campaign Layer

**Status:** Accepted (2026-11-21)
**Amends:** ADR-009 (D2C MAP pricing) with a time-boxed exception. ADR-009 is
otherwise unchanged and applies in full whenever no campaign is active.

## Context

Matt approved a Holiday Sale for now through Wed Dec 16, 2026
(`litsaber-holiday-site-requirements.md`, 2026-11-21): a sitewide announcement
bar, a "LIGHT UP / THE HOLIDAYS" homepage hero, a gift shot in the PDP gallery,
a $69.99 Two Pack, and free US shipping on every order. He also asked to be
able to switch between the holiday site and the regular site, so nothing has to
be rebuilt on Dec 17.

Three things in the codebase stood in the way:

- ADR-009 bans "sale" wording and any unit price below $39.99, and
  `lib/cart/pricing.ts` enforces the floor on Shopify's own cart totals. A
  $69.99 Two Pack would have displayed as $79.98 in the cart while checkout
  charged $69.99.
- The Two Pack is not a Shopify product. It is quantity 2 of the one Silver
  variant, so its price cannot be set "at the product level".
- Singles pay $5.99 shipping, charged by the `shipping-surcharge-gate` Function
  when the cart's `_shipping_variant` attribute reads `surcharge`.

## Decision

**One campaign value drives everything.** `lib/campaign/` holds the campaign
config (`holiday2026.ts`: dates, bar messages, hero copy, offer) and the
decision of whether it is active. Nothing existing was replaced; every holiday
behaviour is a branch on "is a campaign active". Off means the site renders as
it did before this ADR.

**The switch is Vercel Edge Config**, the store that already holds
`maintenanceMode`:

- `holidayMode` (boolean) for production.
- `holidayModePreview` (boolean) for preview deployments, so a preview can be
  reviewed before production flips.

Flipping it takes effect on the next request, with no deploy. Two guards sit on
top (`lib/campaign/resolve.ts`, unit tested):

- **Auto end.** After Dec 16, 11:59pm Pacific the regular site renders even if
  the switch is still on.
- **Fail closed.** If Edge Config cannot be read, the regular site renders.

`getActiveCampaign()` (server) makes the decision once per request.
`<CampaignProvider>` passes it to client components and, through
`lib/campaign/runtime.ts`, to plain modules (pricing helpers, the cart store)
that cannot read React context.

**Pricing.** While the campaign is active an order of two or more takes $9.99
off once (2 x $39.99 = $79.98, less $9.99 = $69.99). The floor in
`lib/cart/pricing.ts` moves by exactly that amount on those orders and by
nothing else: a single is still floored at $39.99, a Two Pack at $69.99, and
`price_floor_violation` still fires below either. The struck-through anchor on
a discounted line is not MSRP: it is the sale price plus the campaign's stated
saving (`multiUnitSaving`, $10), so the Two Pack strikes $79.99 and both offers
read "Save $10". That is one cent above the real regular price of $79.98, which
is what Shopify's checkout shows as the original; Matt asked for $79.99 on
2026-11-22, reversing his earlier $79.98 choice. In Shopify
this is one automatic discount, "Holiday Sale", with the same end time. The
storefront and the discount must change together.

**Shipping.** The campaign stamps `_shipping_variant = holiday-free`, which the
Function treats as "not surcharge", so every order ships free with no Shopify
shipping change. `hydrate()` already re-stamps a cart whose stamp differs from
the current value, which covers carts opened before the switch flipped and,
more importantly, holiday carts still open on Dec 17.

**Copy.** "Holiday Sale" wording is allowed only in the campaign config and the
components that render it. `components/storefront-copy.test.ts` scans the
config against every other banned word and against Black Friday / Cyber Monday
wording. Site UI stays in the regular palette; the red, green and warm-white
bulb colours are decorative tokens used only by the hero's string lights.

**Layout.** The bar is fixed above the navbar. Its height is the CSS variable
`--announce-h` (0 unless a bar is showing), which the navbar, `<main>` and the
sticky offsets read, so the regular site's layout is byte-for-byte unaffected.

## Deviations from the requirements doc

- Images live in Vercel Blob, not a repo static folder (ADR-007).
- The Two Pack's struck $79.99 is a display value from the campaign config, not
  a Shopify price: two units have no compare-at price of their own, and the
  real regular price is $79.98.
- 3 to 5 units (reachable by adding again) take the $9.99 once. No 3+ price is
  advertised anywhere.
- Mobile headline sizes are capped by viewport width: at the specified 48px,
  "THE HOLIDAYS" in the site's real Monoton is 400px wide and overflowed a 390px
  phone.
- Mobile and desktop headline sizes are derived from the text column's width
  (both lines exactly as wide as the column), not the fixed 116/69px in the
  first requirements doc (Matt's follow-up spec, 2026-11-22).
- The bar is solid cyan with dark bold text and no accent-coloured spans
  (same follow-up), not the original dark bar with a cyan underline.
- Section 4 (Key Features graphic) is not built; its placement is still open.

## Consequences

- Turning the campaign off is one Edge Config value. Dec 17 needs no deploy:
  the storefront switches itself and the Shopify discount expires on its own.
- The campaign code stays in the repo after Dec 16 as the pattern for the next
  campaign: add a config file, register it in `runtime.ts`.
- A second automatic discount or an active discount code can stack with the
  holiday price in Shopify. The floor guard would then show the campaign floor
  and fire `price_floor_violation`. Keep the discount non-combinable.
- `/policies/disclaimer` still says the struck price "is not a sale, a discount
  or a limited-time offer". That stays true of the $49.99 MSRP anchor, but reads
  oddly beside the campaign. Open with Matt.
