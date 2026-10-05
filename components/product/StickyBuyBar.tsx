"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTierPrice } from "@/lib/cart/pricing";
import { useAddToCart } from "@/lib/cart/useAddToCart";
import { useIsCartOpen, useActiveModal, useIsAgeGateVisible } from "@/lib/ui/store";
import { track, EVENTS, type AddSource } from "@/lib/analytics/events";

/** Marks an in-page buy control. The bar hides while any of these is on screen. */
export const BUY_CTA_ATTR = "data-buy-cta";

interface StickyBuyBarProps {
  variantId: string;
  basePrice?: number;
  qty: number;
  source: AddSource;
  /** Show on desktop too (homepage). The PDP keeps it mobile-only, where its CTA sits below the gallery. */
  showOnDesktop?: boolean;
  /** When set, the product name links here (homepage -> PDP). */
  detailsHref?: string;
}

/**
 * Bottom buy bar. On the PDP the gallery fills the first phone screen and Add
 * to Cart sits ~1.7 screens down; on the homepage the full buy section is ~16
 * phone screens down. The bar keeps a working Add to Cart in reach and hides
 * whenever a real buy control ([data-buy-cta]) is visible, so it never doubles
 * up with the hero CTA or the in-page buttons.
 */
export default function StickyBuyBar({
  variantId,
  basePrice,
  qty,
  source,
  showOnDesktop = false,
  detailsHref,
}: StickyBuyBarProps) {
  const [ctaVisible, setCtaVisible] = useState(true);
  const cartOpen = useIsCartOpen();
  const modalOpen = useActiveModal() !== null;
  const ageGateUp = useIsAgeGateVisible();
  const addToCart = useAddToCart({ variantId, basePrice, source });

  useEffect(() => {
    // A scroll check rather than IntersectionObserver: buy controls can mount
    // later (the homepage buy section is lazy-mounted), and querying on each
    // frame picks them up without re-wiring observers.
    let frame = 0;
    const check = () => {
      frame = 0;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const visible = Array.from(document.querySelectorAll<HTMLElement>(`[${BUY_CTA_ATTR}]`)).some((el) => {
        const r = el.getBoundingClientRect();
        // height 0 = display:none (the other breakpoint's hero); off-canvas
        // elements fail the horizontal test.
        return r.height > 0 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
      });
      setCtaVisible(visible);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const hidden = ctaVisible || cartOpen || modalOpen || ageGateUp;
  const price = getTierPrice(qty, basePrice);
  const twoPackPrice = getTierPrice(2, basePrice);

  const name = (
    <span className="font-label text-eyebrow text-text-secondary tracking-widest uppercase truncate">
      Litsaber OG · Silver{qty > 1 ? ` × ${qty}` : ""}
    </span>
  );

  return (
    <div
      aria-hidden={hidden}
      className={`${showOnDesktop ? "" : "lg:hidden "}fixed inset-x-0 bottom-0 z-sticky border-t border-border-pill bg-background-primary/95 backdrop-blur-sm px-container-mobile lg:px-content pt-sm transition-transform duration-200 ease-out ${
        hidden ? "translate-y-full pointer-events-none" : "translate-y-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="mx-auto max-w-[1250px] flex items-center gap-md">
        <div className="flex flex-col min-w-0 flex-1">
          {detailsHref ? (
            <Link
              href={detailsHref}
              tabIndex={hidden ? -1 : 0}
              onClick={() => track(EVENTS.cta_clicked, { cta: "home_strip_details" })}
              className="min-w-0 truncate hover:text-accent-cyan transition-colors"
            >
              {name}
            </Link>
          ) : (
            name
          )}
          <span className="font-label font-bold text-[18px] text-text-primary">
            ${price.toFixed(2)}
            {showOnDesktop && (
              <span className="hidden lg:inline font-body font-normal text-[13px] text-text-secondary ml-3">
                Two for ${twoPackPrice.toFixed(2)}, shipped free
              </span>
            )}
          </span>
        </div>
        <button
          type="button"
          tabIndex={hidden ? -1 : 0}
          onClick={() => addToCart(qty)}
          className="flex-1 lg:flex-none lg:w-[280px] bg-cta font-label font-bold text-[16px] text-text-primary rounded-md py-3 px-4 cursor-pointer touch-manipulation transition-opacity active:opacity-80"
        >
          + ADD TO CART
        </button>
      </div>
    </div>
  );
}
