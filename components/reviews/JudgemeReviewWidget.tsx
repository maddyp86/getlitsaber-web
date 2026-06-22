"use client";

import { useEffect } from "react";
import Script from "next/script";

const JUDGEME_PRODUCT_ID = "7870095392975";

type JdgmWindow = { jdgm?: { pageLoad?: () => void } };

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
    // Handles client-side navigation: script already loaded, won't fire onLoad
    // again, so we manually re-trigger the DOM scan here.
    (window as JdgmWindow).jdgm?.pageLoad?.();
  }, []);

  return (
    <>
      {/*
        Co-locating the preloader with the widget div guarantees the div exists
        in the DOM when the script first executes (fixes first-load blank widget).
        onLoad fires once after the script runs — pageLoad() is defined by then.
        Next.js deduplicates by id, so subsequent mounts skip the download and
        fall through to the useEffect above instead.
      */}
      <Script
        id="jdgm-preloader"
        src="https://cdnwidget.judge.me/widget_preloader.js"
        strategy="afterInteractive"
        data-cfasync="false"
        onLoad={() => {
          (window as JdgmWindow).jdgm?.pageLoad?.();
        }}
      />
      <div
        className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
        data-id={resolvedId}
        data-product-title={productTitle}
      />
    </>
  );
}