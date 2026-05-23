"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  EYEBROW,
  HEADLINE,
  SUBHEADLINE,
  EXPLODED_IMAGE,
  FEATURE_CARDS,
  HERO_STATS,
  SPEC_TILES,
} from "./underthehood.content";

interface UnderTheHoodMobileProps {
  className?: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, prefersReduced]);

  return { ref, visible };
}

export default function UnderTheHoodMobile({ className }: UnderTheHoodMobileProps) {
  const { ref: headRef, visible: headVisible } = useScrollReveal(0.1);
  const { ref: cardsRef, visible: cardsVisible } = useScrollReveal(0.1);
  const { ref: statsRef, visible: statsVisible } = useScrollReveal(0.2);
  const { ref: tilesRef, visible: tilesVisible } = useScrollReveal(0.1);

  return (
    <section
      id="under-the-hood"
      className={`w-full overflow-hidden${className ? ` ${className}` : ""}`}
      style={{ background: "linear-gradient(180deg, #0F0824 0%, #20093E 97.64%)" }}
      aria-label="Under The Hood — Engineering"
    >
      {/* Atmospheric glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(157, 95, 255, 0.15)",
          filter: "blur(80px)",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="relative" style={{ zIndex: 1, padding: "80px 20px 0" }}>
        {/* Header group */}
        <div ref={headRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center", marginBottom: "40px" }}>
          <motion.p
            className="font-label text-accent-cyan tracking-widest uppercase"
            style={{ fontSize: "12px", letterSpacing: "0.2em" }}
            initial={{ opacity: 0, y: 16 }}
            animate={headVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {EYEBROW}
          </motion.p>

          <motion.h2
            className="font-display font-bold text-text-primary"
            style={{ fontSize: "40px", lineHeight: "1.05", letterSpacing: "-0.01em" }}
            initial={{ opacity: 0, y: 24 }}
            animate={headVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            {HEADLINE}
          </motion.h2>

          <motion.p
            className="font-body text-text-secondary"
            style={{ fontSize: "16px", lineHeight: "1.6" }}
            initial={{ opacity: 0, y: 16 }}
            animate={headVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            {SUBHEADLINE}
          </motion.p>
        </div>

        {/* Exploded view image */}
        <motion.div
          style={{ width: "100%", position: "relative", marginBottom: "48px" }}
          initial={{ opacity: 0, y: 24 }}
          animate={headVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        >
          <Image
            src={EXPLODED_IMAGE.src}
            alt={EXPLODED_IMAGE.alt}
            width={375}
            height={280}
            sizes="375px"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </motion.div>

        {/* Feature cards — single column */}
        <div
          ref={cardsRef}
          style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "60px" }}
        >
          {FEATURE_CARDS.map((card, i) => {
            const isCyan = card.accent === "cyan";
            const accentColor = isCyan ? "#00E5FF" : "#EC5793";

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={cardsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.65, delay: 0.08 * i, ease: EASE }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  padding: "20px",
                  background: "#100B25",
                  borderTop: `1px solid #2D1C53`,
                  borderRight: `1px solid #2D1C53`,
                  borderBottom: `1px solid #2D1C53`,
                  borderLeft: `4px solid ${accentColor}`,
                  borderRadius: "16px",
                }}
              >
                <h3
                  className="font-label tracking-widest uppercase"
                  style={{ fontSize: "20px", color: accentColor, fontWeight:700, lineHeight:"normal" }}
                >
                  {card.title}
                </h3>
                <p className="font-body text-text-secondary" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats banner + spec tiles */}
      <div style={{ padding: "0 20px 80px" }}>
        {/* Stats callout banner */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 24 }}
          animate={statsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            background: "linear-gradient(135deg, #2EF1EB 0%, #3B37A5 100%)",
            borderRadius: "16px",
            padding: "32px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.value} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                className="font-body text-text-primary"
                style={{ fontSize: "14px", opacity: 0.85 }}
              >
                {stat.preLabel}
              </span>
              <span
                className="font-display font-bold text-text-primary"
                style={{ fontSize: "64px", lineHeight: "1", letterSpacing: "-0.02em" }}
              >
                {stat.value}
              </span>
              <span
                className="font-body font-bold text-text-primary"
                style={{ fontSize: "16px", lineHeight: "1.3", whiteSpace: "pre-line" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Spec tiles — 2-column grid, last tile full-width if odd */}
        <div
          ref={tilesRef}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
        >
          {SPEC_TILES.map((tile, i) => {
            const isLastOdd = i === SPEC_TILES.length - 1 && SPEC_TILES.length % 2 !== 0;

            return (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 20 }}
                animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "18px",
                  border: "1px solid #2D1C53",
                  borderRadius: "16px",
                  gridColumn: isLastOdd ? "1 / -1" : undefined,
                  maxWidth: isLastOdd ? "50%" : undefined,
                }}
              >
                <Image
                  src={tile.icon}
                  alt={tile.iconAlt}
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
                <p className="font-body font-bold text-text-primary" style={{ fontSize: "20px", lineHeight: 1.2 }}>
                  {tile.value}
                </p>
                <p className="font-body text-text-secondary" style={{ fontSize: "13px" }}>
                  {tile.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
