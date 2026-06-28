"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a CALLBACK ref to attach to a <video>. The video only plays while it
 * is in (or near) the viewport and is paused once it scrolls away, so at most
 * the on-screen clip holds a hardware video decoder.
 *
 * Why this matters: iOS Safari/Chrome allow only a small, fixed number of
 * simultaneous H.264 decoders. When several autoplay videos enter the viewport
 * during a scroll, the WebContent process exceeds that limit and is killed —
 * the "load → blank → reload → Can't Open This Page" crash. Pausing off-screen
 * videos keeps concurrent decode at ~1.
 *
 * A callback ref (not a ref object) is used so the observer re-attaches whenever
 * the underlying node changes — e.g. Framer Motion's <AnimatePresence> swapping
 * a keyed <motion.video> when the active mode changes.
 *
 * Pair with preload="none" on below-the-fold videos so the clip isn't even
 * fetched until it approaches the viewport.
 */
export function usePlayWhenVisible(rootMargin = "200px") {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback(
    (el: HTMLVideoElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // play() can reject if interrupted; autoplay is decorative — ignore.
            void el.play().catch(() => {});
          } else {
            el.pause();
          }
        },
        { rootMargin, threshold: 0.01 }
      );
      observer.observe(el);
      observerRef.current = observer;
    },
    [rootMargin]
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return setRef;
}
