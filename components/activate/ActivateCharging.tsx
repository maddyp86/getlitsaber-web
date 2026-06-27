"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SECTION_IDS, ACTIVATE_CHARGING } from "./activate.content";
import ChargingAnimation from "./ChargingAnimation";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function renderCaption(text: string) {
  const target = "you\u2019re fully charged";
  const idx = text.indexOf(target);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-text-primary">{target}</strong>
      {text.slice(idx + target.length)}
    </>
  );
}

export default function ActivateCharging() {
  const prefersReduced = useReducedMotion();
  const {
    eyebrow, title, intro, cardLabel, cardBadge, tagline,
    points, callout, barLabel, caption, media,
  } = ACTIVATE_CHARGING;

  return (
    <section
      id={SECTION_IDS.charging}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-[#000000]"
    >
      <div className="mx-auto w-full items-center max-w-content px-content">

        {/* Section header */}
        <motion.p
          className="font-label text-eyebrow text-center uppercase text-accent-cyan mb-2"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          className="font-display font-bold text-center uppercase leading-[1.1] text-white mb-2"
          style={{ fontSize: "clamp(45px, 6vw, 75px)", textShadow: "0 0 50px rgba(255,255,255,0.50)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="font-body text-body-sm text-center lg:text-body text-text-secondary leading-relaxed mb-16 max-w-content"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        >
          {intro}
        </motion.p>

        {/* Two-column: content left, media right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Content column */}
          <div className="flex flex-col items-start gap-8 flex-[1_0_0] min-w-0">

            {/* Charging block (no card chrome per Figma) */}
            <motion.div
              className="flex flex-col justify-center items-start gap-5 flex-[1_0_0] self-stretch min-w-0"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            >
              {/* Header: label + badge */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="font-subhead font-bold text-white leading-none"
                  style={{ fontSize: "clamp(25px, 3vw, 35px)" }}
                >
                  {cardLabel}
                </span>
                <span className="rounded-[4px] border border-accent-cyan text-accent-cyan bg-[rgba(0,229,255,0.08)] px-3 py-1 font-label text-[10px] tracking-[0.15em] uppercase shrink-0">
                  {cardBadge}
                </span>
              </div>

              {/* Tagline */}
              <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                {tagline}
              </p>

              {/* Bullets with divider lines */}
              <ul className="flex flex-col mt-2" aria-label="Charging instructions">
                {points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-4 border-b border-[#113757] last:border-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[6px] shrink-0 text-accent-cyan"
                      style={{ fontSize: "10px", lineHeight: 1 }}
                    >
                      &#9654;
                    </span>
                    <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                      {"lead" in point && point.lead ? (
                        <>
                          <strong className="font-semibold text-text-primary">{point.lead}</strong>
                          {point.text}
                        </>
                      ) : (
                        point.text
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not charging callout — magenta accent */}
            <motion.div
              className="w-full border-l-4 border-accent-magenta bg-[rgba(255,0,229,0.06)] px-5 py-4"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              <p className="font-body text-body-sm leading-relaxed text-[#CCC]">
                <span className="text-accent-magenta font-bold">{callout.lead} </span>
                {callout.body}
                <Link
                  href={callout.linkHref}
                  className="text-accent-cyan underline underline-offset-2 hover:no-underline"
                >
                  {callout.linkLabel}
                </Link>
                {callout.bodyAfter}
              </p>
            </motion.div>

          </div>

      {/* Media column */}
          <motion.div
            className="mt-12 lg:mt-0 lg:w-[380px] xl:w-[440px] shrink-0"
            initial={prefersReduced ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
          >
            {media.src ? (
              <div className="relative w-full aspect-[9/16] lg:aspect-[3/4] rounded-card overflow-hidden">
                <video
                  src={media.src}
                  poster={media.poster ?? undefined}
                  aria-label={media.alt}
                  controls
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="w-full aspect-[9/16] lg:aspect-[3/4] rounded-card border border-border-pill bg-[#000000] flex flex-col items-center justify-center gap-3">
                <span className="font-label text-eyebrow tracking-[0.12em] uppercase text-text-muted">
                  media pending hosting
                </span>
              </div>
            )}
          </motion.div>

        </div>

        {/* Full-width charging bar below both columns */}
        <motion.div
          className="mt-12 lg:mt-20"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >

          {/* Axis labels: BUTTON / CHARGING BEHAVIOR / TIP */}
          <div className="grid grid-cols-3 mb-3" aria-hidden="true">
            <span className="font-label text-[12px] tracking-[0.15em] uppercase text-accent-cyan text-left">
              &#9711; {barLabel.left}
            </span>
            <span className="font-label text-[12px] tracking-[0.2em] uppercase text-text-muted text-center">
              {barLabel.center}
            </span>
            <span className="font-label text-[12px] tracking-[0.15em] uppercase text-accent-cyan text-right">
              {barLabel.right} &#9711;
            </span>
          </div>

          {/* Animated charging bar */}
          <ChargingAnimation />

          {/* Centered italic caption */}
          <p className="font-body text-body-sm italic text-text-muted leading-relaxed text-center mx-auto mt-8 max-w-[640px]">
            {renderCaption(caption)}
          </p>

        </motion.div>
      </div>
    </section>
  );
}