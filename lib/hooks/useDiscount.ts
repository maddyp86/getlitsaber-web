"use client";

import { useEffect } from "react";

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
    if (code) {
      sessionStorage.setItem(SESSION_KEY, code);
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
    return `${checkoutUrl}${sep}discount=${encodeURIComponent(code)}`;
  } catch {
    // sessionStorage unavailable (private browsing edge cases)
    return checkoutUrl;
  }
}
