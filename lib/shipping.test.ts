import { describe, expect, it } from "vitest";
import {
  SINGLE_UNIT_SHIPPING,
  SHIPPING_ATTRIBUTE_VALUE,
  getDisplayShipping,
  formatDisplayShipping,
  shippingAttributeValue,
} from "./shipping";
import { HOLIDAY_2026 } from "@/lib/campaign/holiday2026";

describe("shipping rules", () => {
  it("charges $5.99 flat for a single unit", () => {
    expect(SINGLE_UNIT_SHIPPING).toBe(5.99);
    expect(getDisplayShipping(1)).toBe(5.99);
    expect(formatDisplayShipping(getDisplayShipping(1))).toBe("$5.99");
  });

  it.each([2, 3, 4, 5, 12])("ships %i units free", (units) => {
    expect(getDisplayShipping(units)).toBe(0);
    expect(formatDisplayShipping(getDisplayShipping(units))).toBe("FREE");
  });

  it("defers to checkout when the unit count is unknown", () => {
    expect(getDisplayShipping(undefined)).toBeNull();
    expect(formatDisplayShipping(null)).toBe("Calculated at checkout");
  });

  it("stamps carts with the value the delivery Function charges singles on", () => {
    expect(SHIPPING_ATTRIBUTE_VALUE).toBe("surcharge");
  });
});

describe("shipping during the holiday campaign", () => {
  it.each([1, 2, 5])("ships %i units free", (units) => {
    expect(getDisplayShipping(units, HOLIDAY_2026)).toBe(0);
  });

  it("stamps a value the delivery Function does not surcharge", () => {
    expect(shippingAttributeValue(HOLIDAY_2026)).toBe("holiday-free");
    expect(shippingAttributeValue(HOLIDAY_2026)).not.toBe(SHIPPING_ATTRIBUTE_VALUE);
  });

  it("goes back to the surcharge stamp with no campaign", () => {
    expect(shippingAttributeValue(null)).toBe("surcharge");
    expect(getDisplayShipping(1, null)).toBe(5.99);
  });
});
