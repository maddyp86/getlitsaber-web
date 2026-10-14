import { describe, expect, it } from "vitest";
import { ACCORDION_ITEMS } from "./accordion.content";

describe("PDP dropdowns", () => {
  it("has What's in the Box right after Tech Specs, before the policy tabs", () => {
    expect(ACCORDION_ITEMS.map((i) => i.id)).toEqual(["features", "specs", "in-the-box", "returns", "shipping", "warranty"]);
  });

  it("lists exactly the box contents and says there is no cable", () => {
    const box = ACCORDION_ITEMS.find((i) => i.id === "in-the-box")!;
    expect(box.title).toBe("What's in the Box");
    expect(box.body).toEqual({
      type: "prose",
      blocks: [
        { bullets: ["Litsaber OG", "Quick start guide", "QR code to the activation page"] },
        { lead: "No charging cable.", text: "Any USB-C cable works, so use one you already have." },
      ],
    });
  });
});
