import { describe, expect, it } from "vitest";
import { mergeGallery } from "./useGalleryImages";
import { GALLERY_IMAGES } from "./productdisplay.content";
import { HOLIDAY_2026 } from "@/lib/campaign/holiday2026";

const base = ["a", "b", "c", "d"].map((n) => ({ src: n, alt: n }));
const names = (list: Array<{ src: string }>) => list.map((i) => i.src);

describe("mergeGallery", () => {
  it("returns the regular gallery when the campaign adds nothing", () => {
    expect(mergeGallery(base, [])).toBe(base);
  });

  it("puts a slotted image in that slot of the finished gallery", () => {
    const merged = mergeGallery(base, [
      { src: "x", alt: "x", slot: 3 },
      { src: "y", alt: "y", slot: 1 },
    ]);
    expect(names(merged)).toEqual(["y", "a", "x", "b", "c", "d"]);
  });

  it("puts images without a slot at the front, in order", () => {
    const merged = mergeGallery(base, [
      { src: "x", alt: "x" },
      { src: "y", alt: "y" },
    ]);
    expect(names(merged)).toEqual(["x", "y", "a", "b", "c", "d"]);
  });

  it("clamps a slot past the end and never mutates the regular gallery", () => {
    const merged = mergeGallery(base, [{ src: "x", alt: "x", slot: 99 }]);
    expect(names(merged)).toEqual(["a", "b", "c", "d", "x"]);
    expect(names(base)).toEqual(["a", "b", "c", "d"]);
  });
});

describe("holiday gallery order", () => {
  it("is sale image, hand-held photo, key features, then the light show in slot 6", () => {
    const merged = mergeGallery(GALLERY_IMAGES, HOLIDAY_2026.gallery);
    expect(merged[0].src).toMatch(/litsaber-holiday-deal\.jpg$/);
    expect(merged[1].src).toMatch(/litsaber-multi-handheld\.jpg$/);
    expect(merged[2].src).toMatch(/litsaber-key-features\.jpg$/);
    expect(merged[5].src).toMatch(/lightshow-pdp\.mp4$/);
    expect(merged[5].type).toBe("video");
  });
});
