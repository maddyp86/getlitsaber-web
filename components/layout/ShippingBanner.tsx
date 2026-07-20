"use client";

import { useEffect, useRef, useState } from "react";
import {
  SHIPPING_NOTICE_LEAD,
  SHIPPING_NOTICE_CONTEXT,
} from "@/lib/promo/shippingNotice";
import { useShippingNoticeEnabled } from "@/lib/promo/useShippingNotice";

// TEMP — warehouse transition banner. See lib/promo/shippingNotice.ts for rollback.
const DISMISS_KEY = "litsaber_ship_notice_dismissed";

/**
 * Site-wide shipping-delay bar. Gated by the `warehouse-shipping-notice` PostHog
 * flag (toggle off Monday, no deploy). It publishes its own height to the global
 * `--promo-h` CSS variable; the fixed navbar binds its `top` to that variable
 * and SiteChrome pads <main> by it, so the bar pushes everything down cleanly
 * and collapses to 0 when off or dismissed. Dismissal is per browser session.
 */
export default function ShippingBanner() {
  const enabled = useShippingNoticeEnabled();
  const [dismissed, setDismissed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  const show = enabled && !dismissed;

  useEffect(() => {
    const root = document.documentElement;
    if (!show) {
      root.style.setProperty("--promo-h", "0px");
      return;
    }
    const el = ref.current;
    if (!el) return;
    const sync = () =>
      root.style.setProperty("--promo-h", `${el.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-navbar bg-surface-card-deep border-b border-accent-cyan"
    >
      <div className="relative mx-auto max-w-content px-content py-2 flex items-center justify-center">
        <p className="font-label text-[12px] sm:text-[13px] text-text-secondary text-center tracking-wide">
          {SHIPPING_NOTICE_LEAD}{" "}
          <span className="hidden sm:inline text-text-muted">
            {SHIPPING_NOTICE_CONTEXT}
          </span>
        </p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "true");
            setDismissed(true);
          }}
          aria-label="Dismiss shipping notice"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          style={{ fontSize: "16px", lineHeight: 1 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
