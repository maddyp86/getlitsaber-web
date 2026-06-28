"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  /**
   * Placeholder height used before the section has ever mounted (and as a
   * fallback). Once mounted, the real measured height is captured and reused,
   * so later scroll-bys don't shift layout. Accepts any CSS length.
   */
  minHeight?: string | number;
  /**
   * How far outside the viewport (px) the section mounts/unmounts. Larger =
   * mounts earlier (smoother) but keeps more in memory. Default 800px.
   */
  rootMargin?: string;
  /** If true, never unmount once shown (still defers initial mount). */
  keepMounted?: boolean;
}

/**
 * Renders `children` only while the wrapper is within `rootMargin` of the
 * viewport, and unmounts them once it scrolls well away.
 *
 * Why: the homepage crashed on mobile (iOS WebContent OOM) because all the
 * below-the-fold sections — heavy framer-motion trees, a 300vh scrollytelling,
 * large images, blurred GPU layers — were instantiated in one synchronous
 * render on load. The `?diag=lite` test (which dropped them) proved it. By
 * keeping only the ~2-3 sections near the viewport mounted at any time, peak
 * memory stays at the level that already survives.
 *
 * Trade-offs: below-the-fold sections are not in the SSR HTML, and interactive
 * sections lose internal state if scrolled past and back. Acceptable for a
 * marketing page where not-crashing is the priority.
 */
export default function LazyMount({
  children,
  minHeight = "100vh",
  rootMargin = "800px",
  keepMounted = false,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const everShown = useRef(false);
  const [show, setShow] = useState(false);
  const [capturedHeight, setCapturedHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Safety: if IntersectionObserver is unavailable, just render the content
    // so the page can never be left blank.
    if (typeof IntersectionObserver === "undefined") {
      everShown.current = true;
      setShow(true);
      return;
    }

    const marginPx = parseInt(rootMargin, 10) || 0;
    const isNear = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight + marginPx && r.bottom > -marginPx;
    };

    // Immediate check on mount — don't wait for the observer's first callback,
    // so near-the-fold sections appear right away.
    if (isNear()) {
      everShown.current = true;
      setShow(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          everShown.current = true;
          setShow(true);
        } else if (everShown.current && !keepMounted) {
          // Capture the rendered height before collapsing so the placeholder
          // holds the same space and scrolling doesn't jump.
          const h = el.getBoundingClientRect().height;
          if (h > 0) setCapturedHeight(h);
          setShow(false);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, keepMounted]);

  return (
    <div
      ref={ref}
      style={
        show
          ? undefined
          : { minHeight: capturedHeight != null ? `${capturedHeight}px` : minHeight }
      }
    >
      {show ? children : null}
    </div>
  );
}
