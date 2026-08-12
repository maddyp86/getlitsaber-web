"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FAQ_HEADLINE, FAQ_ITEMS } from "./affiliates.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AffiliatesFaq() {
  const prefersReduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section
      className="relative w-full bg-background-elevated py-16 lg:py-[120px]"
      aria-label="Affiliate program questions"
    >
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-7 px-content lg:gap-11">
        <motion.h2
          className="text-center font-display font-bold leading-[1.06] text-text-primary drop-shadow-[0_0_60px_rgba(0,229,255,0.35)]"
          style={{ fontSize: "clamp(30px, 5.2vw, 75px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {FAQ_HEADLINE}
        </motion.h2>

        <div className="border-t border-border-pill">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `affiliate-faq-panel-${i}`;
            return (
              <div key={item.question} className="border-b border-border-pill">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className={`flex w-full items-center justify-between gap-4 py-[18px] text-left font-label font-bold tracking-[0.02em] transition-colors duration-200 lg:py-[22px] ${
                    isOpen
                      ? "text-accent-cyan drop-shadow-[0_0_24px_rgba(0,229,255,0.4)]"
                      : "text-text-primary hover:text-accent-cyan"
                  }`}
                  style={{ fontSize: "clamp(13px, 1.4vw, 16px)" }}
                >
                  {item.question}
                  {/* Plus that rotates to a minus */}
                  <span
                    aria-hidden="true"
                    className="relative h-3.5 w-3.5 shrink-0"
                  >
                    <span className="absolute left-0 top-[6.2px] h-[1.6px] w-3.5 bg-accent-cyan" />
                    <span
                      className="absolute left-0 top-[6.2px] h-[1.6px] w-3.5 bg-accent-cyan transition-transform duration-300"
                      style={{
                        transform: isOpen ? "rotate(0deg)" : "rotate(90deg)",
                        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: prefersReduced ? 0 : 0.3, ease: EASE },
                        opacity: { duration: prefersReduced ? 0 : 0.22 },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className="pb-[22px] font-body leading-relaxed text-text-muted"
                        style={{ fontSize: "clamp(14px, 1.2vw, 16px)" }}
                      >
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
