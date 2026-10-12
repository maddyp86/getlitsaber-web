import { describe, expect, it } from "vitest";
import { dragOrigin } from "./zoomPan";

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
