# ADR-002: Scope expansion from homepage to 8-page site

**Status:** Accepted
**Date:** 2026-05-19
**Decider:** Matt Hall
**Superseded in part:** The reviews-provider decision surfaced here is now resolved and governed by ADR-008 (Judge.me). The interim ReviewInfra direction recorded in CLAUDE.md is reversed.

## Context

Phase 1 was scoped against a single Figma homepage frame. As design context flowed in from Figma during the Phase 1 → Phase 2 handoff, the scope of the site became visible:

- 8 pages, not 1 (Homepage, PDP, Engineering, Wholesale, About, Activate, Contact, Policies)
- 2 compliance/marketing modals (Age Gate, Floating Promo Popup)
- A full cart system (drawer + dedicated /cart page + 4-variant promo code field + line items + secure checkout chrome)
- A complete reviews subsystem on PDP (rating summary, distribution chart, AI summary, photo carousel, search, filter chips, paginated review cards) — ~9 sub-components
- A post-purchase onboarding page (Activate) with sticky chip nav and 8 functional sections — unusual depth for DTC
- 5 policy sub-pages

Total component inventory grew from the ~14 originally specced to approximately 78 across the system.

The original Phase 2 timeline (5–7 days for Bolt scaffold) was sized for a marketing site. It does not fit the actual scope.

## Decision

**Three concrete adjustments:**

### 1. Timeline reset

Phase 2 (Bolt scaffold) extends from 5–7 days to **10–14 days**. This is the time to scaffold the visual layer of all 8 pages plus modals plus cart UI. Shopify integration, reviews provider integration, and the production agent remain in their respective downstream phases — they do not shift.

Total project timeline moves from ~5 weeks to **~6–7 weeks**.

### 2. Phase 2 sequencing

Build order, prioritized by visual confidence and dependency:

1. **Foundation** — Layout shell, Navbar, Footer, mobile drawer, age gate modal (compliance-critical)
2. **Homepage** — All 11 narrative sections in scroll order
3. **PDP** — Product info, styles/bundles, mock data only. Reviews subsystem scaffolded with seed data; no provider yet.
4. **Cart** — Drawer + page + line items + promo code. Mock cart state (real Shopify integration in Phase 4).
5. **Wholesale + About** — Lower-risk pages, similar pattern to Homepage
6. **Engineering + Activate** — Higher complexity (kinetic animation, sticky chip nav); save for later in Phase 2
7. **Contact + Policies** — Templated, fastest to ship

### 3. Pre-Phase-2 decisions to surface

These shape Bolt prompts and cannot be deferred to Phase 3:

- **Reviews provider:** Yotpo / Stamped / Judge.me / Okendo / build-own (resolved as Judge.me; see ADR-008)
- **AI Summary source:** manual / LLM-generated / provider feature
- **Bundle SKU strategy:** separate Shopify product or quantity-based discount
- **PDP long-form copy:** rewrite to BRAND.md voice or keep current placeholder
- **Age gate behavior:** first-visit-only, cookie duration, hard wall vs soft

Other decisions (promo popup trigger logic, exact ADR for the Engineering kinetic animation system, etc.) can wait for Phase 5 or be tuned post-launch.

## Consequences

**Positive**
- Realistic timeline. Avoids the "Phase 2 took twice as long" pattern that erodes credibility on internal status updates and external narrative.
- Build order is now dependency-aware. Foundation → Homepage → PDP → Cart minimizes rework.
- The pre-Phase-2 decisions list forces strategic clarity before Bolt sees a single prompt — preserves the Phase 1 discipline.

**Negative**
- Three extra weeks before launch. Real cost.
- More components means more surface area for drift between Bolt's output and the Figma spec. Phase 3 audit by Claude Code becomes more important, not less.
- The reviews subsystem in particular is high-complexity and may benefit from its own ADR (ADR-003) once the provider is chosen.

**Neutral**
- The scope expansion reflects what the design team actually built, not what we asked for. Re-scoping is normal in real product work.
- The Activate page is unusually thorough — most DTC brands skip post-purchase onboarding entirely. This is a competitive advantage, but also adds Phase 2 work that wasn't in the original plan.

## Story beats banked from this ADR

- *"Scope expanded 5x between Phase 1 spec and Phase 2 kickoff. I didn't push back on the scope. I re-scoped the timeline and the build order — and wrote the ADR explaining why before I touched the next prompt. Re-planning is a senior PM signal; pretending the plan still fits isn't."*
- *"The Activate page surfaced as the secret weapon — post-purchase onboarding most DTC brands skip. It's the lifecycle move that reduces support tickets and reinforces the engineering thesis. We're shipping it in Phase 2, not deferring to v2."*

## Alternatives considered

- **Ship homepage + PDP first, defer the rest to v2.** Faster to launch, but the policy pages, contact page, and wholesale page are needed for compliance and B2B pipeline. Cutting them risks launching without a credible site.
- **Scaffold all pages in parallel.** Faster on paper, but Bolt's quality degrades when asked to generate too much at once. Sequential page-by-page with review between is the right discipline.
- **Skip Bolt, go straight to Claude Code.** Loses the visual-fidelity speed advantage Bolt provides on a Figma-to-Next.js handoff. Would extend Phase 2 further, not shorten it.
