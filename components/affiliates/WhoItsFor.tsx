"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FIT_LABEL,
  FIT_ITEMS,
  NOFIT_LABEL,
  NOFIT_ITEMS,
} from "./affiliates.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WhoItsFor() {
  const prefersReduced = useReducedMotion();
  const card = (delay: number) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  return (
    <section className="relative w-full pb-16 lg:pb-[110px]" aria-label="Who this is for">
      <div className="mx-auto w-full max-w-content px-content">
        <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-2 lg:gap-5">
          {/* Fit */}
          <motion.div
            className="rounded-card border border-accent-cyan-alpha-50 bg-surface-card p-5 lg:p-7"
            {...card(0)}
          >
            <h2 className="mb-[18px] font-label text-[11px] uppercase tracking-[0.12em] text-accent-cyan">
              {FIT_LABEL}
            </h2>
            <ul className="flex list-none flex-col gap-3">
              {FIT_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-sm leading-6 text-accent-cyan">
                    ✓
                  </span>
                  <span className="font-body text-[15px] leading-relaxed text-text-primary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not a fit */}
          <motion.div
            className="rounded-card border border-cta-alpha-40 bg-surface-card p-5 lg:p-7"
            {...card(0.1)}
          >
            <h2 className="mb-[18px] font-label text-[11px] uppercase tracking-[0.12em] text-cta">
              {NOFIT_LABEL}
            </h2>
            <ul className="flex list-none flex-col gap-3">
              {NOFIT_ITEMS.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-sm leading-6 text-cta">
                    ✕
                  </span>
                  <span className="font-body text-[15px] leading-relaxed text-text-primary">
                    {item.text}
                    {item.link && (
                      <>
                        <Link
                          href={item.link.href}
                          className="text-accent-cyan underline decoration-accent-cyan-alpha-50 underline-offset-[3px] transition-colors duration-200 hover:decoration-accent-cyan"
                        >
                          {item.link.label}
                        </Link>
                        .
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
