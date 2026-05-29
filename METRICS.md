# Litsaber — Metrics, North Star & KPI Framework

The measurement spine for getlitsaber.com. Defines what we steer by, what each
metric means, the baselines we are improving against, and how every product
initiative ladders up to the North Star. Paired with ADR-005 (event taxonomy);
this doc owns the *strategy*, ADR-005 owns the *event implementation*.

Status: locked 2026-05-28. Baselines are from the 60-day Meta/Instagram +
old-site (WordPress/Avada) performance report. They are the BEFORE picture; the
rebuild is the intervention.

---

## TL;DR

- **North Star Metric (NSM):** Weekly **Activated Litsabers** — a device received
  and powered on for the first time (Activate-page QR scan / first activation
  session). Leading indicator of the referral/repeat loop that actually grows the
  business. **Live at launch** (the Activate page is launch-blocking).
- **Why activation, not orders:** activation is a strict subset of orders (nobody
  activates without ordering) PLUS confirmation that value actually landed. It
  sits one step further upstream of repeat revenue and word-of-mouth — the
  leading-indicator property. Orders is lagging and value-blind; it stays as the
  input KPI directly beneath the NSM.
- **Acting primary metric until order volume is meaningful:** intent→purchase
  **completion rate** — the one broken funnel transition (see baselines).
- **Guardrail:** AOV / contribution margin — so no initiative "wins" a KPI by
  discounting into the floor.

---

## The diagnosis driving this framework

Old-site funnel: 689 visitors → 127 buy-clicks (18%) → 33 emails (4.7%) →
1 purchase (0.14%). The collapse is concentrated in ONE transition:

- Visitor → buy-click: **18%** (healthy intent)
- Buy-click → purchase: **~0.8%** (1 of 127) — the disease

A 0.8% intent→purchase completion is one to two orders of magnitude below a
normal store. That is the signature of a MECHANICAL failure (a buy button that
didn't reach a working cart, a checkout that errored, or a payment processor
rejecting the category) — not "soft motivation." Leading hypothesis (unconfirmed
from the report, testable now): the old checkout could not process vape-category
payments. Stripe is prohibited for this category; the rebuild routes through
Shopify hosted checkout → Authorize.net, which may itself be the single largest
conversion fix, independent of any messaging change.

Strategic consequence: the report's recommendations (urgency, retargeting, ad
creative) all optimize the TOP of a funnel whose leak is at the BOTTOM. Traffic
is already cheap and abundant ($0.02–0.07 CPC, 10–13% CTR). Pouring more
qualified traffic into a funnel that converts intent at 0.8% is filling a bucket
with a hole in it. The highest-leverage work is the bottom transition — which the
rebuild may already fix. **Phase 5 instrumentation's #1 job is to prove or
disprove that, which is why purchase measurement (the orders/create webhook) is
promoted into Phase 5 rather than deferred.**

Measurement caveat that justifies the rebuild's clean instrumentation: the
report's own numbers are internally inconsistent (127 vs 152 vs 30 buy-clicks
across views; sessions vs users mixed). We are rebuilding the measurement, not
just the site.

---

## North Star Metric

**Weekly Activated Litsabers.**

- **Definition:** a unique device powered on / activated for the first time,
  captured via the Activate-page QR-scan flow (scanned from the box) and/or the
  first activation session. One activation per device.
- **Why it is the right NSM:**
  - *Customer value:* an activation means a real person is holding a working,
    powered-on device they were excited enough to set up — the Aha moment. The
    brand thesis is "the vape battery people ask about… customers pull it out to
    show people." Activation is the first moment that loop can fire.
  - *Product strategy:* it encodes the social-signaling thesis, not just the
    transaction.
  - *Leading, not lagging:* it sits upstream of repeat purchase, referral, and
    revenue. Orders/revenue/ARPU are lagging — they report the past. Activation
    predicts the future loop.
  - *Subset relationship:* activation ⊆ orders. It captures everything orders
    captures (the money) and more (value delivered). Watching the gap between
    orders and activations is itself a diagnostic (DOA units, confusing
    onboarding, returns) that orders alone would hide.
- **Instrumentation status:** LIVE AT LAUNCH. The Activate page is now on the
  launch-blocking path (Phase 7 dependency) — the NSM cannot be measured without
  it, and we have decided not to launch without it.
- **Honest early-stage note:** pre-traffic, activation reads near-zero because
  orders are near-zero (you cannot activate a device nobody has received). It is
  instrumented and correct from launch, but only becomes a meaningful *steering*
  signal once order volume gives it numbers. Until then we steer by the input
  KPIs — above all completion rate. NSM = destination; input KPIs = near-term
  controls. Not a contradiction; the normal early-stage sequence.

---

## Input KPI tree

Each rung is a conversion between funnel stages. The chain multiplies up to
orders, and orders convert to activations (the NSM). Baselines from the old-site
report where they map; gaps marked because the old site couldn't measure cleanly.

| # | Input KPI | Definition | Old-site baseline | Measured by |
|---|---|---|---|---|
| 1 | Qualified visitors | Sessions from target geo/channel, past age gate | 836 sessions / 689 users; 82% US | `age_gate_confirmed` + session props (utm, geo) |
| 2 | Homepage engagement rate | Sessions that engage past the hero vs bounce | ~55% (inverse of 45.4% exit; 16s on page) | `homepage_engaged` |
| 3 | Product-view rate | Engaged → reached PDP / buy section | product pages 1m10s (strong study time) | `product_viewed` |
| 4 | Add-to-cart rate | Product view → add to cart | ~18% (buy-click proxy) | `cart_add_to_cart` (+ `buy_now_clicked`) |
| 5 | Checkout-initiation rate | Add to cart → checkout started | unmeasured (old "buy click" conflated) | `checkout_started` |
| 6 | **Purchase-completion rate** | **Checkout started → completed order** | **~0.8% ⚠ THE disease** | `purchase` (orders/create webhook) |
| 7 | Order → activation rate | Completed order → device activated (the NSM step) | n/a (1 order) | `device_activated` (Activate page) |
| — | Email-capture rate (recovery lever) | Visitors → email submitted | 4.7% | `promo_email_submitted` / `waitlist_submitted` |
| — | AOV / units per order (value lever + guardrail) | $ per order; bundle uptake; margin | n/a (1 order) | order financials + `product_quantity_selected` |

Read top to bottom: rungs 1–4 were healthy on the old site; rung 6 was
catastrophic; rung 7 (the NSM step) couldn't exist yet. Phase 5 must measure
rung 6 above all, and rung 7 from launch.

---

## First-order promo code as a measured lever

The $10 first-order code (ADR-004) is not just a funnel event — it is an
*intervention whose effect we isolate*. It is a direct lever on rung 5→6
(checkout completion) and therefore on orders and the NSM. Measured at four
points so we can compare orders WITH the code vs WITHOUT, and answer the margin
question: is the code lifting completion, or discounting buyers who'd have
converted anyway?

| Stage | Event / property | Tells us |
|---|---|---|
| Offered | `promo_popup_shown` (prop: `trigger`) | denominator — how many saw the lever |
| Captured | `promo_email_submitted` (prop: `source`) | email-capture rate (4.7% baseline) |
| Applied | `promo_code_applied` (via `cartDiscountCodesUpdate`; prop: `code`) | how many carried the code into checkout |
| Converted w/ code | order props: `has_promo_code`, `discount_code`, `discount_amount` | completion lift with code vs without; total margin given up |

`discount_amount` is captured per order even though the launch offer is a flat
$10 — future-proofs for variable or stacked promos and avoids re-instrumenting.
Cost of capturing now ≈ zero.

In the initiative map the promo files under **checkout-completion rate** (it is a
conversion lever, not just an email tactic), with a secondary tie to email
capture. The orders/create webhook — promoted into Phase 5 — is where
`has_promo_code` / `discount_amount` get read off the Shopify order, so
promo-attributed completion is a real comparable number, not a guess. Promo
attribution and purchase measurement are the same build.

---

## Product initiatives → input KPIs → North Star

Single SKU keeps this clean: every initiative files under the ONE input KPI it
moves, no cross-product confounding. Always answerable: "which input metric does
this move, and how does that ladder to the NSM?"

| Input KPI (lever) | Friction it attacks | Product initiative |
|---|---|---|
| Homepage engagement rate | 16s, 45.4% exit — homepage doesn't say what it is | The repositioning homepage (lead with the moment, not specs) |
| Product-view rate | get engaged visitors to the buy section | Editions/PDP routing, clearer CTAs |
| Add-to-cart rate | value/trust gap on a product people *do* study (1m10s) | Reviews subsystem, trust badges, bundle/urgency framing |
| **Checkout-completion rate** ⚠ | **the 0.8% chasm — likely mechanical** | **Authorize.net hosted checkout (the rebuild itself); first-order promo auto-apply** |
| Email-capture rate | 33 captured, never leveraged | ADR-004 promo + HubSpot follow-up sequence |
| **Order → activation rate** | does the buyer become an owner who shows it off | **Activate page (the NSM measurement surface) — launch-blocking** |

The ladder: initiatives move input KPIs → completion rate unblocks orders →
orders convert to activations → activation is the NSM and the leading signal of
the referral loop.

---

## Guardrail metric

**AOV / contribution margin.** No initiative counts as a win if it moves its KPI
by eroding margin. Double duty: it is also how we check the first-order promo is
lifting incremental completion rather than just discounting buyers who'd have
converted anyway. Channel separation and the $59.99 floor are protected — the
$40/unit deepest bundle tier still sits well above wholesale Tier 1 ($24/unit),
and ~67% gross margin holds at $13.33 landed cost even at the deepest tier.

---

## Old-site baselines (the BEFORE picture — lock these)

From the 60-day report. These are what the rebuild is measured against.

- Visitors / sessions / pageviews: 689 users / 836 sessions / 3,065 pageviews
- Visitor → buy-click: 18% (127)
- Email capture: 4.7% (33)
- Buy-click → purchase: ~0.8% (1 of 127)
- Overall conversion: 0.14% (1 of 689)
- Homepage: 16s avg time on page, 45.4% exit, 17.5% bounce
- Product pages (/product/*): 1m10s avg, 41.2% bounce, 38.9% exit
- Star Wars page (/star-wars): 8s, 84.6% bounce, 95.6% exit — DEAD; pause ad
  traffic immediately, kill or rebuild as Collector's Edition waitlist
- Geography: ~82% US (~575 of ~700 users); long international tail (DE, IN, SE,
  NL, CA, FR, PL, AT)
- Channels: Direct 43.7% (365), Paid/Managed Social 35.3% (295), Unknown 9% (75),
  Other Referral 6.5% (54), Organic Social 2.4% (20), Email 1.7% (14).
  NOTE: the 43.7% "Direct" is almost certainly UTM-stripped paid social (Meta
  in-app browser strips referrer) — real paid contribution is higher than the
  credited 35.3%, and the organic base is smaller than it looks. Enforce UTM
  discipline; capture acquisition context as session properties.

---

## What "good" looks like (targets to validate, not assert)

Deliberately rough — these are hypotheses to test against real traffic, not
commitments. The first and most important target is mechanical:

- **Purchase-completion rate (rung 6):** from ~0.8% to a normal range (low double
  digits). This single rung, at constant traffic, is a 10–40x order multiplier.
  Confirming the working checkout fixes it is the first thing to verify post-launch.
- **Homepage engagement (rung 2):** reduce the 45.4% exit / lift the 16s dwell —
  the repositioning homepage is the experiment.
- All other targets set after the first weeks of clean baseline data. We measure,
  then target — not the reverse.

---

## Open / dependencies

- Activate-page build is launch-blocking (NSM dependency). Tracked into Phase 7.
- orders/create webhook promoted into Phase 5 (feeds purchase event, promo
  attribution, and the Phase 6 Supabase order mirror — build once, use three
  times). See ADR-005.
- Event implementation for every metric above is specified in ADR-005.
