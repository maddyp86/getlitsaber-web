"use client";

import { useEffect, useState, type RefObject } from "react";
import { getTierPrice } from "@/lib/cart/pricing";
import { useAddToCart } from "@/lib/cart/useAddToCart";
import { useIsCartOpen, useActiveModal, useIsAgeGateVisible } from "@/lib/ui/store";

interface StickyBuyBarProps {
  /** Wrapper around the in-page selector + CTAs. The bar shows only while its CTA buttons are off screen. */
  targetRef: RefObject<HTMLElement>;
  variantId: string;
  basePrice?: number;
  qty: number;
}

/**
 * Mobile-only bottom bar on the PDP. On a phone the gallery fills the first
 * screen and Add to Cart sits ~1.7 screens down, so visitors browsing photos
 * and videos never had a buy control in view. The bar mirrors the selected
 * quantity and hides whenever the real CTA block is visible.
 */
export default function StickyBuyBar({ targetRef, variantId, basePrice, qty }: StickyBuyBarProps) {
  const [ctaVisible, setCtaVisible] = useState(true);
  const cartOpen = useIsCartOpen();
  const modalOpen = useActiveModal() !== null;
  const ageGateUp = useIsAgeGateVisible();
  const addToCart = useAddToCart({ variantId, basePrice, source: "pdp_sticky" });

  useEffect(() => {
    // Watch the Add to Cart / Buy Now buttons themselves, not the whole
    // selector block, whose top already peeks into the first mobile screen.
    const el = targetRef.current?.querySelector<HTMLElement>("[data-pdp-cta]") ?? targetRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setCtaVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetRef]);

  const hidden = ctaVisible || cartOpen || modalOpen || ageGateUp;
  const price = getTierPrice(qty, basePrice);

  return (
    <div
      aria-hidden={hidden}
      className={`lg:hidden fixed inset-x-0 bottom-0 z-sticky border-t border-border-pill bg-background-primary/95 backdrop-blur-sm px-container-mobile pt-sm transition-transform duration-200 ease-out ${
        hidden ? "translate-y-full pointer-events-none" : "translate-y-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-center gap-md">
        <div className="flex flex-col min-w-0">
          <span className="font-label text-eyebrow text-text-secondary tracking-widest uppercase truncate">
            Silver{qty > 1 ? ` × ${qty}` : ""}
          </span>
          <span className="font-label font-bold text-[18px] text-text-primary">
            ${price.toFixed(2)}
          </span>
        </div>
        <button
          type="button"
          tabIndex={hidden ? -1 : 0}
          onClick={() => addToCart(qty)}
          className="flex-1 bg-cta font-label font-bold text-[16px] text-text-primary rounded-md py-3 px-4 cursor-pointer touch-manipulation transition-opacity active:opacity-80"
        >
          + ADD TO CART
        </button>
      </div>
    </div>
  );
}
