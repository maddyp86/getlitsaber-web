"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pageView, whenMetaPixelReady } from "@/lib/metaPixel";

/**
 * One PageView per navigation: the first load (queued until the pixel snippet
 * has run) and every client-side route change after it. Keyed on the
 * pathname, so Next's own replaceState on load and query-only changes do not
 * count as new views. The ref keeps React's development double-effect from
 * sending the same view twice.
 */
export default function MetaPixelPageView() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    whenMetaPixelReady(() => {
      pageView();
    });
  }, [pathname]);

  return null;
}
