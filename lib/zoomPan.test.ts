import { describe, expect, it } from "vitest";
import { dragOrigin, handoffView, MAX_ZOOM, MIN_ZOOM, pinchOrigin, pinchScale } from "./zoomPan";

const ZOOM = 2.5;
const at = (x: number, y: number) => ({ x, y });

describe("drag to pan a zoomed photo", () => {
  it("keeps the point under the finger under the finger", () => {
    // 300px frame, origin at 50%: the photo point at frame x=150 is on
    // screen at 150. Drag 30px right; that point must now be at 180.
    const o = dragOrigin(at(50, 50), 30, 0, 300, 300, ZOOM);
    const originPx = (o.x / 100) * 300;
    const screenX = originPx + ZOOM * (150 - originPx);
    expect(screenX).toBeCloseTo(180);
  });

  it("moves the view the way the finger moves (drag right shows more of the left)", () => {
    expect(dragOrigin(at(50, 50), 40, 0, 300, 300, ZOOM).x).toBeLessThan(50);
    expect(dragOrigin(at(50, 50), 0, -40, 300, 300, ZOOM).y).toBeGreaterThan(50);
  });

  it("a finger at rest does not move the photo, wherever it landed", () => {
    expect(dragOrigin(at(20, 70), 0, 0, 300, 300, ZOOM)).toEqual(at(20, 70));
  });

  it("stops at the photo's edges", () => {
    expect(dragOrigin(at(10, 90), 900, -900, 300, 300, ZOOM)).toEqual(at(0, 100));
  });

  it("is a no-op when not zoomed or the frame has no size", () => {
    expect(dragOrigin(at(30, 30), 50, 50, 300, 300, 1)).toEqual(at(30, 30));
    expect(dragOrigin(at(30, 30), 50, 50, 0, 300, ZOOM)).toEqual(at(30, 30));
  });
});

// Where a photo point (px in the unzoomed frame) lands on screen.
const screen = (p: number, origin: number, size: number, scale: number) => {
  const o = (origin / 100) * size;
  return o + scale * (p - o);
};

describe("pinch to zoom", () => {
  it("scales with the distance between the fingers, within limits", () => {
    expect(pinchScale(1, 100, 200)).toBeCloseTo(2);
    expect(pinchScale(2, 100, 150)).toBeCloseTo(3);
    expect(pinchScale(1, 100, 1000)).toBe(MAX_ZOOM);
    expect(pinchScale(2, 100, 10)).toBe(MIN_ZOOM);
  });

  it("ignores degenerate distances", () => {
    expect(pinchScale(2, 0, 100)).toBe(2);
    expect(pinchScale(2, 100, 0)).toBe(2);
  });

  it("zooms about the fingers from 1x: the point between them stays put", () => {
    const mid = at(90, 60);
    const o = pinchOrigin(at(50, 50), 1, 2, mid, mid, 300, 200);
    expect(screen(90, o.x, 300, 2)).toBeCloseTo(90);
    expect(screen(60, o.y, 200, 2)).toBeCloseTo(60);
  });

  it("keeps the pinched point under the fingers when they also move", () => {
    // Already at 2x with origin 40%,50% in a 300px frame. The photo point
    // under x=150 must follow the midpoint to x=180 at 3x.
    const startO = at(40, 50);
    const p = (150 - (1 - 2) * 120) / 2; // photo point under the start midpoint
    const o = pinchOrigin(startO, 2, 3, at(150, 100), at(180, 100), 300, 300);
    expect(screen(p, o.x, 300, 3)).toBeCloseTo(180);
  });

  it("stops at the photo's edges", () => {
    const o = pinchOrigin(at(50, 50), 1, 2, at(10, 10), at(-400, 500), 300, 300);
    expect(o).toEqual(at(100, 0));
  });

  it("leaves the origin alone at 1x or with no frame", () => {
    expect(pinchOrigin(at(30, 70), 2, 1, at(10, 10), at(50, 50), 300, 300)).toEqual(at(30, 70));
    expect(pinchOrigin(at(30, 70), 1, 2, at(10, 10), at(50, 50), 0, 300)).toEqual(at(30, 70));
  });
});

describe("handing a pinch from the gallery to the lightbox", () => {
  const photo = { width: 1000, height: 1000 };

  it("keeps the same photo point in focus across frames of different shape", () => {
    // Square photo, 4:3 viewer crops top and bottom; tall lightbox letterboxes.
    const v = handoffView({ scale: 2, origin: at(50, 0) }, { width: 400, height: 300 }, { width: 360, height: 680 }, photo);
    // Viewer top edge is photo y = 12.5%; in the lightbox the photo spans
    // 160..520px of 680, so that point is at (160 + 0.125 * 360) / 680.
    expect(v.origin.x).toBeCloseTo(50);
    expect(v.origin.y).toBeCloseTo(((160 + 0.125 * 360) / 680) * 100);
  });

  it("matches the apparent size of the photo", () => {
    // Viewer draws the photo 400px wide, lightbox 360px wide: 2x becomes ~2.22x.
    const v = handoffView({ scale: 2, origin: at(50, 50) }, { width: 400, height: 300 }, { width: 360, height: 680 }, photo);
    expect(v.scale).toBeCloseTo((2 * 400) / 360);
  });

  it("passes the view through when a size is unknown", () => {
    const view = { scale: 2, origin: at(30, 40) };
    expect(handoffView(view, { width: 400, height: 300 }, { width: 360, height: 680 }, { width: 0, height: 0 })).toEqual(view);
  });
});
