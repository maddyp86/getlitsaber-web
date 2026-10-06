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
} from "./pricing";

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
