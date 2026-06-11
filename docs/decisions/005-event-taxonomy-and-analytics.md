# ADR-005: Event Taxonomy & Analytics Instrumentation (Phase 5)

**Status:** Accepted (2026-05-28; revised 2026-05-28 after the 60-day performance report)
**Supersedes:** none
**Related:** Phase 5 (observability), Phase 6 (production agent), ADR-001 (tool stack), ADR-004 (promo architecture), docs/METRICS.md

## Context

The old WordPress/Avada site led with spec-sheet copy and the conversion data
didn't support it. The 60-day report quantified it: 689 visitors → 127 buy-clicks
(18%) → 1 purchase (0.14%). The collapse is one transition — buy-click→purchase
at ~0.8%, one to two orders of magnitude below normal, the signature of a
mechanical failure (broken checkout / category-rejected payments), not soft
motivation. The whole rebuild exists to replace a static marketing site with a
learning system. That system is worthless if the events it learns from are
inconsistent, so the event layer is designed before it is installed — not
retrofitted after a week of autocapture noise.

The instinct is to install PostHog first because it produces visible data fast.
Rejected for the same reason the cart was built against a local store before
Shopify (Phase 2a / ADR-002): define the interface first, wire the
implementation to it last. Here the interface is the event taxonomy; the
implementation is PostHog. The first funnel event captured should already be in
its final shape.

Three capture layers, in dependency order:

1. **PostHog** — product analytics (autocapture, funnels, session replay, the
   typed funnel events defined here).
2. **Vercel Analytics** — Core Web Vitals / performance. Near-zero effort, rides
   along.
3. **Supabase mirror** — the same events land in a clean SQL table so the Phase 6
   agent can query them directly. Can lag PostHog, but the taxonomy must be
   designed with it in mind so the schema doesn't churn later.

The metric strategy this taxonomy serves (North Star, KPI tree, baselines) lives
in `docs/METRICS.md`. This ADR owns the *events*; METRICS.md owns the *strategy*.

## Decision

### Naming convention (locked, per PostHog docs)

- **Events:** `snake_case`, present-tense `object_action` (e.g. `product_viewed`,
  `cart_add_to_cart`). Lowercase only.
- **Properties:** `snake_case`. Boolean props prefixed `is_` / `has_`. Date or
  timestamp props suffixed `_date` / `_timestamp`.
- **One source of names.** Event and property names are defined once in a typed
  module (`lib/analytics/events.ts`), never as inline string literals in
  components. A string literal `posthog.capture("addToCart")` is a bug; it routes
  around the taxonomy. (Mirrors the "no inline hex" rule for tokens.)
- **Versioned.** This ADR is the tracking plan. Changes to the taxonomy edit this
  ADR and the typed module together, in one commit.

### The conversion funnel (the critical path)

The primary funnel, in order. Each step is one event. Maps 1:1 to the KPI tree in
METRICS.md.

1. `age_gate_confirmed` — user clicks "I AM 21+". The compliance gate is the true
   top of funnel; everything before it is pre-entry.
2. `homepage_engaged` — **(added after the report; definition locked 2026-05-30)**
   the user crosses a meaningful engagement threshold on the homepage. The report's
   single clearest UX finding (16s on page, 45.4% exit) had no event in the original
   taxonomy; this is the event the repositioning homepage is judged by. This is KPI
   rung 2. **Fires once per session, on whichever comes FIRST of:**
   (a) scrolling past the hero into the second section — the truest "didn't bounce
   off the headline" signal, directly inverts the 45.4% exit;
   (b) a dwell of ~10s on the homepage — catches engaged readers who haven't scrolled
   (threshold sits deliberately BELOW the old 16s average: measures "stayed longer
   than a bounce," not "longer than old average");
   (c) any CTA click — unambiguous engagement regardless of scroll/time.
   Property: `trigger` (`scroll` | `dwell` | `cta_click`) — records which threshold
   fired, so `scroll` vs `dwell` engagement can be separated in analysis. Wired in
   Phase 5b (moved up from deferred — rung 2 is the leak the homepage rebuild targets,
   so it must be measurable from launch).
3. `product_viewed` — PDP or homepage buy section enters view. Property:
   `surface` (`pdp` | `homepage_buy`), `page_path`.
4. `product_variant_selected` — Silver/Gold style chosen. Property:
   `variant` (`silver` | `gold`). Gold forks to the waitlist sub-funnel.
5. `product_quantity_selected` — Single / Two Pack / More-with-stepper. Property:
   `quantity` (1–5), `tier_price`.
6. `cart_add_to_cart` — `addItem` fires (considered path: Add → drawer). Props:
   `variant`, `quantity`, `tier_price`, `unit_price`,
   `source` (`homepage_buy` | `pdp`) — **(added 2026-05-30)** `BundleAndCTA`
   renders on BOTH the homepage buy section and the PDP; `source` distinguishes
   which surface drove the add. Threaded as a typed `surface` prop from the two
   static page call sites (not runtime path-sniffing).
   `buy_now_clicked` — **(added after the report)** the impulse path (BUY NOW →
   straight to checkout). Kept DISTINCT from `cart_add_to_cart` because the old
   site's single "Buy click" conflated impulse and considered intent, which have
   different friction. Props: `variant`, `quantity`, `tier_price`.
   `cart_remove_item` — **(added 2026-05-30)** fires on the `removeItem` UI path
   (Remove link in CartDrawer and CartPageBody). Props: `variant`, `quantity`
   (read from the line BEFORE removal). NOT a forward funnel step — a **friction
   signal**: pre-checkout removal is the hesitation behavior the 60-day report
   flagged ("interest without conversion") and previously had no event.
7. `cart_viewed` — drawer opens OR `/cart` page loads. Property:
   `surface` (`drawer` | `page`).
8. `checkout_started` — the `checkoutUrl` redirect fires. The last event captured
   on our domain. Props: `cart_value`, `item_count`, `has_promo_code`,
   `source` (`drawer` | `cart_page` | `buy_now`) — **(added 2026-05-30)** the
   three checkout entry points emitted an identical event; `source` attributes
   each so drawer-vs-cart-page-vs-impulse checkout behavior is separable.
9. `purchase` — completed order. **Shopify-side, off our domain — captured via the
   orders/create webhook (now in Phase 5; see "Checkout stitching").** Props:
   `order_value`, `item_count`, `has_promo_code`, `discount_code`,
   `discount_amount`.
10. `device_activated` — the North Star event. **WIRED + verified 2026-06-09.**
    This is KPI rung 7. Fires on the Activate page via an invisible client shim
    `ActivationTracker` (`components/activate/ActivationTracker.tsx`, renders null,
    mounted in `app/activate/page.tsx`) — the same Server-Component tracker pattern
    as `PdpViewTracker`. Props: `activation_source` (`packaging_qr` | `direct`,
    derived from `utm_source` — `=== 'packaging'` → `packaging_qr`, else `direct`),
    `is_first_activation` (boolean).
    **Decision — fires on EVERY load, not fire-once (2026-06-09).** The
    `litsaber_activated` localStorage flag sets `is_first_activation` (absent → true,
    then the flag is set; present → false), but does NOT suppress the event. The
    deduped North Star count = `device_activated` filtered to
    `is_first_activation = true`; repeat loads still fire (with `false`) to capture
    re-engagement (someone re-reading the activation guide). Two separate dedupe
    layers, kept distinct: a per-mount `useRef` guard prevents the StrictMode
    double-invoke within one load; the per-device localStorage flag drives the
    boolean across loads. Read-order is load-bearing: read flag → fire → THEN set
    flag, so the very first load reports `true`.
    **MUST use `trackWhenReady`, not `track`** (see the mount-timing rule below) —
    this is the highest-traffic cold-load QR destination and a raw `track()` would
    silently drop into PostHog's init gap. It uses `trackWhenReady`. Verified all
    four branches: first/return × packaging/direct.
    **Attribution limitation (be honest in reporting):** this counts
    "activate-page visits, packaging-attributed"; the deduped first-activation count
    is a directional proxy, NOT an airtight per-unit signal — it cannot tell genuine
    owner-activations apart from non-owners scanning the same box (festival friends,
    retail shoppers). Good enough to steer by; not precise. Order-linked activation
    (the order→activation gap diagnostic) is deferred — see footnote.
    **QR cutover dependency:** the dynamic (repointable) box QR points at the Vercel
    preview URL for testing and MUST be repointed to
    `getlitsaber.com/activate?utm_source=packaging&utm_medium=qr&utm_campaign=activation_insert`
    at Phase 7 launch cutover. Dynamic QR = no reprint needed.
    **PostHog live-feed lag (testing note):** this project's PostHog Cloud live
    event feed lags display by several minutes (events captured immediately, shown
    late). Confirmed during verification — repeat-load events arrived 3 to 8 minutes
    after firing. Do NOT chase "missing" events in the live feed during testing; wait
    out the lag before suspecting code. Irrelevant to production (funnels/agent read
    historical data, not the live feed).

### Secondary funnels

**Promo sub-funnel (ADR-004) — measured as an isolated lever.
REVISED 2026-05-31: the redemption architecture changed (in-cart promo field
removed, replaced by `?discount=` checkout-URL auto-apply — see ADR-006), so the
redemption-side event was redefined and a dismissal event added. All four events
are WIRED and verified.**
- `promo_popup_shown` — property: `trigger` (`time_delay` | `exit_intent`). The
  funnel DENOMINATOR. NOT "always shown" — gated by `usePromoPopup`'s triggers AND
  the 72h-dismiss / 365d-subscribe suppression cookies, so it is a real variable.
  Every per-shown rate (submit rate, dismiss rate) depends on this. Fires once per
  show, at the single `setVisible(true)` site; `trigger` records which threshold
  fired (a `triggerRef` set before each `tryShow` call).
- `promo_email_submitted` — property: `source` = `floating-promo-$10` (the actual
  `WAITLIST_SOURCES.promoPopup` constant value — confirmed, not a guess). Fires in
  the popup's `onSuccess`, alongside the toast + `markSubscribed`.
- `promo_popup_dismissed` — property: `method` (`close_button` | `backdrop` |
  `escape`). **(added 2026-05-31)** The loss state. Fires ONLY on user-initiated
  close WITHOUT submit. Structurally separated from the submit path: `markSubscribed`
  calls `setVisible(false)` directly and never routes through `dismiss(method)`, so
  a successful submit CANNOT fire a dismissal — preserving the funnel identity
  `shown = submitted + dismissed`. `method` separates active rejection from passive
  abandonment; abandonment (navigate-away, no interaction) is a non-event, derivable
  as `shown − submitted − dismissed`, deliberately not instrumented.
- `promo_code_captured` — property: `code`. **(added 2026-05-31, REPLACES
  `promo_code_applied`)** Fires when `useDiscountCapture` reads a `?discount=CODE`
  param on landing. Fires once per genuinely-NEW code (incoming differs from the
  stored sessionStorage value), not on re-reading an existing value. Measures
  arrivals via the promo email link.
- **`promo_code_applied` — SUPERSEDED 2026-05-31.** Originally specced to fire from
  `cartDiscountCodesUpdate` success (the in-cart apply field). That field and that
  mutation path were REMOVED (redemption moved to `?discount=` checkout-URL
  auto-apply per ADR-006), so the trigger no longer exists. Redemption is NOT lost
  from measurement: the redemption FACT is captured server-side at `purchase`
  (`has_promo_code` / `discount_code` / `discount_amount`, read off the Shopify
  order, step 9). The redemption MOMENT is no longer observable client-side (it
  happens inside Shopify hosted checkout) — an accepted loss.
- joins the primary funnel at `purchase`, where `has_promo_code` /
  `discount_code` / `discount_amount` are read off the Shopify order. This is what
  makes promo-attributed completion a real comparable number (orders WITH code vs
  WITHOUT) and lets us track total margin given up to the promo. `discount_amount`
  is captured even though the launch offer is a flat $10 — future-proofs for
  variable/stacked promos, near-zero cost now, annoying to retrofit later.

**Waitlist sub-funnel (Gold + Future Drops):**
- `waitlist_modal_opened` — property: `list` (`gold` | `general`).
- `waitlist_submitted` — property: `list`, `source`. (Wraps the existing
  `WaitlistForm` success state; the HubSpot POST already happens, this observes it.)

### Standard property schema (attached where relevant)

- `surface` — `pdp` | `homepage_buy` | `drawer` | `page`.
- `variant` — `silver` | `gold`.
- `quantity` — integer 1–5.
- `unit_price` / `tier_price` / `cart_value` / `order_value` / `discount_amount`
  — numbers, not formatted strings.
- `has_promo_code` — boolean. `discount_code` — string.
- `trigger`, `source`, `list`, `code`, `page_path`, `activation_source` — as above.
- **Acquisition context as session/person properties — (added after the report):**
  `utm_source`, `utm_medium`, `utm_campaign`, `referrer`, `landing_path`. The
  report's 43.7% "Direct" is almost certainly UTM-stripped paid social (Meta
  in-app browser strips referrer); we can't optimize channels we can't attribute.
- Never put PII (raw email) in event properties. Email capture is HubSpot's job
  (server-side, keyed). PostHog gets the *event* of submission, not the address.

### Checkout stitching (the off-domain purchase problem) — REVISED

When `checkout_started` redirects to Shopify's hosted `checkoutUrl`, the user
leaves our PostHog-instrumented domain. Hosted checkout means we cannot drop our
own snippet on the Shopify checkout page, so `purchase` cannot be captured
client-side.

**Decision (revised after the report): build the `orders/create` webhook IN
Phase 5.** The original draft shipped without purchase capture and deferred the
webhook as a fast-follow. The report changed that call: purchase-completion rate
(KPI rung 6) is the ONE broken metric the entire rebuild is betting on. Shipping
blind on it means we'd watch `checkout_started` rise and have no idea whether
orders followed — blind on the only transition that defines success. So:

- Shopify `orders/create` webhook → server endpoint → PostHog Capture API
  (server-side), keyed to the same `distinct_id` (passed into checkout as a cart
  attribute / note and read back off the order), with `$process_person_profile`
  set so the purchase attaches to the right person — NOT a catch-all "system" id
  (PostHog docs warn this fragments people and triggers rate limiting).
- The same webhook feeds three things — build once, use three times:
  1. the PostHog `purchase` event (this ADR),
  2. promo redemption tracking (ADR-004, the front half of its Architecture B),
  3. the Supabase order mirror (Phase 6 agent surface).

### Identity

- Anonymous (no `identify`) at launch for the storefront — no app-side login.
  Person profiles stay anonymous-but-stable via PostHog's device id, enough for
  funnels and session replay.
- The `orders/create` webhook is where a real identity (email) can be attached
  server-side, with person processing set so it does not fragment.

### Hosting / region

- PostHog Cloud (managed), not self-hosted — speed-to-value over governance at
  this stage; revisit only if compliance demands data residency.
- US vs EU host and the reverse-proxy question (routing PostHog through a Next.js
  rewrite to dodge ad-blockers) are install-time decisions for Phase 5a, verified
  against current PostHog Next.js docs at build time, not pinned here.

### Mount-timing rule: `trackWhenReady` (added 2026-05-31)

**Any event that can fire at or near component mount MUST be sent via
`trackWhenReady()`, never raw `track()`, or it silently drops.**

The failure mode, found the hard way: PostHog's `init()` (in `PostHogProvider`'s
effect) is internally async — it is not capture-ready the instant it returns. A
`track()` call in a child component's mount `useEffect` can win the race and fire
BEFORE PostHog is ready. The call no-ops silently — no error, the synchronous work
around it (e.g. a sessionStorage write) succeeds, so it looks like everything ran.
This was surfaced by `promo_code_captured` (which never reached PostHog despite the
sessionStorage write succeeding), then an audit found `product_viewed` — funnel
step 3, fired on every PDP visit — had the IDENTICAL bug, meaning the core funnel
was under-counting product views against PostHog's init gap.

`trackWhenReady()` (in `lib/analytics/events.ts`, beside `track()`): if PostHog is
already loaded (`posthog.__loaded`), it calls `track()` immediately (no overhead for
the common late-firing case); if not, it registers the `track()` via
`posthog.onFeatureFlags()`, which fires once init completes. Same signature as
`track()`, so adopting it is a one-word swap. Fire-once is still the caller's job
(the existing `useRef` / dedup guards) — `trackWhenReady` handles readiness, not
deduplication.

Events that must use it: anything fired from a mount effect or an
IntersectionObserver that may already be intersecting at mount. Currently:
`promo_code_captured` ✅, `product_viewed` ✅. At-risk-but-lower:
`homepage_engaged` dwell trigger (10s delay usually clears the race, but a slow
connection could still drop it — convert opportunistically). Interaction-driven
events (clicks, submits, scroll-triggered-after-load) are safe — they fire well
after init — but using `trackWhenReady` everywhere is harmless and removes the need
to judge per-event.

**Known fidelity gap (logged, not fixed):** `product_viewed` is specced (above) to
fire when the PDP/homepage buy section ENTERS VIEW, but both call sites
(`ProductDisplay.tsx`, `PdpViewTracker.tsx`) currently fire at MOUNT, not on
viewport entry. On the homepage, if the buy section is below the fold, the event
fires on page load regardless of whether the user scrolled to it — so it currently
measures closer to "page loaded" than "saw the product." Acceptable for now;
revisit by gating the homepage fire behind an IntersectionObserver if product-view
fidelity matters for a specific analysis.


  the same way `tokens.json` is for styling. Adding an event is a deliberate,
  reviewed act.
- Autocapture still runs underneath for exploratory analysis; the typed funnel
  events are the spine.
- Purchase IS measured at launch (webhook promoted into Phase 5). The launch
  conversion metric is real, not a proxy.
- The Activate page is now launch-blocking (the `device_activated` North Star
  event depends on it) — a Phase 7 dependency, tracked in METRICS.md.
- One webhook (`orders/create`) is on the critical path for three things — worth
  building well, once.

## Alternatives rejected

- **Install PostHog first, define taxonomy after.** A week of inconsistent event
  names needing migration. The point of Phase 5 is clean data.
- **Self-hosted PostHog.** Governance benefit not worth the maintenance at this
  scale.
- **Capturing email in PostHog event properties** for promo/waitlist funnels.
  PII in the analytics stream — rejected. HubSpot holds the email; PostHog holds
  the event.
- **Deferring the orders/create webhook to a fast-follow** (original draft).
  Reversed: it leaves us blind on the single broken metric the rebuild targets.

## Event refinements driven by the 60-day report (changelog)

1. Added `homepage_engaged` — catches the 45.4%-exit / 16s homepage leak (KPI
   rung 2), previously uninstrumented.
2. Split `buy_now_clicked` from `cart_add_to_cart` — the old "Buy click"
   conflated impulse vs considered intent.
3. Added acquisition context session properties (`utm_*`, `referrer`,
   `landing_path`) — the 43.7% "Direct" is UTM-stripped paid social.
4. Promoted the `orders/create` webhook into Phase 5 (was a fast-follow) — to
   measure purchase-completion (the broken rung) from day one.
5. Added `device_activated` — the North Star event (Activate page, launch-blocking).
   Attribution via the packaging QR's `utm_source` + per-device cookie dedupe;
   documented as a directional proxy, not an airtight per-unit signal.
6. Added promo financial props to `purchase` (`has_promo_code`, `discount_code`,
   `discount_amount`) — to measure the first-order promo as an isolated lever and
   track margin given up.
7. **(2026-05-30, 5b-patch — surfaced by reviewing the live event stream)** Added
   `source` to `cart_add_to_cart` (`homepage_buy` | `pdp`) and to `checkout_started`
   (`drawer` | `cart_page` | `buy_now`), and added `cart_remove_item` (friction
   signal). The original 5b spec fired add-to-cart identically from two product
   surfaces and checkout identically from three entry points — same event, no idea
   where it happened. Source attribution turns "people are checking out" into "people
   check out from X 3× more than Y." An event without where-it-fired context is half
   an event.

## Open before build (Phase 5a)

- Create the PostHog project (account exists, project does not) and obtain the
  project API key + host.
- Confirm US vs EU host.
- Decide reverse-proxy yes/no against current PostHog Next.js App Router docs.
- Confirm the Activate page build covers a fireable `device_activated` event.
- Reroute the (dynamic) packaging QR to
  `/activate?utm_source=packaging&utm_medium=qr&utm_campaign=activation_insert`
  — confirm with marketing the QR is a reroutable redirect, not a hardcoded URL.
  This is the entire packaging-vs-direct attribution mechanism; one redirect
  change covers all already-printed inventory.

## Footnote — order-linked activation (deferred)

Two stronger activation signals were considered and deferred, because the
packaging is already manufactured with a single static QR and we are keeping
launch lean:

- **Per-unit QR token** (unique code per box) — would make activation
  unforgeable and order-linkable. Not possible on already-printed static
  packaging; revisit only for a future production run whose print process
  supports variable codes.
- **Optional order-# registration on the activate page** (value-exchange:
  warranty/perk) with real-time Shopify Admin API validation (two-factor: order #
  + email) — would recover the order→activation linkage on the existing static
  packaging. Deferred for now to keep Phase 5 lean; the design is sound and can be
  added later if the UTM proxy proves too noisy to trust. Until then, activation
  is the UTM + cookie-dedupe proxy and the order→activation gap diagnostic is not
  computed.
