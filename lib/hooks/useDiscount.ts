"use client";
import { useEffect } from "react";
import posthog from "posthog-js";
import { track, EVENTS } from "@/lib/analytics/events";
const SESSION_KEY = "litsaber_discount";
/**
 * Reads ?discount=CODE from the URL on landing and persists it to sessionStorage.
 * Only writes when the param is present — never clears an existing stored code.
 * Mount this once per app (CartHydrator) so it runs on every page load.
 */
export function useDiscountCapture(): void {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("discount")?.trim();
    if (code && sessionStorage.getItem(SESSION_KEY) !== code) {
      // Write immediately — auto-apply at checkout depends on this being in
      // storage as early as possible, independent of PostHog readiness.
      sessionStorage.setItem(SESSION_KEY, code);
      // Defer the track() call until PostHog has finished initializing.
      // track() checks posthog.__loaded and silently no-ops at mount because
      // posthog.init() is async. onFeatureFlags fires exactly once per
      // registration, after init completes, so the event reaches PostHog.
      posthog.onFeatureFlags(() => {
        track(EVENTS.promo_code_captured, { code });
      });
    }
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
    return ${checkoutUrl}${sep}discount=${encodeURIComponent(code)};
  } catch {
    // sessionStorage unavailable (private browsing edge cases)
    return checkoutUrl;
  }
}