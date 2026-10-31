"use client";

import { useRef, type PointerEvent, type MouseEvent } from "react";

/** A touch counts as a swipe past this many pixels, mostly horizontal. */
export const SWIPE_MIN_PX = 40;

/** Pure classifier, exported for tests. */
export function classifySwipe(dx: number, dy: number): "left" | "right" | null {
  if (Math.abs(dx) < SWIPE_MIN_PX) return null;
  if (Math.abs(dx) < Math.abs(dy) * 1.5) return null;
  return dx < 0 ? "left" : "right";
}

/**
 * Horizontal touch swipe on an element. Spread the returned handlers onto it
 * and give it `touch-action: pan-y`, so vertical page scrolling still belongs
 * to the browser while horizontal moves reach these handlers. Mouse and pen
 * input are ignored (desktop uses the arrows). The click a swipe would
 * otherwise produce is swallowed, so a swipe never also zooms or plays.
 */
export function useSwipe(onSwipe: (dir: "left" | "right") => void, enabled = true) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  // Fingers down. A second finger makes the gesture a pinch, never a swipe.
  const touches = useRef(0);

  return {
    onPointerDown(e: PointerEvent) {
      if (e.pointerType !== "touch") return;
      touches.current += 1;
      if (touches.current > 1) {
        start.current = null;
        return;
      }
      if (!enabled) return;
      start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      swiped.current = false;
    },
    onPointerUp(e: PointerEvent) {
      if (e.pointerType === "touch") touches.current = Math.max(0, touches.current - 1);
      const s = start.current;
      start.current = null;
      if (!s || e.pointerId !== s.id) return;
      const dir = classifySwipe(e.clientX - s.x, e.clientY - s.y);
      if (dir) {
        swiped.current = true;
        onSwipe(dir);
      }
    },
    onPointerCancel(e: PointerEvent) {
      if (e.pointerType === "touch") touches.current = Math.max(0, touches.current - 1);
      start.current = null;
    },
    onClickCapture(e: MouseEvent) {
      if (!swiped.current) return;
      swiped.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
  };
}
