"use client";

import { useEffect, useRef } from "react";

const JUDGEME_PRODUCT_ID = "7870095392975";

interface Props {
  productId?: string;
  productTitle?: string;
}

export default function JudgemeReviewWidget({
  productId,
  productTitle = "Litsaber OG",
}: Props) {
  const resolvedId =
    productId && productId.length > 0 ? productId : JUDGEME_PRODUCT_ID;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let tries = 0;
    let requested = false;
    let intervalId = 0;
    const timeouts: number[] = [];

    const cacheServer = () =>
      (window as unknown as {
        jdgmCacheServer?: { reloadAll?: () => void };
      }).jdgmCacheServer;

    // Judge.me's preloader was built for classic Shopify themes with full page
    // reloads. In this App Router SPA its cache server can render a stale
    // (empty) snapshot and then a fresh one, leaving TWO rendered bodies
    // stacked in the widget. Keep only the last one.
    const dedupe = () => {
      const bodies = el.querySelectorAll(".jdgm-rev-widg");
      for (let i = 0; i < bodies.length - 1; i += 1) bodies[i].remove();
    };

    const stop = () => window.clearInterval(intervalId);

    const tick = () => {
      const cs = cacheServer();
      // Ask Judge.me to render our widget exactly once, as soon as the cache
      // server is available. reloadAll() scans the DOM, so our div must already
      // be mounted — it is, because we run inside useEffect.
      if (!requested && cs && typeof cs.reloadAll === "function") {
        cs.reloadAll();
        requested = true;
      }
      // Once a body has rendered, strip any stale duplicate and finish. Two
      // follow-up passes catch a late second render arriving just after this.
      if (el.querySelector(".jdgm-rev-widg")) {
        dedupe();
        timeouts.push(window.setTimeout(dedupe, 400));
        timeouts.push(window.setTimeout(dedupe, 1200));
        stop();
        return;
      }
      // ~15s ceiling for a cold CDN before we give up polling.
      if (++tries > 60) stop();
    };

    tick();
    intervalId = window.setInterval(tick, 250);

    return () => {
      stop();
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [resolvedId]);

  return (
    <div
      ref={containerRef}
      className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
      data-id={resolvedId}
      data-product-title={productTitle}
    />
  );
}