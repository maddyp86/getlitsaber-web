"use client";

import { useEffect } from "react";

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

  useEffect(() => {
    // The preloader script fires at layout level before this component mounts.
    // Re-trigger the scan so it finds the widget div that now exists in the DOM.
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).jdgm) {
      const jdgm = (window as unknown as Record<string, { pageLoad?: () => void }>).jdgm;
      jdgm.pageLoad?.();
    }
  }, []);

  return (
    <div
      className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
      data-id={resolvedId}
      data-product-title={productTitle}
    />
  );
}