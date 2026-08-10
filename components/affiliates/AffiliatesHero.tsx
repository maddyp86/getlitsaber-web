"use client";

import Image from "next/image";
import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AffiliateCta from "./AffiliateCta";
import {
  HERO_EYEBROW,
  HERO_HEADLINE_LINE1,
  HERO_HEADLINE_ACCENT,
  HERO_BODY,
  HERO_CTA_PRIMARY,
  HERO_CTA_SECONDARY,
  HERO_TRUST_MARKERS,
  HERO_IMAGE_SRC,
  HERO_IMAGE_ALT,
  LOGIN_URL,
} from "./affiliates.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AffiliatesHero() {
  const prefersReduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section
      className="relative w-full pt-[132px] pb-16 lg:pt-[190px] lg:pb-[110px]"
      aria-label="Litsaber affiliate program"
    >
      <div className="mx-auto w-full max-w-content px-content">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-20">
          {/* Copy column */}
          <div className="flex flex-col items-start gap-[18px] lg:gap-[22px]">
            <motion.span
              className="font-label font-bold text-xs tracking-[0.12em] uppercase text-accent-cyan"
              {...rise(0)}
            >
              {HERO_EYEBROW}
            </motion.span>

            <motion.h1
              className="font-display font-bold leading-[0.98] tracking-tight text-text-primary"
              style={{ fontSize: "clamp(40px, 7.4vw, 115px)" }}
              {...rise(0.08)}
            >
              <span className="block drop-shadow-[0_0_60px_rgba(240,240,245,0.3)]">
                {HERO_HEADLINE_LINE1}
              </span>
              <span className="block text-accent-cyan drop-shadow-[0_0_70px_rgba(0,229,255,0.45)]">
                {HERO_HEADLINE_ACCENT}
              </span>
            </motion.h1>

            <motion.p
              className="font-body text-body-sm lg:text-body text-text-muted leading-relaxed max-w-[520px]"
              {...rise(0.16)}
            >
              {HERO_BODY}
            </motion.p>

            <motion.div
              className="mt-1 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:w-auto"
              {...rise(0.24)}
            >
              <AffiliateCta withArrow>{HERO_CTA_PRIMARY}</AffiliateCta>
              <AffiliateCta href={LOGIN_URL} variant="outline">
                {HERO_CTA_SECONDARY}
              </AffiliateCta>
            </motion.div>

            <motion.ul
              className="mt-1.5 flex flex-wrap items-center gap-x-[10px] gap-y-1.5 lg:gap-x-[14px] lg:gap-y-2"
              {...rise(0.32)}
            >
              {HERO_TRUST_MARKERS.map((marker, i) => (
                <Fragment key={marker}>
                  {i > 0 && (
                    <li
                      aria-hidden="true"
                      className="font-label text-[11px] text-border-pill"
                    >
                      ·
                    </li>
                  )}
                  <li className="font-label text-[11px] uppercase tracking-[0.12em] text-text-muted">
                    {marker}
                  </li>
                </Fragment>
              ))}
            </motion.ul>
          </div>

          {/* Product shot — 4:5, sized by the box so there is no layout shift */}
          <motion.div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-border-pill shadow-[0_0_90px_rgba(0,229,255,0.12)]"
            initial={prefersReduced ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
          >
            <Image
              src={HERO_IMAGE_SRC}
              alt={HERO_IMAGE_ALT}
              fill
              priority
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
