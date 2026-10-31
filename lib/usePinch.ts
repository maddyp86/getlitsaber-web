"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { pinchOrigin, pinchScale, type ZoomOrigin } from "./zoomPan";

export interface PinchView {
  scale: number;
  origin: ZoomOrigin;
}

interface PinchOptions {
  enabled?: boolean;
  /** The view at the moment the second finger lands. */
  current: () => PinchView;
  onStart?: () => void;
  /** Called on every move; write to the DOM here, not to state. */
  onPinch: (view: PinchView) => void;
  /** Called once fewer than two fingers remain, with the last view. */
  onEnd: (view: PinchView) => void;
}

type Point = { x: number; y: number };

/**
 * Two-finger pinch on an element (touch only). Attach `ref` and spread
 * `handlers` onto the element whose box is the zoom frame. While two fingers
 * are down the browser's own scroll and page zoom are blocked on the element
 * (non-passive touchmove, plus Safari's gesture events), so the pinch belongs
 * to the photo even under `touch-action: pan-y`. The click a pinch may end
 * with is swallowed, so a pinch never also opens or toggles the zoom.
 */
export function usePinch({ enabled = true, current, onStart, onPinch, onEnd }: PinchOptions) {
  const points = useRef(new Map<number, Point>());
  const gesture = useRef<{ start: PinchView; dist: number; mid: Point; rect: DOMRect; last: PinchView } | null>(null);
  const pinched = useRef(false);
  const callbacks = useRef({ current, onStart, onPinch, onEnd });
  callbacks.current = { current, onStart, onPinch, onEnd };

  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!el || !enabled) return;
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    const block = (e: Event) => e.preventDefault();
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("gesturestart", block);
    el.addEventListener("gesturechange", block);
    return () => {
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("gesturestart", block);
      el.removeEventListener("gesturechange", block);
    };
  }, [el, enabled]);

  function pair(rect: DOMRect): { dist: number; mid: Point } {
    const [a, b] = Array.from(points.current.values());
    return {
      dist: Math.hypot(b.x - a.x, b.y - a.y),
      mid: { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top },
    };
  }

  function release(e: PointerEvent) {
    if (!points.current.delete(e.pointerId)) return;
    const g = gesture.current;
    if (!g || points.current.size >= 2) return;
    gesture.current = null;
    callbacks.current.onEnd(g.last);
  }

  return {
    ref: setEl,
    isPinching: () => gesture.current !== null,
    handlers: {
      onPointerDown(e: PointerEvent<HTMLElement>) {
        if (!enabled || e.pointerType !== "touch") return;
        points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (points.current.size === 1) pinched.current = false;
        if (points.current.size !== 2 || gesture.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const start = callbacks.current.current();
        gesture.current = { start, rect, last: start, ...pair(rect) };
        pinched.current = true;
        callbacks.current.onStart?.();
      },
      onPointerMove(e: PointerEvent) {
        if (!points.current.has(e.pointerId)) return;
        points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const g = gesture.current;
        if (!g) return;
        const { dist, mid } = pair(g.rect);
        const scale = pinchScale(g.start.scale, g.dist, dist);
        const origin = pinchOrigin(g.start.origin, g.start.scale, scale, g.mid, mid, g.rect.width, g.rect.height);
        g.last = { scale, origin };
        callbacks.current.onPinch(g.last);
      },
      onPointerUp: release,
      onPointerCancel: release,
      onClickCapture(e: MouseEvent) {
        if (!pinched.current) return;
        pinched.current = false;
        e.preventDefault();
        e.stopPropagation();
      },
    },
  };
}
