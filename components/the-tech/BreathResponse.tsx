"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  BREATH_EYEBROW,
  BREATH_HEADLINE,
  BREATH_BODY_BLOCKS,
  BREATH_RESPONSE_IMAGE_SRC,
  BREATH_RESPONSE_IMAGE_ALT,
} from "./the-tech.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function BreathResponse() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-background-primary"
      aria-label="Breath response"
    >
      <div className="mx-auto w-full max-w-[1250px] px-5 lg:px-0 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Copy — left on desktop, top on mobile */}
          <div className="flex flex-col gap-5 lg:flex-1">
            <motion.p
              className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {BREATH_EYEBROW}
            </motion.p>

            <motion.h2
              className="font-display text-h3 lg:text-h1 text-text-primary leading-[1.05]"
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            >
              {BREATH_HEADLINE}
            </motion.h2>

            <div className="flex flex-col gap-4 mt-2">
              {BREATH_BODY_BLOCKS.map((block, i) => (
                <motion.p
                  key={i}
                  className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
                  initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: 0.1 + i * 0.1, ease: EASE }}
                >
                  {block}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Image — right on desktop, below on mobile */}
          <motion.div
            className="relative mt-10 lg:mt-0 lg:flex-1 w-full aspect-[3/4] lg:aspect-[4/5] rounded-card overflow-hidden"
            initial={prefersReduced ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
          >
            {BREATH_RESPONSE_IMAGE_SRC ? (
              <Image
                src={BREATH_RESPONSE_IMAGE_SRC}
                alt={BREATH_RESPONSE_IMAGE_ALT}
                fill
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-surface-card flex items-center justify-center rounded-card border border-border-pill">
                <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase">
                  Rainbow Device Image
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
