"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EARN_CARDS } from "./affiliates.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AffiliateEarnings() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative w-full pb-12 lg:pb-[90px]" aria-label="What you earn">
      <div className="mx-auto w-full max-w-content px-content">
        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-3 lg:gap-5">
          {EARN_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              className="rounded-card border border-border-pill bg-surface-card p-5 transition-colors duration-200 hover:border-accent-cyan-alpha-50 lg:p-7"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-subhead font-bold leading-none text-accent-cyan drop-shadow-[0_0_26px_rgba(0,229,255,0.55)]"
                  style={{ fontSize: "clamp(38px, 4vw, 44px)" }}
                >
                  {card.value}
                </span>
                <span className="font-label text-xs tracking-[0.06em] text-text-muted">
                  {card.unit}
                </span>
              </div>
              <div className="mt-4 mb-2 font-label text-[11px] uppercase tracking-[0.12em] text-text-primary">
                {card.label}
              </div>
              <p className="font-body text-[15px] leading-relaxed text-text-muted">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
