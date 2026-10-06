import { beforeEach, describe, expect, it } from "vitest";
import {
  activationSource,
  applyAttributionRules,
  isInternalReferrer,
  scrubUrl,
  touchFromLanding,
  type Touch,
} from "./attribution";

const touch: Touch = {
  referrer: "https://www.tiktok.com/",
  referring_domain: "www.tiktok.com",
  utm_source: "tiktok",
  utm_medium: "social",
  utm_campaign: "launch",
  at: 0,
};

beforeEach(() => sessionStorage.clear());

describe("one site: storefront and checkout", () => {
  it("treats our own domains and Shopify checkout hops as internal", () => {
    expect(isInternalReferrer("https://checkout.getlitsaber.com/checkouts/cn/abc")).toBe(true);
    expect(isInternalReferrer("https://getlitsaber.com/shop/litsaber-og")).toBe(true);
    expect(isInternalReferrer("https://www.getlitsaber.com/")).toBe(true);
    expect(isInternalReferrer("https://shop.app/")).toBe(true);
    expect(isInternalReferrer("https://www.tiktok.com/")).toBe(false);
    expect(isInternalReferrer("https://notgetlitsaber.com/")).toBe(false);
    expect(isInternalReferrer("")).toBe(false);
  });

  it("a return from checkout carries the original source instead of a new referral", () => {
    const e = applyAttributionRules(
      { event: "$pageview", properties: { $referrer: "https://checkout.getlitsaber.com/x", $referring_domain: "checkout.getlitsaber.com" } },
      "/",
      touch
    );
    expect(e.properties?.$referrer).toBe("https://www.tiktok.com/");
    expect(e.properties?.$referring_domain).toBe("www.tiktok.com");
    expect(e.properties?.utm_source).toBe("tiktok");
  });

  it("with no stored source, a return from checkout reads as direct", () => {
    const e = applyAttributionRules(
      { event: "$pageview", properties: { $referrer: "https://checkout.getlitsaber.com/x", $referring_domain: "checkout.getlitsaber.com" }, $set_once: { $initial_referrer: "https://checkout.getlitsaber.com/x" } },
      "/",
      null
    );
    expect(e.properties?.$referring_domain).toBe("$direct");
    expect(e.$set_once?.$initial_referrer).toBe("$direct");
  });

  it("leaves an external referrer alone", () => {
    const e = applyAttributionRules({ event: "$pageview", properties: { $referrer: "https://www.google.com/", $referring_domain: "www.google.com" } }, "/", touch);
    expect(e.properties?.$referring_domain).toBe("www.google.com");
  });

  it("only an external landing or UTMs become the stored touch", () => {
    expect(touchFromLanding("", "https://checkout.getlitsaber.com/x", 1)).toBeNull();
    expect(touchFromLanding("", "", 1)).toBeNull();
    expect(touchFromLanding("?utm_source=hs_automation&utm_medium=email", "", 1)?.utm_source).toBe("hs_automation");
    expect(touchFromLanding("", "https://www.instagram.com/", 1)?.referring_domain).toBe("www.instagram.com");
  });
});

describe("no personal data in URLs", () => {
  it("strips email, name and phone parameters and any email-shaped value", () => {
    const out = scrubUrl("https://getlitsaber.com/?utm_source=hs&email=a%40b.com&first_name=Al&phone=555&x=c%40d.io&ok=1");
    expect(out).toBe("https://getlitsaber.com/?utm_source=hs&ok=1");
  });

  it("leaves clean URLs untouched", () => {
    expect(scrubUrl("https://getlitsaber.com/shop/litsaber-og?utm_source=tiktok")).toBe(
      "https://getlitsaber.com/shop/litsaber-og?utm_source=tiktok"
    );
  });

  it("is applied to event and person URL properties", () => {
    const e = applyAttributionRules(
      {
        event: "$pageview",
        properties: { $current_url: "https://getlitsaber.com/?email=a%40b.com" },
        $set_once: { $initial_current_url: "https://getlitsaber.com/?email=a%40b.com" },
      },
      "/",
      null
    );
    expect(e.properties?.$current_url).toBe("https://getlitsaber.com/");
    expect(e.$set_once?.$initial_current_url).toBe("https://getlitsaber.com/");
  });
});

describe("owner visits", () => {
  it("marks the activation visit and the rest of that session", () => {
    expect(applyAttributionRules({ event: "$pageview" }, "/", null).properties?.is_owner_visit).toBeUndefined();
    expect(applyAttributionRules({ event: "$pageview" }, "/activate", null).properties?.is_owner_visit).toBe(true);
    expect(applyAttributionRules({ event: "product_viewed" }, "/shop/litsaber-og", null).properties?.is_owner_visit).toBe(true);
  });

  it("classifies the printed QR codes in circulation", () => {
    expect(activationSource("?utm_source=packaging&utm_medium=qr&utm_campaign=activation_insert")).toBe("packaging_qr");
    expect(activationSource("?utm_source=insert&utm_medium=qr&utm_campaign=activation")).toBe("insert_qr");
    expect(activationSource("")).toBe("direct");
  });
});
