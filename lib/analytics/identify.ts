"use client";

import posthog from "posthog-js";

// No identify(): personal data (email, names) never goes to PostHog. A buyer
// stays on their anonymous device id, which the cart carries to the orders
// webhook as posthog_distinct_id, so the purchase still lands on the person
// who browsed.

/**
 * Stable device-level anonymous id for the cart attribute the purchase webhook
 * echoes back as distinct_id. Unlike get_distinct_id(), $device_id never becomes
 * an email, so no personal data reaches the checkout URL, and it is the same id
 * the browsing events use, so the server purchase joins the browsing person. Returns null if unavailable, and the
 * caller must then write NO distinct_id attribute (never fall back to the email).
 */
export function getCartAnalyticsId(): string | null {
  if (typeof window === "undefined") return null;
  if (!posthog.__loaded) return null;

  const deviceId = posthog.get_property("$device_id");
  if (typeof deviceId === "string" && deviceId.length > 0 && !deviceId.includes("@")) {
    return deviceId;
  }
  return null;
}
