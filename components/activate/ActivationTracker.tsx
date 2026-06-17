"use client";

import { useEffect } from "react";
import { track, EVENTS } from "@/lib/analytics/events";

const ACTIVATED_FLAG = "litsaber_activated";

// Invisible client component — fires device_activated on first /activate page visit only.
// Uses a timeout to ensure PostHog is initialized, rather than relying on onFeatureFlags().
// localStorage guard survives navigation; no useRef needed.
export default function ActivationTracker() {
  useEffect(() => {
    console.log("[ActivationTracker] useEffect mounted");

    // If already activated (flag is set), don't fire again
    const flagValue = localStorage.getItem(ACTIVATED_FLAG);
    console.log("[ActivationTracker] localStorage flag:", flagValue);

    if (flagValue !== null) {
      console.log("[ActivationTracker] Already activated, bailing early");
      return;
    }

    // Fire after delay to ensure PostHog is ready
    const timer = setTimeout(() => {
      console.log("[ActivationTracker] Firing device_activated");

      // Safely check PostHog loaded state
      if (typeof window !== "undefined" && (window as Window & { posthog?: { __loaded?: boolean } }).posthog) {
        console.log("[ActivationTracker] posthog.__loaded:", window.posthog?.__loaded);
      }

      const utmSource = new URLSearchParams(window.location.search).get("utm_source");
      const activation_source = utmSource === "packaging" ? "packaging_qr" : "direct";

      console.log("[ActivationTracker] activation_source:", activation_source);
      console.log("[ActivationTracker] is_first_activation: true");

      track(EVENTS.device_activated, {
        activation_source,
        is_first_activation: true,
      });

      localStorage.setItem(ACTIVATED_FLAG, "1");
      console.log("[ActivationTracker] Flag set, event fired");
    }, 500); // 500ms to ensure PostHog init on cold loads

    return () => clearTimeout(timer);
  }, []);

  return null;
}