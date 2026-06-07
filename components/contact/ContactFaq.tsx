"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FAQ_HEADLINE_PART1,
  FAQ_HEADLINE_ACCENT,
  FAQ_CATEGORIES,
  type FaqAnswerPart,
} from "./contact.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function renderAnswer(parts: FaqAnswerPart[]) {
  const answerFontSize = "clamp(14px, 1.4vw, 16px)";
  return (
    <div className="flex flex-col gap-3">
      {parts.map((part, i) => {
        if (part.type === "paragraph") {
          return (
            <p
              key={i}
              className="font-body text-text-secondary leading-relaxed"
              style={{ fontSize: answerFontSize }}
            >
              {part.text}
            </p>
          );
        }
        return (
          <ol key={i} className="list-decimal pl-5 flex flex-col gap-1.5">
            {part.items.map((item, j) => (
              <li
                key={j}
                className="font-body text-text-secondary leading-relaxed"
                style={{ fontSize: answerFontSize }}
              >
                {item}
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}

export default function ContactFaq() {
  const prefersReduced = useReducedMotion();

  // Build initial open state: first item of first category is open by default
  const initialOpen: Record<string, boolean> = { "0-0": true };
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(initialOpen);

  const toggle = (key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section
      className="relative w-full bg-background-primary"
      aria-label="Common questions"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[350px] w-full"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(0,229,255,0.04) 0%, transparent 70%)",
        }}
      />

<div className="mx-auto w-full max-w-content px-content py-section-y-mobile lg:py-section-y">
        {/* Header */}
        <div className="flex items-center text-center flex-col mb-14">
          <motion.h2
            className="font-display text-center uppercase font-bold leading-[1.1]"
            style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <span className="text-white">{FAQ_HEADLINE_PART1} </span>
            <span
              className="text-accent-cyan"
              style={{ textShadow: "0 0 40px rgba(0,229,255,0.5)" }}
            >
              {FAQ_HEADLINE_ACCENT}
            </span>
          </motion.h2>
          <motion.p
            className="font-body text-center text-body-sm lg:text-body text-text-secondary mt-4 max-w-[480px]"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            Answers to the questions we hear most. If you don&apos;t see yours,{" "}
            <Link href="#contactForm" className="text-accent-cyan hover:underline underline-offset-4 transition-colors">
              send us a message
            </Link>
            .
          </motion.p>
        </div>
        {/* Categories */}
        <div className="flex flex-col gap-10">
          {FAQ_CATEGORIES.map((category, catIndex) => (
            <motion.div
              key={category.index}
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: catIndex * 0.04, ease: EASE }}
            >
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1035]">
                <span className="font-label text-eyebrow tracking-[0.2em] text-accent-cyan uppercase text-xs flex-shrink-0">
                  {category.index}
                </span>
                <span
                  className="font-subhead font-bold text-white uppercase tracking-[0.08em]"
                  style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
                >
                  {category.title}
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-2">
                {category.items.map((item, rowIndex) => {
                  const key = `${catIndex}-${rowIndex}`;
                  const isOpen = !!openMap[key];

                  return (
                    <div
                      key={key}
                      className={`rounded-[5px] border transition-colors duration-200 ${
                        isOpen ? "border-[#4B2F81] bg-[#0E0826]" : "border-[#113757] bg-[#0A0515]"
                      }`}
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
                        aria-expanded={isOpen}
                      >
                        <span
                          className="font-label font-bold text-white leading-snug group-hover:text-accent-cyan transition-colors duration-200"
                          style={{ fontSize: "clamp(16px, 1.6vw, 18px)" }}
                        >
                          {item.question}
                        </span>
                        <motion.svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="flex-shrink-0 text-text-muted group-hover:text-accent-cyan transition-colors duration-200"
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
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
                            <div className="px-5 pb-5">
                              {renderAnswer(item.answer)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}