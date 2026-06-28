"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { videoUrl } from "@/lib/media";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const VIDEO_SRC = videoUrl("home/litsaber-party.mp4");

export default function PartyVideo() {
  const textRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const el = textRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      id="party-video"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "800px" }}
      aria-label="The Ultimate Vaping Experience"
    >
      {/* Background video */}
      <div className="absolute inset-0">
        {prefersReduced ? (
          <div className="absolute inset-0 bg-background-primary" />
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}
        {/* Dark overlay for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.7) 100%)" }}
          aria-hidden="true"
        />
      </div>

      {/* Text block */}
      <div
        ref={textRef}
        className="relative z-10 flex items-center justify-center w-full h-full"
        style={{ minHeight: "800px" }}
      >
        <div className="mx-auto w-full max-w-content px-content text-center flex flex-col items-center gap-6">
          <motion.h2
            className="font-display font-bold text-text-primary uppercase"
            style={{
              fontSize: "clamp(45px, 6vw, 75px)",
              lineHeight: "1.05",
              maxWidth: "900px",
              textShadow: "0 0 50px rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0, y: 28 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            THE ULTIMATE VAPING EXPERIENCE DESIGNED FOR THE PARTY
          </motion.h2>
          <motion.p
            className="font-body text-text-primary"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: "1.6",
              maxWidth: "600px",
              opacity: 0.9,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            Made with high-quality material for a superior lighting experience and built for long lasting use in all situations that life throws your way.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
