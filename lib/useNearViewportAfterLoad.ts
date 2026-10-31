"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has finished loading AND the element is in (or near) the
 * viewport. Use it to mount heavy media late: a <video autoPlay> fetches its
 * file as soon as it is in the DOM, whatever `preload` says.
 *
 * The homepage hero video (3.8MB) used to mount with the page. On a phone it
 * sits below the fold yet downloaded alongside the hero photo, which pushed
 * PageSpeed's mobile LCP to 9.1s. On desktop it downloaded twice, because
 * ResponsiveMount renders the mobile tree first and then swaps to the desktop
 * one, each with its own <video>. Waiting for the load event means the swap has
 * long happened, and the photo has painted, before any video byte is requested.
 *
 * Returns a callback ref for the element to watch, and the flag.
 */
export function useNearViewportAfterLoad(rootMargin = "200px") {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!el || ready) return;
    let observer: IntersectionObserver | null = null;
    const watch = () => {
      if (typeof IntersectionObserver === "undefined") {
        setReady(true);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer?.disconnect();
          setReady(true);
        },
        { rootMargin }
      );
      observer.observe(el);
    };
    if (document.readyState === "complete") watch();
    else window.addEventListener("load", watch, { once: true });
    return () => {
      window.removeEventListener("load", watch);
      observer?.disconnect();
    };
  }, [el, ready, rootMargin]);

  return [setEl, ready] as const;
}
