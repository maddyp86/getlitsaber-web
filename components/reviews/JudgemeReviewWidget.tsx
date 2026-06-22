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
  const resolvedId =
    productId && productId.length > 0 ? productId : JUDGEME_PRODUCT_ID;

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
      if (fire() || ++tries > 40) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
      data-id={resolvedId}
      data-product-title={productTitle}
    />
  );
}