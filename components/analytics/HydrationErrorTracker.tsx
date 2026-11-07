"use client";

import { useEffect } from "react";
import { EVENTS, track } from "@/lib/analytics/events";
import { HYDRATION_ERROR_EVENT, hydrationErrorCode } from "@/lib/analytics/hydration";

/**
 * Sends hydration_failed to PostHog for every React hydration error the head
 * script buffered before this mounted (lib/analytics/hydration.ts), and for
 * any that arrive later. One event per error code per page load.
 */
export default function HydrationErrorTracker() {
  useEffect(() => {
    const seen = new Set<string>();
    const report = (message: string) => {
      const code = hydrationErrorCode(message);
      if (seen.has(code)) return;
      seen.add(code);
      track(EVENTS.hydration_failed, { code, message: message.slice(0, 200) });
    };
    (window.__hydrationErrors ?? []).forEach(report);
    const onError = (e: Event) => report(String((e as CustomEvent<unknown>).detail ?? ""));
    window.addEventListener(HYDRATION_ERROR_EVENT, onError);
    return () => window.removeEventListener(HYDRATION_ERROR_EVENT, onError);
  }, []);

  return null;
}
