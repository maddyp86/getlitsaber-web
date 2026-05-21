"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : {
              duration: 0.8,
              delay,
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
      {children}
    </motion.div>
  );
}
