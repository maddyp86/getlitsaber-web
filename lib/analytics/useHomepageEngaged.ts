"use client";

import { useEffect, useRef } from "react";
import { track, EVENTS } from "@/lib/analytics/events";

const SESSION_FLAG = "litsaber_hp_engaged";
const DWELL_MS = 10_000;

// scrollSelector: CSS selector for the element whose intersection triggers 'scroll'.
// Returns a callback to pass as onClick to a CTA for the 'cta_click' trigger path.
export function useHomepageEngaged(scrollSelector: string): () => void {
  const firedRef = useRef(false);

  function fire(trigger: "scroll" | "dwell" | "cta_click") {
    if (firedRef.current) return;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_FLAG)) return;

    firedRef.current = true;
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(SESSION_FLAG, "1");
    }
    track(EVENTS.homepage_engaged, { trigger });
  }

  useEffect(() => {
    // Skip if already fired this session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_FLAG)) {
      firedRef.current = true;
      return;
    }

    // Dwell timer — cleared on unmount AND on fire
    const timerId = setTimeout(() => {
      fire("dwell");
    }, DWELL_MS);

    // Scroll trigger — look up the target inside useEffect where DOM is available
    let observer: IntersectionObserver | null = null;
    const target = document.querySelector(scrollSelector);
    if (target) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            fire("scroll");
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(target);
    }

    // Cleanup always clears both — covers unmount before dwell fires
    return () => {
      clearTimeout(timerId);
      observer?.disconnect();
    };
    // scrollSelector is a stable string constant passed at call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return function onCtaClick() {
    fire("cta_click");
  };
}
