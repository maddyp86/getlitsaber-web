"use client";

import { useEffect, useRef, useState } from "react";
import WriteReviewButton from "./WriteReviewButton";

const JUDGEME_PRODUCT_ID = "7870095392975";

type Status = "loading" | "ready" | "error";

interface Props {
  productId?: string;
  productTitle?: string;
}

/** Placeholder shown while Judge.me's script fetches and renders the widget.
 *  Session review showed users tapping the empty container (and its
 *  not-yet-interactive review form) before the embed loaded, registering as
 *  dead clicks. The skeleton signals "loading" so people wait instead of
 *  re-tapping a void. */
function ReviewsSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4" aria-hidden="true">
      {/* Rating summary row */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-24 rounded bg-white/10" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-3 w-20 rounded bg-white/5" />
        </div>
      </div>
      {/* Review cards */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-2 border-t border-white/10 pt-4">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-3 w-full rounded bg-white/5" />
          <div className="h-3 w-3/4 rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export default function JudgemeReviewWidget({
  productId,
  productTitle = "Litsaber OG",
}: Props) {
  const resolvedId =
    productId && productId.length > 0 ? productId : JUDGEME_PRODUCT_ID;
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

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
        setStatus("ready");
        stop();
        return;
      }
      // ~15s ceiling for a cold CDN before we give up polling.
      if (++tries > 60) {
        setStatus("error");
        stop();
      }
    };

    tick();
    intervalId = window.setInterval(tick, 250);

    return () => {
      stop();
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [resolvedId]);

  return (
    <div className="relative">
      {/* Judge.me renders into this container. It stays mounted at all times so
          the embed has a stable target; the skeleton/fallback sit alongside. */}
      <div
        ref={containerRef}
        className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
        data-id={resolvedId}
        data-product-title={productTitle}
      />

      {status === "loading" && <ReviewsSkeleton />}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="font-body text-body-sm text-text-secondary">
            Reviews are taking a moment to load. You can still share yours.
          </p>
          <WriteReviewButton />
        </div>
      )}
    </div>
  );
}
