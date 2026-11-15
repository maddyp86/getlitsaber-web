import { beforeEach, describe, expect, it } from "vitest";
import {
  appendParamsToUrl,
  landingParamsFrom,
  readLandingParams,
  rememberLandingParams,
} from "./landingParams";

const CHECKOUT = "https://checkout.getlitsaber.com/cn/abc123?key=k1";
const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => localStorage.clear());

describe("which parameters are carried", () => {
  it("keeps utm_* and fbclid, drops everything else", () => {
    expect(
      landingParamsFrom("?utm_source=facebook&utm_medium=paid_social&utm_campaign=launch&utm_content=v1&fbclid=XYZ&discount=LITFAM10&email=a%40b.com")
    ).toEqual({
      utm_source: "facebook",
      utm_medium: "paid_social",
      utm_campaign: "launch",
      utm_content: "v1",
      fbclid: "XYZ",
    });
    expect(landingParamsFrom("")).toEqual({});
    expect(landingParamsFrom("?utm_source=")).toEqual({});
  });
});

describe("remembering a landing", () => {
  it("stores the parameters and reads them back within 7 days", () => {
    rememberLandingParams("?utm_source=facebook&fbclid=XYZ", 1000);
    expect(readLandingParams(1000 + 6 * DAY)).toEqual({ utm_source: "facebook", fbclid: "XYZ" });
    expect(readLandingParams(1000 + 8 * DAY)).toEqual({});
  });

  it("a landing without parameters leaves the stored set alone", () => {
    rememberLandingParams("?utm_source=facebook", 1000);
    rememberLandingParams("", 2000);
    rememberLandingParams("?discount=LITFAM10", 3000);
    expect(readLandingParams(3000)).toEqual({ utm_source: "facebook" });
  });

  it("the latest landing with parameters wins", () => {
    rememberLandingParams("?utm_source=facebook&fbclid=A", 1000);
    rememberLandingParams("?utm_source=tiktok", 2000);
    expect(readLandingParams(2000)).toEqual({ utm_source: "tiktok" });
  });

  it("reads nothing when storage is empty or corrupt", () => {
    expect(readLandingParams()).toEqual({});
    localStorage.setItem("litsaber_landing_params", "{not json");
    expect(readLandingParams()).toEqual({});
  });
});

describe("appending to the checkout URL", () => {
  it("adds the parameters after the ones Shopify put there", () => {
    expect(appendParamsToUrl(CHECKOUT, { utm_source: "facebook", fbclid: "X Y" })).toBe(
      "https://checkout.getlitsaber.com/cn/abc123?key=k1&utm_source=facebook&fbclid=X+Y"
    );
  });

  it("does not override a parameter the URL already carries", () => {
    expect(appendParamsToUrl(`${CHECKOUT}&utm_source=shopify`, { utm_source: "facebook" })).toBe(
      `${CHECKOUT}&utm_source=shopify`
    );
  });

  it("returns the URL unchanged with nothing to add or an unparseable URL", () => {
    expect(appendParamsToUrl(CHECKOUT, {})).toBe(CHECKOUT);
    expect(appendParamsToUrl("not a url", { fbclid: "X" })).toBe("not a url");
  });
});
