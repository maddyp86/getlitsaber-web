"use client";

import { useEffect, useRef, useState } from "react";
import { trackWhenReady, EVENTS } from "@/lib/analytics/events";
import { PRODUCT_TITLE, PRODUCT_SUBTITLE, SPEC_PILLS } from "./productdisplay.content";
import type { BundleId } from "./productdisplay.content";
import { getTierPrice } from "@/lib/cart/pricing";
import GalleryBlock from "./GalleryBlock";
import StyleSelector from "./StyleSelector";
import BundleAndCTA from "./BundleAndCTA";
import WaitlistCard from "./WaitlistCard";
import DescriptionSection from "./DescriptionSection";
import ProductAccordion, { ACCORDION_OPEN_EVENT } from "./ProductAccordion";

interface ProductDisplayProps {
  variantId: string;
  available: boolean;
  surface: "homepage_buy" | "pdp";
  basePrice?: number;
}

export default function ProductDisplay({ variantId, available, surface, basePrice }: ProductDisplayProps) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeStyle, setActiveStyle] = useState<"silver" | "gold">("silver");
  const [activeBundle, setActiveBundle] = useState<BundleId>("single");
  const [moreQty, setMoreQty] = useState(3);

  const productViewedFired = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (productViewedFired.current) return;
    const el = rootRef.current;
    if (!el) return;

    // Fallback for browsers without IntersectionObserver: fire on mount.
    if (typeof IntersectionObserver === "undefined") {
      productViewedFired.current = true;
      trackWhenReady(EVENTS.product_viewed, { surface });
      return;
    }

    // threshold 0 because the block can be taller than the viewport (a high
    // threshold may never be reached). Bottom inset so it fires when the
    // section is genuinely on screen, not from a 1px clip.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !productViewedFired.current) {
          productViewedFired.current = true;
          trackWhenReady(EVENTS.product_viewed, { surface });
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [surface]);

  const selectedQty =
    activeBundle === "single" ? 1 : activeBundle === "twopack" ? 2 : moreQty;

  const displayPrice = `$${getTierPrice(selectedQty, basePrice).toFixed(2)}`;

  return (
    <div ref={rootRef} className="w-full flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-[50px]">
      {/* Left: image gallery */}
      <div
        // Sticky offset must clear the fixed navbar (h-navbar = 90px) plus the
        // shipping banner (--promo-h). At the old 30px the top ~60px of the
        // gallery sat under the navbar, which swallowed clicks on the image,
        // its zoom trigger, and the upper half of the prev/next arrows.
        className="flex flex-col items-start w-full lg:w-[525px] lg:max-w-[525px] lg:flex-shrink-0 min-w-0 lg:sticky lg:self-start lg:top-[calc(var(--promo-h,0px)+110px)]"
        style={{ gap: "20px" }}
      >
        <GalleryBlock activeThumb={activeThumb} onThumbClick={setActiveThumb} />
      </div>

      {/* Right: product info */}
      <div
        className="w-full lg:flex-1 min-w-0 flex flex-col items-stretch gap-6 lg:gap-[30px]"
      >
          {/* Title + subtitle + price */}
          <div className="flex flex-col gap-2">
            <h1
              className="font-display text-h2 text-text-primary uppercase leading-tight"
              style={{ fontWeight: 700, lineHeight: "1.1" }}
            >
              {PRODUCT_TITLE}
            </h1>
            <p className="font-body text-[18px] text-text-secondary">
              {PRODUCT_SUBTITLE}
            </p>
            <p
              className="font-label font-bold text-h3 text-text-primary"
              style={{ textShadow: "0 0 10px #EC5793" }}
            >
              {displayPrice}
            </p>
          </div>

          {/* Spec pills — 2 rows × 3, rectangular (no border radius). The cyan
              border reads as interactive, and session review showed people
              tapping them expecting detail, so they now open the Tech Specs
              accordion instead of being dead. */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {SPEC_PILLS.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent(ACCORDION_OPEN_EVENT, { detail: { id: "specs" } })
                  )
                }
                aria-label={`${pill} — see full tech specs`}
                className="font-label text-label text-accent-cyan border border-accent-cyan/20 text-center px-3 flex items-center justify-center cursor-pointer touch-manipulation transition-colors hover:border-accent-cyan/50 active:opacity-80"
                style={{ minHeight: "35px", fontSize: "12px" }}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Available Styles */}
          <StyleSelector activeStyle={activeStyle} onStyleChange={setActiveStyle} />

          {activeStyle === "gold" ? (
            <div className="w-full">
              <WaitlistCard />
            </div>
          ) : (
            <div className="w-full">
              <BundleAndCTA
                activeBundle={activeBundle}
                onBundleChange={setActiveBundle}
                moreQty={moreQty}
                onMoreQtyChange={setMoreQty}
                selectedQty={selectedQty}
                variantId={variantId}
                available={available}
                surface={surface}
                basePrice={basePrice}
              />
            </div>
          )}
          <DescriptionSection />
          <ProductAccordion />
        </div>
    </div>
  );
}
