"use client";

import { motion, useReducedMotion } from "framer-motion";
import { STATS_BAR } from "./wholesale.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WholesaleStatsBar() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-[#150C2D]"
      aria-label="Wholesale at a glance"
    >
      {/* Top rule */}
      <div className="h-px w-full bg-[#2D1C53]" aria-hidden="true" />

      <motion.div
        className="mx-auto w-full max-w-[1250px] py-8 px-[20px] lg:px-[60px]"
        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
   <div className="grid grid-cols-2 lg:grid-cols-4">
  {STATS_BAR.map((stat, i) => (
    <div
      key={stat.label}
      className={[
        "flex flex-col items-center justify-center text-center gap-1 py-8 px-4 border-[#4A4A4A]",
        // vertical divider — mobile: after left-column items; desktop: after all but the last
        i % 2 === 0 ? "border-r" : "",
        i !== STATS_BAR.length - 1 ? "lg:border-r" : "lg:border-r-0",
        // horizontal divider between the two mobile rows only
        i >= 2 ? "border-t lg:border-t-0" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
              <span className="font-body font-bold text-accent-cyan leading-none" style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}>
                {stat.value}
              </span>
              <span className="font-label text-eyebrow text-text-muted tracking-[0.15em] uppercase mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom rule */}
      <div className="h-px w-full bg-[#2D1C53]" aria-hidden="true" />
    </section>
  );
}
