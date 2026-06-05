"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FAQ_EYEBROW,
  FAQ_HEADLINE_PART1,
  FAQ_HEADLINE_ACCENT,
  FAQ_ITEMS,
} from "./wholesale.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WholesaleFaq() {
  const prefersReduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section
      className="relative isolate overflow-hidden w-full bg-[#0A0518]"
      aria-label="Frequently asked questions"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[350px] w-full"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(0,229,255,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        {/* Header */}
        <div className="flex item-start flex-col gap-3 mb-14">
          <motion.p
            className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {FAQ_EYEBROW}
          </motion.p>

          <motion.h2
            className="font-display font-bold text-center mx-auto uppercase leading-[1.1]"
            style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          >
            <span
              className="text-white"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.75)" }}
            >
              {FAQ_HEADLINE_PART1}
            </span>{" "}
            <span
              className="text-accent-cyan"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
            >
              {FAQ_HEADLINE_ACCENT}
            </span>
          </motion.h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.num}
                className="border-b border-[#1E1040] first:border-t"
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
                  <div className="flex items-start gap-4 min-w-0">
                    <span className="font-label text-eyebrow tracking-[0.2em] text-accent-cyan uppercase flex-shrink-0 pt-0.5">
                      {item.num}
                    </span>
                    <span
                      className="font-display font-bold text-white uppercase leading-tight group-hover:text-accent-cyan transition-colors duration-200"
                      style={{ fontSize: "clamp(15px, 1.8vw, 20px)" }}
                    >
                      {item.question}
                    </span>
                  </div>

                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="flex-shrink-0 text-text-muted group-hover:text-accent-cyan transition-colors duration-200"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                      <div className="pb-6 pl-[52px] pr-8">
                        <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
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
