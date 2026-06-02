import TikTokRail, { TikTokVideo } from "./TikTokRail";

const VIDEO_URLS = [
  "https://www.tiktok.com/@getlitsaber/video/7578956594189274399",
  "https://www.tiktok.com/@getlitsaber/video/7561515341424135454",
  "https://www.tiktok.com/@getlitsaber/video/7599752282464455967",
  "https://www.tiktok.com/@getlitsaber/video/7581564990033890590",
  "https://www.tiktok.com/@getlitsaber/video/7630952753501703455",
  "https://www.tiktok.com/@getlitsaber/video/7613414053091839262",
];

function extractId(url: string): string {
  return (url.match(/\/video\/(\d+)/) ?? [])[1] ?? url;
}

async function fetchThumbnails(urls: string[]): Promise<Record<string, string>> {
  const results = await Promise.all(
    urls.map(async (url) => {
      const id = extractId(url);
      try {
        const res = await fetch(
          `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
          { next: { revalidate: 86400 } }
        );
        if (!res.ok) return [id, ""] as const;
        const data = (await res.json()) as { thumbnail_url?: string };
        return [id, data.thumbnail_url ?? ""] as const;
      } catch {
        return [id, ""] as const;
      }
    })
  );
  return Object.fromEntries(results);
}

export default async function WhatCustomersSay() {
  const thumbnails = await fetchThumbnails(VIDEO_URLS);

  const videos: TikTokVideo[] = VIDEO_URLS.map((url) => ({
    url,
    thumbnail: thumbnails[extractId(url)] ?? "",
  }));

  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "96px 0 110px",
        background:
          "radial-gradient(120% 90% at 50% -10%, rgba(0,229,255,0.10), transparent 55%), #04070d",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center px-container-mobile lg:px-container mb-14">
        <span
          className="font-label text-eyebrow uppercase tracking-widest text-accent-cyan"
          style={{ textShadow: "0 0 14px rgba(0,229,255,0.55)" }}
        >
          REVIEWS
        </span>
        <h2
          className="font-display uppercase text-text-primary leading-tight"
          style={{
            fontWeight: 800,
            fontSize: "clamp(34px, 5.5vw, 62px)",
            letterSpacing: "0.04em",
            textShadow: "0 0 28px rgba(0,229,255,0.40), 0 0 60px rgba(0,229,255,0.18)",
          }}
        >
          WHAT CUSTOMERS SAY
        </h2>
        <p className="font-body text-body text-text-muted">The internet is talking.</p>
      </div>

      <TikTokRail videos={videos} />
    </section>
  );
}
