"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCartItems,
  useItemCount,
  useSubtotal,
  useCartActions,
} from "@/lib/cart/store";
import { getTierPrice, getTierSavings } from "@/lib/cart/pricing";
import { TrustBadges } from "@/components/cart/TrustBadges";

export default function CartPageBody() {
  const items = useCartItems();
  const itemCount = useItemCount();
  const subtotal = useSubtotal();
  const { removeItem } = useCartActions();

  return (
    <div
      className="min-h-screen pt-[80px]"
      style={{ backgroundColor: "#0A0518" }}
    >
      <div
        className="mx-auto w-full px-4 lg:px-[70px] py-10 lg:py-16"
        style={{ maxWidth: "1400px" }}
      >
        {/* Page heading */}
        <div className="flex items-baseline gap-4 mb-8 lg:mb-10">
          <h1
            className="font-subhead font-bold text-text-primary uppercase tracking-wider"
            style={{ fontSize: "25px", lineHeight: 1.1 }}
          >
            Your cart
          </h1>
          {itemCount > 0 && (
            <span
              className="font-label text-accent-cyan uppercase tracking-widest"
              style={{ fontSize: "14px" }}
            >
              {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
            </span>
          )}
        </div>

        {/* Empty state */}
        {itemCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-full"
              style={{ border: "1px solid rgba(240, 240, 245, 0.15)" }}
            >
              <EmptyBagIcon />
            </div>
            <div className="flex flex-col gap-2">
              <p
                className="font-subhead font-bold text-text-primary"
                style={{ fontSize: "22px" }}
              >
                Your cart is empty.
              </p>
              <p
                className="font-body text-text-muted"
                style={{ fontSize: "16px" }}
              >
                Add a Litsaber to get started.
              </p>
            </div>
            <Link
              href="/shop/litsaber-og"
              className="font-label font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90 active:opacity-75 px-10 py-4 rounded-md"
              style={{ fontSize: "14px", backgroundColor: "#00E5FF" }}
            >
              SHOP NOW →
            </Link>
          </div>
        ) : (
          <>
            {/* ── Mobile layout ── */}
            <div className="flex flex-col lg:hidden gap-5">
              {/* Items list */}
              <ul
                className="rounded-[10px] overflow-hidden divide-y divide-white/[0.06]"
                style={{
                  backgroundColor: "#0F0824",
                  border: "1px solid rgba(0, 229, 255, 0.2)",
                }}
              >
                {items.map((line) => (
                  <li key={line.id} className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      {/* Thumbnail */}
                      <div
                        className="flex-shrink-0 rounded-md overflow-hidden"
                        style={{ width: 72, height: 72, backgroundColor: "#120F2C" }}
                      >
                        <Image
                          src={line.image}
                          alt={line.title}
                          width={72}
                          height={72}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Text block + trash */}
                      <div className="flex-1 min-w-0 flex flex-col" style={{ minHeight: "72px" }}>
                        {/* Title + variant */}
                        <p
                          className="font-subhead font-bold text-text-primary leading-tight"
                          style={{ fontSize: "16px" }}
                        >
                          {line.title}
                        </p>
                        <p
                          className="font-label text-text-muted uppercase tracking-widest mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {line.variantTitle} × {line.qty}
                        </p>
                        {line.qty > 1 && (
                          <p className="font-label text-text-muted mt-1" style={{ fontSize: "11px" }}>
                            Buy {line.qty} Litsabers, Save ${getTierSavings(line.qty).toFixed(2)}
                          </p>
                        )}

                        {/* Price left, trash right — bottom of the text block */}
                        <div className="flex items-end justify-between mt-auto pt-2">
                          <span
                            className="font-label font-bold"
                            style={{ fontSize: "14px", color: "#00E5FF" }}
                          >
                            ${getTierPrice(line.qty).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(line.id)}
                            aria-label={`Remove ${line.title} from cart`}
                            className="text-text-muted hover:text-text-primary transition-colors duration-150 p-1"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Order summary group */}
              <div
                className="flex flex-col items-center mx-auto mt-4"
                style={{ width: "100%", maxWidth: "100%", gap: "15px" }}
              >
                {/* Promo code strip */}
                <button
                  type="button"
                  className="font-label font-bold text-accent-cyan hover:opacity-80 transition-opacity duration-150 flex items-center justify-center w-full"
                  style={{
                    fontSize: "12px",
                    height: "48px",
                    border: "1px solid #2D2D2D",
                    background: "#081D2F",
                    borderRadius: "5px",
                    letterSpacing: "0.1em",
                  }}
                >
                  + HAVE A PROMO CODE?
                </button>

                {/* Summary rows */}
                <div className="flex flex-col gap-0 w-full">
                  <MobileSummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                  <MobileSummaryRow label="Shipping" value="CALCULATED AT CHECKOUT" muted />
                  <MobileSummaryRow label="Estimate Tax" value="CALCULATED AT CHECKOUT" muted noBorder />
                </div>

                {/* Total row */}
                <div
                  className="flex justify-between items-center w-full pt-4"
                  style={{ borderTop: "1px solid rgba(240, 240, 245, 0.10)" }}
                >
                  <span
                    className="font-body font-bold text-text-primary"
                    style={{ fontSize: "20px" }}
                  >
                    Total
                  </span>
                  <span
                    className="font-body font-bold text-text-primary"
                    style={{ fontSize: "20px" }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Checkout button */}
                <button
                  type="button"
                  className="w-full py-4 font-label font-bold text-white rounded-md transition-opacity hover:opacity-90 active:opacity-75 uppercase tracking-widest"
                  style={{
                    fontSize: "16px",
                    backgroundColor: "#EC5793",
                    textShadow: "0 0 10px rgba(236, 87, 147, 0.7)",
                  }}
                >
                  SECURE CHECKOUT
                </button>

                {/* Trust badges */}
                <TrustBadges />

                {/* Continue shopping */}
                <Link
                  href="/shop/litsaber-og"
                  className="font-label text-text-muted hover:text-accent-cyan transition-colors duration-150 uppercase tracking-widest"
                  style={{ fontSize: "12px" }}
                >
              ← CONTINUE SHOPPING
                </Link>
              </div>
            </div>

            {/* ── Desktop layout ── */}
            <div className="hidden lg:flex flex-row gap-8 items-start">
              {/* Left column: items table */}
              <div className="flex-[61]">
                <div
                  className="rounded-[10px] overflow-hidden"
                  style={{
                    backgroundColor: "#0F0824",
                    border: "1px solid rgba(0, 229, 255, 0.2)",
                  }}
                >
                  {/* Column headers */}
                  <div
                    className="flex items-start"
                    style={{
                      padding: "10px 20px",
                      borderBottom: "1px solid rgba(240, 240, 245, 0.08)",
                    }}
                  >
                    <span
                      className="font-label text-accent-cyan uppercase tracking-widest"
                      style={{ fontSize: "13px", flex: "1 0 0" }}
                    >
                      PRODUCT
                    </span>
                    <span
                      className="font-label text-accent-cyan uppercase tracking-widest text-left"
                      style={{ fontSize: "13px", width: "100px" }}
                    >
                      PRICE
                    </span>
                    <span
                      className="font-label text-accent-cyan uppercase tracking-widest text-left"
                      style={{ fontSize: "13px", width: "100px" }}
                    >
                      TOTAL
                    </span>
                    <span style={{ width: "50px" }} />
                  </div>

                  {/* Item rows */}
                  <ul className="divide-y divide-white/[0.06]">
                    {items.map((line) => (
                      <li key={line.id}>
                        <div
                          className="flex items-start justify-between"
                          style={{ padding: "30px 20px" }}
                        >
                          {/* Product column */}
                          <div className="flex gap-4 items-start min-w-0" style={{ flex: "1 0 0" }}>
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
                            <div className="flex flex-col min-w-0 flex-1">
                              <p
                                className="font-subhead font-bold text-text-primary leading-tight"
                                style={{ fontSize: "16px" }}
                              >
                                {line.title}
                              </p>
                              <p
                                className="font-label text-text-muted mt-0.5"
                                style={{ fontSize: "14px" }}
                              >
                                {line.variantTitle} × {line.qty}
                              </p>
                              {line.qty > 1 && (
                                <p className="font-label text-text-muted mt-1" style={{ fontSize: "12px" }}>
                                  Buy {line.qty} Litsabers, Save ${getTierSavings(line.qty).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Price column */}
                          <span
                            className="font-label text-text-muted text-left"
                            style={{ fontSize: "15px", width: "100px" }}
                          >
                            ${line.price.toFixed(2)}
                          </span>

                          {/* Total column */}
                          <span
                            className="font-label font-bold text-text-primary text-left"
                            style={{ fontSize: "15px", width: "100px" }}
                          >
                            ${getTierPrice(line.qty).toFixed(2)}
                          </span>

                          {/* Remove column */}
                          <div className="flex justify-center" style={{ width: "50px", paddingLeft: "5px" }}>
                            <button
                              onClick={() => removeItem(line.id)}
                              aria-label={`Remove ${line.title} from cart`}
                              className="opacity-75 hover:opacity-100 transition-all duration-200 group"
                             
                            >
                              <Image
                                src="/images/icons/close-svgrepo-com 1.svg"
                                alt="Remove"
                                width={16}
                                height={16}
                                className="transition-all duration-200 group-hover:[filter:invert(79%)_sepia(97%)_saturate(1000%)_hue-rotate(152deg)_brightness(102%)_contrast(105%)]"
                              />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Continue shopping */}
                <div className="mt-4">
                  <Link
                    href="/shop/litsaber-og"
                    className="font-label text-text-muted hover:text-accent-cyan transition-colors duration-150 uppercase tracking-widest"
                    style={{ fontSize: "12px" }}
                  >
                    ← CONTINUE SHOPPING
                  </Link>
                </div>
              </div>

              {/* Right column: order summary */}
              <div className="flex-[39]">
                <div
                  className="rounded-[10px] p-6 flex flex-col gap-4"
                  style={{
                    backgroundColor: "#110826",
                    border: "1px solid rgba(0, 229, 255, 0.2)",
                  }}
                >
                  <h2
                    className="font-subhead font-bold text-accent-cyan uppercase tracking-wider"
                    style={{ fontSize: "20px" }}
                  >
                    ORDER SUMMARY
                  </h2>

                  <div className="flex flex-col gap-2">
                    <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                    <SummaryRow label="Shipping" value="AT CHECKOUT" muted />
                    <SummaryRow label="Estimated tax" value="AT CHECKOUT" muted noBorder/>
                  </div>

                  {/* Promo code strip */}
                  <button
                    type="button"
                    className="font-label font-bold text-accent-cyan hover:opacity-80 transition-opacity duration-150 flex items-center justify-start w-full"
                    style={{
                      fontSize: "12px",
                      height: "50px",
                      border: "1px solid #2D2D2D",
                      padding: "0px 10px 0px 10px",
                      borderRadius:"5px",
                      background: "#081D2F",
                      letterSpacing: "0.1em",
                    }}
                  >
                    + HAVE A PROMO CODE?
                  </button>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span
                      className="font-body font-bold text-text-primary"
                      style={{ fontSize: "18px" }}
                    >
                      Total
                    </span>
                    <span
                      className="font-body font-bold text-text-primary"
                      style={{ fontSize: "18px" }}
                    >
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout button */}
                  <button
                    type="button"
                    className="w-full py-4 font-label font-bold text-white rounded-md transition-opacity hover:opacity-90 active:opacity-75 uppercase tracking-widest"
                    style={{
                      fontSize: "16px",
                      backgroundColor: "#EC5793",
                      textShadow: "0 0 10px rgba(236, 87, 147, 0.7)",
                    }}
                  >
                    SECURE CHECKOUT
                  </button>

                  <TrustBadges />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MobileSummaryRow({
  label,
  value,
  muted = false,
  noBorder = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  noBorder?: boolean;
}) {
  return (
    <div
      className="flex justify-between items-center py-2"
      style={noBorder ? undefined : { borderBottom: "1px solid rgba(240, 240, 245, 0.06)" }}
    >
      <span
        className="font-body text-text-muted"
        style={{ fontSize: "14px" }}
      >
        {label}
      </span>
      <span
        className={`font-body uppercase tracking-wider ${muted ? "text-text-muted" : "text-text-primary font-bold"}`}
        style={{ fontSize: muted ? "10px" : "14px" }}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  muted = false,
  noBorder = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  noBorder?: boolean;
}) {
  return ( 
    <div className="flex justify-between items-center py-2"
       style={noBorder ? undefined : { borderBottom: "1px solid rgba(240, 240, 245, 0.06)" }}
      >
      <span
        className="font-body text-text-muted uppercase tracking-widest"
        style={{ fontSize: "13px" }}
      >
        {label}
      </span>
      <span
        className={`font-body uppercase tracking-wider ${muted ? "text-text-muted" : "text-text-primary font-bold"}`}
        style={{ fontSize: muted ? "12px" : "13px" }}
      >
        {value}
      </span>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function EmptyBagIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      stroke="rgba(240,240,245,0.35)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
