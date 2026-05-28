# ADR-004: Promo Code Architecture (Welcome Discount)

**Status:** Accepted (2026-05-28)
**Supersedes:** none
**Related:** Phase 4 (commerce), Phase 5 (instrumentation), ADR-002 (phasing)

## Context

The floating promo popup captures an email in exchange for a $10-off
first-order code. Delivering that promise end to end requires four things:
store the contact, send the code, enforce one-time use, and track redemption.
Two systems are already in the stack and each does half the job:

- **HubSpot** is already the signup path. The popup's `WaitlistForm` posts to
  HubSpot (portal `244547358`, source `floating-promo-$10`), and HubSpot
  already sends confirmation emails for the Gold and Future Drops flows.
- **Shopify** owns checkout and discount codes, and enforces redemption rules
  natively at the point of sale (Authorize.net behind hosted checkout).

Neither system does the whole job well. Shopify Email is built for campaigns
and order notifications, not "someone gave us an email, send them a code."
HubSpot can't enforce redemption at checkout. Forcing either to do both is
where this gets tangled.

## Decision

**Architecture A — one shared code, division of labor across both systems.**

- **HubSpot** stores the contact and sends the code. A workflow fires on popup
  submit and emails the code. No new backend.
- **Shopify** owns a single shared discount code (`WELCOME10` / `LITSABER`),
  configured **$10 off, one use per customer**. Shopify enforces redemption and
  records every order that used it, with the customer email attached.
- **Offer is locked at $10.** Popup copy, the `EmailSignup` strip, and the
  source tag all already say $10; the stray "$5 vs $10" note is resolved to $10.

**Two independent suppression layers (do not conflate):**

- *Popup not reappearing* = client-side cookie. `dismiss()` sets `COOKIE_SEEN`
  for 72h; `markSubscribed()` sets `COOKIE_SUBSCRIBED` for 365d.
- *Code not reusable* = server-side. Shopify "one use per customer," enforced
  at checkout, independent of cookies. A user who clears cookies may see the
  popup again but still cannot redeem the code twice.

**Frontend promo box (Figma `3770:1315`)** is wired via the Storefront
`cartDiscountCodesUpdate` mutation (apply / validate / confirm / remove). It is
the frontend half of this ADR and ships **as a bundled pre-launch unit with the
HubSpot+Shopify backend**, built on top of Phase 5 instrumentation so the
funnel (popup shown → submitted → emailed → applied → purchased) is measurable
from day one.

## Consequences

- Minimal infrastructure; uses two systems already in place.
- Redemption data is split across two dashboards at launch (HubSpot = who got
  the code; Shopify = who redeemed). Connect by matching on email. Automatable
  later via a Shopify `orders/create` webhook updating a HubSpot property — that
  webhook is the front half of Architecture B and the natural input for the
  Phase 6 reporting agent against the Supabase order mirror.
- The shared code is shareable; "one per customer" is evadable with a second
  email. Downside is bounded at $10 per evasion — acceptable for a launch promo.

## Alternatives rejected

- **Architecture B — unique per-contact codes** via Admin API generation +
  `orders/create` webhook back to HubSpot. True single-use, unshareable,
  per-contact redemption tracking. Deferred: real build (Admin API, webhook
  handler, n8n/endpoint wiring) to prevent a bounded $10 downside that may never
  appear. Revisit only on evidence of abuse or a hard need for per-contact data.
- **Shopify as the email system.** Rejected: splits contact data across two
  CRMs and isn't built for pre-purchase email capture.

## Open before build

- Figma `3770:1315` has Default / input / filled / success states but **no
  error state**. Design the invalid-code / already-used UI before building.
- Consider auto-apply via `checkout?discount=LITSABER` (or a pre-loaded link in
  the HubSpot email) so the email path requires no typing; the box then only
  serves codes received off-site.
