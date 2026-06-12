"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useIsAgeGateVisible, useIsCartOpen, useActiveModal } from "@/lib/ui/store";
import { track, EVENTS } from "@/lib/analytics/events";

const COOKIE_SEEN = "litsaber_promo_seen";
const COOKIE_SUBSCRIBED = "litsaber_promo_subscribed";
const DELAY_MS = 12_000;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeDays: number) {
  const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

function isSuppressedRoute(pathname: string): boolean {
  return pathname === "/cart" || pathname === "/activate" || pathname.startsWith("/checkout");
}

export interface UsePromoPopupReturn {
  shouldShow: boolean;
  dismiss: (method: "close_button" | "backdrop" | "escape") => void;
  markSubscribed: () => void;
}

export function usePromoPopup(): UsePromoPopupReturn {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isAgeGateVisible = useIsAgeGateVisible();
  const isCartOpen = useIsCartOpen();
  const activeModal = useActiveModal();

  // Keep refs to blocking conditions so the timer/exit-intent callbacks can
  // re-evaluate without stale closure values.
  const pathnameRef = useRef(pathname);
  const isCartOpenRef = useRef(isCartOpen);
  const activeModalRef = useRef(activeModal);

  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);
  useEffect(() => { isCartOpenRef.current = isCartOpen; }, [isCartOpen]);
  useEffect(() => { activeModalRef.current = activeModal; }, [activeModal]);

  // Arm triggers once the age gate has been dismissed.
  const armedRef = useRef(false);
  const triggerRef = useRef<"time_delay" | "exit_intent">("time_delay");

  useEffect(() => {
    // Skip if: already armed, age gate still up, cookies block us.
    if (isAgeGateVisible) return;
    if (armedRef.current) return;
    if (getCookie(COOKIE_SUBSCRIBED)) return;
    if (getCookie(COOKIE_SEEN)) return;

    armedRef.current = true;

    function tryShow() {
      // Re-evaluate ALL blocking conditions at fire time.
      if (getCookie(COOKIE_SUBSCRIBED)) return;
      if (getCookie(COOKIE_SEEN)) return;
      if (isSuppressedRoute(pathnameRef.current)) return;
      if (isCartOpenRef.current) return;
      if (activeModalRef.current) return;

      setVisible(true);
      track(EVENTS.promo_popup_shown, { trigger: triggerRef.current });
    }

    triggerRef.current = "time_delay";
    const timerId = setTimeout(tryShow, DELAY_MS);

    // Exit-intent: desktop (fine pointer) only, cursor leaving top of viewport.
    let exitBound = false;
    function handleExitIntent(e: MouseEvent) {
      if (e.clientY < 20) {
        clearTimeout(timerId);
        document.removeEventListener("mouseleave", handleExitIntent);
        exitBound = false;
        triggerRef.current = "exit_intent";
        tryShow();
      }
    }

    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      document.addEventListener("mouseleave", handleExitIntent);
      exitBound = true;
    }

    return () => {
      clearTimeout(timerId);
      if (exitBound) {
        document.removeEventListener("mouseleave", handleExitIntent);
      }
      // Reset so the next run (triggered by age gate confirm) can re-arm.
      armedRef.current = false;
    };
  // Only re-run when the age gate transitions from visible → dismissed.
  // All other blocking conditions are checked via refs at fire time.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAgeGateVisible]);

  // If a blocking surface (cart, modal) opens while popup is visible, hide it
  // temporarily. It will not re-appear — the user will need to reload and wait
  // again. (Prevents visible stacking.)
  useEffect(() => {
    if (visible && (isCartOpen || activeModal)) {
      setVisible(false);
    }
  }, [visible, isCartOpen, activeModal]);

  // Suppress on suppressed routes.
  const shouldShow = visible && !isSuppressedRoute(pathname);

  function dismiss(method: "close_button" | "backdrop" | "escape") {
    setCookie(COOKIE_SEEN, "true", 3);
    setVisible(false);
    track(EVENTS.promo_popup_dismissed, { method });
  }

  function markSubscribed() {
    setCookie(COOKIE_SUBSCRIBED, "true", 365);
    setVisible(false);
  }

  return { shouldShow, dismiss, markSubscribed };
}
