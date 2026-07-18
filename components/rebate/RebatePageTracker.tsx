"use client";

import { useEffect } from "react";
import { EVENTS, trackWhenReady } from "@/lib/analytics/events";

const SESSION_KEY = "litsaber_rebate_viewed";
const SOURCE = "show-it-off";

/**
 * Invisible tracker — fires rebate_page_viewed once per browser session.
 * Uses trackWhenReady so the event survives PostHog's async init on cold loads.
 */
export default function RebatePageTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage unavailable (private mode) — still fire the event.
    }
    trackWhenReady(EVENTS.rebate_page_viewed, { source: SOURCE });
  }, []);

  return null;
}
