import { describe, expect, it } from "vitest";
import {
  SINGLE_UNIT_SHIPPING,
  SHIPPING_ATTRIBUTE_VALUE,
  getDisplayShipping,
  formatDisplayShipping,
} from "./shipping";

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
