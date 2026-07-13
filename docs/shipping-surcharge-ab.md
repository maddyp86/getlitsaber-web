# Shipping Surcharge A/B Test · Build Brief (Claude Code handoff)

## Status
Experiment creation in PostHog is **punted** until the data piping is built and verified. Do NOT create or launch the PostHog flag or experiment in this pass. Build and QA the piping first. The experiment is measurable only once the purchase event carries `subtotal` and `shipping_variant` (see Data Contract).

## Why we are building this (hypothesis, one paragraph)
Single-unit orders lose money because we currently eat ~$5.99 of postage under free-shipping-on-everything. We believe charging $5.99 shipping on single-unit orders while keeping shipping free on 2-or-more will raise contribution per visitor: the surcharge recovers postage on retained singles, and some would-be single buyers trade up to the two-pack to avoid the fee. Single-unit conversion is expected to dip modestly and the test can still win. The verdict is contribution per exposed visitor, not conversion rate.

## Architecture ground truth (read before writing any code)
- Stack: Next.js 14.2.x App Router · TypeScript strict · Zustand cart store with a Shopify-shaped interface · Shopify Storefront API (headless, `innovapeconcepts.myshopify.com`).
- Checkout is **Shopify-hosted** (`checkout.getlitsaber.com`). Authorize.net is the payment gateway connected inside Shopify. Stripe is prohibited for vape.
- **Shipping is computed by Shopify settings, not in any server route.** The repo therefore CANNOT charge shipping. The actual $5.99 charge is enforced Shopify-side by a delivery customization Function that reads a cart attribute. That Function is a separate Shopify CLI extension and is OUT OF SCOPE for this repo (see Out of Scope).
- Shopify is the source of truth for charged amounts. The code layer is display-only and must mirror, never drive.
- PostHog project **480206 "Litsaber - Live"** (project 445005 is the deprecated test project). PostHog is initialized in `providers.tsx` via `useLayoutEffect`; flags arrive async, so read them through the React hook, never before init.
- Convention already in use: underscore-prefixed line/cart attributes (e.g. `_fulfillment_sku`) are suppressed from the customer-facing checkout UI while visible in Shopify admin and the Order API.
- Convention already in use: the purchase webhook reads `channel_type` off `note_attributes`. The new `shipping_variant` uses the exact same read path.

## Resolve these first by inspecting the codebase (do not guess)
1. **Where does the purchase / order webhook live?** n8n workflow or a Next.js API route? Grep for the existing PostHog purchase capture and the `note_attributes` / `channel_type` read. This decides whether the backend property additions are a code change here or an n8n node change.
2. **Exact purchase event name and its capture call.** Known properties already on it: `order_value`, `item_count`, `channel_type`, `device_type`, `order_id`, `order_number`, `referrer`, `discount_amount`, `discount_code`, `has_promo_code`. Find where these are assembled.
3. **Confirm the flag key does not exist yet.** Code should read `single-unit-shipping-surcharge`. The flag has not been created; that is intentional and handled separately.

## Data contract (the core of this build)

### Cart attributes · stamped at cartCreate, idempotent, underscore-prefixed
- `_shipping_variant`: `'control' | 'surcharge'`. Resolved once from the PostHog flag and frozen. If already present on the cart, NEVER overwrite. Must not flip between add-to-cart and checkout.
- `_ph_distinct_id`: `posthog.get_distinct_id()`. Lets the server-side purchase webhook attribute the conversion to the correct PostHog person.

### Purchase event · KEEP existing
`order_value` (gross, will include the $5.99 under surcharge · leave as-is, do not point any primary metric at it), `item_count`, `channel_type`, `device_type`, `order_id`, `order_number`, `referrer`, `discount_amount`, `discount_code`, `has_promo_code`.

### Purchase event · ADD three
- `subtotal` · NUMBER · product revenue after discounts, before shipping and tax. Source: Shopify order `current_subtotal_price`. This is the primary-metric target. It reads 49.99 for a retained single in BOTH arms, so it isolates the only uncertain thing (demand + two-pack mix shift) and nets out the two-pack discount automatically.
- `shipping_amount` · NUMBER · `0` or `5.99`. Source: `total_shipping_price_set.shop_money.amount` (or sum of `shipping_lines[].price`). Feeds contribution in Supabase and is the end-to-end proof the Shopify charge actually fired.
- `shipping_variant` · STRING · `'control' | 'surcharge'`. Source: `note_attributes._shipping_variant` (same read path as `channel_type`). Used for the Supabase join and QA; PostHog splits arms by flag exposure, not by this property.

### Supabase `orders` table · ADD columns
`shipping_variant` (text) · `shipping_amount` (numeric). (`device_type` was already added in a prior pass.)

### Note on item_count
`item_count` already exists (screenshot confirmed value 1 on order #1029). Units-per-order and two-pack-share metrics both key off `item_count`. No new units field is needed. Earlier drafts called this `units` · use `item_count`.

## Frontend tasks
1. `lib/experiments/useShippingVariant.ts` · `useFeatureFlagVariantKey('single-unit-shipping-surcharge')` from `posthog-js/react`. Returns `'control' | 'surcharge' | undefined` (undefined while flags load). Do not coerce undefined to a variant; callers decide.
2. Freeze to cart at `cartCreate`: if no `_shipping_variant` attribute yet, set `_shipping_variant = variant ?? 'control'` and `_ph_distinct_id = posthog.get_distinct_id()` via Storefront API `cartAttributesUpdate` (or `cartCreate` input.attributes). If `_shipping_variant` already exists, never overwrite.
3. `lib/shipping.ts` · `getDisplayShipping(units, variant)`: `units >= 2 → 0`; else `variant === 'surcharge' ? 5.99 : 0`. Display-only, mirrors what the Shopify Function will charge. Render `0` as "FREE". If units or variant unknown, show "Calculated at checkout" rather than guessing.
4. Upsell nudge on PDP and cart when `variant === 'surcharge'` AND `item_count < 2`: "Add one more · shipping's on us." Tapping sets qty to 2 on the Silver variant. Never show for control or when `item_count >= 2`. Reserve the space / return null cleanly so there is no layout shift when the flag lands. Cyan `#00E5FF` accent, Space Mono label, match existing PDP styling.

## Backend tasks
1. In the purchase webhook (location from discovery step 1), add `subtotal`, `shipping_amount`, `shipping_variant` to the PostHog capture properties, sourced as above. Capture must be **server-side via `posthog-node`** using `_ph_distinct_id` from `note_attributes` · a headless Shopify thank-you page will not run client JS reliably, so client-side purchase capture is not an option.
2. Add `shipping_variant` and `shipping_amount` to the Supabase `orders` insert/upsert. `ALTER TABLE` for the two columns.
3. After deploy, fire one live test order in each arm and confirm all three new properties land on the event and in Supabase.

## QA gate · must pass before anyone creates the experiment
Build one insight: single-unit purchases where `shipping_variant = 'surcharge'`, broken down by `shipping_amount`. Every row must read `5.99`. Any `0` means the Shopify delivery Function is not firing and the test is silently invalid even though the flag looks healthy. Also confirm: control single-unit → `shipping_amount` 0 · any order with `item_count >= 2` (either arm) → `shipping_amount` 0. Without `shipping_amount` and `shipping_variant` on the event there is no way to catch a broken charge, so this gate is the whole point of doing the piping first.

## Out of scope for this repo (handled separately)
- Shopify delivery customization Function + the two shipping rates in the profile ($0.00 "Free Shipping" and $5.99 "Standard"). The Function reads `_shipping_variant` and `item_count` and hides the wrong rate per bucket. Separate CLI extension, separate deploy.
- Creating or launching the PostHog `single-unit-shipping-surcharge` flag and its experiment. Deferred until the QA gate passes.

## Conventions (carry over from the prior workflow)
- Claude Code is now the sole repo write path. Bolt is deprecated.
- `working-memory.md` is the authoritative build log · update it for real and verify with a diff. ADR ledger is maintained separately from `working-memory.md`.
- No em-dashes in any copy or comments · use the middot `·` as separator · ranges as "X to Y".
- For multi-location string replacements, assert the target appears exactly once before replacing, and grep-validate after every edit.
- Do not modify PostHog init. Do not touch checkout or discount amounts · display is display-only.

## Reference
- PostHog: project 480206 "Litsaber - Live". Assert the project name before trusting any live query · permission errors silently fall back to the 445005 test project. Public project key `phc_...` is already embedded in the app; no new key needed.
- PostHog feed lag is ~3 to 8 minutes · never trust a query run immediately after a test event.
- Supabase: `orders` table.
- Design tokens: background `#050510` · cyan `#00E5FF` · magenta `#FF00E5` · off-white `#F0F0F5` · fonts Orbitron/Stellar (headings), Inter (body), Space Mono (labels).

## Suggested build order
1. Discovery (webhook location, event name, confirm flag absent).
2. Backend: three event properties + two Supabase columns. Most of this is server-side off the Shopify order object and needs no frontend, so it can land first.
3. Frontend: hook · cart stamping · display helper · nudge.
4. Test orders in both arms · verify contract end to end.
5. QA gate insight. Only after it passes: hand back to create the flag + experiment.
