# ADR-006: Customer Data Architecture — HubSpot CRM + Three-Destination Order Flow

**Status:** Accepted (2026-05-31; documents verified, working behavior — not a forward plan)
**Related:** ADR-004 (promo architecture), ADR-005 (event taxonomy), Phase 5c (Supabase order mirror + webhook)

## Context

By the end of Phase 5, order data had two destinations (Supabase via the
`orders/create` webhook, PostHog via the same webhook's `purchase` event) and
contact data had one (HubSpot, via the `/api/subscribe` route that the popup and
waitlist forms submit through). The promo work (ADR-004) then raised a question
that forced a deliberate decision: where does the *customer* live, and which
system is the source of truth for what?

The goal Matt stated: a unified HubSpot customer record holding promo signup +
order activity under one contact, so customer service can later see a single
record per person rather than triaging across three systems.

The constraint: HubSpot **Starter** tier. The native Shopify–HubSpot integration
is available; deeper e-commerce automation (abandoned-cart workflows, full
revenue modeling) is largely Professional-tier, but the **contact + order sync**
needed for a unified service view is available on Starter.

## Decision

**Three destinations for order data, each a distinct lens, fed by two mechanisms.
Do not consolidate — they serve different jobs.**

| Destination | Mechanism | Job | Owner |
|---|---|---|---|
| **HubSpot** | native Shopify–HubSpot integration | Customer-facing CRM: unified contact (promo signup + orders), the record customer service reads | HubSpot (config, no code) |
| **Supabase** | `orders/create` webhook → `insertOrder` | Queryable order data for the Phase 6 production agent | Our code |
| **PostHog** | same webhook → server-side `purchase` event | Funnel analytics, completion-rate diagnostic, North Star | Our code |

**Contact creation happens at promo signup, not at order.** The popup
(`FloatingPromoPopup` → `WaitlistForm list="general"` → `/api/subscribe` →
HubSpot form) creates a contact the moment someone submits their email. This is
deliberate and load-bearing: the popup's entire purpose is lead capture for
people who have NOT yet bought. Delaying record creation until order would
discard every lead that didn't convert — i.e. the majority of the funnel, which
is exactly the population the metrics framework exists to measure — and would
break the code-delivery workflow (which triggers on the HubSpot form submission).

**Both customer sync and order sync are enabled** in the integration. Customer
sync creates/updates the email-keyed contact; order sync attaches the purchase
(as a deal/order object) to that contact.

**Email is the unifying key.** HubSpot dedupes contacts by email, so a popup
signup and a later order under the same email merge into one contact. Verified
end-to-end (see below).

**No custom redemption write-back is needed.** Earlier (ADR-004 discussion) we
scoped extending the webhook to write redemption status into HubSpot. The native
order sync makes this unnecessary: the synced order in HubSpot carries the
discount code natively, so HubSpot already knows the code was redeemed without
any custom code. Confirmed: a test order showed `GETLIT-WELCOME10` on the synced
order object in HubSpot.

## Verified behavior (the reason this ADR documents reality, not plan)

Tested end-to-end on 2026-05-31:
- Form submission → HubSpot workflow fired → automated code email delivered.
- Contact created in HubSpot on submission.
- `GETLIT-WELCOME10` applied at checkout, order placed under the same email.
- Order synced to the HubSpot contact (one contact, not two).
- The discount code is present on the synced order object in HubSpot.

So the unified customer record is real on Starter tier: one email-keyed contact
carrying promo signup + order + the discount code used.

## Consequences

- **Two write mechanisms touch order events** (the native integration → HubSpot,
  and our webhook → Supabase + PostHog). This is intentional, not redundant —
  different systems, different jobs. Documented here so future work does NOT add
  a third sync path or assume one mechanism feeds all three.
- **The webhook stays as-is** — Supabase + PostHog only. It does NOT write to
  HubSpot (the integration handles HubSpot). No new code resulted from this
  decision; it is configuration plus this record.
- **Duplicate contacts are a reconciliation problem, not a prevention problem.**
  A customer who uses a different email at popup vs. checkout produces two
  contacts. This is inherent to letting people use any email and cannot be
  designed away without gutting lead capture. Mitigations: HubSpot's email
  dedupe handles same-email cases automatically; the code-delivery email
  naturally incentivizes checking out with the same address (you need that inbox
  to get the code); residual genuinely-different-email cases are a small manual
  merge for customer service — which is what the unified CRM is for. Accepted as
  a low-frequency, low-harm tail.
- **Discount stacking is configured ON.** `GETLIT-WELCOME10` combines with the
  automatic tier/quantity discounts (Phase 4c), so a discounted multi-pack also
  takes the $10 off (a verified test showed `$29.99` off on a multi-unit cart).
  This is a deliberate combinations setting in Shopify (both the code and the
  automatic discount must permit combining). Margin still holds (~67% gross even
  at the deepest tier before the extra $10). Revisit only if first-order +
  bulk stacking proves too generous in practice.

## The cart-attribute pipe (the off-domain data-passing pattern) — added 2026-06-17

A recurring problem: data known in the browser (on our domain) needs to reach the
server-side `purchase` event and the Supabase order row, but the purchase is
captured from the `orders/create` webhook — a serverless function with no browser,
no session, no device. The solution, now used for THREE values, is one pattern:
**write the value as a Shopify cart attribute at `cartCreate`; Shopify carries it
to the order's `note_attributes`; the webhook reads it back.**

| Attribute | Written at cartCreate from | Read by webhook into | Purpose |
|---|---|---|---|
| `posthog_distinct_id` | `posthog.get_distinct_id()` | PostHog `purchase` distinctId + Supabase `distinct_id` | Identity stitch (5c-2b) — joins the purchase to the on-site session |
| `discount_code` | `sessionStorage.litsaber_discount` | Supabase `discount_code` / promo attribution | Promo `?discount=` redemption (ADR-004) |
| `device_type` | `posthog.get_property('$device_type')` | PostHog `purchase` property + Supabase `device_type` column | "What device do actual BUYERS use" — answerable only on `purchase`, not `checkout_started` (intent ≠ sale) |

**`device_type` specifics (added 2026-06-17).** The server-side `purchase` event
carries no device because the webhook has no browser (confirmed: a `purchase`
event's metadata showed `library: posthog-node`, distinct_id present, zero
`$device_*` autocapture props). PostHog computes `$device_type` client-side, so we
read it at `cartCreate` and thread it through. Lands on both the PostHog `purchase`
event AND a nullable `device_type` column on the `orders` table (migration `003`)
— the column because the Phase 6 agent queries `orders` directly and shouldn't have
to cross-reference PostHog session data (same reasoning as `customer_name` getting a
column rather than living in `raw` JSON). Migration runs before the code deploys
(the `customer_name` ordering rule).

**Why NOT a Shopify web pixel** (PostHog's documented Shopify-conversion approach):
we already have a working server-side `purchase` event and an identity stitch. A
web-pixel `checkout_completed` capture would create a SECOND purchase event (double
count) and identifies by email — a different identity model that would fragment the
`posthog_distinct_id` stitch. The pixel is the right tool for a non-headless store
with no other purchase tracking; we are not that. Rejected.

**Why NOT `checkout_started` broken down by device** (the tempting zero-code
answer): `checkout_started` proves intent, not purchase. "Device of actual buyers"
must come off `purchase`. Intent ≠ sale.

**Shared limitation of the whole pipe (all three attributes):** values are only
written at `cartCreate`. A returning visitor with a persisted `cartId` adds via
`cartLinesAdd`, skipping `cartCreate`, so none of the three attributes get written
on that visit — the purchase falls back (`order_<id>` distinctId / no discount /
`device_type: unknown`). First-time buyers (the bulk) get all three. Capture rate
is also slightly under 100% even for first-timers if PostHog hasn't computed the
value by `cartCreate` (the init-race theme) — the truthy-guard skips it and the
webhook falls back. Acceptable; measured via the existing console.warn on the
distinct_id miss. Hardening (write the attributes on the `cartLinesAdd` path too,
via `cartAttributesUpdate`) deferred until the miss rate proves it's worth it.

**`device_type` is "device at add-to-cart," not "device at payment."** Edge case:
add on mobile, complete checkout later on desktop (cart persisted) → recorded as
mobile. Rare, and "where buying intent formed" is a defensible (arguably better)
definition — but report it as such, not as literal payment device.



- **Delay HubSpot contact creation until order placed** (to avoid duplicate
  contacts). Rejected: discards all non-converting leads, breaks the
  code-delivery workflow, and doesn't even solve the different-email case (you'd
  just lose the popup email instead of reconciling it). Trades the main goal for
  an edge case.
- **Custom webhook → HubSpot redemption write-back.** Rejected as unnecessary —
  the native order sync surfaces the discount code in HubSpot for free.
- **Supabase as the sole customer record** (no HubSpot CRM). Rejected: Supabase
  is the agent's data surface, not a customer-service UI. A human handling
  support needs the HubSpot contact view.
- **HubSpot as the order system of record** (drop the Supabase mirror). Rejected:
  the Phase 6 agent needs clean SQL it can query directly; Starter-tier HubSpot
  is not that surface, and the webhook→Supabase path is already built and working.

## Open / follow-ups

- Confirm the discount-stacking behavior (the `$29.99`-off multi-pack) is the
  intended business choice, not just the path of least resistance. (Flagged to
  Matt; assumed intended.)
- The `?discount=` auto-apply on the website (the email's "AUTO-APPLIED" promise)
  is a separate small build, tracked next.
- Verify periodically that the integration's contact dedup is merging same-email
  signups + orders into one contact as expected (it did in the test; worth a
  spot-check as real volume arrives).
