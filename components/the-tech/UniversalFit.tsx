"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  FIT_EYEBROW,
  FIT_HEADLINE_LINE1,
  FIT_HEADLINE_ACCENT,
  FIT_BODY,
  FIT_BODY_2,
  FIT_BODY_3,
  CART_SIZES_LABEL,
  CART_LINEUP_IMAGE_SRC,
  CART_LINEUP_IMAGE_ALT,
} from "./the-tech.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function UniversalFit() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-black"
      aria-label="Universal fit"
    >
       <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        {/* Centered header block */}
        <div className="flex flex-col items-center text-center gap-5 mb-12">
          <motion.p
            className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {FIT_EYEBROW}
          </motion.p>

          <motion.h2
            className="font-display text-h3 lg:text-h1 text-text-primary leading-[1.05]"
            className="font-display font-bold uppercase leading-[normal] max-w-[350px] lg:max-w-[810px]"
            style={{ fontSize: "clamp(45px, 6.5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          >
            {FIT_HEADLINE_LINE1}{" "}
            <span
              className="text-accent-cyan"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
              className="text-white"
              style={{ textShadow: "0 0 50px rgba(0, 229, 255, 0.75)" }}
            >
            {FIT_HEADLINE_LINE1}
            </span>
                 <span
                className="text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
              >
              {FIT_HEADLINE_ACCENT}
            </span>
          </motion.h2>

          <motion.div
            className="flex flex-col gap-3 max-w-[720px]"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
              {FIT_BODY}
            </p>
            <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
              {FIT_BODY_2}
            </p>
            <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
              {FIT_BODY_3}
            </p>
          </motion.div>
        </div>

        {/* Cart sizes diagram */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          <p className="font-label text-eyebrow tracking-[0.2em] uppercase text-text-muted">
            {CART_SIZES_LABEL}
          </p>

          <div className="relative w-full rounded-card overflow-hidden border border-border-pill">
            {CART_LINEUP_IMAGE_SRC ? (
              <div className="relative w-full aspect-[16/5]">
                <Image
                  src={CART_LINEUP_IMAGE_SRC}
                  alt={CART_LINEUP_IMAGE_ALT}
                  fill
                  className="object-contain object-center"
                />
              </div>
            ) : (
              <div className="w-full aspect-[16/5] bg-surface-card flex items-center justify-center">
                <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase">
                  Cart Lineup Diagram
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}