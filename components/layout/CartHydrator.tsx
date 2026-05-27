"use client";

import { useEffect } from "react";
import { useCartHydrate } from "@/lib/cart/store";

export default function CartHydrator() {
  const hydrate = useCartHydrate();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
