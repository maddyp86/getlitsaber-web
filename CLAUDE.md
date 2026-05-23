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
- **Reviews:** ReviewInfra (script-tag widget integration)
- **Analytics:** PostHog (product), Vercel Analytics (performance), Supabase (events mirror for the agent)
- **Forms:** HubSpot embedded forms (newsletter, wholesale, contact)
- **Hosting:** Vercel (Hobby tier at launch; Pro tier likely 6+ months in driven by production agent function time)
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
- **Ignore Figma's:** hidden frames, debug guides, variant prototyping artifacts, inconsistent copy, the empty "Section 6" placeholder frame

**Figma file reference:** `cuBHq4i5XibiqCyleuZFHO`. Key nodes:
- Desktop homepage: `3216:33`
- Mobile homepage variants: `3760:5314`, `3760:8705`
- Desktop PDP: `3367:320`
- Mobile PDP: `3760:5949`, `3760:9139`
- Other page nodes listed in `COMPONENTS.md`

**Figma structure reality (important):** The file has ONE page ("Desktop Website") — there is no separate mobile page or mobile design system. Mobile layouts exist as individual variant frames *within* that page for some sections (e.g. the hero, the Be Seen scrollytelling section, and the Three Modes interactive section have dedicated mobile nodes), but NOT for every section. When a section has a mobile variant frame, pull it and match exactly. When it does NOT, mobile is **derived** from the desktop spec using the token scale and responsive rules (narrow the column, scale type down a step, add `px-container-mobile` gutters, restack) — not extracted. Always check whether a mobile node exists before assuming; if the user can supply mobile specs, use those as authoritative. Per-section mobile type scales (e.g. a 75px desktop headline becoming 45px on mobile) live in the component, not in `tokens.json`, since they're section-specific.

---

## Asset convention

All static visual assets live under `public/images/` with a **page-based** folder structure (this is what's actually in the repo — reconciled from the original category-based plan):

```
public/
└── images/
    ├── home/         # Homepage assets — hero-lifestyle.png, litsaber-hero-image.png, section imagery
    ├── product/      # PDP product renders, exploded views, color variants
    ├── venues/       # Festivals / Raves / House Parties / Events (Where It Lives section)
    ├── reviews/      # Customer photos from reviews
    ├── about/        # Founder photos, behind-the-scenes
    ├── activate/     # Product-in-use shots for the Activate page
    └── icons/        # Custom icons not covered by inline SVG
```

**Known homepage hero assets (confirmed in repo):**
- `public/images/home/hero-lifestyle.png` — hero background lifestyle/scene image
- `public/images/home/litsaber-hero-image.png` — Litsaber device render, layered over the background

**Rules:**
- Image filenames are lowercase, hyphenated: `hero-lifestyle.png`, not `Hero Lifestyle.PNG`
- Prefer WebP for photos where possible, SVG for icons/logos, MP4 for video. PNG is acceptable for renders with transparency (e.g. device cutouts).
- Always render via `next/image` with explicit `width`/`height` (or `fill` with a sized container) — no layout shift
- Always provide meaningful `alt` text — never `alt=""` unless purely decorative
- If an asset doesn't exist yet, reference its intended path and add `{/* TODO: replace placeholder */}` above the `<Image>` tag
- Do NOT invent asset filenames. Verify the real path in `public/images/<page>/` before referencing — the folder is page-based (`home/`), NOT a `hero/` category folder. (A Phase 2 build initially failed because it assumed `public/images/hero/`; the real path is `public/images/home/`.)

**Responsive images (mobile vs desktop assets) — standard pattern:**
- Many images have separate mobile and desktop files — different filenames, often different dimensions AND different formats (e.g. `hero-lifestyle.png` desktop / `hero-lifestyle-mobile.jpg` mobile).
- ALWAYS use the `<ResponsiveImage />` primitive (see COMPONENTS.md) for these — never hand-roll two `<Image>` tags with `hidden`/`lg:block`. The primitive uses `<picture>` so the browser downloads ONLY the needed asset; this matters most for `priority` above-the-fold images where a phone must not fetch the large desktop file.
- Breakpoint switch defaults to `lg` (1024px). Mobile asset below, desktop at/above.
- Paired-asset naming: desktop is the base name (`hero-lifestyle.png`), mobile appends `-mobile` (`hero-lifestyle-mobile.jpg`). Formats may differ between the two — that's expected and fine.

**Critical workflow rule — single write path to the repo:**
- The repo has ONE write path at a time. **As of 2026-05-23 that path is Bolt** (the earlier handoff to local Claude Code was reverted; the team is back on Bolt and not yet on Claude Code). Code enters through Bolt, which pushes to GitHub.
- The rule that matters is NOT "which tool" — it is "only one tool writes at a time." The past collisions (a Netlify dependency leak, then a merge that dropped the entire `public/images/` folder, recovered via `git checkout <commit> -- public/`) were caused by TWO write paths to one repo, not by Bolt specifically. Whichever tool is active, do not write through a second one concurrently.
- While Bolt is the active path: do NOT add or edit files via the GitHub web UI, a local clone, or any other tool. That recreates the two-source divergence that caused the collisions. Assets that can't go through Bolt should be added in a deliberate, announced single-tool window, then control handed back to Bolt.

**Where assets live in production:**
- During Phase 2/3: assets live in `public/` and ship with the repo
- Phase 6/7 migration: large assets (real product photography, video) move to Vercel Blob; references update from `/images/...` to the Blob URL. Keeps the repo lean.

**Video specifically:**
- Never commit video files to the repo (`.mp4`, `.mov`, `.webm`). Even short clips bloat git history permanently.
- Phase 2/3 video placeholder: render a `<VideoPlaceholder />` component (static thumbnail + play icon overlay) with a TODO.
- Phase 5+ migration to a real video host (Vercel Blob for small files, Mux for product videos, Cloudflare Stream as alternative).

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
- **Silver** = in stock → add-to-cart flow (opens `<CartDrawer />`). Silver is the only physical SKU; both bundle options (Single / Two Pack) resolve to it.
- **Gold** = coming soon → does NOT add to cart; opens the **waitlist modal** (same form as the "Gold Edition" Editions box).
- **Two Pack** = two of the Silver SKU shipped together, modeled as one logical cart line ($99.99). No separate product/variant. See "Bundle SKU strategy" above.

**Editions row — three boxes, three actions:**
- Box 1 "OG Silver / SHOP NOW" → link to `/shop/litsaber-og`.
- Box 2 "Gold Edition / JOIN THE WAITLIST" → opens Gold waitlist modal → submits to a **HubSpot form**.
- Box 3 "Future Drops / GET NOTIFIED" → opens notify modal → submits to a **HubSpot form**.

**Email confirmations route through HubSpot — do NOT build a backend for this.** Both the Gold waitlist and Future Drops signups submit to HubSpot forms; a HubSpot workflow sends the confirmation email and the contact lands in the CRM (portal `244547358`). Two new HubSpot forms are needed (Gold Waitlist, Future Drops) — created/confirmed by Matt before Phase 3 form wiring. Region is `na2`. Existing form IDs (wholesale, contact) are in the stack notes; reuse the same embed pattern.

**Payments — Authorize.net, already approved.** Shopify hosted checkout is configured to route to Authorize.net (Stripe is prohibited for this category). The store is approved for hardware/accessory sales. The headless build redirects to Shopify's `checkoutUrl` for the actual transaction — we do not handle card data in our own UI.

**Build sequence (each bullet = one builder prompt = one commit). Do not collapse phases.**
1. **Phase 1 — static layout, zero logic.** (1a) Editions CTA row, 3 boxes, responsive, buttons inert. (1b) Product Display: gallery + thumbs, spec pills, variant selector, bundle selector, both CTAs — all static.
2. **Phase 2 — local cart store + selection logic.** (2a) Build the store (local-backed). (2b) Wire variant/bundle selection + price display to component state. (2c) Conditional CTA: Silver → `addItem`; Gold → waitlist modal.
3. **Phase 3 — drawers, pages, forms.** (3a) Add-to-cart slide-out drawer (reads store). (3b) `/cart` page (reads store, qty edit + remove). (3c) Gold waitlist + Future Drops modals → HubSpot. (3d) Wire the three Editions box actions.
4. **Phase 4 — Shopify, last and isolated.** (4a) Storefront API client + env vars, fetch real product/variants. (4b) Swap store action bodies to Shopify cart mutations. (4c) Wire Buy Now / checkout to `checkoutUrl` redirect.

**Figma nodes for this feature** (file `cuBHq4i5XibiqCyleuZFHO`): Editions section `3312:2`; product selector `3703:7914`; add-to-cart drawer `3668:6263`; cart page `3668:5358`. Desktop and mobile mocks both exist — default to one responsive component per chunk per ADR-003; only split out a `*Mobile.tsx` if a chunk's responsive logic becomes unmanageable mid-build. Do not pre-split.

---

## Reviews provider — ReviewInfra (locked)

The PDP reviews subsystem is powered by **ReviewInfra** (https://reviewinfra.dev).

- **Integration model:** Script-tag widget (`<script src=".../embed/widget.js?storeId=...">`). Custom storefronts pass orders to ReviewInfra via their Orders API for automated review request emails.
- **Default Phase 2/4 approach (Path A):** Use ReviewInfra's embedded widget as-is on PDP. Faster to ship. Trade-off: reviews UI matches ReviewInfra's design, not the rich Figma spec we inventoried.
- **Stretch approach (Path B):** Pull reviews via ReviewInfra read API (if exposed) and render our own UI matching the Figma component spec. Requires confirming with ReviewInfra that this is supported. Not assumed.
- **AI Summary feature:** ReviewInfra documentation does not currently advertise an AI summary feature. Treat the `<AISummaryCard />` component as a separate, custom feature. Decision pending: (a) custom Claude API endpoint that synthesizes reviews server-side and caches, or (b) ship without it in v1.
- **For Phase 2 scaffold:** Build the PDP reviews section with mock reviews JSON matching the Figma component spec. Phase 4 wires up ReviewInfra (Path A by default).
- **Action item:** Email ReviewInfra to confirm: (1) does a read API exist for fetching reviews as JSON, (2) does any AI summary feature exist or is on roadmap. Affects Path A vs B and the AI Summary decision.

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

- **Bundle SKU strategy (FINAL 2026-05-23):** The Two Pack is **two of the single Litsaber OG SKU shipped together** — there is NO physical two-pack box and NO separate Shopify product/variant. One inventory pool. Decision driven by operations: shared inventory means no allocation guessing, no 3PL kitting map (the pick order reads "Litsaber OG Silver × 2" of a SKU the 3PL already knows), and QuickBooks stays single-SKU with COGS auto-computed as qty × $13.33. This reverses an interim "dedicated variant" call once it was clear no physical two-pack exists.
  - **Front-end (Phases 1–3):** model the Two Pack as a SINGLE logical line item in the local cart store ("Two Pack" title, $99.99, qty handling internal) so the cart UI shows one clean row, not "2× minus $20." "SAVE $20" is display copy only, never a Shopify discount object.
  - **Shopify mechanism (Phase 4 decision, leaning native Bundles):** the single logical line maps to Shopify via either (a) **Shopify native Bundles** — preferred, gives a clean bundle line that decrements the single's stock, or (b) an automatic discount on 2× the single. Both preserve the one-inventory-pool requirement. A dedicated variant is explicitly OFF the table because it would split inventory for one physical good.
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
- ReviewInfra integration questions (Path A vs Path B, AI Summary)
- Floating promo popup trigger logic (still open)

For everything else, propose a plan, get a thumbs-up, then execute.

---

## Story beat capture (important)

Every time you do something interesting — fix a non-obvious bug, choose between two approaches, or hit a specific edge case — log it in `docs/working-memory.md` under the relevant phase. The working memory doc is the source for content posts and interview narratives. A great moment that doesn't get logged is a great moment that disappears.
