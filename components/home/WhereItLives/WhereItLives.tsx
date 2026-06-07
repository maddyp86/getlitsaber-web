"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { EYEBROW, HEADLINE, BODY, VENUE_CARDS, VenueCard } from "./whereitlives.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function VenueCardItem({ card }: { card: VenueCard }) {
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-card border border-accent-cyan/20"
      style={{ width: "clamp(220px, 28vw, 365px)", aspectRatio: "3/4" }}
    >
      {/* TODO: replace placeholder */}
      <Image
        src={card.imageSrc}
        alt={card.alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 240px, 365px"
      />
      {/* Label pill */}
      <div
        className="absolute bottom-4 left-4 right-4 flex items-center px-4 py-3 rounded-sm border-l-2 border-l-accent-cyan"
        style={{ background: "rgba(10, 5, 24, 0.85)" }}
      >
        <span className="font-label text-eyebrow text-text-primary uppercase tracking-widest">
          {card.label}
        </span>
      </div>
    </div>
  );
}

export default function WhereItLives() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  const loopedCards = [...VENUE_CARDS, ...VENUE_CARDS];

  return (
    <section
      id="where-it-lives"
      className="relative w-full overflow-hidden bg-background-primary py-section-y-mobile lg:py-section-y"
      aria-label="Where It Lives"
    >
      {/* Background glow orb — mobile */}
      <div
        className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "375px",
          height: "500px",
          background: "rgba(0, 153, 170, 0.25)",
          filter: "blur(150px)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      {/* Background glow orb — desktop */}
      <div
        className="hidden lg:block absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "1442px",
          height: "402px",
          top: "500px",
          background: "rgba(0, 153, 170, 0.39)",
          filter: "blur(150px)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Header block */}
      <div
        ref={ref}
        className="relative z-10 flex flex-col items-center text-center px-content mb-10 lg:mb-16"
      >
        {/* Eyebrow */}
        <motion.p
          className="font-label text-eyebrow text-accent-cyan uppercase tracking-widest mb-4"
          initial={{ opacity: 0, y: 28 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {EYEBROW}
        </motion.p>

        {/* Headline */}
        <motion.h2
          className="font-display max-w-[600px] font-bold text-text-primary uppercase whitespace-pre-line mb-6"
          style={{
            fontSize: "clamp(45px, 5vw, 75px)",
            lineHeight: "1.05",
            textShadow: "0 0 50px rgba(0, 229, 255, 0.75)",
          }}
          initial={{ opacity: 0, y: 28 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          {HEADLINE}
        </motion.h2>
        
        {/* Body */}
        <motion.p
          className="font-body text-text-secondary"
          style={{ fontSize: "clamp(16px, 1.4vw, 20px)", maxWidth: "500px", lineHeight: "1.6" }}
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          {BODY}
        </motion.p>
      </div>

      {/* Ticker strip */}
      <div className="relative z-10 w-full overflow-hidden">
        <div
          className={`flex gap-4 lg:gap-6 ${prefersReduced ? "" : "animate-marquee-slow"}`}
          style={{ width: "max-content" }}
        >
          {loopedCards.map((card, i) => (
            <VenueCardItem key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
