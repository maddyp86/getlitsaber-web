"use client";

import { useEffect, useRef, useState } from "react";
import { trackWhenReady, EVENTS } from "@/lib/analytics/events";
import { PRODUCT_TITLE, PRODUCT_SUBTITLE, SPEC_PILLS, OFFERS } from "./productdisplay.content";
import { quoteOffer } from "@/lib/cart/offers";
import { getDisplayUnitPrice, formatAmountShort } from "@/lib/cart/pricing";
import { viewContent, whenMetaPixelReady } from "@/lib/metaPixel";
import MsrpPrice from "@/components/primitives/MsrpPrice";
import { useCampaign } from "@/lib/campaign/CampaignProvider";
import GalleryBlock from "./GalleryBlock";
import GalleryErrorBoundary from "./GalleryErrorBoundary";
import StyleSelector from "./StyleSelector";
import BundleAndCTA from "./BundleAndCTA";
import WaitlistCard from "./WaitlistCard";
import StickyBuyBar from "./StickyBuyBar";
import DescriptionSection from "./DescriptionSection";
import ProductAccordion, { ACCORDION_OPEN_EVENT } from "./ProductAccordion";

const OFFER_STORAGE_KEY = "litsaber_offer_qty";

interface ProductDisplayProps {
  variantId: string;
  available: boolean;
  surface: "homepage_buy" | "pdp";
  basePrice?: number;
}

export default function ProductDisplay({ variantId, available, surface, basePrice }: ProductDisplayProps) {
  const campaign = useCampaign();
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeStyle, setActiveStyle] = useState<"silver" | "gold">("silver");
  const [selectedQty, setSelectedQty] = useState(1);

  // The selected offer survives a trip to checkout and back (same tab), so a
  // shopper who backs out of checkout sees the offer they picked.
  useEffect(() => {
    try {
      const saved = Number(sessionStorage.getItem(OFFER_STORAGE_KEY));
      if (OFFERS.some((o) => o.qty === saved)) setSelectedQty(saved);
    } catch {
      // Storage unavailable: start on the default offer.
    }
  }, []);
  function selectQty(qty: number) {
    setSelectedQty(qty);
    try {
      sessionStorage.setItem(OFFER_STORAGE_KEY, String(qty));
    } catch {
      // Storage unavailable: the selection still works for this page.
    }
  }

  const productViewedFired = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Meta ViewContent: the product page only (the homepage buy section is the
  // same component, but not a product page view), once per page load, at
  // the live unit price. Queued until the pixel snippet has run.
  const viewContentFired = useRef(false);
  useEffect(() => {
    if (surface !== "pdp" || !variantId || viewContentFired.current) return;
    viewContentFired.current = true;
    whenMetaPixelReady(() => {
      viewContent({ variantId, value: getDisplayUnitPrice(basePrice) });
    });
  }, [surface, variantId, basePrice]);

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

  const quote = quoteOffer(selectedQty, basePrice);

  return (
    <div ref={rootRef} className="w-full flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-[50px]">
      {/* Left: image gallery */}
      <div
        // Sticky offset must clear the fixed navbar (h-navbar = 90px). At the
        // old 30px the top ~60px of the gallery sat under the navbar, which
        // swallowed clicks on the image, its zoom trigger, and the upper half
        // of the prev/next arrows.
        className="flex flex-col items-start w-full lg:w-[525px] lg:max-w-[525px] xl:w-[603px] xl:max-w-[603px] lg:flex-shrink-0 min-w-0 lg:sticky lg:self-start lg:top-[calc(110px+var(--announce-h))]"
        style={{ gap: "20px" }}
      >
        <GalleryErrorBoundary>
          <GalleryBlock activeThumb={activeThumb} onThumbClick={setActiveThumb} />
        </GalleryErrorBoundary>
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
            {/* Shipping is shown on each offer card below, so it is not repeated here. */}
            {campaign && (
              /* Sale banner: states the offer and the end date before the
                 price. Plain text in a box: not a link, no hover. */
              <div
                data-testid="pdp-sale-label"
                className="w-full my-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 bg-holiday-sale-surface border border-cta rounded-md px-[18px] py-[14px] text-left"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-label font-bold text-[15px] leading-tight tracking-[2px] uppercase text-white">
                    {campaign.saleName}
                  </p>
                  <p className="font-body text-[15px] leading-snug text-holiday-sale-text">
                    {campaign.copy.offerLine}
                  </p>
                </div>
                <p className="font-label text-[12px] tracking-[2px] uppercase text-holiday-sale-accent sm:flex-shrink-0">
                  {campaign.copy.endsLabel}
                </p>
              </div>
            )}
            <p data-testid="pdp-price" className="flex items-center flex-wrap gap-x-4 gap-y-1">
              <MsrpPrice
                price={quote.price}
                msrp={quote.msrp}
                anchorLabel={quote.anchorLabel}
                msrpClassName="font-label text-[20px] text-text-muted"
                priceClassName="font-label font-bold text-h3 text-text-primary [text-shadow:0_0_10px_theme(colors.cta.DEFAULT)]"
              />
              {/* The saving, stated once on the page and computed from the
                  selected offer's two prices. */}
              {campaign && quote.msrp > quote.price && (
                <span
                  data-testid="pdp-save-tag"
                  className="font-label font-bold text-[13px] leading-none tracking-[1.5px] uppercase text-holiday-sale-ink bg-holiday-sale-accent rounded-sm px-[10px] py-2"
                >
                  Save {formatAmountShort(quote.msrp - quote.price)}
                </span>
              )}
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
                qty={selectedQty}
                onQtyChange={selectQty}
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

      {surface === "pdp" && available && activeStyle === "silver" && (
        <StickyBuyBar
          variantId={variantId}
          basePrice={basePrice}
          qty={selectedQty}
          source="pdp_sticky"
        />
      )}
    </div>
  );
}
