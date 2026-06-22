"use client";

import { useEffect } from "react";
import Script from "next/script";

const JUDGEME_PRODUCT_ID = "7870095392975";

interface Props {
  productId?: string;
  productTitle?: string;
}

export default function JudgemeReviewWidget({
  productId,
  productTitle = "Litsaber OG",
}: Props) {
  // Judge.me resolves reviews by the numeric Shopify product ID. Fall back to the
  // known constant when the Shopify fetch hasn't populated it (pre-integration).
  const resolvedId =
    productId && productId.length > 0 ? productId : JUDGEME_PRODUCT_ID;

  // The preloader's auto-scan runs before this div mounts and is then blocked by
  // the jdgmSettings guard, so we trigger the rescan ourselves once the widget
  // is in the DOM. reloadAll() is the only entry point not gated by that guard.
  useEffect(() => {
    let tries = 0;
    const fire = () => {
      const cs = (window as unknown as {
        jdgmCacheServer?: { reloadAll?: () => void };
      }).jdgmCacheServer;
      if (cs && typeof cs.reloadAll === "function") {
        cs.reloadAll();
        return true;
      }
      return false;
    };
    if (fire()) return;
    const id = window.setInterval(() => {
      if (fire() || ++tries > 40) window.clearInterval(id); // ~10s ceiling
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <Script
        id="jdgm-preloader"
        src="https://cdnwidget.judge.me/widget_preloader.js"
        strategy="afterInteractive"
        data-cfasync="false"
      />
      <div
        className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
        data-id={resolvedId}
        data-product-title={productTitle}
      />
    </>
  );
}