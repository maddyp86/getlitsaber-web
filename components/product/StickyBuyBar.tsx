"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTierPrice } from "@/lib/cart/pricing";
import { useAddToCart } from "@/lib/cart/useAddToCart";
import { useIsCartOpen, useActiveModal, useIsAgeGateVisible } from "@/lib/ui/store";
import { track, EVENTS, type AddSource } from "@/lib/analytics/events";
import { mediaUrl } from "@/lib/media";

/** Marks an in-page buy control. The bar hides while any of these is on screen. */
export const BUY_CTA_ATTR = "data-buy-cta";

interface StickyBuyBarProps {
  variantId: string;
  basePrice?: number;
  qty: number;
  source: AddSource;
  /** When set, the product name links here (homepage -> PDP). */
  detailsHref?: string;
}

/**
 * Mobile bottom buy bar. On the PDP the gallery fills the first phone screen and Add
 * to Cart sits ~1.7 screens down; on the homepage the full buy section is ~16
 * phone screens down. The bar keeps a working Add to Cart in reach and hides
 * whenever a real buy control ([data-buy-cta]) is visible, so it never doubles
 * up with the hero CTA or the in-page buttons. Mobile only: on desktop the
 * nav Shop link and cart stay in view, and a full-width bar sat on top of the
 * homepage's editorial sections and collided with the docked promo card.
 */
export default function StickyBuyBar({
  variantId,
  basePrice,
  qty,
  source,
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

  const product = (
    <>
      <div className="relative w-11 h-11 flex-shrink-0 overflow-hidden rounded-sm bg-surface-card-deep">
        <Image
          src={mediaUrl("product/litsaber-packaging-1.jpg")}
          alt=""
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-label text-eyebrow text-text-secondary tracking-widest uppercase truncate">
          Litsaber OG · Silver{qty > 1 ? ` × ${qty}` : ""}
        </span>
        <span className="font-label font-bold text-[18px] text-text-primary">${price.toFixed(2)}</span>
      </div>
    </>
  );

  return (
    <div
      aria-hidden={hidden}
      className={`lg:hidden fixed inset-x-0 bottom-0 z-sticky border-t border-border-pill bg-background-primary/95 backdrop-blur-sm px-container-mobile pt-sm transition-transform duration-200 ease-out ${
        hidden ? "translate-y-full pointer-events-none" : "translate-y-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-center gap-md">
        {detailsHref ? (
          <Link
            href={detailsHref}
            tabIndex={hidden ? -1 : 0}
            aria-label="Litsaber OG details"
            onClick={() => track(EVENTS.cta_clicked, { cta: "home_strip_details" })}
            className="flex items-center gap-sm min-w-0 flex-1"
          >
            {product}
          </Link>
        ) : (
          <div className="flex items-center gap-sm min-w-0 flex-1">{product}</div>
        )}
        <button
          type="button"
          tabIndex={hidden ? -1 : 0}
          onClick={() => addToCart(qty)}
          className="flex-shrink-0 bg-cta font-label font-bold text-[16px] text-text-primary rounded-md py-3 px-5 cursor-pointer touch-manipulation transition-opacity active:opacity-80"
        >
          + ADD TO CART
        </button>
      </div>
    </div>
  );
}
