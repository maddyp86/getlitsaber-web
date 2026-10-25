/**
 * Reverse proxy for the HubSpot-hosted blog.
 *
 * The blog lives in HubSpot (portal 244547358) but is served from
 * www.getlitsaber.com/blog so it counts as our own domain for SEO and AI
 * search. The middleware forwards the paths below to HubSpot's proxy origin;
 * every other path stays on this Next.js app.
 *
 * HubSpot reverse-proxy requirements (Settings > Domains & URLs, CDN off):
 * - Forward to the origin CNAME shown in HubSpot's domain settings.
 * - Send X-HS-Public-Host with the brand domain HubSpot expects.
 * - Send X-HubSpot-Trust-Forwarded-For: true plus X-Forwarded-For.
 */

export const HUBSPOT_PROXY_ORIGIN = "https://244547358.sites-proxy.hscoscdn-na2.net";

// The value HubSpot's "Verify reverse proxy connection" check asks for.
export const HUBSPOT_PUBLIC_HOST = "getlitsaber.com";

// Path prefixes served by HubSpot: the blog itself, HubSpot's status and
// diagnostics endpoints (/_hcms), and the paths HubSpot uses for blog images,
// files and form/tracking handlers.
export const HUBSPOT_PATH_PREFIXES = ["/blog", "/_hcms", "/hs", "/hs-fs", "/hubfs"] as const;

/** True when the path belongs to HubSpot (exact prefix or prefix + "/"). */
export function isHubSpotPath(pathname: string): boolean {
  return HUBSPOT_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Full HubSpot origin URL for a proxied request, keeping path and query. */
export function hubSpotProxyUrl(pathname: string, search: string): URL {
  return new URL(`${pathname}${search}`, HUBSPOT_PROXY_ORIGIN);
}

/** Request headers HubSpot requires on proxied traffic. */
export function hubSpotProxyHeaders(incoming: Headers, clientIp: string | undefined): Headers {
  const headers = new Headers(incoming);
  headers.set("X-HS-Public-Host", HUBSPOT_PUBLIC_HOST);
  headers.set("X-HubSpot-Trust-Forwarded-For", "true");
  const ip = clientIp ?? incoming.get("x-real-ip") ?? incoming.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) headers.set("X-Forwarded-For", ip);
  return headers;
}
