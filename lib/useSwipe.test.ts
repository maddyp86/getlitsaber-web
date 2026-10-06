import { describe, expect, it } from "vitest";
import { classifySwipe, SWIPE_MIN_PX } from "./useSwipe";

describe("swipe classifier", () => {
  it("a clear horizontal move is a swipe in that direction", () => {
    expect(classifySwipe(-80, 10)).toBe("left");
    expect(classifySwipe(90, -12)).toBe("right");
  });

  it("short moves and taps are not swipes", () => {
    expect(classifySwipe(SWIPE_MIN_PX - 1, 0)).toBeNull();
    expect(classifySwipe(3, 2)).toBeNull();
  });

  it("a mostly vertical move is page scrolling, not a swipe", () => {
    expect(classifySwipe(-50, 60)).toBeNull();
    expect(classifySwipe(60, 45)).toBeNull();
  });
});
