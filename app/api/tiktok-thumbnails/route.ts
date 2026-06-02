import { NextRequest, NextResponse } from "next/server";

interface OEmbedResponse {
  thumbnail_url?: string;
}

function extractId(url: string): string {
  return (url.match(/\/video\/(\d+)/) ?? [])[1] ?? url;
}

async function fetchThumbnail(videoUrl: string): Promise<string> {
  const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return "";
    const data: OEmbedResponse = await res.json();
    return data.thumbnail_url ?? "";
  } catch {
    return "";
  }
}

export async function GET(req: NextRequest) {
  const rawUrls = req.nextUrl.searchParams.get("urls");
  if (!rawUrls) {
    return NextResponse.json({ error: "Missing urls param" }, { status: 400 });
  }

  const urls = rawUrls.split(",").map((u) => u.trim()).filter(Boolean);
  const results = await Promise.all(
    urls.map(async (url) => {
      const id = extractId(url);
      const thumbnail = await fetchThumbnail(url);
      return [id, thumbnail] as const;
    })
  );

  const thumbnails = Object.fromEntries(results);

  return NextResponse.json(thumbnails, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
  });
}
