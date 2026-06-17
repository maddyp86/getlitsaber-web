"use client";

import { useEffect } from "react";
import { track, EVENTS } from "@/lib/analytics/events";

const ACTIVATED_FLAG = "litsaber_activated";

// Invisible client component — fires device_activated on first /activate page visit only.
// Uses a small timeout to ensure PostHog is initialized, rather than relying on onFeatureFlags().
// localStorage guard survives navigation; no useRef needed.
export default function ActivationTracker() {
  useEffect(() => {
    // If already activated (flag is set), don't fire again
    if (localStorage.getItem(ACTIVATED_FLAG) !== null) {
      return;
    }

    // Fire after a small delay to ensure PostHog is ready
    const timer = setTimeout(() => {
      const utmSource = new URLSearchParams(window.location.search).get("utm_source");
      const activation_source = utmSource === "packaging" ? "packaging_qr" : "direct";

      track(EVENTS.device_activated, { 
        activation_source, 
        is_first_activation: true 
      });

      // Set flag after firing
      localStorage.setItem(ACTIVATED_FLAG, "1");
    }, 100); // 100ms is enough for PostHog to init

    return () => clearTimeout(timer);
  }, []);

  return null;
}