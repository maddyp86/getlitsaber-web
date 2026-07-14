"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCartItems,
  useItemCount,
  useSubtotal,
  useCartActions,
  useCheckoutUrl,
  useCapReached,
} from "@/lib/cart/store";
import { useIsCartOpen, useCartUIActions } from "@/lib/ui/store";
import { TrustBadges } from "@/components/cart/TrustBadges";
import { track, EVENTS } from "@/lib/analytics/events";
import { appendDiscountToCheckoutUrl } from "@/lib/hooks/useDiscount";
import { identifyByEmail } from "@/lib/analytics/identify";
import { useShippingVariant } from "@/lib/experiments/useShippingVariant";
import { getDisplayShipping, formatDisplayShipping } from "@/lib/shipping";
import ShippingUpsellNudge from "@/components/product/ShippingUpsellNudge";

export default function CartDrawer() {
  const isOpen = useIsCartOpen();
  const { closeCart } = useCartUIActions();
  const items = useCartItems();
  const itemCount = useItemCount();
  const subtotal = useSubtotal();
  const checkoutUrl = useCheckoutUrl();
  const { removeItem, updateQty } = useCartActions();
  const capReached = useCapReached();

  // Display-only mirror of the shipping the Shopify Function will charge.
  const shippingVariant = useShippingVariant();
  const shippingCost = getDisplayShipping(itemCount, shippingVariant); // number | null
  const shippingDisplay = formatDisplayShipping(shippingCost);
  const shippingCalcPending = shippingCost === null;
  const displayTotal = subtotal + (shippingCost ?? 0);
  const bumpToTwoPack = () => {
    if (items[0]) updateQty(items[0].id, 2);
  };
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("scroll-locked");
      closeButtonRef.current?.focus();
    } else {
      document.body.classList.remove("scroll-locked");
    }
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, [isOpen]);

  // Escape key closes drawer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  const panelVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { x: "100%" },
        visible: { x: 0 },
        exit: { x: "100%" },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-drawer"
            style={{ backgroundColor: "rgba(10, 5, 24, 0.75)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            aria-hidden="true"
            onClick={closeCart}
          />

          {/* Drawer panel */}
          <motion.div
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-drawer flex flex-col w-full sm:max-w-[500px]"
            style={{
              backgroundColor: "#0E0825",
            }}
          >
            {/* Header */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(240, 240, 245, 0.08)" }}
            >
              <div className="flex items-center gap-3">
                <h2
                  className="font-display font-bold text-text-primary uppercase tracking-wider"
                  style={{ fontSize: "30px", lineHeight: 1 }}
                >
                  YOUR CART
                </h2>
                <span
                  className="font-label text-accent-cyan uppercase tracking-widest"
                  style={{ fontSize: "12px" }}
                >
                  {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
                </span>
              </div>
              <button
                ref={closeButtonRef}
                onClick={closeCart}
                aria-label="Close cart"
                className="flex items-center justify-center w-9 h-9 text-text-muted hover:text-text-primary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Cap alert — fixed between header and scroll region */}
            <AnimatePresence>
              {capReached && items.length > 0 && (
                <motion.div
                  key="cap-alert"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-shrink-0"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="mx-4 mt-4 flex items-start gap-3 rounded-md px-4 py-3"
                    style={{
                      backgroundColor: "rgba(0, 229, 255, 0.08)",
                      border: "1px solid rgba(0, 229, 255, 0.35)",
                      borderLeft: "4px solid #00E5FF",
                    }}
                  >
                    <AlertIcon />
                    <div className="flex-1 min-w-0">
                      <p className="font-label font-bold text-text-primary" style={{ fontSize: "13px" }}>
                        Order limit reached
                      </p>
                      <p className="font-label text-text-secondary mt-0.5" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Max 5 per order. Need more?{" "}
                        <Link
                          href="/wholesale"
                          onClick={closeCart}
                          className="text-accent-cyan font-bold underline hover:opacity-80 transition-opacity"
                        >
                          See wholesale →
                        </Link>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Item list — flex-1 so it fills available space, scrolls internally */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-6 px-8 text-center">
                  <div
                    className="flex items-center justify-center w-20 h-20 rounded-full"
                    style={{ border: "1px solid rgba(240, 240, 245, 0.15)" }}
                  >
                    <EmptyBagIcon />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-subhead font-bold text-text-primary" style={{ fontSize: "22px" }}>
                      Nothing here yet.
                    </p>
                    <p className="font-body text-text-muted" style={{ fontSize: "14px" }}>
                      Your Litsaber is one tap away.
                    </p>
                  </div>
                  <Link
                    href="/shop/litsaber-og"
                    onClick={closeCart}
                    className="font-label font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90 active:opacity-75 px-10 py-4 rounded-md"
                    style={{ fontSize: "14px", backgroundColor: "#00E5FF" }}
                  >
                    SHOP NOW →
                  </Link>
                </div>
              ) : (
              <>
              <ul className="divide-y divide-white/[0.08]">
                {items.map((line) => (
                  <li key={line.id} className="flex gap-4 px-6 py-5">
                    {/* Product image */}
                    <div
                      className="flex-shrink-0 rounded-md overflow-hidden"
                      style={{ width: 100, height: 100, backgroundColor: "#120F2C" }}
                    >
                      <Image
                        src={line.image}
                        alt={line.title}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p
                          className="font-subhead font-bold text-text-primary leading-tight"
                          style={{ fontSize: "16px" }}
                        >
                          {line.title}
                        </p>
                        <p
                          className="font-label text-text-muted mt-0.5"
                          style={{ fontSize: "12px" }}
                        >
                          {line.variantTitle} × {line.qty}
                        </p>
                        {line.qty > 1 && (
                          <p className="font-label text-text-muted mt-1" style={{ fontSize: "11px" }}>
                            Buy {line.qty} Litsabers, Save ${Math.round(line.price * line.qty - line.lineTotal)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Line price — Shopify discounted total */}
                        <span
                          className="font-label font-bold text-accent-cyan"
                          style={{ fontSize: "16px" }}
                        >
                          ${line.lineTotal.toFixed(2)}
                        </span>
                        {/* Remove */}
                        <button
                          onClick={() => {
                            track(EVENTS.cart_remove_item, { variant: "silver", quantity: line.qty });
                            removeItem(line.id);
                          }}
                          aria-label={`Remove ${line.title} from cart`}
                          className="font-label text-text-muted hover:text-text-primary underline transition-colors duration-150"
                          style={{ fontSize: "11px" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              </>
              )}
            </div>

            {/* Footer — hidden when cart is empty */}
            {items.length === 0 ? null : (
            <div
              className="flex-shrink-0 px-6 py-5 flex flex-col gap-3"
              style={{ borderTop: "1px solid rgba(240, 240, 245, 0.08)" }}
            >
              {/* PROMO-FIELD-DISABLED: replaced by ?discount= auto-apply via sessionStorage on checkout redirect
              <button
                type="button"
                className="font-label text-accent-cyan hover:text-accent-cyan transition-colors duration-150 text-left"
                style={{ fontSize: "12px" }}
                tabIndex={0}
              >
                + HAVE A PROMO CODE?
              </button>
              */}
              
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="font-label text-text-muted uppercase tracking-widest" style={{ fontSize: "12px" }}>SUBTOTAL</span>
                <span className="font-label font-bold text-text-primary" style={{ fontSize: "16px" }}>${subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center">
                <span className="font-label text-text-muted uppercase tracking-widest" style={{ fontSize: "12px" }}>SHIPPING</span>
                <span
                  className={`font-label uppercase tracking-wider ${shippingCalcPending ? "text-text-muted" : "text-text-primary font-bold"}`}
                  style={{ fontSize: shippingCalcPending ? "11px" : "14px" }}
                >
                  {shippingDisplay}
                </span>
              </div>

              {/* Surcharge-arm upsell to the free-shipping two-pack */}
              <ShippingUpsellNudge units={itemCount} onAddOne={bumpToTwoPack} />

              {/* Total */}
              <div
                className="flex justify-between items-center pt-3"
                style={{ borderTop: "1px solid rgba(240, 240, 245, 0.08)" }}
              >
                <span className="font-label font-bold text-text-primary uppercase tracking-widest" style={{ fontSize: "14px" }}>TOTAL</span>
                <span className="font-label font-bold text-text-primary" style={{ fontSize: "20px" }}>${displayTotal.toFixed(2)}</span>
              </div>

              {/* View cart button */}
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-4 font-label font-bold text-text-primary text-center uppercase tracking-widest transition-opacity hover:opacity-80 active:opacity-60 rounded-[10px]"
                style={{
                  fontSize: "15px",
                  border: "1px solid rgba(110, 110, 110, 0.20)",
                  background: "#64748B",
                }}
              >
                VIEW CART
              </Link>

              {/* Checkout button */}
              <button
                type="button"
                disabled={!checkoutUrl}
              onClick={() => {
                if (checkoutUrl) {
                  const storedEmail = sessionStorage.getItem("litsaber_email");
                  if (storedEmail) identifyByEmail(storedEmail);
                  track(EVENTS.checkout_started, {
                    cart_value: subtotal,
                    item_count: itemCount,
                    has_promo_code: false,
                    source: "drawer",
                  });
                  window.location.href = appendDiscountToCheckoutUrl(checkoutUrl);
                }
              }}
                className={`w-full py-4 font-label font-bold text-text-primary rounded-md transition-opacity active:opacity-80 ${!checkoutUrl ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}`}
                style={{
                  fontSize: "15px",
                  backgroundColor: "#EC5793",
                  textShadow: "0 0 10px rgba(236, 87, 147, 0.7)",
                }}
              >
               SECURE CHECKOUT
              </button>

              {/* Trust badges */}
              <TrustBadges />
            </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyBagIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="rgba(240,240,245,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0 mt-[1px]"
    >
      <circle cx="8" cy="8" r="7" stroke="#00E5FF" strokeWidth="1.5" />
      <path d="M8 4.5v4" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="#00E5FF" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

