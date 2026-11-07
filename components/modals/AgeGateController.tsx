"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAgeGateActions } from "@/lib/ui/store";
import { trackWhenReady, EVENTS } from "@/lib/analytics/events";
import {
  AGE_CONFIRMED_EVENT,
  AGE_OK_ATTR,
  installAgeGateDelegate,
  isAgeVerified,
  readCookie,
} from "@/lib/ageGate";

/**
 * Client half of the age gate (markup and confirm live in AgeGateModal and
 * lib/ageGate.ts). Keeps the gate in sync on client-side navigation, mirrors
 * it into the UI store, sends age_gate_confirmed exactly once (including for
 * a confirm that happened before hydration), and installs the delegated
 * confirm handler so the button still works if React re-created it.
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
    // The inline handler is bound to the server-rendered button only. After a
    // hydration failure React rebuilds the page with a fresh button and no
    // handler (and never re-runs inline scripts), which locked visitors out.
    const uninstall = installAgeGateDelegate();
    return () => {
      uninstall();
      window.removeEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
    };
  }, [setAgeGateVisible]);

  useEffect(() => {
    const html = document.documentElement;
    const gate = document.getElementById("age-gate");
    const ok = isAgeVerified({
      cookie: readCookie(),
      pathname,
      confirmedAt: window.__ageGate?.confirmedAt,
    });
    if (ok) {
      html.setAttribute(AGE_OK_ATTR, "");
    } else if (gate) {
      // e.g. landed on exempt /activate, then navigated into the store.
      html.removeAttribute(AGE_OK_ATTR);
      gate.removeAttribute("aria-hidden");
      const confirm = gate.querySelector<HTMLElement>("[data-age-confirm]");
      // A confirm leaves the button pressed and aria-disabled; reset it.
      confirm?.removeAttribute("data-pressed");
      confirm?.removeAttribute("aria-disabled");
      confirm?.focus({ preventScroll: true });
    }
    setAgeGateVisible(!ok && !!gate);
  }, [pathname, setAgeGateVisible]);

  return null;
}
