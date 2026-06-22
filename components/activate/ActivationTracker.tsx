"use client";

import { useEffect } from "react";
import { track, EVENTS } from "@/lib/analytics/events";

const ACTIVATED_FLAG = "litsaber_activated";

// Invisible client component — fires device_activated on first /activate page visit only.
// Uses a timeout to ensure PostHog is initialized.
// localStorage guard survives navigation.
export default function ActivationTracker() {
  useEffect(() => {
    // If already activated (flag is set), don't fire again
    if (localStorage.getItem(ACTIVATED_FLAG) !== null) {
      return;
    }

    // Fire after delay to ensure PostHog is ready
    const timer = setTimeout(() => {
      const utmSource = new URLSearchParams(window.location.search).get("utm_source");
      const activation_source = utmSource === "packaging" ? "packaging_qr" : "direct";

      track(EVENTS.device_activated, {
        activation_source,
        is_first_activation: true,
      });

      localStorage.setItem(ACTIVATED_FLAG, "1");
    }, 500); // 500ms to ensure PostHog init on cold loads

    return () => clearTimeout(timer);
  }, []);

  return null;
}