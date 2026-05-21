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

- **Bolt** generates code and pushes to GitHub during Phase 2. Bolt is done after Phase 2.
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
- Mobile homepage: `3760:5314`, `3760:8705`
- Desktop PDP: `3367:320`
- Mobile PDP: `3760:5949`, `3760:9139`
- Other page nodes listed in `COMPONENTS.md`

---

## Asset convention

All static visual assets live under `public/` with a category-based folder structure:

```
public/
└── images/
    ├── hero/         # Homepage hero, page hero backgrounds
    ├── product/      # Product renders, exploded views, color variants
    ├── venues/       # Festivals / Raves / House Parties / Events
    ├── reviews/      # Customer photos from reviews
    ├── about/        # Founder photos, behind-the-scenes
    ├── activate/     # Product-in-use shots for the Activate page
    └── icons/        # Custom icons not covered by inline SVG
```

**Rules:**
- Image filenames are lowercase, hyphenated: `hero-main.jpg`, not `Hero Main.JPG`
- Prefer WebP for photos, SVG for icons/logos, MP4 for video
- Always render via `next/image` with explicit `width` and `height` props (no layout shift)
- Always provide meaningful `alt` text — never `alt=""` unless the image is purely decorative
- If an asset doesn't exist yet, reference its intended path (e.g., `/images/hero/hero-main.jpg`) and add `{/* TODO: replace placeholder */}` above the `<Image>` tag
- Do NOT invent asset filenames not in this convention. Do NOT download images from Figma during a build pass — asset replacement is a deliberate, separate pass after layout is locked.

**Where assets live in production:**
- During Phase 2/3: assets live in `public/` and ship with the repo
- Phase 6/7 migration: large assets (real product photography, video) move to Vercel Blob storage; references in code update from `/images/...` to `https://blob.vercel-storage.com/...`. This keeps the repo lean and the CDN clean.

**Video specifically:**
- Never commit video files to the repo (`.mp4`, `.mov`, `.webm`). Even short clips bloat Git history permanently.
- Phase 2/3 video placeholder: render a `<VideoPlaceholder />` component (static thumbnail + play icon overlay) referencing an asset path that doesn't exist yet. Add a TODO.
- Phase 5+ migration to a real video host (Vercel Blob for small files, Mux for product videos, or Cloudflare Stream as an alternative).

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

- **Bundle SKU strategy:** Quantity-based discount on the single Litsaber OG SKU. 2-Pack is *not* a separate Shopify product. Implementation: select bundle → cart adds 2× the single SKU + applies discount. Simpler Shopify config, single inventory pool.
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
