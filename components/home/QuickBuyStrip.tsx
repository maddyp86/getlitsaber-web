"use client";

import Image from "next/image";
import Link from "next/link";
import { getTierPrice } from "@/lib/cart/pricing";
import { useAddToCart } from "@/lib/cart/useAddToCart";
import { track, EVENTS } from "@/lib/analytics/events";
import { mediaUrl } from "@/lib/media";

interface QuickBuyStripProps {
  variantId: string;
  available: boolean;
  basePrice?: number;
}

const PDP_HREF = "/shop/litsaber-og";

/**
 * Compact buy row directly under the hero. The full buy section lives ~16
 * phone screens down the homepage, and only 17% of homepage sessions ever
 * scrolled to it (1 in 113 clicked through to the PDP). This puts a working
 * Add to Cart within the first two screens.
 */
export default function QuickBuyStrip({ variantId, available, basePrice }: QuickBuyStripProps) {
  const addToCart = useAddToCart({ variantId, basePrice, source: "home_strip" });
  const price = getTierPrice(1, basePrice);
  const twoPackPrice = getTierPrice(2, basePrice);

  return (
    <section aria-label="Buy Litsaber OG" className="w-full bg-background-primary px-container-mobile lg:px-content pb-xl">
      <div className="mx-auto max-w-[1250px] flex flex-col lg:flex-row lg:items-center gap-md lg:gap-xl rounded-card border border-border-pill bg-surface-card p-md lg:p-lg">
        <div className="flex items-center gap-md flex-1 min-w-0">
          <div className="relative w-[72px] h-[72px] lg:w-[88px] lg:h-[88px] flex-shrink-0 overflow-hidden rounded-sm bg-surface-card-deep">
            <Image
              src={mediaUrl("product/litsaber-lights-off.jpg")}
              alt="Litsaber OG in Silver"
              fill
              sizes="88px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-[2px] min-w-0">
            <p className="font-label text-eyebrow text-accent-cyan tracking-widest uppercase">
              Litsaber OG · Silver
            </p>
            <p className="font-label font-bold text-h4 text-text-primary">
              ${price.toFixed(2)}
            </p>
            <p className="font-body text-[13px] text-text-secondary">
              {available
                ? `In stock. Ships in 24 hrs. Two for $${twoPackPrice.toFixed(2)}, shipped free.`
                : "Sold out for now. Join the restock list on the product page."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-sm lg:w-[340px] xl:w-auto flex-shrink-0">
          {available && (
            <button
              type="button"
              onClick={() => addToCart(1)}
              className="w-full xl:w-[200px] bg-cta font-label font-bold text-[16px] text-text-primary rounded-md py-4 px-4 cursor-pointer touch-manipulation transition-opacity active:opacity-80"
            >
              + ADD TO CART
            </button>
          )}
          <Link
            href={PDP_HREF}
            onClick={() => track(EVENTS.cta_clicked, { cta: "home_strip_details" })}
            className="w-full xl:w-[200px] flex items-center justify-center border border-border-accent text-accent-cyan font-label text-[14px] tracking-wider uppercase rounded-md py-4 px-4 transition-colors hover:bg-surface-tint-cyan"
          >
            {available ? "All quantities" : "See details"}
          </Link>
        </div>
      </div>
    </section>
  );
}
