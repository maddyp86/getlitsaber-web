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

## Alternatives rejected

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
