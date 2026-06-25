"use client";
import { useEffect } from "react";
import { track, trackWhenReady, EVENTS } from "@/lib/analytics/events";

const SESSION_KEY = "litsaber_discount";

/**
 * Reads ?discount=CODE from the URL on landing and persists it to sessionStorage.
 * Only writes when the param is present; never clears an existing stored code.
 * Mount this once per app (CartHydrator) so it runs on every page load.
 */
export function useDiscountCapture(): void {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("discount")?.trim();
    if (!code) return;

    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem(SESSION_KEY);
    } catch {
      // sessionStorage unavailable (private-mode edge); treat as no stored value
    }
    if (code === stored) return; // genuinely-NEW only: same code already captured this session

    try {
      sessionStorage.setItem(SESSION_KEY, code);
    } catch {
      // can't persist; still fire once so the arrival is measured
    }

    // Fires immediately when posthog.__loaded is true, falling back to
    // onFeatureFlags only if it isn't. This decouples capture from the
    // flags round-trip, so a flags/decide failure no longer silently
    // drops the event. Matches the standard near-mount pattern (ADR-005).
    trackWhenReady(EVENTS.promo_code_captured, { code });
  }, []);
}

/**
 * Reads the stored discount code (if any) and appends it to the given
 * Shopify checkoutUrl as a ?discount=CODE query param. Returns the URL
 * unchanged if no code is stored.
 */
export function appendDiscountToCheckoutUrl(checkoutUrl: string): string {
  try {
    const code = sessionStorage.getItem(SESSION_KEY);
    if (!code) return checkoutUrl;
    const sep = checkoutUrl.includes("?") ? "&" : "?";
    return `${checkoutUrl}${sep}discount=${encodeURIComponent(code)}`;
  } catch {
    // sessionStorage unavailable (private browsing edge cases)
    return checkoutUrl;
  }
}