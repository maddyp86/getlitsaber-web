"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
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



// Maps card.icon → asset path. Keys must match the `icon` values in SELL_THROUGH_CARDS.
const ICONS: Record<string, string> = {
  lifestyle: "/images/icons/heart-like-svgrepo-com 1.png",
  engineered: "/images/icons/tools-svgrepo-com 1.svg",
  gift: "/images/icons/gift-svgrepo-com 1.svg",
  repeat: "/images/icons/repeat-svgrepo-com 1.svg",
};

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
            className="font-display font-bold uppercase leading-[1.1]"
            style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
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
          {SELL_THROUGH_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className="flex flex-col gap-4 p-6 lg:p-8 rounded-card border border-[#113757]"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
            >
              <Image
                src={ICONS[card.icon]}
                alt=""
                width={28}
                height={28}
                aria-hidden="true"
                className="shrink-0"
              />
              <h3
                className="font-body font-bold text-white leading-tight"
                style={{ fontSize: "clamp(20px, 2vw, 30px)" }}
              >
                {card.title}
              </h3>
              <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                {renderEmphasis(card.body)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
