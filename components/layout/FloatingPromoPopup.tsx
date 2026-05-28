"use client";

import { useEffect } from "react";
import { usePromoPopup } from "@/lib/hooks/usePromoPopup";
import WaitlistForm from "@/components/forms/WaitlistForm";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";

export default function FloatingPromoPopup() {
  const { shouldShow, dismiss, markSubscribed } = usePromoPopup();

  // Lock scroll on mobile only while visible
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
    if (shouldShow && isMobile) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, [shouldShow]);

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
     * Always in the DOM so the hook tracks state across navigation.
     * Mobile: full-screen blocking overlay (matches AgeGateModal pattern).
     * Desktop (lg+): small corner card, fixed bottom-right, slide-in from right.
     */
    <>
      <style>{`
        /* Mobile: full-screen blocking overlay */
        .promo-popup-wrapper {
          position: fixed;
          heigh:100%;
          inset: 0;
          z-index: var(--z-modal, 200);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(5, 5, 16, 0.80);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          pointer-events: auto;
          opacity: 1;
          transition: opacity 0.25s ease;
        }
        .promo-popup-wrapper[aria-hidden="true"] {
          opacity: 0;
          pointer-events: none;
        }
        .promo-popup-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 32px;
          border-radius: 20px;
          border: 1px solid rgba(0, 229, 255, 0.20);
          background: #0F0F1F;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        /* Desktop (lg+): restore corner card, slide-in from right */
        @media (min-width: 1024px) {
          .promo-popup-wrapper {
            inset: unset;
            bottom: 24px;
            right: 24px;
            width: 400px;
            max-width: calc(100vw - 32px);
            background-color: transparent;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            align-items: unset;
            justify-content: unset;
            transform: translateX(0);
            transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .promo-popup-wrapper[aria-hidden="true"] {
            opacity: 1;
            transform: translateX(calc(100% + 48px));
          }
          .promo-popup-card {
            max-width: 100%;
            border-radius: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .promo-popup-wrapper {
            transition: opacity 0.25s ease !important;
            transform: none !important;
          }
        }
      `}</style>

      <div
        className="promo-popup-wrapper z-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Get $10 off your first Litsaber"
        aria-hidden={!shouldShow}
        // Mobile: clicking the backdrop dismisses; desktop: no backdrop to click
        onClick={dismiss}
      >
        {/* Card — stop propagation so clicking inside doesn't dismiss */}
        <div
          className="promo-popup-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Close promo popup"
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded-sm"
            style={{ fontSize: "18px", lineHeight: 1 }}
            tabIndex={shouldShow ? 0 : -1}
          >
            ✕
          </button>

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
            <p className="font-label text-text-muted" style={{ fontSize: "12px" }}>
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
      </div>
    </>
  );
}
