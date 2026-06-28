"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to a <video>. The video only plays while it is in (or
 * near) the viewport and is paused once it scrolls away, so off-screen autoplay
 * loops stop holding a decode pipeline. This relieves the simultaneous-video
 * memory pressure that can crash mobile Safari/Chrome (iOS WebContent OOM).
 *
 * Pair with `preload="none"` on the element so the clip isn't even fetched until
 * it first approaches the viewport.
 */
export function usePlayWhenVisible<T extends HTMLVideoElement = HTMLVideoElement>(
  rootMargin = "200px"
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() can reject if interrupted; ignore — autoplay is decorative.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return ref;
}
