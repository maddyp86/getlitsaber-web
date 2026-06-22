# CLAUDE.md

Persistent operational context for Claude Code. Read this first on every session.

---

## What this repo is

The getlitsaber.com replatform — a Next.js 14 + App Router storefront on Shopify, instrumented with a production AI agent for weekly conversion analysis.

Brand and strategy live in `BRAND.md`. Component spec lives in `COMPONENTS.md`. Design tokens live in `tokens.json`. Motion and interaction system lives in `MOTION.md`. Architecture decisions live in `docs/decisions/`.

**Palette is v0.3.0 (hybrid).** Deep purple-black canvas `#0A0518`, three decorative accents (cyan `#00E5FF`, magenta `#FF00E5`, purple `#9D5FFF`), and a dedicated CTA/conversion color, pink `#EC5793`, which is also the endpoint of the purple→pink gradient. This supersedes the earlier pure-black two-accent palette. Any component built before v0.3.0 (the Foundation phase: Navbar, Footer, AgeGate) automatically inherits the new hex values through the token system — but verify CTAs now use the pink `cta` token, not cyan, where conversion is the intent.

---

## Tech stack (locked)

- **Framework:** Next.js 14, App Router, TypeScript strict mode
- **Styling:** Tailwind CSS with tokens mapped from `tokens.json` into `tailwind.config.ts`
- **Commerce:** Shopify Storefront API (GraphQL), hosted checkout via `checkoutUrl`
- **Reviews:** Judge.me (Shopify-native reviews app; widget embed + REST API)
- **Analytics:** PostHog (product), Vercel Analytics (performance), Supabase (events mirror for the agent)
- **Forms:** HubSpot embedded forms (newsletter, wholesale, contact)
- **Media:** Vercel Blob — single store for all images AND video (ADR-007). See Asset convention.
- **Hosting:** Vercel. Pro tier is required AT the Phase 7 commercial cutover (Vercel's terms prohibit Hobby for commercial use, and Pro lifts the 10GB Blob transfer cap that video pressures). The earlier "Pro 6+ months in" note was wrong.
- **Domain registrar:** Namecheap (existing). Domain `getlitsaber.com` stays at Namecheap; DNS A/CNAME records point at Vercel.
- **Package manager:** pnpm

---

## Deployment topology

- **Bolt** is the active builder (resumed 2026-05-23). It generates code and pushes to GitHub. It is the single write path right now — see the critical workflow rule below.
- **GitHub** holds the source of truth. Every push to `main` triggers a Vercel production deploy.
- **Vercel** auto-deploys every PR to a unique preview URL. Production deploys on merge to `main`.
- **Namecheap** is the domain registrar. DNS records will be pointed at Vercel in Phase 6/7 during launch cutover. Until then, the live site `getlitsaber.com` continues running on the existing WordPress/Avada install while the new build is verified on the Vercel-provided preview URL (`getlitsaber-web.vercel.app` or similar).
- **Migration cutover** is deliberate, late-phase, and reversible. Do not touch Namecheap DNS without explicit user approval.

---

## Source precedence (Figma vs. spec docs)

When Figma and the spec docs disagree, the spec docs win. Always.

- **`BRAND.md` overrides Figma copy.** If Figma shows "TWELVE WAYS" or "$80" or "MOQ 25" — those are stale. The spec is the resolved truth.
- **`tokens.json` overrides Figma values.** Do not inline a hex Figma shows if a named token exists. Same for spacing, fonts, radii, z-index.
- **`COMPONENTS.md` overrides Figma layer structure.** Render the components the spec describes, not whatever ad-hoc nesting Figma uses.
- **Use Figma for:** layout proportions, spacing intent, imagery placement, visual hierarchy
- **Ignore Figma's:** hidden frames, debug guides, variant prototyping artifacts, inconsistent copy. (The frame Figma labels "Section 6" is NOT a placeholder — it is the WhatWereShipping section, now built. See commerce phasing below.)

**Figma file reference:** `cuBHq4i5XibiqCyleuZFHO`. Key nodes:
- Desktop homepage: `3216:33`
- Mobile homepage variants: `3760:5314`, `3760:8705`
- Desktop PDP: `3367:320`
- Mobile PDP: `3760:5949`, `3760:9139`
- Other page nodes listed in `COMPONENTS.md`

**Figma structure reality (important):** The file has ONE page ("Desktop Website") — there is no separate mobile page or mobile design system. Mobile layouts exist as individual variant frames *within* that page for some sections (e.g. the hero, the Be Seen scrollytelling section, and the Three Modes interactive section have dedicated mobile nodes), but NOT for every section. When a section has a mobile variant frame, pull it and match exactly. When it does NOT, mobile is **derived** from the desktop spec using the token scale and responsive rules (narrow the column, scale type down a step, add `px-container-mobile` gutters, restack) — not extracted. Always check whether a mobile node exists before assuming; if the user can supply mobile specs, use those as authoritative. Per-section mobile type scales (e.g. a 75px desktop headline becoming 45px on mobile) live in the component, not in `tokens.json`, since they're section-specific.

---

## Asset convention

**All site media (images AND video) lives in Vercel Blob, not in the repo.**
This is the ADR-007 state, executed 2026-06-11. `public/images/` has been
deleted. Do not add images or video to `public/`.

**Reference media through `lib/media.ts` — never hardcode a URL or a `/images/`
path:**
- `mediaUrl("home/hero-lifestyle.jpg")` builds the `/images/` Blob URL.
- `videoUrl("home/litsaber_mode.mp4")` builds the `/videos/` Blob URL.
- Both fall back to local `/images/` and `/videos/` paths when the env var is
  absent (local dev safety / rollback).

**Blob store + base URL (banked):** store `get-litsaber-blob`, ID
`store_0KU6ZB3BoVDlOwuq`, region SFO1, PUBLIC. Base URL
`https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com` (no trailing slash),
stored as `NEXT_PUBLIC_MEDIA_BASE_URL`. **That env var must be set in THREE
isolated places — they do not sync:** Vercel dashboard (Production + Preview +
Development), local `.env.local`, and Bolt's own env panel (Bolt's preview
sandbox cannot read Vercel's vars — this is why media renders blank in Bolt's
preview if the var is missing there).

**Blob pathname convention (mirrors the old folder structure as prefixes):**
```
images/home/      images/product/   images/venues/    images/reviews/
images/about/     images/activate/  images/icons/
videos/home/      videos/activate/
```
Filenames are lowercase, hyphenated or underscored, deterministic
(`addRandomSuffix: false`). A changed asset gets a NEW filename, never an
overwrite — that allows the one-year cache headers with no invalidation problem.

**What stays in `public/`:** ONLY build-coupled assets — fonts
(`next/font/local` needs the file at build time), favicon, `robots.txt`,
`sitemap`, and OG/metadata images. Nothing else.

**Rules:**
- Render photos via `next/image` with explicit `width`/`height` (or `fill` with
  a sized container) — no layout shift. `next/image` is used in 36+ files.
- **`next.config.mjs` `images.remotePatterns` MUST whitelist any remote media
  host.** `next/image` hard-throws on an un-whitelisted hostname. The Blob host
  (`0ku6zb3bovdlowuq.public.blob.vercel-storage.com`) is already whitelisted; a
  new host must be added before use.
- `ResponsiveImage` is a raw `<img>` inside `<picture>` (no AVIF/resize). It is
  the EXCEPTION; the site is overwhelmingly `next/image`. Use `ResponsiveImage`
  only for genuine paired mobile/desktop asset swaps (different files per
  breakpoint), passing `mediaUrl()` for both sources. Breakpoint switch defaults
  to `lg` (1024px); mobile asset below, desktop at/above. Paired-asset naming:
  desktop is the base name (`hero-lifestyle.jpg`), mobile appends `-mobile`
  (`hero-lifestyle-mobile.jpg`); formats may differ between the two.
- Always provide meaningful `alt`; `alt=""` only when purely decorative.
- If an asset doesn't exist yet, reference its intended `mediaUrl()`/`videoUrl()`
  path and add `{/* TODO: upload to Blob */}` above the tag.
- Do NOT invent asset filenames. The Blob path must actually exist — confirm in
  the Blob dashboard before referencing.

**Video assets (ADR-007).** Vercel Blob is progressive download, NOT adaptive
bitrate, so video is compressed BEFORE upload, never shipped raw:
- Format: H.264 MP4. NEVER `.mov` (Chrome and Firefox reject it).
- 1080p max, 2 to 4 Mbps target bitrate, AAC audio or none, `+faststart` (moov
  atom at front so playback starts before full download).
- Target under 15MB per clip. A hero/loop clip over that is a broken hero on
  festival LTE.
- Paths in content files via `videoUrl("...")`, never hardcoded.

**Video element pattern.** Every autoplay background/loop video carries ALL of
`autoPlay muted loop playsInline preload="metadata"` (all four required for
mobile-Safari autoplay — dropping any one silently breaks it on some device),
plus a `poster` fallback, `aria-hidden` when decorative, and a
`prefers-reduced-motion` branch rendering the static poster instead. For sizing:
a `<video>` with only a width balloons to its intrinsic height. Wrap it in a
constrained-aspect box (`relative` + `aspect-*`) and give the video
`absolute inset-0 w-full h-full object-cover`, so the box defines the height and
the video fills it. NEVER give a `<video>` `w-full object-cover` with no height
constraint.

**Critical workflow rule — single write path to the repo:**
- The repo has ONE write path at a time. **As of 2026-05-23 that path is Bolt**
  (the earlier handoff to local Claude Code was reverted; the team is back on
  Bolt and not yet on Claude Code). Code enters through Bolt, which pushes to
  GitHub.
- The rule that matters is NOT "which tool" — it is "only one tool writes at a
  time." The past collisions (a Netlify dependency leak, then a merge that
  dropped the entire `public/images/` folder, recovered via
  `git checkout <commit> -- public/`) were caused by TWO write paths to one repo,
  not by Bolt specifically. Whichever tool is active, do not write through a
  second one concurrently.
- While Bolt is the active path: do NOT add or edit files via the GitHub web UI,
  a local clone, or any other tool. That recreates the two-source divergence that
  caused the collisions. Assets that can't go through Bolt should be added in a
  deliberate, announced single-tool window, then control handed back to Bolt.

---

## Conventions

### Code

- TypeScript strict mode. No `any`. If you need to escape the type system, use `unknown` and narrow.
- React Server Components by default. `"use client"` only when a component needs interactivity (cart, animations, form state, scroll behaviors, drawers, modals).
- Co-locate component files: `Button.tsx`, `Button.test.tsx`, `Button.stories.tsx` in the same folder.
- Server-side data fetching with `fetch` + Next.js cache. No SWR or React Query unless there's a specific reason (cart state is the obvious exception).

### Styling

- Pull every color, spacing, font, and radius from `tokens.json` via Tailwind config. **No raw hex values in components.**
- If you need a value that isn't in the token system, **add it to the token system first**, don't inline it.
- Avoid arbitrary Tailwind classes like `text-[#00e5ff]` — always use the named token (`text-accent-cyan`).

### Commits

- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`
- Scope where useful: `feat(pdp): add variant selector`
- Tense: imperative. "add" not "added" or "adds"
- Short subject (≤72 chars), body explains *why* if not obvious

### PR workflow

- Branch per feature: `feat/pdp-variant-selector`
- Self-merge after Vercel preview check passes
- Squash on merge to keep `main` history clean

### Files Claude Code should NEVER touch

- `.env.local` and any other `.env*` files (except `.env.example`)
- `node_modules/`
- `.next/`
- Anything in `.gitignore`

### Files Claude Code should ALWAYS update when relevant

- `docs/working-memory.md` — log decisions and story beats as they happen
- `docs/decisions/` — add an ADR when making a significant architectural call
- `CHANGELOG.md` (when it exists) — user-facing changes

---

## Brand voice rules (the short version)

Full version in `BRAND.md`. The non-negotiables:

- **No em-dashes in body copy.** Use periods, semicolons, or restructure.
- **No exclamation marks.** Ever.
- **No superlatives** ("premium," "revolutionary," "best-in-class," "amazing," "world's first," "ignite," "glow up").
- **MSRP is $59.99.** Locked. If you see other prices anywhere in the codebase, flag them — don't silently change.
- **Lead with the moment, not the spec.** "The headliner" before "800 mAh."
- **"X, not Y" is a recurring rhetorical move.** Use it when defining the product against alternatives.
- **PDP copy currently in Figma is AI-toned and violates these rules.** The product description block ("Ignite your night... world's first... glow-up accessory") needs rewrite. Flag to the user before scaffolding the PDP long-form copy verbatim.

---

## Commerce constraints

- **Stripe is prohibited** for this business (vape category). Payment is via Shopify's hosted checkout, which routes to Authorize.net behind the scenes.
- **Cannabis brands can't sell DTC.** This site sells the device (a 510-thread battery accessory). It does not sell cartridges, oil, or any cannabis product. Compliance copy in the footer reflects this.
- **21+ only.** Age gate is required and **compliance-critical**. It must:
  - Sit at the top z-index level (above everything)
  - Block site interaction until confirmed
  - Set a cookie on confirmation to suppress re-prompts within session/period (final policy TBD)
  - Provide an EXIT option that redirects to a safe external destination (e.g. `https://www.google.com`)
- **Quantity cap is 5 units per add-to-cart action** (Silver only; Gold-specific cap revisited at launch). Quantity discount tiers are defined in `lib/cart/pricing.ts` and apply as total line prices, not per-unit discounts. In Phase 4, these become Shopify automatic discount rules. See "Phase 2 decisions (locked)" for the full tier table.
- **Promo / welcome discount (locked — ADR-004).** Architecture A: HubSpot stores the contact and emails the code; Shopify owns one shared code (`WELCOME10`/`LITSABER`), "$10 off, one use per customer." Offer locked at **$10**. Two independent suppression layers: client cookie stops the popup (`COOKIE_SEEN` 72h on dismiss, `COOKIE_SUBSCRIBED` 365d on subscribe); Shopify "one per customer" stops code reuse. Frontend promo box (Figma `3770:1315`) is wired via `cartDiscountCodesUpdate` and ships as a pre-launch bundle with the backend, on Phase 5 instrumentation. Design the error state before building (absent in Figma).
- **TSA-compliant device** but cannabis carts are not — FAQ handles this honestly.
- **Wholesale MOQ is 5 units** (locked). Free display case at 80+ units. 4-tier wholesale pricing: Initiate, Knight, Archon, Legend.

---

## Commerce build phasing (Editions section, PDP selector, cart) — READ BEFORE BUILDING

This is the most complex feature in the build. The governing rule: **build all UI against a local cart store first; swap that store's implementation to Shopify last.** Components never talk to Shopify directly — they talk to a store interface. This keeps integration risk isolated to one late phase and keeps every build prompt small.

**The seam (non-negotiable architecture):**
- A cart store at `lib/cart/store.ts` (Zustand, persisted to localStorage) exposes a Shopify-shaped interface: `items`, `cartId`, `addItem(variantId, qty)`, `removeItem(lineId)`, `updateQty(lineId, qty)`, `clear()`.
- Line items carry `{ id, variantId, qty, title, price, image }` so the shape doesn't change when Shopify is wired in.
- **Phases 1–3 back every store action with LOCAL state only — no API calls.** The final phase swaps the action bodies to Shopify Storefront API mutations (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`). The component layer does not change during that swap.

**Variant → behavior mapping (locked):**
- **Silver** = in stock → add-to-cart flow (opens `<CartDrawer />`). Silver is the only physical SKU available now.
- **Gold** = coming soon → does NOT add to cart; opens the **waitlist modal** (same form as the "Gold Edition" Editions box).
- **Quantity** = the dimension that varies. The PDP selector exposes Single / Two Pack / More (with stepper for 3–5), each mapping to a quantity that adds to the cart as `qty × Silver`. Tier pricing applies. See "Phase 2 decisions" → "Bundle SKU strategy" for the full mechanism.

**Editions row — three boxes, three actions (CONFIRMED 2026-05-23 — all three open as described, no longer open questions):**
- Box 1 "OG Silver / SHOP NOW" → navigates to the Shop page (`/shop/litsaber-og`). No modal.
- Box 2 "Gold Edition / JOIN THE WAITLIST" → opens a **modal** (Gold waitlist) → submits to a **HubSpot form**.
- Box 3 "Future Drops / GET NOTIFIED" → opens a **modal** (general email list signup, NOT Gold-specific) → submits to a **HubSpot form**.
- Note: this resolves the earlier open question about whether Box 2 used a modal vs. scroll-to-Gold. It is a modal. The inline Gold-waitlist card that appears inside the ProductDisplay (when the Gold style is selected, Figma `3703:7914` Variant2) is a SEPARATE surface from these modals — same intent (waitlist capture), different placement. Both ultimately submit to HubSpot.

**Email confirmations route through HubSpot — do NOT build a backend for this.** Both the Gold waitlist and Future Drops signups submit to HubSpot forms; a HubSpot workflow sends the confirmation email and the contact lands in the CRM (portal `244547358`). Two new HubSpot forms are needed (Gold Waitlist, Future Drops) — created/confirmed by Matt before Phase 3 form wiring. Region is `na2`. Existing form IDs (wholesale, contact) are in the stack notes; reuse the same embed pattern.

**Payments — Authorize.net, already approved.** Shopify hosted checkout is configured to route to Authorize.net (Stripe is prohibited for this category). The store is approved for hardware/accessory sales. The headless build redirects to Shopify's `checkoutUrl` for the actual transaction — we do not handle card data in our own UI.

**Build sequence (each bullet = one builder prompt = one commit). Do not collapse phases.**
1. **Phase 1 — static layout, zero logic.** (1a) Editions CTA row, 3 boxes, responsive, buttons inert. (1b) Product Display: gallery + thumbs, spec pills, variant selector, bundle selector, both CTAs — all static.
2. **Phase 2 — local cart store + selection logic.** (2a) Build the store (local-backed). (2b) Wire variant/bundle selection + price display to component state. (2c) Conditional CTA: Silver → `addItem`; Gold → waitlist modal.
3. **Phase 3 — drawers, pages, forms.** (3a) Add-to-cart slide-out drawer (reads store). (3b) `/cart` page (reads store, remove only — no qty stepper). (3c) Gold waitlist + Future Drops modals → HubSpot. (3d) Wire the three Editions box actions.
4. **Phase 4 — Shopify, last and isolated. ✅ COMPLETE 2026-05-28 (commerce; reviews provider still pending).** (4a) Storefront client + variant fetch by `sku === "LTS-OG-SLV"`, server-component PDP wiring, availability via `availableForSale`. (4b) Store action bodies swapped to `cartCreate`/`cartLinesAdd`/`cartLinesUpdate`/`cartLinesRemove`; persist `cartId` only, re-fetch lines on hydrate. (4c) Checkout buttons redirect to `checkoutUrl`; tier pricing sourced from Shopify `cost.totalAmount` (discounts live in Shopify, `lib/cart/pricing.ts` demoted to optimistic-UI fallback). Qty cap enforced store-side. Full test-mode purchase verified end to end.

**Figma nodes for this feature** (file `cuBHq4i5XibiqCyleuZFHO`): Editions section `3312:2`; product display `3335:54` (NOT `3703:7914` — that is only the styles/bundle/CTA sub-block, a 2-variant component instance); add-to-cart drawer `3668:6263`; cart page `3668:5358`. Desktop and mobile mocks both exist — default to one responsive component per chunk per ADR-003; only split out a `*Mobile.tsx` if a chunk's responsive logic becomes unmanageable mid-build. Do not pre-split.

**Component naming (the Figma "Section 6" frame):** Figma labels this frame "Section 6" — that is a Figma artifact name, NOT the code name. In the repo it is `components/home/WhatWereShipping/` (a `position: relative` wrapper carrying the section's gradient background + a `max-w-[1250px]` centered inner column + a TODO mount point for the section-scoped `<Starfield>` motion layer). It renders two children: `components/home/Editions/` (the 3 CTA boxes, built Phase 1a) and `components/home/ProductDisplay/` (the gallery + selectors + CTAs, built Phase 1b). The wrapper owns all section padding and vertical rhythm; the children carry none. Never call the component "Section6" — that name has been retired.

---

## Reviews provider: Judge.me (locked, see ADR-008)

The PDP reviews subsystem is powered by **Judge.me** (https://judge.me), our Shopify-native reviews provider. This reverses the earlier ReviewInfra direction. See ADR-008.

- **Integration model:** Judge.me installs as a Shopify app and reads orders from Shopify directly, so review-request emails are automated with no custom Orders API to wire. Review widgets render on the PDP via Judge.me's embed (review widget plus rating badge), and the same data is available through Judge.me's documented REST API.
- **Default Phase 2/4 approach (Path A):** Use Judge.me's embedded widget as-is on PDP. Faster to ship. Trade-off: reviews UI matches Judge.me's design, not the rich Figma spec we inventoried.
- **Stretch approach (Path B):** Pull reviews via Judge.me's REST API and render our own UI matching the Figma component spec. Unlike the prior provider, the read API is documented, so Path B is a real option rather than a maybe.
- **AI Summary feature:** Judge.me does not provide an AI summary feature. Treat the `<AISummaryCard />` component as a separate, custom feature. Decision pending: (a) custom Claude API endpoint that synthesizes reviews server-side and caches, or (b) ship without it in v1.
- **For Phase 2 scaffold:** Build the PDP reviews section with mock reviews JSON matching the Figma component spec. Phase 4 wires up Judge.me (Path A by default).

---

## Site map (8 pages + cart system + modals)

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/shop/litsaber-og` | PDP |
| `/the-tech` | Engineering deep-dive |
| `/wholesale` | Wholesale program + HubSpot form |
| `/about` | Founder story, team, manufacturing |
| `/activate` | Post-purchase onboarding (QR-scanned from box) |
| `/contact` | Contact options + Master FAQ |
| `/policies/refunds` | Refund & Returns policy |
| `/policies/warranty` | Warranty policy |
| `/policies/shipping` | Shipping policy |
| `/policies/terms` | Terms of Service |
| `/policies/privacy` | Privacy Policy |
| `/cart` | Full cart page |

Plus global: `<CartDrawer />`, `<MobileNavDrawer />`, `<AgeGateModal />`, `<FloatingPromoPopup />`.

---

## What "done" looks like

For any component or page, "done" means:

1. Visually matches Figma at desktop and mobile breakpoints
2. Uses tokens, not inline values
3. Passes TypeScript strict
4. Has loading, error, and empty states where applicable
5. Is accessible: keyboard nav works, focus states are visible, alt text on images, ARIA where needed, modals trap focus
6. Performance: Lighthouse ≥ 90 on mobile, no layout shift, images optimized via `next/image`
7. SEO basics: page-level metadata, Open Graph tags, structured data on PDP (Product schema)

If any of these aren't true, the work isn't done — say so and propose what's left.

---

## Phase 2 decisions (locked)

- **Bundle SKU strategy (FINAL 2026-05-27, supersedes 2026-05-23 entry):** The Two Pack is **quantity 2 of the single Litsaber OG Silver SKU**, priced via a quantity discount tier system. There is no separate Shopify variant, no "Two Pack" logical line in the cart, and no physical two-pack package. The PDP exposes a curated selector (Single / Two Pack / More-with-stepper) that maps each option to a quantity (1 / 2 / 3–5) and adds `qty × Silver` to the cart.

  **Tier prices** (defined in `lib/cart/pricing.ts`):
  ```
  qty 1 -> $59.99   ($59.99/unit)               (no discount)
  qty 2 -> $99.99   ($50.00/unit)   save $19.99 (17% off)
  qty 3 -> $134.99  ($45.00/unit)   save $44.98 (25% off)
  qty 4 -> $169.99  ($42.50/unit)   save $69.97 (29% off)
  qty 5 -> $199.99  ($40.00/unit)   save $99.96 (33% off)
  ```

  Each tier's per-unit drop creates a real incentive to move up; $199.99 at the cap is the marketable "save $100" anchor. $40/unit floor stays well above wholesale Tier 1 ($24/unit) to protect channel separation.

  **Cart cap:** 5 units per Silver line. At cap, PDP surfaces a "Need more? See wholesale →" link to `/wholesale`.

  **Cart UI:** lines display real quantities ("Litsaber Silver × 2") with tier total. **No quantity stepper in drawer or cart page** — PDP owns quantity selection; customers remove and re-add to change quantity. The store's `updateQty` action remains in the store interface for Phase 4 / programmatic edge cases, but is not exposed as a UI control.

  **No mix-and-match UI for now.** Revisited when Gold ships; until then, a customer wanting a Silver + Gold mix would use two add-to-cart actions (Gold is currently waitlist-only, so this is moot until launch).

  **Shopify mechanism (Phase 4):** an automatic discount per quantity threshold. **Native Bundles is OFF the table** — it doesn't expose variant IDs through the Storefront API, which a headless cart needs. Component layer does not change during the Phase 4 swap — only the store's action bodies. The pricing constant in `lib/cart/pricing.ts` becomes a client-side fallback once Shopify discounts are live; Shopify is the source of truth for prices at checkout.

  **Decision history** — reversed twice during build:
  1. Dedicated $99.99 Two Pack variant → reversed because it would split inventory for a single physical good.
  2. Single SKU with the Two Pack modeled as one logical cart line at $99.99 → reversed because the model had no clean answer for quantities of 3, 4, or 5.
  3. Quantity discount on a single SKU (this entry) — the cart holds real quantities, marketing names live on the PDP where they belong, and the model scales linearly to any future tier.

- **PDP long-form copy:** Approved for rewrite. Current Figma copy ("Ignite your night... world's first... glow-up accessory") violates BRAND.md and must be replaced with copy matching the established voice. Rewrite happens during Phase 2 scaffold; flag for review before commit.
- **Age gate behavior (locked):**
  - First-visit cookie, **30-day duration** (industry standard for vape)
  - **Hard wall** — site is blocked until "I AM 21+" is clicked
  - "EXIT" link redirects to `https://www.google.com`
  - Cookie name: `litsaber_age_verified=true`
  - Re-prompt if cookie is missing, expired, or cleared

## When you're unsure

Prefer to **stop and ask** over guessing on:

- Brand voice calls (does this copy fit the thesis?)
- Pricing or commercial rules
- New dependencies — propose, don't install unilaterally
- Anything that touches `.env` or secrets
- Judge.me integration questions (Path A vs Path B, AI Summary)
- Promo box error-state UX before building it (Figma has no error state — ADR-004)

For everything else, propose a plan, get a thumbs-up, then execute.

---

## Open items / known issues

- **Activate media sweep + `<ActivateMedia>` primitive (open).** Every Activate
  section's media column had the no-height-constraint video bug
  (`w-full object-cover`, balloons to intrinsic size). Fixed in QuickStart,
  Modes, Battery. Apply the constrained-aspect-wrapper fix across the remaining
  Activate sections, THEN extract a shared `<ActivateMedia src poster alt />`
  primitive — the duplicated media-column JSX is how the bug reached every
  section, so one primitive replaces the copies and prevents recurrence.
- **Reviews provider migration (open).** Reviews switched ReviewInfra → Judge.me.
  Update the tech-stack line and the "Reviews provider" section, and add an ADR
  documenting the reversal.

---

## Story beat capture (important)

Every time you do something interesting — fix a non-obvious bug, choose between two approaches, or hit a specific edge case — log it in `docs/working-memory.md` under the relevant phase. The working memory doc is the source for content posts and interview narratives. A great moment that doesn't get logged is a great moment that disappears.
