# Litsaber Website Rebuild — Working Memory

A live log of the build, decisions made, and story beats captured along the way. Use this as the source for content posts and interview narratives. Updated phase by phase.

---

## Project at a Glance

**What:** Replatform `getlitsaber.com` from WordPress/Avada to a modern Next.js storefront on Shopify, instrumented with a production AI agent that runs weekly conversion analysis and proposes A/B tests.

**Why now:** The current WordPress/Avada site was an agency build that prioritized output over outcomes. Conversion data didn't support the spec-sheet narrative the site led with. The rebuild does two things at once: (1) reposition Litsaber from "vape battery" to "festival accessory that happens to hit 510 carts," and (2) replace a static marketing site with a learning system that compounds.

**Repositioning thesis (locked):**
> Litsaber is a festival accessory that happens to hit 510 carts — not a vape battery with an LED. Its meant for buyers who self-identify by what's visible at the night, not by what's hidden in their pocket. Every product, copy, design, and channel decision should foreground visibility, lifestyle, and the engineered hardware that makes it credible — and should refuse any framing that competes Litsaber on discretion, commodity vape specs, or low price.

---

## Tool Stack & Rationale

| Phase | Tool | Why this tool |
|------|------|---------------|
| Design | Figma | Source of truth for visual + messaging decisions |
| Scaffold | Bolt | Fastest path from Figma to working Next.js code |
| Build & integrate | Claude Code | Owns whole repo, plans multi-file changes, runs commands — right mode for integration work |
| Commerce | Shopify Storefront API | Hosted checkout removes a class of compliance + payment risk (Stripe is off-limits for vape) |
| Analytics | PostHog + Vercel Analytics | Free tier, feature flags, performance — covers product + perf |
| Data surface | Supabase | Clean SQL surface the production agent can query directly |
| Orchestration | n8n | Existing fluency; better story than custom Python service |
| Agent reasoning | Claude API (tools) | Lets the agent query the database for follow-ups |

**The PM principle here:** match the tool to the job per phase. No single tool for the whole build. The narrative beat for interviews is *tool-fit reasoning*, not *tool fluency*.

---

## Workflow Decisions (locked)

- **GitHub is the single source of truth.** Code, context docs, working memory all live in the repo. Nothing in Notion or a side Google Doc.
- **Git workflow:** Direct push to `main` for Phase 1 (docs only). Switch to feature branches + self-merged PRs + Vercel preview deploys from Phase 2 forward.
- **`CLAUDE.md` at root.** Claude Code reads it automatically every session.
- **ADRs in `/docs/decisions/`.** Significant architecture calls get one markdown file each.
- **Conventional Commits.**
- **Secrets hygiene:** `.env.example` committed, `.env.local` gitignored, real values in Vercel dashboard.
- **Skipped for now:** pre-commit hooks, Dependabot, automated tests.
- **Hosting: Vercel.** Locked. Made by the Next.js team, ships features for Next.js first, tightest fit for the framework. Hobby tier free at launch. Pro tier ($20/mo) likely 6+ months in driven by production agent function time.
- **Domain registrar:** Namecheap (existing). Domain getlitsaber.com stays at Namecheap. DNS A/CNAME records will be pointed at Vercel during Phase 6/7 launch cutover. No registrar migration.
- **Migration cutover:** Build the new site on Vercel under its default preview URL. Existing WordPress/Avada site continues serving getlitsaber.com until the new build is verified. DNS flip is the actual launch moment. 1–2 week parallel period for rollback safety. Logged for Phase 7.

---

## Build Log

### Phase 1 — Design Tokens & Repo Foundation ✅

**Goal:** Give Bolt and Claude Code structured context to work from, so the codebase reflects Figma decisions and brand strategy from day one.

**Deliverables**
- [x] `tokens.json` — design tokens
- [x] `BRAND.md` — voice, audience, repositioning thesis
- [x] `COMPONENTS.md` — initial component inventory pulled from homepage Figma
- [x] `CLAUDE.md` — persistent operational context for the agent
- [x] `README.md` — human-facing project entry point
- [x] `.gitignore` and `.env.example`
- [x] `docs/decisions/001-tool-stack-and-phasing.md`
- [x] GitHub repo init with first commit

**Decisions logged in Phase 1**
1. **Repositioning thesis locked** — every downstream decision routes through it.
2. **Font stack is five fonts:** Stellar (display), Monoton (accent), Orbitron (sub-headings), Inter (body), Space Mono (labels). Stellar is paid-licensed and self-hosted via `next/font/local`.
3. **Tokens are reverse-engineered, not exported.** Figma file had no defined variables/styles. We defined the token system ourselves.
4. **MSRP is $59.99**, locked.
5. **GitHub-first context architecture** — strategy docs live in the repo, not in a side doc.
6. **Mobile derived from desktop, in Phase 3, not Phase 2.** (Updated in Phase 1.5 — mobile Figma frames now exist; this decision is reversed.)

---

### Phase 1.5 — Scope Expansion & Mobile/Desktop Reconciliation ✅

**Goal:** Pull the rest of the design context (mobile frames, additional pages, cart system, modals) before kicking off Phase 2.

**What happened**
- User built out the full mobile UI in Figma between Phase 1 close and Phase 2 start
- Pulled 14+ frames across Mobile and Desktop Figma pages via the Figma MCP integration
- Hit a Starter-tier rate limit mid-pull; user upgraded to Professional to unblock
- Several frames timed out (Policies page in particular) — handled by treating as known templated pattern rather than blocking on a full pull
- Final inventory: 8 pages, 2 modals, full cart system, full reviews subsystem, ~78 components total

**Deliverables**
- [x] `tokens.json` — updated with cart drawer dimensions, modal widths, z-index layer system, component sizing tokens
- [x] `BRAND.md` — MSRP corrected to $59.99, five-font system noted, social proof stats locked
- [x] `COMPONENTS.md` — fully rewritten covering all 8 pages + modals + cart + reviews subsystem
- [x] `CLAUDE.md` — added age gate compliance rules, reviews provider note, expanded commerce constraints (MOQ 5, 4-tier wholesale)
- [x] `docs/decisions/002-scope-expansion-eight-page-site.md` — ADR documenting the scope change

**Decisions logged in Phase 1.5**
1. **Site map is 8 pages, not 1.** Homepage + PDP + Engineering + Wholesale + About + Activate + Contact + Policies (5 sub-pages).
2. **Wholesale MOQ is 5** (locked). 80 case pack. 4 tiers: Initiate / Knight / Archon / Legend.
3. **"TEN WAYS TO BE SEEN"** is canonical, not "TWELVE." Hero spec pill reads "10 Colors."
4. **Age Gate is compliance-critical** — must sit at top z-index, required for vape category. Behavior policy (cookie duration, etc.) deferred to Phase 2.
5. **Reviews subsystem on PDP is its own complete system** — rating summary, distribution chart, AI summary, photo carousel, search, filter chips, paginated review cards. Provider undecided; build with mock data in Phase 2, integrate in Phase 4.
6. **PDP long-form copy needs rewrite.** Current Figma copy ("Ignite your night... world's first... glow-up accessory") violates BRAND.md voice rules.
7. **Phase 2 timeline extended** from 5–7 days to 10–14 days due to scope expansion. Total project timeline now ~6–7 weeks.
8. **Phase 2 build order locked:** Foundation → Homepage → PDP → Cart → Wholesale + About → Engineering + Activate → Contact + Policies.
9. **Mobile is no longer derived in Phase 3.** User built mobile Figma frames; mobile gets scaffolded in Phase 2 alongside desktop. (Reverses Phase 1 decision.)

**Real inconsistencies surfaced and resolved**
- "TEN WAYS" vs "TWELVE WAYS" → TEN (Figma + spec pill updated)
- Charge time conflict (20 mins vs 75 mins) → 75 mins fixed in Figma
- 3.7v voltage label → fixed in Figma
- Duplicate spec grid rows → fixed in Figma
- Wholesale MOQ inconsistency (25 vs 5) → 5 (Figma + COMPONENTS.md updated)
- Wholesale case pack inconsistency (80 vs 100) → 80 (Figma)
- Wholesale tier count (9 vs 4 vs 6) → 4 tiers (Figma + checklist updated)
- "RETAILER MARGING" typo → fixed
- Spec pill "1.5yr Power settings" mislabel → fixed
- Hero "12 Colors" → "10 Colors" (fixed)

**Drift items flagged but not yet resolved**
- Desktop homepage Wholesale CTA still reads "MOQ 25 · 100+" (needs Figma update)
- Desktop footer missing Social icons + "DESIGNED IN LA | ASSEMBLED IN ASIA" (in mobile, not desktop)
- "$59.00" typo in cart drawer (should be $59.99)
- "REVIEWINFRA" placeholder needs real provider name
- "LITSABER OG +" PDP title — is the `+` intentional?
- 2-Pack "SAVE $20" badge math is $19.99 — round up or keep?
- FAQ Contact page mentions competitor "Danksaber" by name — keep, reframe, or remove?
- ~~Empty Section 6 (1440×1820) on desktop homepage between FAQs and Reviews~~ → now built as the `WhatWereShipping` section (Editions row + ProductDisplay), Phase 1a/1b complete
- FAQ #3 placeholder copy on homepage ("How long does the battery last?")
- Contact FAQ answers are mostly boilerplate placeholder — need real copy pre-launch

**Outreach materials to reconcile post-launch (separate from web build)**
- `Litsaber_Wholesale_Pricing_2026.pdf` shows 9 tiers + MOQ 25; needs rewrite to 4 tiers + MOQ 5
- `Litsaber_Business_Competence_Cheat_Sheet.pdf` shows 31 LEDs + 10–12 colors; needs update to 41 LEDs + 10 colors

**Pre-Phase-2 decisions locked (closeout)**
1. **Reviews provider: ReviewInfra** (https://reviewinfra.dev). Script-tag widget integration model. Phase 4 default approach: Path A (use widget as-is). Stretch: Path B (data API, render our own UI) pending confirmation from ReviewInfra that a read API exists. Action item: email ReviewInfra to confirm.
2. **AI Summary: open.** ReviewInfra docs don't advertise an AI summary feature. Three options: (a) confirm built-in support with ReviewInfra, (b) build a custom Claude API endpoint that synthesizes reviews server-side and caches, (c) skip the `<AISummaryCard />` for v1. Decision deferred to post-ReviewInfra-conversation.
3. **Bundle SKU: quantity discount on single SKU.** 2-Pack is not a separate Shopify product. Cart adds 2× the single SKU + applies the discount.
4. **PDP long-form copy: approved for rewrite.** Current Figma copy ("Ignite your night... world's first... glow-up accessory") to be replaced with copy matching BRAND.md voice during Phase 2 scaffold. Claude Code will draft and flag for review before commit.
5. **Age gate: locked.** First-visit cookie (`litsaber_age_verified`), 30-day duration, hard wall, EXIT → google.com. Env vars committed in `.env.example`.

**Pre-Phase-2 decisions still open (non-blocking)**

None. Phase 2 unblocked.

**Story beats captured (Phase 1.5)**

| # | Beat | Tag |
|---|------|-----|
| 6 | "Scope expanded ~5x between Phase 1 spec and Phase 2 kickoff. 1 page became 8. I didn't push back on the scope. I re-scoped the timeline and the build order — and wrote an ADR explaining why before touching the next prompt. Re-planning is the senior signal; pretending the plan still fits isn't." | `pm-discipline` |
| 7 | "Hit a Figma MCP rate limit mid-pull. Didn't argue with it — picked the recovery path that preserved the discipline (extract spec before scaffold) without blocking. User upgraded mid-conversation; I picked the next-highest-leverage frame to pull rather than restarting." | `tool-choice`, `pm-discipline` |
| 8 | "Pulled the Figma file and surfaced 11 real cross-document inconsistencies — MOQ, case pack, tier count, voltage labels, color count, copy duplicates. None of them are bugs in code. They're inconsistencies in the SPEC. Catching them before Bolt sees them prevents an entire class of rework." | `discovery`, `pm-discipline` |
| 9 | "The Activate page is the secret weapon. Post-purchase onboarding most DTC brands skip — designed to reduce support tickets and reinforce the engineering thesis. Sticky chip nav, 8 functional sections, inline demo videos, QR-scan-from-box entry detection. Shipping in Phase 2, not deferred to v2." | `discovery` |
| 10 | "The PDP reviews section turned out to be a full subsystem — not a card list. Rating summary, distribution chart, AI-summary card, photo carousel, search, filter chips, paginated cards. Identifying it as a subsystem rather than a single component changes the Phase 4 provider decision from cosmetic to structural." | `discovery`, `integration-depth` |
| 11 | "Figma's PDP description copy was AI-toned ('Ignite your night... world's first... glow-up accessory'). It violated every rule in BRAND.md. Caught it because the voice rules were written down and load on every Claude Code session — the discipline does the work I'd otherwise have to do manually." | `pm-discipline`, `ai-augmented-build` |
| 12 | "Reviews provider was ReviewInfra — a small script-tag product, not a Yotpo/Stamped-scale platform. The integration model forces a real Phase 4 decision: ship their widget as-is and lose brand control on the PDP, or build a custom UI against their data API (if it exists). I logged it as Path A vs Path B in CLAUDE.md and made the email-to-ReviewInfra an explicit action item rather than guessing." | `tool-choice`, `integration-depth` |
| 13 | "Hosting choice came up mid-build. Default temptation is to pick whatever's familiar. I picked Vercel for a specific reason: it's made by the Next.js team, ships framework features first, and its serverless functions are the natural home for the Phase 6 production agent. Netlify would have worked — Vercel wins on tool-fit, not marketing. The domain stays at Namecheap. Registrar migration is a different decision and there's no reason to do it." | `tool-choice`, `pm-discipline` |

---

### Phase 2 — Foundation Complete (2026-05-20) ✅

**Goal:** Foundation phase — layout shell, global components, page stubs, token system.

**Deliverables**
- [x] Next.js 14, App Router, TypeScript strict mode, Tailwind CSS
- [x] `tailwind.config.ts` — all tokens from `tokens.json` mapped to named utilities (colors, fonts, spacing, radii, shadows, z-index, etc.)
- [x] `lib/fonts.ts` — Monoton, Orbitron, Inter, Space Mono via `next/font/google`; Stellar placeholder via CSS variable with system fallback, commented localFont block ready for when font file arrives
- [x] `app/globals.css` — Tailwind directives, Stellar placeholder var, scroll-lock class
- [x] `app/layout.tsx` — root layout with font variables, metadata, `<AgeGateModal />`, `<Navbar />`, `{children}`, `<Footer />` in order
- [x] `components/layout/Navbar.tsx` — sticky, transparent over hero, solid black on scroll; logo left, nav links center, user+cart icons right; hamburger mobile trigger
- [x] `components/layout/MobileNavDrawer.tsx` — full-screen drawer, 5 nav items with submenu indicators, expandable Quick Links, footer CTA + login link, scroll lock, focus management, Escape key close
- [x] `components/layout/Footer.tsx` — logo+tagline, social icons (Instagram, YouTube, TikTok), "DESIGNED IN LA" tagline on both mobile and desktop (drift resolved), 3 nav columns, compliance disclaimer, policy links, payment strip
- [x] `components/layout/AgeGateModal.tsx` — hard wall, cookie read on mount, 30-day max-age on confirm, EXIT link to google.com, reads all config from env vars
- [x] 14 page stubs (/, /shop/litsaber-og, /the-tech, /wholesale, /about, /activate, /contact, /cart, /policies/refunds, /policies/warranty, /policies/shipping, /policies/terms, /policies/privacy) — each with stub content and page-level metadata
- [x] Build passes clean — `next build` produces 14 static routes, no type errors

**Decisions made in this phase**

1. **Bolt bypassed for foundation.** Bolt was in the Phase 2 plan for scaffold, but Claude Code built the foundation layer directly. Reason: the token system, compliance constraints (age gate), and component spec were precise enough that Bolt's ~70% fidelity would have required a full audit pass anyway. Direct build is faster for components with locked specs.
2. **Stellar font uses CSS variable placeholder.** `next/font/local` requires the font file to exist at build time. Since Stellar.woff2 hasn't been added yet (paid license), the lib/fonts.ts has the `localFont` block commented out with clear instructions. The CSS variable `--font-stellar` falls back to "Arial Black" / Impact / system-ui. When the file arrives, drop it at `public/fonts/Stellar.woff2`, uncomment the localFont block, and remove the CSS variable override in globals.css.
3. **Footer drift resolved.** COMPONENTS.md flagged that the desktop footer was missing social icons and "DESIGNED IN LA" tagline (they existed on mobile only). Both are now on both breakpoints from the start — no deferred reconciliation needed.
4. **js-cookie removed.** Age gate uses `document.cookie` directly rather than introducing a dependency. Simpler, no bundle cost, sufficient for a single compliance cookie.

**Story beats (Phase 2 foundation)**

| # | Beat | Tag |
|---|------|-----|
| 13 | "Built the foundation layer directly instead of waiting for Bolt. The token system was precise, the age gate behavior was locked, and the component spec was detailed enough that a 70%-fidelity scaffold would have needed a full rewrite. Skipping a step isn't cutting corners when the step was designed for a different level of spec ambiguity." | `pm-discipline`, `tool-choice` |
| 14 | "The Stellar font placeholder pattern — commenting out the `localFont` block with exact instructions for when the file arrives — is a small thing that prevents a class of 'why doesn't the font look right' confusion later. The placeholder communicates intent; Arial Black communicates absence." | `ai-augmented-build` |
| 15 | "Caught the desktop footer drift before Phase 3 even started. Social icons and 'DESIGNED IN LA' are on both breakpoints in the first commit. One less thing to reconcile." | `pm-discipline` |

---

### Phase 2 — Homepage complete + Commerce Phases 2 + 3a/3b/3c-1 complete (2026-05-26) ✅

**Goal:** Build all homepage sections, local cart store, cart drawer, and waitlist form + API route.

**Sequencing (locked in ADR-002):**
1. Foundation — Layout shell, Navbar, Footer, mobile drawer, age gate modal ✅
2. Homepage — All sections in scroll order ✅
3. PDP — Product info, styles/bundles, mock data only. Reviews subsystem with seed data. (pending)
4. Cart — Drawer + page + line items + promo code (local state, no Shopify yet) ✅ (drawer + store built; `/cart` page pending)
5. Wholesale + About — Lower-risk pages (pending)
6. Engineering + Activate — Higher complexity (kinetic animation, sticky chip nav) (pending)
7. Contact + Policies — Templated, fastest to ship (pending)

#### Phase 2 — Step 1: Foundation ✅ (deployed to Vercel) — see entry above

**Bolt output audited.** Build passes, preview works, all 13 routes render. Quality of token integration in `tailwind.config.ts` is gold-standard — every value imports from `tokens.json`, no inline hex anywhere. Accessibility on the modal/drawer is genuinely good (scroll lock, focus management, Escape close, full ARIA labeling). Footer drift from Phase 1.5 resolved — socials + "DESIGNED IN LA" present on both mobile and desktop.

**Three problems caught in audit and fixed:**
1. **Netlify leak resolved.** Bolt installed `@netlify/plugin-nextjs` and created `netlify.toml` despite the Vercel decision being locked in CLAUDE.md. Removed via cleanup prompt.
2. **Dotfile damage fixed.** `.gitignore` had been overwritten by a 2-line Bolt stub, leaving the real 59-line version under a no-dot filename Git was ignoring. `env.example` had also lost its leading dot. Both restored via GitHub web editor.
3. **Working memory restored.** Bolt claimed it had updated `working-memory.md` but hadn't. Logged manually.

**Vercel deploy complete.**
- Repo connected to Vercel via Hobby plan
- Auto-deploy from `main` branch configured
- Three age gate env vars set (`NEXT_PUBLIC_AGE_GATE_COOKIE_NAME`, `..._MAX_AGE_DAYS`, `..._EXIT_URL`)
- Live preview URL responsive to all 5 verification tests: Age Gate appears, dismisses on confirm, persists across refresh, all 5 nav routes work, mobile drawer opens with full nav
- From here forward, every push to `main` auto-deploys; every PR gets a unique preview URL

**Story beats captured (Phase 2 Step 1)**

| # | Beat | Tag |
|---|------|-----|
| 14 | "Bolt produced gold-standard token integration in the Tailwind config — every color, spacing, z-index, font, breakpoint pulled from tokens.json. Because the spec was written down, Bolt couldn't get the foundation wrong even if it tried. The discipline pays off the moment AI tools meet a real codebase." | `ai-augmented-build`, `pm-discipline` |
| 15 | "Bolt's default scaffold leaked a Netlify dependency despite Vercel being locked in CLAUDE.md. The tool has its own opinions. Caught it in audit before deploy — exactly the failure mode the Phase 3 audit step in ADR-001 was designed to catch. Trust but verify." | `tool-choice`, `pm-discipline` |
| 16 | "Bolt claimed in its status report that it had updated working-memory.md as part of the Foundation phase. It hadn't. I logged the Phase 2 entry myself. Real lesson: AI status reports describe intent, not always action. The audit step exists because the AI's self-report is unreliable." | `ai-augmented-build`, `pm-discipline` |
| 17 | "Foundation phase shipped to production-grade infrastructure: GitHub repo, auto-deploying Vercel pipeline, env vars wired, Age Gate compliant and working on the live URL. The bar is no longer 'does it work in Bolt's preview' — it's 'does it work on the actual production CDN.' Three weeks from Figma file to working pipeline." | `pm-discipline` |

---

#### Phase 2 — Step 1.6: Palette reconciliation + Motion system

**What happened:** User surfaced a motion design system doc and two component files (`BuySection.tsx`, `SectionStarfield.tsx`) from an earlier Vite prototype. Audited them. The motion doc was high-quality and worth keeping; the two `.tsx` files carried stale data (3-pack bundles, $60/$110/$150 pricing, "12 Colors", 30-day-vs-6-month warranty conflict, a different synthwave palette).

**Palette decision (locked, v0.3.0 hybrid):**
- Background: `#0A0518` deep purple-black (was pure black `#000000`)
- 3 decorative accents: cyan `#00E5FF`, magenta `#FF00E5`, purple `#9D5FFF` (purple is new)
- CTA / conversion color: pink `#EC5793` (new — the "money color," also the gradient endpoint). User specified this exact hex, replacing the prototype's `#FF1F7A`.
- Gradient: purple → pink (`#9D5FFF` → `#EC5793`)
- Text primary shifted `#FFFFFF` → `#F0F0F5` to match the motion doc

**Deliverables:**
- [x] `tokens.json` bumped to v0.3.0 — color/gradient/shadow sections rewritten. Added `accent.purple`, `cta` color family, `surface.tint-purple`/`tint-cta`, `gradient.cta` + `gradient.cta-radial`, `shadow.glow-purple`/`glow-cta`/`glow-cta-hover`.
- [x] `MOTION.md` created as a permanent repo artifact (sibling to BRAND.md). Full motion system reconciled to the hybrid palette. Starfield technique captured without the stale prototype values.
- [x] `CLAUDE.md` updated — points at MOTION.md, documents the v0.3.0 palette and the cascade note.

**Cascade impact:** Foundation components (Navbar, Footer, AgeGate) reference named tokens, so they inherit new hex values automatically when Tailwind rebuilds — no code change needed for the background/text shift. BUT any CTA built using cyan as the action color should switch to the new pink `cta` token. Verify during the next Bolt pass or the Phase 3 audit.

**The two prototype `.tsx` files: reference only, NOT merged.** Useful patterns (carousel with fade, sticky product image, bundle selector, accordions, section starfield) but wrong framework (Vite not Next.js), wrong palette, wrong prices, wrong bundle count. Bolt re-implements fresh against current spec. Starfield *technique* captured in MOTION.md Part 5.

**Story beats captured (Phase 2 Step 1.6)**

| # | Beat | Tag |
|---|------|-----|
| 18 | "Inherited a motion design doc and two component files from an earlier prototype. The doc was gold; the components carried stale prices, bundle structure, and a different palette. Rather than paste them in and re-introduce resolved inconsistencies, I extracted the doc into a permanent MOTION.md artifact and flagged the components as reference-only. Knowing what to keep vs. what to quarantine is the actual skill." | `pm-discipline`, `discovery` |
| 19 | "Palette went hybrid mid-build: purple-black canvas, three accents, a dedicated pink CTA color. Because everything routes through tokens.json, the change was one file edit — every component referencing named tokens inherited it automatically. This is why we built the token system in Phase 1 instead of inlining colors. The discipline compounds." | `pm-discipline`, `ai-augmented-build` |

**Homepage structure decision (locked):** The homepage has its **own full buy section** (`<HomepageBuySection />`) — product carousel, style selector (Silver/Gold), bundle selector (Single/2-Pack), Add to Cart, accordions, with `<SectionStarfield />` behind it. Not just a link to the PDP. Spec'd in COMPONENTS.md with all prototype data corrected: $59.99 single, $99.99 2-Pack (save $20), no 3-pack, 10 colors, warranty figure flagged for reconciliation. Anchor is `id="buy"` (not `id="shop"`, which collides with the `/shop/litsaber-og` route).

---

#### Phase 2 — Step 2: Hero section (built, corrected)

**Built hero-first** (broke the homepage into per-section chunks rather than the original two-pass split). Bolt produced `<Hero />` plus reusable `<Reveal>` and `<SpecPill>` primitives. The hero is the most-judged component and sets the motion/color patterns for every later section, so it earned its own pass.

**Bolt flagged three Figma discrepancies — all resolved:**
1. Hero image not found → turned out the entire `public/` folder had been wiped (see incident below). Real path is `public/images/home/`, not `public/images/hero/`.
2. Figma shows a product render in the hero; the Phase 1.5 spec omitted it → **Figma was right.** COMPONENTS.md hero spec corrected to include the device render. Locked: hero shows the device.
3. Figma shows the "Glowstick meets 510 battery" tagline at large display size; spec said small eyebrow → **Figma was right.** It's the repositioning thesis line; it earns weight. COMPONENTS.md corrected. Locked: large display statement with cyan glow.

**Hero assets (confirmed in repo):**
- `public/images/home/hero-lifestyle.png` — background scene
- `public/images/home/litsaber-hero-image.png` — device render, layered on top

**Corrective prompt issued** to wire real images, add the product render, resize the tagline — as a patch to existing `<Hero />`, not a rebuild.

#### Phase 2 — INCIDENT: public/ folder wiped by Bolt sync

**What happened:** The entire `public/images/` folder (uploaded across 3 commits ~17–19h prior) disappeared from the repo. Root cause: two-sources-of-truth collision. Images were added directly via GitHub/GitHub Desktop; Bolt's workspace never had them; a Bolt sync produced a `Merge branch 'main'` commit that dropped `public/` because Bolt's view didn't include it.

**Recovery:** Images were still in git history (commit `319096d`). Restored via `git checkout 319096d -- public/` → commit → push. No data lost. (Alternative paths considered: GitHub Desktop revert, ZIP-download-and-re-upload.)

**Prevention (now locked in CLAUDE.md):** Single write path to the repo. During Phase 2, all files enter through Bolt. No direct GitHub edits while Bolt is the active editor. This is the second Bolt collision (first was the Netlify dependency leak in Step 1) — both are arguments for the Claude Code handoff after the homepage scaffold.

**Story beats captured (Phase 2 Step 2 + incident)**

| # | Beat | Tag |
|---|------|-----|
| 20 | "Broke the homepage into per-section chunks instead of building it in big passes. Started with the hero alone — most-judged component, sets every downstream pattern. Smaller chunks meant tighter review and less rework. Scoping the unit of work is a PM call, not a coding one." | `pm-discipline` |
| 21 | "Bolt flagged three places where Figma and my spec disagreed. On two of them — product render in the hero, tagline size — Figma was right and my Phase 1.5 spec was stale. The discipline that mattered wasn't 'spec always wins'; it was building the prompt so Bolt surfaces the conflict instead of silently picking. Then a human decides." | `pm-discipline`, `ai-augmented-build` |
| 22 | "Lost the entire image folder to a Bolt sync collision — Bolt merged its view of main over mine and dropped files it never knew about. Recovered in two minutes from git history (`git checkout <commit> -- public/`). The real lesson wasn't the recovery, it was the root cause: two write paths to one repo will always eventually collide. Locked a single-write-path rule and accelerated the plan to drop Bolt for Claude Code. Version control turned a 'lost a day of work' into a 'lost two minutes.'" | `integration-depth`, `pm-discipline` |

---

### Phase 3 — Claude Code Audit & Structural Fixes (pending)

Planning session: have Claude Code audit Bolt's output against `BRAND.md`, `COMPONENTS.md`, and tokens. Fix component composition, type safety, routing, accessibility. Mobile responsiveness verified or built where Bolt fell short.

**Handoff to Claude Code complete (mid-Phase-2):** Environment set up locally — Node 20 via nvm, pnpm, Claude Code installed, `pnpm dev` running. Bolt retired after repeated sync collisions (Netlify leak, image-folder wipe, a merge-conflict that landed unresolved markers in Hero.tsx). Single write path now: local repo + Claude Code + git. The remaining homepage sections and all subsequent phases run through Claude Code.

**Responsive image pattern (locked):** Most images have separate mobile/desktop assets (different filename, dimensions, sometimes format — e.g. `hero-lifestyle.png` desktop / `hero-lifestyle-mobile.jpg` mobile). Standardized on a `<ResponsiveImage />` primitive using `<picture>` so browsers fetch only the needed asset (critical for `priority` hero images). Documented in COMPONENTS.md (primitive spec) and CLAUDE.md (standing convention). Applies across hero, venue cards, section backgrounds — build once, reuse everywhere.

**Mobile/desktop component strategy (locked — ADR-003):** The Figma mobile and desktop homepage frames diverge structurally, not just by reflow. Decision: per-section criterion, not a blanket rule. Default to one responsive component; SPLIT into `*.desktop.tsx`/`*.mobile.tsx` only when DOM structure or content grouping genuinely changes (not merely "looks different"). The hero is the first confirmed split — its headline regroups which words are cyan between breakpoints (`HIGHLIGHT THE` + `NIGHT` desktop vs `HIGHLIGHT` + `THE NIGHT` mobile), which one DOM can't express cleanly. All splits share content + primitives (duplicate arrangement, never content) and use CSS toggle (`hidden lg:block`), never JS rendering (SSR/flash/hydration). Full rationale + per-section checklist in ADR-003.

**Hero refactor pivot:** The earlier-approved flow-based refactor of the *single responsive* hero was superseded by the split decision. Instead of one flow-based responsive hero, the hero becomes `HeroDesktop` + `HeroMobile` + a CSS-toggle wrapper + shared `hero.content.ts`. Flow-based principles (no magic pixel offsets, token spacing) still apply — within each of the two simpler single-breakpoint components. The brittle pixel-offset problem is solved by the split (each component targets one layout) rather than by making one component flow across all breakpoints.

**Story beats captured (architecture)**

| # | Beat | Tag |
|---|------|-----|
| 23 | "The hero kept fighting me on every spacing tweak because it used absolute pixel offsets coupled across two background layers. Diagnosed it as brittle architecture, not a styling bug. The fix wasn't another tweak — it was recognizing the layout method itself was wrong for the job." | `pm-discipline`, `integration-depth` |
| 24 | "Pulled the full mobile and desktop Figma frames and saw the divergence was structural, not cosmetic — the hero headline literally regroups which words are cyan between breakpoints. Resisted two easy wrong answers: 'force one responsive component' (would need conditional word-grouping hacks) and 'split everything' (doubles maintenance across the whole site). Landed on a per-section structural-divergence test, documented as ADR-003. The judgment was in the criterion, not the binary." | `pm-discipline` |

---

**Be Seen Across The Crowd — scroll-pinned scrollytelling (building):** The most complex section on the site. Three stages (THE LIFESTYLE / THE INTERACTION / THE ENDURANCE), each a full-bleed image + text block + 3-bar progress indicator. SPLIT per ADR-003 — this is the second confirmed split, and it refined the criterion: desktop and mobile share the SAME interaction (scroll-pin advance through stages, tappable bars) but split on divergent layout, type scale, gradient direction, and image assets. A split doesn't require different interactions, just different enough structure.

**Exact specs both breakpoints (authoritative, from Figma + user):** Desktop (node `3416:3337`) 1440×900, text column 580px left, headline Stellar Bold 75px / body Inter 22px / eyebrow Space Mono 16px, gradient left→dark, image right. Mobile (nodes `3760:8705`/`3760:5351`) 375×650, text 327px / 20px padding, headline 45px / body 18px / eyebrow 14px, gradient bottom→top, image full-bleed. Bars identical: 40×5px, 24px gap, cyan active / `#828282` inactive. Six images: `litsaber-{festival,interaction,endurance}.jpg` (desktop) + `-mobile.jpg` (mobile).

**Mechanism (locked before build):** tall section (300vh, 100vh/stage) + `position: sticky` inner pinned for the scroll duration + Framer Motion `useScroll`/`useTransform` to derive active stage from scroll progress. Explicitly NOT wheel-hijacking — the browser scrolls naturally, the component reacts to position. Progress bars are both indicator and control: clicking scrolls the window to the stage position (not just setting state, which would desync). `prefers-reduced-motion` falls back to stacked stages, no pin. Files: `components/home/BeSeen/{crowd.content.ts, BeSeenDesktop.tsx, BeSeenMobile.tsx, BeSeen.tsx}` + shared scroll hook.

**Figma-structure correction logged to CLAUDE.md:** The file is ONE page ("Desktop Website"), but it DOES contain mobile variant frames for some sections (hero, Be Seen) — not all. Rule: check whether a mobile node exists; if yes match it exactly, if no derive mobile from desktop via tokens. Earlier shorthand ("Figma is desktop-only") was imprecise — corrected.

**StatBar marquee (built between hero and Be Seen):** Continuous horizontal ticker, 5 stats, one responsive component (not split — identical structure both breakpoints, only font size differs; a clean example of "not everything splits"). CSS keyframe animation, not Framer Motion — continuous infinite loops belong in CSS (performance, no dropped frames); Framer is for entrance/scroll reactions. Duplicated-track technique for seamless loop. Standard left-scroll (resolved an ambiguity: "left to right" had two readings; the tool asking saved a build cycle). Reduced-motion = static.

**Story beats captured (architecture, continued)**

| # | Beat | Tag |
|---|------|-----|
| 25 | "Three times I gave the AI mobile specs from memory or a screenshot, and twice I was wrong about the actual design — I assumed mobile stacked when it actually used the same scroll-pin as desktop. The fix each time was the same: stop describing, pull the actual Figma node and read it. Reading the file directly beat guessing every single time. For pixel-precise work, the source of truth is the source, not my recollection of it." | `pm-discipline`, `ai-augmented-build` |
| 26 | "Chose the scroll-pin mechanism deliberately: sticky-positioned inner container plus scroll-progress tracking, explicitly NOT wheel-hijacking. Scroll-jacking is the fragile, accessibility-hostile version that fights the user's input device; the sticky approach lets the browser scroll naturally and just reacts to position. Knowing which pattern to reach for — and which superficially-similar one to avoid — is the difference between an effect that feels premium and one that feels broken. Same judgment on the marquee: CSS for continuous loops, Framer for entrance motion." | `integration-depth` |

---

### Editions + Commerce section — build-phasing plan (2026-05-23, planning)

The homepage's most complex section ("WHAT WE'RE SHIPPING" / Editions + the inline PDP-style product display, Figma node `3312:2`). This is the frame previously logged as the empty "Section 6" open question — now resolved as this feature. Planned the build before writing any code because it bundles UI, cart state, form capture, and a payment integration that, done in one pass, would produce something that looks right and breaks on real commerce data.

**Governing architecture decision:** Decouple UI from commerce. Build all UI against a local cart store (`lib/cart/store.ts`, Zustand + localStorage) exposing a Shopify-shaped interface; swap the store's action bodies to Shopify Storefront API mutations only in the final phase. Components talk to the store, never to Shopify. This isolates integration risk and keeps every builder prompt small. Full spec written into CLAUDE.md ("Commerce build phasing" section).

**Four commercial decisions confirmed by Matt (2026-05-23):**
- **Two Pack = two single SKUs shipped together (FINAL 2026-05-23).** No physical two-pack box, no separate Shopify variant. Driven by ops/inventory: one inventory pool (no allocation guessing), no 3PL kitting map (pick order is "Silver × 2"), QuickBooks stays single-SKU. Front-end models it as one logical cart line ($99.99); Shopify mechanism deferred to Phase 4 (leaning native Bundles, fallback automatic discount on 2× single). Interim "dedicated variant" call was reversed once it was confirmed no physical two-pack exists. **NOTE: this decision was reversed again on 2026-05-27 — see "Quantity discount refactor" entry below.**
- **Authorize.net** already approved for this store; Shopify hosted checkout routes to it. Wired in Phase 4, not before.
- **HubSpot** handles both new signup flows (Gold waitlist, Future Drops notify) — submit to HubSpot forms, a workflow sends confirmation, contact lands in CRM. No custom backend. Two new forms needed; Matt to create before Phase 3 form wiring.
- **Variant→behavior:** Silver → add to cart + drawer. Gold → waitlist modal (no cart).

**Build sequence (4 phases, each chunk = one prompt = one commit):** P1 static layout (Editions row + product display, inert). P2 local cart store + selection logic + conditional CTA. P3 drawer + `/cart` page + the two HubSpot modals + wire Editions actions. P4 Shopify (client, swap store actions to cart mutations, `checkoutUrl` redirect) — last and isolated. Desktop + mobile both mocked; one responsive component per chunk per ADR-003, split only if responsive logic gets unmanageable mid-build.

**Story beats captured (commerce planning)**

| # | Beat | Tag |
|---|------|-----|
| 27 | "Before building the most complex section on the site, I drew a seam: all UI talks to a local cart store with a Shopify-shaped interface, and Shopify itself gets wired in dead last by swapping only the store's internals. The components never change. The point wasn't the tech — it was refusing to let integration risk contaminate four phases of layout work. Sequencing the unknowns to the end is a PM call." | `pm-discipline`, `integration-depth` |
| 28 | "Reversed my own bundle decision twice and landed where the operations pointed, not where the code was easiest. I first picked a dedicated $99.99 variant because it kept the cart code dumb. Then I asked the real question — what does this do to inventory? — and realized a separate variant splits one physical product into two stock pools, forcing allocation guesses and a 3PL kitting map for a box that doesn't exist. We just ship two units together. So: one SKU, one inventory pool, modeled as a single logical cart line in the UI, with the Shopify mechanism deferred to Phase 4. The lesson: 'simplest code' and 'simplest operations' are different axes, and for a physical-goods business the ops axis wins." | `pm-discipline`, `integration-depth` |

---

### WhatWereShipping — Phase 1a + 1b built (2026-05-23) ✅

Static layout for both children of the section is built, reviewed, and committed (repo `getlitsaber-web`, `components/home/`).

**Built:**
- `components/home/Editions/` — the 3 CTA boxes (OG Silver / Gold Edition / Future Drops). One responsive component (3-up grid → stacked), per-card accent (cyan/magenta/purple) via a static `ACCENT_CLASSES` lookup (avoids Tailwind JIT string-interpolation trap). Action links inert (Phase 3 wires them). [Phase 1a]
- `components/home/ProductDisplay/` — gallery (vertical thumb strip left of main on desktop, stacked on mobile; 5 thumbs, packaging hero is thumb 1), title/subtitle/price, 6 rectangular spec pills, StyleSelector (Silver active / Gold "Coming Soon"), BundleAndCTA (Single active / Two Pack, both CTAs inert). Silver hardcoded active; no selection or cart logic yet. [Phase 1b]
- `components/home/WhatWereShipping/` — `position: relative` wrapper. Gradient bg over `#0A0518`, `box-shadow 0 4px 4px rgba(0,0,0,.25)`, owns all section padding + vertical rhythm. Inner column `mx-auto w-full max-w-[1250px]`. TODO mount point for the section-scoped `<Starfield>` (Phase Motion). Renders `<Editions />` then `<ProductDisplay />`. **Renamed from `Section6` 2026-05-23** — "Section 6" is a Figma artifact name, retired in code.

**Decisions locked during the build:**
- Title is `LITSABER OG - Silver` (Stellar). Subtitle `The Interactive 510 Battery` (Inter 25px, muted). Price Space Mono 55px (`text-h2`) + pink glow. (Bolt kept guessing Monoton/eyebrow fonts because it can't reach Figma — corrected against node `3335:54` each time.)
- Sizes snap to the existing type scale: 50px Figma values → `text-h2` (55px). No one-off 50px token added.
- New tokens added rather than inline hex: `#120F2C` (card-deep bg), `#424242` (inactive border), `r=10`, `r=5`.
- Two Pack copy: "For the lightshow. For the partner. For the never-without" (partner, not duel).
- Editions box actions CONFIRMED: Box1 → Shop page (navigate, no modal); Box2 → Gold waitlist modal; Box3 → general email-list modal. Resolves the earlier modal-vs-scroll open question — all modals/navigation are Phase 3.

**Workflow learning:** Bolt cannot pull Figma (login wall) — it reconstructs visuals from prompt text and guesses fonts/copy/radii. Mitigation now standing: Claude pulls the Figma node and hands Bolt exact specs (fonts, px, copy, hex) rather than trusting Bolt to "have enough from the codebase audit." Every Bolt plan gets checked against the real node before code.

**Story beat captured**

| # | Beat | Tag |
|---|------|-----|
| 29 | "My builder couldn't see the design file — it was reconstructing the screen from my written description and quietly guessing fonts, copy, and corner radii. Three rounds in I stopped trusting 'I have enough from the codebase' and changed the workflow: I pull the exact spec from the design node and hand it over as literal values — this font, this pixel size, this hex, this verbatim string. The lesson isn't about one tool; it's that when a collaborator is working blind, the fix is to remove the guessing, not to re-check the guesses. Cheaper to feed exact specs than to debug plausible-looking wrong ones." | `pm-discipline`, `ai-collaboration` |

---

### Phase 2 — Remaining homepage sections built (2026-05-24–26) ✅

All homepage sections are now built and composed in `app/page.tsx` in scroll order:

1. `<Hero />` — split desktop/mobile per ADR-003 ✅ (logged above)
2. `<StatBar />` — continuous CSS marquee, 5 stats ✅ (logged above)
3. `<BeSeen />` — scroll-pinned scrollytelling, 3 stages ✅ (logged above)
4. `<ThreeModes />` — split desktop/mobile per ADR-003
5. `<UnderTheHood />` — split desktop/mobile per ADR-003
6. `<LightMeetsVapor />` — single responsive component, Framer Motion parallax scroll + intersection-observer text reveal
7. `<WhereItLives />` — venue marquee (CSS animation, duplicated-track technique for seamless loop) + animated headline block with intersection observer
8. `<CommonQuestions />` — split desktop/mobile per ADR-003
9. `<WhatWereShipping />` wrapping `<EditionsSection />` + `<ProductDisplay />` ✅ (logged above)

**ThreeModes:** Three product modes (Fade, Pulse, Strobe or equivalent) with shared `useModesState.ts` hook. Split per ADR-003 — structural layout divergence between breakpoints, not just reflow. Files: `ThreeModesDesktop.tsx`, `ThreeModesMobile.tsx`, `ThreeModes.tsx` (CSS-toggle wrapper), `modes.content.ts`, `useModesState.ts`.

**UnderTheHood:** Engineering specs / exploded-view section. Split per ADR-003. Files: `UnderTheHoodDesktop.tsx`, `UnderTheHoodMobile.tsx`, `UnderTheHood.tsx`, `underthehood.content.ts`.

**LightMeetsVapor:** Full-height parallax section ("WHERE LIGHT AND VAPOR MEET"). Single responsive component. Framer Motion `useScroll`/`useTransform` for parallax bg; intersection observer triggers text reveal. Separate aspect ratios per breakpoint (375/600 mobile, 8/5 desktop). Respects `prefers-reduced-motion`.

**WhereItLives:** Venue/lifestyle placement section. CSS marquee strip of venue cards (same duplicated-track technique as StatBar — consistent pattern across the codebase now). Animated headline + body block. Files: `WhereItLives.tsx`, `whereitlives.content.ts`.

**CommonQuestions:** FAQ accordion section. Split per ADR-003. Files: `CommonQuestionsDesktop.tsx`, `CommonQuestionsMobile.tsx`, `CommonQuestions.tsx`, `commonquestions.content.ts`.

---

### Phase 2a/2b/2c + Phase 3a/3b/3c-1 — Commerce UI on a local store (2026-05-25) ✅

The full commerce UI is built and verified against the local cart store. Shopify is still untouched (Phase 4). Each chunk was one Bolt prompt, plan-reviewed against the real Figma node before code, committed separately.

**Phase 2a — local cart store (`lib/cart/store.ts`).** Zustand + `persist` (key `litsaber-cart`). Shopify-shaped `CartLine` ({ id, variantId, qty, title, variantTitle, price, image }). Actions: `addItem` (on matching variantId increments by incoming qty, else pushes a line with `crypto.randomUUID()` id), `removeItem`, `updateQty` (qty<=0 → remove), `clear`. Derived hooks: `useItemCount`, `useSubtotal`, `useCartItems`, `useCartId`. **`cartId` stays `null` through Phases 1–3** — it is Shopify's server cart handle (set by `cartCreate` in Phase 4); a local UUID there would be a value Shopify rejects, forcing Phase 4 to special-case it. The line-level `id` gets the local UUID; that's correct. Verified in isolation with a temporary DEV harness (add/increment/remove/clear, subtotal math) before any UI consumed it; harness removed before commit.

**Phase 2b — selection wiring.** Thumbnail click-to-swap, style select (Silver/Gold), bundle select (Single/Two Pack), and reactive headline price — all local component `useState`, NOT cart state. Active/inactive states from node `3703:7914`: active border `#00E5FF`, inactive `#424242`, card bg `#120F2C`.

**Phase 2c — conditional CTA.** Silver + ADD TO CART → `addItem` then opens the drawer. Gold → swaps the bundle+CTA region for the inline `WaitlistCard` at the 2b seam. BUY NOW stays inert (Phase 4 Shopify checkout).

**Bug — `useCartActions` infinite render loop.** First implementation returned a fresh object literal `{ addItem, removeItem, ... }` from a single Zustand selector. Zustand compares selected values by reference; a new object every render reads as "changed," triggering re-render → new object → re-render. React killed it with "Maximum update depth exceeded." Fix: select each action individually (`useCartStore((s) => s.addItem)`), since action functions are created once in `create()` and keep stable references. Root principle: when a system decides "did this change?" by identity, you must hand it stable identities — a fresh wrapper reads as perpetual change. The hook abstraction was kept; only its internals changed.

**Phase 3a — UI store + CartDrawer.** New `lib/ui/store.ts` (Zustand, no persist) holding `isCartOpen` + `openCart`/`closeCart` — deliberately separate from cart *data*. CartDrawer mounted once in the root layout (openable site-wide), flex-column (fixed header / `flex-1` scrolling list / pinned footer), slide-in with `prefers-reduced-motion` fallback, Esc + backdrop close, focus management. Reads everything from the store — no hardcoded Figma mock values. NO empty state in the drawer (it only opens via `openCart`, which only fires after `addItem`, so zero-items is unreachable). A "VIEW CART" link was added to the drawer footer (navigates to `/cart` + closes drawer) so the cart page isn't orphaned — the navbar icon opens the drawer rather than navigating.

**Navbar cart badge wiring.** The cart icon was built in the foundation phase with a hardcoded `0` and no handler — an unfinished element, not a regression. Wired to `useItemCount()` (badge hidden at 0, pluralized aria-label) and `openCart()`.

**Phase 3b — `/cart` page.** RSC shell + `CartPageBody` client component. Reuses Navbar/Footer from layout; the "FESTIVAL DROP LIST" email signup in the Figma node was deliberately deferred to 3c (it's a HubSpot form). Two-column desktop / stacked mobile, items table + Order Summary, all store-driven. Empty state LIVES HERE (the page is directly reachable via the drawer link and direct URL, unlike the drawer). The shared trust-badge block was extracted to `components/cart/TrustBadges.tsx` and imported by both drawer and cart page rather than duplicated.

**Phase 3c-1 — HubSpot seam + reusable WaitlistForm.** Decided custom-form → HubSpot Submission API, NOT HubSpot's embed script (the embed injects HubSpot markup that fights the dark/cyan design and blocks the in-place success state). Route handler `app/api/subscribe/route.ts` accepts `{ email, list }`, maps `list` → form ID server-side, POSTs to `api.hsforms.com/submissions/v3/integration/submit/{portal}/{formId}`. No API key needed — the Forms Submission API is public/keyless (same path the embed uses); the CRM API would need a token but we're not touching it. Form IDs live in env (server-only, no `NEXT_PUBLIC_`) with literal fallbacks; the orphaned `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` was removed. `WaitlistForm` is one reusable component (`list`, `headline`, `copy`, `buttonLabel`, `source`) with an idle→submitting→success→error state machine, email-only, replace-in-place success. `semantic.error` (`#F56565`) added to `tokens.json` + `tailwind.config.ts` rather than borrowing CTA pink for errors. `WaitlistCard` reduced to a thin wrapper over `WaitlistForm`.

- **HubSpot IDs:** portal `244547358`, region `na2`, Gold form `d499701a-eb43-4c0e-a6cd-b56a57a98433`, General/$X-off form `2a41aa81-1b55-4bcd-97e5-b2b3fe23ee69`. (Offer amount $5 vs $10 still to reconcile in copy.)
- **reCAPTCHA 502:** first live submission returned 502 — the route faithfully reporting that HubSpot rejected the POST. Cause: reCAPTCHA was enabled on the HubSpot form, which blocks the custom-API path. Turned off in HubSpot; submission then succeeded and the contact landed in the CRM.
- **Spam protection (replacing reCAPTCHA):** since the submission endpoint is public, protection moves to our layer — honeypot field (silently 200s without forwarding if filled) + per-IP rate limit in the route. Cloudflare Turnstile deferred unless real abuse appears. Sized for dumb volume bots, not a targeted attack; no user friction.

**Still open from this stretch:** WaitlistForm border was specced to cyan-20% per the 2c Figma node — confirm it didn't inherit a drifted value. Offer-amount copy ($5 vs $10) unreconciled. Rate-limit durability (in-memory resets on cold start vs KV/Upstash) to confirm.

**Workflow note (recurring):** Bolt again reported it had updated working-memory.md when it hadn't (cf. beat #16). This entry was written manually. Bolt's self-reports describe intent, not action — the doc is maintained outside the builder.

**Story beats captured (Commerce Phases 2–3)**

| # | Beat | Tag |
|---|------|-----|
| 30 | "An infinite render loop in the cart-actions hook traced to a Zustand footgun: returning a fresh object literal from the selector. The store compares by reference, so a new object every render reads as a change, which triggers another render. The fix was to hand it stable identities — select each action individually, since they're defined once. The general lesson outlived the bug: when a system asks 'did this change?' by identity, wrapping your data in a new container each read is the same as lying to it." | `integration-depth` |
| 31 | "Built the cart in strict dependency order — data store first, verified in isolation with a throwaway harness, THEN the selection UI, THEN the drawer and page that read it. The discipline that paid off: the store's shape mirrors Shopify, so Phase 4 swaps the store's internals without touching a single component. Each surface that reads cart state (drawer, page, navbar badge) is just a view of one source — change a quantity anywhere and all three update because there's nothing to keep in sync." | `pm-discipline`, `integration-depth` |
| 32 | "Two surfaces that look identical needed different states. The cart drawer can never be empty — it only opens as a consequence of adding an item — so an empty state there is unreachable code. The cart page is a real destination reachable by URL, so it must handle empty. Built the states each surface can actually reach, not the states it superficially resembles." | `pm-discipline` |
| 33 | "Chose custom form → HubSpot's public Submission API over their drop-in embed. The embed would have rendered HubSpot's own markup inside our modal — wrong fonts, wrong colors, and no way to do the calm in-place success state. The tradeoff I accepted: the submission endpoint is public and keyless, so spam protection became my job (honeypot + rate-limit) instead of HubSpot's reCAPTCHA — which I'd had to disable anyway because it was silently 502-ing the API path. Brand control over the form was worth owning the spam layer." | `integration-depth`, `tool-choice` |

---

### Phase 2 — Quantity discount refactor (2026-05-27) — building

**What changed:** The 2026-05-23 "Two Pack as logical single cart line" model was reversed in favor of a quantity discount on a single SKU. Cart holds real quantities; PDP exposes a curated selector that maps each option to a quantity.

**Trigger for the reversal:** A user question — "Can someone buy 3 or 5? How does that work?" The May 23 model had no clean answer. Either the cart logic had to grow a "Two Pack" string that meant qty 2 PLUS a separate qty field for everything else (two ways to represent the same dimension), or every higher tier needed its own logical-line treatment (a SKU explosion in cart presentation, not just in Shopify). Neither held up.

**Decisions locked (2026-05-27):**

1. **Cap: 5 units per add-to-cart action** for Silver. Gold revisited at launch (the mix-and-match question lands then; until Gold ships there is no mix to enable).
2. **PDP selector pattern: Pattern B** — Single / Two Pack as discrete radios + a "More" radio that reveals a qty stepper for 3 / 4 / 5. Pattern B keeps the highest-converting tiers (1, 2) as curated marketing surfaces; treats 3–5 as the "less curated" tail without bloating the PDP with five separate radios (Pattern A) or losing the Two Pack narrative entirely (Pattern C, pure stepper).
3. **No mix-and-match UI for now.** Revisited when Gold ships.
4. **Discount tiers** (defined in `lib/cart/pricing.ts`):

   | Qty | Total | Per-unit | Saved | % off |
   |---|---|---|---|---|
   | 1 | $59.99 | $59.99 | — | — |
   | 2 | $99.99 | $50.00 | $19.99 | 17% |
   | 3 | $134.99 | $45.00 | $44.98 | 25% |
   | 4 | $169.99 | $42.50 | $69.97 | 29% |
   | 5 | $199.99 | $40.00 | $99.96 | 33% |

   Each tier's per-unit drop creates a real incentive to move up. $199.99 at the cap is the marketable "save $100" anchor. $40/unit floor stays well above wholesale Tier 1 ($24/unit) — channel separation preserved. At $13.33 landed cost, ~67% gross margin holds even at the deepest tier.

5. **Cart drawer + page: no quantity stepper.** PDP owns quantity selection. Customers remove + re-add to change quantity. The store's `updateQty` action stays for Phase 4 / programmatic use; only the UI control is removed.

6. **Cart line representation:** real qty of the Silver variant, displayed as "Litsaber Silver × N" with the tier total. "Two Pack" stops being a string the cart knows about — it's now purely a PDP UI affordance.

7. **At qty 5, surface a wholesale link** on the PDP ("Need more? See wholesale →"). Routes high-quantity buyers to the right channel without blocking the add-to-cart.

**Why the reversal (third iteration on this decision):**

- Iteration 1 (pre-May 23): dedicated $99.99 Two Pack variant. Reversed because it would split inventory for a single physical good.
- Iteration 2 (May 23): single SKU with the Two Pack modeled as one logical cart line at $99.99 ("Two Pack" title, internal qty handling). Worked for 1 and 2 units; broke down when planning for 3 / 4 / 5.
- Iteration 3 (this entry): quantity is the dimension; the cart holds real quantities; tier pricing applies via a pricing module that becomes Shopify discount rules in Phase 4. The cart no longer carries marketing metadata as a name; the marketing lives on the PDP where it belongs.

**Phase 4 implication confirmed:** Native Shopify Bundles is now OFF the table — it doesn't expose variant IDs through the Storefront API, which a headless cart requires. The Phase 4 swap becomes: same `addItem(variantId, qty)` shape, but the store's action body POSTs to `cartLinesAdd`. Shopify automatic discounts (one per quantity threshold) handle the tier pricing. The component layer doesn't change.

**Build chunks:**
- Chunk A: cart store refactor + PDP Pattern B selector + `lib/cart/pricing.ts` module (one commit) ✅
- Chunk B: remove quantity stepper from drawer + cart page (one commit) ✅

**Chunk A shipped (2026-05-27):**

Files changed:
- `lib/cart/pricing.ts` (NEW) — `TIER_PRICES`, `MAX_QTY`, `BASE_UNIT_PRICE`, `getTierPrice`, `getTierSavings`, `getTierUnitPrice`. Prices clamp to [1, 5].
- `lib/cart/store.ts` — `useSubtotal` now uses `getTierPrice(i.qty)` per line. Added `useCartLineTotal(lineId)` helper. CartLine comment updated: `price` is the base unit price (59.99); tier total is always derived, never stored.
- `components/home/ProductDisplay/productdisplay.content.ts` — removed `BUNDLE_PRICES` record (replaced by derived pricing in the component). Added `BundleId` type union (`"single" | "twopack" | "more"`). Added `"more"` to `BUNDLE_OPTIONS` with `price?: string` (optional, undefined for "more" since it's dynamic).
- `components/home/ProductDisplay/ProductDisplay.tsx` — replaced `activeBundle` state with `BundleId` type. Added `moreQty` state (default 3). `selectedQty` derived from the combination. `displayPrice` derived from `getTierPrice(selectedQty)`, not a static string lookup. New props passed to `BundleAndCTA`.
- `components/home/ProductDisplay/BundleAndCTA.tsx` — full refactor. Removed `CART_LINE_MAP`. New props: `moreQty`, `onMoreQtyChange`, `selectedQty`. Label renamed "SELECT QUANTITY". Three option rows. "More" row reveals inline stepper (3–5, disabled at boundaries). Wholesale nudge at qty 5. `addItem` now sends `variantId: "silver"` (mock, single constant), `qty: selectedQty`, `variantTitle: "Silver"` (edition only, no pack-size name).
- `components/layout/CartDrawer.tsx` — variant subtitle: `{line.variantTitle} × {line.qty}`. Line price: `getTierPrice(line.qty)`.
- `components/cart/CartPageBody.tsx` — same variant subtitle + getTierPrice on mobile inline price and desktop TOTAL column. PRICE column stays `line.price` (per-unit, unchanged).

**localStorage note:** Existing localStorage entries with `variantId: "silver-single"` or `"silver-twopack"` are orphaned — they won't merge with new "silver" adds, but they display correctly (tier pricing applies based on their qty). Recommend one-time clear for testers via browser DevTools → Application → Local Storage → delete `litsaber-cart`.

**Chunk B shipped (2026-05-27):**

Files changed:
- `components/layout/CartDrawer.tsx` — removed qty stepper (`−`/`+` buttons and qty display) from each line item. Static "× N" in the subtitle remains. Line shows tier price + Remove link only. `updateQty` un-destructured from `useCartActions()`.
- `components/cart/CartPageBody.tsx` — same: `<QtyStepper />` call removed, `QtyStepper` sub-component function deleted. Remove button stays. `updateQty` un-destructured. `useCartActions` destructure now only extracts `removeItem`. `updateQty` action remains in store (`lib/cart/store.ts`) untouched for Phase 4 / programmatic use.

**Story beat captured**

| # | Beat | Tag |
|---|------|-----|
| 34 | "Reversed the bundle model a third time. First call was a dedicated $99.99 variant — clean code, splits inventory for a single physical good. Second call was a single SKU with the 2-Pack as a logical cart line — works for 1 and 2 units, has no answer when someone wants 3 or 5. Third call follows from one question I should have asked sooner: can someone buy 3? The honest answer made 'Two Pack as a name in the cart' obviously wrong. Quantity is the dimension. The cart holds quantities. Marketing names live on the PDP. The pattern: when a design decision keeps breaking under follow-up questions, the decision is wrong, not the questions. Reversal isn't waste — staying with the broken decision is." | `pm-discipline`, `integration-depth` |

---

### Phase 4 — Shopify Integration + Reviews Provider (commerce complete 2026-05-28 ✅ — reviews provider still pending)

Three chunks, in order. The whole phase is governed by the Phase 2a architecture decision: the cart store's interface stays identical; only its action bodies change. The component layer doesn't move.

**Phase 4a — Storefront API client + env vars + typed product/variant fetch. Read-only. No cart yet.**
- Add Storefront API client at `lib/shopify/client.ts`. GraphQL over `fetch`, typed responses, Next.js cache hints.
- Env vars: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_TOKEN`, `SHOPIFY_API_VERSION`. Server-only (no `NEXT_PUBLIC_` prefix). Add to `.env.example` with placeholder values.
- Generated TypeScript types for the product/variant payload — either via `graphql-codegen` or hand-typed if codegen feels heavy for the surface area.
- First real fetch: `getProductByHandle('litsaber-og')` returning typed product + variants (Silver, Gold). Variant IDs sourced from Shopify replace the hardcoded mock IDs in the PDP.
- Critical: NO cart mutations yet. NO swap of store action bodies. The local cart still runs locally with localStorage persistence. This phase verifies the client works and the data shape lines up; it does not touch commerce flow.
- Deliverable check: PDP renders with variant IDs pulled from Shopify; cart still operates entirely against the local store; nothing user-visible has moved.

**Phase 4b — Swap store action bodies to Shopify Cart API mutations.**
- Replace the local-state action bodies in `lib/cart/store.ts` with Storefront API mutations: `cartCreate` (on first add), `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`. `cartId` flips from `null` to the Shopify-returned ID and persists.
- Same interface — `addItem(variantId, qty)`, `removeItem(lineId)`, `updateQty(lineId, qty)`, `clear()` — every component that reads the store continues to work without code change. This is the payoff for the Phase 2a discipline.
- localStorage persistence model adjusts: store the `cartId` (durable across sessions) and re-fetch line data from Shopify on hydration, rather than persisting line data locally. Avoids stale cart drift.
- Optimistic updates on the UI side; reconciliation on the Shopify response. Decide error handling pattern (toast + revert vs. silent retry) during this build.

**Phase 4c — Wire Buy Now / checkout to `checkoutUrl` redirect + tier pricing migration.**
- Buy Now button (currently inert) redirects to the Shopify `checkoutUrl` returned by the cart. Hosted checkout handles Authorize.net.
- **Tier pricing migration:** the `lib/cart/pricing.ts` constants from the 2026-05-27 refactor become Shopify automatic discount rules at this point. One discount per quantity threshold (2 / 3 / 4 / 5), each with the matching amount-off-per-unit so the totals land on $99.99 / $134.99 / $169.99 / $199.99. The pricing constant remains as a client-side fallback for cart UI rendering before checkout; Shopify is the source of truth at checkout.
- Webhook handlers for inventory (out-of-stock state on PDP when variant inventory drops).

**Plus:** Reviews provider integration (ReviewInfra per ADR-002 — Path A widget embed by default, Path B if their read API turns out to exist).

---

### Phase 4 — Commerce integration complete (2026-05-28) ✅

The Phase 2a seam held: the cart store's interface never changed; only its
action bodies were swapped to Shopify. Every component that reads cart state
kept working untouched. Each chunk was one Bolt prompt, plan-reviewed against
the real artifact before any code.

**4a — Storefront client + PDP wiring.**
- Reused existing `lib/shopify/client.ts` (`shopifyFetch`) and
  `lib/shopify/queries.ts` (`getProductByHandle`) instead of letting Bolt
  duplicate them with a client-side hook.
- Variant fetch is a server-component fetch in `app/shop/litsaber-og/page.tsx`,
  drilling `variantId` + `available` as props (not a client `useEffect`).
- Variant matched by `sku === "LTS-OG-SLV"`, not title-includes. Added `sku` to
  the query and the `ShopifyVariant` type.
- Locked variant: Silver, SKU `LTS-OG-SLV`,
  GID `gid://shopify/ProductVariant/45098118316239`, $59.99, handle
  `litsaber-og`, store `innovapeconcepts.myshopify.com`. No Gold/Two Pack
  variant (waitlist + quantity-discount models respectively).
- `/shopify-check` debug route added — REMOVE pre-Phase-7.

**4b — Cart store → Shopify mutations.**
- `lib/cart/store.ts` rewritten: `addItem` → `cartCreate` (first) / `cartLinesAdd`;
  `removeItem` → `cartLinesRemove`; `updateQty` → `cartLinesUpdate`; `clear` →
  remove all; `hydrate` → `CART_QUERY` on load.
- Persistence model changed: `partialize` stores ONLY `cartId`; line data is
  re-fetched from Shopify on hydration (server cart is source of truth, local
  line data only drifts). `CartHydrator.tsx` client component mounts in
  `app/layout.tsx`; layout stays a Server Component.
- Six fixes added to Bolt's plan before code: correct `merchandise { ... on
  ProductVariant { id } }` fragment; price read from `cost.totalAmount.amount`;
  `pendingCartCreate` promise guards the double-click race; hydrate clears a
  stale `cartId` on null; `clear()` keeps `cartId` until success then nulls;
  env-guard on hydrate.
- Verified live: adding the same variant twice merges to one line, qty 2.
  Cart returns a working `checkoutUrl`. Toast deferred (`console.error` +
  `// TODO: wire toast` at revert sites).

**4c — Checkout + tier-discount sourcing.**
- 4c-1: wired the three inert checkout buttons (CartDrawer, CartPageBody ×2, PDP
  BUY NOW) to redirect to `cart.checkoutUrl` via a `useCheckoutUrl()` hook. BUY
  NOW awaits `addItem`, reads `useCartStore.getState().checkoutUrl` (not the
  stale hook value), redirects without opening the drawer. Verified.
- 4c-2: prices sourced from Shopify. Discounts are already created in Shopify and
  applied at cart level — qty 2 returns `cost.totalAmount.amount = "99.99"`.
  Added `lineTotal` to `CartLine` from that field; `useSubtotal`/`useCartLineTotal`
  read it; `lib/cart/pricing.ts`/`getTierPrice` demoted to optimistic-UI + PDP
  display fallback. Savings = `Math.round(line.price * line.qty - line.lineTotal)`.
  Shopify is the source of truth for money at checkout; the client module is
  fallback only.

**MAX_QTY cap (closed a real over-cap pricing hole).**
- The PDP capped at 5 but the cart didn't (BUY NOW 5 → back → ADD 2 = 7, priced
  wrong because discounts only cover 2–5). Enforced the cap at the store
  chokepoint (`addItem` + `updateQty`), in both optimistic state and the Shopify
  mutation vars — not in BUY NOW logic. Existing-line path uses `cartLinesUpdate`
  with `quantity: resultQty` (idempotent "set to exactly 5," can't overshoot on
  retry). `capReached` transient flag (excluded from `partialize`) +
  `useCapReached()` hook; CartDrawer shows "Max 5 per order. Need more?
  See wholesale →" (`/wholesale`). Four stacking tests pass — Shopify payload
  shows `quantity: 5`, not 6.

**Full test-mode purchase ✅.** Qty 5 through Authorize.net hosted checkout;
order landed in Shopify admin at the discounted $199.99 total.

**Promo popup cookie fix ✅.** `dismiss()` previously only hid the popup and set
no cookie, so it reappeared. Now `dismiss()` sets `COOKIE_SEEN` for 72h;
`markSubscribed()` keeps the 365d `COOKIE_SUBSCRIBED`; the re-arm path re-reads
both cookies. Verified: dismiss → reload within 72h → stays gone.

**Promo code architecture decided → ADR-004 (Architecture A).** HubSpot stores
the contact + sends the code; Shopify owns one shared `WELCOME10`/`LITSABER`
code at "$10 off, one use per customer." Two suppression layers kept separate
(client cookie stops the popup; Shopify stops code reuse). Frontend promo box
(Figma `3770:1315`) deferred and bundled with the backend as a pre-launch unit
on top of Phase 5 instrumentation. Offer locked at $10.

**Cleanup / carry-forward (tracked in Open Questions):** remove `console.log("[PDP]")`
from the PDP page; remove `/shopify-check` route pre-Phase-7; flip Authorize.net
test → live before launch; ReviewInfra integration was in the Phase 4 plan but
this phase was commerce-only — still pending.

**Recurring Bolt lessons (banked):** Bolt summarizes files when asked for their
contents (now 3rd+ occurrence) — always demand the literal file in a code block.
Bolt declares its own code correct without reading every line — the availability
bug lived in the snippet it pasted but never quoted. Plan-review-as-PR-review
caught real bugs in 4a and 4b before any code was written.

**Story beats captured (Phase 4)**

| # | Beat | Tag |
|---|------|-----|
| 35 | "I reviewed the builder's plan before it wrote a line of code, the way you'd review a PR. Three real bugs in the 4a plan, six gaps in the 4b plan, all caught at the plan stage. It is far cheaper to fix a paragraph than a commit, and the builder doesn't push back on a plan the way it defends code it's already written." | `ai-collaboration`, `pm-discipline` |
| 36 | "The add-to-cart button stayed live after I marked the variant unavailable in Shopify. The builder pasted the file, declared its own code correct, and pointed me at a different function. The bug was one line it had pasted but never quoted back in its analysis: it checked whether the variant existed, not whether it was available for sale. The lesson is blunt. When the tool says 'my code is correct,' the bug is in the line it skipped reading." | `integration-depth`, `ai-collaboration` |
| 37 | "Three different Shopify admin states — product in draft, zero inventory, variant unpublished from the channel — all return the same null from the Storefront API. One code branch handles all three correctly, but they're indistinguishable to the API, so you can't show 'sold out' vs 'paused' vs 'discontinued' until a second variant exists. Logged it so I don't rediscover it the hard way when Gold ships." | `integration-depth` |
| 38 | "On the Shopify swap the obvious move is to persist the whole cart locally. I persisted only the cart ID and re-fetch the lines from Shopify on load. The server cart is the source of truth; cached local line data only drifts. The Phase 2a seam paid off exactly as designed — I swapped the store's internals and didn't touch a single component that reads it." | `integration-depth`, `pm-discipline` |
| 39 | "The PDP capped quantity at 5 but the cart didn't. Buy five, go back, add two more, and you're at seven, priced wrong because the discounts only cover two through five. I fixed it at the store action, not the button, so every path that can add inventory passes through one cap. And I used an idempotent 'set quantity to exactly 5' update so a retried request can't overshoot. Enforce invariants at the chokepoint, not at every entrance." | `integration-depth`, `pm-discipline` |
| 40 | "I'd written a client-side pricing module. Once the real discounts went into Shopify, the cart started returning the discounted total in its own cost field, so I sourced price from Shopify and demoted my module to an optimistic-UI fallback. Two sources of truth for money is a bug waiting to happen. The server wins at checkout, so the server has to win in the cart too." | `integration-depth`, `pm-discipline` |
| 41 | "The dismissed promo popup kept coming back because dismiss only hid it and never set a cookie — only showing it did. I fixed dismiss to suppress for 72 hours. The deeper clarity was realizing 'stop the popup' and 'stop the code being reused' are two different layers: a browser cookie on the client and Shopify's one-per-customer rule on the server. Conflate them and you ship a promo that either nags forever or pays out twice." | `integration-depth`, `pm-discipline` |

---

### Phase 5 — Observability Instrumentation

PostHog + Vercel Analytics + Supabase mirror. Event taxonomy defined pre-launch. Success metrics document committed before traffic arrives. Floating promo trigger (12s + exit-intent) and frequency cap (72h dismiss / 365d subscribe) are now LOCKED; what remains here is instrumenting the promo funnel (popup shown → submitted → emailed → code applied → purchased) so the ADR-004 promo bundle launches into a measured funnel, not a blind one.

#### 5.1 PostHog identity — identify-on-email fixes channel attribution (2026-06-18)

**Trigger:** The "Acquisition Channel" tile (`lo1DdHbT`, purchases by channel)
returns all "Unknown." Question raised: the purchase event is a webhook, so it
never carries channel metadata — how do we get channel onto it?

**Diagnosis (run live via PostHog MCP, not reasoned from memory):**
- Channel type is derived at FIRST TOUCH from referrer/UTM, captured client-side
  by posthog-js. The purchase event is a `posthog-node` webhook event
  (`$is_server: true`), no referrer/UTM, so it structurally cannot carry an
  event-level channel. Correct approach is to read channel off the PERSON, not the
  event.
- First hypothesis (webhook `distinct_id` stitch broken) was DISPROVEN by the data.
  Real purchase persons carry full browser histories on the SAME person as their
  `posthog-node` purchase (one test person: 759 pageviews + device_activated +
  checkout_started + 5 purchases). The `posthog_distinct_id` cart attribute is
  being read and matched correctly. Only the #9999 / `order_...` order was an
  orphan (webhook fallback distinct_id, no browser session — a manual/admin order).
- REAL ROOT CAUSE: posthog-js runs in `person_profiles: 'identified_only'`, set
  implicitly by `defaults: "2026-01-30"` in `app/providers.tsx`, and `identify()`
  is never called (0 `$identify` events; 0 of 9 persons identified; zero stored
  `$initial_*` properties project-wide). In identified_only mode anonymous persons
  never get first-touch attribution persisted, so `$virt_initial_channel_type` can
  only ever resolve to "Unknown" — for everyone.
- CORRECTS the earlier note that the channel tiles read Unknown only "until
  UTM-tagged campaigns exist post-launch." UTMs are necessary but NOT sufficient:
  without identify, even a UTM-tagged visit resolves to an anonymous,
  property-less person. Two blockers, not one.

**Decision (locked): identify on email, NOT `person_profiles: 'always'`.**
- Rationale: keeps top-of-funnel anonymous (anonymous events up to 4x cheaper than
  identified), only upgrades a person once they are a real lead, and aligns the
  PostHog person identity with the HubSpot contact identity on email — the exact
  seam ADR-006 runs on.
- Tradeoff accepted: forward-looking only (the existing 5 purchases stay Unknown);
  resolves channel only for buyers who hand over an email on-domain.

**Privacy guard (load-bearing):** `posthog_distinct_id` is appended to
`checkoutUrl`, so it must NOT become the email after identify (PII in a URL leaks
to server logs, the Referer header, and browser history). cartCreate snapshots
`$device_id` (stable anon id, never flips to email) instead of `get_distinct_id()`.
PostHog's identify-merge resolves the server purchase onto the identified person, so
channel still lands with NO PII in the URL. No email ever reaches a URL or a log.

**Implementation (shipped):**
- NEW `lib/analytics/identify.ts`: `identifyByEmail(email)` (normalizes
  trim+lowercase, guards `__loaded`, calls `posthog.identify(email, { email })`)
  and `getCartAnalyticsId()` (returns `$device_id`; null if unavailable or contains
  "@"; caller writes NO attribute on null and never falls back to the email).
- `identifyByEmail` called at promo email submit (immediately before the
  `promo_email_submitted` track) and conditionally at `checkout_started` if an
  email is already in hand. Three checkout sites: CartDrawer + CartPageBody (x2).
- NEW sessionStorage key `litsaber_email` (normalized; sessionStorage NOT
  localStorage, so it clears on tab close — better posture for stored PII and the
  shared-device/festival-kiosk case). Written in `WaitlistForm` onSuccess;
  `onSuccess` widened from `() => void` to `(email: string) => void`
  (backward-compatible for callers that ignore the arg).
- `lib/cart/store.ts` cartCreate: `posthog_distinct_id` attribute built from
  `getCartAnalyticsId()`, written only when non-null; `get_distinct_id()` removed
  from this path.
- Webhook handler UNTOUCHED — it still echoes whatever distinct_id the cart
  carries, and `$device_id` is a valid distinct_id for the person.
- `app/providers.tsx` untouched; `person_profiles` stays on its current default.

**Coverage boundary + escalation:** email-capturing buyers resolve to a real
channel; no-email buyers and orphan/admin orders stay Unknown. Full coverage would
require `person_profiles: 'always'`, at identified-event pricing on the whole
pageview firehose — rejected for now.

**Verification (post-deploy):** incognito entry with a UTM
(`/?utm_source=tiktok&utm_medium=social`) → promo submit → add to cart → test
order. Confirm: dev log shows a UUID-shaped `phId` (not an email), the generated
`checkoutUrl` contains no "@", and the purchase row resolves to the email person
with a populated `$initial_utm_source` and a single matching `person_id`. Final
confirmation: the existing Trends breakdown shows the order under a real channel,
not Unknown.

**Possible ADR:** the identity model (when and how we promote anonymous to
identified, plus the device-id-in-cart-attribute rule) is a candidate for a short
ADR sibling to ADR-006.

**Recurring Bolt lesson (re-applied):** plan-review-as-PR-review caught two issues
before code — a garbled "is the posthog import still needed" note in the store edit
(made it a verify-then-act, not a guess) and the sessionStorage key needing a
namespaced, normalized, session-scoped spec.

**Verified end-to-end on preview (2026-06-19):** Order #1014 / `40CEEZUL8`.
purchase event (posthog-node webhook) sent with the device-id distinct_id
`019ede1c-...` resolved onto the identified person (email
matthewtyler1986@gmail.com) and returned channel = Direct, not Unknown. cartCreate
payload confirmed `posthog_distinct_id` = the $device_id UUID with no email; no PII
in the cart attribute or checkout URL. Confirms identify-merge resolves a
server-side purchase onto the email person. Direct (not campaign) because this run
was a no-UTM entry; tiktok/Organic-Social path not yet exercised live but mechanism
is identical. Coverage boundary (no-email buyer stays Unknown) and WaitlistForm
signature regression (Test 5) not yet run.

**Webhook server-side identify (2026-06-19) — building.** Decision to close the
no-popup-purchase gap: the Shopify order webhook now also calls posthog-node
identify so the buyer's email is associated and the purchasing device merges into
the email person, not just the popup-submitter path. Triggered by a live boundary
case, a purchase on a fresh device id (`2f415408`) did NOT merge with the identified
email person because identify never ran in that session, and the email typed at
Shopify's hosted checkout is off-origin and invisible to posthog-js. Confirmed the
correct mental model: PostHog identity is forward-linking on the current device, not
a retroactive lookup keyed on the email value; same email + different device + no
identify = a separate person, every time. A purchase event merely CARRYING an email
property does not trigger any merge; only an explicit identify does.

Load-bearing design choices:
- **identify with the DEVICE ID as distinctId, email as a property**
  (`identify({ distinctId: deviceId, properties: { email } })`), NOT the email as
  distinctId. Device-id-as-distinctId merges the device's browsing session into the
  email person; email-as-distinctId would create a parallel email-keyed person and
  merge nothing. Mirrors the client identify, which merges the current anon id into
  the email person.
- **posthog-node signature differs from posthog-js:** server is
  `identify({ distinctId, properties })`, client is positional `identify(email,
  props)`. Copying the client shape server-side would pass email as distinctId, the
  exact wrong identifier. Verify against the installed version.
- **Guard: only identify when the cart attribute is a real device id** (non-empty,
  not an `order_` fallback, no "@"). Identifying with an `order_` id or stray value
  merges junk into the email person PERMANENTLY and can chain-merge unrelated
  persons. Orphan/admin orders skip identify and stay anonymous (correct).
- **Normalize email trim().toLowerCase()** to match the client identify key so the
  two never fork.
- **Flush before return:** posthog-node sends async; a serverless webhook can freeze
  before the batch flushes, silently dropping identify AND capture. `await
  posthog.shutdown()` (or version flush() if the client is reused) before responding.
  Same class as the client-side mount-race silent drop.

**Complementary, not a substitute, for person_profiles:'always'.** Server identify
fixes email association and cross-session/cross-device unification. It does NOT
guarantee a resolved channel: a device that was never profiled under identified_only
has no stored `$initial_*`, so it can merge and still read Unknown. Plan: ship the
webhook identify, measure how many merged purchases still read Unknown on real
traffic, then decide on `'always'` from numbers rather than pre-emptively.

**Candidate ADR (sibling to ADR-006):** server-side identity promotion, the
device-id-as-distinctId rule, and the orphan-order skip guard. Server-side person
merging has irreversible failure modes (the guard is the whole safety story), so
this is decision-worthy rather than a quiet webhook edit.

**5.1a — device_type detection (lib/device.ts, new file)**
- Replaced async PostHog dependency with synchronous `detectDeviceType()` using `navigator.userAgent`
- Detects "Mobile" | "Tablet" | "Desktop" at cart creation time
- Always unconditionally written to cart as third attribute (alongside `posthog_distinct_id` and `discount_code`)
- Covers add-to-cart on first visit; returning visitors with persisted cartId get null (designed limitation)

**5.1b — Supabase orders schema migration**
- `ALTER TABLE orders ADD COLUMN device_type TEXT;` (manually run in Supabase SQL Editor)
- Column was missing, causing silent upsert failures while webhook still returned 200 to Shopify
- Existing orders stay null; new orders populate correctly

**5.1c — ActivationTracker fixes (components/activate/ActivationTracker.tsx)**
- **Bug 1 (firing on multiple page visits):** `useRef` guard resets on every component remount during navigation. Fixed: localStorage guard persists across navigation. Fires exactly once per device, never again.
- **Bug 2 (10–20 min delay / not firing):** `trackWhenReady()` relied on `posthog.onFeatureFlags()` callback that was hanging. Fixed: simple `setTimeout(500)` + direct `track()` call, scope to localStorage-guarded condition.
- **Build errors resolved:** removed `(window as any)` type assertions, removed unnecessary posthog loaded check.
- **Result:** event fires ~500ms after `/activate` load on first visit with `is_first_activation: true`, never fires again. Console logs cleaned for production.

**End-to-end verified:** device_type now captures correctly on new purchases (Desktop/Mobile, not null/unknown), orders sync to Supabase with the field populated, and device_activated fires and reaches PostHog.

**Cart-attribute pipe now carries THREE values:**

| Attribute | Source | Destination |
|---|---|---|
| `posthog_distinct_id` | `posthog.get_distinct_id()` (device UUID) | PostHog + Supabase |
| `discount_code` | `sessionStorage.litsaber_discount` | Supabase |
| `device_type` | `detectDeviceType()` (userAgent sync) | PostHog + Supabase |

**Files changed:**
- `lib/device.ts` — new file, `detectDeviceType()` → `"Mobile" | "Tablet" | "Desktop"` via userAgent
- `lib/cart/store.ts` — removed `posthog.get_property("$device_type")`, replaced with `detectDeviceType()`, unconditional push
- `app/api/webhooks/orders/route.ts` — reads `device_type` from `note_attributes`, adds to PostHog purchase event + Supabase insert
- `lib/supabase/client.ts` — `device_type: string | null` added to `OrderRow`/`OrderInsert`
- `components/activate/ActivationTracker.tsx` — refactored to localStorage guard + setTimeout + direct track

**Story beat captured**

| # | Beat | Tag |
|---|------|-----|
| 74 | "The obvious cause was wrong, and only pulling the real data showed it. Everything pointed at the purchase webhook — no channel on the event, must be a broken distinct_id. I queried PostHog instead of trusting the theory and found the stitch was fine: the server purchases were landing on the right browser persons, full histories and all. The real cause was one rung up — the SDK's identified_only default plus an identify() call we never made, so no person ever had attribution to read. Channel was never an event problem; it was an identity problem. Query the artifact before you fix the thing you assume is broken." | `analytics-rigor`, `integration-depth` |
| 75 | "The fix that made channel work also tried to leak the customer's email into the checkout URL. Keying the cart attribute on the live distinct_id would have worked perfectly and pushed a plaintext email into server logs, the Referer header, and browser history the moment identify ran. Caught it and kept the email out by keying the attribute on the stable device id and letting PostHog's merge resolve the purchase onto the identified person on the backend. The metric still lands; no PII touches a URL. The privacy-safe path and the working path were the same path, but only because someone asked where the value ends up." | `pm-discipline`, `integration-depth` |
| 76 | "A purchase didn't recognize a customer who'd bought before under the same email, and the instinct was 'PostHog should know this email.' It doesn't work that way, and naming why was the whole lesson: identity is a forward link from the device that's live when identify runs, not a lookup keyed on the email string. Same email on a new device that never identified is a stranger. The email typed at Shopify's hosted checkout is on Shopify's origin, invisible to our SDK, so it can never trigger a merge. Recognition across devices requires identify to fire on each device, full stop." | `analytics-rigor`, `integration-depth` |
| 77 | "Extending identify into the order webhook is the right fix, but the dangerous version is one keystroke away. The server signature takes the identifier as distinctId, and if you pass the email there you fork the person instead of merging the device; if you pass an admin order's order_ fallback you permanently weld junk onto a real customer. So the design is device-id-as-distinctId, email-as-property, and a hard guard that only fires on a real device id. Server-side identity merges are irreversible, which is exactly why this one gets a guard list and an ADR, not a quiet commit." | `pm-discipline`, `integration-depth` |
| 78 | "PostHog's $device_type is computed after an event fires, so a cart read at creation time gets undefined. The whole cart-attribute pipe was silently failing — the webhook returned 200 to Shopify anyway, but the attribute never wrote. I replaced the async dependency with a synchronous userAgent read at the exact moment the cart exists. Same cart, same three attributes now; Shopify is the source of truth for money, userAgent is the source for device. The pattern: when an integration point doesn't fire, read the artifact (the webhook response, the cart row) to see what actually landed, not what the code intended." | `integration-depth`, `analytics-rigor` |
| 79 | "The ActivationTracker fired on every page visit and hung for 10 to 20 minutes because useRef resets on component remount — navigation remounts the component and triggers another fire, and trackWhenReady() waits on an async callback that sometimes never resolves. Switched to localStorage (persists across navigation) and a timeout (always fires, doesn't wait). The fix had a name — localStorage guard + setTimeout — that made it obvious once I stopped reasoning about the code and started reasoning about the test behavior: 'fires on every visit' + 'resets on navigation' = useRef is the wrong guard. The North Star event is too important to ship guessing." | `analytics-rigor`, `integration-depth` |

### Phase 5 — COMPLETE

Phase 5 instrumentation is now complete end to end:
- PostHog identity: identify-on-email + server-side webhook identify ✅
- Promo funnel: popup shown / submitted / dismissed / code captured ✅
- Device detection: type at cart creation, persisted through purchase ✅
- North Star: device_activated fires once per device on first activation ✅
- Funnel complete: age_gate_confirmed → product_viewed → add_to_cart → checkout_started → device_activated
- Daily flagged sessions pipeline: flags and summarizes friction signals ✅
- Weekly agent: reads both streams (deterministic funnel tiles + qualitative session evidence) ✅

All events firing, all data flowing, all sources of truth locked. Ready for Phase 7 cutover.


---

### Phase 6 — Production Agent (building, 2026-06-14 to 2026-06-16)

**Goal:** A weekly n8n cron that reads PostHog, judges the business against stored targets using the Improvement Kata frame, writes a narrative report plus structured fields, stores both deterministically, and delivers. The agent *proposes* experiments, never *runs* them, and never writes its own numbers into storage.

**Governing principle (locked):** deterministic spine, agent as a single reasoning island. Anything that must happen every run, in order, idempotently, is a node. The agent only does the open-ended part: read numbers plus prior context, produce prose and proposals. Numbers in storage are always the parsed truth, never retyped by the model. This is the same trust discipline that runs through the whole build (Shopify is source of truth for money; the parser is source of truth for metrics).

#### Phase 6.1 — Data layer (PostHog) ✅

**Stale-knowledge corrections banked (Shopify, verified against current docs):**
- Shopify custom-app flow changed 2026-01-01. The old admin "Develop apps > reveal `shpat_` token" path is LEGACY (pre-2026 apps only). Current path: Dev Dashboard > Create app > create a version (App URL defaults to `https://shopify.dev/apps/default-app-home`, which kills the redirect_uri error for non-embedded apps), set scopes, Release, Install.
- New apps do NOT expose a copyable `shpat_` token. Internal automation uses the **client credentials grant**: POST `/admin/oauth/access_token` with `grant_type=client_credentials` + client_id + client_secret, returns a 24h access token. Fine for a weekly cron (mint fresh each run).

**Shopify abandoned-checkout pull: DEAD on Basic plan (decision).** `abandonedCheckouts` requires Protected Customer Data (Level 2 PII) access, gated behind Grow plan or higher. Not worth upgrading. Both Shopify n8n nodes ("Shopify Token" + "Abandoned Checkouts") DISABLED (kept, not deleted, for if we ever land on Grow). Agent runs on PostHog alone. Only loss is dollar-value-at-risk + abandoned-cart contents; the I5 checkout-abandonment tile still gives the rate and count. Manual fallback: Shopify admin Orders > Abandoned checkouts.

**PostHog read mechanism (decision).** Agent reads SAVED dashboard tiles via the dashboard endpoint, NOT the `/query` endpoint and NOT per-insight:
`GET https://us.posthog.com/api/projects/445005/dashboards/{id}/?refresh=true`, Bearer personal key. This works with a personal API key; `/query` returns `403 personal API key access` even with `query:read` scope, AND PostHog's own docs warn `/query` is not a supported export mechanism for scheduled connectors and may break. So the spine never touches `/query`. Two dashboards read in parallel:
- Conversion dashboard `1710621`
- Web Analytics dashboard `1718411`

**`/query` wall → MCP pivot (decision).** The agent's ad-hoc drill-down does NOT use raw `/query` (same wall). It uses the PostHog MCP server as a tool instead. Deterministic spine via dashboard endpoint; agentic investigation via MCP.

**Parser (Code node, verified against real payloads).** One `parseDashboard(json, keyMap)` reads both HTTP nodes by reference and emits `{ posthog_insights, web_analytics }`. Branches on `insight.query.source.kind`:
- `TrendsQuery` → `parseTrends`: series with label, value, `compare` ("current"/"previous"), `order` (disambiguates multi-series tiles, e.g. Top Pages order 0 = views, order 1 = visitors), byDay (zipped days+data with a length guard). Cleans `$$_posthog_breakdown_null_$$` → "Unknown".
- `FunnelsQuery` → `parseFunnel`: groups of steps with count + overallConversion; handles flat and breakdown (array-of-arrays) shapes.
- `HogQLQuery` → `parseSql(result, insight.columns)`: dashboard endpoint shape is `result` = array of row-arrays, `columns` = sibling array of names. Zips to named rows. (This shape was the key verification: it is NOT nested `result.results`/`result.columns`.)
- KEY_BY_SHORT_ID maps short_ids → stable semantic keys so week-over-week survives insight renames. Unmapped short_ids fall back to the raw short_id.

**Web vitals fix (banked).** The four vitals tiles were misconfigured as daily-average line graphs, so the table aggregate summed 7 daily averages and read ~7x inflated (LCP 4554ms). Rebuilt all four as single-value **p75** Number tiles (math "Property value 75th percentile" of the respective `$web_vitals_*_value`, no breakdown, Last 7 days). Now correct: p75 LCP ~1036ms, FCP ~746ms, INP ~40ms, CLS ~0.00004 (unitless, correctly tiny). short_ids preserved by editing in place (LCP `eBn71ObR`, CLS `SE7nl31z`, FCP `gIhhWsuT`, INP `xoq19nNV`).

**Two-dashboard split (decision).** Conversion board stayed the 7-section conversion spine. New Web Analytics board (`1718411`) holds Overview / Pages / Audience / Performance. Sessions & Visitors (`KSPePe45`) is dual-placed (funnel denominator on conversion, traffic headline on web) — one insight, both boards, harmless duplication in the parsed output. The two channel tiles split by denominator: `XQQXrJ0N` "Sessions by channel" (traffic → web) vs `lo1DdHbT` "Acquisition Channel" = purchases by channel (outcome → conversion). Both dormant (all "Unknown"/"Direct") until UTM-tagged campaigns exist post-launch.

**Bounce + duration (SQL tiles, decisions).** Bounce rate reads `$is_bounce` from the sessions table, which PostHog confirmed is the exact field the native Web Analytics tile uses — canonical, not approximate, no agent caveat needed. (Action still open: verify autocapture + `$pageleave`/`$autocapture` are firing at the web-analytics settings, or bounce silently inflates.) Avg session duration SQL returns only a display string ("32m 47s"), no raw seconds, so the agent quotes it and does no math on it; durations are test-inflated by tabs left open anyway.

**Template tiles swept (decision).** PostHog's 7 prebuilt template tiles were evaluated: Website Unique Users + Top Website Pages (Overall) are redundant with our purpose-built tiles; the 3 Organic-SEO/Google tiles are dormant pre-launch; Sessions Per User + Pages Per User are real engagement-depth metrics but `is_sample: true` and badly test-distorted (reload artifact reads as "engaged returning audience"). Kept Sessions/Pages Per User on the board but marked DORMANT in the parser map so the agent ignores them during calibration.

#### Phase 6.2 — Storage layer (Supabase) ✅ table created, write node pending

**Sheets vs Supabase (decision): Supabase.** A structured, machine-read weekly archive wants a queryable, schema-enforced store, not Sheets. New wiring (Supabase was not previously connected to this n8n instance), justified by: exact "most recent prior row" recall as a one-line SQL, durable jsonb that a stray edit can't corrupt, and a clean path to multi-week history later. The service-role key bypasses RLS, so for this private server-only table RLS can stay enabled with no policies (the warning is moot once the credential is the service key). Confirmed working with the service key.

**Memory architecture (decision): two layers, one database, deterministic now.**
- Deterministic week-over-week is the load-bearing layer: a Supabase row per week, exact `SELECT ... ORDER BY report_week DESC LIMIT 1`. A number must never come back through a similarity search.
- Associative recall (pattern-matching over past narratives/hypotheses) is DEFERRED until ~8 to 12 real weekly reports exist. When built, it is pgvector IN THE SAME SUPABASE (not a separate vector DB), embedding the narrative + hypotheses, never the metric rows. Building it now would only embed test-traffic noise.

**Report storage shape (decision): one combined JSON object per week, not individual insight rows and not two columns.** The row's job is point-in-time recall of a complete week retrieved as a unit, so `report_json` holds the whole parsed `{ posthog_insights, web_analytics }` with the two blocks namespaced inside. Individual-insight rows were rejected (30+ rows to reassemble, brittle schema across funnel/trends/sql shapes, no query we actually need). The narrative lives in `report_markdown`; the agent's full structured output lives in `report_data` (feeds the grading loop and the future embedding layer). A PDF mirror of the markdown is rendered and stored in Google Drive (DB row canonical, file is a browsable copy).

**Table (created):**
```sql
create table litsaber_weekly_reports (
  report_week     text primary key,        -- "2026-W25", zero-padded so text-sort = chrono-sort
  report_json     jsonb not null,          -- deterministic parsed metrics, exact recall
  report_markdown text not null,           -- agent narrative
  report_data     jsonb,                   -- agent full structured output (grading + future embeds)
  created_at      timestamptz default now()
);
```

#### Phase 6.3 — Orchestration spine ✅ built, agent node + write/deliver pending

**Topology correction (decision).** The Supabase read was initially wired as an agent TOOL; moved to a deterministic upstream node (last-week recall is the load-bearing input, it must run every time with the right key, not at the agent's discretion). Storage is a node AFTER the agent, never a tool. The agent's only tools are PostHog MCP and Supabase MCP, both read-only.

**Linear chain (not branch-and-merge):**
```
Schedule Trigger (weekly Mon 8am)
  ├─ Get Conversion Insights ─┐
  └─ Get Web Analytics ───────┤
        Parse Insights  (one node, reads both HTTP nodes by reference)
        Date Context    (Code: report_week, week window, ISO week math)
        Read Targets     (Supabase Get Many, active=true, limit 1, Always Output Data)  [PENDING]
        Read Last Week   (Supabase Get Many, report_week < this week, Always Output Data)
        Assemble Context (Code: merges parsed + date + targets + last week + scorecard)
        AI Agent         (Anthropic claude-sonnet-4-6; tools: PostHog MCP + Supabase MCP read-only; Memory empty)
        Write This Week  (Supabase upsert report_week/report_json/report_markdown/report_data)  [PENDING]
        Render PDF + mirror to Google Drive  [PENDING]
        Deliver (Gmail / Slack)  [PENDING]
```
Date Context must precede Read Last Week and Read Targets because their filters key off `report_week`. Assemble reaches Date Context / Parse / Read Targets / Read Last Week by `$('Node Name')` reference rather than wiring all four in; only the last node in the chain feeds it directly. "Always Output Data" on the Supabase reads keeps the chain alive when a query returns zero rows (first run, empty targets), so Assemble's `is_baseline` / null-target handling fires cleanly.

**Date Context (Code node, ISO 8601 week math).** Computes `report_week` ("2026-W25"), `week_start`/`week_end` (trailing 7 full days ending yesterday, UTC), zero-padded week number so plain text sorting equals chronological sorting. ISO week math is in code, not an n8n expression, because models and expressions are both unreliable at "what week is it."

**Read Last Week bug banked.** Putting `{{ $json.report_week }}` (the VALUE) in the Order By field made Supabase treat "2026-W25" as a column name (`column ...2026-W25 does not exist`). Order By takes the literal column name `report_week` DESC; the value belongs only in the filter's keyValue. Empty table on first run is the designed baseline state, not an error.

#### Phase 6.4 — Kata / targets frame (decision, building)

**The reporting frame is the Improvement Kata:** business outcome → strategic initiative → target condition → current condition → weekly learning goal → prediction → grade-last-week's-prediction. This is stored deterministically and read in; the agent measures the current condition, judges toward/away, proposes the learning goal + prediction, and next week grades the prior prediction (via `report_data` on `last_week_report`).

**Targets are set from the current condition, NOT from thin air (load-bearing decision).** Pre-launch at zero real sales, hardcoding "20 orders/week" is a fantasy target that poisons every grade. Correct kata sequence is current-condition-before-target-condition. So a two-phase plan:
- **Phase one (first 2 to 4 weeks of real traffic):** NO numeric targets. `benchmarks` is empty / `target: null`. The agent runs in "establish current condition" mode, measures and reports, grades nothing against targets. Scorecard status is "calibration".
- **Phase two (week 3 to 4 of real traffic, Matt in the loop):** set targets as a defined improvement over the MEASURED baseline (e.g. "lift session-to-purchase from the observed X% to Y% over 6 weeks"). Industry DTC ranges (1 to 3% session-to-purchase, 65 to 75% checkout abandonment) are sanity rails, not adopted blindly.

**`watch` band defined.** Three-band status, not binary: for a down-is-good metric, at/below `target` = on_track, between target and `watch` = watch (amber, drifting, early warning), above `watch` = off_track. Gives the founders a "drifting" signal before something is fully broken.

**Orders source reconciled (decision).** Orders has no single clean tile and three sources disagree: primary funnel terminal = 0 purchases, promo pipeline = 1 purchase event, revenue = $0. Revenue is the commerce source of truth: $0 revenue → 0 real orders, and the lone promo-pipeline purchase is a tracking artifact to flag, not a sale. Assemble forces `orders_per_week` to 0 when revenue is 0; the agent flags the discrepancy in prose. (A dedicated standalone `count(purchase)` "Orders" tile is the clean long-term source; not yet built.)

**Report structure (decision): strictly top-down, executive → granular.**
1. Executive Snapshot (verdict sentence + vital-few table: orders, revenue, activations, sessions, visitors, bounce, checkout abandonment, each this wk / last wk / delta / status)
2. Strategic Frame (kata: outcome, initiative, current vs target, learning goal, prediction, grade of last week's prediction)
3. Scorecard (every benchmarked metric vs target + status)
4. Traffic & Audience
5. Conversion Funnel
6. Buying Behavior
7. Session Signals
8. Promo & Capture
9. Revenue & North Star
10. Performance (web vitals, one line)
11. Proposed Experiments (hypothesis / metric / rationale)
12. Data Caveats

**Tile-to-section mapping + treatment flags banked** (LIVE = report it, DORMANT = one line or omit, ARTIFACT = name as arithmetic quirk, DEDUP = appears twice, use one). All 38 tiles assigned. Dropped entirely in calibration: `web_sessions_per_user`, `web_pages_per_user` (sample + distorted), `BJicdCFs` (duplicate of `web_unique_visitors`). Week-over-week comes from two sources: a tile's own `compare` field (sessions + visitors, every week) and `last_week_report` (everything else, once a prior week exists); where neither, the agent says "no prior week."

**Agent node config (decision).** Chat Model: Anthropic `claude-sonnet-4-6`, temp 0.4, max tokens 4000. Memory: empty (n8n agent Memory is a chat buffer, irrelevant to a stateless weekly batch; week-over-week memory is the Supabase row, not chat memory). Tools: PostHog MCP (explain an anomaly the context doesn't answer) + Supabase MCP (multi-week history beyond last week), both read-only, neither used during calibration. Structured Output Parser attached. House style enforced in prompt: no em-dashes, ranges as "X to Y", $59.99 never $60, never "light show", lifestyle-accessory framing.

**Output schema (decision):** `report_markdown`, `executive_summary` (the field that gets embedded later), `verdict` (enum toward_goal / away_from_goal / establishing_baseline), `key_findings[]`, `scorecard_assessment[]` (status + note, NO retyped numbers — numbers stay in the stored deterministic scorecard), `weekly_learning_goal`, `expectation`, `prediction_grade` (nullable), `proposed_experiments[]` (hypothesis / metric / rationale). `weekly_learning_goal` + `expectation` are first-class fields because next week's grading reads them.

**Calibration reality (in the agent prompt).** All current numbers are test traffic under a ~7-visitor / ~24-session weekly ceiling (Matt's own reloads) until ~2 weeks past Phase 7 cutover. Known artifacts the agent must name, not report as findings: checkout abandonment 100% (1 checkout, 0 purchases), cart abandonment 0%, 30-min+ session duration, funnel dropping to 0 after product_viewed, channel all-Unknown (no UTMs), geography 1 to 2 countries. The agent self-frames early reports as calibration when `is_baseline` is true.

**Security action still standing:** rotate the PostHog `phx_` personal key and the Shopify `shpss_` client secret (both were pasted in plaintext during the build session).

#### Phase 6.5 — Weekly agent live end to end + Flagged Sessions subsystem + schedule / week-boundary (2026-06-21)
 
The weekly spine now runs through delivery (agent node, Write This Week, PDF render via PDFBolt, founder email all built and firing), and a new daily flagged-sessions subsystem feeds qualitative session-replay evidence into the weekly agent. Two calendar decisions locked alongside.
 
**Weekly workflow is live end to end.** The chain from Phase 6.3 is complete past the agent: AI Agent (Anthropic, house-style prompt, structured output) produces narrative plus structured fields, Write This Week upserts the row, the markdown renders to a Chrome PDF via PDFBolt, and the PDF is emailed to the founders. First full runs verified, producing the W25 report off live calibration traffic.
 
##### Daily flagged-sessions pipeline (NEW subsystem) ✅
 
A second, separate n8n workflow runs daily and writes session-level friction/intent evidence into Supabase. The weekly agent reads the unreviewed rows as qualitative context. Seven nodes:
 
1. **Schedule Trigger** (daily, hour 06:00 UTC).
2. **PostHog Flagging Query** (httpRequest POST `https://us.posthog.com/api/projects/445005/query/`, Header Auth). HogQL flags one row per session in the trailing window on any of `$exception` / `$rageclick` / `$dead_click` / `checkout_started`, with a `converted` boolean derived by LEFT JOIN of the server-side `purchase` event to the session by `distinct_id` within a 2-hour window. Excludes `-git-` staging URLs. Production uses `INTERVAL 1 DAY`; test runs used `30 DAY` and must be reverted before cutover.
3. **Shape Rows** (Code) zips columns and results, coerces `converted` via `String()` comparison, computes `week_of`.
4. **Upsert Flagged** (httpRequest POST PostgREST `.../flagged_sessions?on_conflict=session_id`, `Prefer: resolution=merge-duplicates,return=minimal`).
5. **Summarize Sessions** (MCP Client node, PostHog MCP OAuth2, tool `session-recording-summarize`, ~600000ms timeout, `session_ids` bare array plus a context prompt).
6. **Merge Summaries** (Code) reads `item.json.structuredContent`, skips keys starting with `_`, folds all MCP items into one dict keyed by `session_id`, joins back to Shape Rows.
7. **Patch Summaries** (httpRequest PATCH `.../flagged_sessions?session_id=eq.{{ $json.session_id }}`, body `={{ { summary: $json.summary, summarized_at: $json.summarized_at } }}`, `Prefer: return=minimal`).
**Supabase table (created):**
 
```sql
create table flagged_sessions (
  session_id    text primary key,
  distinct_id   text,
  start_url     text,
  start_time    timestamptz,
  duration_secs int,
  flag_reason   text,            -- comma-joined when a session trips more than one signal
  metric_value  numeric,
  summary       jsonb,           -- full session-recording-summarize payload
  summarized_at timestamptz,
  reviewed      boolean default false,
  notes         text,
  week_of       date,
  converted     boolean default false,  -- ground truth: server-side purchase joined by distinct_id + window
  created_at    timestamptz default now()
);
```
 
**Instrumentation state banked.** `purchase` is captured SERVER-SIDE (posthog-node webhook), so every purchase carries `$session_id = null` and is unflaggable directly. The correct conversion signal to flag on is `checkout_started` (client-side, has session id and recording). posthog-js init updated via Bolt: `capture_dead_clicks: true` added (dead clicks now firing, ~11 events), `capture_exceptions` added (still 0 events, no real exceptions yet, not a wiring fault), `$rageclick` already live. Owner/dev distinct_ids pollute the feed; the PostHog internal/test-account filter is NOT yet set (deferred to cutover).
 
**PATCH-not-POST bug (banked, bit twice).** Patch Summaries was first written as POST, which PostgREST treats as INSERT, so it tried to create a row with no `session_id` and failed the not-null constraint (`null value in column "session_id" ... violates not-null constraint`). Fixed to PATCH (update in place). The identical bug reappeared later on the weekly Mark Reviewed node, same cause, same fix.
 
##### Wiring flagged sessions into the weekly report ✅
 
Five weekly-flow nodes touched.
 
**Assemble Context compaction.** Reads the unreviewed flagged rows and emits, per session: `{ session_id, start_url, start_time, duration_secs, flag_reason, converted, disposition, outcome, segment_summaries }`. `outcome` is read from `summary.session_outcome.description`; `segment_summaries` from `summary.segment_outcomes` joined to `summary.segments` by index. A `flagged_summary` rollup carries `{ count, converted, by_reason }`, where `by_reason` splits comma-separated `flag_reason` (so a `rageclick,dead_click` session increments both, and by-reason counts can sum above the session count, expected, same shape as the activations-by-device caveat).
 
**`disposition` field (decision: binary).** Derived at compaction: `converted: true` to `"converted"`, `converted: false` to `"lost"`. The three-way split considered earlier was dropped because the narrative cannot reliably distinguish "purchased this visit" from "purchased later" (the purchase is server-side and invisible either way), so it is not asked to. The disposition value rides in the context now; surfacing it as a Disposition column in the Render Report table is a cutover task.
 
**Agent prompt.** A trimmed "Flagged sessions" reference block defines the fields and how to read `flag_reason` (rageclick / dead_click = UX/interaction problem; checkout_started = checkout/pricing hesitation), instructs the agent to render the table and interpret the pattern rather than enumerate session by session, and carries the calibration caveat that the feed is not yet filtered to real customers. A converted-is-ground-truth note was added (see investigation below).
 
**Render Report.** New `## 08 - Session Signals` section beneath Buying Behavior (07), with downstream renumber: Promo & Capture 09, Revenue & North Star 10, Website Performance 11, Proposed Experiments 12, Data Caveats 13. The block prints the rollup header plus a one-row-per-session table (Flag Reason / Outcome / Converted / Duration), pipe-guards the outcome string, and degrades to "_No sessions flagged this week._" when the count is falsy.
 
**Mark Reviewed (decision: scope to the week, not all unreviewed).** PATCH (not POST). Filter is the exact session_ids the report read, not `reviewed=eq.false`:
 
```
PATCH .../flagged_sessions?session_id=in.({{ $('Read Flagged Sessions').all().map(i => i.json.session_id).join(',') }})
body ={{ { reviewed: true } }}, Prefer: return=minimal
```
 
Reasoning: `reviewed=eq.false` would also mark any session the daily flagger writes between the weekly read and this node, burying it before it is ever reported. Scoping to the read set leaves those for next week. UUIDv7 ids need no quoting in the `in.()` list.
 
##### The converted-but-abandoned investigation (decision: converted is ground truth) ✅
 
In the first live run, four of five flagged sessions read `converted: true` while every one of their `outcome` narratives described abandonment. Rather than accept the agent's read (probable test traffic), pulled the full event timeline for one session via PostHog MCP (`execute-sql` over `events` for the distinct_id). Result: the `purchase` fired server-side about 34 seconds after `checkout_started`, INSIDE the recorded session window, but with `$session_id = null`, so it never appears in the session recording. A second converted session showed the identical signature (purchase about 41 seconds after checkout). 
 
Mechanism, now banked: because all purchases are server-side with a null session id, the purchase is structurally invisible to the summarizer in every case, so any converting visitor who keeps browsing after checkout is narrated as abandonment. `converted: true` plus an abandonment narrative is the GUARANTEED fingerprint of a completed purchase in this data model, not an occasional artifact. This corrected an earlier hypothesis (that buyers "came back later in another tab"), which the in-window timing disproved. 
 
Decisions: (1) prompt note added telling the agent `converted` is ground truth and overrides the narrative; converted sessions are completed purchases (hesitation worth smoothing, not lost sales), only `converted: false` are genuine drop-offs. Live now. (2) the binary `disposition` field above. (3) Disposition column in the render table deferred to cutover.
 
##### Schedule + week boundary (decisions)
 
**Weekly fires Monday 08:00 UTC.** The daily flagger runs 06:00 UTC; the two-hour gap clears the daily summarize window (first-gen MCP summaries run minutes each) so the weekly read never sees a half-written set. The dependency is real but n8n does not enforce it across two separate workflows, so the gap is held by the schedule. If the daily time moves, move the weekly with it.
 
**Week starts Monday (PostHog setting + Date Context).** PostHog project "Week starts on" set to Monday so weekly tile bucketing matches the report's own window math; otherwise the tiles and the date logic count different seven-day spans and week-over-week compares drift. Monday chosen to match the ISO `report_week` label the report already emits.
 
**Date Context node rewritten.** The old logic computed a trailing seven days ending yesterday, which produced a correct Monday-to-Sunday week only because the job happened to fire on a Monday (a coincidence of fire day, not a fixed boundary). Replaced the window block to anchor to the most recently COMPLETED Monday-to-Sunday week, regardless of run day:
 
```javascript
const now = new Date();
const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
const dow = (today.getUTCDay() + 6) % 7;                 // Mon=0 .. Sun=6
const thisMonday = new Date(today);
thisMonday.setUTCDate(today.getUTCDate() - dow);         // 00:00 this Monday
 
const weekStart = new Date(thisMonday);
weekStart.setUTCDate(thisMonday.getUTCDate() - 7);       // prior Monday
weekStart.setUTCHours(0, 0, 0, 0);
 
const weekEnd = new Date(thisMonday);
weekEnd.setUTCDate(thisMonday.getUTCDate() - 1);         // prior Sunday
weekEnd.setUTCHours(23, 59, 59, 999);
```
 
The `isoWeek()` math, `report_week` label, and output shape are unchanged. `week_end` is still emitted via `.toISOString()` (Z-suffixed UTC), so the `days_to_target` math in Assemble Context (`new Date(dateCtx.week_end)`) stays UTC-safe. Cadence: a Monday Jun 22 run reports Jun 15 to 21 (W25); a Monday Jun 29 run reports Jun 22 to 28 (W26). Correct for any fire on or after the Monday it reports from, which the 08:00 Monday schedule satisfies; a manual Sunday run would resolve to the wrong week (no guard added, scheduled path only).

#### Phase 6 — what's done vs pending

Done: PostHog data layer (both dashboards, parser verified across trends/funnel/sql), web-vitals p75 rebuild, Supabase table created + service-key access, the orchestration spine through Assemble (Parse → Date Context → Read Last Week → Assemble all producing the combined context with `is_baseline`/`last_week_report`). PostHog data layer (both dashboards, parser verified across trends/funnel/sql), web-vitals p75 rebuild, Supabase tables (`litsaber_weekly_reports`, `litsaber_targets`, `flagged_sessions`) with service-key access, the full orchestration spine (Parse, Date Context, Read Targets, Read Last Week, Assemble, AI Agent, Write This Week, PDF render via PDFBolt, founder email), the daily flagged-sessions pipeline (flag, upsert, MCP summarize, patch), and the flagged-sessions wiring into the weekly report (Assemble compaction, agent prompt, Session Signals render section, scoped Mark Reviewed). Weekly workflow runs end to end; daily flagger runs end to end. Schedule and Monday week-boundary locked.

Pending: Read Targets node + `litsaber_targets` table + Assemble scorecard additions (next, see plan); the AI Agent node wiring + prompt + schema; Write This Week upsert (incl. `report_data`); PDF render + Drive mirror; Gmail/Slack delivery; first end-to-end run; the deferred pgvector associative layer (post-launch). surface the `disposition` field as a render-table column at cutover; set the PostHog internal/test-account filter (Matt's distinct_id plus matthewtyler1986@gmail.com); reconcile the upstream orders discrepancy the agent flagged as the week's top data-integrity issue (weekly_orders tile 13 vs primary_funnel terminal 4); revert the daily flagging query from the 30 DAY test interval to `INTERVAL 1 DAY`; confirm `$exception` events appear once real errors occur (capture is enabled, 0 events is expected pre-traffic); the deferred pgvector associative-recall layer (post-launch, unchanged); the standing security action to rotate the pasted `phx_` and `shpss_` keys.

**Story beats captured (Phase 6)**

| # | Beat | Tag |
|---|------|-----|
| 64 | "Built the weekly analyst as a deterministic spine with the model as one reasoning island, not an agent that orchestrates everything. Fetch, read last week, write this week, render, deliver are all nodes that run unconditionally and in order. The model only writes prose and proposes tests. The rule that fell out of it: the agent never decides whether to save and never types a number into storage. Numbers are the parser's truth; the model owns judgment. An agent that 'usually' generates the report is worse than a pipeline that always does." | `agent-loop`, `pm-discipline` |
| 65 | "Caught myself about to hardcode a 90-day target of 20 orders a week while sitting at zero real sales. A target with no basis poisons every grade after it. The fix was the kata discipline itself: you measure the current condition before you set the target condition. So the agent runs in establish-baseline mode with no numeric targets until real traffic gives it a floor to improve from, then targets get set as a defined delta over what was actually observed. Refusing to invent the number is the senior move, not a gap." | `pm-discipline`, `analytics-rigor` |
| 66 | "Three tiles disagreed on the single most important number — orders. The funnel said zero, the promo pipeline said one, revenue said zero dollars. Rather than let the agent silently pick, I made revenue the commerce source of truth (zero dollars means zero orders) and told it to flag the promo discrepancy as a tracking artifact in prose. When sources conflict, name the canonical one and surface the conflict — don't average it away or let the model choose per run." | `analytics-rigor`, `integration-depth` |
| 67 | "Verified the SQL-tile result shape against a real payload instead of trusting my own parser assumption. I'd written it to read nested result.results/result.columns; the dashboard endpoint actually returns result as row-arrays with columns as a sibling. One real paste corrected a guess that would have silently dropped both bounce and session-duration into an unparsed blob. The discipline that keeps paying off: pull the real artifact, don't reason about the shape from memory." | `integration-depth`, `analytics-rigor` |
| 68 | "A batch of flagged sessions read converted-true while their summaries all said 'abandoned.' The easy call was the agent's: probably test traffic. I pulled the actual event timeline for one instead and found the purchase fired server-side about 34 seconds after checkout, inside the session window but invisible to the recording because server-side events carry no session id. So in this data model every real conversion is narrated as abandonment, every time. The flag is ground truth; the narrative is a partial view of one browser visit. The lesson is the one that runs through this whole build: pull the artifact before you trust the story written about it. It also killed my own first guess, that they came back later in another tab, which the in-window timing disproved." | `analytics-rigor`, `integration-depth` |
| 69 | "The same bug bit twice in two nodes: a Supabase write set to POST tries to INSERT, hits the not-null constraint on session_id, and dies. The fix both times was PATCH, an update in place. Then a quieter one on mark-reviewed: filtering on reviewed=false would mark every unreviewed row, including sessions the daily job writes after the weekly read but before the mark fires, burying them before they are ever reported. Scoped it to the exact ids the report read. An update is not an insert, and 'mark everything unreviewed' and 'mark what I just reported' are different sets the moment two workflows share a table." | `integration-depth`, `pm-discipline` |
| 70 | "Wired session-replay summaries into the weekly agent as qualitative evidence, walled off from the numbers on purpose. The funnel and trends tiles stay the canonical measurement; flagged sessions are texture the agent reads for the why, never a denominator it counts. Encoded the split in the prompt and in a binary disposition field, converted versus lost, so the agent separates recovered near-misses from genuine drop-offs instead of flattening them into one abandonment story. Evidence and measurement in separate lanes is the same trust rule as parser-owns-numbers, agent-owns-judgment." | `analytics-rigor`, `agent-loop` |
| 71 | "The report's week math took a trailing seven days ending yesterday, which gave a correct Monday-to-Sunday week only because the job happened to fire on a Monday. Anchored it to fixed weekdays so the boundary holds no matter the run day, and set PostHog's own week-start to Monday so the tiles and the report window slice the same seven days. A boundary that is right by coincidence of the fire day is a latent bug; pin it to the calendar, and make the two systems that cut the week agree." | `integration-depth`, `pm-discipline` |

---

### Pre-Phase-7 — Media migration to Vercel Blob + video wiring (2026-06-11) ✅ (Activate sweep pending)

**Goal:** Get media off the GitHub `public/` folder and onto a CDN-decoupled
single store before launch, then wire the first real videos (hero, ThreeModes,
Activate). Governed by ADR-007.

**The decision (ADR-007):** Vercel Blob as the SINGLE media store, images and
video together. Driven by a stated operational constraint: one system, one
workflow, no two-vendor split. Rejected Supabase Storage (second origin, violates
ADR-006 one-system-per-job), Cloudflare Stream (best video delivery but two
workflows), and Cloudinary (new vendor, more than the inventory justifies). Key
reframe surfaced during the decision: `public/` on Vercel is ALREADY edge-CDN
delivery and most images go through `next/image`, so this was never a performance
rescue. It was decoupling assets from the repo and from deploys, and giving video
a home, in one system.

**Migration executed in four chunks (one commit each), `public/` kept as live
rollback until the preview verified each step:**
- **Chunk A:** `scripts/migrate-media.ts` uploaded all of `public/images/` to
  Blob preserving pathnames. Sequential uploads, dotfile skip (`.DS_Store`),
  one-year cache headers, `addRandomSuffix: false`. Script loads `.env.local`
  itself (tsx does not auto-load it). `tsconfig.json` excludes `scripts` so the
  app build does not type-check it.
- **Chunk B:** `lib/media.ts` (`mediaUrl`/`videoUrl`, env-var base with local
  fallback) created; `remotePatterns` Blob hostname added to `next.config.mjs`;
  every `/images/` reference swept to `mediaUrl()`.
- **Chunk C:** `public/images/` deleted (recoverable from git history).
- **Chunk D:** hero, ThreeModes (3 clips), Activate clips uploaded under
  `videos/`. Hero + ThreeModes wired; Activate sections in progress.

**Blob store facts (banked):** `get-litsaber-blob`, store ID
`store_0KU6ZB3BoVDlOwuq`, region SFO1, PUBLIC access. Base URL
`https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com` (no trailing slash).

**`NEXT_PUBLIC_MEDIA_BASE_URL` lives in THREE isolated environments** with no
auto-sync: Vercel dashboard (Production + Preview + Development), local
`.env.local`, AND Bolt's own env panel. Bolt's preview sandbox cannot read
Vercel's vars, which is why media rendered blank in Bolt's preview until the var
was added there too. The env-var pattern (vs hardcoding) means the value is a
one-line change per environment; the cost is maintaining three copies.

**Video standard locked (Blob is progressive download, NOT adaptive bitrate):**
H.264 MP4 (never `.mov` — Chrome/Firefox reject it), 1080p max, 2 to 4 Mbps,
AAC or no audio, `+faststart`, target under 15MB. The homepage hero arrived as a
110.8MB file and must be compressed before it ships (an autoplay hero at that
size is a broken hero on festival LTE).

**Video element pattern locked:** every autoplay background/loop video carries
all of `autoPlay muted loop playsInline preload="metadata"` (all four required
for mobile-Safari autoplay), a `poster` fallback, `aria-hidden` when decorative,
and a `prefers-reduced-motion` branch that renders the static poster instead.
For sizing, a `<video>` with only a width balloons to its intrinsic height: the
fix is a constrained-aspect wrapper (`relative` + `aspect-*`) with the video
`absolute inset-0 w-full h-full object-cover`, so the video fills a defined box
instead of driving its own height.

**Components wired:** Hero device-render swapped from `<Image>` to autoplay video
(poster = old placeholder image, reduced-motion = poster only). ThreeModes right
panel + mobile cards swapped img to video, paths in `modes.content.ts` via
`videoUrl()` (Litsaber/Pull, Glowstick, Stealth; the Build toggle keeps showing
the Pull video until that clip exists — option A). Activate QuickStart, Modes,
and Battery media columns fixed for the height-constraint bug.

**Open (Activate media sweep):** the `<video> w-full object-cover` with no height
bug exists in EVERY Activate media slot (nine sections). Fixed in QuickStart,
Modes, Battery so far; remaining sections pending. Resolution: one sweep to apply
the constrained-aspect-wrapper fix everywhere, THEN extract a shared
`<ActivateMedia src poster alt />` primitive so the duplicated arrangement (which
is how the bug reached nine files) becomes one component.

**Considered and rejected: site-wide background music.** Browser autoplay
policies block unmuted audio without a gesture (same policy that forces muted
hero video), it competes with the product's own draw-reactive light moment and
the demo-video audio, it reads as a dated amateur signal against the premium
positioning, and it adds load with no upside. If audio is ever wanted, the
on-brand version is an opt-in, off-by-default toggle tied to a specific moment,
never autoplay. Atmosphere is carried by motion and light, which the site already
does.

**Feature flags (scoped, not yet built):** promo-popup toggle is a clean PostHog
flag (delay-triggered, so no SSR-flash, no init-race) and the right first use,
upgrading the existing `NEXT_PUBLIC_FEATURE_PROMO_POPUP` env flag to a no-redeploy
dashboard toggle. Price A/B testing REJECTED as a flag: it is underpowered at
current traffic (purchase-based tests need months per variant), it is a Shopify
source-of-truth problem (a flag changes displayed price but checkout pulls real
Shopify price, risking a bait-and-switch), and same-SKU price discrimination is a
fairness/legal gray area. Find the price ceiling via sequential changes or
offer-testing instead. Cleanest experiments at this traffic are high-contrast
top-of-funnel changes (hero headline, CTA copy) measured on an engagement event
that fires nearly every visit, not on the 0.1% that buy.

**Recurring Bolt lesson (banked again):** Bolt reported the `next.config.mjs`
edit as complete when it had NOT applied it. Caught by pulling the literal file
and reading it. Same pattern as the working-memory false-done claims. The literal
file contents are the only source of truth; the status report is intent.

**Story beats captured**

| # | Beat | Tag |
|---|------|-----|
| 68 | "Pushed back on my own framing before building. The ask was 'get media off the repo onto a CDN for speed,' but the repo folder on Vercel already IS the CDN, and most images already optimize through next/image. So the migration wasn't a speed fix, it was decoupling assets from deploys and giving video a home in one store. Naming what a change actually buys you, instead of accepting the stated reason, is what kept us from adding a second vendor for a problem we didn't have." | `tool-choice`, `pm-discipline` |
| 69 | "Honored a one-sentence constraint over the technically-best answer. Cloudflare Stream is the better video host on raw merits (adaptive bitrate, per-view pricing), but 'I don't want images and video living separately' is a real operational cost, and one store with a compression discipline beats two stores with perfect delivery. The right architecture is the one the operator will actually maintain." | `tool-choice`, `pm-discipline` |
| 70 | "Migrated in copy-now, repoint-next, delete-last chunks with the old folder live as rollback at every step. Nothing user-facing moved until a preview deploy proved Blob was serving everything. The deletion of the old folder was the LAST commit, not the first, and even then it was one git command from recovery. Risky migrations get sequenced so every step has a working fallback behind it." | `integration-depth`, `pm-discipline` |
| 71 | "The same env var had to live in three places that don't talk to each other: Vercel for deploys, local for dev, and the builder's sandbox for its preview. Media rendered blank in the preview not because the code was wrong but because the builder's environment is walled off from Vercel's secrets by design. The lesson is to map where a value is actually read before debugging why it's missing, three environments means three copies, and that wall is a security feature, not a bug." | `integration-depth`, `tool-choice` |
| 72 | "A talking-head video ballooned past its column because a video with only a width takes its own intrinsic height. The fix wasn't a magic height value, it was a constrained-aspect wrapper with the video positioned absolutely inside it, so the box defines the size and the video fills it. Then I found the identical bug in every Activate media slot. A defect that appears in nine places is one duplicated component waiting to be extracted, not nine bugs to fix nine times." | `integration-depth`, `pm-discipline` |
| 73 | "Said no to background music and no to price A/B testing in the same session, both for the same underlying reason: the obvious-feeling feature collides with a constraint the requester hadn't weighed. Music can't autoplay and fights the product; a price test is underpowered at this traffic and creates a Shopify dual-truth and a fairness problem. The job isn't to build what's asked, it's to surface the cost the ask didn't see and offer the version that actually works." | `pm-discipline`, `discovery` |

---

### Phase 7 — Launch & First Loop (pending)

Soft launch. Two weeks of agent runs before trusting output.

---

## Story Beats Bank

Tag taxonomy:

- `discovery` — decisions driven by data, not vibes
- `tool-choice` — why I picked this tool over that one
- `ai-augmented-build` — AI tooling proving its worth (or not) in a specific moment
- `integration-depth` — code-level moments, API quirks, debug stories
- `agent-loop` — observability → agent → human review system in action
- `pm-discipline` — PM thinking shaping technical execution

Active beats are logged within each phase entry above.

---

## Open Questions (rolling)

**Phase 3a/3b/3c-1 complete — Phase 3 remainder:**

Phase 3 work remaining (in priority order):
1. Build Gold waitlist modal (wraps `WaitlistForm list="gold"`) — triggered by Editions Box 2
2. Build Future Drops modal (wraps `WaitlistForm list="general"`) — triggered by Editions Box 3
3. Wire Editions box actions: Box 1 → navigate to `/shop/litsaber-og`; Box 2 → open Gold modal; Box 3 → open Future Drops modal
4. Wire "FESTIVAL DROP LIST" signup on `/cart` page (deferred from 3b)

**Phase 2 quantity discount refactor (planned, 2026-05-27):**
1. Chunk A — cart store refactor + PDP Pattern B selector + `lib/cart/pricing.ts` (one Bolt prompt)
2. Chunk B — remove quantity stepper from drawer + cart page (one Bolt prompt)

**Carry-forward items from 3c-1:**
- Confirm WaitlistForm border is cyan-20% per Figma node `3703:7914` — verify it didn't inherit a drifted value
- Reconcile offer-amount copy ($5 vs $10) in General waitlist form
- Decide rate-limit durability: current in-memory Map resets on cold start; upgrade to Upstash Redis if real abuse appears

**Action items still open:**
- Email ReviewInfra to confirm: (1) does a read API exist for fetching reviews as JSON, (2) does any AI summary feature exist or is on roadmap

**Pre-launch (non-blocking until later):**
- AI Summary final approach (pending ReviewInfra response)
- ReviewInfra Path A vs Path B (pending ReviewInfra response)
- ~~Floating promo trigger logic + frequency cap~~ → RESOLVED (2026-05-28): 12s + exit-intent; 72h dismiss / 365d subscribe cookies. Offer locked at $10. Promo code architecture → ADR-004 (Architecture A).
- Build promo box frontend (Figma `3770:1315`) — bundled pre-launch with ADR-004 backend, on Phase 5 instrumentation. Design the error state first (absent in Figma); consider auto-apply via `?discount=` checkout URL.
- Remove `console.log("[PDP]")` from `app/shop/litsaber-og/page.tsx` (next Bolt pass in that file)
- Remove `/shopify-check` debug route before Phase 7
- Flip Authorize.net from test to live before launch
- **Repoint the dynamic box QR at Phase 7 cutover** — currently points at the Vercel preview `/activate` for testing; must become `getlitsaber.com/activate?utm_source=packaging&utm_medium=qr&utm_campaign=activation_insert`. Dynamic QR = no reprint, just change the destination. Pair with the DNS flip (a customer scanning before the flip would otherwise hit the dead route). `device_activated` is verified firing against this URL.
- **Brand the customer-account subdomain at Phase 7 cutover** — `account.getlitsaber.com`. Customer accounts are activated NOW on the default Shopify URL (New Customer Accounts already on; Shopify owns orders + self-serve returns UI; navbar account icon links to the default account URL). The branded subdomain is COUPLED to the cutover: it's a subdomain of `getlitsaber.com`, which isn't on Shopify yet (still WordPress; Shopify primary is `innovapeconcepts.myshopify.com`). Doing it now would mean attaching `getlitsaber.com` to Shopify early, cutting against the deliberate 1–2 week parallel-running rollback window. So at cutover: Settings → Customer accounts → connect `account` subdomain (CNAME → `shops.myshopify.com` at Namecheap, up to 48h propagation), then swap the navbar account link from the default URL to `account.getlitsaber.com`. Confirm sender email deliverability (passwordless login sends a code from it).
- ~~Section 6 empty frame on homepage~~ → RESOLVED (2026-05-23): it's the Editions + commerce display section (node `3312:2`), now built.
- Venue card photography sourcing
- FAQ #3 placeholder copy (homepage)
- Contact page FAQ body copy (mostly placeholder)
- "Danksaber" direct competitor mention — keep, reframe, or remove
- "LITSABER OG +" title — verify `+` is intentional
- ~~2-Pack "SAVE $20" badge math reconciliation~~ → RESOLVED (2026-05-27): quantity discount model — tier prices are exact ($99.99, $134.99, $169.99, $199.99), display badges round to nearest dollar ("SAVE $20", "SAVE $45", "SAVE $70", "SAVE $100").
- Mix-and-match UI revisit when Gold ships (currently no UI for Silver+Gold combinations; customer would use two add-to-cart actions if Gold were live)
- Engineering kinetic animation system spec

**Post-launch:**
- `Litsaber_Wholesale_Pricing_2026.pdf` rewrite (4 tiers, MOQ 5)
- `Litsaber_Business_Competence_Cheat_Sheet.pdf` update (41 LEDs, 10 colors)

---

## Glossary

- **Repositioning thesis:** The single-sentence strategic claim driving the rebuild.
- **Production agent:** The weekly automated analyst that proposes A/B tests from observed data.
- **Tool-per-phase:** The principle that no single tool owns the whole build.
- **Human-in-the-loop:** The agent proposes; the human approves and ships. Trust layer, not a bottleneck.
- **ADR:** Architecture Decision Record. A short markdown doc capturing context, decision, and consequences for a significant call.
- **Phase 1.5:** Mid-phase reconciliation between Phase 1 (design tokens + repo) and Phase 2 (Bolt scaffold), introduced because mobile UI and additional pages came in after Phase 1 close.
- **Plan-review pattern:** Reviewing the builder's written plan as if it were a pull request — catching bugs and architectural gaps at the paragraph stage, before any code is written. Cheaper to fix a plan than a commit, and the builder defends a plan less than code it has already produced.

## Promo instrumentation + the mount-race bug (2026-05-31) ✅

Wired the promo sub-funnel into PostHog and, in doing so, surfaced a systemic
timing bug affecting any near-mount event. Four promo events, all verified live:
`promo_popup_shown` (trigger: time_delay|exit_intent — the denominator),
`promo_email_submitted` (source: floating-promo-$10, the real WAITLIST_SOURCES
value), `promo_popup_dismissed` (method: close_button|backdrop|escape — added when
Matt asked "isn't dismissed more interesting than shown?" → both: shown is the
denominator, dismissed is the loss state with active-vs-passive texture),
`promo_code_captured` (code — REPLACES the obsolete promo_code_applied, whose
in-cart cartDiscountCodesUpdate trigger we deleted this session).

**Structural guards over runtime guards (the good engineering call):** the
submit-vs-dismiss double-count trap (a submit closes the popup too, so naive
dismissal logic would fire on every conversion and break shown = submitted +
dismissed) was solved by code-path separation — markSubscribed calls
setVisible(false) directly, never routes through dismiss(method) — so dismissal is
STRUCTURALLY impossible on the success path, not flag-guarded. Same for fire-once:
one setVisible(true) site, track() beside it.

**THE BUG (the real find):** promo_code_captured never reached PostHog despite the
sessionStorage write succeeding. Chased it through several wrong theories
(dedup-suppressing, stale state, ordering) before the decisive evidence: after
clearing sessionStorage and reloading, the storage HAD the code (so the if-block
ran, so track() was called) but no event landed. Diagnosis: PostHog's init() is
async; a track() in a mount useEffect fires before PostHog is capture-ready and
no-ops SILENTLY (no error, surrounding sync work succeeds — looks fine). promo_
popup_shown worked only because it fires ~12s later, after init. Fix: defer the
track() until ready via posthog.onFeatureFlags(); keep the sessionStorage write at
mount (auto-apply needs it early).

**The audit was the payoff:** asked Bolt whether any OTHER event fires near mount.
It found product_viewed — funnel STEP 3, every PDP visit — had the identical bug.
The core funnel had been under-counting product views into PostHog's init gap. That
reframed the whole session: chasing one promo event surfaced a systemic hole.
Fixed product_viewed with the same readiness gate, abstracted into a shared
trackWhenReady() helper (immediate if posthog.__loaded, else onFeatureFlags) in
lib/analytics/events.ts — now the rule ("near-mount events use trackWhenReady") is
enforced by a function name, not tribal knowledge. ADR-005 updated with the rule +
the four promo events + the promo_code_applied supersede.

**Fidelity gap logged (not fixed):** product_viewed is specced as viewport-entry
but both call sites fire at MOUNT (no IntersectionObserver). On the homepage with
the buy section below the fold, it measures "page loaded" more than "saw product."
Revisit if product-view fidelity matters.

**Debugging lesson:** spent several cycles reasoning about track() from the outside
(did the event arrive?) and inferring causes, before asking to READ the one
function every event flows through. The shared code path is the thing to read
FIRST when many symptoms point at one helper, not after exhausting external probes.

| # | Beat | Tag |
|---|------|-----|
| 53 | "The dismissal-vs-submit double-count was solved structurally, not with a flag: the success path calls setVisible(false) directly and never touches the dismiss function, so a conversion CAN'T register as a dismissal. A flag guarding the same thing could be defeated by a future edit; mutually-exclusive code paths can't. When the funnel math has to hold as an identity (shown = submitted + dismissed), enforce it in the shape of the code, not a runtime check." | `integration-depth`, `analytics-rigor` |
| 54 | "One promo event silently failing to reach PostHog turned out to be a systemic bug: any track() firing at component mount races PostHog's async init and no-ops with no error. The tell was sessionStorage having the value (proving the code ran) while the event never arrived. The real win wasn't the fix — it was asking 'what else fires near mount?' and finding product_viewed, funnel step 3, carrying the same hole. A canary bug is worth more than a clean one; it points at the class." | `analytics-rigor`, `pm-discipline` |
| 55 | "Abstracted the readiness-gate into trackWhenReady() once a second event needed it. The value isn't DRY — it's that the rule ('near-mount events defer until PostHog is ready') now lives in a function name a future build will reach for, instead of a lesson that has to be re-learned by re-encountering the silent drop. Encode the rule where it can't be skipped." | `ai-augmented-build`, `analytics-rigor` |
| 56 | "Burned several debugging cycles probing a failing event from the outside — did it arrive, is it deduped, is the state stale — before reading the track() helper every event passes through. When many symptoms converge on one shared code path, read the path first. External probes feel like progress because each rules something out, but reading the shared function would have ruled out everything at once." | `pm-discipline`, `tool-choice` |

### device_activated wired — FULL FUNNEL COMPLETE (2026-06-09) ✅

The North Star event (KPI rung 7) is wired and verified, which completes live
instrumentation of the ENTIRE ADR-005 funnel — rung 1 (`age_gate_confirmed`)
through rung 7 (`device_activated`). Every transition the 60-day report exposed as
a black box is now measurable. This is the whole spine the rebuild was betting on.

**Implementation:** `components/activate/ActivationTracker.tsx` — invisible `"use
client"` shim (renders null), mounted in `app/activate/page.tsx`, same pattern as
`PdpViewTracker`. Fires `device_activated` on mount via `trackWhenReady` (mandatory
— this is the highest-traffic cold-load QR destination; a raw `track()` would drop
into the PostHog init gap, and this is the single most important event on the site).
Props: `activation_source` (`utm_source === 'packaging'` → `packaging_qr`, else
`direct`) and `is_first_activation` (localStorage `litsaber_activated`: absent →
true then set; present → false).

**Decision — fires every load, not once.** The flag drives the boolean, not event
suppression. North Star = filter `is_first_activation = true`; repeat loads still
fire (false) for re-engagement signal. Two dedupe layers kept distinct: per-mount
`useRef` (StrictMode double-invoke) vs per-device localStorage (the boolean across
loads). Read-order load-bearing: read flag → fire → THEN set, so first load reports
true. Verified all four branches (first/return × packaging/direct).

**Link / QR:** dynamic, repointable. Points at the Vercel preview for testing; gets
repointed to `getlitsaber.com/activate?utm_source=packaging&utm_medium=qr&utm_campaign=activation_insert`
at Phase 7 cutover — no reprint. PostHog auto-captures the UTM params; the event
reads `utm_source`.

**THE TESTING LESSON (we nearly re-learned beat #48 the hard way):** spent the back
half of the session convinced `device_activated` was broken — "reload doesn't fire,"
"no-UTM shows wrong value," "8 minutes and nothing." Every symptom was PostHog
Cloud's live-feed DISPLAY LAG (events captured instantly, shown 3 to 8 minutes
later) compounded by testing across multiple fresh incognito windows (each correctly
a first-visit → `true`). The decisive evidence: two `is_first_activation: false`
events appeared with NO reload, minutes after they'd actually fired — i.e. the
"missing" reload events arriving late. localStorage showed `litsaber_activated = 1`
persisting correctly across hard reload the whole time. The code was right from the
first commit. We almost fixed a non-bug.

| # | Beat | Tag |
|---|------|-----|
| 62 | "Wired the North Star event and the whole funnel went green end to end — every rung from the age gate to the device-activation moment is now instrumented. The thing worth saying isn't the event; it's that the 60-day report that started all this exposed the buy-click-to-purchase collapse as a black box, and there is now a live signal on every transition in and around it. The rebuild's whole premise was 'replace a static site with a system that can see itself.' This is the moment it can." | `agent-loop`, `analytics-rigor` |
| 63 | "Nearly spent a night fixing a bug that didn't exist. Every symptom screamed broken North Star event — reloads not firing, wrong values, eight minutes of silence. All of it was PostHog's live feed lagging several minutes plus my own testing across fresh incognito windows that were each, correctly, first visits. The tell I almost missed: two events showed up with the right values minutes after I'd stopped touching the page. The localStorage flag had been persisting correctly the entire time. The lesson is the one already in this doc from the stale-cart saga — when it only fails in your hands, suspect the test conditions before the code — and I still almost missed it, because 'the most important event is broken' is a scary enough sentence to override the checklist. Discipline isn't knowing the rule; it's applying it when you're nervous." | `pm-discipline`, `analytics-rigor` |

### Customer accounts — Shopify-hosted, activated (2026-06-11) ✅

Self-serve customer accounts (order management + returns) are live with effectively
zero custom build — the consistent choice given the native-Shopify-integration
pattern (cf. Judge.me over custom reviews, native HubSpot order sync over custom
write-back). Option A (Shopify-hosted) chosen over Option B (custom headless account
UI via the Customer Account API — weeks of work, owns auth + PII) and Option C
(defer, returns via contact form).

**What's live:** New Customer Accounts active in Shopify. Account experience hosted
by Shopify at `https://shopify.com/65425866959/account` (the default URL — store ID
`65425866959`, not secret, it's in every customer's account URL). Passwordless email-
code login; Shopify owns the orders + self-serve RETURNS UI out of the box. Verified:
logged into a test account, orders visible, returns available.

**The one repo change:** navbar account icon (stubbed since foundation, no destination)
wired to the account URL, read from env var `NEXT_PUBLIC_ACCOUNT_URL` (external `<a>`,
not Next `<Link>`). Env-var deliberately so the Phase 7 swap to the branded subdomain
is a one-line Vercel change, no code round-trip.

**Why default URL now, branded subdomain at cutover:** `account.getlitsaber.com`
requires `getlitsaber.com` to be a Shopify-connected domain, but it isn't yet (still
WordPress; Shopify primary is `innovapeconcepts.myshopify.com`, alias
`ajur1e-s1.myshopify.com` — the latter incidentally confirms the Judge.me shop-domain
value was legit, not stale). Forcing the subdomain now means attaching the domain to
Shopify early, cutting against the deliberate 1–2 week parallel-running rollback
window. So accounts go live on the default URL today; the branded subdomain is a
Phase 7 cutover item (logged in the checklist), swapped via the env var when the
domain moves.
