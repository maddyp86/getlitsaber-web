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
   `variant`, `quantity`, `tier_price`, `unit_price`.
   `buy_now_clicked` — **(added after the report)** the impulse path (BUY NOW →
   straight to checkout). Kept DISTINCT from `cart_add_to_cart` because the old
   site's single "Buy click" conflated impulse and considered intent, which have
   different friction. Props: `variant`, `quantity`, `tier_price`.
7. `cart_viewed` — drawer opens OR `/cart` page loads. Property:
   `surface` (`drawer` | `page`).
8. `checkout_started` — the `checkoutUrl` redirect fires. The last event captured
   on our domain. Props: `cart_value`, `item_count`, `has_promo_code`.
9. `purchase` — completed order. **Shopify-side, off our domain — captured via the
   orders/create webhook (now in Phase 5; see "Checkout stitching").** Props:
   `order_value`, `item_count`, `has_promo_code`, `discount_code`,
   `discount_amount`.
10. `device_activated` — **(added)** the North Star event. Fires on the Activate
    page. This is KPI rung 7. **The Activate page is launch-blocking** (see
    METRICS.md) so this fires from launch. Fires on first activate-page load,
    deduped per device via a `litsaber_activated` cookie/localStorage flag (same
    pattern as the promo popup's `COOKIE_SEEN`). Props: `activation_source`
    (`packaging_qr` | `direct`, derived from `utm_source` on the QR redirect),
    `is_first_activation` (boolean, from the dedupe flag).
    **Attribution limitation (be honest in reporting):** this counts "first
    activate-page visits, packaging-attributed, deduped per device." It is a
    directional proxy, NOT an airtight per-unit signal — it cannot tell genuine
    owner-activations apart from non-owners scanning the same box (festival
    friends, retail shoppers). Good enough to steer by; not precise. Order-linked
    activation (the order→activation gap diagnostic) is deferred — see footnote.

### Secondary funnels

**Promo sub-funnel (ADR-004) — measured as an isolated lever.
REVISED 2026-05-31: redemption architecture changed (in-cart field removed,
replaced by ?discount= checkout-URL auto-apply — see ADR-006), so the
redemption-side event was redefined and a dismissal event added.**

- `promo_popup_shown` — property: `trigger` (`time_delay` | `exit_intent`).
  The funnel DENOMINATOR. Not "always shown" — gated by usePromoPopup's triggers
  AND the 72h-dismiss / 365d-subscribe suppression cookies, so it's a real
  variable. Every per-shown rate depends on this.
- `promo_email_submitted` — property: `source`. Fires on successful popup submit
  (co-located with the toast + markSubscribed in onSuccess). **Source value
  corrected:** uses `WAITLIST_SOURCES.promoPopup` (the actual constant), NOT the
  earlier draft's guessed `floating-promo-$10` literal.
- `promo_popup_dismissed` — property: `method` (`close_button` | `backdrop` |
  `escape`). **(added 2026-05-31)** The loss state. Fires only on user-initiated
  close WITHOUT submit — explicitly NOT on the success-close path (a submit closes
  the popup too; firing dismissal there would double-count every conversion and
  break shown = submitted + dismissed). `method` separates active rejection
  (✕/backdrop/escape) from passive abandonment (derivable later as shown − submitted
  − dismissed; the non-event is not instrumented — not worth the complexity).
- `promo_code_captured` — property: `code`. **(added 2026-05-31, REPLACES
  `promo_code_applied`)** Fires when useDiscountCapture reads a `?discount=CODE`
  param on landing. Fires once per NEW capture, not on re-reading an existing
  stored value. Measures arrivals via the email link.
- **`promo_code_applied` — SUPERSEDED 2026-05-31.** Originally specced to fire from
  `cartDiscountCodesUpdate` success (the in-cart apply field). That field and that
  mutation path were removed this session (redemption moved to checkout-URL
  auto-apply per ADR-006), so the trigger no longer exists. Redemption is NOT lost
  from measurement — it's captured server-side at `purchase` (has_promo_code /
  discount_code / discount_amount, read off the Shopify order, step 9). The
  redemption MOMENT is no longer observable client-side (it happens inside Shopify
  hosted checkout); redemption FACT is measured at purchase.
- joins the primary funnel at `purchase` [...rest of the existing paragraph about
  has_promo_code / discount_amount unchanged...]

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

## Consequences

- The typed `lib/analytics/` module becomes the single write path for events,
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
