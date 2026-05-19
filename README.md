# getlitsaber-web

The Litsaber storefront. Next.js 14 on Shopify, instrumented with a weekly AI agent for conversion analysis.

> Litsaber is a festival accessory that happens to hit 510 carts. This repo is the website that says so.

---

## What's in here

| File / dir | Purpose |
|------------|---------|
| `BRAND.md` | Voice, audience, repositioning thesis. The strategic spine. |
| `COMPONENTS.md` | Component inventory pulled from Figma, with intended behavior. |
| `CLAUDE.md` | Persistent context for Claude Code. Read on every dev session. |
| `tokens.json` | Design tokens (colors, type, spacing, radii). Source of truth. |
| `docs/working-memory.md` | Live log of the build, decisions, and story beats. |
| `docs/decisions/` | Architecture Decision Records — one markdown per major call. |
| `.env.example` | Template for environment variables. Real values live in Vercel. |

The app code itself doesn't exist yet — Phase 2 (Bolt scaffold) generates it.

---

## Setup (once Phase 2 is done)

```bash
pnpm install
cp .env.example .env.local
# Fill in real values from Vercel dashboard or 1Password
pnpm dev
```

Open `http://localhost:3000`.

---

## Environment variables

See `.env.example` for the full list. Required:

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `HUBSPOT_PORTAL_ID` (for newsletter signup form)

Never commit `.env.local`. Production secrets live in Vercel's dashboard.

---

## Deployment

- **Preview:** every PR auto-deploys to a Vercel preview URL
- **Production:** merging to `main` deploys to `getlitsaber.com`

---

## Working with this repo via Claude Code

1. Install Claude Code if you haven't: see Anthropic docs.
2. From the repo root: `claude` (or whatever your invocation is)
3. Claude Code automatically reads `CLAUDE.md` for conventions and constraints.
4. Ask for a plan before any non-trivial change. Approve the plan. Then let it execute.

---

## Phase status

- [x] **Phase 1:** Design tokens & repo foundation
- [ ] **Phase 2:** Scaffold with Bolt
- [ ] **Phase 3:** Claude Code audit & structural fixes
- [ ] **Phase 4:** Shopify integration
- [ ] **Phase 5:** Observability instrumentation
- [ ] **Phase 6:** Production agent
- [ ] **Phase 7:** Launch & first loop

Full phase log in `docs/working-memory.md`.

---

## License

Private. © 2026 Innovape Concepts.
