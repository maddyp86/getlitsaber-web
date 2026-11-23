import { describe, expect, it } from "vitest";
import { offerForQty, quoteOffer, showsMsrpAnchor } from "./offers";
import { HOLIDAY_2026 } from "@/lib/campaign/holiday2026";

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
    expect(quoteOffer(1)).toEqual({ id: "single", qty: 1, price: 39.99, msrp: 49.99, anchorLabel: "MSRP", shipping: 5.99, discounted: false });
  });

  it("quotes the 2-pack at $79.98 against $99.98 MSRP, shipping free", () => {
    expect(quoteOffer(2)).toEqual({ id: "two_pack", qty: 2, price: 79.98, msrp: 99.98, anchorLabel: "MSRP", shipping: 0, discounted: false });
  });

  it("quotes custom quantities linearly with free shipping", () => {
    expect(quoteOffer(3)).toEqual({ id: "custom_qty", qty: 3, price: 119.97, msrp: 149.97, anchorLabel: "MSRP", shipping: 0, discounted: false });
  });

  it("hides the MSRP anchor if the live price is not below MSRP", () => {
    expect(showsMsrpAnchor(quoteOffer(1))).toBe(true);
    expect(showsMsrpAnchor(quoteOffer(1, 49.99))).toBe(false);
  });
});

// Holiday Sale 2026 (ADR-012). The regular quotes above must not move.
describe("quoteOffer during the holiday campaign", () => {
  it("keeps the single at $39.99 against $49.99 MSRP and ships it free", () => {
    expect(quoteOffer(1, 39.99, HOLIDAY_2026)).toEqual({
      id: "single", qty: 1, price: 39.99, msrp: 49.99, anchorLabel: "MSRP", shipping: 0, discounted: false,
    });
  });

  it("quotes the 2-pack at $69.99 against the campaign anchor $79.99, shipping free", () => {
    expect(quoteOffer(2, 39.99, HOLIDAY_2026)).toEqual({
      id: "two_pack", qty: 2, price: 69.99, msrp: 79.99, anchorLabel: "was", shipping: 0, discounted: true,
    });
  });

  it("takes the discount once, not per pair", () => {
    expect(quoteOffer(3, 39.99, HOLIDAY_2026).price).toBe(109.98);
    expect(quoteOffer(4, 39.99, HOLIDAY_2026).price).toBe(149.97);
  });
});
