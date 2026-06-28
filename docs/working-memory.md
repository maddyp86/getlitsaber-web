# Litsaber Website Rebuild — Working Memory

A live log of the build, decisions made, and story beats captured along the way. Use this as the source for content posts and interview narratives. Updated phase by phase.

---

## Revision Log

**2026-06-28 — Mobile crash root-caused: dual-mounted desktop+mobile trees, not GPU/blur.** The live homepage was crashing on mobile Safari and Chrome (iOS): load → blank → reload → "A problem repeatedly occurred / Can't Open This Page." That signature is the iOS WebKit WebContent process being OOM-killed and failing on repeated reload. A first pass (commit `1c1c3a5` "Fix mobile performance issues") chased the GPU/memory angle — gated `useScroll` parallax behind `innerWidth`, shrank a `blur(150px)` orb to `blur(80px)`, gave PartyVideo an aspect-ratio box, paused the WhereItLives marquee off-screen. None of it changed the crash, because none of it touched the actual memory hog.

**Real root cause:** the homepage renders heavy sections as TWO separate component trees toggled with CSS — `<HeroDesktop className="hidden lg:block" />` + `<HeroMobile className="lg:hidden" />`, same pattern in `BeSeen`, `ThreeModes`, `UnderTheHood`, `CommonQuestions`. `display:none` hides pixels but does NOT unmount the React subtree, stop `next/image` downloads, or destroy `<video>` elements. So every phone was loading the full desktop tree invisibly — its own autoplay videos, full-size images, the 1500px hero, the 300vh scrollytelling — on top of the mobile tree. Combined with visible videos that autoplayed and never paused, this blew past the iOS WebContent memory ceiling. The lesson (worth a content beat): on mobile, `hidden lg:block` is not free — a hidden subtree still costs full memory, and the cost is invisible until a device with a hard ceiling kills the tab.

**Fix:** new `components/primitives/ResponsiveMount.tsx` mounts exactly ONE variant via `matchMedia` (mobile-first SSR/first-paint → no hydration mismatch, then upgrades to desktop above 1024px). All five wrappers converted to it, so the off-viewport tree and all its media never enter the DOM. Verified in the local preview: at 375px the homepage mounts 3 videos instead of 5 and the desktop hero (`minHeight:1500px`) is absent from the DOM; at 1280px the desktop variants mount correctly (no regression); type-check clean, no console/hydration warnings.

**Second pass — the "crashes the instant I scroll" detail.** Tester confirmed the live site dies on scroll-start (Chrome iOS "Can't open this page"). Two scroll-triggered mechanisms explain it, both now addressed: (1) `BeSeenDesktop`'s 300vh scrollytelling registers a `useScroll` listener that fires on every scroll and swaps full-size desktop stage images — mounted on mobile via `display:none`, never gated by Bolt; `ResponsiveMount` removes it from mobile entirely. Note `BeSeenMobile` ALSO has its own 300vh sticky scrollytelling (`useStageScroll`), which `ResponsiveMount` keeps — it's the heaviest scroll component remaining on mobile and the next lever if anything still struggles (its `reducedMotion` branch already degrades to a simple stacked layout). (2) The iOS **simultaneous-H.264-decoder limit**: scrolling brings a 2nd/3rd autoplay `<video>` into view, the WebContent process tries to exceed the hardware-decoder cap, and the tab is killed. Fixed with `lib/usePlayWhenVisible.ts` — a CALLBACK-ref IntersectionObserver hook (callback ref so it re-attaches across Framer `AnimatePresence` remounts of keyed `<motion.video>`) now wired into ALL five homepage videos (Hero mobile/desktop, ThreeModes mobile/desktop, PartyVideo), pausing every off-screen clip so concurrent decode stays ~1; below-the-fold videos also set `preload="none"`. Also flagged: Bolt's `LightMeetsVapor`/`PartyVideo` "gate" is half a fix — it calls `useScroll` unconditionally and only zeroes the output, so the scroll listener still runs on mobile (cheap, left as-is).

**Status: NOT yet validated on a real device.** The fix is uncommitted on local `staging`; the live crash screenshots are still the old production code. The local headless preview cannot reproduce the iOS crash (desktop RAM, and Blob media doesn't load locally so `<video>.play()` can't be exercised). Real validation requires a Vercel **preview** deploy tested on the tester's phone before merging to production. (Local-dev notes unrelated to the bug: local `node_modules` is missing `@vercel/edge-config` and `pnpm-lock.yaml` is from an incompatible pnpm version — both production-irrelevant.)

**2026-06-27 · Final consistency + numbering pass (this revision).** Cleanup sweep to ready the doc as the project-completion reference. Changes:
- **Build Log restructured (Phase 2 / Phase 3).** Phase 2 is now one contiguous, sequentially numbered block: **Phase 2 (umbrella) → 2.1 Foundation built → 2.2 Foundation audit + deploy → 2.3 Palette + Motion → 2.4 Hero → 2.5 public/ incident.** The Claude Code handoff + architecture work that was mislabeled and sitting mid-Phase-2 is now its own clean **Phase 3 (Claude Code Audit, Architecture & Homepage Completion)**, with the "Remaining homepage sections" folded under it as **Phase 3.1** (where Be Seen / StatBar and the rest were actually built). The previously unnumbered commerce sections are grouped after Phase 3 with explicit track numbers: **Commerce Phase 1 (planning) → 1a/1b → 2a/2b/2c + 3a/3b/3c-1 → Quantity-discount refactor.** No build text was rewritten; sections were moved and re-headed, story-beat captions realigned to the new numbers (beat IDs kept stable), and one cross-reference fixed.
- **Section labels fixed.** "Phase 1.1" heading corrected to **Phase 1.5** (every internal reference and the glossary already used 1.5). The duplicate **"Phase 6.1"** heading on the launch-baseline section renumbered to **Phase 6.6** (it follows 6.5 and the done/pending summary). In Phase 5 the channel-attribution section had collided with the **5.5a** device-type sub-item; it is now its own subsection **5.6 - Channel attribution reworked**, and the init-before-mount section moved from 5.6 to **5.7**, giving a clean 5.1 to 5.7 sequence (5.5 keeps its internal a/b/c fixes).
- **Story beat numbering made sequential.** The Phase 5 beats table under 5.5 had carried 11 verbatim duplicates of Phase 4 / Phase 2 / Media beats (old P5-1 through P5-11); those were removed. All genuine Phase 5 beats renumbered to a clean **P5-1 through P5-8**, eliminating the duplicate P5-13 and P5-14 IDs that appeared twice.
- **Completed items closed.** Build-Phase-3 remainder items (Gold modal, Future Drops modal, Editions wiring, cart Festival Drop List) marked resolved against the commerce build log. Three Phase 7 cutover items (Authorize.net live flip, box-QR repoint, account-subdomain branding) moved out of the pre-launch open list into Resolved, dated 2026-06-27.
- **Stale reference fixed.** Replaced the legacy global "beat #28" pointer with the phase-scoped reference (QD-1).
- **Still genuinely open (left as-is, not closed):** outreach-PDF rewrites (wholesale + cheat sheet), warranty/guarantee messaging reconciliation (30-day vs 14-day + 6-month), footer $49.99/$59.99 price bug, "light-show" PDP headline, and the n8n error-notification workflow.

**2026-06-27 — Phase 7 cutover executed (store is LIVE).** DNS flipped: `getlitsaber.com` now resolves to Vercel, WooCommerce retired. Cutover was a nameserver migration (DNS was delegated to HostGator `ns157/158.websitewelcome.com`, not Namecheap BasicDNS as assumed), which required manually recreating Google Workspace MX (5 × `aspmx.l.google.com` set) + SPF (`v=spf1 include:_spf.google.com ~all`) at Namecheap after the switch. Three new subdomains live: `checkout.getlitsaber.com` (Online Store primary, serves checkout + app proxies), `account.getlitsaber.com` (passwordless Customer Accounts), `returns.getlitsaber.com` (connected but unused — see Returns below). Customer accounts required a Google OAuth redirect-URI reconfig (callback drops the store ID on the custom domain: `https://account.getlitsaber.com/authentication/social/google/callback`). Warehut handed scoped Shopify credentials. Claude Code now operational as write path (native installer, on `staging`). Returns policy fully re-specified (no RA, fault-based shipping split). Free USPS shipping confirmed. STILL UNVERIFIED post-launch: Authorize.net live-vs-test, and `maintenanceMode` flag state (policy URL fetched the maintenance splash on 06-27). Both are now LIVE-store risks, not pre-launch checkboxes.

**2026-06-27 — Deploy workflow correction (staging/preview pipeline).** [full entry: documents that the doc claimed PR/preview-from-Phase-2 but Bolt was committing straight to main with no preview deploy ever existing; staging branch created in Bolt and switched onto; first push produced the first preview deploy; promote path is staging → main via GitHub PR. Notes the downstream edits and that branch protection is logged but not enabled.]

**2026-06-25 — Near-mount event race root-caused and fixed at the provider layer; product_viewed fidelity and dedup fixed.** The onFeatureFlags patch from 5.2 was a partial fix: a `posthog.onFeatureFlags()` callback registered before `posthog.init()` runs never fires, so `product_viewed` and `promo_code_captured` fired about 5 minutes late or not at all on real traffic. Fixed by initializing PostHog before child components mount (`useLayoutEffect` in `providers.tsx`) and routing `useDiscount.ts` through `trackWhenReady`. Separately: removed the duplicate `product_viewed` emitter on the PDP (two components were both firing it), and moved `product_viewed` from mount to viewport entry (IntersectionObserver), closing the homepage false positive logged in 5.2. Full detail in new section 5.7. The 5.2 fidelity gap and the 5.5c "hanging onFeatureFlags" both trace to this one root cause.

**2026-06-22 — Consistency pass (this revision).** Swept the document for drift accumulated across phases. Changes:
- Reviews provider corrected throughout: **ReviewInfra → Judge.me** (Judge.me is the confirmed provider; historical entries annotated as superseded, forward-looking items resolved, a Judge.me closeout entry added). Related open questions closed.
- **Phase 6 "done vs pending"** block rewritten to match the live end-to-end state described in Phase 6.5 (weekly + daily pipelines both shipping).
- **Story beat IDs switched to phase-scoped IDs** (e.g. `P4-1`) to kill duplicate/non-monotonic global numbers. Internal cross-references updated. A global→scoped mapping is at the bottom of the Story Beats Bank.
- **Promo offer locked at $10** (ADR-004); the "$5 vs $10" reconciliation items closed.
- **Outreach PDFs target spec confirmed: MSRP $59.99, MOQ 5, 80 case pack, 4 tiers, 41 LEDs, 10 colors, landed cost $13.33** (not the $18 / 9-tier / 31-LED figures still printed in the legacy PDFs). Rewrite is the action item.
- Added a **Track Map** to disambiguate the build-phase track from the commerce-sub-phase track.

---

## Track Map (read this first)

Two parallel phase numberings run through this doc. They are NOT the same track:

- **Build track** — `Phase 1 … Phase 7`. The overall project arc: tokens/repo → foundation → homepage build → audit → Shopify → observability → production agent → launch.
- **Commerce sub-phase track** — `Commerce Phase 1`, `1a/1b`, `2a/2b/2c`, `3a/3b/3c-1`, `4a/4b/4c`. The decoupled cart build that runs INSIDE build-Phase-2/3 and build-Phase-4. Its sections are grouped together under their own `Commerce Phase …` headings (after Phase 3 in the Build Log). "Commerce Phase 4" = the Shopify swap; it lands during build-Phase-4.

Where a heading reads `Commerce Phase …`, it is the **commerce** track. Build-Phase-3 is the Claude Code audit + architecture + homepage completion. When in doubt, the commerce track is always the cart/checkout work.

---

## Project at a Glance

**What:** Replatform `getlitsaber.com` from WordPress/Avada to a modern Next.js storefront on Shopify, instrumented with a production AI agent that runs weekly conversion analysis and proposes A/B tests.

**Why now:** The current WordPress/Avada site was an agency build that prioritized output over outcomes. Conversion data didn't support the spec-sheet narrative the site led with. The rebuild does two things at once: (1) reposition Litsaber from "vape battery" to "festival accessory that happens to hit 510 carts," and (2) replace a static marketing site with a learning system that compounds.

**Repositioning thesis (locked):**
> Litsaber is a festival accessory that happens to hit 510 carts — not a vape battery with an LED. It's meant for buyers who self-identify by what's visible at the night, not by what's hidden in their pocket. Every product, copy, design, and channel decision should foreground visibility, lifestyle, and the engineered hardware that makes it credible — and should refuse any framing that competes Litsaber on discretion, commodity vape specs, or low price.

---

## Tool Stack & Rationale

| Phase | Tool | Why this tool |
|------|------|---------------|
| Design | Figma | Source of truth for visual + messaging decisions |
| Scaffold | Bolt | Fastest Figma→Next.js scaffold; being retired as write path (token budget) in favor of Claude Code |
| Build & integrate | Claude Code | Now the operational write path (native installer, works on `staging`). Verify diffs in GitHub Desktop; pull-before-work while Bolt still in play |
| Commerce | Shopify Storefront API | Hosted checkout removes a class of compliance + payment risk (Stripe is off-limits for vape) |
| Analytics | PostHog + Vercel Analytics | Free tier, feature flags, performance — covers product + perf |
| Data surface | Supabase | Clean SQL surface the production agent can query directly |
| Orchestration | n8n | Existing fluency; better story than custom Python service |
| Agent reasoning | Claude API (tools) | Lets the agent query the database for follow-ups |
| Reviews | Judge.me | Native widget + script-tag integration; replaced ReviewInfra (see Commerce-Phase-4 Reviews closeout) |

**The PM principle here:** match the tool to the job per phase. No single tool for the whole build. The narrative beat for interviews is *tool-fit reasoning*, not *tool fluency*.

---

## Workflow Decisions

- **GitHub is the single source of truth.** Code, context docs, working memory all live in the repo. Nothing in Notion or a side Google Doc.
- **Git workflow:** Direct push to `main` for Phase 1 (docs only). The intent from Phase 2 forward was feature branches + self-merged PRs + Vercel preview deploys, but in practice this lapsed: Bolt auto-committed to `main` and changes shipped straight to production with no review step. Corrected 2026-06-27 ... The working branch is now `staging`; `main` is production-only and changes only via a GitHub PR merge.
- **Deploy Topology (Vercel, locked 2026-06-27):**
  - Production = `main` → get-litsaber.vercel.app (...)
  - Staging / preview = `staging` → get-litsaber-git-staging-...vercel.app (no domain assignment needed; don't reassign the prod alias)
  - Promote: review on staging URL, merge staging → main via GitHub PR
  - Bolt branch discipline: defaults to main, must stay on staging; 30s poll / collision overwrite; one tool at a time
  - GitHub "Environments" page is unrelated; staging is a branch, not a GitHub environment
- **`CLAUDE.md` at root.** Claude Code reads it automatically every session.
- **ADRs in `/docs/decisions/`.** Significant architecture calls get one markdown file each.
- **Conventional Commits.**
- **Secrets hygiene:** `.env.example` committed, `.env.local` gitignored, real values in Vercel dashboard.
- **Skipped for now:** pre-commit hooks, Dependabot, automated tests.
- **Hosting: Vercel.** Locked. Made by the Next.js team, ships features for Next.js first, tightest fit for the framework. Hobby tier free at launch. Pro tier ($20/mo) likely 6+ months in driven by production agent function time.
- **Domain registrar:** Namecheap (existing). Domain getlitsaber.com stays at Namecheap. DNS A/CNAME records will be pointed at Vercel during the Phase 7 launch cutover. No registrar migration.
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
- ~~"REVIEWINFRA" placeholder needs real provider name~~ → RESOLVED: provider is Judge.me (see Commerce-Phase-4 Reviews closeout)
- "LITSABER OG +" PDP title — is the `+` intentional?
- 2-Pack "SAVE $20" badge math is $19.99 — round up or keep?
- FAQ Contact page mentions competitor "Danksaber" by name — keep, reframe, or remove?
- ~~Empty Section 6 (1440×1820) on desktop homepage between FAQs and Reviews~~ → now built as the `WhatWereShipping` section (Editions row + ProductDisplay), Commerce-Phase 1a/1b complete
- FAQ #3 placeholder copy on homepage ("How long does the battery last?")
- Contact FAQ answers are mostly boilerplate placeholder — need real copy pre-launch

**Outreach materials to reconcile (separate from web build)**
- `Litsaber_Wholesale_Pricing_2026.pdf` shows 9 tiers + MOQ 25; **target spec: 4 tiers + MOQ 5 + 80 case pack** (matches the locked web wholesale page). Rewrite needed.
- `Litsaber_Business_Competence_Cheat_Sheet.pdf` shows 31 LEDs + 10–12 colors + MSRP $100 + $18 landed cost; **target spec: 41 LEDs + 10 colors + MSRP $59.99 + $13.33 landed cost**. Rewrite needed.

**Pre-Phase-2 decisions locked (closeout)**
1. **Reviews provider: ReviewInfra.** [SUPERSEDED 2026-06 → Judge.me. See Commerce-Phase-4 Reviews closeout. Retained here as the historical Phase 1.5 call.] Original intent: script-tag widget integration model; Path A (widget as-is) default, Path B (data API, render our own UI) stretch.
2. **AI Summary: open.** [SUPERSEDED → resolved under Judge.me; the bespoke ReviewInfra AI-summary question is moot.]
3. **Bundle SKU: quantity discount on single SKU.** [Note: the model went through three iterations — see the Quantity Discount Refactor entry. The 2-Pack is NOT a separate Shopify product; the cart holds real quantities and tier pricing applies.]
4. **PDP long-form copy: approved for rewrite.** Current Figma copy ("Ignite your night... world's first... glow-up accessory") to be replaced with copy matching BRAND.md voice during Phase 2 scaffold. Claude Code drafts and flags for review before commit.
5. **Age gate: locked.** First-visit cookie (`litsaber_age_verified`), 30-day duration, hard wall, EXIT → google.com. Env vars committed in `.env.example`.

**Pre-Phase-2 decisions still open (non-blocking)**

None. Phase 2 unblocked.

**Story beats captured (Phase 1.5)**

| ID | Beat | Tag |
|---|------|-----|
| P1-1 | "Scope expanded ~5x between Phase 1 spec and Phase 2 kickoff. 1 page became 8. I didn't push back on the scope. I re-scoped the timeline and the build order — and wrote an ADR explaining why before touching the next prompt. Re-planning is the senior signal; pretending the plan still fits isn't." | `pm-discipline` |
| P1-2 | "Hit a Figma MCP rate limit mid-pull. Didn't argue with it — picked the recovery path that preserved the discipline (extract spec before scaffold) without blocking. User upgraded mid-conversation; I picked the next-highest-leverage frame to pull rather than restarting." | `tool-choice`, `pm-discipline` |
| P1-3 | "Pulled the Figma file and surfaced 11 real cross-document inconsistencies — MOQ, case pack, tier count, voltage labels, color count, copy duplicates. None of them are bugs in code. They're inconsistencies in the SPEC. Catching them before Bolt sees them prevents an entire class of rework." | `discovery`, `pm-discipline` |
| P1-4 | "The Activate page is the secret weapon. Post-purchase onboarding most DTC brands skip — designed to reduce support tickets and reinforce the engineering thesis. Sticky chip nav, 8 functional sections, inline demo videos, QR-scan-from-box entry detection. Shipping in Phase 2, not deferred to v2." | `discovery` |
| P1-5 | "The PDP reviews section turned out to be a full subsystem — not a card list. Rating summary, distribution chart, AI-summary card, photo carousel, search, filter chips, paginated cards. Identifying it as a subsystem rather than a single component changes the Phase 4 provider decision from cosmetic to structural." | `discovery`, `integration-depth` |
| P1-6 | "Figma's PDP description copy was AI-toned ('Ignite your night... world's first... glow-up accessory'). It violated every rule in BRAND.md. Caught it because the voice rules were written down and load on every Claude Code session — the discipline does the work I'd otherwise have to do manually." | `pm-discipline`, `ai-augmented-build` |
| P1-7 | "Reviews provider was a small script-tag product, not a Yotpo/Stamped-scale platform. The integration model forces a real Phase 4 decision: ship their widget as-is and lose brand control on the PDP, or build a custom UI against their data API (if it exists). I logged it as Path A vs Path B and made the provider-confirmation an explicit action item rather than guessing. [Provider later changed to Judge.me; the tool-choice reasoning held, the vendor didn't.]" | `tool-choice`, `integration-depth` |
| P1-8 | "Hosting choice came up mid-build. Default temptation is to pick whatever's familiar. I picked Vercel for a specific reason: it's made by the Next.js team, ships framework features first, and its serverless functions are the natural home for the Phase 6 production agent. Netlify would have worked — Vercel wins on tool-fit, not marketing. The domain stays at Namecheap. Registrar migration is a different decision and there's no reason to do it." | `tool-choice`, `pm-discipline` |

---

### Phase 2 — Foundation & Homepage Build (2026-05-20 to 05-26) ✅

**Goal:** Build all homepage sections, local cart store, cart drawer, and waitlist form + API route.

**Sequencing (locked in ADR-002):**
1. Foundation — Layout shell, Navbar, Footer, mobile drawer, age gate modal ✅
2. Homepage — All sections in scroll order ✅
3. PDP — Product info, styles/bundles, mock data only. Reviews subsystem with seed data. (pending at time of writing)
4. Cart — Drawer + page + line items + promo code (local state, no Shopify yet) ✅ (drawer + store built; `/cart` page pending at time of writing)
5. Wholesale + About — Lower-risk pages (pending)
6. Engineering + Activate — Higher complexity (kinetic animation, sticky chip nav) (pending)
7. Contact + Policies — Templated, fastest to ship (pending)

#### Phase 2.1 — Foundation built (2026-05-20) ✅

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

**Story beats (Phase 2.1 · foundation)**

| ID | Beat | Tag |
|---|------|-----|
| P2F-1 | "Built the foundation layer directly instead of waiting for Bolt. The token system was precise, the age gate behavior was locked, and the component spec was detailed enough that a 70%-fidelity scaffold would have needed a full rewrite. Skipping a step isn't cutting corners when the step was designed for a different level of spec ambiguity." | `pm-discipline`, `tool-choice` |
| P2F-2 | "The Stellar font placeholder pattern — commenting out the `localFont` block with exact instructions for when the file arrives — is a small thing that prevents a class of 'why doesn't the font look right' confusion later. The placeholder communicates intent; Arial Black communicates absence." | `ai-augmented-build` |
| P2F-3 | "Caught the desktop footer drift before Phase 3 even started. Social icons and 'DESIGNED IN LA' are on both breakpoints in the first commit. One less thing to reconcile." | `pm-discipline` |

---

#### Phase 2.2 — Foundation audit + Vercel deploy ✅

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
- From here forward, every push to `main` auto-deploys; every PR gets a unique preview URL [CORRECTION 2026-06-27: the PR/preview half did not hold in practice; work continued to land directly on `main` until the `staging` pipeline was set up on 2026-06-27. See the 2026-06-27 revision entry and Deploy Topology.]

**Story beats captured (Phase 2.2 · foundation audit + deploy)**

| ID | Beat | Tag |
|---|------|-----|
| P2S1-1 | "Bolt produced gold-standard token integration in the Tailwind config — every color, spacing, z-index, font, breakpoint pulled from tokens.json. Because the spec was written down, Bolt couldn't get the foundation wrong even if it tried. The discipline pays off the moment AI tools meet a real codebase." | `ai-augmented-build`, `pm-discipline` |
| P2S1-2 | "Bolt's default scaffold leaked a Netlify dependency despite Vercel being locked in CLAUDE.md. The tool has its own opinions. Caught it in audit before deploy — exactly the failure mode the Phase 3 audit step in ADR-001 was designed to catch. Trust but verify." | `tool-choice`, `pm-discipline` |
| P2S1-3 | "Bolt claimed in its status report that it had updated working-memory.md as part of the Foundation phase. It hadn't. I logged the Phase 2 entry myself. Real lesson: AI status reports describe intent, not always action. The audit step exists because the AI's self-report is unreliable." | `ai-augmented-build`, `pm-discipline` |
| P2S1-4 | "Foundation phase shipped to production-grade infrastructure: GitHub repo, auto-deploying Vercel pipeline, env vars wired, Age Gate compliant and working on the live URL. The bar is no longer 'does it work in Bolt's preview' — it's 'does it work on the actual production CDN.' Three weeks from Figma file to working pipeline." | `pm-discipline` |

---

#### Phase 2.3 — Palette reconciliation + Motion system ✅

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

**Story beats captured (Phase 2.3 · palette + motion)**

| ID | Beat | Tag |
|---|------|-----|
| P2S1.6-1 | "Inherited a motion design doc and two component files from an earlier prototype. The doc was gold; the components carried stale prices, bundle structure, and a different palette. Rather than paste them in and re-introduce resolved inconsistencies, I extracted the doc into a permanent MOTION.md artifact and flagged the components as reference-only. Knowing what to keep vs. what to quarantine is the actual skill." | `pm-discipline`, `discovery` |
| P2S1.6-2 | "Palette went hybrid mid-build: purple-black canvas, three accents, a dedicated pink CTA color. Because everything routes through tokens.json, the change was one file edit — every component referencing named tokens inherited it automatically. This is why we built the token system in Phase 1 instead of inlining colors. The discipline compounds." | `pm-discipline`, `ai-augmented-build` |

**Homepage structure decision (locked):** The homepage has its **own full buy section** (`<HomepageBuySection />`) — product carousel, style selector (Silver/Gold), bundle selector (Single/2-Pack), Add to Cart, accordions, with `<SectionStarfield />` behind it. Not just a link to the PDP. Spec'd in COMPONENTS.md with all prototype data corrected: $59.99 single, $99.99 2-Pack (save $20), no 3-pack, 10 colors, warranty figure flagged for reconciliation. Anchor is `id="buy"` (not `id="shop"`, which collides with the `/shop/litsaber-og` route).

---

#### Phase 2.4 — Hero section built, corrected ✅

**Built hero-first** (broke the homepage into per-section chunks rather than the original two-pass split). Bolt produced `<Hero />` plus reusable `<Reveal>` and `<SpecPill>` primitives. The hero is the most-judged component and sets the motion/color patterns for every later section, so it earned its own pass.

**Bolt flagged three Figma discrepancies — all resolved:**
1. Hero image not found → turned out the entire `public/` folder had been wiped (see incident below). Real path is `public/images/home/`, not `public/images/hero/`.
2. Figma shows a product render in the hero; the Phase 1.5 spec omitted it → **Figma was right.** COMPONENTS.md hero spec corrected to include the device render. Locked: hero shows the device.
3. Figma shows the "Glowstick meets 510 battery" tagline at large display size; spec said small eyebrow → **Figma was right.** It's the repositioning thesis line; it earns weight. COMPONENTS.md corrected. Locked: large display statement with cyan glow.

**Hero assets (confirmed in repo):**
- `public/images/home/hero-lifestyle.png` — background scene
- `public/images/home/litsaber-hero-image.png` — device render, layered on top

> _Updated 2026-06-11 (ADR-007): both assets migrated to Vercel Blob and are now referenced via `mediaUrl()`. The device render (`litsaber-hero-image.png`) became the **poster** for an autoplay hero video. Paths above are the original Phase 2 repo locations, retained for history._

**Corrective prompt issued** to wire real images, add the product render, resize the tagline — as a patch to existing `<Hero />`, not a rebuild.

#### Phase 2.5 — INCIDENT: public/ folder wiped by Bolt sync

**What happened:** The entire `public/images/` folder (uploaded across 3 commits ~17–19h prior) disappeared from the repo. Root cause: two-sources-of-truth collision. Images were added directly via GitHub/GitHub Desktop; Bolt's workspace never had them; a Bolt sync produced a `Merge branch 'main'` commit that dropped `public/` because Bolt's view didn't include it.

**Recovery:** Images were still in git history (commit `319096d`). Restored via `git checkout 319096d -- public/` → commit → push. No data lost. (Alternative paths considered: GitHub Desktop revert, ZIP-download-and-re-upload.)

**Prevention (now locked in CLAUDE.md):** Single write path to the repo. During Phase 2, all files enter through Bolt. No direct GitHub edits while Bolt is the active editor. This is the second Bolt collision (first was the Netlify dependency leak in Step 1) — both are arguments for the Claude Code handoff after the homepage scaffold.

**Story beats captured (Phase 2.4 to 2.5 · hero + incident)**

| ID | Beat | Tag |
|---|------|-----|
| P2S2-1 | "Broke the homepage into per-section chunks instead of building it in big passes. Started with the hero alone — most-judged component, sets every downstream pattern. Smaller chunks meant tighter review and less rework. Scoping the unit of work is a PM call, not a coding one." | `pm-discipline` |
| P2S2-2 | "Bolt flagged three places where Figma and my spec disagreed. On two of them — product render in the hero, tagline size — Figma was right and my Phase 1.5 spec was stale. The discipline that mattered wasn't 'spec always wins'; it was building the prompt so Bolt surfaces the conflict instead of silently picking. Then a human decides." | `pm-discipline`, `ai-augmented-build` |
| P2S2-3 | "Lost the entire image folder to a Bolt sync collision — Bolt merged its view of main over mine and dropped files it never knew about. Recovered in two minutes from git history (`git checkout <commit> -- public/`). The real lesson wasn't the recovery, it was the root cause: two write paths to one repo will always eventually collide. Locked a single-write-path rule and accelerated the plan to drop Bolt for Claude Code. Version control turned a 'lost a day of work' into a 'lost two minutes.'" | `integration-depth`, `pm-discipline` |

---

### Phase 3 — Claude Code Audit, Architecture & Homepage Completion ✅ (handoff complete; Phase-3-remainder items verified — see Open Questions)

Planning session: have Claude Code audit Bolt's output against `BRAND.md`, `COMPONENTS.md`, and tokens. Fix component composition, type safety, routing, accessibility. Mobile responsiveness verified or built where Bolt fell short.

**Handoff to Claude Code complete (mid-Phase-2):** Environment set up locally — Node 20 via nvm, pnpm, Claude Code installed, `pnpm dev` running. Bolt retired after repeated sync collisions (Netlify leak, image-folder wipe, a merge-conflict that landed unresolved markers in Hero.tsx). Single write path now: local repo + Claude Code + git. The remaining homepage sections and all subsequent phases run through Claude Code.

**Responsive image pattern (locked):** Most images have separate mobile/desktop assets (different filename, dimensions, sometimes format — e.g. `hero-lifestyle.png` desktop / `hero-lifestyle-mobile.jpg` mobile). Standardized on a `<ResponsiveImage />` primitive using `<picture>` so browsers fetch only the needed asset (critical for `priority` hero images). Documented in COMPONENTS.md (primitive spec) and CLAUDE.md (standing convention). Applies across hero, venue cards, section backgrounds — build once, reuse everywhere.

**Mobile/desktop component strategy (locked — ADR-003):** The Figma mobile and desktop homepage frames diverge structurally, not just by reflow. Decision: per-section criterion, not a blanket rule. Default to one responsive component; SPLIT into `*.desktop.tsx`/`*.mobile.tsx` only when DOM structure or content grouping genuinely changes (not merely "looks different"). The hero is the first confirmed split — its headline regroups which words are cyan between breakpoints (`HIGHLIGHT THE` + `NIGHT` desktop vs `HIGHLIGHT` + `THE NIGHT` mobile), which one DOM can't express cleanly. All splits share content + primitives (duplicate arrangement, never content) and use CSS toggle (`hidden lg:block`), never JS rendering (SSR/flash/hydration). Full rationale + per-section checklist in ADR-003.

**Hero refactor pivot:** The earlier-approved flow-based refactor of the *single responsive* hero was superseded by the split decision. Instead of one flow-based responsive hero, the hero becomes `HeroDesktop` + `HeroMobile` + a CSS-toggle wrapper + shared `hero.content.ts`. Flow-based principles (no magic pixel offsets, token spacing) still apply — within each of the two simpler single-breakpoint components. The brittle pixel-offset problem is solved by the split (each component targets one layout) rather than by making one component flow across all breakpoints.

**Story beats captured (architecture)**

| ID | Beat | Tag |
|---|------|-----|
| ARCH-1 | "The hero kept fighting me on every spacing tweak because it used absolute pixel offsets coupled across two background layers. Diagnosed it as brittle architecture, not a styling bug. The fix wasn't another tweak — it was recognizing the layout method itself was wrong for the job." | `pm-discipline`, `integration-depth` |
| ARCH-2 | "Pulled the full mobile and desktop Figma frames and saw the divergence was structural, not cosmetic — the hero headline literally regroups which words are cyan between breakpoints. Resisted two easy wrong answers: 'force one responsive component' (would need conditional word-grouping hacks) and 'split everything' (doubles maintenance across the whole site). Landed on a per-section structural-divergence test, documented as ADR-003. The judgment was in the criterion, not the binary." | `pm-discipline` |

---

**Be Seen Across The Crowd — scroll-pinned scrollytelling (built):** The most complex section on the site. Three stages (THE LIFESTYLE / THE INTERACTION / THE ENDURANCE), each a full-bleed image + text block + 3-bar progress indicator. SPLIT per ADR-003 — this is the second confirmed split, and it refined the criterion: desktop and mobile share the SAME interaction (scroll-pin advance through stages, tappable bars) but split on divergent layout, type scale, gradient direction, and image assets. A split doesn't require different interactions, just different enough structure.

**Exact specs both breakpoints (authoritative, from Figma + user):** Desktop (node `3416:3337`) 1440×900, text column 580px left, headline Stellar Bold 75px / body Inter 22px / eyebrow Space Mono 16px, gradient left→dark, image right. Mobile (nodes `3760:8705`/`3760:5351`) 375×650, text 327px / 20px padding, headline 45px / body 18px / eyebrow 14px, gradient bottom→top, image full-bleed. Bars identical: 40×5px, 24px gap, cyan active / `#828282` inactive. Six images: `litsaber-{festival,interaction,endurance}.jpg` (desktop) + `-mobile.jpg` (mobile).

**Mechanism (locked before build):** tall section (300vh, 100vh/stage) + `position: sticky` inner pinned for the scroll duration + Framer Motion `useScroll`/`useTransform` to derive active stage from scroll progress. Explicitly NOT wheel-hijacking — the browser scrolls naturally, the component reacts to position. Progress bars are both indicator and control: clicking scrolls the window to the stage position (not just setting state, which would desync). `prefers-reduced-motion` falls back to stacked stages, no pin. Files: `components/home/BeSeen/{crowd.content.ts, BeSeenDesktop.tsx, BeSeenMobile.tsx, BeSeen.tsx}` + shared scroll hook.

**Figma-structure correction logged to CLAUDE.md:** The file is ONE page ("Desktop Website"), but it DOES contain mobile variant frames for some sections (hero, Be Seen) — not all. Rule: check whether a mobile node exists; if yes match it exactly, if no derive mobile from desktop via tokens. Earlier shorthand ("Figma is desktop-only") was imprecise — corrected.

**StatBar marquee (built between hero and Be Seen):** Continuous horizontal ticker, 5 stats, one responsive component (not split — identical structure both breakpoints, only font size differs; a clean example of "not everything splits"). CSS keyframe animation, not Framer Motion — continuous infinite loops belong in CSS (performance, no dropped frames); Framer is for entrance/scroll reactions. Duplicated-track technique for seamless loop. Standard left-scroll (resolved an ambiguity: "left to right" had two readings; the tool asking saved a build cycle). Reduced-motion = static.

**Story beats captured (architecture, continued)**

| ID | Beat | Tag |
|---|------|-----|
| ARCH-3 | "Three times I gave the AI mobile specs from memory or a screenshot, and twice I was wrong about the actual design — I assumed mobile stacked when it actually used the same scroll-pin as desktop. The fix each time was the same: stop describing, pull the actual Figma node and read it. Reading the file directly beat guessing every single time. For pixel-precise work, the source of truth is the source, not my recollection of it." | `pm-discipline`, `ai-augmented-build` |
| ARCH-4 | "Chose the scroll-pin mechanism deliberately: sticky-positioned inner container plus scroll-progress tracking, explicitly NOT wheel-hijacking. Scroll-jacking is the fragile, accessibility-hostile version that fights the user's input device; the sticky approach lets the browser scroll naturally and just reacts to position. Knowing which pattern to reach for — and which superficially-similar one to avoid — is the difference between an effect that feels premium and one that feels broken. Same judgment on the marquee: CSS for continuous loops, Framer for entrance motion." | `integration-depth` |

---

#### Phase 3.1 — Remaining homepage sections built (2026-05-24 to 05-26) ✅

All homepage sections are now built and composed in `app/page.tsx` in scroll order:

1. `<Hero />` — split desktop/mobile per ADR-003 ✅ (logged above)
2. `<StatBar />` — continuous CSS marquee, 5 stats ✅ (logged above)
3. `<BeSeen />` — scroll-pinned scrollytelling, 3 stages ✅ (logged above)
4. `<ThreeModes />` — split desktop/mobile per ADR-003
5. `<UnderTheHood />` — split desktop/mobile per ADR-003
6. `<LightMeetsVapor />` — single responsive component, Framer Motion parallax scroll + intersection-observer text reveal
7. `<WhereItLives />` — venue marquee (CSS animation, duplicated-track technique for seamless loop) + animated headline block with intersection observer
8. `<CommonQuestions />` — split desktop/mobile per ADR-003
9. `<WhatWereShipping />` wrapping `<EditionsSection />` + `<ProductDisplay />` ✅ (built in Commerce Phase 1a/1b)

**ThreeModes:** Three product modes (Fade, Pulse, Strobe or equivalent) with shared `useModesState.ts` hook. Split per ADR-003 — structural layout divergence between breakpoints, not just reflow. Files: `ThreeModesDesktop.tsx`, `ThreeModesMobile.tsx`, `ThreeModes.tsx` (CSS-toggle wrapper), `modes.content.ts`, `useModesState.ts`.

**UnderTheHood:** Engineering specs / exploded-view section. Split per ADR-003. Files: `UnderTheHoodDesktop.tsx`, `UnderTheHoodMobile.tsx`, `UnderTheHood.tsx`, `underthehood.content.ts`.

**LightMeetsVapor:** Full-height parallax section ("WHERE LIGHT AND VAPOR MEET"). Single responsive component. Framer Motion `useScroll`/`useTransform` for parallax bg; intersection observer triggers text reveal. Separate aspect ratios per breakpoint (375/600 mobile, 8/5 desktop). Respects `prefers-reduced-motion`.

**WhereItLives:** Venue/lifestyle placement section. CSS marquee strip of venue cards (same duplicated-track technique as StatBar — consistent pattern across the codebase now). Animated headline + body block. Files: `WhereItLives.tsx`, `whereitlives.content.ts`.

**CommonQuestions:** FAQ accordion section. Split per ADR-003. Files: `CommonQuestionsDesktop.tsx`, `CommonQuestionsMobile.tsx`, `CommonQuestions.tsx`, `commonquestions.content.ts`.

---

### Commerce Phase 1 — Editions + product-display build-phasing plan (2026-05-23, planning)

The homepage's most complex section ("WHAT WE'RE SHIPPING" / Editions + the inline PDP-style product display, Figma node `3312:2`). This is the frame previously logged as the empty "Section 6" open question — now resolved as this feature. Planned the build before writing any code because it bundles UI, cart state, form capture, and a payment integration that, done in one pass, would produce something that looks right and breaks on real commerce data.

**Governing architecture decision:** Decouple UI from commerce. Build all UI against a local cart store (`lib/cart/store.ts`, Zustand + localStorage) exposing a Shopify-shaped interface; swap the store's action bodies to Shopify Storefront API mutations only in the final phase. Components talk to the store, never to Shopify. This isolates integration risk and keeps every builder prompt small. Full spec written into CLAUDE.md ("Commerce build phasing" section).

**Four commercial decisions confirmed by Matt (2026-05-23):**
- **Two Pack model.** [Went through three iterations — see the Quantity Discount Refactor entry for the final state. Final: single SKU, cart holds real quantities, tier pricing applies. Two Pack is a PDP UI affordance, not a separate variant.]
- **Authorize.net** already approved for this store; Shopify hosted checkout routes to it. Wired in Commerce-Phase 4, not before.
- **HubSpot** handles both new signup flows (Gold waitlist, Future Drops notify) — submit to HubSpot forms, a workflow sends confirmation, contact lands in CRM. No custom backend. Two new forms needed; Matt to create before Phase 3 form wiring.
- **Variant→behavior:** Silver → add to cart + drawer. Gold → waitlist modal (no cart).

**Build sequence (4 commerce phases, each chunk = one prompt = one commit):** P1 static layout (Editions row + product display, inert). P2 local cart store + selection logic + conditional CTA. P3 drawer + `/cart` page + the two HubSpot modals + wire Editions actions. P4 Shopify (client, swap store actions to cart mutations, `checkoutUrl` redirect) — last and isolated. Desktop + mobile both mocked; one responsive component per chunk per ADR-003, split only if responsive logic gets unmanageable mid-build.

**Story beats captured (commerce planning)**

| ID | Beat | Tag |
|---|------|-----|
| CP-1 | "Before building the most complex section on the site, I drew a seam: all UI talks to a local cart store with a Shopify-shaped interface, and Shopify itself gets wired in dead last by swapping only the store's internals. The components never change. The point wasn't the tech — it was refusing to let integration risk contaminate four phases of layout work. Sequencing the unknowns to the end is a PM call." | `pm-discipline`, `integration-depth` |
| CP-2 | "Reversed my own bundle decision twice and landed where the operations pointed, not where the code was easiest. I first picked a dedicated $99.99 variant because it kept the cart code dumb. Then I asked the real question — what does this do to inventory? — and realized a separate variant splits one physical product into two stock pools, forcing allocation guesses and a 3PL kitting map for a box that doesn't exist. We just ship two units together. So: one SKU, one inventory pool, modeled as a single logical cart line in the UI, with the Shopify mechanism deferred to Phase 4. The lesson: 'simplest code' and 'simplest operations' are different axes, and for a physical-goods business the ops axis wins. [Later reversed a third time — see Quantity Discount Refactor.]" | `pm-discipline`, `integration-depth` |

---

### Commerce Phase 1a/1b — WhatWereShipping built (2026-05-23) ✅

Static layout for both children of the section is built, reviewed, and committed (repo `getlitsaber-web`, `components/home/`).

**Built:**
- `components/home/Editions/` — the 3 CTA boxes (OG Silver / Gold Edition / Future Drops). One responsive component (3-up grid → stacked), per-card accent (cyan/magenta/purple) via a static `ACCENT_CLASSES` lookup (avoids Tailwind JIT string-interpolation trap). Action links inert (Phase 3 wires them). [Commerce-Phase 1a]
- `components/home/ProductDisplay/` — gallery (vertical thumb strip left of main on desktop, stacked on mobile; 5 thumbs, packaging hero is thumb 1), title/subtitle/price, 6 rectangular spec pills, StyleSelector (Silver active / Gold "Coming Soon"), BundleAndCTA (Single active / Two Pack, both CTAs inert). Silver hardcoded active; no selection or cart logic yet. [Commerce-Phase 1b]
- `components/home/WhatWereShipping/` — `position: relative` wrapper. Gradient bg over `#0A0518`, `box-shadow 0 4px 4px rgba(0,0,0,.25)`, owns all section padding + vertical rhythm. Inner column `mx-auto w-full max-w-[1250px]`. TODO mount point for the section-scoped `<Starfield>` (Phase Motion). Renders `<Editions />` then `<ProductDisplay />`. **Renamed from `Section6` 2026-05-23** — "Section 6" is a Figma artifact name, retired in code.

**Decisions locked during the build:**
- Title is `LITSABER OG - Silver` (Stellar). Subtitle `The Interactive 510 Battery` (Inter 25px, muted). Price Space Mono 55px (`text-h2`) + pink glow. (Bolt kept guessing Monoton/eyebrow fonts because it can't reach Figma — corrected against node `3335:54` each time.)
- Sizes snap to the existing type scale: 50px Figma values → `text-h2` (55px). No one-off 50px token added.
- New tokens added rather than inline hex: `#120F2C` (card-deep bg), `#424242` (inactive border), `r=10`, `r=5`.
- Two Pack copy: "For the lightshow. For the partner. For the never-without" (partner, not duel).
- Editions box actions CONFIRMED: Box1 → Shop page (navigate, no modal); Box2 → Gold waitlist modal; Box3 → general email-list modal. Resolves the earlier modal-vs-scroll open question — all modals/navigation are Phase 3.

**Workflow learning:** Bolt cannot pull Figma (login wall) — it reconstructs visuals from prompt text and guesses fonts/copy/radii. Mitigation now standing: Claude pulls the Figma node and hands Bolt exact specs (fonts, px, copy, hex) rather than trusting Bolt to "have enough from the codebase audit." Every Bolt plan gets checked against the real node before code.

**Story beat captured**

| ID | Beat | Tag |
|---|------|-----|
| WWS-1 | "My builder couldn't see the design file — it was reconstructing the screen from my written description and quietly guessing fonts, copy, and corner radii. Three rounds in I stopped trusting 'I have enough from the codebase' and changed the workflow: I pull the exact spec from the design node and hand it over as literal values — this font, this pixel size, this hex, this verbatim string. The lesson isn't about one tool; it's that when a collaborator is working blind, the fix is to remove the guessing, not to re-check the guesses. Cheaper to feed exact specs than to debug plausible-looking wrong ones." | `pm-discipline`, `ai-collaboration` |

---

### Commerce Phase 2a/2b/2c + 3a/3b/3c-1 — Commerce UI on a local store (2026-05-25) ✅

The full commerce UI is built and verified against the local cart store. Shopify is still untouched (Commerce-Phase 4). Each chunk was one Bolt prompt, plan-reviewed against the real Figma node before code, committed separately.

**Commerce-Phase 2a — local cart store (`lib/cart/store.ts`).** Zustand + `persist` (key `litsaber-cart`). Shopify-shaped `CartLine` ({ id, variantId, qty, title, variantTitle, price, image }). Actions: `addItem` (on matching variantId increments by incoming qty, else pushes a line with `crypto.randomUUID()` id), `removeItem`, `updateQty` (qty<=0 → remove), `clear`. Derived hooks: `useItemCount`, `useSubtotal`, `useCartItems`, `useCartId`. **`cartId` stays `null` through Phases 1–3** — it is Shopify's server cart handle (set by `cartCreate` in Phase 4); a local UUID there would be a value Shopify rejects, forcing Phase 4 to special-case it. The line-level `id` gets the local UUID; that's correct. Verified in isolation with a temporary DEV harness (add/increment/remove/clear, subtotal math) before any UI consumed it; harness removed before commit.

**Commerce-Phase 2b — selection wiring.** Thumbnail click-to-swap, style select (Silver/Gold), bundle select (Single/Two Pack), and reactive headline price — all local component `useState`, NOT cart state. Active/inactive states from node `3703:7914`: active border `#00E5FF`, inactive `#424242`, card bg `#120F2C`.

**Commerce-Phase 2c — conditional CTA.** Silver + ADD TO CART → `addItem` then opens the drawer. Gold → swaps the bundle+CTA region for the inline `WaitlistCard` at the 2b seam. BUY NOW stays inert (Phase 4 Shopify checkout).

**Bug — `useCartActions` infinite render loop.** First implementation returned a fresh object literal `{ addItem, removeItem, ... }` from a single Zustand selector. Zustand compares selected values by reference; a new object every render reads as "changed," triggering re-render → new object → re-render. React killed it with "Maximum update depth exceeded." Fix: select each action individually (`useCartStore((s) => s.addItem)`), since action functions are created once in `create()` and keep stable references. Root principle: when a system decides "did this change?" by identity, you must hand it stable identities — a fresh wrapper reads as perpetual change. The hook abstraction was kept; only its internals changed.

**Commerce-Phase 3a — UI store + CartDrawer.** New `lib/ui/store.ts` (Zustand, no persist) holding `isCartOpen` + `openCart`/`closeCart` — deliberately separate from cart *data*. CartDrawer mounted once in the root layout (openable site-wide), flex-column (fixed header / `flex-1` scrolling list / pinned footer), slide-in with `prefers-reduced-motion` fallback, Esc + backdrop close, focus management. Reads everything from the store — no hardcoded Figma mock values. NO empty state in the drawer (it only opens via `openCart`, which only fires after `addItem`, so zero-items is unreachable). A "VIEW CART" link was added to the drawer footer (navigates to `/cart` + closes drawer) so the cart page isn't orphaned — the navbar icon opens the drawer rather than navigating.

**Navbar cart badge wiring.** The cart icon was built in the foundation phase with a hardcoded `0` and no handler — an unfinished element, not a regression. Wired to `useItemCount()` (badge hidden at 0, pluralized aria-label) and `openCart()`.

**Commerce-Phase 3b — `/cart` page.** RSC shell + `CartPageBody` client component. Reuses Navbar/Footer from layout; the "FESTIVAL DROP LIST" email signup in the Figma node was deliberately deferred to 3c (it's a HubSpot form). Two-column desktop / stacked mobile, items table + Order Summary, all store-driven. Empty state LIVES HERE (the page is directly reachable via the drawer link and direct URL, unlike the drawer). The shared trust-badge block was extracted to `components/cart/TrustBadges.tsx` and imported by both drawer and cart page rather than duplicated.

**Commerce-Phase 3c-1 — HubSpot seam + reusable WaitlistForm.** Decided custom-form → HubSpot Submission API, NOT HubSpot's embed script (the embed injects HubSpot markup that fights the dark/cyan design and blocks the in-place success state). Route handler `app/api/subscribe/route.ts` accepts `{ email, list }`, maps `list` → form ID server-side, POSTs to `api.hsforms.com/submissions/v3/integration/submit/{portal}/{formId}`. No API key needed — the Forms Submission API is public/keyless (same path the embed uses); the CRM API would need a token but we're not touching it. Form IDs live in env (server-only, no `NEXT_PUBLIC_`) with literal fallbacks; the orphaned `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` was removed. `WaitlistForm` is one reusable component (`list`, `headline`, `copy`, `buttonLabel`, `source`) with an idle→submitting→success→error state machine, email-only, replace-in-place success. `semantic.error` (`#F56565`) added to `tokens.json` + `tailwind.config.ts` rather than borrowing CTA pink for errors. `WaitlistCard` reduced to a thin wrapper over `WaitlistForm`.

- **HubSpot IDs:** portal `244547358`, region `na2`, Gold form `d499701a-eb43-4c0e-a6cd-b56a57a98433`, General/$10-off form `2a41aa81-1b55-4bcd-97e5-b2b3fe23ee69`. (Offer amount locked at $10 per ADR-004.)
- **reCAPTCHA 502:** first live submission returned 502 — the route faithfully reporting that HubSpot rejected the POST. Cause: reCAPTCHA was enabled on the HubSpot form, which blocks the custom-API path. Turned off in HubSpot; submission then succeeded and the contact landed in the CRM.
- **Spam protection (replacing reCAPTCHA):** since the submission endpoint is public, protection moves to our layer — honeypot field (silently 200s without forwarding if filled) + per-IP rate limit in the route. Cloudflare Turnstile deferred unless real abuse appears. Sized for dumb volume bots, not a targeted attack; no user friction.

**Still open from this stretch:** WaitlistForm border was specced to cyan-20% per the 2c Figma node — confirm it didn't inherit a drifted value. Rate-limit durability (in-memory resets on cold start vs KV/Upstash) to confirm.

**Workflow note (recurring):** Bolt again reported it had updated working-memory.md when it hadn't (cf. P2S1-3). This entry was written manually. Bolt's self-reports describe intent, not action — the doc is maintained outside the builder.

**Story beats captured (Commerce Phases 2–3)**

| ID | Beat | Tag |
|---|------|-----|
| CM-1 | "An infinite render loop in the cart-actions hook traced to a Zustand footgun: returning a fresh object literal from the selector. The store compares by reference, so a new object every render reads as a change, which triggers another render. The fix was to hand it stable identities — select each action individually, since they're defined once. The general lesson outlived the bug: when a system asks 'did this change?' by identity, wrapping your data in a new container each read is the same as lying to it." | `integration-depth` |
| CM-2 | "Built the cart in strict dependency order — data store first, verified in isolation with a throwaway harness, THEN the selection UI, THEN the drawer and page that read it. The discipline that paid off: the store's shape mirrors Shopify, so Phase 4 swaps the store's internals without touching a single component. Each surface that reads cart state (drawer, page, navbar badge) is just a view of one source — change a quantity anywhere and all three update because there's nothing to keep in sync." | `pm-discipline`, `integration-depth` |
| CM-3 | "Two surfaces that look identical needed different states. The cart drawer can never be empty — it only opens as a consequence of adding an item — so an empty state there is unreachable code. The cart page is a real destination reachable by URL, so it must handle empty. Built the states each surface can actually reach, not the states it superficially resembles." | `pm-discipline` |
| CM-4 | "Chose custom form → HubSpot's public Submission API over their drop-in embed. The embed would have rendered HubSpot's own markup inside our modal — wrong fonts, wrong colors, and no way to do the calm in-place success state. The tradeoff I accepted: the submission endpoint is public and keyless, so spam protection became my job (honeypot + rate-limit) instead of HubSpot's reCAPTCHA — which I'd had to disable anyway because it was silently 502-ing the API path. Brand control over the form was worth owning the spam layer." | `integration-depth`, `tool-choice` |

---

### Commerce — Quantity discount refactor (2026-05-27) ✅

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

| ID | Beat | Tag |
|---|------|-----|
| QD-1 | "Reversed the bundle model a third time. First call was a dedicated $99.99 variant — clean code, splits inventory for a single physical good. Second call was a single SKU with the 2-Pack as a logical cart line — works for 1 and 2 units, has no answer when someone wants 3 or 5. Third call follows from one question I should have asked sooner: can someone buy 3? The honest answer made 'Two Pack as a name in the cart' obviously wrong. Quantity is the dimension. The cart holds quantities. Marketing names live on the PDP. The pattern: when a design decision keeps breaking under follow-up questions, the decision is wrong, not the questions. Reversal isn't waste — staying with the broken decision is." | `pm-discipline`, `integration-depth` |

---

### Phase 4 — Shopify Integration + Reviews Provider (commerce complete 2026-05-28 ✅; reviews resolved via Judge.me — see closeout)

Three chunks, in order. The whole phase is governed by the Commerce-Phase 2a architecture decision: the cart store's interface stays identical; only its action bodies change. The component layer doesn't move.

**Commerce-Phase 4a — Storefront API client + env vars + typed product/variant fetch. Read-only. No cart yet.**
- Add Storefront API client at `lib/shopify/client.ts`. GraphQL over `fetch`, typed responses, Next.js cache hints.
- Env vars: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_TOKEN`, `SHOPIFY_API_VERSION`. Server-only (no `NEXT_PUBLIC_` prefix). Add to `.env.example` with placeholder values.
- Generated TypeScript types for the product/variant payload.
- First real fetch: `getProductByHandle('litsaber-og')` returning typed product + variants. Variant IDs sourced from Shopify replace the hardcoded mock IDs in the PDP.
- Critical: NO cart mutations yet. NO swap of store action bodies. The local cart still runs locally with localStorage persistence.

**Commerce-Phase 4b — Swap store action bodies to Shopify Cart API mutations.**
- Replace the local-state action bodies in `lib/cart/store.ts` with Storefront API mutations: `cartCreate` (on first add), `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`. `cartId` flips from `null` to the Shopify-returned ID and persists.
- Same interface — every component that reads the store continues to work without code change. This is the payoff for the Commerce-Phase 2a discipline.
- localStorage persistence model adjusts: store the `cartId` (durable across sessions) and re-fetch line data from Shopify on hydration.

**Commerce-Phase 4c — Wire Buy Now / checkout to `checkoutUrl` redirect + tier pricing migration.**
- Buy Now button redirects to the Shopify `checkoutUrl`. Hosted checkout handles Authorize.net.
- **Tier pricing migration:** the `lib/cart/pricing.ts` constants become Shopify automatic discount rules. One discount per quantity threshold (2 / 3 / 4 / 5). The pricing constant remains as a client-side fallback for cart UI rendering before checkout; Shopify is the source of truth at checkout.
- Webhook handlers for inventory.

**Plus:** Reviews provider integration. [Plan originally specified ReviewInfra; provider was changed to Judge.me — see Reviews closeout below.]

---

### Phase 4a — Shopify provisioning + verification (2026-05-26)

Pre-build provisioning work and API surface discovery. The `/shopify-check` temp route was the tool — a Server Component at that path that called `getProductByHandle` and rendered the full variant table (GID, price, availableForSale). Everything below was read off that table, not transcribed from the admin, so the GIDs are in the correct `gid://` format the Storefront API uses.

**Store and API version:**
- Store: `innovapeconcepts.myshopify.com`
- Storefront API version: `2025-07` (Q3 2025 stable; supported through ~Q1 2027)
- Credentials path: Shopify Headless app (first-party) → public Storefront token → `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`. The dev-dashboard / OAuth-app path was attempted first and produces the wrong token type (Admin OAuth credentials, not a Storefront token); the Headless app is the correct path for a headless storefront. Public token goes in `NEXT_PUBLIC_`; private token held in a password manager, not yet in Vercel (not needed for 4a–4c).

**Variants confirmed via `/shopify-check` (handle `litsaber-og`):**
- **Silver** → `gid://shopify/ProductVariant/45098118316239` · $59.99 · `availableForSale: true`
- **Gold** → `gid://shopify/ProductVariant/45098118349007` · $59.99 · `availableForSale: false` — Gold is in Shopify as an unavailable variant; stays waitlist-only on the front-end; never a cart line until Gold launches. Not a bug, intentional.

**Two Pack — bundle exposure failure and pivot:**
- Two Pack was set up as a native Shopify Bundles app product (`handle: litsaber-og-two-pack`), composing 2× Silver. Expected behavior: the bundle surfaces as its own fetchable Storefront product.
- Actual behavior: `getProductByHandle("litsaber-og-two-pack")` returned null even after confirming (a) product published to Headless/Storefront channel, and (b) product status Active. Native Shopify Bundles do not reliably expose via the Storefront API regardless of publish/status state. Confirmed limitation, not a config error.
- **Pivot (FINAL):** Two Pack = 2× the Silver variant (`gid://...316239`, qty 2) + a Shopify automatic discount (−$20 when qty ≥ 2). One inventory pool, no bundle product needed in the cart path. This matches the FINAL bundle decision from the Quantity Discount Refactor (beat QD-1, "two of the single SKU, one inventory pool") and makes the Bundles product redundant for the cart.

**SKU convention locked:**
- Unit SKU = `LTS-OG-SLV`. Quantity is the dimension, not the SKU.
- Replaces WooCommerce convention `LTS-OG-SLV-1` (single) / `LTS-OG-SLV-2` (two pack) — the suffix conflated the unit identifier with the order configuration. In Shopify the SKU lives on the variant; quantity lives in the cart line. The 3PL (Warehut) pick reads "LTS-OG-SLV × 2" for a Two Pack order, which is correct.
- Mix-and-match (e.g. 1 Silver + 1 Gold) is supported by this model without any new SKU: two cart lines (one per variant), a bundle discount applied at cart level. UI deferred to when Gold ships (see pre-launch items).

**Temp route:** `/shopify-check` — remove before Phase 7 (already in pre-launch list).

---

### Phase 4.1 — Commerce integration complete (2026-05-28) ✅

The Commerce-Phase 2a seam held: the cart store's interface never changed; only its action bodies were swapped to Shopify. Every component that reads cart state kept working untouched. Each chunk was one Bolt prompt, plan-reviewed against the real artifact before any code.

**4a — Storefront client + PDP wiring.**
- Reused existing `lib/shopify/client.ts` (`shopifyFetch`) and `lib/shopify/queries.ts` (`getProductByHandle`) instead of letting Bolt duplicate them with a client-side hook.
- Variant fetch is a server-component fetch in `app/shop/litsaber-og/page.tsx`, drilling `variantId` + `available` as props (not a client `useEffect`).
- Variant matched by `sku === "LTS-OG-SLV"`, not title-includes. Added `sku` to the query and the `ShopifyVariant` type.
- Locked variant: Silver, SKU `LTS-OG-SLV`, GID `gid://shopify/ProductVariant/45098118316239`, $59.99, handle `litsaber-og`, store `innovapeconcepts.myshopify.com`. Gold and Two Pack not cart-addressable (waitlist + quantity-discount models respectively — see Phase 4a provisioning notes above).
- `/shopify-check` debug route added — REMOVE pre-Phase-7.

**4b — Cart store → Shopify mutations.**
- `lib/cart/store.ts` rewritten: `addItem` → `cartCreate` (first) / `cartLinesAdd`; `removeItem` → `cartLinesRemove`; `updateQty` → `cartLinesUpdate`; `clear` → remove all; `hydrate` → `CART_QUERY` on load.
- Persistence model changed: `partialize` stores ONLY `cartId`; line data is re-fetched from Shopify on hydration. `CartHydrator.tsx` client component mounts in `app/layout.tsx`; layout stays a Server Component.
- Six fixes added to Bolt's plan before code: correct `merchandise { ... on ProductVariant { id } }` fragment; price read from `cost.totalAmount.amount`; `pendingCartCreate` promise guards the double-click race; hydrate clears a stale `cartId` on null; `clear()` keeps `cartId` until success then nulls; env-guard on hydrate.
- Verified live: adding the same variant twice merges to one line, qty 2. Cart returns a working `checkoutUrl`. Toast deferred (`console.error` + `// TODO: wire toast` at revert sites).

**4c — Checkout + tier-discount sourcing.**
- 4c-1: wired the three inert checkout buttons (CartDrawer, CartPageBody ×2, PDP BUY NOW) to redirect to `cart.checkoutUrl` via a `useCheckoutUrl()` hook. BUY NOW awaits `addItem`, reads `useCartStore.getState().checkoutUrl`, redirects without opening the drawer. Verified.
- 4c-2: prices sourced from Shopify. Discounts are already created in Shopify and applied at cart level — qty 2 returns `cost.totalAmount.amount = "99.99"`. Added `lineTotal` to `CartLine`; `useSubtotal`/`useCartLineTotal` read it; `lib/cart/pricing.ts`/`getTierPrice` demoted to optimistic-UI + PDP display fallback. Savings = `Math.round(line.price * line.qty - line.lineTotal)`. Shopify is the source of truth for money at checkout.

**MAX_QTY cap (closed a real over-cap pricing hole).**
- The PDP capped at 5 but the cart didn't (BUY NOW 5 → back → ADD 2 = 7, priced wrong). Enforced the cap at the store chokepoint (`addItem` + `updateQty`), in both optimistic state and the Shopify mutation vars. Existing-line path uses `cartLinesUpdate` with `quantity: resultQty` (idempotent "set to exactly 5"). `capReached` transient flag (excluded from `partialize`) + `useCapReached()` hook; CartDrawer shows "Max 5 per order. Need more? See wholesale →" (`/wholesale`). Four stacking tests pass.

**Full test-mode purchase ✅.** Qty 5 through Authorize.net hosted checkout; order landed in Shopify admin at the discounted $199.99 total.

**Promo popup cookie fix ✅.** `dismiss()` previously only hid the popup and set no cookie, so it reappeared. Now `dismiss()` sets `COOKIE_SEEN` for 72h; `markSubscribed()` keeps the 365d `COOKIE_SUBSCRIBED`; the re-arm path re-reads both cookies. Verified.

**Promo code architecture decided → ADR-004 (Architecture A).** HubSpot stores the contact + sends the code; Shopify owns one shared `WELCOME10`/`LITSABER` code at "$10 off, one use per customer." Two suppression layers kept separate (client cookie stops the popup; Shopify stops code reuse). Frontend promo box (Figma `3770:1315`) deferred and bundled with the backend as a pre-launch unit on top of Phase 5 instrumentation. Offer locked at $10.

**Cleanup / carry-forward (tracked in Open Questions):** remove `console.log("[PDP]")` from the PDP page; remove `/shopify-check` route pre-Phase-7; flip Authorize.net test → live before launch.

**Recurring Bolt lessons (banked):** Bolt summarizes files when asked for their contents (now 3rd+ occurrence) — always demand the literal file in a code block. Bolt declares its own code correct without reading every line. Plan-review-as-PR-review caught real bugs in 4a and 4b before any code was written.

**Story beats captured (Phase 4)**

| ID | Beat | Tag |
|---|------|-----|
| P4-1 | "I reviewed the builder's plan before it wrote a line of code, the way you'd review a PR. Three real bugs in the 4a plan, six gaps in the 4b plan, all caught at the plan stage. It is far cheaper to fix a paragraph than a commit, and the builder doesn't push back on a plan the way it defends code it's already written." | `ai-collaboration`, `pm-discipline` |
| P4-2 | "The add-to-cart button stayed live after I marked the variant unavailable in Shopify. The builder pasted the file, declared its own code correct, and pointed me at a different function. The bug was one line it had pasted but never quoted back in its analysis: it checked whether the variant existed, not whether it was available for sale. The lesson is blunt. When the tool says 'my code is correct,' the bug is in the line it skipped reading." | `integration-depth`, `ai-collaboration` |
| P4-3 | "Three different Shopify admin states — product in draft, zero inventory, variant unpublished from the channel — all return the same null from the Storefront API. One code branch handles all three correctly, but they're indistinguishable to the API, so you can't show 'sold out' vs 'paused' vs 'discontinued' until a second variant exists. Logged it so I don't rediscover it the hard way when Gold ships." | `integration-depth` |
| P4-4 | "On the Shopify swap the obvious move is to persist the whole cart locally. I persisted only the cart ID and re-fetch the lines from Shopify on load. The server cart is the source of truth; cached local line data only drifts. The Commerce-Phase 2a seam paid off exactly as designed — I swapped the store's internals and didn't touch a single component that reads it." | `integration-depth`, `pm-discipline` |
| P4-5 | "The PDP capped quantity at 5 but the cart didn't. Buy five, go back, add two more, and you're at seven, priced wrong because the discounts only cover two through five. I fixed it at the store action, not the button, so every path that can add inventory passes through one cap. And I used an idempotent 'set quantity to exactly 5' update so a retried request can't overshoot. Enforce invariants at the chokepoint, not at every entrance." | `integration-depth`, `pm-discipline` |
| P4-6 | "I'd written a client-side pricing module. Once the real discounts went into Shopify, the cart started returning the discounted total in its own cost field, so I sourced price from Shopify and demoted my module to an optimistic-UI fallback. Two sources of truth for money is a bug waiting to happen. The server wins at checkout, so the server has to win in the cart too." | `integration-depth`, `pm-discipline` |
| P4-7 | "The dismissed promo popup kept coming back because dismiss only hid it and never set a cookie — only showing it did. I fixed dismiss to suppress for 72 hours. The deeper clarity was realizing 'stop the popup' and 'stop the code being reused' are two different layers: a browser cookie on the client and Shopify's one-per-customer rule on the server. Conflate them and you ship a promo that either nags forever or pays out twice." | `integration-depth`, `pm-discipline` |
| P4-8 | "The Shopify Headless app's Storefront API token and the dev-dashboard's OAuth Client ID/Secret look identical at a glance but do completely different things. The OAuth credentials are for distributing an app to many merchants; the Storefront token is the one key a single-store headless build needs. The dev-dashboard path produces the wrong credential for this use case — getting the right token required understanding what question Shopify was actually answering, not just following the nearest 'create app' button. Same credential confusion applied to public vs private Storefront tokens: only the public one goes in a NEXT_PUBLIC_ var; putting the private one there would expose it in the browser bundle." | `integration-depth`, `tool-choice` |
| P4-9 | "Native Shopify Bundles don't reliably expose as fetchable products through the Storefront API — confirmed after the bundle product was published to the Headless channel and set to Active, and the API still returned null. Rather than fighting the tool, I pivoted to the model the ops decision already pointed at: Two Pack = 2× the Silver variant, qty 2, one automatic discount. One SKU, one inventory pool, the 3PL picks 'Silver × 2.' The bundle product was a mechanism for achieving the FINAL bundle decision; when the mechanism broke, the decision itself didn't change." | `integration-depth`, `pm-discipline` |

---

### Phase 4.2 — Reviews provider: Judge.me (closeout) ✅

**Decision: Judge.me replaces ReviewInfra.** ReviewInfra was the Phase 1.5 pick; it was replaced by Judge.me as the confirmed reviews provider. `CLAUDE.md` and `ADR-002` were updated to reflect Judge.me. This closes the ReviewInfra-era open questions (read-API confirmation, Path A vs Path B, bespoke AI-summary support) — they no longer apply.

**Integration shape:**
- **Preloader `<Script>` lives in layout only** (`components/.../JudgemeScripts.tsx`), not in the review component.
- **`JudgemeReviewWidget.tsx` fix:** `"use client"` component with a `useEffect` that polls every 250ms for `jdgmCacheServer.reloadAll` to become a function, calls it once when ready, and cleans up on unmount with a ~10s ceiling. This is the same near-mount readiness discipline used for PostHog events (`trackWhenReady`) — don't call a third-party global before it's initialized; poll/gate until it's ready, then fire once.

**Carry-forward:** none specific to reviews remain blocking. (Any remaining review-content seeding / display polish folds into pre-launch copy work.)

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

**Implementation (planned):**
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

---

#### 5.2 Promo instrumentation + the mount-race bug (2026-05-31) ✅

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
popup_shown worked only because it fires ~12s later, after init. Fix at the time:
defer the track() until ready via posthog.onFeatureFlags(); keep the sessionStorage
write at mount (auto-apply needs it early). [SUPERSEDED 2026-06-25: onFeatureFlags
alone is insufficient. A callback registered before init() runs never fires, so the
event resolved only on a much later flag reload (about 5 minutes) or not at all. The
durable fix is init-before-mount. See 5.7.]

**The audit was the payoff:** asked Bolt whether any OTHER event fires near mount.
It found product_viewed — funnel STEP 3, every PDP visit — had the identical bug.
The core funnel had been under-counting product views into PostHog's init gap. That
reframed the whole session: chasing one promo event surfaced a systemic hole.
Fixed product_viewed with the same readiness gate, abstracted into a shared
trackWhenReady() helper (immediate if posthog.__loaded, else onFeatureFlags) in
lib/analytics/events.ts — now the rule ("near-mount events use trackWhenReady") is
enforced by a function name, not tribal knowledge. ADR-005 updated with the rule +
the four promo events + the promo_code_applied supersede.

**Fidelity gap (RESOLVED 2026-06-25, see 5.7):** product_viewed is specced as
viewport-entry but originally fired at MOUNT (no IntersectionObserver), so on the
homepage with the buy section below the fold it measured "page loaded" more than
"saw product." Now fires on first viewport entry via IntersectionObserver in
ProductDisplay.tsx. The note about "both call sites" was itself a second bug: the
two call sites were both firing on the PDP, double-counting product_viewed. That
duplicate emitter was removed in 5.7 as well.

---

#### 5.3 Device_activated wired — FULL FUNNEL COMPLETE (2026-06-09) ✅

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

---

#### 5.4 Customer accounts — Shopify-hosted, activated (2026-06-11) ✅

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

---

#### 5.5 device_type detection + cart-attribute pipe + ActivationTracker fixes (2026-06-22) ✅

**Root cause diagnosed:** PostHog's `$device_type` property is computed asynchronously after events fire, so a cart event trying to read it gets undefined. The cart-attribute pipe was silently failing, and the webhook fallback resolved to "unknown."

**Three fixes shipped:**

**5.5a — device_type detection (lib/device.ts, new file)**
- Replaced async PostHog dependency with synchronous `detectDeviceType()` using `navigator.userAgent`
- Detects "Mobile" | "Tablet" | "Desktop" at cart creation time
- Always unconditionally written to cart as third attribute (alongside `posthog_distinct_id` and `discount_code`)
- Covers add-to-cart on first visit; returning visitors with persisted cartId get null (designed limitation)

**5.5b — Supabase orders schema migration**
- `ALTER TABLE orders ADD COLUMN device_type TEXT;` (manually run in Supabase SQL Editor)
- Column was missing, causing silent upsert failures while webhook still returned 200 to Shopify
- Existing orders stay null; new orders populate correctly

**5.5c — ActivationTracker fixes (components/activate/ActivationTracker.tsx)**
- **Bug 1 (firing on multiple page visits):** `useRef` guard resets on every component remount during navigation. Fixed: localStorage guard persists across navigation. Fires exactly once per device, never again.
- **Bug 2 (10–20 min delay / not firing):** `trackWhenReady()` relied on `posthog.onFeatureFlags()` callback that was hanging. Fixed: simple `setTimeout(500)` + direct `track()` call, scope to localStorage-guarded condition. [2026-06-25: this "hanging onFeatureFlags" is the same init-race later root-caused in 5.7. The setTimeout(500) here was a local workaround for one event. With init-before-mount now shipped at the provider layer, this could in principle be simplified back to `trackWhenReady`, but `device_activated` is the North Star, so leave it untouched unless there is a concrete reason. Logged as a low-priority consideration.]
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

**Story beats captured**

| ID | Beat | Tag |
|---|------|-----|
| P5-1 | "PostHog's $device_type is computed after an event fires, so a cart read at creation time gets undefined. The whole cart-attribute pipe was silently failing — the webhook returned 200 to Shopify anyway, but the attribute never wrote. I replaced the async dependency with a synchronous userAgent read at the exact moment the cart exists. Same cart, same three attributes now; Shopify is the source of truth for money, userAgent is the source for device. The pattern: when an integration point doesn't fire, read the artifact (the webhook response, the cart row) to see what actually landed, not what the code intended." | `integration-depth`, `analytics-rigor` |
| P5-2 | "The ActivationTracker fired on every page visit and hung for 10 to 20 minutes because useRef resets on component remount — navigation remounts the component and triggers another fire, and trackWhenReady() waits on an async callback that sometimes never resolves. Switched to localStorage (persists across navigation) and a timeout (always fires, doesn't wait). The fix had a name — localStorage guard + setTimeout — that made it obvious once I stopped reasoning about the code and started reasoning about the test behavior: 'fires on every visit' + 'resets on navigation' = useRef is the wrong guard. The North Star event is too important to ship guessing." | `analytics-rigor`, `integration-depth` |

---

#### 5.6 — Channel attribution reworked: synchronous derivation through the cart-attribute pipe (2026-06-21) ✅

**Supersedes the 5.1 person-based channel approach for the purchase event.** 5.1 assumed channel should be read off the PERSON (`$virt_initial_channel_type`) and that identify-on-email would resolve it. Live inspection disproved the premise: on a direct typed-URL test, the pageview event stored `Referrer URL = $direct` and carried NO readable `$channel_type` property at all, and `window.posthog.get_property('$channel_type')` returns nothing client-side. Confirmed against the PostHog docs: channel type is COMPUTED AT QUERY TIME from referrer + UTM inputs, never persisted on the event, never exposed for a client read. So neither the event nor a cart-time client read can pull `$channel_type` directly. The whole `posthog.get_property('$channel_type')` path was dead and always fell back to "unknown."

**Decision (locked): derive channel ourselves, synchronously, and pass it through the cart like device_type.** Same architecture as 5.5: read the raw inputs that ARE available synchronously at cart-create (`document.referrer` + the URL's UTM params), classify them into a channel with our own logic mirroring PostHog's default rules, write the result plus the raw inputs as Shopify cart attributes, read them back in the webhook, and attach them directly as properties on the purchase event. Channel now rides on the EVENT, not the person, so it is immune to the identified_only / identity-gap problem that 5.1 was fighting. "Direct" is definitionally "no referrer and no UTM," which is always derivable with certainty, so the value is never "unknown" for a real visit.

**Why our own derivation and not PostHog's `$channel_type`:** PostHog's classification is only available in queries, after the fact, and only where the event carried browser context. The purchase event is born server-side in the webhook (`$is_server: true`) with no referrer, no URL, no session. The only way to get a true channel onto it is to capture the inputs in the browser at cart-create and carry them forward. The UTM fields ride along verbatim, so sub-source granularity (which social platform, which ambassador, which dropship partner) lives in `utm_source`, NOT in the coarse `channel_type`.

**The two-source split (decision):**
- **Sessions by channel (`XQQXrJ0N`, web board):** stays on PostHog's computed session-level `$channel_type`. Browser pageview events carry `$referrer` / `$referring_domain`, so PostHog computes channel correctly at query time. No change needed; this tile was always fine.
- **Acquisition Channel / purchases (`lo1DdHbT`, conversion board):** repoint to break down by the NEW `channel_type` EVENT property the webhook now attaches, NOT `$initial_channel_type`. This is our derived value, populated on every stitched purchase regardless of identify state.

**Files:**
- NEW `lib/analytics/channel.ts` — `getChannelAttribution()` returns `{ channel_type, utm_source, utm_medium, utm_campaign, referrer }`. Reads UTMs from `URLSearchParams(window.location.search)` and `document.referrer`, then `deriveChannel(referrer, utmSource, utmMedium)` classifies: paid medium → "Paid"; known social/search `utm_source` → "Organic Social"/"Organic Search"; any other tagged source → "Campaign"; empty referrer → "Direct"; else referrer-hostname match → Organic Search / Organic Social / "Referral". No PostHog dependency, no "unknown" default. (Initial Bolt version still read `$channel_type` from posthog-js; that read was removed in this rework.)
- `lib/cart/store.ts` — `addItem` cartCreate path pushes the five new attributes (`channel_type`, `utm_source`, `utm_medium`, `utm_campaign`, `referrer`) into the SAME attributes array as `device_type` and `posthog_distinct_id`. Attributes written at cart creation only (first `addItem`); `cartLinesAdd` does not re-send them, same constraint as device.
- `app/api/webhooks/orders/route.ts` — reads the five keys off `note_attributes` (mirroring the `device_type` read) and adds them to the `posthog.capture` purchase event `properties`. Supabase `insertOrder` intentionally NOT extended (channel not persisted to the orders table; PostHog event is the only consumer for now).

**Cart-attribute table (extends the 5.5 device row):**

| Attribute | Source | Lands on |
|---|---|---|
| `device_type` | `detectDeviceType()` (userAgent sync) | PostHog + Supabase |
| `channel_type` | `deriveChannel()` (referrer + UTM sync) | PostHog event only |
| `utm_source` / `utm_medium` / `utm_campaign` | URL query, sync | PostHog event only |
| `referrer` | `document.referrer`, sync | PostHog event only |

**Stale-cart washout (banked, same class as device).** Attributes write at cart CREATION and the cart persists in localStorage. Any cart created before this shipped has no `channel_type`, so the webhook fallback writes "unknown" on those orders. Early post-launch weeks therefore carry an Unknown channel bucket from pre-existing carts; it self-heals as carts cycle. The agent must treat early channel-on-purchase Unknown as expected washout, NOT a finding, exactly as it already does for device revenue. Clear localStorage (`litsaber-cart`) or use incognito when testing, or you re-place orders against the old attribute-less cart and keep seeing "unknown" with a mismatched distinct_id.

**Verification gotchas surfaced (banked):**
- A purchase event reading `channel_type: "unknown"` with a distinct_id that does NOT match the cartCreate payload = stale cart, not a webhook bug. Match the distinct_ids first before suspecting the code.
- `window.posthog` is undefined in the console because the module is not aliased to `window`; this does NOT mean PostHog failed to load. Confirm load via the Network tab (`/e/` requests to `us.i.posthog.com`), not the global.
- "Desktop shows Mobile" during testing was DevTools device emulation (UA reported `Pixel 9`); `detectDeviceType()` was correct. Not a bug. (Separately noted: the Tablet branch in `lib/device.ts` is effectively dead code — Android tablets are caught by the Mobile rule first and modern iPads report a desktop UA — left unfixed, low priority.)

**Story beats captured (5.6)**

| ID | Beat | Tag |
|---|------|-----|
| P5-3 | "Spent the back half of a session trying to read PostHog's channel type onto the purchase event, off the person, off the cart, before the docs settled it: $channel_type is computed at query time and never stored, so there was nothing to read. The fix wasn't a better read, it was to stop reading PostHog and start deriving the channel myself from the raw referrer and UTM inputs at the one moment they exist client-side, then carry it through the cart exactly like device. The lesson: when a platform property won't materialize where you need it, check whether it's stored at all before building three mechanisms to fetch a thing that was always computed on demand. The coarse channel rides as our own event property; the UTM source carries the granularity the channel never could." | `integration-depth`, `analytics-rigor` |
| P5-4 | "Three 'bugs' in a row were all environment, not code: a purchase reading the wrong channel was a stale localStorage cart (mismatched distinct_id was the tell), a console error was PostHog not being aliased to window (it was loading fine, visible in the Network tab), and desktop reading as Mobile was DevTools emulating a Pixel 9. Reading the artifact, the actual distinct_id, the actual network calls, the actual userAgent, beat reasoning about the code every time." | `analytics-rigor`, `pm-discipline` |

---

#### 5.7 — Init-before-mount: root cause and durable fix for the near-mount race (2026-06-25) ✅
 
Pre-launch promo testing reopened the near-mount event problem from 5.2. Despite the
onFeatureFlags patch, promo_code_captured and product_viewed were still missing on
real visits. Reading the exact event timestamps on the LIVE project (480206) settled
it: on a TEST10 landing, $pageview fired at 11:08:58 and product_viewed +
promo_code_captured did not fire until 11:13:58, exactly 5 minutes later. A separate
15-second visit recorded zero of those events. This was delayed FIRING (capture
timestamps), not the live-feed display lag seen in earlier sessions.
 
**Root cause.** posthog.onFeatureFlags() only invokes its callback if posthog.init()
has already been called. PostHogProvider calls init() in its own useEffect, and the
child components (the discount hook, the PDP tracker) mount in the same render pass,
so their onFeatureFlags callbacks register BEFORE init() runs and miss the initial
fire. They only resolve when flags later reload (about 5 minutes), so any session
shorter than that loses the event entirely. Events that fire after init
(promo_popup_shown at about 12s) were always fine, because by then __loaded is true
and trackWhenReady takes its immediate path. This is the same "hanging onFeatureFlags"
the 5.5c ActivationTracker fix worked around locally with setTimeout(500); here it is
root-caused rather than patched per-event.
 
**The fix (three changes, two files).**
1. providers.tsx: run posthog.init() before children mount, via useLayoutEffect.
   Chosen over module-scope init for minimal blast radius: useLayoutEffect keeps init
   client-only (no SSR or build-time execution, so no need to wrap a module-scope
   init() in a typeof window guard) and still runs before child effects. This makes
   __loaded true at mount, so near-mount events take trackWhenReady's immediate path
   instead of the onFeatureFlags fallback.
2. useDiscount.ts: route promo_code_captured through trackWhenReady (it had been
   rolling its own onFeatureFlags call); drop the now-unused posthog import (the
   unused import had previously broken the build under no-unused-vars).
3. trackWhenReady stays the rule. It just now resolves immediately because init has
   already run by the time near-mount effects fire.
 
**Verified.** After the fix, on staging the PDP product_viewed and promo_code_captured
fire within about 1ms of the pageview, not 5 minutes later. The init race is closed.
 
Two follow-on fixes fell out of the same testing.
 
**Duplicate product_viewed on the PDP (RESOLVED).** Two components were emitting
product_viewed: ProductDisplay.tsx (surface from a prop: "pdp" on the PDP,
"homepage_buy" on the homepage) and PdpViewTracker.tsx (hardcoded surface "pdp").
Both mount on the PDP, so every PDP load fired product_viewed twice. Confirmed in
PostHog: two distinct event uuids, identical surface, window_id, and session_id,
about 1ms apart, while homepage_buy fired once. Both components were individually
correct (ref guard, empty deps). The bug was two correct emitters on one page, not a
bad dependency array or a re-render. Fix: deleted PdpViewTracker.tsx and removed its
import and usage from app/shop/litsaber-og/page.tsx. ProductDisplay is the single
source of truth and distinguishes surface by prop. Grep confirmed PdpViewTracker had
no other consumers before deletion.
 
**product_viewed false positive on the homepage (RESOLVED, closes the 5.2 fidelity
gap).** With the init race fixed, product_viewed fired correctly at mount, which
exposed that mount is the wrong trigger on the homepage: the buy section sits below
the fold, so a bare page load recorded a "view" that never happened. Switched
ProductDisplay.tsx from a mount useEffect to an IntersectionObserver that fires once
on first viewport entry: threshold 0 and rootMargin "0px 0px -15% 0px". Threshold 0
because the product block can be taller than the viewport, where a high threshold can
never be satisfied and the event would silently never fire; the bottom inset makes it
fire when the section is genuinely on screen, not from a 1px clip. Keeps the existing
ref guard, disconnects on fire and on cleanup, and falls back to a mount fire where
IntersectionObserver is unavailable. On the PDP the block is at the top, so it still
fires effectively on load (funnel step 3 timing unchanged); on the homepage it fires
only once the buy section is scrolled into view.
 
**Expected metric effect.** homepage_buy product_viewed counts will step DOWN after
this ships, on purpose, because the mount-fired false positives are gone. This is the
measurement getting honest, not a regression. Flag it so the next weekly report does
not read as a cliff. Open decision for later: whether homepage_buy product_viewed
should sit in the same funnel as the PDP view at all, now that it means "actually saw
the section" rather than "loaded the homepage."
 
**Method note (re-learned, cost real cycles).** Confirm the ACTIVE PostHog project
before reading "live" data. Most of the early debugging queried the test project
(445005) while the site under test reports to the live project (480206). A
switch-project call that hit a permission error silently fell back to test, and empty
results read as "the event never fired" when they only meant "wrong project." Treat
empty live results as a possible project reversion: re-assert the project and confirm
the returned name reads "Litsaber - Live" before trusting a query.
 
**Status at time of writing.** init-before-mount is shipped and verified (immediate
fire on staging). The PdpViewTracker deletion and the IntersectionObserver swap are
implemented; final confirmation is one clean incognito pass: homepage load with no
scroll equals no product_viewed, scroll the buy section equals exactly one (surface
homepage_buy), PDP load equals exactly one (surface pdp).
 
**Component inventory change.** components/product/PdpViewTracker.tsx is deleted.
product_viewed is now emitted from exactly one place, ProductDisplay.tsx, on viewport
entry, with surface set by prop.
 
**Story beats captured**
 
| ID | Beat | Tag |
|---|------|-----|
| P5-5 | "The promo and product-view events 'fired, just five minutes late.' Reading the exact capture timestamps on the live project showed a page load at 11:08:58 and the two events at 11:13:58, exactly five minutes later, and a fifteen-second visit that recorded neither. The cause: a posthog.onFeatureFlags callback registered before posthog.init() runs never fires, so it only resolves on a much later flag reload. The earlier onFeatureFlags 'fix' was a patch over the race, not a fix for it. The durable fix was to initialize PostHog before any child component mounts, so the ready path is taken at mount instead of the flaky fallback. A five-minute delay on a funnel step is not a slow event, it is a broken one, because almost no real visitor stays that long." | `analytics-rigor`, `integration-depth` |
| P5-6 | "A doubled product_viewed on the PDP looked like a bad dependency array or a re-render, but both components that fired it were individually correct. There were simply two of them: a generic product display that stamps the surface from a prop, and a dedicated PDP tracker that hardcodes the same surface, both mounting on the same page. The data proved it: two distinct event ids, identical surface and session, a millisecond apart, while the homepage fired once. The fix was deletion, not another guard. Two correct emitters on one page is still a bug, and the answer is one source of truth, not two guards fighting." | `analytics-rigor`, `integration-depth` |
| P5-7 | "Fixing the init race made product_viewed fire on time at mount, which immediately exposed a worse problem: on the homepage the buy section is below the fold, so 'mounted' was never 'seen.' Moved the event to an IntersectionObserver that fires on first viewport entry, with a zero threshold because the block is taller than the screen and a high threshold would never trip. The count will drop when this ships, and that drop is the measurement getting honest. The event finally means what its name says." | `analytics-rigor`, `pm-discipline` |
| P5-8 | "Half a debugging stretch went to querying the wrong analytics project: the test project while the live site reported to the live one. A failed project switch had silently fallen back to test, so empty results read as 'the event never fires' when they only meant 'wrong project.' The guardrail is cheap and easy to relearn the hard way: confirm the active project before trusting a single live query, and treat empty live results as a reversion signal, not a verdict." | `analytics-rigor` |

---

### Phase 5 — COMPLETE ✅

Phase 5 instrumentation is now complete end to end:
- PostHog identity: identify-on-email + server-side webhook identify ✅
- Promo funnel: popup shown / submitted / dismissed / code captured ✅
- Device detection: type at cart creation, persisted through purchase ✅
- North Star: device_activated fires once per device on first activation ✅
- Funnel complete: age_gate_confirmed → product_viewed → add_to_cart → checkout_started → device_activated
- Near-mount event race root-caused and closed at the provider layer (init-before-mount); product_viewed moved to viewport entry and the PDP duplicate emitter removed (2026-06-25, see 5.7). Init fix verified; dedup and viewport swap shipped, pending one final incognito confirmation. ✅
- Daily flagged sessions pipeline: flags and summarizes friction signals ✅
- Weekly agent: reads both streams (deterministic funnel tiles + qualitative session evidence) ✅

All events firing, all data flowing, all sources of truth locked. Ready for Phase 7 cutover.

---

### Phase 6 — Production Agent (building, 2026-06-14 to 2026-06-21)

**Goal:** A weekly n8n cron that reads PostHog, judges the business against stored targets using the Improvement Kata frame, writes a narrative report plus structured fields, stores both deterministically, and delivers. The agent *proposes* experiments, never *runs* them, and never writes its own numbers into storage.

**Governing principle (locked):** deterministic spine, agent as a single reasoning island. Anything that must happen every run, in order, idempotently, is a node. The agent only does the open-ended part: read numbers plus prior context, produce prose and proposals. Numbers in storage are always the parsed truth, never retyped by the model.

#### Phase 6.1 — Data layer (PostHog) ✅

**Stale-knowledge corrections banked (Shopify, verified against current docs):**
- Shopify custom-app flow changed 2026-01-01. The old admin "Develop apps > reveal `shpat_` token" path is LEGACY. Current path: Dev Dashboard > Create app > create a version > set scopes, Release, Install.
- New apps do NOT expose a copyable `shpat_` token. Internal automation uses the **client credentials grant**: POST `/admin/oauth/access_token` with `grant_type=client_credentials` + client_id + client_secret, returns a 24h access token. Fine for a weekly cron (mint fresh each run).

**Shopify abandoned-checkout pull: DEAD on Basic plan (decision).** `abandonedCheckouts` requires Protected Customer Data (Level 2 PII) access, gated behind Grow plan or higher. Both Shopify n8n nodes DISABLED (kept, not deleted). Agent runs on PostHog alone. Only loss is dollar-value-at-risk + abandoned-cart contents; the I5 checkout-abandonment tile still gives the rate and count.

**PostHog read mechanism (decision).** Agent reads SAVED dashboard tiles via the dashboard endpoint, NOT the `/query` endpoint: `GET https://us.posthog.com/api/projects/445005/dashboards/{id}/?refresh=true`, Bearer personal key. `/query` returns `403 personal API key access` even with `query:read` scope. Two dashboards read in parallel: Conversion `1710621`, Web Analytics `1718411`.

**`/query` wall → MCP pivot (decision).** The agent's ad-hoc drill-down uses the PostHog MCP server as a tool. Deterministic spine via dashboard endpoint; agentic investigation via MCP.

**Parser (Code node, verified against real payloads).** One `parseDashboard(json, keyMap)` reads both HTTP nodes by reference and emits `{ posthog_insights, web_analytics }`. Branches on `insight.query.source.kind`: `TrendsQuery` → `parseTrends`; `FunnelsQuery` → `parseFunnel`; `HogQLQuery` → `parseSql(result, insight.columns)` (dashboard endpoint shape is `result` = array of row-arrays, `columns` = sibling array of names — NOT nested `result.results`/`result.columns`). KEY_BY_SHORT_ID maps short_ids → stable semantic keys so week-over-week survives insight renames.

**Web vitals fix (banked).** The four vitals tiles were misconfigured as daily-average line graphs (read ~7x inflated). Rebuilt all four as single-value **p75** Number tiles. Now correct: p75 LCP ~1036ms, FCP ~746ms, INP ~40ms, CLS ~0.00004. short_ids preserved by editing in place.

**Two-dashboard split (decision).** Conversion board stayed the 7-section conversion spine. New Web Analytics board (`1718411`) holds Overview / Pages / Audience / Performance. The two channel tiles split by denominator: `XQQXrJ0N` "Sessions by channel" (traffic → web) vs `lo1DdHbT` "Acquisition Channel" = purchases by channel (outcome → conversion).

**Bounce + duration (SQL tiles, decisions).** Bounce rate reads `$is_bounce` from the sessions table (canonical, the same field the native tile uses). Avg session duration SQL returns only a display string ("32m 47s"), so the agent quotes it and does no math on it.

**Template tiles swept (decision).** Kept Sessions/Pages Per User on the board but marked DORMANT in the parser map (sample + test-distorted) so the agent ignores them during calibration.

#### Phase 6.2 — Storage layer (Supabase) ✅

**Sheets vs Supabase (decision): Supabase.** A structured, machine-read weekly archive wants a queryable, schema-enforced store. The service-role key bypasses RLS, so for this private server-only table RLS can stay enabled with no policies.

**Memory architecture (decision): two layers, one database, deterministic now.**
- Deterministic week-over-week: a Supabase row per week, exact `SELECT ... ORDER BY report_week DESC LIMIT 1`.
- Associative recall (pattern-matching over past narratives/hypotheses) is DEFERRED until ~8 to 12 real weekly reports exist. When built, it is pgvector IN THE SAME SUPABASE, embedding the narrative + hypotheses, never the metric rows.

**Report storage shape (decision): one combined JSON object per week.** `report_json` holds the whole parsed `{ posthog_insights, web_analytics }`. The narrative lives in `report_markdown`; the agent's full structured output lives in `report_data`. A PDF mirror of the markdown is rendered and stored.

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

#### Phase 6.3 — Orchestration spine ✅

**Topology correction (decision).** The Supabase read was moved from an agent TOOL to a deterministic upstream node. Storage is a node AFTER the agent, never a tool. The agent's only tools are PostHog MCP and Supabase MCP, both read-only.

**Linear chain (not branch-and-merge):**
```
Schedule Trigger (weekly Mon 8am)
  ├─ Get Conversion Insights ─┐
  └─ Get Web Analytics ───────┤
        Parse Insights  (one node, reads both HTTP nodes by reference)
        Date Context    (Code: report_week, week window, ISO week math)
        Read Targets     (Supabase Get Many, active=true, limit 1, Always Output Data)
        Read Last Week   (Supabase Get Many, report_week < this week, Always Output Data)
        Assemble Context (Code: merges parsed + date + targets + last week + scorecard)
        AI Agent         (Anthropic claude-sonnet-4-6; tools: PostHog MCP + Supabase MCP read-only)
        Write This Week  (Supabase upsert report_week/report_json/report_markdown/report_data)
        Render PDF (PDFBolt) + mirror to Google Drive
        Deliver (Gmail)
```
Date Context must precede Read Last Week and Read Targets. "Always Output Data" on the Supabase reads keeps the chain alive when a query returns zero rows.

**Date Context (Code node, ISO 8601 week math).** Computes `report_week` ("2026-W25"), `week_start`/`week_end`, zero-padded week number. ISO week math is in code, not an n8n expression.

**Recurred 2026-06-27 on Read Targets, as a datetime leak (PGRST100).** A "now"-style timestamp resolved into the `order=` param; PostgREST returned "failed to parse order (2026-06-26T17:24:45.844-07:00)", choking on the first `:` (the time separator at column 14). Root cause is the same: the Order By field was in expression mode, which lets a VALUE substitute where a column name belongs. Deeper rule: Order By must be a static column identifier or empty, never an expression. Fix on Read Last Week is the literal `report_week.desc`; fix on Read Targets is to CLEAR Order By entirely, since it returns the single `active = true` row and has nothing to sort.

#### Phase 6.4 — Kata / targets frame (decision)

**The reporting frame is the Improvement Kata:** business outcome → strategic initiative → target condition → current condition → weekly learning goal → prediction → grade-last-week's-prediction. Stored deterministically and read in.

**Targets are set from the current condition, NOT from thin air (load-bearing decision).** Pre-launch at zero real sales, hardcoding "20 orders/week" poisons every grade. Two-phase plan:
- **Phase one (first 2 to 4 weeks of real traffic):** NO numeric targets. The agent runs in "establish current condition" mode. Scorecard status is "calibration".
- **Phase two (week 3 to 4 of real traffic, Matt in the loop):** set targets as a defined improvement over the MEASURED baseline. Industry DTC ranges are sanity rails, not adopted blindly.

**`watch` band defined.** Three-band status: on_track / watch (amber, drifting) / off_track.

**Orders source reconciled (decision).** Three sources disagree: primary funnel terminal, promo pipeline, revenue. Revenue is the commerce source of truth: $0 revenue → 0 real orders. Assemble forces `orders_per_week` to 0 when revenue is 0; the agent flags the discrepancy in prose. (A dedicated standalone `count(purchase)` "Orders" tile is the clean long-term source; not yet built.)

**Report structure (decision): strictly top-down, executive → granular.**
1. Executive Snapshot · 2. Strategic Frame (kata) · 3. Scorecard · 4. Traffic & Audience · 5. Conversion Funnel · 6. Buying Behavior · 7. Session Signals · 8. Promo & Capture · 9. Revenue & North Star · 10. Performance · 11. Proposed Experiments · 12. Data Caveats

**Agent node config (decision, updated 2026-06-21).** Anthropic `claude-sonnet-4-6`, temp 0.4, **max tokens 8000** (raised from 4000 after truncated agent JSON cut off mid-output). Memory: empty. Tools: PostHog MCP + Supabase MCP, both read-only. **Structured Output Parser REMOVED** — the agent emits raw JSON under `.output` and a downstream node parses it with a salvage-catch (slice first `{` to last `}` on a failed parse, fall back to a numbers-only render if even that fails). Sonnet 4.6 reaffirmed over Opus/Haiku as the effectiveness-per-dollar fit for structured analytical writing against a fixed schema. House style enforced in prompt: no em-dashes, ranges as "X to Y", $59.99 never $60, never "light show", lifestyle-accessory framing.

**Output schema (decision, updated 2026-06-21):** `executive_summary`, `verdict` (enum), `key_findings[]`, `scorecard_assessment[]` (status + note, NO retyped numbers), `weekly_learning_goal`, `expectation`, `prediction_grade` (nullable), `proposed_experiments[]`, `data_caveats[]`, and `email_body`. (`report_markdown` is NO LONGER emitted by the agent — the markdown is built deterministically downstream by the Render Report node from the agent's structured fields plus the precomputed numbers; the agent supplies judgment, not layout.)

**Cover email (`email_body`, NEW 2026-06-21).** The agent writes a 3-to-5-sentence cover note, the "here's the week, look at X" message a teammate would send the founders with the attached PDF. Leads with the single most important takeaway, flags one or two things worth attention, points to the PDF for detail; no number dumps, no status-verdict restatement. The greeting ("Hi team,") and sign-off are hardcoded in the MD-to-HTML node, not the agent, so they stay consistent. The Gmail node sends `email_body` as the message body (HTML variant) with the PDF attached. The executive_summary prompt was also tightened to NOT open by restating the status verdict, killing a duplicate-status render bug (also stripped defensively in Render Report).

**Calibration reality (in the agent prompt).** All current numbers are test traffic under a ~7-visitor / ~24-session weekly ceiling until ~2 weeks past Phase 7 cutover. Known artifacts the agent must name: checkout abandonment 100%, cart abandonment 0%, 30-min+ session duration, funnel dropping to 0 after product_viewed, channel all-Unknown, geography 1 to 2 countries.

#### Phase 6.5 — Weekly agent live end to end + Flagged Sessions subsystem + schedule / week-boundary (2026-06-21) ✅

The weekly spine runs through delivery (agent node, Write This Week, PDF render via PDFBolt, founder email all built and firing), and a daily flagged-sessions subsystem feeds qualitative session-replay evidence into the weekly agent.

**Weekly workflow is live end to end.** AI Agent (Anthropic, house-style prompt, structured output) produces narrative plus structured fields, Write This Week upserts the row, the markdown renders to a Chrome PDF via PDFBolt, and the PDF is emailed to the founders. First full runs verified, producing the W25 report off live calibration traffic.

##### Phase 6.5a - Daily flagged-sessions pipeline (NEW subsystem) ✅

A second, separate n8n workflow runs daily and writes session-level friction/intent evidence into Supabase. Seven nodes:

1. **Schedule Trigger** (daily, 06:00 UTC).
2. **PostHog Flagging Query** (httpRequest POST `/query/`, Header Auth). HogQL flags one row per session in the trailing window on any of `$exception` / `$rageclick` / `$dead_click` / `checkout_started`, with a `converted` boolean from a LEFT JOIN of the server-side `purchase` event by `distinct_id` within a 2-hour window. Excludes `-git-` staging URLs. Production uses `INTERVAL 1 DAY`; test runs used `30 DAY` and must be reverted before cutover.
3. **Shape Rows** (Code) zips columns and results, coerces `converted` via `String()`, computes `week_of`.
4. **Upsert Flagged** (httpRequest POST PostgREST `?on_conflict=session_id`, `Prefer: resolution=merge-duplicates,return=minimal`).
5. **Summarize Sessions** (MCP Client node, PostHog MCP OAuth2, tool `session-recording-summarize`, ~600000ms timeout).
6. **Merge Summaries** (Code) reads `item.json.structuredContent`, skips keys starting with `_`, folds all MCP items into one dict keyed by `session_id`.
7. **Patch Summaries** (httpRequest PATCH `?session_id=eq.{{ $json.session_id }}`, `Prefer: return=minimal`).

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

**Instrumentation state banked.** `purchase` is captured SERVER-SIDE, so every purchase carries `$session_id = null` and is unflaggable directly. The correct conversion signal to flag on is `checkout_started` (client-side, has session id and recording). posthog-js init updated: `capture_dead_clicks: true` added, `capture_exceptions` added (still 0 events, no real exceptions yet), `$rageclick` already live. The PostHog internal/test-account filter is NOT yet set (deferred to cutover).

**PATCH-not-POST bug (banked, bit twice).** Patch Summaries was first written as POST, which PostgREST treats as INSERT, failing the not-null constraint. Fixed to PATCH. The identical bug reappeared later on the weekly Mark Reviewed node.

##### Phase 6.5b - Wiring flagged sessions into the weekly report ✅

**Assemble Context compaction.** Reads the unreviewed flagged rows and emits, per session: `{ session_id, start_url, start_time, duration_secs, flag_reason, converted, disposition, outcome, segment_summaries }`. A `flagged_summary` rollup carries `{ count, converted, by_reason }`.

**`disposition` field (decision: binary).** Derived at compaction: `converted: true` → `"converted"`, `converted: false` → `"lost"`. The three-way split was dropped because the narrative cannot reliably distinguish "purchased this visit" from "purchased later." Surfacing disposition as a render-table column is a cutover task.

**Agent prompt.** A trimmed "Flagged sessions" reference block defines the fields and how to read `flag_reason`, instructs the agent to render the table and interpret the pattern. A converted-is-ground-truth note was added.

**Render Report.** New `## 08 - Session Signals` section beneath Buying Behavior (07), with downstream renumber: Promo & Capture 09, Revenue & North Star 10, Website Performance 11, Proposed Experiments 12, Data Caveats 13.

**Mark Reviewed (decision: scope to the week, not all unreviewed).** PATCH, filtered to the exact session_ids the report read (not `reviewed=eq.false`), so sessions the daily flagger writes between the weekly read and this node aren't buried before being reported.

##### Phase 6.5c - The converted-but-abandoned investigation (decision: converted is ground truth) ✅

In the first live run, four of five flagged sessions read `converted: true` while every one of their `outcome` narratives described abandonment. Pulled the full event timeline for one session via PostHog MCP: the `purchase` fired server-side about 34 seconds after `checkout_started`, INSIDE the recorded session window, but with `$session_id = null`, so it never appears in the recording. A second converted session showed the identical signature.

Mechanism, now banked: because all purchases are server-side with a null session id, the purchase is structurally invisible to the summarizer, so any converting visitor who keeps browsing after checkout is narrated as abandonment. `converted: true` plus an abandonment narrative is the GUARANTEED fingerprint of a completed purchase. Decisions: (1) prompt note telling the agent `converted` is ground truth and overrides the narrative; only `converted: false` are genuine drop-offs. (2) the binary `disposition` field. (3) Disposition column deferred to cutover.

##### Phase 6.5d - Schedule + week boundary (decisions)

**Weekly fires Monday 08:00 UTC.** The daily flagger runs 06:00 UTC; the two-hour gap clears the daily summarize window. The dependency is held by the schedule (n8n does not enforce it across two workflows).

**Week starts Monday (PostHog setting + Date Context).** PostHog project "Week starts on" set to Monday so weekly tile bucketing matches the report's window math.

**Date Context node rewritten.** The old logic computed a trailing seven days ending yesterday, which produced a correct Monday-to-Sunday week only because the job happened to fire on a Monday. Replaced to anchor to the most recently COMPLETED Monday-to-Sunday week, regardless of run day:

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

Cadence: a Monday Jun 22 run reports Jun 15 to 21 (W25); a Monday Jun 29 run reports Jun 22 to 28 (W26). A manual Sunday run would resolve to the wrong week (no guard added, scheduled path only).

> **Status (2026-06-22):** Today is the first scheduled Monday. By the Date Context logic the run now produces the **W25 report (Jun 15–21)**. This is the first real scheduled run, not a pending item.

---

##### Phase 6.5e — PDF renderer rebuilt for Golden-Sample fidelity (2026-06-21) ✅

**The Google Docs export path was abandoned.** The report PDF had been HTML → Google Doc → PDF export. The Docs importer strips CSS (header fills wash to near-white, borders reinterpret as full-width page rules, fonts flatten), so the output could never match the Golden Sample. Replaced the three Google Docs nodes (Create Doc, Update content, Drive Download) with a single PDFBolt HTTP step. PDFBolt is Chrome-powered and hosted, which fits the cloud-hosted n8n instance (no VPS/tunnel as a self-hosted Gotenberg would need) and honors all CSS. Free tier (100 docs/month, 2MB cap) covers the weekly-report volume with room to spare. Chain is now Render Report → MD to HTML → PDFBolt → Gmail; the editable Google Doc is optional and out of the PDF critical path.

**Render split (decision).** Render Report builds markdown for everything EXCEPT the funnel tables, which markdown cannot express (colspan, two-row headers). For the nine funnels it emits a `{{FUNNEL:key}}` token and attaches a structured `funnels` object to its output. MD to HTML swaps each token for a real colspan two-row-header HTML table (step-group names across the top, ENTERED / DROPPED OFF / CONVERTED beneath, one row per breakdown — the Golden's signature layout). A `pretty()` label map converts raw event names (`cart_add_to_cart` → "Add to Cart") so the tables read in plain language.

**CSS lessons banked (Chrome / PDFBolt print rendering):**
- **`print-color-adjust: exact` (+ `-webkit-` prefix) plus `!important` on every background is mandatory** — Chrome's print path strips background colors otherwise, which is why early cyan header fills silently vanished.
- **An explicit `border: 1px solid #000` on the base `table` rule** fixes a faint/thin right-edge border caused by `border-collapse` rounding at `width:100%`; the collapsed model under-renders the outer right edge without it.
- **Two-column tables get class `kv` (fixed 70/30 layout), wider tables get `grid` (auto layout).** MD to HTML picks the class by header column count (`header.length === 2 ? 'kv' : 'grid'`). This makes all the 2-col key/value tables align identically down the page without crushing the 3-col (Exec Snapshot, Revenue) and 5-col (Traffic) tables.
- Arial throughout; sizes locked: body 11pt, h2 18pt underline, h3 14pt underline, h4 12pt, table headers/funnel step row 10pt, funnel sub-header 8pt, table body 10pt. Headings underlined, NOT cyan border-bottom (the border read as a floating rule). Conversion % in dark cyan `#0891b2` (bright `#00E5FF` is unreadable on white).

**Dashboard + insight documentation (2026-06-25, housekeeping).** Wrote descriptions for every insight on both boards (Conversion `1710621`, Web Analytics `1718411`) and dashboard-level descriptions for both, so the agent and any human reader have per-tile context. Also reviewed five SEO/organic-search insights (Top Website Pages Overall/via-Google, Website Unique Users Breakdown, Organic SEO Unique Users Total/Breakdown): the first three duplicate existing tiles and were excluded; the two Organic SEO tiles are the only genuinely new metrics and belong on a future acquisition view, not these two boards. Separately fixed the Bounce Rate SQL insight to use `{filters}` in its WHERE clause so the dashboard date control reaches it (it had a hardcoded 7-day window that ignored the global filter).

#### Phase 6 — what's done vs pending

**Done:** PostHog data layer (both dashboards — Conversion `1710621`, Web Analytics `1718411`; parser verified across trends/funnel/sql; web-vitals p75 rebuild). Supabase tables `litsaber_weekly_reports`, `litsaber_targets`, `flagged_sessions` (service-key access). Full weekly spine live end to end: Parse → Date Context → Read Targets → Read Last Week → Assemble → AI Agent → Write This Week → PDF (PDFBolt) → founder email; first runs produced the W25 report off calibration traffic. Daily flagged-sessions pipeline live end to end (flag → shape → upsert → MCP summarize → merge → patch). Flagged sessions wired into the weekly report (Assemble compaction, agent prompt block, Session Signals §08 render, scoped Mark Reviewed). Schedule + Monday week-boundary locked.

**Pending:**
- **Error-notification workflow (top pre-launch priority).** Build an Error Trigger to Gmail handler (one shared handler) and set it as the Error Workflow on both the weekly and daily crons. The weekly cron currently fails silently. (MCP access on the Live workflow is now enabled.)
- Surface the `disposition` field as a render-table column (cutover).
- Set the PostHog internal/test-account filter (Matt's distinct_id + matthewtyler1986@gmail.com) (cutover).
- Reconcile the orders discrepancy the agent flagged (`weekly_orders` tile vs `primary_funnel` terminal); build a dedicated `count(purchase)` Orders tile as the clean long-term source.
- Revert the daily flagging query from the `30 DAY` test interval to `INTERVAL 1 DAY` (cutover).
- Confirm `$exception` events appear once real errors occur (capture enabled; 0 events expected pre-traffic).
- Phase-two numeric targets: launch baseline row is set (`litsaber_targets` id 2, active). Remaining is the week 3 to 4 swap to a measured-baseline target version (manual, one transaction: deactivate old, insert new active). Add the `litsaber_targets_one_active` partial unique index first.
- AI-step evaluations on the report agent (post-launch, soft-launch window): seed a Data Table from execution history, score narrative quality and house-style adherence, not numbers (the parser owns those). Not a launch blocker.
- Deferred pgvector associative-recall layer (post-launch, after ~8 to 12 real weeks).
- Rotate the pasted `phx_` (PostHog personal) and `shpss_` (Shopify client secret) keys; both pasted in plaintext during the build session.

**Story beats captured (Phase 6)**

| ID | Beat | Tag |
|---|------|-----|
| P6-1 | "Built the weekly analyst as a deterministic spine with the model as one reasoning island, not an agent that orchestrates everything. Fetch, read last week, write this week, render, deliver are all nodes that run unconditionally and in order. The model only writes prose and proposes tests. The rule that fell out of it: the agent never decides whether to save and never types a number into storage. Numbers are the parser's truth; the model owns judgment. An agent that 'usually' generates the report is worse than a pipeline that always does." | `agent-loop`, `pm-discipline` |
| P6-2 | "Caught myself about to hardcode a 90-day target of 20 orders a week while sitting at zero real sales. A target with no basis poisons every grade after it. The fix was the kata discipline itself: you measure the current condition before you set the target condition. So the agent runs in establish-baseline mode with no numeric targets until real traffic gives it a floor to improve from, then targets get set as a defined delta over what was actually observed. Refusing to invent the number is the senior move, not a gap." | `pm-discipline`, `analytics-rigor` |
| P6-3 | "Three tiles disagreed on the single most important number — orders. The funnel said zero, the promo pipeline said one, revenue said zero dollars. Rather than let the agent silently pick, I made revenue the commerce source of truth (zero dollars means zero orders) and told it to flag the promo discrepancy as a tracking artifact in prose. When sources conflict, name the canonical one and surface the conflict — don't average it away or let the model choose per run." | `analytics-rigor`, `integration-depth` |
| P6-4 | "Verified the SQL-tile result shape against a real payload instead of trusting my own parser assumption. I'd written it to read nested result.results/result.columns; the dashboard endpoint actually returns result as row-arrays with columns as a sibling. One real paste corrected a guess that would have silently dropped both bounce and session-duration into an unparsed blob. The discipline that keeps paying off: pull the real artifact, don't reason about the shape from memory." | `integration-depth`, `analytics-rigor` |
| P6-5 | "A batch of flagged sessions read converted-true while their summaries all said 'abandoned.' The easy call was the agent's: probably test traffic. I pulled the actual event timeline for one instead and found the purchase fired server-side about 34 seconds after checkout, inside the session window but invisible to the recording because server-side events carry no session id. So in this data model every real conversion is narrated as abandonment, every time. The flag is ground truth; the narrative is a partial view of one browser visit. Pull the artifact before you trust the story written about it. It also killed my own first guess, that they came back later in another tab, which the in-window timing disproved." | `analytics-rigor`, `integration-depth` |
| P6-6 | "The same bug bit twice in two nodes: a Supabase write set to POST tries to INSERT, hits the not-null constraint on session_id, and dies. The fix both times was PATCH, an update in place. Then a quieter one on mark-reviewed: filtering on reviewed=false would mark every unreviewed row, including sessions the daily job writes after the weekly read but before the mark fires, burying them before they are ever reported. Scoped it to the exact ids the report read. An update is not an insert, and 'mark everything unreviewed' and 'mark what I just reported' are different sets the moment two workflows share a table." | `integration-depth`, `pm-discipline` |
| P6-7 | "Wired session-replay summaries into the weekly agent as qualitative evidence, walled off from the numbers on purpose. The funnel and trends tiles stay the canonical measurement; flagged sessions are texture the agent reads for the why, never a denominator it counts. Encoded the split in the prompt and in a binary disposition field, converted versus lost, so the agent separates recovered near-misses from genuine drop-offs instead of flattening them into one abandonment story. Evidence and measurement in separate lanes is the same trust rule as parser-owns-numbers, agent-owns-judgment." | `analytics-rigor`, `agent-loop` |
| P6-8 | "The report's week math took a trailing seven days ending yesterday, which gave a correct Monday-to-Sunday week only because the job happened to fire on a Monday. Anchored it to fixed weekdays so the boundary holds no matter the run day, and set PostHog's own week-start to Monday so the tiles and the report window slice the same seven days. A boundary that is right by coincidence of the fire day is a latent bug; pin it to the calendar, and make the two systems that cut the week agree." | `integration-depth`, `pm-discipline` |
| P6-9 | "Almost left every target null until a measured baseline, then caught that the rule was too blunt. Inventory targets and funnel-rate targets ground differently: the $143,250 and the 2,866-unit sell-through come top-down from what we already bought and the price we set, no traffic history needed, while conversion and activation rates are the only things that actually need a baseline. So the launch row commits the outcomes now and leaves the rates in calibration, with weekly pace as informational reference between them. 'No numbers yet' was protecting against inventing funnel rates; it shouldn't have grounded out the commitments we could already stand behind." | `pm-discipline`, `analytics-rigor` |

#### Phase 6.6 — Launch baseline target set + targets-table mechanics (2026-06-27)

**Launch baseline target row inserted and active (`litsaber_targets`, id 2, `active = true`).** First real target row, set the weekend before the getlitsaber.com launch. The kata frame's three text fields plus a structured benchmark scaffold:
- **business_outcome:** "Sell through current D2C inventory of approximately 2,866 units at a blended ASP of $49.99, realizing $143,250 in revenue."
- **strategic_initiative:** "Lead with TikTok organic earned media driving traffic to getlitsaber.com as the launch engine. Add brand ambassador and affiliate sales at nightlife and EDM events as an experiential earned channel, then expand distribution through a dropship program with online retailers. The sequencing is deliberate: prove the TikTok-to-D2C loop first, then scale the other two as they earn it."
- **target_date:** `2026-09-30` (end of summer / start of fall). From a launch this weekend that is ~13.3 weeks, a reference pace of ~215 units and ~$10,750 per week, ~31 units/day. Set as a forcing function; week-one shortfall is NOT graded against it.

**Two-phase rule refined to a three-bucket model (supersedes the binary in 6.4, does not delete it).** "No numeric targets until baseline" was too absolute. The honest split is by how a target grounds:
- **Committed (set now, top-down from inventory and price):** `sell_through_pct` (0 to 100), `cumulative_revenue` (0 to 143250), `asp` (to 49.99). These need no funnel history; they come from units on hand and the price they sell at. Commitments, not predictions.
- **Reference pace (informational, not graded):** `weekly_revenue` reference ~10750/week. Drives a gap-to-pace readout from day one without poisoning the grade.
- **Calibration (baseline-pending until week 3 to 4):** `weekly_orders`, `primary_funnel`, `first_activations`, `aov`, `cart_abandonment`, `checkout_completion`. Funnel mechanics that need observed traffic; inventing them is false precision.

**ASP is not AOV (banked).** $49.99 is the per-unit blended ASP and is a commitment. AOV runs higher because a 2-pack is one order carrying two units at $99.99, so AOV depends on basket mix not yet observed and stays in calibration. Storing $49.99 as an AOV target would be wrong by construction.

**`litsaber_targets` schema (was undocumented):**
```sql
-- columns: id bigint GENERATED ALWAYS AS IDENTITY (pk)
--          active boolean default true
--          business_outcome text not null
--          strategic_initiative text not null
--          target_condition text not null
--          benchmarks jsonb not null      -- array of {metric_key,label,unit,baseline,target,reference,status}
--          updated_at timestamptz default now()
--          target_date date               -- nullable
--          activated_at timestamptz default now()
```

**Versioning is via the `active` flag, append-only (decision).** Exactly one row is active at a time. The week 3 to 4 numeric-target swap is: insert a NEW row with the measured targets, flip it active and the old one to `active = false`, in one transaction. Never overwrite; the deactivated rows are the audit trail of how the target evolved. ids climb by design (GENERATED ALWAYS, sequence never reclaims), so the id value is meaningless and must not be hand-edited.

**The swap is MANUAL, not automated (clarified).** Nothing in either workflow writes `litsaber_targets`; it appears once, in the read-only Read Targets node. The weekly automation rotates `litsaber_weekly_reports` (one row per `report_week`, upserted), which has no active flag. The trap to avoid: conflating the auto-rotating weekly-report table with the rarely-and-manually-swapped target-version table.

**Read Targets uses `returnAll: true`, not `limit 1` (corrects 6.3).** So if two rows were ever active, it returns both and downstream silently takes the first. Guardrail recommended before the week 3 to 4 swap:
```sql
create unique index litsaber_targets_one_active on litsaber_targets (active) where active;
```
With it, forgetting the deactivate-before-insert errors instead of leaving two live targets.

**Live boards + live-only parser (cutover state).** Live project `480206` ("Litsaber - Live"), Conversion board `1747393`, Web board `1747398`. The HTTP nodes must resolve to `/api/projects/480206/dashboards/1747393/` and `.../1747398/` (check `team_id: 480206` on each returned dashboard). Parse node is now live-only: legacy/test short_id maps removed, rich-label passthrough (`name` + `derived_name` + `description` on every insight), multi-breakdown join (array breakdown_values joined with " · " instead of taking [0]), DataVisualizationNode/HogQL handling, and a split map per board for the shared Unique Visitors (`UaiJf1UQ`) and Unique Sessions (`z4LWSA9I`) insights pinned to both boards (CONV map gives `conv_unique_visitors`, WEB map gives `web_unique_visitors`, sessions emits `web_sessions` on both). Consequence banked: if any HTTP node still points at a test board, its test short_ids fall through to raw keys and the matching `{{FUNNEL:key}}` tokens go blank.

---

### Pre-Phase-7 — Media migration to Vercel Blob + video wiring (2026-06-11) ✅ 

*Note: this work ran in parallel with Phases 5–6 (it's dated 2026-06-11) but is filed here as a pre-launch bucket because it's a launch-readiness concern rather than a numbered build phase.*

**Goal:** Get media off the GitHub `public/` folder and onto a CDN-decoupled single store before launch, then wire the first real videos (hero, ThreeModes, Activate). Governed by ADR-007.

**The decision (ADR-007):** Vercel Blob as the SINGLE media store, images and video together. Driven by a stated operational constraint: one system, one workflow, no two-vendor split. Rejected Supabase Storage (second origin, and Supabase is the agent's data surface, not a media CDN — the same one-system-per-job reasoning ADR-006 applies to keeping Supabase out of the customer-record role), Cloudflare Stream (best video delivery but two workflows), and Cloudinary (new vendor). Key reframe surfaced during the decision: `public/` on Vercel is ALREADY edge-CDN delivery and most images go through `next/image`, so this was never a performance rescue. It was decoupling assets from the repo and from deploys, and giving video a home, in one system.

**Migration executed in four chunks (one commit each), `public/` kept as live rollback until the preview verified each step:**
- **Chunk A:** `scripts/migrate-media.ts` uploaded all of `public/images/` to Blob preserving pathnames. Sequential uploads, dotfile skip (`.DS_Store`), one-year cache headers, `addRandomSuffix: false`. Script loads `.env.local` itself. `tsconfig.json` excludes `scripts`.
- **Chunk B:** `lib/media.ts` (`mediaUrl`/`videoUrl`, env-var base with local fallback) created; `remotePatterns` Blob hostname added to `next.config.mjs`; every `/images/` reference swept to `mediaUrl()`.
- **Chunk C:** `public/images/` deleted (recoverable from git history).
- **Chunk D:** hero, ThreeModes (3 clips), Activate clips uploaded under `videos/`. Hero + ThreeModes wired; Activate sections in progress.

**Blob store facts (banked):** `get-litsaber-blob`, store ID `store_0KU6ZB3BoVDlOwuq`, region SFO1, PUBLIC access. Base URL `https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com` (no trailing slash).

**`NEXT_PUBLIC_MEDIA_BASE_URL` lives in THREE isolated environments** with no auto-sync: Vercel dashboard (Production + Preview + Development), local `.env.local`, AND Bolt's own env panel. Bolt's preview sandbox cannot read Vercel's vars, which is why media rendered blank in Bolt's preview until the var was added there too.

**Video standard locked (Blob is progressive download, NOT adaptive bitrate):** H.264 MP4 (never `.mov` — Chrome/Firefox reject it), 1080p max, 2 to 4 Mbps, AAC or no audio, `+faststart`, target under 15MB. The homepage hero arrived as a 110.8MB file and must be compressed before it ships.

**Video element pattern locked:** every autoplay background/loop video carries all of `autoPlay muted loop playsInline preload="metadata"`, a `poster` fallback, `aria-hidden` when decorative, and a `prefers-reduced-motion` branch that renders the static poster. For sizing, a `<video>` with only a width balloons to its intrinsic height: the fix is a constrained-aspect wrapper (`relative` + `aspect-*`) with the video `absolute inset-0 w-full h-full object-cover`.

**Components wired:** Hero device-render swapped from `<Image>` to autoplay video. ThreeModes right panel + mobile cards swapped img to video, paths in `modes.content.ts` via `videoUrl()`. Activate QuickStart, Modes, and Battery media columns fixed for the height-constraint bug.

**Open (Activate media sweep):** the `<video> w-full object-cover` with no height bug exists in EVERY Activate media slot (nine sections). Fixed in QuickStart, Modes, Battery so far; remaining sections pending. Resolution: one sweep to apply the constrained-aspect-wrapper fix everywhere, THEN extract a shared `<ActivateMedia src poster alt />` primitive.

**Considered and rejected: site-wide background music.** Browser autoplay policies block unmuted audio without a gesture, it competes with the product's own draw-reactive light moment, it reads as a dated amateur signal against the premium positioning, and it adds load with no upside. If audio is ever wanted, the on-brand version is an opt-in, off-by-default toggle.

**Feature flags (scoped, not yet built):** promo-popup toggle is a clean PostHog flag (delay-triggered, so no SSR-flash, no init-race) and the right first use. Price A/B testing REJECTED as a flag: underpowered at current traffic, a Shopify source-of-truth problem (a flag changes displayed price but checkout pulls real Shopify price), and same-SKU price discrimination is a fairness/legal gray area. Cleanest experiments at this traffic are high-contrast top-of-funnel changes (hero headline, CTA copy) measured on an engagement event that fires nearly every visit.

**Recurring Bolt lesson (banked again):** Bolt reported the `next.config.mjs` edit as complete when it had NOT applied it. Caught by pulling the literal file. The literal file contents are the only source of truth; the status report is intent.

**Story beats captured**

| ID | Beat | Tag |
|---|------|-----|
| MEDIA-1 | "Pushed back on my own framing before building. The ask was 'get media off the repo onto a CDN for speed,' but the repo folder on Vercel already IS the CDN, and most images already optimize through next/image. So the migration wasn't a speed fix, it was decoupling assets from deploys and giving video a home in one store. Naming what a change actually buys you, instead of accepting the stated reason, is what kept us from adding a second vendor for a problem we didn't have." | `tool-choice`, `pm-discipline` |
| MEDIA-2 | "Honored a one-sentence constraint over the technically-best answer. Cloudflare Stream is the better video host on raw merits (adaptive bitrate, per-view pricing), but 'I don't want images and video living separately' is a real operational cost, and one store with a compression discipline beats two stores with perfect delivery. The right architecture is the one the operator will actually maintain." | `tool-choice`, `pm-discipline` |
| MEDIA-3 | "Migrated in copy-now, repoint-next, delete-last chunks with the old folder live as rollback at every step. Nothing user-facing moved until a preview deploy proved Blob was serving everything. The deletion of the old folder was the LAST commit, not the first, and even then it was one git command from recovery. Risky migrations get sequenced so every step has a working fallback behind it." | `integration-depth`, `pm-discipline` |
| MEDIA-4 | "The same env var had to live in three places that don't talk to each other: Vercel for deploys, local for dev, and the builder's sandbox for its preview. Media rendered blank in the preview not because the code was wrong but because the builder's environment is walled off from Vercel's secrets by design. The lesson is to map where a value is actually read before debugging why it's missing, three environments means three copies, and that wall is a security feature, not a bug." | `integration-depth`, `tool-choice` |
| MEDIA-5 | "A talking-head video ballooned past its column because a video with only a width takes its own intrinsic height. The fix wasn't a magic height value, it was a constrained-aspect wrapper with the video positioned absolutely inside it, so the box defines the size and the video fills it. Then I found the identical bug in every Activate media slot. A defect that appears in nine places is one duplicated component waiting to be extracted, not nine bugs to fix nine times." | `integration-depth`, `pm-discipline` |
| MEDIA-6 | "Said no to background music and no to price A/B testing in the same session, both for the same underlying reason: the obvious-feeling feature collides with a constraint the requester hadn't weighed. Music can't autoplay and fights the product; a price test is underpowered at this traffic and creates a Shopify dual-truth and a fairness problem. The job isn't to build what's asked, it's to surface the cost the ask didn't see and offer the version that actually works." | `pm-discipline`, `discovery` |

---

### Phase 7 — Launch & First Loop (pending)

Soft launch. Two weeks of agent runs before trusting output.

**Cutover checklist (consolidated):**
- DNS flip `getlitsaber.com` WordPress → Vercel (Namecheap A/CNAME → Vercel). 1–2 week parallel period for rollback. ✅ DONE 2026-06-27
- Vercel env vars: live keys in Production, test keys in Preview. `NEXT_PUBLIC_MEDIA_BASE_URL` in all three environments. ✅ Three split vars configured (`NEXT_PUBLIC_POSTHOG_TOKEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`); host stays shared. VERIFY deployed + fire-test confirmed both directions. Orphan `NEXT_PUBLIC_litsaber_analytics_POSTHOG_*` integration var present but unreferenced by code — remove.
- Separate PostHog live project (480206) + Supabase live (`otlinkrztvxwhlefqaro`) / test split provisioned. ✅ OPEN DECISION: switch from two PostHog projects to PostHog Environments to avoid recreating all insights in 480206 (insights/dashboards aren't copyable between projects; cheapest to switch while 480206 is empty).
- Flip Authorize.net from test to live before launch. ✅ DONE 2026-06-27
- Enable branch protection on `main` (require a PR before merging) so nothing can push straight to production. Gap identified 2026-06-27 when the `staging` pipeline was set up; not yet enabled. ✅ DONE 2026-06-27
- Confirm `maintenanceMode` is `false` (gate down) before the DNS flip. Use the gate to take the storefront down during the payment and Warehut swap if needed (see Maintenance-mode gate below). ✅ DONE 2026-06-27
- Confirm `MAINTENANCE_BYPASS_TOKEN` is set in Production and marked Sensitive. Rotate it if it was shared widely during testing. ✅ DONE 2026-06-27 
- Decide whether to keep the gate wired after cutover (recommended, it is the cleanest way to take the live store down for future maintenance) or remove the middleware. ✅ DONE 2026-06-27
- Remove `/shopify-check` debug route; remove `console.log("[PDP]")`.
- Repoint the dynamic box QR to `getlitsaber.com/activate?utm_source=packaging&utm_medium=qr&utm_campaign=activation_insert`. ✅ DONE 2026-06-27
- Brand the customer-account subdomain `account.getlitsaber.com` (CNAME → `shops.myshopify.com`); swap navbar account link from the default URL via `NEXT_PUBLIC_ACCOUNT_URL`. ✅ DONE 2026-06-27
- Revert daily flagging query `30 DAY` → `INTERVAL 1 DAY`. 
- Set PostHog internal/test-account filter. ✅ DONE 2026-06-27
- Surface `disposition` render-table column. ✅ DONE 2026-06-27
- Rotate pasted `phx_` and `shpss_` keys (and the Shopify credential handed to Warehut, if it was a scoped token vs an installed app). ✅ DONE 2026-06-27

#### Returns policy — re-specified 2026-06-27 (supersedes old RA-based policy)

- **No Return Authorization.** RA step dropped (no system for it). Control is now refund-on-inspection after receipt, not pre-ship approval.
- **Fault-based shipping split:** customer pays return shipping for change-of-mind; Litsaber covers it (sends a label, not prepaid) for damaged / defective / not-as-described / wrong-item.
- **Refund to original payment method** (Authorize.net), not store credit. Set as default on every reason in Return Prime.
- **Exchanges limited to defective/wrong-item only** — single SKU means nothing to swap to until Gold ships.
- **Free USPS shipping confirmed** → all shipping-deduction language removed from policy page + PDP accordion.
- **Return reasons:** kept Damaged/defective, Wrong item, Not-as-described, Changed-my-mind (defensible under unopened/unused), Others. Deleted Size/fit.
- **Unopened-vs-defective carve-out** added: defect/wrong items exempt from the unopened condition (can't find a defect without opening).
- **Return Prime portal:** canonical URL is `checkout.getlitsaber.com/apps/return_prime` (app proxy on the Online Store primary domain). Return Prime has NO custom-domain field; `returns.getlitsaber.com` redirect was attempted and SCRAPPED. Use the checkout-subdomain URL behind friendly link text; do not re-attempt the subdomain redirect without a Vercel edge rewrite.
- **Still pending:** publish redirect theme (`instantcommerce/shopify-headless-theme`) for checkout logo / back-links; confirm Warehut generates the return labels the fault path promises.


#### Phase 7a — Maintenance-mode gate (coming-soon toggle) ✅ built pre-cutover

A site-wide maintenance gate that takes the public storefront down to a branded "We are recharging" page while leaving the team on the live site. Built to cover the domain, payment, and Warehut swaps during the parallel period, and reusable for any future maintenance window.

**Architecture (decision: Edge Config, not a PostHog flag).** The on/off state is a single boolean key `maintenanceMode` in a Vercel Edge Config store (`litsaber-flags`, id `ecfg_2nmiqjlqn6hiup9qnk15hj5hky5e`). `middleware.ts` reads it at the edge on every request and rewrites non-exempt routes to `/maintenance`. Edge Config over a PostHog flag because it evaluates natively in Edge middleware with no external network call per request, so storefront uptime is not coupled to PostHog being reachable. PostHog stays for product flags; Edge Config is the kill switch. The flag read is wrapped in try/catch and fails OPEN, so a transient Edge Config error can never take the store down.

**Toggle (decision: dashboard, not a deploy).** Flip `maintenanceMode` between `false` and `true` in the Edge Config Items editor; propagates globally in seconds, no redeploy. Value must be a real boolean, not the string "true" / "false" (middleware checks `=== true`).

**Team bypass (decision: secret-token cookie).** Visiting any URL with `?preview=<MAINTENANCE_BYPASS_TOKEN>` sets an httpOnly `ls-preview` cookie that passes that browser straight through while the gate is up. Token is a server-only env var (`MAINTENANCE_BYPASS_TOKEN`, no `NEXT_PUBLIC_` prefix, marked Sensitive in Vercel). Workflow during cutover: bypass your own browser, watch the customer view in incognito. Cookie is per-browser and per-domain, so set it once on each domain under test.

**Exemptions.** Middleware matcher leaves `/api/*` open (so the Shopify order webhook keeps recording in-flight orders during downtime), plus `/maintenance`, static assets, and `_next/*`.

**Page.** Two-column branded page at `app/maintenance/page.tsx`, copy in `maintenance.content.ts` (typed, no hardcoded strings). Logo and product photo served from Vercel Blob via `NEXT_PUBLIC_MEDIA_BASE_URL`; plain `<img>` (not next/image) to avoid a `remotePatterns` change to `next.config.mjs`. Headline "We are recharging." uppercased in CSS while the content string stays sentence case. Support CTA is a `mailto:hello@innovapeconcepts.com`. Soft purple `#4B2F81` blurred ellipse sits behind the photo.

**Env vars (three places per house rule):** `EDGE_CONFIG` (auto-added on store connect) and `MAINTENANCE_BYPASS_TOKEN` in Vercel (all environments) plus `.env.local` plus the Bolt env panel. `maintenanceMode` lives only in Edge Config Items, it is not an env var and is not mirrored anywhere.

**Build note.** Shipped as two Bolt prompts: page first (net-new `app/maintenance/` files), then the gate (dependency `@vercel/edge-config` plus `middleware.ts`). Sequencing matters: the page alone renders at `/maintenance` but nothing routes to it until the middleware is in and deployed. First build ran the page only, so the toggle did nothing until the gate prompt was run separately.

**Caveat banked.** The gate covers only routes served by the Vercel app. If any checkout step lands on a Shopify-hosted domain, that page is outside the gate and must be paused separately in Shopify.

**Story beats captured (Phase 7)**

| ID | Beat | Tag |
|---|------|-----|
| P7-1 | "Built the pre-launch maintenance gate on Vercel Edge Config instead of a PostHog feature flag, even though the flag system was already wired and the easy move was to reuse it. A flag would have put a network call to PostHog inside middleware on every request, coupling storefront uptime to a third party being reachable; Edge Config evaluates natively at the edge with no external call. Then made the flag read fail OPEN, so a transient Edge Config error serves the real store rather than the maintenance page. The principle that fell out: a kill switch must not depend on something more fragile than the thing it protects, and when the dependency does fail it should fail toward the store being up. Also re-learned the sequencing lesson the hard way: the page and the gate are two artifacts, and a beautiful maintenance page with no middleware in front of it is just an orphan route nothing links to." | `tool-choice`, `integration-depth` |
---

## Open Questions (rolling)

**Build-Phase-3 remainder — RESOLVED (built in the Commerce phases; Phase 3 handoff verified):**
All four items were built during the decoupled commerce build and confirmed at the Phase 3 verification:
1. ~~Gold waitlist modal (wraps `WaitlistForm list="gold"`) — triggered by Editions Box 2~~ → built in Commerce-Phase 3c
2. ~~Future Drops modal (wraps `WaitlistForm list="general"`) — triggered by Editions Box 3~~ → built in Commerce-Phase 3c
3. ~~Editions box action wiring: Box 1 → `/shop/litsaber-og`; Box 2 → Gold modal; Box 3 → Future Drops modal~~ → wired in Commerce-Phase 3c (confirmed at WhatWereShipping build)
4. ~~"FESTIVAL DROP LIST" signup on `/cart` page (deferred from Commerce-Phase 3b)~~ → built via the reusable `WaitlistForm` + HubSpot seam in Commerce-Phase 3c-1

**Carry-forward items from Commerce-Phase 3c-1:**
- Confirm WaitlistForm border is cyan-20% per Figma node `3703:7914` — verify it didn't inherit a drifted value
- ~~Reconcile offer-amount copy ($5 vs $10)~~ → RESOLVED: $10 locked (ADR-004)
- Decide rate-limit durability: current in-memory Map resets on cold start; upgrade to Upstash Redis if real abuse appears

**Resolved (kept for traceability):**
- ~~Email ReviewInfra to confirm read API / AI summary~~ → MOOT: provider is Judge.me (see Commerce-Phase-4 Reviews closeout)
- ~~AI Summary final approach (pending ReviewInfra response)~~ → resolved under Judge.me
- ~~ReviewInfra Path A vs Path B~~ → resolved (Judge.me widget)
- ~~Floating promo trigger logic + frequency cap~~ → RESOLVED: 12s + exit-intent; 72h dismiss / 365d subscribe; offer $10; ADR-004
- ~~Section 6 empty frame~~ → RESOLVED: Editions + commerce display (node `3312:2`)
- ~~2-Pack "SAVE $20" badge math~~ → RESOLVED: quantity discount — exact tier prices ($99.99/$134.99/$169.99/$199.99), display badges round to nearest dollar
- ~~REVIEWINFRA placeholder needs real provider name~~ → RESOLVED: Judge.me
- ~~Flip Authorize.net from test to live before launch~~ → DONE 2026-06-27 (Phase 7 cutover)
- ~~Repoint the dynamic box QR to the production `/activate` URL~~ → DONE 2026-06-27 (Phase 7 cutover)
- ~~Brand the customer-account subdomain `account.getlitsaber.com`~~ → DONE 2026-06-27 (Phase 7 cutover)

**Inconsistencies flagged for resolution:**
- **ADR-006 numbering conflict** → RESOLVED: ADR-006 is the Customer Data Architecture ADR (HubSpot CRM + three-destination order flow), a real file-backed decision. The "one-system-per-job" references in the media/ADR-007 context were using it as shorthand for a general design principle, not claiming a separate ADR. No renumber needed; citations corrected to stop implying a distinct ADR-006 "one-system-per-job" decision exists.

**Pre-launch (non-blocking until later):**
- **Footer price bug:** `$49.99` (MAP) rendering where `$59.99` (MSRP) belongs. Grep repo for `49.99`; confirm it's not on other surfaces (product cards, meta/structured data).
- **"Light-show first" PDP headline** violates the locked never-say-"light show" rule. Decide replacement lead-in.
- Build promo box frontend (Figma `3770:1315`) — bundled pre-launch with the ADR-004 backend, on top of Phase 5 instrumentation. Design the error state first (absent in Figma); consider auto-apply via `?discount=` checkout URL.
- Remove `console.log("[PDP]")` from `app/shop/litsaber-og/page.tsx`
- Remove `/shopify-check` debug route before Phase 7
- Venue card photography sourcing
- FAQ #3 placeholder copy (homepage)
- Contact page FAQ body copy (mostly placeholder)
- "Danksaber" direct competitor mention — keep, reframe, or remove
- "LITSABER OG +" title — verify `+` is intentional
- Mix-and-match UI revisit when Gold ships
- Engineering kinetic animation system spec

**Post-launch (outreach materials — target spec confirmed):**
- `Litsaber_Wholesale_Pricing_2026.pdf` rewrite → **MOQ 5, 80 case pack, 4 tiers** (Initiate / Knight / Archon / Legend), MSRP $59.99. Currently prints MOQ 25 / 100 case pack / 9 tiers — out of date, must be replaced to match the locked web wholesale page.
- `Litsaber_Business_Competence_Cheat_Sheet.pdf` rewrite → **41 LEDs, 10 colors, MSRP $59.99, landed cost $13.33**. Currently prints 31 LEDs / 10–12 colors / MSRP $100 / $18 landed cost.
- Sweep CLAUDE.md + any pitch copy so nothing still describes the Two Pack as a separate $99.99 SKU/variant (the model is a quantity discount on a single SKU).

---

## Glossary

- **Repositioning thesis:** The single-sentence strategic claim driving the rebuild.
- **Production agent:** The weekly automated analyst that proposes A/B tests from observed data.
- **Tool-per-phase:** The principle that no single tool owns the whole build.
- **Human-in-the-loop:** The agent proposes; the human approves and ships.
- **ADR:** Architecture Decision Record.
- **Phase 1.5:** Mid-phase reconciliation between Phase 1 and Phase 2.
- **Plan-review pattern:** Reviewing the builder's written plan as if it were a pull request — catching bugs at the paragraph stage, before any code is written.
- **Build track vs Commerce sub-phase track:** See Track Map at top. Build = Phase 1…7; Commerce = the decoupled cart build (1a/1b … 4a/4b/4c) running inside build-Phases 2 and 4.