const BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/$/, "");

export function mediaUrl(p: string): string {
  const clean = p.replace(/^\//, "");
  if (!BASE) return `/images/${clean}`;
  return `${BASE}/images/${clean}`;
}

export function videoUrl(p: string): string {
  const clean = p.replace(/^\//, "");
  if (!BASE) return `/videos/${clean}`;
  return `${BASE}/videos/${clean}`;
}
