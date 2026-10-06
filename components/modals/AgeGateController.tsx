"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAgeGateActions } from "@/lib/ui/store";
import { trackWhenReady, EVENTS } from "@/lib/analytics/events";
import {
  AGE_CONFIRMED_EVENT,
  AGE_OK_ATTR,
  hasAgeCookie,
  isAgeGateExempt,
} from "@/lib/ageGate";

declare global {
  interface Window {
    __ageGate?: { confirmedAt?: number; tracked?: boolean };
  }
}

/**
 * Client half of the age gate (markup and confirm live in AgeGateModal and
 * lib/ageGate.ts). Keeps the gate in sync on client-side navigation, mirrors
 * it into the UI store, and sends age_gate_confirmed exactly once, including
 * for a confirm that happened before hydration.
 */
export default function AgeGateController() {
  const pathname = usePathname();
  const { setAgeGateVisible } = useAgeGateActions();

  useEffect(() => {
    function onConfirmed() {
      setAgeGateVisible(false);
      const state = (window.__ageGate ??= {});
      if (state.tracked) return;
      state.tracked = true;
      // trackWhenReady: PostHog init is deferred, so the confirm can land first.
      trackWhenReady(EVENTS.age_gate_confirmed, {});
    }
    if (window.__ageGate?.confirmedAt) onConfirmed();
    window.addEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
    return () => window.removeEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
  }, [setAgeGateVisible]);

  useEffect(() => {
    const html = document.documentElement;
    const gate = document.getElementById("age-gate");
    const ok = hasAgeCookie(document.cookie) || isAgeGateExempt(pathname);
    if (ok) {
      html.setAttribute(AGE_OK_ATTR, "");
    } else if (gate) {
      // e.g. landed on exempt /activate, then navigated into the store.
      html.removeAttribute(AGE_OK_ATTR);
      gate.removeAttribute("aria-hidden");
      gate.querySelector<HTMLElement>("[data-age-confirm]")?.focus({ preventScroll: true });
    }
    setAgeGateVisible(!ok && !!gate);
  }, [pathname, setAgeGateVisible]);

  return null;
}
