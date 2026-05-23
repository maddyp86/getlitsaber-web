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

interface UnderTheHoodDesktopProps {
  className?: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, prefersReduced]);

  return { ref, visible };
}

function FeatureCardItem({
  card,
  index,
  visible,
}: {
  card: (typeof FEATURE_CARDS)[number];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isCyan = card.accent === "cyan";
  const accentColor = isCyan ? "#00E5FF" : "#FF00E5";
  const borderLeft = `4px solid ${accentColor}`;
  const borderRest = `1px solid ${hovered ? accentColor : "#2D1C53"}`;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, delay: 0.1 * index, ease: EASE }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "24px",
        background: "#110826",
        borderTop: borderRest,
        borderRight: borderRest,
        borderBottom: borderRest,
        borderLeft,
        borderRadius: "16px",
        transition: "border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 8px 30px rgba(${isCyan ? "0,229,255" : "255,0,229"}, 0.12)`
          : "none",
      }}
    >
      <h3
        className="font-label tracking-widest uppercase"
        style={{
          fontSize: "14px",
          color: accentColor,
          letterSpacing: "0.12em",
        }}
      >
        {card.title}
      </h3>
      <p className="font-body text-text-secondary" style={{ fontSize: "16px", lineHeight: "1.6" }}>
        {card.body}
      </p>
    </motion.div>
  );
}

function SpecTileItem({
  tile,
  index,
  visible,
}: {
  tile: (typeof SPEC_TILES)[number];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.65, delay: 0.06 * index, ease: EASE }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "24px",
        background: "#110826",
        border: `1px solid ${hovered ? "#00E5FF" : "#2D1C53"}`,
        borderRadius: "16px",
        transition: "border-color 0.25s ease, transform 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <Image
        src={tile.icon}
        alt={tile.iconAlt}
        width={28}
        height={28}
        style={{ objectFit: "contain" }}
      />
      <p className="font-body font-bold text-text-primary" style={{ fontSize: "22px", lineHeight: 1.2 }}>
        {tile.value}
      </p>
      <p className="font-body text-text-secondary" style={{ fontSize: "15px" }}>
        {tile.label}
      </p>
    </motion.div>
  );
}

export default function UnderTheHoodDesktop({ className }: UnderTheHoodDesktopProps) {
  const { ref: headRef, visible: headVisible } = useScrollReveal(0.1);
  const { ref: cardsRef, visible: cardsVisible } = useScrollReveal(0.1);
  const { ref: statsRef, visible: statsVisible } = useScrollReveal(0.2);
  const { ref: tilesRef, visible: tilesVisible } = useScrollReveal(0.1);

  return (
    <section
      id="under-the-hood"
      className={`w-full bg-[linear-gradient(180deg,#0F0824_0%,#030923_97.64%)] overflow-hidden${className ? ` ${className}` : ""}`}
      aria-label="Under The Hood — Engineering"
    >
      {/* Atmospheric glow orb */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "rgba(157, 95, 255, 0.12)",
          filter: "blur(120px)",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="relative" style={{ zIndex: 1, padding: "120px 100px 0" }}>
        {/* Header group */}
        <div ref={headRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", marginBottom: "60px" }}>
          <motion.p
            className="font-label text-accent-cyan tracking-widest uppercase"
            style={{ fontSize: "14px", letterSpacing: "0.2em" }}
            initial={{ opacity: 0, y: 20 }}
            animate={headVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {EYEBROW}
          </motion.p>

          <motion.h2
            className="font-display font-bold text-text-primary"
            style={{ fontSize: "75px", lineHeight: "1", letterSpacing: "-0.01em", maxWidth: "900px" }}
            initial={{ opacity: 0, y: 28 }}
            animate={headVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            {HEADLINE}
          </motion.h2>

          <motion.p
            className="font-body text-text-secondary"
            style={{ fontSize: "18px", lineHeight: "1.6", maxWidth: "560px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={headVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            {SUBHEADLINE}
          </motion.p>
        </div>

        {/* Exploded view image */}
        <motion.div
          style={{ width: "100%", position: "relative", marginBottom: "80px" }}
          initial={{ opacity: 0, y: 30 }}
          animate={headVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          <Image
            src={EXPLODED_IMAGE.src}
            alt={EXPLODED_IMAGE.alt}
            width={1240}
            height={600}
            sizes="(min-width: 1024px) 1240px, 100vw"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
            priority={false}
          />
        </motion.div>

        {/* Feature cards — 2-column grid */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "120px",
          }}
        >
          {FEATURE_CARDS.map((card, i) => (
            <FeatureCardItem key={card.title} card={card} index={i} visible={cardsVisible} />
          ))}
        </div>
      </div>

      {/* Stats banner + spec tiles — full-width on dark bg */}
      <div style={{ padding: "0 100px 120px" }}>
        {/* Stats callout banner */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={statsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            background: "linear-gradient(135deg, #2EF1EB 0%, #3B37A5 100%)",
            borderRadius: "16px",
            padding: "50px 60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            marginBottom: "40px",
          }}
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.value} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span
                  className="font-body text-text-primary"
                  style={{ fontSize: "18px", opacity: 0.85 }}
                >
                  {stat.preLabel}
                </span>
                <span
                  className="font-display font-bold text-text-primary"
                  style={{ fontSize: "120px", lineHeight: "1", letterSpacing: "-0.02em" }}
                >
                  {stat.value}
                </span>
              </div>
              <span
                className="font-body font-bold text-text-primary"
                style={{
                  fontSize: "28px",
                  lineHeight: "1.25",
                  paddingTop: "60px",
                  maxWidth: "200px",
                  whiteSpace: "pre-line",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Spec tiles — 3-column grid */}
        <div
          ref={tilesRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {SPEC_TILES.map((tile, i) => (
            <SpecTileItem key={tile.label} tile={tile} index={i} visible={tilesVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
