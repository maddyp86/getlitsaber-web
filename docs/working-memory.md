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

### Phase 5 — Observability Instrumentation (pending)

PostHog + Vercel Analytics + Supabase mirror. Event taxonomy defined pre-launch. Success metrics document committed before traffic arrives. Floating promo trigger (12s + exit-intent) and frequency cap (72h dismiss / 365d subscribe) are now LOCKED; what remains here is instrumenting the promo funnel (popup shown → submitted → emailed → code applied → purchased) so the ADR-004 promo bundle launches into a measured funnel, not a blind one.

## Phase 5a — PostHog install + pageview capture (2026-05-30) ✅

First chunk of Phase 5 observability. Install + autocapture only; the typed event
layer (5b) and server-side/webhook capture (5c) are separate chunks. Verified live:
pageviews and autocapture events landing in PostHog (project 445005, US Cloud).

**Decisions:**
- **Wizard skipped deliberately.** PostHog's onboarding offered an `npx @posthog/wizard`
  auto-installer. Declined — it runs a second write path into the repo (installs SDK,
  edits files, commits), the exact two-write-path collision CLAUDE.md forbids. Install
  went through Bolt (the single write path) instead, configured to our spec.
- **`providers.tsx` + `useEffect` pattern, NOT `instrumentation-client.ts`.** The
  lightweight `instrumentation-client.ts` convention is Next.js 15.3+ only; we're on
  14.2.35, so the `'use client'` provider wrapping the layout is correct. Verified
  against current PostHog docs before building.
- **`defaults: '2026-01-30'`** snapshot handles SPA pageview + pageleave capture for
  App Router automatically — no hand-rolled `PostHogPageView` component needed.
- **Env var named `NEXT_PUBLIC_POSTHOG_TOKEN`** — resolved a three-way naming conflict
  (spec said `_PROJECT_TOKEN`, existing `.env.example` had `_KEY`, PostHog docs use
  `_TOKEN`). Picked `_TOKEN`: shortest, matches PostHog tooling, and avoids "KEY" which
  invites confusion with the secret personal API key. The `phc_` token is a public
  client-side key (write-only, safe to ship in browser) — `NEXT_PUBLIC_` is convention,
  not a leak. Host corrected to `https://us.i.posthog.com` (the `.i.` matters; without
  it ingestion silently fails).
- **Layout stays a Server Component** — only `providers.tsx` is `'use client'`; all
  existing shell (AgeGate, Navbar, Footer, CartDrawer, CartHydrator) preserved and
  reordered nothing.
- **Reverse proxy deferred.** Skipped the Next.js rewrite that dodges ad-blockers —
  adds a moving part; priority was clean baseline data flowing. Optional later hardening
  if ad-blocker loss proves material.

**Build-reality beats (all recurring, worth banking):**
- **Bolt won't update working-memory — confirmed policy now.** Considered letting Bolt
  write this doc directly; decided against it. Bolt has falsely reported updating
  working-memory 3+ times (beats #16, #33) and writes a thinner builder's-eye version
  that misses decision history. Working-memory stays maintained outside Bolt. Bolt was
  explicitly told not to touch `docs/`.
- **Benign GitHub conflict (not the bad kind).** On Bolt's push, GitHub had two `docs:`
  commits Bolt's workspace didn't (committed directly in a Bolt-idle window, the correct
  docs write path). "Pull and resend" reconciled cleanly. This is the GOOD version of the
  two-write-path situation — pull-before-write enforced by the system — vs the `public/`
  wipe (beat #22) where a sync merged without pulling first and dropped files. Same root
  cause, opposite outcome, entirely down to ordering.
- **First dependency add hit a Bolt sandbox limit.** `posthog-js` is the first npm
  package added in the whole build (everything prior was code edits to existing files).
  Bolt added it to `package.json` but its sandbox ran out of memory running `pnpm install`,
  so `pnpm-lock.yaml` never regenerated. Vercel's `--frozen-lockfile` default correctly
  rejected the mismatch (`ERR_PNPM_OUTDATED_LOCKFILE`). Fix: set Vercel install command to
  `pnpm install --no-frozen-lockfile` (left as standing config — safe at this scale,
  reconciles the lockfile at build time). This WILL recur on every future package add
  (5c adds posthog-node, likely a Supabase client) — the Vercel flag handles it permanently.

| # | Beat | Tag |
|---|------|-----|
| 42 | "PostHog's onboarding pushed a one-command auto-installer. I skipped it. Convenient for a solo dev on a local repo, wrong for us: it's a second tool writing to the repo, the exact collision that's bitten us twice. The install went through our single write path instead, configured to the taxonomy we'd designed rather than whatever the wizard guesses. The fastest path and the right path aren't the same when you've deliberately constrained who can write." | `tool-choice`, `pm-discipline` |
| 43 | "First npm package added in the entire build, and it surfaced a tool limit we'd never hit: the builder's sandbox can't complete pnpm install (out of memory), so it edits package.json but can't regenerate the lockfile. The deploy's frozen-lockfile check caught the mismatch and refused — correctly. The lesson isn't the workaround (a Vercel install flag); it's that the builder does the visible half of a change and silently drops the half it can't execute, every time. The verification step exists because the builder's completion claim isn't trustworthy — same theme as the availability bug and the working-memory false reports." | `integration-depth`, `ai-collaboration` |

## Phase 5b — Typed event layer + funnel wiring (2026-05-30) ✅

Second Phase 5 chunk. The typed `lib/analytics/events.ts` module is the single
source of event names (no inline `posthog.capture` strings anywhere — same
enforcement model as "no inline hex"). Six funnel events wired into existing
surfaces; deferred surfaces (promo box, Activate page) excluded.

**Module:** `lib/analytics/events.ts` — `EVENTS` const + `PayloadFor<E>` typed map +
`track<E>(event, properties)` wrapping `posthog.capture`. Guards on `window` +
`posthog.__loaded`; no-ops silently if uninitialized. Malformed `track()` calls
fail to compile.

**Events wired (6):** `age_gate_confirmed` (AgeGateModal confirm) · `homepage_engaged`
(first of scroll-past-hero / 10s dwell / CTA click, fire-once per session via
sessionStorage, `trigger` property, timer cleared on unmount) · `product_viewed`
(PDP + homepage buy section, fire-once guards, `surface` property) ·
`cart_add_to_cart` (post-`addItem`, real variant/qty/tier_price/unit_price) ·
`buy_now_clicked` (BUY NOW, before redirect) · `checkout_started` (3 cart surfaces +
BUY NOW).

**Server-Component shim pattern:** `app/page.tsx` and the PDP page are Server
Components and can't hold hooks, so invisible `"use client"` tracker components
(`HomepageEngagementTracker`, `PdpViewTracker`) render `null` and carry the
tracking. Server Components never import PostHog directly.

**Two file-verified findings during plan review:**
- `cart_value` on `checkout_started` reads `useSubtotal()`, which sums `lineTotal` =
  `parseFloat(node.cost.totalAmount.amount)` — Shopify's actual charged amount, NOT
  the `pricing.ts` client fallback. Analytics value = what the customer pays (beat #40
  invariant holds).
- `checkout_started` stays co-located across the 3 cart buttons rather than centralized:
  `useCheckoutUrl()` turned out to be a plain Zustand selector returning a string, not a
  shared redirect function, so there was no chokepoint to centralize into without an
  out-of-scope refactor. The cost — 4 call sites that could drift — is logged; if a 5th
  checkout button is ever added, it needs the event added too.
- BUY NOW reads fresh `useCartStore.getState()` post-`addItem` for `cart_value` (the
  render-time hook closure would be stale/zero right after a cart create) — same pattern
  the handler already uses for `checkoutUrl`.

## Phase 5b — source attribution + remove-item (2026-05-30) ✅

Three additions surfaced by reviewing the live PostHog reports (user caught two real
gaps the original 5b spec missed):

1. **`source` on `cart_add_to_cart`** (`'homepage_buy' | 'pdp'`) — `BundleAndCTA` renders
   on BOTH the homepage buy section and the PDP, so without a source the two add surfaces
   were indistinguishable. Now we can see which surface drives adds.
2. **`source` on `checkout_started`** (`'drawer' | 'cart_page' | 'buy_now'`) — the three
   checkout entry points emitted an identical event; now each is attributed, so
   drawer-vs-cart-page-vs-impulse checkout behavior is separable.
3. **`cart_remove_item`** (`{ variant, quantity }`) — wired on the store `removeItem` path
   (drawer + cart page). Not a forward funnel step; it's a friction signal — pre-checkout
   removal is exactly the hesitation behavior the performance report flagged ("interest
   without conversion") and previously had no event.

**On autocapture vs typed events (clarified):** the `clicked button with text "..."` events
in reports are PostHog autocapture (on by default via `defaults: '2026-01-30'`), not
redundant with our typed events. Autocapture = wide exploratory net, brittle (keyed on DOM
text). Typed events = stable semantic spine with structured properties. Funnels/KPIs run on
typed events; autocapture is ambient backup. Left on pre-launch; can disable later if noisy.

| # | Beat | Tag |
|---|------|-----|
| 44 | "Reviewing the live event stream caught two holes my own spec missed: the add-to-cart event fired identically from the homepage and the product page, and the checkout event fired identically from three different entry points. Same event, no idea where it happened. A `source` property on each — three lines of typed payload — turned 'people are checking out' into 'people are checking out from the drawer 3x more than the cart page,' which is the difference between a number and a decision. The lesson: an event without the context of where it fired is half an event. Watch the real stream early, because the gaps are invisible in the spec and obvious in the data." | `integration-depth`, `pm-discipline` |

## Phase 5c-1 — Supabase server-side client + orders table (2026-05-31) ✅

Foundation for the orders mirror. Supabase project provisioned (region us-east-2),
`orders` table created, server-only client wired, verified with a throwaway
insert-and-read route. No webhook yet (5c-2).

**Supabase:** project in us-east-2 (close to Vercel's iad1 — negligible latency).
`orders` table = 13 columns, `shopify_order_id` unique (webhook-retry dedupe key),
`raw` jsonb (Phase 6 escape hatch), `email` included (own DB, not the analytics
stream). RLS enabled with NO policies — service_role bypasses RLS so the webhook
writes; nothing client-side can read. Table SQL committed to the repo (source of
truth for the schema, not just clicked into the dashboard).

**Client:** `lib/supabase/client.ts`, server-only (SERVER ONLY comment, no
`NEXT_PUBLIC_` env reads — the service_role key bypasses RLS and must never reach
the browser). `getSupabaseAdmin()` factory (env guard runs at call time, not module
import — surfaces missing-var errors clearly, plays nice with Next.js static
analysis). Env vars `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (cleaned up a stale
`NEXT_PUBLIC_SUPABASE_*` block left in `.env.example` by an old scaffold).

**The typed-insert that wasn't (the real beat):** Bolt's first pass made
`.from("orders").insert()` *look* type-checked but it only compiled via an `as never`
cast — the supabase-js v2 `Database` generic wasn't resolving, so inserts were
silently untyped. Caught it by asking "how does this type the insert?" instead of
trusting the green build. Fix: an `insertOrder(payload: OrderInsert)` helper — the
single typed insert path, `OrderInsert` enforced at the call site with no cast, the
unavoidable `as any` quarantined inside `client.ts`. The throwaway check route
exercises `insertOrder`, so 5c-1's verification validates the EXACT path 5c-2's
webhook will write through, not a different one.

**Schema/type coupling to maintain by hand:** the `as any` inside `insertOrder` means
the compiler won't catch a column mismatch inside the helper — `OrderRow`/`OrderInsert`
must stay manually paired with the table SQL in the repo. Comment in `client.ts` notes
the coupling.

**Verification:** check route → `{ ok: true, row: {...} }` (full 13-col row). Confirmed
the whole chain: client connects, `SUPABASE_URL` resolves, service_role authenticates +
bypasses RLS, `insertOrder` types the payload, table accepts. Route deleted + 404
confirmed; TEST row deleted from the table.

| # | Beat | Tag |
|---|------|-----|
| 45 | "The builder's insert compiled and the build was green, so by every visible signal it was done. I asked one question anyway — how is this insert actually type-checked? — and the honest answer was: it isn't, it's casting to `never` to silence the compiler. A typed-looking call that enforced nothing, which would have let a malformed order payload fail silently against the production table in the next chunk. The fix was a single typed helper. The lesson is the question, not the helper: 'it builds' and 'it's correct' are different claims, and the gap between them is exactly where the cast-to-shut-the-compiler-up bugs live." | `integration-depth`, `ai-collaboration` |

## Phase 5c-2a — Shopify orders/create webhook receiver (2026-05-31) ✅

The webhook pipe: Shopify checkout → `orders/create` webhook → HMAC verify →
Supabase upsert + PostHog `purchase` event. Verified end-to-end with a test order
(row in Supabase, event in PostHog, webhook in Vercel logs). NO identity stitch yet
(5c-2b) — purchases land under an `order_<id>` fallback distinctId.

**The webhook (`app/api/webhooks/orders/route.ts`):** reads raw body via `req.text()`
BEFORE parsing (HMAC must be computed on exact bytes — parse-then-restringify breaks
the signature), verifies `X-Shopify-Hmac-Sha256` with a timing-safe compare, 401s on
mismatch, parses only after. Maps the order → `OrderInsert`, upserts via `insertOrder`
(dedupes on `shopify_order_id` so Shopify retries don't double-count), fires the
server-side PostHog `purchase` via `posthog-node` with `await posthog.shutdown()` to
flush before the serverless function freezes. Downstream failures (Supabase/PostHog)
are logged but still return 200 — a hiccup must not trigger a Shopify retry-storm.

**Two bugs caught in plan-review before paste (Bolt's code, would've corrupted data):**
- Supabase write had `distinct_id: null` while PostHog used `order_<id>` — same order,
  unjoinable across the two systems. Fixed to write the `order_<id>` fallback to both,
  so they match (5c-2b overwrites with the real stitched id).
- `raw` re-parsed `rawBody` a second time instead of reusing the already-parsed object.

**The deploy-gap saga (the real lesson):** Bolt reported "clean build, here's what
shipped" for 5c-2a — but the code only ever existed in Bolt's sandbox. Bolt's sandbox
is NOT a git repo; it cannot push. So nothing reached GitHub, nothing deployed, and the
live route 404'd with zero Vercel logs (a request that hits no function leaves no trace).
Diagnosed by hitting the live URL: 404 = route not deployed, full stop. Root cause found
by checking GitHub (no commit) + Vercel (newest deploy was the PRIOR chunk). Fix: Bolt
printed the three full files, pasted into GitHub web editor by hand (the user's write
path, since Bolt can't push), committed, deployed. Confirmed fixed when the URL flipped
404 → 405 (route live, rejects GET). The whole episode is the sharpest instance yet of
"Bolt's status report describes its sandbox, not reality" — same family as the
working-memory false reports (#16) and the availability bug (#36).

**Manual setup done:** `orders/create` webhook registered in Shopify (Settings →
Notifications) pointed at `get-litsaber.vercel.app/api/webhooks/orders`, JSON, API
version 2026-04 (Storefront client is on 2025-07 — benign mismatch for the fields read).
`SHOPIFY_WEBHOOK_SECRET` set in Vercel from the Notifications-page signing secret (NOT
the per-webhook editor — that dialog doesn't show it). Third package add (`posthog-node`);
`--no-frozen-lockfile` handled the lockfile as expected.

| # | Beat | Tag |
|---|------|-----|
| 46 | "The builder said the webhook was built and the build was clean. The live URL returned 404 and the logs were empty. Both were true at once: it HAD written correct code, and that code had reached nothing — the builder's sandbox isn't a git repo, so 'done' meant 'done in a place nothing deploys from.' I found it by hitting the deployed URL, not by reading the report — 404 with no logs is the unmistakable signature of code that exists nowhere the running system can see it. The fix was mundane (paste three files into GitHub by hand). The lesson is that 'it builds' and 'it's live' are separated by an entire delivery pipeline, and the only honest test is the one run against the thing actually serving traffic." | `integration-depth`, `ai-collaboration` |

## Phase 5c-2b — Identity stitch + customer_name (2026-05-31) ✅

Stitches the PostHog visitor id through checkout so the server-side `purchase`
connects to the on-site session funnel. Verified: a fresh cart carried the id into
the order, Supabase row showed the real PostHog distinct_id (not the fallback), and
the purchase attached to the session timeline. `customer_name` also captured.

**Mechanism:** at `cartCreate` (first add), the store reads `posthog.get_distinct_id()`
(from the imported posthog-js singleton, NOT `window.posthog` — the window global may
be undefined depending on attach behavior) and writes it as a cart attribute
`posthog_distinct_id`. Shopify carries cart attributes to the order's `note_attributes`;
the webhook reads it there, uses it for BOTH the Supabase `distinct_id` and the PostHog
`distinctId`, falling back to `order_<id>` + a `console.warn` when absent. `customer_name`
built from `customer.first_name`/`last_name` (join non-empty, null if both empty); name
and email go to Supabase only, never PostHog properties. `customer_name` column added to
the table first (migration `002`) before the writing code deployed.

**KNOWN LIMITATION (logged, not fixed):** the attribute is only written at `cartCreate`.
A returning visitor with a persisted `cartId` adds via `cartLinesAdd`, skipping
`cartCreate`, so their cart never gets the attribute → their purchase falls back to
`order_<id>`. First-time visitors (the bulk of the funnel, and what the completion-rate
diagnostic most cares about) always hit `cartCreate` on first add, so they stitch. The
`console.warn` measures the real miss rate once traffic flows. Harden later with
`cartAttributesUpdate` on the add-to-existing-cart path ONLY if the miss rate warrants.

**Two debugging sagas (both instructive):**
- **Paste corruption (3 build cycles).** Hand-pasting Bolt's output into the GitHub web
  editor introduced transcription errors: a global find-replace mangled `supabase` →
  "Bolt Database" across `client.ts` (broke the import + every reference), and a separate
  paste dropped the `customer_name` line and later the entire `insertOrder` export. Each
  failed the build loudly (syntax error → type error → missing-export), caught before any
  bad deploy. Fix: wholesale-replace whole files rather than line-edit, and grep for "Bolt"
  (zero hits = clean). The deeper signal: the GitHub web-editor paste is itself an
  unreliable write path — SECOND confirmed-unreliable path after Bolt's GitHub sync. Worth
  moving to local-clone + git (see-the-whole-file, diff before push) rather than blind
  textarea pasting.
- **Stale-cart false alarm (code was right the whole time).** First stitch test failed —
  Supabase showed `order_<id>`, Vercel logged the fallback warn. Looked like a stitch bug.
  Wasn't: the browser had a persisted `cartId` from earlier testing, so `hydrate()`
  re-fetched it (`GetCart` in the network tab, not `cartCreate`), `addItem` went down
  `cartLinesAdd`, and `cartCreate` (the only path that writes the attribute) never ran.
  Diagnosed by reading the actual network request — `GetCart`/`cartLinesAdd` vs `cartCreate`
  was the tell. Fixed the TEST, not the code: fresh incognito → clean `cartCreate` with
  `attributes: [{ posthog_distinct_id }]` in the payload → real id on the order row.

**Bolt-push reality banked:** Bolt's sandbox is not a git repo and cannot push. "Bolt says
shipped" = sandbox state only; everything must be hand-pasted to GitHub by the user. This
is now standing fact, not a per-chunk surprise.

| # | Beat | Tag |
|---|------|-----|
| 47 | "The purchase event was landing disconnected from the session that produced it — a buy with no browse attached. The fix was to carry the analytics id through checkout as a cart attribute and read it back server-side, so the completed order rejoins the visitor's timeline. The thing it unlocks is the only question that matters for conversion: of the people who started checkout, which ones finished — answerable per person, not just in aggregate." | `integration-depth`, `agent-loop` |
| 48 | "Spent an hour chasing a stitch that 'failed' — wrong id on every test order. The code was correct the entire time. My browser kept reusing a cart created before the feature existed, so the code path that writes the id never ran. I found it by reading the actual network request instead of re-reading the code: the call was fetching an old cart, not creating a new one. The lesson is that when a feature fails only in your hands, suspect your test conditions before your code — a stale local cart is not a bug in the stitch, it's a bug in how you tested it. Incognito removed the variable and it worked first try." | `integration-depth`, `pm-discipline` |

## Phase 5 close + Promo/CRM track (2026-05-31) ✅

### Vercel Analytics + Speed Insights — Phase 5 closed
`@vercel/analytics` + `@vercel/speed-insights`, components rendered before `</body>`
in `app/layout.tsx` (stays a Server Component). KEY GOTCHA: there is no separate
dashboard "enable" toggle on the current Vercel flow — adding the `<Analytics />`
component IS the enable step; data flows once the deployed component sends its first
beacon. "No data" was not a bug: (1) the HubSpot email link points at PRODUCTION
(getlitsaber.com = old WordPress), not the Vercel preview, and (2) content blockers
block `/_vercel/insights/*` (same family as PostHog). Test in fresh incognito on the
PREVIEW url with real navigation. Complementary to PostHog, not redundant: Vercel =
performance/vitals, PostHog = product funnel.

**Phase 5 (observability) is COMPLETE:** full funnel (age gate → engagement → product
→ cart → checkout → server-side purchase, identity-stitched) + Supabase order mirror
+ Vercel performance. The whole metrics spine the framework was built on.

### Deferred-events status corrected
The green analytics build PROVED `FloatingPromoPopup`, `GoldWaitlistModal`,
`FutureDropsModal` exist as real files (a missing import would have failed the build) —
contradicting the earlier "unbuilt" assumption. They were functional, not stubs.

### ADR-006 — Customer Data Architecture (written, in docs/decisions/)
Documents VERIFIED reality, not plan. Three destinations, each a distinct lens:
HubSpot (CRM/customer-service, via native Shopify–HubSpot integration), Supabase
(agent data, via webhook), PostHog (funnel analytics, via webhook). Contact created
at popup signup (NOT at order — rejected delaying because it discards non-converting
leads and breaks code delivery). Email is the unifying key (HubSpot dedupes). No custom
redemption write-back needed — native order sync surfaces the discount code in HubSpot
for free (verified: GETLIT-WELCOME10 visible on the synced order object). Starter tier:
both customer + order sync enabled; contact unifies promo signup + order. Duplicate
contacts (different email at popup vs checkout) = accepted reconciliation tail, not
preventable, not worth blocking lead capture to avoid.

### Promo code is GETLIT-WELCOME10 (NOT WELCOME10)
Must match across 5 places: Shopify, HubSpot email callout box, email CTA button
`?discount=`, website auto-apply, PostHog. Has a hyphen — URL-safe, don't strip it.
The code STACKS with the automatic tier discounts (Phase 4c) — combinations enabled on
BOTH the code and the automatic discount (both must permit it). Verified: $29.99 off on
a multi-unit cart. Flagged as a deliberate margin choice (holds at ~67% even deepest
tier); confirm it's intended, not just path-of-least-resistance.

### Promo flow VERIFIED end-to-end
Form submit → HubSpot workflow → automated code email → contact created → code applied
at checkout → order placed same email → order synced to HubSpot contact → discount code
visible on the synced order. The unified customer object is real on Starter tier.

### In-cart promo fields REMOVED (commented, not deleted)
Decision: skip in-cart promo entry entirely; redemption rides on Shopify hosted
checkout's own discount field + `?discount=` auto-apply. In-cart fields in CartDrawer +
CartPageBody (mobile + desktop) commented out with `PROMO-FIELD-DISABLED:` markers, easy
to restore. Reasoning: Shopify's hosted checkout already has a discount field 1.5s later;
an in-cart field would duplicate it, own three error states, and fight Storefront-API
vagueness about WHY a code fails — building a worse version of a free field. Only loss:
"discount visible in cart total before redirect," which is unproven and A/B-worthy, not
worth the code.

### Robust ?discount= auto-apply (shipped, verified)
`lib/hooks/useDiscount.ts`: `useDiscountCapture()` reads `?discount=CODE` on any landing
and writes sessionStorage `litsaber_discount` (NEVER clears on a param-less page — the
don't-clear guard is the difference between "survives browsing" and "falls off on
navigation"). Mounted in CartHydrator (already client, already every-page). At
`cartCreate` the code rides as a SECOND cart attribute `discount_code` alongside
`posthog_distinct_id` (reuses the identity-stitch pattern → inherits its SAME limitation:
returning visitor with persisted cartId adds via cartLinesAdd, skips cartCreate, attribute
not written; fresh-from-email first-timers work, which is the dominant welcome-code case).
`appendDiscountToCheckoutUrl()` appends to the checkoutUrl at the two navigation sites
(`?` vs `&` handled). Verified: param persisted across navigation, both attributes in the
cartCreate payload, `&discount=GETLIT-WELCOME10` present on the Shopify checkout URL.
NOTE: a test showed the code not auto-applying — diagnosed as one-per-customer (the test
customer had already redeemed it), NOT a code bug. Email link also carries HubSpot
tracking params (_hsenc/_hsmi/utm_*) after `?discount=` — capture reads only `discount`,
unaffected.

### Reusable toast system (shipped, verified) — replaced inline form success
`lib/toast/store.ts` (Zustand, ephemeral, 5s auto-dismiss, success|error variants),
`components/layout/ToastContainer.tsx` mounted in layout at NEW z-layer `z-toast` (350,
above age-gate 300; added to tokens.json + tailwind.config). Pivot: the promo popup
CLOSES on submit, so the inline success block had nowhere to live (the "form just closed,
no message" bug). All three forms now close-and-toast with per-form messages (promo:
"check your inbox, your code's on the way"; Gold: "you're on the Gold list…"; Future
Drops: "you're in…"). WaitlistForm refactored to a pure input/submit component — inline
`success` state + `successMessage` prop REMOVED (dead code from the superseded approach),
`onError` callback added. Inline FIELD error (red border/message) KEPT for validation;
toast is for API-level failure (form stays open to retry). a11y: aria-live on a stable
always-mounted wrapper, not per-toast. Verified the full matrix: 3 forms × success (each
fires its own message), error path (toast + form stays open), z-layering above modals.

### MILESTONE: Bolt sync started working reliably
After a whole session of two unreliable write paths (Bolt sandbox couldn't push;
GitHub web-editor paste corrupted files across 3+ build cycles), Bolt began syncing to
GitHub correctly during the toast chunk. "Build clean" now plausibly means code actually
reached the repo. Reduces (doesn't eliminate) the case for the local-git workflow —
still worth doing before Phase 6, but the acute pain is gone.

| # | Beat | Tag |
|---|------|-----|
| 49 | "The in-cart promo field is the build I talked myself out of. Shopify's hosted checkout already has a discount field one screen later — an in-cart version would duplicate it, own three error states, and fight an API that's vague about why a code fails. I'd have built a worse copy of something free. The redemption rides on the checkout URL instead. The discipline is recognizing that 'the customer asked to start here' isn't the same as 'this is the thing worth building.'" | `pm-discipline`, `scope-control` |
| 50 | "Wanted to block already-redeemed customers from re-submitting the email form. Every honest path to 'does this email already exist' led to a lookup endpoint — the same complexity I'd already deferred once. The actual fix was copy: a success message that's true whether they're new or returning ('check your inbox, and if you already signed up it's already there'). The financial protection already existed twice over (HubSpot first-time enrollment + Shopify one-per-customer). I was about to build a guard for something already guarded." | `pm-discipline`, `scope-control` |
| 51 | "The form 'success message not showing' wasn't a missing message — the popup closes on submit, so an inline success block had nowhere to live. The right pattern when the container closes is a toast: independent of the popup, persists after it's gone. Built it reusable (success + error) because the infra cost is identical and form feedback is needed in five other places. The bug diagnosed the architecture." | `integration-depth`, `ui-judgment` |
| 52 | "Three build-cycles of paste corruption, then Bolt sync just… worked. The lesson isn't 'the tool fixed itself' — it's that I'd built enough discipline around the bad path (wholesale-replace, grep for the corruption signature, verify on the live URL not the sandbox's word) that when the path got reliable, I could tell immediately. Trust returned because it was earned against a checklist, not assumed." | `tool-choice`, `ai-augmented-build` |

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

---

### Phase UI — Full eight-page site build-out (2026-05-31 → 2026-06-09) ✅

The stretch that turned a homepage-plus-commerce build into the complete eight-page site. Every page in the ADR-002 site map is now built and composed, the PDP is fully fleshed out, four new homepage sections landed, the reviews provider was reversed, and the Activate page — the single largest remaining open item — shipped in full. Bolt sync was reliable for most of this stretch (the write-path pain from Phase 5 had cleared), so chunks moved fast; the doc is reconstructed from the repo state at commit `f16be54`, not from per-chunk reports.

**Route inventory now live (16 routes):** `/`, `/shop/litsaber-og`, `/the-tech`, `/wholesale`, `/about`, `/contact`, `/activate`, `/cart`, `/policies` (index) + `/policies/{shipping-returns, warranty, terms, privacy}`, plus legacy `/policies/shipping` and `/policies/refunds` now serving `next/navigation` redirects to `/policies/shipping-returns` (consolidation done cleanly — old URLs preserved, no duplicate page bodies). `/shopify-check` debug route still present (REMOVE pre-Phase-7).

#### PDP build-out + Reviews provider REVERSED (ReviewInfra → Judge.me) (2026-06-02/03)

- **PDP fleshed out:** added `ProductAccordion`, `DescriptionSection`, `GalleryBlock`, refined `StyleSelector`. `ProductDisplay` moved `components/home/` → `components/product/ProductDisplay/` with imports updated (it renders on both the homepage buy section and the PDP, so the shared home location was misleading).
- **Reviews provider is now Judge.me — supersedes the ReviewInfra decision in ADR-002.** This collapses an entire branch of open questions. Judge.me is a Shopify-native reviews app, so the integration is its hosted widget rather than a custom subsystem:
  - `components/reviews/JudgemeScripts.tsx` — global `next/script` preloader (`cdnwidget.judge.me/widget_preloader.js`, `afterInteractive`) + inline `jdgm` config (shop domain, platform, public token). Mounted once in `app/layout.tsx`.
  - `components/reviews/JudgemeReviewWidget.tsx` — the `jdgm-review-widget` div keyed by the numeric Shopify product ID (`7870095392975`), rendered on the PDP.
  - `components/reviews/WriteReviewButton.tsx` — links to Judge.me's hosted review-submission form.
  - **What this retires:** the custom reviews subsystem spec (rating summary, distribution chart, AI-summary card, photo carousel, search, filter chips — Phase 1.5 beat #10), the Path A vs Path B decision, the AI-summary build-or-skip question, and the "email ReviewInfra to confirm a read API" action item. All moot. Brand-control trade-off is the same one we'd have taken on ReviewInfra Path A: the widget renders Judge.me's markup, not the rich Figma spec.
  - **Why the reversal makes sense:** Judge.me rides the native Shopify integration we already committed to in ADR-006, syncs review-request emails off real orders without a custom Orders-API handoff, and removes the small-vendor risk that made ReviewInfra a structural Phase 4 decision in the first place.

#### `/the-tech` — Engineering page (2026-06-02 → 06-07)

Sections (all reading from `the-tech.content.ts`): `TechHero`, `InhaleVideo` (the draw/inhale demo video block), `PowerSection`, `VoltageSection` (the 3-voltage / oil-pairing explainer — the heaviest section, many iterations), `UniversalFit` (510 compatibility), `TechCta`. This is the page the Phase 1.5 spec called "Engineering"; the live route is `/the-tech`.

#### `/wholesale` — built incl. HubSpot form (2026-06-04)

Sections: `WholesaleHero`, `WholesaleStatsBar`, `SellsItself`, `SellThrough`, `DemandSection`, `MarginsSection`, `RetailKit`, `WholesaleFaq`, `WholesaleCta`. The HubSpot Company-object form integration (the `0-2/` prefixed custom fields) is wired here. `RetailKit` re-hit the known `overflow-hidden` kills `sticky` trap during the build (consistent with the standing learning).

#### `/about` — built (2026-06-05/06)

Sections: `AboutHero`, `AboutOrigin`, `AboutJourney`, `AboutTeam`, `AboutManufacturing`, `ManufacturingImageBand`, `JourneyVideoBand`, `PrototypeTimeline`, `AboutNow`, `AboutClosingCta`. Co-founders Matt Hall and Brendan Friedrich under Innovape Concepts. Real `about` imagery committed (not placeholder), including a prototype-timeline narrative band.

#### `/contact` — built, real copy (2026-06-06)

Sections: `ContactHero` (styled as a chat card), `ContactForm` (HubSpot form, portal 244547358, na2, FAQ-adjacent), `ContactMethods` (clickable method cards with hover borders), `ContactFaq`. **The contact FAQ is now real copy, not the boilerplate placeholder flagged in Phase 1.5** — detailed answers on 510 compatibility (95–99% across major brands, 10.5–14.5mm), battery life (1–1.5yr, 300+ cycles), mode/charge-check button combos, materials, and stealth mode. **Danksaber is resolved as reframed, not removed:** the FAQ keeps the comparison but turns it into a positioning narrative ("Danksaber is built around discretion… different products for different moments") rather than a knock. Closes the "keep, reframe, or remove" open question.

#### `/policies` — full set (2026-06-06/07)

`PolicyHeader`, `PolicySubNav`, `PolicySection`, `PolicyContents` shells over typed content files: `shipping-returns.ts`, `warranty.ts`, `terms.ts`, `privacy.ts`, `shared.ts`. Canonical policy language locked and internally consistent: **14-day returns on unopened product + 6-month limited warranty against manufacturing defects** (no general/sizing returns; defects covered under warranty, not refund). Damaged-in-transit window is 7 days. See the warranty finding below — the policy pages are correct; the marketing surfaces are not.

#### `/activate` — COMPLETE (2026-06-07 → 06-09) — closes the largest open item

The post-purchase onboarding page (Phase 1.5 beat #9, "the secret weapon") is fully built. Sticky `ActivateSubNav` (IntersectionObserver chip nav, the second place the `overflow-hidden`/`sticky` trap was beaten), then every functional section: `ActivateHero`, `ActivateQuickStart`, `ActivateFunctions`, `ActivateModes`, `ActivatePreheat`, `ActivateVoltage`, `ActivateBattery`, `ActivateCharging`, `ActivateCartTips`, `ActivateSafety`, `ActivateCta`. All copy in `activate.content.ts`; a `renderPara.tsx` helper handles inline rich-text. `ChargingAnimation.tsx` is a new bespoke client component — IntersectionObserver-gated CSS segment animation for the battery-charging visual, paused off-screen and disabled under `prefers-reduced-motion` (same motion discipline as the rest of the site).

#### New homepage sections (2026-05-31 → 06-06)

Added below the existing scroll order in `app/page.tsx`:
- **`WhatCustomersSay`** — social-proof block built around a `TikTokRail` (TikTok video cards via the TikTok CDN, with `next/image` and CDN hostname patterns added to `next.config`) plus an async Elfsight widget. New external surface; first TikTok/Elfsight integration in the build.
- **`EmailSignupBanner`** (in `components/global/`, gated by `EmailSignupBannerGuard`) — conditional homepage email capture, mounted in layout. The guard suppresses it where it shouldn't show.
- **`WholesaleCTABanner`** — homepage wholesale cross-sell banner (a hydration-mismatch bug here was fixed by moving its mount).
- **`FloatingPromoPopup`** — now mounted in `app/layout.tsx` at `z-modal`, gated on age-confirm + the 12s/exit-intent + frequency-cap logic from Phase 5. This is the promo-box frontend that was an open pre-launch item; it now exists and is wired to the discount/HubSpot flow.
- `HomepageEngagementTracker` (the Phase 5b invisible client tracker) is mounted at the top of the page.

#### Modal consolidation (2026-05-31)

`ModalBase` extracted; `GoldWaitlistModal` and `FutureDropsModal` refactored onto it, and `AgeGateModal` moved into `components/modals/` alongside them. All three waitlist/age modals + the promo popup are now mounted globally in layout. This closes the Phase 3 remainder (Gold modal, Future Drops modal, Editions-box wiring) — the Editions boxes now open these real modals. **`FestivalDropList.tsx` was deleted** — the deferred "FESTIVAL DROP LIST" cart signup was retired in favor of the `EmailSignupBanner` / waitlist-form approach rather than rebuilt.

#### Global polish + dependency (2026-06-04/07)

- Navbar logo + nav-link sizing standardized; global padding + navbar scaling standardized across pages (touched `tokens.json` + `tailwind.config.ts` — NAVBAR_LEFT sync risk applies, verify hero files still match).
- New dependency: `@opentelemetry/api ^1.9.0` (added 06-04 to satisfy a build/peer requirement; `--no-frozen-lockfile` install path already standing from Phase 5a handled the lockfile).

#### ⚠️ KEY FINDING — the "30-day guarantee" inconsistency did not get resolved, it PROLIFERATED

The Phase-1.5-era flag (BuySection "30-day guarantee" vs canonical "14-day return + 6-month warranty") was never reconciled, and the marketing copy has since spread the wrong figure to **six** live surfaces:
- `components/home/StatBar.tsx` — "30-Day Guarantee" stat pill
- `components/the-tech/the-tech.content.ts` — `CTA_SUBHEADLINE` ("Backed by a 30-day guarantee")
- `components/wholesale/wholesale.content.ts` — spec body ("…USB-C, 30-day guarantee")
- `components/about/about.content.ts` — closing copy ("backed by a 30-day guarantee")
- `components/product/ProductDisplay/productdisplay.content.ts` — trust line ("SHIPS IN 24 HOURS · FREE US SHIPPING · 30-DAY GUARANTEE")
- `components/home/CommonQuestions/commonquestions.content.ts` — FAQ answer that **explicitly promises** "If something goes wrong within 30 days, we replace it."

Meanwhile the **policy pages and the contact FAQ are correct** (14-day return + 6-month limited warranty). So the site now ships a direct contradiction between its marketing copy and its own legal pages — a customer-service and arguably a consumer-claims exposure, not just a copy nit. Resolution is a content-file pass (decide the real promise, then align all six surfaces to the policy language or vice-versa). Highest-priority unresolved item from this review. (`BuySection.tsx` itself no longer exists — the homepage buy section was rebuilt — so the original flag's location is gone, but the figure outlived it.)

#### Doc drift to fix (decisions changed, the persistent docs didn't)

- **`CLAUDE.md` still names ReviewInfra as the locked provider** (the "Reviews provider — ReviewInfra (locked)" block, plus the tool-stack line). It now contradicts the shipped Judge.me integration. Update CLAUDE.md and add/append an ADR (or amend ADR-002) recording the Judge.me reversal so the next session loads truth.
- **Judge.me shop domain mismatch to verify:** `JudgemeScripts.tsx` config uses `ajur1e-s1.myshopify.com` while the Storefront client uses `innovapeconcepts.myshopify.com`. Confirm this is intentional (Judge.me's own shop identifier vs the storefront domain) and not a stale/test value, or reviews will resolve against the wrong store.

**Story beats captured (Phase UI)**

| # | Beat | Tag |
|---|------|-----|
| 57 | "Reversed the reviews provider from a small script-tag vendor to Judge.me, a Shopify-native app. The decision that looked like a cosmetic swap actually deleted an entire subsystem I'd specced — distribution charts, AI summaries, photo carousels, a custom data-API path, and an action item to email a vendor about whether a read API even existed. The lesson wasn't 'Judge.me is better'; it was that once I'd committed to native Shopify for customer data in ADR-006, the reviews provider that rides the same integration was the consistent choice, and consistency across the data architecture beat the richer bespoke UI I'd drawn." | `tool-choice`, `integration-depth` |
| 58 | "Built six pages in nine days and the thing that needs flagging loudest isn't a page — it's that 'backed by a 30-day guarantee' quietly copied itself onto six marketing surfaces while the policy pages say 14 days plus a 6-month warranty. Nobody decided to ship a contradiction; the copy just propagated faster than the reconciliation. The discipline that catches this is the same cross-document audit from Phase 1.5 — but it only works if it's re-run after a build sprint, because a sprint is exactly when an unresolved inconsistency breeds." | `pm-discipline`, `discovery` |
| 59 | "Kept the named-competitor FAQ instead of deleting it, and turned it into positioning: not 'we're better than Danksaber' but 'they optimize for hiding the cart, we optimize for being the centerpiece — different products for different nights.' A comparison you control reads as confidence; a comparison you scrub reads as fear. The reframe does more brand work than the deletion would have." | `pm-discipline` |
| 60 | "Finished the Activate page — the post-purchase onboarding most DTC brands skip. It was the largest open item for a reason: eleven functional sections, a sticky chip-nav that re-triggered the overflow-hidden-kills-sticky trap I'd already hit twice, and a bespoke charging animation that has to pause off-screen and respect reduced-motion. Shipping it in v1 instead of deferring to a 'v2' that never comes is the whole bet: the page that reduces support tickets is the one that proves the engineering thesis to the customer holding the device." | `discovery`, `integration-depth` |
| 61 | "The decisions moved but two persistent docs didn't: CLAUDE.md still calls ReviewInfra the locked provider, so the next agent session would load a fact the codebase already contradicts. A working-memory doc that lags reality is just a worse memory. The maintenance pass — reconcile the doc to the repo, not the other way around — is the actual product here, and it has to happen on a cadence or the context rots." | `pm-discipline`, `ai-augmented-build` |

---

### Phase 6 — Production Agent (pending)

n8n cron → data gathering → Claude API with tool schema → structured report → Slack + email. Agent *proposes* tests, never *runs* them.

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

**🔴 TOP PRIORITY — surfaced in the 2026-06-09 repo review:**
1. **Warranty/guarantee contradiction across the live site.** Six marketing surfaces say "30-day guarantee" (StatBar, `the-tech` CTA_SUBHEADLINE, `wholesale.content.ts`, `about.content.ts`, `productdisplay.content.ts` trust line, and the homepage CommonQuestions FAQ which explicitly promises 30-day replacement) while the policy pages and contact FAQ say 14-day return + 6-month limited warranty. Decide the real promise, then align all six content files to the policy language (or change the policy). Content-file-only pass.
2. **`CLAUDE.md` (and ADR-002) still name ReviewInfra as the locked reviews provider** — contradicts the shipped Judge.me integration. Update CLAUDE.md and record the reversal in an ADR so the next session loads truth.
3. **Verify the Judge.me shop domain** in `JudgemeScripts.tsx` (`ajur1e-s1.myshopify.com`) vs the Storefront store (`innovapeconcepts.myshopify.com`) — confirm intentional, or reviews resolve against the wrong store.

**Phase 3 remainder — ✅ RESOLVED (2026-06-02 → 06-06):**
- ~~Gold waitlist modal~~ → built (`GoldWaitlistModal` on `ModalBase`)
- ~~Future Drops modal~~ → built (`FutureDropsModal` on `ModalBase`)
- ~~Wire Editions box actions~~ → done (boxes open the real modals / navigate)
- ~~"FESTIVAL DROP LIST" `/cart` signup~~ → `FestivalDropList.tsx` deleted; superseded by `EmailSignupBanner` + waitlist forms

**Phase 2 quantity discount refactor — ✅ SHIPPED (2026-05-27):** Chunk A (store + Pattern B selector + `lib/cart/pricing.ts`) and Chunk B (stepper removed from drawer + cart page) both committed. Logged in build log.

**Carry-forward items from 3c-1:**
- Confirm WaitlistForm border is cyan-20% per Figma node `3703:7914` — verify it didn't inherit a drifted value (still open; low priority)
- ~~Reconcile offer-amount copy ($5 vs $10)~~ → RESOLVED: offer locked at $10 (Phase 4 / ADR-004)
- Decide rate-limit durability: current in-memory Map resets on cold start; upgrade to Upstash Redis if real abuse appears (still open)

**Action items still open:**
- ~~Email ReviewInfra re: read API / AI summary~~ → MOOT. Reviews provider is now Judge.me; the whole ReviewInfra question branch is retired.

**Pre-launch (non-blocking until later):**
- ~~AI Summary final approach~~ / ~~ReviewInfra Path A vs Path B~~ → MOOT (Judge.me, see above)
- ~~Floating promo trigger logic + frequency cap~~ → RESOLVED (2026-05-28): 12s + exit-intent; 72h dismiss / 365d subscribe cookies. Offer locked at $10. Promo code architecture → ADR-004 (Architecture A).
- ~~Build promo box frontend (Figma `3770:1315`)~~ → BUILT: `FloatingPromoPopup` mounted in layout, wired to discount/HubSpot flow + Phase 5 instrumentation.
- Remove `console.log("[PDP]")` from `app/shop/litsaber-og/page.tsx` (verify on next pass in that file)
- Remove `/shopify-check` debug route before Phase 7 (still present)
- Flip Authorize.net from test to live before launch
- ~~Section 6 empty frame on homepage~~ → RESOLVED (2026-05-23): Editions + commerce display section (node `3312:2`), built.
- Venue card photography sourcing
- FAQ #3 placeholder copy (homepage) — re-verify against the now-real CommonQuestions copy (note: this FAQ carries the 30-day-guarantee error, item #1 above)
- ~~Contact page FAQ body copy (placeholder)~~ → RESOLVED (2026-06-06): real copy written across all contact FAQ categories.
- ~~"Danksaber" direct competitor mention — keep, reframe, or remove~~ → RESOLVED (2026-06-06): reframed as a positioning narrative, kept.
- "LITSABER OG +" title — verify `+` is intentional
- ~~2-Pack "SAVE $20" badge math reconciliation~~ → RESOLVED (2026-05-27): quantity discount model — tier prices are exact ($99.99, $134.99, $169.99, $199.99), display badges round to nearest dollar ("SAVE $20", "SAVE $45", "SAVE $70", "SAVE $100").
- Mix-and-match UI revisit when Gold ships (currently no UI for Silver+Gold combinations; customer would use two add-to-cart actions if Gold were live)
- Engineering kinetic animation system spec (note: `/the-tech` and `/activate` shipped with Framer/CSS section motion + a bespoke `ChargingAnimation`; the "kinetic" exploded-view system may now be a polish item rather than a build item — re-scope)
- NAVBAR_LEFT / token sync check after the 2026-06-07 global padding + navbar scaling pass touched `tokens.json` + `tailwind.config.ts` — confirm hero files still match.

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
- **Phase UI:** The 2026-05-31 → 06-09 sprint that built out the remaining six pages, fleshed out the PDP, added the new homepage sections, consolidated modals, and reversed the reviews provider to Judge.me. Named retroactively because the work spanned the nominal Phase 3/4 boundary and was page-build-driven rather than phase-driven.
