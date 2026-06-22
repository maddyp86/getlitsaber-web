"use client";

import { useEffect } from "react";
import Script from "next/script";

const JUDGEME_PRODUCT_ID = "7870095392975";

type JdgmCacheWindow = { jdgmCacheServer?: { reloadAll?: () => void } };

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

  useEffect(() => {
    let ticks = 0;
    const MAX_TICKS = 40; // 40 × 250ms = 10s ceiling

    const id = setInterval(() => {
      ticks++;
      const reloadAll = (window as JdgmCacheWindow).jdgmCacheServer?.reloadAll;
      if (typeof reloadAll === "function") {
        reloadAll();
        clearInterval(id);
        return;
      }
      if (ticks >= MAX_TICKS) {
        clearInterval(id);
      }
    }, 250);

    return () => clearInterval(id);
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
