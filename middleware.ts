import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import { hubSpotProxyHeaders, hubSpotProxyUrl, isHubSpotPath } from "./lib/hubspotProxy";

const BYPASS_COOKIE = "ls-preview";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|maintenance|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$).*)",
    // HubSpot system and file paths, including images, CSS and JS, which the
    // pattern above skips by file extension.
    "/_hcms/:path*",
    "/hs/:path*",
    "/hs-fs/:path*",
    "/hubfs/:path*",
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // HubSpot system/file paths are reverse-proxied (lib/hubspotProxy.ts).
  // They are not affected by storefront maintenance mode.
  if (isHubSpotPath(url.pathname)) {
    return NextResponse.rewrite(hubSpotProxyUrl(url.pathname, url.search), {
      request: { headers: hubSpotProxyHeaders(req.headers, req.ip) },
    });
  }
  const bypassToken = process.env.MAINTENANCE_BYPASS_TOKEN;
  const queryToken = url.searchParams.get("preview");

  // Visiting any page with ?preview=TOKEN sets a cookie and lets you through.
  if (bypassToken && queryToken === bypassToken) {
    const res = NextResponse.next();
    res.cookies.set(BYPASS_COOKIE, bypassToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  // Already-bypassed visitors pass straight through.
  if (bypassToken && req.cookies.get(BYPASS_COOKIE)?.value === bypassToken) {
    return NextResponse.next();
  }

  // Read the flag. Fail open so a transient Edge Config error never takes the store down.
  let maintenance = false;
  try {
    maintenance = (await get("maintenanceMode")) === true;
  } catch {
    maintenance = false;
  }

  if (!maintenance) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-maintenance-mode", "1");
  const res = NextResponse.rewrite(new URL("/maintenance", req.url), {
    request: { headers: requestHeaders },
  });
  res.headers.set("Retry-After", "3600");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
