"use client";

import { useEffect, useState, useCallback, RefObject } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { STAGES } from "./crowd.content";

const STAGE_COUNT = STAGES.length;

export interface UseStageScrollResult {
  activeStage: number;
  scrollToStage: (index: number) => void;
  reducedMotion: boolean;
}

export function useStageScroll(
  outerRef: RefObject<HTMLElement>
): UseStageScrollResult {
  const [activeStage, setActiveStage] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion on mount (client only)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Map 0–1 progress into 0 | 1 | 2 active stage
  const stageProgress = useTransform(
    scrollYProgress,
    [0, 1 / STAGE_COUNT, 2 / STAGE_COUNT, 1],
    [0, 1, 2, 2]
  );

  useMotionValueEvent(stageProgress, "change", (v) => {
    const next = Math.min(Math.round(v), STAGE_COUNT - 1);
    setActiveStage(next);
  });

  const scrollToStage = useCallback(
    (index: number) => {
      const el = outerRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const height = el.offsetHeight;
      window.scrollTo({
        top: top + (index / STAGE_COUNT) * height,
        behavior: "smooth",
      });
    },
    [outerRef]
  );

  return { activeStage, scrollToStage, reducedMotion };
}
