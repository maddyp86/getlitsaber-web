"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  SELL_THROUGH_HEADLINE,
  SELL_THROUGH_ACCENT,
  SELL_THROUGH_CARDS,
} from "./wholesale.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function renderEmphasis(text: string) {
  return text.split("**").map((segment, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-white">
        {segment}
      </strong>
    ) : (
      segment
    )
  );
}

function IconLifestyle() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" stroke="#00E5FF" strokeWidth="1.5" />
      <path d="M9 14l3.5 3.5L19 10" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEngineered() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 4v4M14 20v4M4 14h4M20 14h4" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="14" r="4" stroke="#00E5FF" strokeWidth="1.5" />
    </svg>
  );
}

function IconGift() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="4" y="13" width="20" height="12" rx="1.5" stroke="#00E5FF" strokeWidth="1.5" />
      <rect x="7" y="9" width="14" height="4" rx="1" stroke="#00E5FF" strokeWidth="1.5" />
      <path d="M14 9V25M14 9c0 0-2-5 2-5s2 5 2 5" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconRepeat() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M6 14a8 8 0 0116 0" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 14a8 8 0 01-16 0" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 10l3 4-4 1M9 18l-3-4 4-1" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = {
  lifestyle: IconLifestyle,
  engineered: IconEngineered,
  gift: IconGift,
  repeat: IconRepeat,
} as const;

export default function SellThrough() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden w-full bg-[#150C2D]"
      aria-label="Built to sell through"
    >
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        {/* Centered headline */}
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <motion.h2
            className="font-display font-bold uppercase"
            style={{ fontSize: "clamp(45px, 6.5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <span
              className="text-white"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.75)" }}
            >
              {SELL_THROUGH_HEADLINE}
            </span>{" "}
            <span
              className="text-accent-cyan"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
            >
              {SELL_THROUGH_ACCENT}
            </span>
          </motion.h2>
        </div>

        {/* 2×2 card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SELL_THROUGH_CARDS.map((card, i) => {
            const Icon = ICONS[card.icon];
            return (
              <motion.div
                key={card.title}
                className="flex flex-col gap-4 p-6 lg:p-8 rounded-card border border-[#1E1040]"
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
              >
                <Icon />
                <h3 className="font-body font-bold text-white leading-tight" style={{ fontSize: "clamp(20px, 2vw, 30px)" }}>
                  {card.title}
                </h3>
                <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
