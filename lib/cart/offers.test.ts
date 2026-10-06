import { describe, expect, it } from "vitest";
import { offerForQty, quoteOffer, showsMsrpAnchor } from "./offers";

describe("offerForQty", () => {
  it("names the single, the 2-pack and the stepper path", () => {
    expect(offerForQty(1)).toBe("single");
    expect(offerForQty(2)).toBe("two_pack");
    expect(offerForQty(3)).toBe("custom_qty");
    expect(offerForQty(5)).toBe("custom_qty");
  });
});

describe("quoteOffer", () => {
  it("quotes the single at $39.99 against $49.99 MSRP, plus $5.99 shipping", () => {
    expect(quoteOffer(1)).toEqual({ id: "single", qty: 1, price: 39.99, msrp: 49.99, shipping: 5.99 });
  });

  it("quotes the 2-pack at $79.98 against $99.98 MSRP, shipping free", () => {
    expect(quoteOffer(2)).toEqual({ id: "two_pack", qty: 2, price: 79.98, msrp: 99.98, shipping: 0 });
  });

  it("quotes custom quantities linearly with free shipping", () => {
    expect(quoteOffer(3)).toEqual({ id: "custom_qty", qty: 3, price: 119.97, msrp: 149.97, shipping: 0 });
  });

  it("hides the MSRP anchor if the live price is not below MSRP", () => {
    expect(showsMsrpAnchor(quoteOffer(1))).toBe(true);
    expect(showsMsrpAnchor(quoteOffer(1, 49.99))).toBe(false);
  });
});
