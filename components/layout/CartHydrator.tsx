"use client";

import { useEffect } from "react";
import { useCartHydrate } from "@/lib/cart/store";
import { useDiscountCapture } from "@/lib/hooks/useDiscount";

export default function CartHydrator() {
  const hydrate = useCartHydrate();

  useDiscountCapture();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
