"use client";

// Top-of-page announcement for the shipping-surcharge arm. Only the 'surcharge'
// arm sees it: in the control arm singles already ship free, so "free on 2+"
// would wrongly imply otherwise. While the flag is unresolved / not in the test,
// it renders nothing. When shown, it sets .has-shipping-bar on <html> so the
// fixed navbar and page content shift down by the bar height (see globals.css).

import { useEffect } from "react";
import { useShippingVariant } from "@/lib/experiments/useShippingVariant";

export default function AnnouncementBar() {
  const variant = useShippingVariant();
  const show = variant === "surcharge";

  useEffect(() => {
    const root = document.documentElement;
    if (show) root.classList.add("has-shipping-bar");
    else root.classList.remove("has-shipping-bar");
    return () => root.classList.remove("has-shipping-bar");
  }, [show]);

  if (!show) return null;

  return (
    <div
      role="status"
      className="fixed top-0 left-0 right-0 z-navbar flex items-center justify-center h-[40px] px-content text-center"
      style={{ background: "linear-gradient(90deg, #9D5FFF 0%, #EC5793 100%)" }}
    >
      <p className="font-label font-bold uppercase tracking-widest text-text-primary text-[11px] sm:text-[12px]">
        Free shipping when you buy 2 or more
      </p>
    </div>
  );
}
