"use client";

import Script from "next/script";

declare global {
  interface Window {
    jdgm?: { pageLoad?: () => void; [key: string]: unknown };
  }
}

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

  return (
    <>
      <div
        className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
        data-id={resolvedId}
        data-product-title={productTitle}
      />
      <Script
        id="jdgm-preloader"
        src="https://cdnwidget.judge.me/widget_preloader.js"
        strategy="afterInteractive"
        data-cfasync="false"
        onReady={() => {
          window.jdgm?.pageLoad?.();
        }}
      />
    </>
  );
}