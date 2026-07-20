"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FAQ_HEADLINE_PART1,
  FAQ_HEADLINE_ACCENT,
  FAQ_ITEMS,
} from "./rebate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function RebateFaq() {
  const prefersReduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section
      className="relative isolate overflow-hidden w-full bg-background-primary"
      aria-label="Rebate frequently asked questions"
    >
      <div className="mx-auto w-full max-w-[860px] px-content py-section-y-mobile lg:py-section-y">
        <motion.h2
          className="font-display font-bold text-center uppercase leading-[1.1] mb-12"
          style={{ fontSize: "clamp(40px, 5vw, 68px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="text-white">{FAQ_HEADLINE_PART1}</span>{" "}
          <span
            className="text-accent-cyan"
            style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
          >
            {FAQ_HEADLINE_ACCENT}
          </span>
        </motion.h2>

        <div className="flex flex-col">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.question}
                className="border-b border-[#2A2145]"
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="font-label font-bold text-white uppercase tracking-[0.06em] text-body-sm lg:text-body group-hover:text-accent-cyan transition-colors duration-200">
                    {item.question}
                  </span>
                  <motion.svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="flex-shrink-0 text-accent-cyan"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: prefersReduced ? 0 : 0.35, ease: EASE },
                        opacity: { duration: prefersReduced ? 0 : 0.25 },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed pb-6 max-w-[720px]">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
