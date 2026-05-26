"use client";

import { useEffect } from "react";
import { usePromoPopup } from "@/lib/hooks/usePromoPopup";
import WaitlistForm from "@/components/forms/WaitlistForm";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";

export default function FloatingPromoPopup() {
  const { shouldShow, dismiss, markSubscribed } = usePromoPopup();

  // Escape key to dismiss
  useEffect(() => {
    if (!shouldShow) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shouldShow, dismiss]);

  return (
    /*
     * Always rendered in the DOM so the hook's useEffect can track state
     * across navigation. The card itself is conditionally shown via transform.
     * prefers-reduced-motion: swap transform for opacity only.
     */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Get $10 off your first Litsaber"
      aria-hidden={!shouldShow}
      className="promo-popup fixed z-modal flex flex-col gap-5 p-5"
      style={{
        bottom: "50px",
        right: "24px",
        width: "400px",
        maxWidth: "calc(100vw - 32px)",
        borderRadius: "20px",
        border: "1px solid rgba(0, 229, 255, 0.20)",
        background: "#0F0F1F",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        // Transform-based slide-in; CSS handles reduced-motion via class
        transform: shouldShow ? "translateX(0)" : "translateX(calc(100% + 48px))",
        transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: shouldShow ? "auto" : "none",
      }}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .promo-popup {
            transition: opacity 0.25s ease !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Close button — positioned relative to the outer card */}
      <button
        onClick={dismiss}
        aria-label="Close promo popup"
        className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded-sm"
        style={{ fontSize: "18px", lineHeight: 1 }}
        tabIndex={shouldShow ? 0 : -1}
      >
        ✕
      </button>

      {/* WaitlistForm — reused as-is; all content passed as props */}
      <WaitlistForm
        list="general"
        source={WAITLIST_SOURCES.promoPopup}
        eyebrow="/ FIRST ORDER"
        headline="$10 OFF YOUR FIRST LITSABER"
        copy="Drop your email. We'll send a code + early access to the next drop."
        buttonLabel="SEND MY CODE"
        onSuccess={markSubscribed}
        cardless
      />

      {/* Trust block */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p
          className="font-label text-text-muted"
          style={{ fontSize: "12px" }}
        >
          No spam. Unsubscribe anytime.
        </p>
        <p
          className="font-label text-text-muted"
          style={{ fontSize: "11px", letterSpacing: "0.04em" }}
        >
          ✓ AUTO-APPLIED&nbsp;&nbsp;✓ ONE-TIME USE&nbsp;&nbsp;✓ 14-DAY VALID
        </p>
      </div>
    </div>
  );
}
