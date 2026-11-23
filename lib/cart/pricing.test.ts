import { describe, expect, it } from "vitest";
import {
  BASE_UNIT_PRICE,
  MAX_QTY,
  MSRP_UNIT_PRICE,
  PRICE_FLOOR,
  clampTotalToFloor,
  getDisplayUnitPrice,
  getLinePrice,
  getMsrpLinePrice,
  isBelowFloor,
  getAnchorLabel,
  getAnchorLinePrice,
  getCampaignDiscount,
} from "./pricing";
import { HOLIDAY_2026 } from "@/lib/campaign/holiday2026";

const cents = (n: number) => Math.round(n * 100);

describe("pricing constants", () => {
  it("sells at MAP $39.99 against a $49.99 MSRP", () => {
    expect(BASE_UNIT_PRICE).toBe(39.99);
    expect(MSRP_UNIT_PRICE).toBe(49.99);
    expect(PRICE_FLOOR).toBe(39.99);
  });
});

describe("per-unit price floor", () => {
  it("prices a single at $39.99", () => {
    expect(getLinePrice(1)).toBe(39.99);
  });

  it("prices the 2-pack at $79.98, never below 2 x $39.99", () => {
    expect(getLinePrice(2)).toBe(79.98);
  });

  it.each(Array.from({ length: MAX_QTY }, (_, i) => i + 1))(
    "custom quantity %i is exactly unit price x qty and never below the floor",
    (qty) => {
      const total = getLinePrice(qty);
      expect(cents(total)).toBe(cents(BASE_UNIT_PRICE) * qty);
      expect(cents(total)).toBeGreaterThanOrEqual(cents(PRICE_FLOOR) * qty);
      expect(isBelowFloor(total, qty)).toBe(false);
    }
  );

  it.each([0, 9.99, 29.99, 35, 39.98])(
    "raises a sub-floor live Shopify price of %s to the floor",
    (base) => {
      expect(getDisplayUnitPrice(base)).toBe(PRICE_FLOOR);
      for (let qty = 1; qty <= MAX_QTY; qty++) {
        expect(cents(getLinePrice(qty, base))).toBe(cents(PRICE_FLOOR) * qty);
      }
    }
  );

  it("passes a live price at or above the floor through unchanged", () => {
    expect(getDisplayUnitPrice(39.99)).toBe(39.99);
    expect(getDisplayUnitPrice(44.5)).toBe(44.5);
    expect(getLinePrice(2, 44.5)).toBe(89);
  });

  it("treats a non-numeric live price as the floor", () => {
    expect(getDisplayUnitPrice(Number.NaN)).toBe(PRICE_FLOOR);
  });

  it("clamps out-of-range quantities into 1..MAX_QTY", () => {
    expect(getLinePrice(0)).toBe(39.99);
    expect(getLinePrice(99)).toBe(getLinePrice(MAX_QTY));
  });
});

describe("Shopify total guard", () => {
  it("flags the old tier totals as below the floor at the new base", () => {
    // The retired fixed-amount tier discount on a 2-pack ($9.99 off) would
    // charge $69.99 at a $39.99 base. That must be caught.
    expect(isBelowFloor(69.99, 2)).toBe(true);
    expect(clampTotalToFloor(69.99, 2)).toBe(79.98);
  });

  it("accepts totals exactly at the floor despite float noise", () => {
    expect(isBelowFloor(39.99 * 2, 2)).toBe(false);
    expect(isBelowFloor(119.97, 3)).toBe(false);
    expect(clampTotalToFloor(119.97, 3)).toBe(119.97);
  });
});

describe("MSRP anchor", () => {
  it("is $49.99 for a single and $99.98 for two", () => {
    expect(getMsrpLinePrice(1)).toBe(49.99);
    expect(getMsrpLinePrice(2)).toBe(99.98);
  });
});

// Holiday Sale 2026 (ADR-012): the floor moves by the campaign discount on
// orders of two or more, and by nothing else. Every test above runs with no
// campaign and must keep passing unchanged.
describe("holiday campaign pricing", () => {
  it("is off by default", () => {
    expect(getCampaignDiscount(2)).toBe(0);
    expect(getLinePrice(2)).toBe(79.98);
  });

  it("leaves a single at $39.99 and never lets it go lower", () => {
    expect(getLinePrice(1, 39.99, HOLIDAY_2026)).toBe(39.99);
    expect(isBelowFloor(39.98, 1, HOLIDAY_2026)).toBe(true);
    expect(clampTotalToFloor(29.99, 1, HOLIDAY_2026)).toBe(39.99);
  });

  it("prices the 2-pack at $69.99", () => {
    expect(getLinePrice(2, 39.99, HOLIDAY_2026)).toBe(69.99);
    expect(isBelowFloor(69.99, 2, HOLIDAY_2026)).toBe(false);
  });

  it("still flags and clamps a 2-pack below $69.99", () => {
    expect(isBelowFloor(69.98, 2, HOLIDAY_2026)).toBe(true);
    expect(clampTotalToFloor(59.99, 2, HOLIDAY_2026)).toBe(69.99);
  });

  it("applies the discount once for 3 to 5 units", () => {
    expect(getLinePrice(3, 39.99, HOLIDAY_2026)).toBe(109.98);
    expect(getLinePrice(5, 39.99, HOLIDAY_2026)).toBe(189.96);
    expect(isBelowFloor(109.98, 3, HOLIDAY_2026)).toBe(false);
    expect(isBelowFloor(99.98, 3, HOLIDAY_2026)).toBe(true);
  });

  it("anchors a discounted line on its regular price, a single on MSRP", () => {
    expect(getAnchorLinePrice(1, HOLIDAY_2026)).toBe(49.99);
    expect(getAnchorLabel(1, HOLIDAY_2026)).toBe("MSRP");
    expect(getAnchorLinePrice(2, HOLIDAY_2026)).toBe(79.99);
    expect(getAnchorLabel(2, HOLIDAY_2026)).toBe("was");
    expect(getAnchorLinePrice(2, null)).toBe(99.98);
  });
});
