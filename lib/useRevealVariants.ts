"use client";

import { useReducedMotion } from "framer-motion";

export function useRevealVariants() {
  const prefersReduced = useReducedMotion();

  return {
    hidden: prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };
}
