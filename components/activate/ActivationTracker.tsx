"use client";

import { useEffect } from "react";
import { trackWhenReady, EVENTS } from "@/lib/analytics/events";

const ACTIVATED_FLAG = "litsaber_activated";

// Invisible client component — fires device_activated on first /activate page visit only.
// is_first_activation is true only on the first visit per device (localStorage flag).
// The localStorage guard survives navigation; a useRef alone would reset on remount.
export default function ActivationTracker() {
  useEffect(() => {
    // If already activated (flag is set), don't fire again, even if this component remounts
    if (localStorage.getItem(ACTIVATED_FLAG) !== null) {
      return;
    }

    const utmSource = new URLSearchParams(window.location.search).get("utm_source");
    const activation_source = utmSource === "packaging" ? "packaging_qr" : "direct";

    // First visit — fire with true
    trackWhenReady(EVENTS.device_activated, { 
      activation_source, 
      is_first_activation: true 
    });

    // Set flag after firing
    localStorage.setItem(ACTIVATED_FLAG, "1");
  }, []);

  return null;
}