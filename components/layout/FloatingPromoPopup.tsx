"use client";

import { useEffect } from "react";
import { usePromoPopup } from "@/lib/hooks/usePromoPopup";
import WaitlistForm from "@/components/forms/WaitlistForm";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";

export default function FloatingPromoPopup() {
  const { shouldShow, dismiss, markSubscribed } = usePromoPopup();

  // Lock body scroll while visible
  useEffect(() => {
    if (shouldShow) {
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

  if (!shouldShow) return null;

  return (
    /* Full-screen blocking overlay — user must dismiss before interacting */
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(10, 5, 24, 0.80)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={dismiss}
      aria-hidden="true"
    >
      {/* Card — stop propagation so clicking inside doesn't dismiss */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get $10 off your first Litsaber"
        className="relative flex flex-col gap-5 p-8 w-full"
        style={{
          maxWidth: "400px",
          borderRadius: "20px",
          border: "1px solid rgba(0, 229, 255, 0.20)",
          background: "#0F0F1F",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close promo popup"
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded-sm"
          style={{ fontSize: "18px", lineHeight: 1 }}
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
  );
}
