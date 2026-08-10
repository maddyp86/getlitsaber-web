"use client";

import { motion, useReducedMotion } from "framer-motion";
import AffiliateCta from "./AffiliateCta";
import {
  CTA_HEADLINE,
  CTA_BODY,
  HERO_CTA_PRIMARY,
} from "./affiliates.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AffiliatesCta() {
  const prefersReduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.65, delay, ease: EASE },
  });

  return (
    <section
      className="relative w-full overflow-hidden py-[72px] text-center lg:py-[120px]"
      style={{
        background:
          "radial-gradient(90% 130% at 50% 100%, #1A0F38 0%, #0A0620 60%, #0A0518 100%)",
      }}
      aria-label="Join the affiliate program"
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-[18px] px-content">
        <motion.h2
          className="font-display font-bold leading-[1.06] text-text-primary drop-shadow-[0_0_60px_rgba(240,240,245,0.3)]"
          style={{ fontSize: "clamp(30px, 5.2vw, 75px)" }}
          {...rise(0)}
        >
          {CTA_HEADLINE}
        </motion.h2>
        <motion.p
          className="font-body text-body-sm lg:text-[17px] leading-relaxed text-text-muted"
          {...rise(0.08)}
        >
          {CTA_BODY}
        </motion.p>
        <motion.div className="mt-2 w-full sm:w-auto" {...rise(0.16)}>
          <AffiliateCta withArrow>{HERO_CTA_PRIMARY}</AffiliateCta>
        </motion.div>
      </div>
    </section>
  );
}
