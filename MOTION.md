# Litsaber Motion & Interaction System

The reference for how the site *feels* — scroll animations, hover behaviors, transitions, atmospheric layers. This sits alongside `BRAND.md` (voice), `COMPONENTS.md` (structure), and `tokens.json` (color/type). When building any animated surface, this is the source of truth.

**Implementation note:** This documents the motion *system as designed*. The original animations lived in a standalone Vite prototype. In our Next.js stack, re-implement using **Framer Motion** (already a dependency pattern in the prototype) or CSS where simpler. The *values and principles* transfer; the *implementation* is rewritten. Match the spec, don't copy old code.

**Palette note:** This doc has been reconciled to the v0.3.0 hybrid palette in `tokens.json`. The original motion doc referenced a stale pink (`#FF1F7A`) — corrected to the CTA pink `#EC5793`. All color references below use the current token names.

---

## Part 1 — Motion Philosophy

1. **Motion serves orientation, not decoration.** Animation tells the buyer where they are, what changed, what's interactive. Motion that doesn't communicate gets cut. Atmospheric, not busy.

2. **The brand moves like its product.** Litsaber is a light that responds to breath — it builds, glows, pulses, settles. The site echoes this: things fade up and settle (no bounce/spin), accents pulse and glow (no blink), transitions ease out slowly (no snap). The reference feeling is *a light responding*, not *a UI reacting*.

3. **Cinematic moments, kinetic flow.** Most of the site is in subtle constant motion (reveals, parallax, hovers). A few moments are deliberately cinematic and stop you (hero, the breath-to-light section on engineering, the prototype timeline). Rhythm: flow, flow, flow, *pause for impact*, flow.

4. **Restraint scales with function.** Brand surfaces (homepage, engineering, about) get the full motion vocabulary. Transactional surfaces (cart, checkout, policies) get minimal motion — the closer to the money, the calmer the page.

5. **Respect the user's system.** Every animation honors `prefers-reduced-motion`. Reveals become instant, parallax stops, the progress bar hides, pulses freeze. The site works fully without motion — motion is enhancement, never load-bearing. **This is non-negotiable: accessibility requirement, and in some jurisdictions a legal one.**

---

## Part 2 — Scroll Animations

### Scroll progress bar
- 2px height, fixed to top of viewport
- Uses the `gradient-cta` token (purple → pink), left to right
- Width tracks scroll position 0–100%
- Pink/purple glow shadow beneath
- Hidden entirely under `prefers-reduced-motion`
- Present on every page — the most consistent motion element on the site

### Reveal-on-scroll (the core system)
The site's primary motion. Content fades up into place as the buyer scrolls.

| Property | Value |
|---|---|
| Start state | `opacity: 0`, `translateY(28–36px)` |
| End state | `opacity: 1`, `translateY(0)` |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (the signature curve) |
| Duration | 700–900ms |
| Trigger | IntersectionObserver at ~12–15% into viewport, -40 to -60px bottom margin |
| Repeat | One-shot. Observer stops after reveal. No re-animation on scroll-up. |

**Stagger:** sequential elements cascade with 100 / 200 / 300 / 400ms delays — headline reveals, then subhead 100ms later, then body 200ms later. Content arrives in reading order.

> The 700–900ms duration is intentionally longer than typical (most sites use 300–400ms). The slow settle feels like a light coming up, not a UI element snapping in.

### Reveal variants (engineering page)
Base reveal extends with directional variants — `left` / `right` (horizontal slide), `scale` (from 0.95), `fade` (pure opacity). Use sparingly, for emphasis moments only.

### Parallax
- Select images move slower than scroll via a speed multiplier (e.g. `0.15` = 15% of scroll speed)
- Subtle, creates depth. Never aggressive.
- Disabled under `prefers-reduced-motion`
- Engineering hero + select full-bleed images only. **Never on text** (hard to read).

### Count-up animations (engineering page)
- Numbers animate 0 → target on scroll-in (voltages, cart compatibility %, specs)
- ~900ms, slight stagger between grouped numbers
- Each number pulses once when it lands
- The most "engineered" motion — appropriate for engineering page, overkill elsewhere

### Char-by-char hero reveal (engineering page)
- Hero headline reveals one character at a time, each fading up with a tiny delay
- Accent pulse runs through as it completes
- High-impact. Once per page max (the hero). Never in body.

### Sticky-scroll sections (homepage)
- The "Where It Lives" / festival narrative section can pin while scrolling, advancing through stages
- Cinematic — stops normal scroll to tell a story
- Heavy implementation; only for genuine narrative moments

---

## Part 3 — Hover Effects

### Buttons — primary CTA (pink)
- **Rest:** pink (`cta`) border/fill treatment, pink glow at `shadow-glow-cta` (~0.4 opacity)
- **Hover:** glow intensifies to `shadow-glow-cta-hover` (~0.7), slight `translateY(-1px)` lift
- **Transition:** 0.2s ease
- The glow intensification is the signature — the button "powers up" on hover, echoing the product's light

### Buttons — secondary (cyan outline)
- **Rest:** transparent fill, cyan border, cyan text
- **Hover:** subtle cyan background fill (`surface-tint-cyan`), cyan glow appears
- Same 0.2s ease, same -1px lift

### Nav cart icon
- **Rest:** transparent, subtle border
- **Hover:** border shifts to cyan. Fast (0.2s), minimal — it's transactional.

### Nav links
- **Rest:** dimmed text. **Hover:** brightens to full text color. Color only, no movement. 0.2s.

### Cards (mode cards, prototype cards, manufacturing tiles)
- **Hover:** `translateY(-2px to -3px)` lift + border brightens toward cyan/purple
- Images inside scale slightly (`scale(1.03–1.04)`) with a *slower* transition (0.5–0.6s) than the card lift
- Signature pattern: card lifts fast, image zooms slow — layered feel

### Links (body & policies)
- **Rest:** cyan text with low-opacity cyan underline. **Hover:** underline brightens to full cyan.
- Underline always present (accessibility), intensifies on hover

### Quick-nav / tab pills (activate, policies)
- **Rest:** transparent, dim border, dim text
- **Hover:** border brightens toward purple, text brightens
- **Active:** cyan border, cyan background tint, cyan text with glow
- Three distinct states — important for nav elements

### Voltage cards (activate)
- **Hover:** `translateY(-2px)` + border shifts to the card's LED color (green / blue / red), reinforcing the color-coding

---

## Part 4 — Transitions & State Changes

### Tab / content swaps (policies, Litsaber Mode pills on homepage)
- Content fades in with 8px upward translate over 350ms
- Outgoing replaced instantly; incoming animates in
- Card height stays constant where possible to avoid layout jump (critical on homepage Mode pills)

### Cart drawer (desktop)
- Slides in from the right, 300ms ease-out
- Backdrop fades in over 200ms (dimming leads the slide)

### Mobile bottom sheets (cart, menus)
- Slide up from bottom, 300ms ease-out, drag-to-dismiss
- Body scroll locks while open (critical on iOS)

### Battery charging indicator (activate)
- Segments breathe in sequence (progressive fill), resolve to all-green at full
- 14-second loop, `ease-in-out` — illustrative (demonstrates device behavior), loops continuously

### Accordion expand / collapse (PDP, policies)
- Smooth height transition, chevron or +/− rotates, content fades in as it expands

---

## Part 5 — The Atmospheric Layer

Continuous, independent of user action. Gives the site its "alive" feeling.

### Film grain overlay
- SVG noise texture, fixed over the viewport, 4–6% opacity (6% brand pages, 4% transactional)
- `mix-blend-mode: overlay`, `pointer-events: none`
- **The single most important atmospheric element** — gives dark backgrounds texture, prevents the flat "cheap dark mode" look

### Drifting starfield
- Fine field of small stars drifting slowly upward, low opacity, `screen` blend mode (reads as light, not overlay)
- Mostly white stars (`text-primary`) with sparse cyan/magenta accents (~1 in 5)
- **Two registers:** a faint *global* field behind the whole site (ambient, barely-there), and a denser *section-scoped* field for deliberate sections (the buy section). Section variant is slightly stronger and more colorful.
- Pauses when scrolled off-screen (IntersectionObserver). Freezes to static under `prefers-reduced-motion`.
- Coexists with film grain — density stays low so the layers don't fight

**Section starfield technique (reference implementation):**
- Canvas element, `position: absolute`, fills parent (parent must be `position: relative`), `pointer-events: none`, low z-index behind content, `mix-blend-mode: screen`, ~60% opacity
- Tunable: `density` (stars per pixel, ~0.00018), `accentRatio` (fraction cyan/magenta, ~0.18), `maxSpeed` (upward drift px/frame, ~0.4)
- Stars: random x/y, radius up to 1.5px, per-star speed and opacity
- Animation loop drifts each star upward; when a star exits the top, respawn at bottom with new x
- IntersectionObserver starts/stops the loop based on visibility
- `prefers-reduced-motion`: draw once, no loop
- Resize handler rebuilds the field to new dimensions
- **Colors come from tokens, not hardcoded:** cyan `#00E5FF`, magenta `#FF00E5`, white `#F0F0F5`

### Background gradients
- Radial gradients in brand colors at very low opacity (use `gradient-cta-radial` token)
- Positioned at section tops/centers — pools of color in the darkness
- Static (don't animate), create depth. Hero and atmospheric moments, not transactional surfaces.

### Blurred glow circles (background atmosphere)
The primary way "pools of color in the darkness" are implemented in practice. Used behind content sections (e.g. the FAQ grid) to lift them off the flat purple-black.

- A `<div>` (or absolutely-positioned element) with a solid accent color, `border-radius: 50%`, and a heavy blur (`filter: blur(80–160px)` or a Tailwind `blur-3xl`+ equivalent)
- Low opacity (10–25%), placed behind content at a low z-index, `pointer-events: none`
- Colors: purple `#9D5FFF` most common, cyan `#00E5FF` and pink `#EC5793` as secondary. Often two overlapping circles of different accents create a subtle multi-color pool.
- Positioned off-center / partially off-screen for an organic, asymmetric feel — not centered tidily behind the content
- Static by default. Does not animate. Coexists with film grain and starfield, so opacity stays low enough that the layers don't fight.
- A reusable `<GlowOrb />` primitive is the right abstraction: props for `color`, `size`, `blur`, `opacity`, and position offsets.

### Pulsing accents
- Small elements (badge dots, "live" indicators, QR-arrival badge on activate) pulse opacity on a 2s loop
- `ease-in-out`, opacity ~0.5 to 1. Signals "active/live." Very sparing.

### Glow shadows
- Cyan, purple, and pink elements carry soft colored box-shadows (the `shadow-glow-*` tokens)
- Don't animate except on hover. Make neon colors read as emissive, not flat.
- The glow is what makes the synthwave palette read as "light" rather than "color"

---

## Part 6 — Timing & Easing Reference

The values that make the site feel consistent. Use these exact values.

### The signature easing curve
```
cubic-bezier(0.16, 1, 0.3, 1)
```
Strong ease-out. **THE Litsaber motion curve.** Reveals, settles, most transitions use this.

### Standard durations

| Interaction | Duration |
|---|---|
| Micro-interactions (hover, color shifts) | 0.15–0.2s |
| Card lifts, button states | 0.2–0.3s |
| Content reveals | 0.7–0.9s |
| Image scales on hover | 0.5–0.6s |
| Drawer / sheet slides | 0.3s |
| Tab / content swaps | 0.35s |
| Atmospheric loops (pulse, breathing) | 2–14s |

### Rule of thumb
The more important the moment, the slower the motion. Micro-interactions fast (responsive). Reveals slow (cinematic). **Never reverse** — fast reveals feel cheap, slow hovers feel broken.

---

## Part 7 — Desktop UX Patterns

- **Sticky nav:** transparent over hero, gains dark blurred background + bottom border past ~50px scroll, 0.3s transition, always visible
- **Sticky sub-nav (activate, policies):** secondary nav sticks below main nav; activate uses horizontal-scrolling quick-nav with auto-centering active pill; policies uses tab nav
- **Sticky summary panels (cart):** order summary sticks while scrolling line items, keeps CTA + total visible (desktop only; mobile uses fixed bottom bar)
- **Controlled line length:** editorial content (about, policies) caps ~880px; brand/visual content (homepage, engineering) goes wider/full-bleed
- **Full-bleed breakout moments:** select images span full viewport for impact (exploded view, prototype row). Contrast between contained text and full-bleed image creates editorial rhythm.

---

## Part 8 — What to Avoid (QA Checklist)

- **No bounce / elastic easing.** Ease out smoothly. Bounce feels cheap, wrong for premium positioning.
- **No spin / rotate.** The product doesn't spin; the site doesn't either.
- **No autoplay carousels.** They fight scroll control and hurt conversion.
- **No motion on transactional CTAs beyond glow / lift.** The checkout button doesn't dance.
- **No parallax on text.** Images only.
- **No reveal animations on cart, checkout, or critical-path UI.** Speed over atmosphere there.
- **No motion that blocks interaction.** Animations never prevent clicking, scrolling, typing.
- **No flashing / strobing in the UI.** The product strobes; the website never does — accessibility and brand-maturity.

---

## Priority Order (if time-constrained)

1. Signature easing curve + standard durations (Part 6) — delivers most of the "feel" alone
2. Reveal-on-scroll system (Part 2) — the primary motion
3. Film grain overlay (Part 5) — the most important atmospheric element
4. Hover states (Part 3) — the interactivity layer
5. Everything else

---

## Color Reference (motion accents — reconciled to tokens.json v0.3.0)

| Token | Hex | Role in motion |
|---|---|---|
| `background-primary` | `#0A0518` | Base canvas |
| `background-elevated` | `#110826` | Raised surfaces |
| `background-raised` | `#1A0D33` | Highest surfaces |
| `accent-cyan` | `#00E5FF` | Primary accent, trust, hover borders, glow |
| `accent-purple` | `#9D5FFF` | Secondary accent, gradient start |
| `accent-magenta` | `#FF00E5` | Sparing contrast accent |
| `cta` | `#EC5793` | Conversion / CTA, gradient end |
| `text-primary` | `#F0F0F5` | Primary text |

**Typography in motion:** Orbitron (display headlines that reveal), Inter (body), Space Mono (labels / technical callouts that count up), Monoton (synthwave accent words), Stellar (hero display).

---

*Reconciled from the original interaction design system doc. Stale references corrected: pink `#FF1F7A` → `#EC5793`, background `#0A0518` confirmed, pricing/bundle/color-count data from the old prototype files explicitly NOT carried over — see COMPONENTS.md and BRAND.md for current product data.*
