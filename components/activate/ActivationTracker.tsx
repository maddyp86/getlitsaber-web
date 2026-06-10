"use client";

import { useEffect, useRef } from "react";
import { trackWhenReady, EVENTS } from "@/lib/analytics/events";

const ACTIVATED_FLAG = "litsaber_activated";

// Invisible client component — fires device_activated on every Activate page mount.
// is_first_activation is true only on the first load per device (localStorage flag).
// Uses trackWhenReady to survive the PostHog-init race at mount time.
export default function ActivationTracker() {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const utmSource = new URLSearchParams(window.location.search).get("utm_source");
    const activation_source = utmSource === "packaging" ? "packaging_qr" : "direct";

    // Read flag BEFORE firing so is_first_activation reflects state at arrival
    const is_first_activation = localStorage.getItem(ACTIVATED_FLAG) === null;

    trackWhenReady(EVENTS.device_activated, { activation_source, is_first_activation });

    // Set AFTER firing — first load reports true, all subsequent loads report false
    localStorage.setItem(ACTIVATED_FLAG, "1");
  }, []);

  return null;
}
