"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  DEMAND_EYEBROW,
  DEMAND_HEADLINE_LINE1,
  DEMAND_HEADLINE_ACCENT,
  DEMAND_BODY,
  DEMAND_IMAGE_SRC,
  DEMAND_IMAGE_ALT,
  GEOMETRIC_SHAPE_SRC,
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

export default function DemandSection() {
  const prefersReduced = useReducedMotion();

  return (
  <section
  className="relative isolate overflow-hidden w-full bg-[linear-gradient(180deg,#150C2D_100%,#000_0%)]"
  aria-label="Demand is already there"
>
      {/* Geometric shape #1 — top-left, behind everything */}
<div
  className="absolute pointer-events-none -z-10"
  style={{ width: "540px", height: "451px", top: 0, left: -100, opacity: 0.4 }}
  aria-hidden="true"
>
  <Image src="/images/tech/geometric-shape.png" alt="" fill sizes="540px" style={{ objectFit: "contain" }} />
</div>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[400px]"
        style={{
          background: "linear-gradient(0deg, rgba(75,47,129,0.4) 0%, transparent 100%)",
          filter: "blur(80px)",
        }}
      />

      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Image — left on desktop, top on mobile */}
          <motion.div
            className="relative w-full max-w-[420px] mx-auto lg:mx-0 lg:w-[420px] lg:flex-shrink-0 aspect-[3/4] rounded-card overflow-hidden"
            initial={prefersReduced ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            {DEMAND_IMAGE_SRC ? (
              <Image
                src={DEMAND_IMAGE_SRC}
                alt={DEMAND_IMAGE_ALT}
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-surface-card flex items-center justify-center border border-border-pill">
                {/* TODO: replace with Jack Herer Experience photo */}
                <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase text-center px-4">
                  Demand Image
                </span>
              </div>
            )}
          </motion.div>

          {/* Copy — right on desktop, below on mobile */}
          <div className="flex flex-col gap-5 mt-10 lg:mt-0 lg:flex-1">
            <motion.p
              className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {DEMAND_EYEBROW}
            </motion.p>

            <motion.h2
              className="font-display font-bold uppercase leading-[1.1]"
              style={{ fontSize: "clamp(45px, 6.5vw, 75px)" }}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            >
              <span
                className="block text-white"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.75)" }}
              >
                {DEMAND_HEADLINE_LINE1}
              </span>
              <span
                className="block text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
              >
                {renderEmphasis(DEMAND_HEADLINE_ACCENT)}
              </span>
            </motion.h2>

            {DEMAND_BODY.map((block, i) => (
              <motion.p
                key={i}
                className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: 0.2 + i * 0.08, ease: EASE }}
              >
                {renderEmphasis(block)}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
