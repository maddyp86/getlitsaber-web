import { describe, expect, it } from "vitest";
import {
  HUBSPOT_PUBLIC_HOST,
  hubSpotProxyHeaders,
  hubSpotProxyUrl,
  isHubSpotPath,
} from "./hubspotProxy";

describe("isHubSpotPath", () => {
  it("matches the blog and HubSpot system paths", () => {
    for (const p of [
      "/blog",
      "/blog/",
      "/blog/cannabis-accessory-gifts-under-50",
      "/_hcms/status",
      "/hs-fs/hubfs/gift.png",
      "/hubfs/gift.png",
      "/hs/hsstatic/x.js",
    ]) {
      expect(isHubSpotPath(p), p).toBe(true);
    }
  });

  it("leaves storefront paths alone, including look-alike prefixes", () => {
    for (const p of ["/", "/shop/litsaber-og", "/blogger", "/hsx", "/hubfsx", "/the-tech", "/api/blog"]) {
      expect(isHubSpotPath(p), p).toBe(false);
    }
  });
});

describe("hubSpotProxyUrl", () => {
  it("keeps the path and query string", () => {
    expect(hubSpotProxyUrl("/blog/post", "?utm_source=x").toString()).toBe(
      "https://244547358.sites-proxy.hscoscdn-na2.net/blog/post?utm_source=x",
    );
  });
});

describe("hubSpotProxyHeaders", () => {
  it("adds the headers HubSpot requires and keeps the originals", () => {
    const h = hubSpotProxyHeaders(new Headers({ "user-agent": "test" }), "203.0.113.7");
    expect(h.get("X-HS-Public-Host")).toBe(HUBSPOT_PUBLIC_HOST);
    expect(h.get("X-HubSpot-Trust-Forwarded-For")).toBe("true");
    expect(h.get("X-Forwarded-For")).toBe("203.0.113.7");
    expect(h.get("user-agent")).toBe("test");
  });

  it("falls back to the first forwarded IP when no client IP is given", () => {
    const h = hubSpotProxyHeaders(new Headers({ "x-forwarded-for": "198.51.100.2, 10.0.0.1" }), undefined);
    expect(h.get("X-Forwarded-For")).toBe("198.51.100.2");
  });
});
