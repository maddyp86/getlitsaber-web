"use client";

import { useEffect } from "react";
import { usePromoPopup } from "@/lib/hooks/usePromoPopup";
import WaitlistForm from "@/components/forms/WaitlistForm";
import { useToastActions } from "@/lib/toast/store";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";
import { track, EVENTS } from "@/lib/analytics/events";
import { identifyByEmail } from "@/lib/analytics/identify";

export default function FloatingPromoPopup() {
  const { shouldShow, dismiss, markSubscribed } = usePromoPopup();
  const { addToast } = useToastActions();

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
      if (e.key === "Escape") dismiss("escape");
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shouldShow, dismiss]);

  return (
    <div
        className="promo-popup-wrapper z-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Get $10 off your first Litsaber"
        aria-hidden={!shouldShow}
        // Mobile: clicking the backdrop dismisses; desktop: no backdrop to click
        onClick={() => dismiss("backdrop")}
      >
        {/* Card — stop propagation so clicking inside doesn't dismiss */}
        <div
          className="promo-popup-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => dismiss("close_button")}
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
            cardless
            onSuccess={(email) => {
              identifyByEmail(email);
              markSubscribed();
              track(EVENTS.promo_email_submitted, { source: WAITLIST_SOURCES.promoPopup });
              addToast({ variant: "success", message: "Check your inbox \u2014 your code\u2019s on the way." });
            }}
            onError={(msg) => {
              addToast({ variant: "error", message: msg });
            }}
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
  );
}
