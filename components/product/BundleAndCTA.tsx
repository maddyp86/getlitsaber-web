"use client";

import { useState } from "react";
import { OFFERS, TRUST_LINE, FREE_SHIPPING_LABEL } from "./productdisplay.content";
import { getLinePrice, getDisplayUnitPrice, BASE_UNIT_PRICE } from "@/lib/cart/pricing";
import { quoteOffer, offerForQty } from "@/lib/cart/offers";
import { formatDisplayShipping } from "@/lib/shipping";
import { useCartActions, useCartStore } from "@/lib/cart/store";
import { useAddToCart, ADD_FAILED_MESSAGE } from "@/lib/cart/useAddToCart";
import { useToastActions } from "@/lib/toast/store";
import { track, EVENTS } from "@/lib/analytics/events";
import WaitlistForm from "@/components/forms/WaitlistForm";
import MsrpPrice from "@/components/primitives/MsrpPrice";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";
import { mediaUrl } from "@/lib/media";

interface BundleAndCTAProps {
  qty: number;
  onQtyChange: (qty: number) => void;
  variantId: string;
  available: boolean;
  surface: "homepage_buy" | "pdp";
  basePrice?: number;
}

function RadioIndicator({ checked }: { checked: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
        checked
          ? "border-accent-cyan bg-surface-card-deep"
          : "border-border-default bg-surface-card-deep"
      }`}
    >
      {checked && <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />}
    </div>
  );
}

export default function BundleAndCTA({
  qty,
  onQtyChange,
  variantId,
  available,
  surface,
  basePrice,
}: BundleAndCTAProps) {
  const { addItem } = useCartActions();
  const addToCart = useAddToCart({ variantId, basePrice, source: surface });
  const { addToast } = useToastActions();
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  function selectQty(next: number) {
    if (next === qty) return;
    onQtyChange(next);
    track(EVENTS.product_offer_selected, {
      offer: offerForQty(next),
      quantity: next,
      line_price: getLinePrice(next, basePrice),
      surface,
    });
  }

  function handleAddToCart() {
    addToCart(qty);
  }

  async function handleBuyNow() {
    setBuyNowLoading(true);
    try {
      const result = await addItem({
        variantId,
        qty,
        title: "Litsaber OG — Silver",
        variantTitle: "Silver",
        price: getDisplayUnitPrice(basePrice ?? BASE_UNIT_PRICE),
        image: mediaUrl("product/litsaber-packaging-1.jpg"),
      });
      if (result.status === "failed") {
        addToast({ variant: "error", message: ADD_FAILED_MESSAGE });
        track(EVENTS.cart_add_failed, {
          variant: "silver",
          quantity: qty,
          source: "buy_now",
          reason: result.reason,
        });
        return;
      }
      // Read post-mutation values directly from store — hook closures would be stale
      const freshState = useCartStore.getState();
      const freshCartValue = freshState.items.reduce((acc, i) => acc + i.lineTotal, 0);
      const freshItemCount = freshState.items.reduce((acc, i) => acc + i.qty, 0);
      track(EVENTS.buy_now_clicked, {
        variant: "silver",
        quantity: qty,
        tier_price: getLinePrice(qty, basePrice),
        offer: offerForQty(qty),
      });
      track(EVENTS.checkout_started, {
        cart_value: freshCartValue,
        item_count: freshItemCount,
        has_promo_code: false,
        source: "buy_now",
      });
      const url = freshState.checkoutUrl;
      if (url) {
        window.location.href = url;
      } else {
        addToast({ variant: "error", message: ADD_FAILED_MESSAGE });
      }
    } finally {
      setBuyNowLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {available && (
        <>
          <p id="offer-label" className="font-body font-medium text-[14px] text-text-secondary uppercase">
            SELECT QUANTITY
          </p>

          {/* The two offers are the whole quantity choice: 1 or 2. */}
          <div role="radiogroup" aria-labelledby="offer-label" className="flex flex-col gap-3">
            {OFFERS.map((offer) => {
              const isChecked = qty === offer.qty;
              const quote = quoteOffer(offer.qty, basePrice);

              return (
                <div key={offer.qty} data-testid={`offer-${quote.id}`}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isChecked}
                    onClick={() => selectQty(offer.qty)}
                    className={`bg-surface-card-deep p-3 flex flex-row items-center gap-4 cursor-pointer border text-left transition-colors touch-manipulation active:opacity-90 w-full rounded-selector ${
                      isChecked ? "border-accent-cyan" : "border-border-inactive"
                    }`}
                  >
                    <RadioIndicator checked={isChecked} />

                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-label font-bold text-[16px] text-text-primary leading-tight">
                          {offer.title}
                        </span>
                        {offer.badge && (
                          <span className="font-label text-[10.5px] tracking-[0.5px] uppercase text-accent-cyan bg-surface-tint-cyan rounded-sm px-2 py-[3px]">
                            {offer.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-label text-[12px] ${
                          quote.shipping === 0 ? "text-accent-cyan" : "text-text-muted"
                        }`}
                      >
                        {quote.shipping === 0
                          ? FREE_SHIPPING_LABEL
                          : `+ ${formatDisplayShipping(quote.shipping)} shipping`}
                      </span>
                    </div>

                    <MsrpPrice
                      price={quote.price}
                      msrp={quote.msrp}
                      className="flex-shrink-0 justify-end text-right"
                      msrpClassName="font-label text-[12px] text-text-muted"
                      priceClassName="font-body font-bold text-[16px] text-text-primary"
                    />
                  </button>
                </div>
              );
            })}
          </div>

        </>
      )}

      {/* CTAs — data-buy-cta tells StickyBuyBar to stay hidden while these are visible */}
      <div data-buy-cta className="flex flex-col gap-3">
        {available ? (
          <>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-cta font-label font-bold text-[16px] text-text-primary rounded-md py-4 px-4 cursor-pointer transition-opacity active:opacity-80"
              style={{ textShadow: "0 0 10px rgba(236, 87, 147, 0.7)" }}
            >
              + ADD TO CART
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={buyNowLoading}
              className={`w-full bg-white font-label font-bold text-[16px] text-black rounded-md py-4 px-4 transition-opacity ${buyNowLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:opacity-90 active:opacity-75"}`}
            >
              {buyNowLoading ? "REDIRECTING..." : "BUY NOW"}
            </button>


            {/* Trust line */}
            <p className="font-label text-eyebrow text-text-muted text-center tracking-wider">
              {TRUST_LINE}
            </p>
          </>
        ) : (
          <WaitlistForm
            list="general"
            source={WAITLIST_SOURCES.pdpSoldOut}
            headline="Sold out — for now"
            copy="Drop your email and we'll let you know the moment Silver is back in stock."
            buttonLabel="NOTIFY ME"
          />
        )}
      </div>
    </div>
  );
}
