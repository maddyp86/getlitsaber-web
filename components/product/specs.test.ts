import { describe, expect, it } from "vitest";
import { SPEC_PILLS } from "./specs.content";
import { SPEC_PILLS as HERO_SPEC_PILLS } from "@/components/home/hero.content";
import { SPEC_PILLS as PDP_SPEC_PILLS } from "./productdisplay.content";
import { ACCORDION_ITEMS } from "./accordion.content";

describe("spec pills", () => {
  it("are exactly the six locked pills, in order", () => {
    expect([...SPEC_PILLS]).toEqual([
      "41 LEDS",
      "10 COLORS",
      "3 MODES",
      "800 MAH",
      "ALUMINUM + BRASS BUILD",
      "WARRANTY INCLUDED",
    ]);
  });

  it("are shared by the hero and the PDP", () => {
    expect(HERO_SPEC_PILLS).toBe(SPEC_PILLS);
    expect(PDP_SPEC_PILLS).toBe(SPEC_PILLS);
  });

  it("leave USB-C and 510 thread to the Tech Specs, which still list them", () => {
    const pills = SPEC_PILLS.join(" ").toLowerCase();
    expect(pills).not.toContain("usb-c");
    expect(pills).not.toContain("510");

    const specs = JSON.stringify(ACCORDION_ITEMS.find((i) => i.id === "specs"));
    expect(specs).toContain("USB-C");
    expect(specs).toMatch(/510/);
  });
});
