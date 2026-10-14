"use client";

import { useEffect } from "react";
import { useCartHydrate } from "@/lib/cart/store";
import { useDiscountCapture } from "@/lib/hooks/useDiscount";

export default function CartHydrator() {
  const hydrate = useCartHydrate();

  useDiscountCapture();

  useEffect(() => {
    hydrate();
    // Back from checkout can restore this page from the back/forward cache,
    // with the cart as it was before checkout. Re-read it from Shopify.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) hydrate();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [hydrate]);

  return null;
}
