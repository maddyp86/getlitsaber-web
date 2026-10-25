/**
 * Reverse proxy for HubSpot system and file paths.
 *
 * Blog posts are authored in HubSpot (portal 244547358) and rendered by this
 * app at /blog (ADR-011). HubSpot's own paths below are still forwarded so
 * images and files referenced by post bodies, and HubSpot's domain checks,
 * resolve on www.getlitsaber.com. Every other path stays on this app.
 *
 * HubSpot reverse-proxy requirements (Settings > Domains & URLs, CDN off):
 * - Forward to the origin CNAME shown in HubSpot's domain settings.
 * - Send X-HS-Public-Host with the brand domain HubSpot expects.
 * - Send X-HubSpot-Trust-Forwarded-For: true plus X-Forwarded-For.
 */

export const HUBSPOT_PROXY_ORIGIN = "https://244547358.sites-proxy.hscoscdn-na2.net";

// Must be the exact domain connected in HubSpot (www included). HubSpot's
// verify screen suggested the bare brand domain, and its /_hcms/status check
// passes either way, but real pages 404 with "domain getlitsaber.com does not
// exist" unless this matches the connected domain.
export const HUBSPOT_PUBLIC_HOST = "www.getlitsaber.com";

// Path prefixes served by HubSpot: its status and diagnostics endpoints
// (/_hcms) and the paths it uses for files, images and form/tracking
// handlers. /blog is NOT proxied: the site renders posts itself from the
// HubSpot API inside the storefront layout (ADR-011).
export const HUBSPOT_PATH_PREFIXES = ["/_hcms", "/hs", "/hs-fs", "/hubfs"] as const;

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
