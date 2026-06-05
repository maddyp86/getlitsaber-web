"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  MFG_EYEBROW,
  MFG_HEADLINE_PART1,
  MFG_HEADLINE_ACCENT,
  MFG_BODY,
  DOPEX_CARD_EYEBROW,
  DOPEX_CARD_NAME,
  DOPEX_CARD_BODY,
  DOPEX_CARD_LINK,
  DOPEX_CARD_HREF,
  PRODUCTION_IMAGES,
} from "./about.content";

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

export default function AboutManufacturing() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-[#080516]"
      aria-label="Manufacturing"
    >
      <div className="mx-auto w-full max-w-[1000px] px-[20px] lg:px-[40px] py-[100px]">

        <motion.p
          className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-magenta mb-4"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {MFG_EYEBROW}
        </motion.p>

        <motion.h2
          className="font-display font-bold text-white mb-8"
          style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
        >
          {MFG_HEADLINE_PART1}
          <span
            className="text-accent-cyan"
            style={{ textShadow: "0 0 40px rgba(0,229,255,0.5)" }}
          >
            {MFG_HEADLINE_ACCENT}
          </span>
        </motion.h2>

        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed mb-10"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {renderEmphasis(MFG_BODY)}
        </motion.p>

        {/* DOPEX partner card */}
        <motion.div
          className="rounded-xl border border-[#2D1C53] bg-surface-card p-6 lg:p-8 mb-14"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <p className="font-label text-[12px] uppercase text-text-muted mb-3">
            {DOPEX_CARD_EYEBROW}
          </p>
          <h3
            className="font-subhead font-bold text-white mb-3"
            style={{ fontSize: "clamp(22px, 2.8vw, 34px)" }}
          >
            {DOPEX_CARD_NAME}
          </h3>
          <p className="font-body text-body-sm text-text-secondary leading-relaxed mb-4">
            {DOPEX_CARD_BODY}
          </p>
          <a
            href={DOPEX_CARD_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-eyebrow text-accent-cyan tracking-[0.1em] uppercase hover:underline underline-offset-4 transition-colors"
          >
            {DOPEX_CARD_LINK}
          </a>
        </motion.div>

        {/* Production photo gallery */}
        <div
          className={[
            /* Mobile: uniform 2-col grid */
            "grid grid-cols-2 gap-3",
            /* Desktop: asymmetric collage */
            "lg:grid-cols-4 lg:gap-3",
          ].join(" ")}
        >
          {PRODUCTION_IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              className={[
                "relative overflow-hidden rounded-md bg-surface-card",
                /* First image spans 2 rows on desktop */
                i === 0 ? "lg:row-span-2" : "",
                /* Second image spans 2 cols on desktop */
                i === 1 ? "lg:col-span-2" : "",
                /* Standard aspect on mobile */
                "aspect-square",
                /* Taller first card on desktop */
                i === 0 ? "lg:aspect-auto" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: EASE }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover object-center"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
