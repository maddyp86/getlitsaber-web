# ADR-008: Reviews provider: Judge.me (reverses ReviewInfra)

**Status:** Accepted
**Date:** 2026-06-21
**Decider:** Matt Hall
**Related:** ADR-001 (tool stack), ADR-002 (scope expansion, surfaced the reviews-provider decision)
**Supersedes:** the interim ReviewInfra direction recorded in CLAUDE.md, and the reviews-provider line in ADR-002

## Context

ADR-002 surfaced "Reviews provider" as a pre-Phase-2 decision (candidates: Yotpo, Stamped, Judge.me, Okendo, build-own) and said the reviews subsystem would get its own ADR once a provider was chosen. That ADR was never written. The choice instead landed informally in CLAUDE.md as **ReviewInfra**, a small script-tag widget product, and it carried unresolved risk:

1. **Order sync was custom work.** ReviewInfra required passing orders from our headless storefront to its Orders API to trigger review-request emails.
2. **The read API was unconfirmed.** Path B (render our own Figma-spec UI against a data API) depended on an API we had not verified existed. It was logged as a maybe, with an open action item to email ReviewInfra.
3. **AI Summary was unsupported.** ReviewInfra advertised no AI summary feature, leaving the `<AISummaryCard />` component as a separate problem.

The storefront runs on Shopify. A Shopify-native reviews app removes the order-sync integration entirely, because the provider reads orders from Shopify directly. That, plus a documented read API, resolves the two largest ReviewInfra unknowns at once.

## Decision

**Judge.me is the reviews provider, replacing ReviewInfra.**

- **Shopify-native.** Judge.me installs as a Shopify app. Order sync and review-request emails are handled by Judge.me with no custom Orders API to build.
- **Path A (default).** Embed Judge.me's review widget on the PDP as-is. Fastest to ship.
- **Path B (stretch).** Render our own Figma-spec PDP UI against Judge.me's documented REST API. Unlike ReviewInfra, the read API exists and is documented, so Path B is a real option, not a vendor-confirmation gate.
- **AI Summary unchanged.** The `<AISummaryCard />` stays a separate, custom feature. The choice between (a) a custom Claude API endpoint that synthesizes reviews server-side and caches, and (b) shipping without it in v1, is not decided by this ADR.
- **Build sequencing unchanged.** Phase 2 scaffolds the reviews section against mock reviews JSON matching the Figma spec; Phase 4 wires Judge.me, Path A by default.

## Consequences

**Positive**
- Order sync and review-request emails come with the Shopify-native install. The custom Orders API wiring ReviewInfra needed is gone.
- The read API is documented, so the brand-matched PDP UI (Path B) is viable without a confirmation gate. The "email the vendor to confirm a read API exists" action item is closed.
- Judge.me is a mature, widely deployed Shopify reviews app. Lower integration risk than a small single-vendor script-tag product.

**Negative**
- Path A still renders Judge.me's widget design, not the full Figma reviews spec. Matching the spec means committing to Path B and its build cost.
- One more Shopify app in the stack, with its own pricing tier to track as review volume grows.

**Neutral**
- The component layer does not change. The PDP reviews subsystem was scaffolded against mock JSON per ADR-002 sequencing, so swapping the provider is a Phase 4 wiring change, not a re-scaffold.
- AI Summary remains out of scope here and unresolved.

## Alternatives considered

- **Stay on ReviewInfra.** Leaves the read API unconfirmed, keeps the custom Orders API wiring, and carries the risk of a small single-vendor script-tag product. The open action items never closed.
- **Yotpo / Okendo.** Full-featured and well-supported, but heavier and more expensive than the launch review volume justifies. More surface than a single-SKU storefront needs at launch.
- **Build our own reviews backend.** Maximum brand control, but it puts moderation, spam handling, email scheduling, and storage on us. Out of proportion to a single-SKU launch.

## Story beats banked from this ADR

- *"The reviews provider was picked informally in CLAUDE.md (ReviewInfra) and never got the dedicated ADR that ADR-002 said it should. The choice carried two open questions for weeks: does a read API exist, and how does order sync work. Going Shopify-native with Judge.me closed both at once, and finally wrote the ADR that ADR-002 had asked for."*
- *"Reversing a tool choice is cheap when the seam holds. The PDP reviews UI was built against mock JSON, so switching ReviewInfra to Judge.me is a Phase 4 wiring change, not a rebuild. The discipline of scaffolding against a mock paid for itself the moment the provider changed."*
