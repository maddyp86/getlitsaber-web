# ADR-007: Media Hosting — Vercel Blob as the Single Media Store

**Status:** Accepted (2026-06-11)
**Related:** ADR-001 (tool stack), ADR-006 (one system per job), Phase 7 (cutover), Activate page video stubs

## Context

All site images live in `public/images/` in the repo. Videos for the Activate
page do not exist anywhere yet — every media slot is a `src: null` stub awaiting
a hosting decision. Two pressures forced the decision now, before Phase 7:

1. **Videos cannot live in `public/`.** Repo bloat, no streaming optimization,
   and raw MP4 delivery against the Fast Data Transfer allowance.
2. **Operational constraint (stated, load-bearing):** images and videos must
   live in ONE system with one workflow. A two-vendor split (repo images +
   external video host) was evaluated and rejected on management overhead.

Clarification that shaped the decision: `public/` on Vercel IS edge-CDN
delivery. The migration is not a performance rescue — it is (a) giving video a
home, (b) decoupling assets from the repo and from deploys, (c) doing both in
one system.

## Decision

**Vercel Blob is the single media store for all site media — images and video.**

- One Blob store attached to the existing Vercel project. Assets served from
  the same Vercel CDN as the site. Zero new vendors, credentials, or dashboards.
- **URL convention:** Blob pathnames mirror the old `public/` structure —
  `images/home/hero-lifestyle.png`, `videos/activate/power-on.mp4`. Uploads use
  `addRandomSuffix: false` so pathnames are deterministic and human-readable.
- **Filenames are immutable.** A changed asset gets a NEW filename (e.g.
  `-v2`), never an overwrite. This allows aggressive cache headers
  (`cacheControlMaxAge: 31536000`, one year) with no invalidation problem.
  Same principle as the tokens system: the name IS the version.
- **Single source of truth for the base URL.** A `lib/media.ts` helper —
  `mediaUrl("home/hero-lifestyle.png")` / `videoUrl("activate/power-on.mp4")` —
  reads `NEXT_PUBLIC_MEDIA_BASE_URL` from env. Content files and components
  never hardcode the Blob hostname. (Mirrors the no-inline-hex rule.)
- **`next.config` `images.remotePatterns`** whitelists the Blob hostname so
  `next/image` optimization continues to apply to remote images.
- **`public/` is not deleted — it is reduced.** Fonts (`next/font/local`
  requires build-time files — Stellar stays), favicon, robots/sitemap, and any
  OG/metadata images remain in `public/`. Only `public/images/` migrates.
- **Video compression standard (replaces adaptive bitrate):** Blob is
  progressive download, not ABR streaming. Acceptable because the video
  library is short demo clips (15–30s). Standard, enforced before upload:
  H.264 MP4, 1080p max, 2–4 Mbps target bitrate, AAC audio (or none),
  `+faststart` (moov atom at front so playback starts before full download).
  HandBrake preset documented in CLAUDE.md. Target file size: under 15MB per
  clip. Long-form video (over ~2 min) would reopen this ADR.

## Migration plan (chunked, one commit each)

**Chunk A — store + upload (no site changes, zero risk).**
1. Vercel dashboard → Storage → Create → Blob → attach to the project.
   `BLOB_READ_WRITE_TOKEN` is injected into the project env automatically;
   `vercel env pull` to get it locally.
2. Builder writes `scripts/migrate-media.ts`: walks `public/images/**`,
   uploads each file via `@vercel/blob` `put()` with the same relative
   pathname, `access: 'public'`, `addRandomSuffix: false`,
   `cacheControlMaxAge: 31536000`. Logs old path → new URL. Idempotent
   (re-run safe via `allowOverwrite: true` during migration only).
3. Matt runs it locally (`npx tsx scripts/migrate-media.ts`). Verify a sample
   of URLs resolve. Site untouched; `public/images/` still serving.

**Chunk B — repoint the site.**
1. Add `lib/media.ts` (`mediaUrl`, `videoUrl`) + `NEXT_PUBLIC_MEDIA_BASE_URL`
   env var (set in Vercel + `.env.example` placeholder).
2. Add Blob hostname to `images.remotePatterns` in `next.config`.
3. Sweep all image references — content files and any component with a
   hardcoded `/images/...` path — to the `mediaUrl()` helper.
4. **Bundled verification item:** while touching every image call site,
   confirm whether `ResponsiveImage` renders via `next/image` or raw `<img>`
   inside `<picture>` (open item from Phase 5 discussion). Raw `<img>` means
   no AVIF/resizing; `next/image` means transformations are metered. Log the
   answer; decide per-component only if a problem surfaces.
5. Verify on the Vercel preview deploy: every page, both breakpoints,
   hero `priority` image still LCP-clean. `public/images/` stays in place as
   the rollback during this chunk.

**Chunk C — cleanup.**
1. Delete `public/images/` (fonts, favicon, robots stay). One commit.
2. Recovery note: assets remain in git history (cf. the Bolt wipe incident —
   `git checkout <commit> -- public/` restores everything).

**Chunk D — video (when content exists).** Compress per the standard, upload
to `videos/activate/`, swap the `src: null` stubs in the Activate content
files via `videoUrl()`. Content-file-only edits, as designed.

## Consequences

**Positive**
- One store, one CDN, one workflow — the stated constraint is met with the
  minimum new surface (zero new vendors).
- Assets decouple from deploys: a media swap is an upload + content-file edit,
  no commit required for the asset itself.
- The repo sheds its binary weight; the two-write-paths class of incident
  (the Bolt image wipe) loses its blast radius.
- Rides on the Pro plan already required at cutover for commercial use
  (1TB Fast Data Transfer; a 10MB clip survives ~100k plays/month).

**Negative**
- No adaptive bitrate for video. Mitigated by the compression standard and
  clip length; reopened if long-form video ships.
- Blob storage + transfer are metered. Hobby includes 1GB storage —
  fine for images, watch it once videos upload; Pro at cutover lifts it.
- One more env var (`NEXT_PUBLIC_MEDIA_BASE_URL`) and one migration sweep
  touching every image call site — bounded by the helper pattern.

**Neutral**
- `next/image` transformation metering is unchanged by this move (remote
  images optimize the same as local). The ResponsiveImage verification
  (Chunk B.4) answers whether metering applies at all.

## Alternatives rejected

- **Status quo (images in repo) + Cloudflare Stream for video.** Best raw
  video delivery (ABR, $5/1,000 min stored + $1/1,000 min viewed), but two
  systems, two workflows — fails the stated operational constraint.
- **Supabase Storage.** Second origin, paid image transforms, egress bill,
  and it violates ADR-006's one-system-per-job: Supabase is the agent's data
  surface, not a media CDN.
- **Cloudinary.** The true unified media library (image + video + ABR + UI),
  but a new vendor, credit-based pricing, and more capability than the asset
  inventory justifies. The upgrade path stays open: Blob → Cloudinary later is
  re-upload + change `NEXT_PUBLIC_MEDIA_BASE_URL` + content-file URL swaps.

## Open items

- [ ] Measure `public/images/` total size before upload (Hobby 1GB Blob cap)
- [ ] Chunk B.4: ResponsiveImage `next/image` vs raw `<img>` — log the answer
- [ ] Add HandBrake preset + compression standard to CLAUDE.md
- [ ] Confirm OG/metadata images: keep in `public/` (recommended) or migrate
- [ ] At Phase 7: confirm Pro plan active before real traffic (commercial use)
