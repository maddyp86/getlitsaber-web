"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  CONVERSATION_EYEBROW,
  CONVERSATION_HEADLINE,
  CONVERSATION_BODY,
  CONVERSATION_IMAGE_SRC,
  CONVERSATION_IMAGE_ALT,
} from "./affiliates.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ConversationStarter() {
  const prefersReduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section
      className="relative w-full py-16 lg:py-[110px]"
      aria-label="Selling the Litsaber"
    >
      <div className="mx-auto w-full max-w-content px-content">
        <div className="flex flex-col gap-6 lg:gap-[34px]">
          <div className="flex flex-col gap-3.5">
            <motion.span
              className="font-label font-bold text-xs uppercase tracking-[0.12em] text-accent-cyan"
              {...rise(0)}
            >
              {CONVERSATION_EYEBROW}
            </motion.span>
            <motion.h2
              className="font-display font-bold leading-[1.06] text-text-primary drop-shadow-[0_0_60px_rgba(240,240,245,0.25)]"
              style={{ fontSize: "clamp(30px, 5.2vw, 75px)" }}
              {...rise(0.08)}
            >
              {CONVERSATION_HEADLINE}
            </motion.h2>
            <motion.p
              className="max-w-[900px] font-body text-body-sm lg:text-[17px] leading-relaxed text-text-muted"
              {...rise(0.14)}
            >
              {CONVERSATION_BODY}
            </motion.p>
          </div>

          <motion.div
            className="relative h-[220px] w-full overflow-hidden rounded-card border border-border-pill shadow-[0_0_90px_rgba(157,95,255,0.14)] lg:h-[400px]"
            initial={prefersReduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
          >
            <Image
              src={CONVERSATION_IMAGE_SRC}
              alt={CONVERSATION_IMAGE_ALT}
              fill
              sizes="(min-width: 1024px) 1250px, 100vw"
              className="object-cover object-[50%_42%]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
