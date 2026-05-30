"use client";

import { useState } from "react";
import Link from "next/link";
import { BUNDLE_OPTIONS, TRUST_LINE } from "./productdisplay.content";
import type { BundleId } from "./productdisplay.content";
import { getTierPrice, getTierSavings, getTierUnitPrice, MAX_QTY } from "@/lib/cart/pricing";
import { useCartActions, useCartStore } from "@/lib/cart/store";
import { useCartUIActions } from "@/lib/ui/store";
import { track, EVENTS } from "@/lib/analytics/events";
import WaitlistForm from "@/components/forms/WaitlistForm";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";

const MORE_MIN = 3;
const MORE_MAX = MAX_QTY;

interface BundleAndCTAProps {
  activeBundle: BundleId;
  onBundleChange: (id: BundleId) => void;
  moreQty: number;
  onMoreQtyChange: (qty: number) => void;
  selectedQty: number;
  variantId: string;
  available: boolean;
}

function RadioIndicator({ checked }: { checked: boolean }) {
  return (
    <div
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
  activeBundle,
  onBundleChange,
  moreQty,
  onMoreQtyChange,
  selectedQty,
  variantId,
  available,
}: BundleAndCTAProps) {
  const { addItem } = useCartActions();
  const { openCart } = useCartUIActions();
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const moreTierPrice = getTierPrice(moreQty);
  const moreSavingsRounded = Math.round(getTierSavings(moreQty));

  async function handleAddToCart() {
    await addItem({
      variantId,
      qty: selectedQty,
      title: "Litsaber OG — Silver",
      variantTitle: "Silver",
      price: 59.99,
      image: "/images/product/litsaber-lights-off.jpg",
    });
    track(EVENTS.cart_add_to_cart, {
      variant: "silver",
      quantity: selectedQty,
      tier_price: getTierPrice(selectedQty),
      unit_price: getTierUnitPrice(selectedQty),
    });
    openCart();
  }

  async function handleBuyNow() {
    setBuyNowLoading(true);
    try {
      await addItem({
        variantId,
        qty: selectedQty,
        title: "Litsaber OG — Silver",
        variantTitle: "Silver",
        price: 59.99,
        image: "/images/product/litsaber-lights-off.jpg",
      });
      // Read post-mutation values directly from store — hook closures would be stale
      const freshState = useCartStore.getState();
      const freshCartValue = freshState.items.reduce((acc, i) => acc + i.lineTotal, 0);
      const freshItemCount = freshState.items.reduce((acc, i) => acc + i.qty, 0);
      track(EVENTS.buy_now_clicked, {
        variant: "silver",
        quantity: selectedQty,
        tier_price: getTierPrice(selectedQty),
      });
      track(EVENTS.checkout_started, {
        cart_value: freshCartValue,
        item_count: freshItemCount,
        has_promo_code: false,
      });
      const url = freshState.checkoutUrl;
      if (url) window.location.href = url;
    } finally {
      setBuyNowLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {available && (
        <>
          <p className="font-body font-medium text-[14px] text-text-secondary uppercase">
            SELECT QUANTITY
          </p>

          {/* Option rows */}
          <div className="flex flex-col gap-3">
            {BUNDLE_OPTIONS.map((option) => {
              const isChecked = option.id === activeBundle;

              const displayPrice =
                option.id === "more"
                  ? `$${moreTierPrice.toFixed(2)}`
                  : (option.price ?? "");

              const saveLabel =
                option.id === "more"
                  ? `SAVE $${moreSavingsRounded}`
                  : option.saveLabel;

              return (
                <div key={option.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => onBundleChange(option.id)}
                    className={`bg-surface-card-deep p-3 flex flex-row items-center gap-4 cursor-pointer border text-left transition-colors w-full ${
                      isChecked ? "border-accent-cyan" : "border-border-inactive"
                    } ${
                      option.id === "more" && isChecked
                        ? "rounded-t-selector rounded-t-btn border-b-0"
                        : "rounded-selector rounded-btn"
                    }`}
                  >
                    <RadioIndicator checked={isChecked} />

                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-label font-bold text-[16px] text-text-primary leading-tight">
                          {option.title}
                        </span>
                        {saveLabel && (
                          <span
                            className="font-label text-[12px] text-accent-cyan rounded-pill px-2 py-0.5"
                            style={{ background: "rgba(0, 229, 255, 0.05)" }}
                          >
                            {saveLabel}
                          </span>
                        )}
                      </div>
                      {option.descriptor && (
                        <p className="font-body text-[12px] text-text-secondary leading-snug">
                          {option.descriptor}
                        </p>
                      )}
                    </div>

                    <span className="font-body font-bold text-[16px] text-text-primary flex-shrink-0 text-right">
                      {displayPrice}
                    </span>
                  </button>

                  {/* Inline stepper — visible only when "more" is active */}
                  {option.id === "more" && isChecked && (
                    <div
                      className="bg-surface-card-deep border border-accent-cyan border-t-0 rounded-b-selector rounded-b-btn px-4 py-3 flex items-center gap-4"
                    >
                      <span className="font-label text-[12px] text-text-muted uppercase tracking-wider">
                        Quantity
                      </span>
                      <div
                        className="flex items-center"
                        style={{
                          border: "1px solid rgba(240, 240, 245, 0.20)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onMoreQtyChange(Math.max(MORE_MIN, moreQty - 1))}
                          disabled={moreQty <= MORE_MIN}
                          aria-label="Decrease quantity"
                          className="w-9 h-9 flex items-center justify-center font-label text-text-muted hover:text-text-primary transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ fontSize: "20px", lineHeight: 1 }}
                        >
                          −
                        </button>
                        <span
                          className="w-9 h-9 flex items-center justify-center font-label font-bold text-text-primary"
                          style={{
                            fontSize: "16px",
                            borderLeft: "1px solid rgba(240, 240, 245, 0.15)",
                            borderRight: "1px solid rgba(240, 240, 245, 0.15)",
                          }}
                        >
                          {moreQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onMoreQtyChange(Math.min(MORE_MAX, moreQty + 1))}
                          disabled={moreQty >= MORE_MAX}
                          aria-label="Increase quantity"
                          className="w-9 h-9 flex items-center justify-center font-label text-text-muted hover:text-text-primary transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ fontSize: "20px", lineHeight: 1 }}
                        >
                          +
                        </button>
                      </div>
                      <span className="font-label text-[12px] text-text-muted">
                        Save ${moreSavingsRounded.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Wholesale nudge at qty cap */}
          {selectedQty >= MAX_QTY && (
            <p className="font-label text-[12px] text-text-muted">
              Need more?{" "}
              <Link
                href="/wholesale"
                className="text-text-secondary underline hover:text-accent-cyan transition-colors duration-150"
              >
                See wholesale →
              </Link>
            </p>
          )}
        </>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-3">
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
