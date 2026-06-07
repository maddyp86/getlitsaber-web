"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  NOW_EYEBROW,
  NOW_HEADLINE,
  NOW_BODY,
  NOW_WILD_EYEBROW,
  EVENT_IMAGES,
} from "./about.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function renderEmphasis(text: string) {
  return text.split("**").map((segment, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-white">
        {segment}
      </strong>
    ) : (
      <span key={i}>{segment}</span>
    )
  );
}

function renderParagraphs(text: string) {
  return text.split("\n\n").map((para, i) => (
    <p key={i} className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
      {renderEmphasis(para)}
    </p>
  ));
}

export default function AboutNow() {
  const prefersReduced = useReducedMotion();
  return (
    <section
      className="relative w-full bg-[#000000]"
      aria-label="Where we are now"
    >
      <div className="mx-auto w-full max-w-content px-content py-[100px]">
        <motion.p
          className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-magenta mb-4"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {NOW_EYEBROW}
        </motion.p>
        <motion.h2
          className="font-display font-bold leading-[1.1] text-white mb-8"
          style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
        >
          {NOW_HEADLINE}
        </motion.h2>
        <motion.div
          className="flex flex-col gap-5 mb-14"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {renderParagraphs(NOW_BODY)}
        </motion.div>

        {/* Event gallery */}
        <motion.p
          className="font-label text-eyebrow tracking-[0.2em] uppercase text-text-muted mb-6"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {NOW_WILD_EYEBROW}
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EVENT_IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              className="relative w-full aspect-[3/4] sm:h-[313px] rounded-md overflow-hidden bg-surface-card"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}