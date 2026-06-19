"use client";

import posthog from "posthog-js";

/**
 * Promote the current anonymous person to an identified person keyed on email.
 * Flushes the SDK's stored first-touch props ($initial_referring_domain,
 * $initial_utm_*) onto the person, which is what powers channel type.
 * Idempotent within a page load. Normalizes email so casing does not split
 * a person. No-ops on the server or before PostHog has initialized.
 */
export function identifyByEmail(rawEmail: string): void {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;

  const email = rawEmail.trim().toLowerCase();
  if (!email) return;

  posthog.identify(email, { email });
}

/**
 * Stable device-level anonymous id for the cart attribute the purchase webhook
 * echoes back as distinct_id. Unlike get_distinct_id(), $device_id never becomes
 * the email after identify(), so no PII reaches the checkout URL. PostHog merges
 * this device id into the identified person, so the server purchase still
 * resolves to the right person and channel. Returns null if unavailable, and the
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
