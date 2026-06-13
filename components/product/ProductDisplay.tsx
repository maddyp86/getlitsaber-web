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
import ProductAccordion from "./ProductAccordion";

interface ProductDisplayProps {
  variantId: string;
  available: boolean;
  surface: "homepage_buy" | "pdp";
}

export default function ProductDisplay({ variantId, available, surface }: ProductDisplayProps) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeStyle, setActiveStyle] = useState<"silver" | "gold">("silver");
  const [activeBundle, setActiveBundle] = useState<BundleId>("single");
  const [moreQty, setMoreQty] = useState(3);

  const productViewedFired = useRef(false);
  useEffect(() => {
    if (productViewedFired.current) return;
    productViewedFired.current = true;
    trackWhenReady(EVENTS.product_viewed, { surface });
    // surface is a static prop set at the call site and never changes per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedQty =
    activeBundle === "single" ? 1 : activeBundle === "twopack" ? 2 : moreQty;

  const displayPrice = `$${getTierPrice(selectedQty).toFixed(2)}`;

  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-[50px]">
      {/* Left: image gallery */}
      <div
        className="flex flex-col items-start w-full lg:w-1/2 min-w-0 lg:sticky lg:self-start lg:top-[100px]"
        style={{ gap: "20px" }}
      >
        <GalleryBlock activeThumb={activeThumb} onThumbClick={setActiveThumb} />
      </div>

      {/* Right: product info */}
      <div
        className="w-full lg:w-1/2 min-w-0 flex flex-col items-stretch gap-6 lg:gap-[30px]"
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

          {/* Spec pills — 2 rows × 3, rectangular (no border radius) */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {SPEC_PILLS.map((pill) => (
              <div
                key={pill}
                className="font-label text-label text-accent-cyan border border-accent-cyan/20 text-center px-3 flex items-center justify-center"
                style={{ minHeight: "35px", fontSize: "12px" }}
              >
                {pill}
              </div>
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
              />
            </div>
          )}
          <DescriptionSection />
          <ProductAccordion />
        </div>
    </div>
  );
}
