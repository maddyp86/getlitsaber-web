"use client";

import { useEffect } from "react";
import { trackWhenReady, EVENTS } from "@/lib/analytics/events";
import { activationSource } from "@/lib/analytics/attribution";

const ACTIVATED_FLAG = "litsaber_activated";

// Invisible client component: fires device_activated on the first /activate
// visit in this browser. trackWhenReady queues the event until PostHog has
// initialized (it used to fire on a 500ms timer with track(), which silently
// dropped the event whenever PostHog was slower, while still setting the flag).
// Every event in an owner session also carries is_owner_visit (set in
// lib/analytics/attribution.ts), so owner traffic separates from shoppers.
export default function ActivationTracker() {
  useEffect(() => {
    try {
      if (localStorage.getItem(ACTIVATED_FLAG) !== null) return;
      localStorage.setItem(ACTIVATED_FLAG, "1");
    } catch {
      // storage unavailable: still record this activation
    }
    trackWhenReady(EVENTS.device_activated, {
      activation_source: activationSource(window.location.search),
      is_first_activation: true,
    });
  }, []);

  return null;
}
