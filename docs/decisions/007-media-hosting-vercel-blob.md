# ADR-007: Media Hosting — Vercel Blob as the Single Media Store

**Status:** Accepted and EXECUTED (2026-06-11; documents completed migration, not a forward plan)
**Related:** ADR-001 (tool stack), ADR-006 (one system per job), Phase 7 (cutover), Activate page video

## Context

All site images lived in `public/images/` in the repo. Videos for the Activate
page, the homepage hero, and the ThreeModes section did not exist anywhere yet
(every media slot was a `src: null` stub or a static placeholder). Two pressures
forced the decision before Phase 7:

1. **Videos cannot live in `public/`.** Repo bloat, no streaming optimization,
   raw MP4 delivery burning the Fast Data Transfer allowance.
2. **Operational constraint (stated by Matt, load-bearing):** images and videos
   must live in ONE system with one workflow. A two-vendor split (repo images
   plus an external video host like Cloudflare Stream) was evaluated and
   rejected on management overhead.

Clarification that shaped the decision: `public/` on Vercel IS already edge-CDN
delivery, and most images route through `next/image` (AVIF/WebP + resizing). So
the migration was NOT a performance rescue. It was (a) giving video a home,
(b) decoupling assets from the repo and from deploys, (c) doing both in one
system with no new vendor.

## Decision

**Vercel Blob is the single media store for all site media, images and video.**

- One public Blob store (`get-litsaber-blob`, store ID `store_0KU6ZB3BoVDlOwuq`,
  region SFO1) attached to the existing Vercel project. Served from the same
  Vercel CDN as the site. Zero new vendors.
- **Base URL:** `https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com`
  (no trailing slash). Stored in env var `NEXT_PUBLIC_MEDIA_BASE_URL`.
- **URL convention:** Blob pathnames mirror the old `public/` structure.
  `images/home/hero-lifestyle.jpg`, `videos/home/litsaber_mode.mp4`. Uploads use
  `addRandomSuffix: false` so pathnames are deterministic.
- **Single source of truth for the base URL.** `lib/media.ts` exposes
  `mediaUrl(p)` (builds `${BASE}/images/${p}`) and `videoUrl(p)` (builds
  `${BASE}/videos/${p}`). When the env var is absent both fall back to local
  `/images/` and `/videos/` paths. Components and content files never hardcode
  the Blob hostname. (Mirrors the no-inline-hex token rule.)
- **`next.config.mjs` `images.remotePatterns`** whitelists the Blob hostname so
  `next/image` (used in 36 files) can load remote images. This is mandatory, not
  optional: `next/image` hard-throws on any un-whitelisted remote host.
- **`public/` is reduced, not deleted.** Only `public/images/` migrated. Fonts
  (`next/font/local` needs build-time files), favicon, robots, sitemap, and OG
  metadata images correctly remain in `public/`.
- **Video compression standard (Blob is progressive download, not ABR):**
  H.264 MP4 (never `.mov`, which Chrome/Firefox reject), 1080p max, 2 to 4 Mbps,
  AAC or no audio, `+faststart`, target under 15MB per clip. Documented in
  CLAUDE.md. Long-form video (over ~2 min) would reopen this ADR.

## Migration executed (the reason this ADR documents reality)

- **Chunk A (store + upload):** `scripts/migrate-media.ts` walked `public/images/`,
  uploaded each file to Blob with matching pathnames, skipped dotfiles
  (`.DS_Store`), sequential uploads, one-year cache headers. Loaded
  `BLOB_READ_WRITE_TOKEN` from `.env.local` itself (tsx does not auto-load it).
  `tsconfig.json` got `scripts` added to `exclude` so the app build does not
  type-check the migration script.
- **Chunk B (repoint):** `lib/media.ts` created; `NEXT_PUBLIC_MEDIA_BASE_URL` set
  in three isolated places (Vercel dashboard Production+Preview+Development,
  local `.env.local`, AND Bolt's own env panel since Bolt's preview sandbox
  cannot read Vercel's vars); `remotePatterns` Blob hostname added; every
  `/images/` reference swept to `mediaUrl()`.
- **Chunk C (cleanup):** `public/images/` deleted (recoverable from git history
  per the earlier Bolt-wipe incident).
- **Chunk D (video):** hero, ThreeModes (3 clips), and Activate clips uploaded
  under `videos/`. Hero and ThreeModes wired; Activate sections in progress.

**Verified reality / deviations from the original plan:**
- The Blob dashboard DOES have a "New folder" UI (the API is flat key-value;
  the folder UI is a convenience that uploads into a named prefix). The earlier
  "no folders exist" framing was an API-level statement, not a dashboard one.
- Bolt reported the `next.config.mjs` edit as done when it had NOT applied it
  (caught by pulling the literal file). Required a second explicit pass.
- `ResponsiveImage` is a raw `<img>` inside `<picture>` (no optimization), but it
  is the EXCEPTION. The site is overwhelmingly `next/image` (36 files), so
  `remotePatterns` is load-bearing and most images ARE optimized.

## Consequences

**Positive**
- One store, one CDN, one workflow. Stated constraint met with zero new vendors.
- Assets decouple from deploys: a media swap is an upload plus a content-file
  edit, no commit for the asset itself.
- The repo shed its binary weight; the two-write-paths incident class loses its
  blast radius.

**Negative**
- No adaptive bitrate for video. Mitigated by the compression standard and short
  clip length; reopened if long-form video ships.
- Blob storage and transfer are metered. Hobby caps: 1GB storage, 10GB transfer
  per month. Images are trivial; video transfer is the thing to watch, and is
  another reason Pro is required at the Phase 7 commercial cutover.
- `NEXT_PUBLIC_MEDIA_BASE_URL` now lives in THREE environments (Vercel, local,
  Bolt) with no auto-sync. Adding it anywhere means adding it in all three.

## Alternatives rejected

- **Status quo images + Cloudflare Stream for video.** Best raw video delivery
  (ABR), but two systems, two workflows. Fails the one-home constraint.
- **Supabase Storage.** Second origin, paid transforms, egress bill, and it
  violates ADR-006 one-system-per-job (Supabase is the agent's data surface).
- **Cloudinary.** The true unified media library (image + video + ABR + UI), but
  a new vendor with credit-based pricing and more capability than the inventory
  justifies. Upgrade path stays open: Blob to Cloudinary later is re-upload plus
  changing `NEXT_PUBLIC_MEDIA_BASE_URL` plus content-file URL swaps.

## Open items

- [ ] Finish the Activate media sweep (video height-constraint bug) across all
      remaining sections, then extract a shared `<ActivateMedia>` primitive.
- [ ] Confirm OG/metadata images stayed in `public/` (recommended).
- [ ] At Phase 7: confirm Pro plan active before real traffic (commercial use +
      lifts the 10GB transfer cap that video will pressure).