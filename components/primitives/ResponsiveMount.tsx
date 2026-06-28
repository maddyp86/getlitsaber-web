"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ResponsiveMountProps {
  /** Rendered below the breakpoint (and during SSR / first paint). */
  mobile: ReactNode;
  /** Rendered at or above the breakpoint, after hydration. */
  desktop: ReactNode;
  /** matchMedia query that, when matched, selects the desktop variant. */
  query?: string;
}

/**
 * Mounts EXACTLY ONE of two variants based on a media query.
 *
 * The homepage previously rendered both desktop and mobile variants of every
 * heavy section and hid one with `display:none` (`hidden lg:block` /
 * `lg:hidden`). CSS hiding does not unmount the React subtree, stop
 * `next/image` downloads, or destroy `<video>` elements — so phones paid the
 * full memory cost of BOTH trees (duplicate videos + full-size images +
 * doubled DOM), exhausting the iOS WebContent process and triggering the
 * crash/reload/"Can't Open This Page" loop.
 *
 * By mounting only the matching variant, the off-viewport tree (and all of its
 * media) never enters the DOM.
 *
 * SSR + first client render return `mobile` (mobile-first), so hydration
 * matches; the effect then upgrades large viewports to `desktop`.
 */
export default function ResponsiveMount({
  mobile,
  desktop,
  query = "(min-width: 1024px)",
}: ResponsiveMountProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  if (isDesktop === null) return <>{mobile}</>;
  return <>{isDesktop ? desktop : mobile}</>;
}
