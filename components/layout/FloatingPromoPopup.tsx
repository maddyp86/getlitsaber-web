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
        // Non-modal on every breakpoint: a corner card on desktop, a bottom
        // sheet on mobile, and the page stays scrollable behind both.
        role="dialog"
        aria-modal="false"
        aria-label="Get $5 off your first Litsaber"
        aria-hidden={!shouldShow}
      >
        <div className="promo-popup-card">
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
            headline="$5 OFF YOUR FIRST LITSABER"
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
            <p className="font-label text-text-muted" style={{ fontSize: "11px" }}>
              Applies to a single Litsaber. Not combinable with multi-pack pricing.
            </p>
          </div>
        </div>
      </div>
  );
}
