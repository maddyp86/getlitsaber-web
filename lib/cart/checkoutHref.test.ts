import { beforeEach, describe, expect, it } from "vitest";
import { buildCheckoutHref } from "./checkoutHref";
import { rememberLandingParams } from "@/lib/analytics/landingParams";

const CHECKOUT = "https://checkout.getlitsaber.com/cn/abc123?key=k1";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("the checkout href", () => {
  it("is the Shopify URL as is when nothing was captured", () => {
    expect(buildCheckoutHref(CHECKOUT)).toBe(CHECKOUT);
  });

  it("carries the affiliate code and the landing utm_* / fbclid together", () => {
    sessionStorage.setItem("litsaber_discount", "LITFAM10");
    rememberLandingParams("?utm_source=facebook&utm_medium=paid_social&fbclid=XYZ");
    expect(buildCheckoutHref(CHECKOUT)).toBe(
      `${CHECKOUT}&discount=LITFAM10&utm_source=facebook&utm_medium=paid_social&fbclid=XYZ`
    );
  });
});
