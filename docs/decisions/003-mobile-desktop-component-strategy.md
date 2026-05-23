# ADR-003: Mobile/Desktop component strategy

**Status:** Accepted
**Date:** 2026-05-22
**Decider:** Matt Hall

## Context

The Litsaber Figma designs include separate mobile and desktop frames for the homepage (desktop `3216:33`, mobile `3760:5314`) and other pages. Reviewing the full homepage end-to-end, the two layouts diverge in ways that range from simple reflow (column-count changes) to genuine structural differences (content regrouping, different element ordering, different DOM).

The clearest example is the hero: on desktop the headline is "HIGHLIGHT THE" (white) + "NIGHT" (cyan); on mobile it regroups to "HIGHLIGHT" (white) + "THE NIGHT" (cyan). The cyan span contains different words at each breakpoint. The CTA treatments differ (desktop outline vs mobile filled), and the device render is placed and sized differently. This is not the same DOM reflowing — the content grouping itself changes.

The question this ADR answers: **do we build one responsive component per section (Tailwind breakpoints reflow a single DOM), or split into separate mobile and desktop components?**

## The decision

**Per-section decision based on a structural-divergence test — not a blanket rule in either direction.**

The deciding question for each section is NOT "do mobile and desktop look different" (almost every responsive design does). It is: **can the same DOM structure produce both layouts with CSS alone, or must the structure itself change?**

- **Responsive (single component)** when the same elements reflow — restack, resize, change column count, hide/show, change flex direction. The order and grouping of elements stays the same. This is the DEFAULT and covers most sections.
- **Split (separate `*.desktop.tsx` / `*.mobile.tsx`)** when the DOM structure or content grouping genuinely changes — content is grouped differently, elements appear in a different order, or one layout needs DOM the other doesn't.

### Rules that apply to ALL sections, split or not

1. **Content and data live in ONE place.** Copy, prices, CTA labels/hrefs, spec lists, etc. are defined once (shared constants or props) and consumed by whichever layout renders. Splitting duplicates *arrangement*, never *content*.
2. **Primitives are shared.** `Button`, `SpecPill`, `ResponsiveImage`, `Reveal`, etc. are used by both layouts. No duplicated primitives.
3. **CSS toggle, never JS, for split rendering.** Render both and toggle with Tailwind (`hidden lg:block` / `lg:hidden`). No `useMediaQuery`-based conditional rendering — it risks hydration mismatch, first-paint flash, and breaks SSR/SEO, which matter for a storefront.
4. **Breakpoint is `lg` (1024px)** from tokens.json, consistent with the rest of the site.

### Per-section decision checklist

For each section, split ONLY if one or more is true:
- [ ] Content is grouped differently between breakpoints (e.g. which words are in a colored span)
- [ ] Elements appear in a different visual/DOM order
- [ ] One breakpoint needs elements or structure the other doesn't
- [ ] The responsive version would require a tangle of `hidden`/`block` toggles that's harder to read than two clean components

If none are true → responsive single component (default).

## Sections assessed (initial)

| Section | Divergence | Decision |
|---------|-----------|----------|
| Hero | Content regrouping (cyan span), CTA treatment, device placement | **SPLIT** (built) |
| Be Seen Across The Crowd (scrollytelling) | Different dimensions, type scale (75/22/16px → 45/18/14px), gradient direction (left→dark vs bottom→top), separate image assets per breakpoint. Both share the scroll-pin interaction. | **SPLIT** (building) |
| Ten Ways To Be Seen | Reflow (text + strip + device rearrange) | Responsive (revisit if messy) |
| Three Modes / Pick Your Energy | Two-column side-by-side (desktop) vs fully stacked single-column (mobile); type scales differ (75px → 45px headline); card dimensions differ; shared interaction model (mode/toggle state). | **SPLIT** (building) |
| Engineered To Stand Out | Reflow (3×2 grid → 1 column, feature reorder) | Responsive — watch the feature-order difference; split if order genuinely changes |
| Spec grid | Column count only | Responsive |
| Where It Lives | Row → carousel | Responsive (+ minor JS for carousel) |
| Homepage Buy Section | Two-column → stacked | Responsive |
| FAQ | 3×2 → 1 column | Responsive |

Confirmed splits so far: the Hero, the Be Seen scrollytelling section, and the Three Modes interactive section. Note that Be Seen and Three Modes refine the criterion — both share the SAME interaction model across breakpoints (scroll-pin advance, mode/toggle state respectively), so the split is driven purely by divergent layout/type/assets, not by different interaction. Both are legitimate split triggers. The criterion is: **can the same DOM produce both, or must the structure change?** If structure must change, split.

**Per-breakpoint type scales live in the component, not tokens.json.** When a split section uses different font sizes per breakpoint (e.g. Be Seen's 75px desktop headline → 45px mobile), those are section-specific responsive values applied in the component, not new global tokens. tokens.json holds the shared scale; the component picks which step applies at which breakpoint.

## Consequences

**Positive**
- Clean, purpose-built layouts where designs genuinely diverge (the hero), without the maintenance cost of splitting sections that are just reflow.
- Shared content/primitives keep the duplication tax limited to *arrangement*, not *content* — a copy change is still one edit.
- CSS-toggle keeps SSR/SEO intact and avoids hydration flash.
- A documented criterion prevents two failure modes: reflexively splitting everything (doubles maintenance surface across ~12 homepage sections + 7 pages), and stubbornly forcing one component to express two structurally different designs.

**Negative**
- Split sections duplicate layout markup — every layout (not content) change happens twice for those sections. The hero is the first; kept deliberately small.
- Per-section judgment calls add a small decision cost during the build (mitigated by the checklist).
- Two render paths per split section to test.

**Risk being managed**
- Duplication is where drift lives — and drift from two-sources-of-truth has bitten this project repeatedly (image wipe, merge conflicts). Sharing content/primitives and limiting splits to genuine structural divergence keeps the duplicated surface as small as possible.

## Implementation pattern (split sections)

```
components/home/
├── Hero.tsx            # wrapper: renders both, CSS-toggles
├── HeroDesktop.tsx     # desktop layout
├── HeroMobile.tsx      # mobile layout
└── hero.content.ts     # shared content constants (headline words, CTAs, pills, price)
```

Wrapper:
```tsx
export default function Hero() {
  return (
    <>
      <HeroDesktop className="hidden lg:block" />
      <HeroMobile className="lg:hidden" />
    </>
  );
}
```

Both import from `hero.content.ts` and shared primitives. Each applies flow-based layout internally (no magic pixel offsets, token spacing) — each is simpler than the old single component because it targets one breakpoint.

## Alternatives considered

- **One responsive component for everything.** Rejected for the hero specifically — the content regrouping can't be expressed cleanly in one DOM without conditional word-grouping hacks. Retained as the default for non-diverging sections.
- **Split every section (mobile/desktop for all).** Rejected — doubles the maintenance surface of the entire site for sections that are just reflow, and multiplies drift risk. The cost isn't justified where CSS handles the difference.
- **JS-based conditional rendering (`useMediaQuery`).** Rejected — hydration mismatch, first-paint flash, weak SSR. Wrong for an SEO-driven storefront.
