# ADR-011: Blog Rendered by the Storefront from the HubSpot API

**Status:** Accepted (2026-10-24)
**Supersedes:** the /blog part of ADR-010 (reverse proxy)

## Context

ADR-010 served HubSpot's own blog pages at /blog through the middleware. The
pages loaded, but in HubSpot's default theme: no storefront Navbar or Footer,
no cart, no PostHog, a comments form, and no 21+ age gate (compliance-critical).
Copying the header and footer into a HubSpot template would create a second,
non-functional copy that drifts from the real components.

## Decision

Matt keeps writing posts in HubSpot (blog content group `415916821203`). The
storefront renders them itself:

- `lib/blog/hubspot.ts` reads posts from `cms/v3/blogs/posts` with a service
  key (`HUBSPOT_ACCESS_TOKEN`, `content` scope), cached 5 minutes.
- `lib/blog/posts.ts` holds the pure helpers (filtering to the content group,
  published state, slug mapping, body cleaning), unit tested.
- `/blog` and `/blog/[slug]` render inside the root layout, so the real
  Navbar, Footer, cart, analytics and age gate apply. Bodies are styled by the
  `.blog-prose` class in `globals.css`, built from tokens.
- Comments are not rendered. They should also be disabled in HubSpot.
- Drafts render only for visitors holding the existing `ls-preview` cookie
  (`?preview=<MAINTENANCE_BYPASS_TOKEN>`), marked noindex.
- The middleware now proxies only HubSpot's system and file paths (`/_hcms`,
  `/hs`, `/hs-fs`, `/hubfs`); `/blog` is no longer proxied.

## Consequences

- A post appears on the site up to 5 minutes after publishing.
- Without the token, /blog shows its empty state rather than erroring.
- HubSpot-only blog features (comments, subscription widgets, HubSpot themes)
  don't appear on the site.
