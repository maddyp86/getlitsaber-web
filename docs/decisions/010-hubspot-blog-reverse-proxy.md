# ADR-010: HubSpot Blog Served at /blog via Reverse Proxy

**Status:** Accepted (2026-10-24)
**Related:** HubSpot AEO trial playbook (Oct 2026)

## Context

The blog is part of the AEO/SEO push: AI answer engines mostly cite brand
sites, and HubSpot AEO counts citations of getlitsaber.com. Matt chose to write
and host the blog in HubSpot (portal 244547358). The storefront stays on this
Next.js app on Vercel, so HubSpot cannot own the domain.

Options: a subdomain (blog.getlitsaber.com, plain DNS CNAME) or a subdirectory
(www.getlitsaber.com/blog, reverse proxy). Matt chose the subdirectory so posts
sit on the main domain.

## Decision

`middleware.ts` rewrites `/blog`, `/_hcms`, `/hs`, `/hs-fs` and `/hubfs` to
HubSpot's proxy origin (`244547358.sites-proxy.hscoscdn-na2.net`) with the
headers HubSpot requires: `X-HS-Public-Host: www.getlitsaber.com` (the exact connected domain; the bare domain passes `/_hcms/status` but 404s real pages),
`X-HubSpot-Trust-Forwarded-For: true` and `X-Forwarded-For`. Logic and tests
live in `lib/hubspotProxy.ts`. All other paths are untouched.

HubSpot side: www.getlitsaber.com connected with HubSpot's CDN switched off.
Namecheap got two add-only verification records (`_cf-custom-hostname.www`
TXT and `_acme-challenge.www` CNAME); the www and apex records still point at
Vercel.

## Consequences

- HubSpot support does not cover reverse proxy setups.
- HubSpot pages are not in this app's sitemap; add the blog sitemap or posts.
- **The 21+ age gate does not run on HubSpot pages.** The blog template must
  carry its own age gate before any post is published (compliance-critical).
- Proxied paths bypass storefront maintenance mode.
- HubSpot marketing-email tracking links on this domain would need their
  paths proxied too if HubSpot email is adopted.
