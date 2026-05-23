"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MODES, PULL_BUILD } from "./modes.content";
import { useModesState } from "./useModesState";

interface ThreeModesMobileProps {
  className?: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CONTENT_FADE = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit:   { opacity: 0, y: -4, transition: { duration: 0.2 } },
};

const IMAGE_FADE = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: EASE } },
  exit:   { opacity: 0, transition: { duration: 0.2 } },
};

export default function ThreeModesMobile({ className }: ThreeModesMobileProps) {
  const { activeMode, activePullBuild, setMode, togglePullBuild } = useModesState();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lightstreakVisible, setLightstreakVisible] = useState(false);
  const lightstreakRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = lightstreakRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLightstreakVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cardBorder = (i: number): React.CSSProperties =>
    activeMode === i
      ? { borderTop: "6px solid #00E5FF", borderRight: "1px solid #00E5FF", borderBottom: "1px solid #00E5FF", borderLeft: "1px solid #00E5FF", borderRadius: "20px" }
      : hoveredCard === i
        ? { border: "1px solid #00E5FF", borderRadius: "20px" }
        : { border: "1px solid #303030", borderRadius: "20px" };

  return (
    <section
      id="three-modes"
      className={`w-full bg-background-primary overflow-hidden${className ? ` ${className}` : ""}`}
      aria-label="Pick Your Energy — Three Modes"
    >
      {/* TOP: eyebrow + headline (row) + body */}
      <div className="px-container-mobile pt-[60px]">
        <p className="font-label text-eyebrow text-accent-cyan tracking-widest uppercase mb-[12px]">
          INTERACTIVE LIGHTS
        </p>
        <h2 className="font-display font-bold leading-none text-text-primary mb-[16px]" style={{ fontSize: "45px" }}>
          TEN WAYS TO
          <br />
          <span className="font-accent text-accent-cyan" style={{ fontSize: "45px", fontWeight: 400 }}>
            BE SEEN
          </span>
        </h2>
        <p className="font-body text-text-secondary mb-[32px]" style={{ fontSize: "16px" }}>
          41 individually-addressable LEDs run the full length of the body. Glowstick at the festival. Flashlight in the tent. Signal flare in the crowd. Color-matched to your fit!
        </p>
      </div>

      {/* Lightstreak image — slides LEFT to RIGHT on scroll */}
      <div ref={lightstreakRef} className="relative w-full overflow-hidden mb-[50px]" style={{ height: "258px" }}>
        {reducedMotion ? (
          <img
            src="/images/home/litsaber-lightstreaks-mobile.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.img
            src="/images/home/litsaber-lightstreaks-mobile.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            initial={{ x: "-100%" }}
            animate={lightstreakVisible ? { x: 0 } : { x: "-100%" }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        )}
      </div>

      {/* BOTTOM: Pick Your Energy + mode cards */}
      <div className="px-container-mobile pb-[80px]">
        {/* Sub-section heading */}
        <div className="flex flex-col gap-[12px] mb-[40px] text-center items-center">
          <p className="font-label text-eyebrow text-accent-cyan tracking-widest uppercase">
            THREE MODES
          </p>
          <h3 className="font-display font-bold leading-none text-text-primary" style={{ fontSize: "45px" }}>
            PICK YOUR ENERGY
          </h3>
          <p className="font-body text-text-secondary" style={{ fontSize: "18px" }}>
            Three lighting behaviors built into the device designed to be as dynamic as your social life. Whether you&apos;re at a festival, a party, or just chilling with friends, adapts to every vibe you bring.
          </p>
        </div>

        {/* Mode cards stacked */}
        <div className="flex flex-col gap-[24px]">

          {/* Litsaber Mode card */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setMode(0)}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode(0); } }}
            aria-label="Activate Litsaber Mode"
            style={{ ...cardBorder(0), background: "#100B25", cursor: "pointer", transition: "all 0.3s ease", overflow: "hidden" }}
          >
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4
                className="font-subhead font-bold"
                style={{
                  fontSize: "24px",
                  color: activeMode === 0 ? "#F0F0F5" : "#BABABA",
                  textShadow: activeMode === 0 ? "0px 0px 20px rgba(0,229,255,0.75)" : "none",
                  transition: "color 0.3s, text-shadow 0.3s",
                }}
              >
                LITSABER MODE
              </h4>

              {/* Toggle buttons */}
              <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                {PULL_BUILD.map((pb, i) => {
                  const isActive = activePullBuild === i;
                  return (
                    <button
                      key={pb.label}
                      onClick={(e) => { e.stopPropagation(); if (!isActive) togglePullBuild(); }}
                      aria-pressed={isActive}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        height: "36px",
                        background: isActive ? "rgba(0,229,255,0.20)" : "transparent",
                        border: isActive ? "1px solid #00E5FF" : "1px solid #CCCCCC",
                        borderRadius: "2px",
                        color: isActive ? "#00E5FF" : "#CCCCCC",
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: "13px",
                        fontWeight: 400,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {pb.label}
                    </button>
                  );
                })}
              </div>

              {/* Description */}
              <div style={{ minHeight: "72px" }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-mobile-${activePullBuild}`}
                    variants={CONTENT_FADE}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="font-body"
                    style={{ fontSize: "16px", color: "#F0F0F5" }}
                  >
                    {PULL_BUILD[activePullBuild].description}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Mode image inside card — always shown, swaps on mode change */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "574 / 670" }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={`mode-img-mobile-${activeMode}`}
                  src={MODES[activeMode].image}
                  alt={MODES[activeMode].title}
                  variants={IMAGE_FADE}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Glowstick Mode card */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setMode(1)}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode(1); } }}
            aria-label="Activate Glowstick Mode"
            style={{ ...cardBorder(1), background: "#100B25", cursor: "pointer", transition: "all 0.3s ease", overflow: "hidden" }}
          >
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4
                className="font-subhead font-bold"
                style={{
                  fontSize: "24px",
                  color: activeMode === 1 ? "#F0F0F5" : "#BABABA",
                  textShadow: activeMode === 1 ? "0px 0px 20px rgba(0,229,255,0.75)" : "none",
                  transition: "color 0.3s, text-shadow 0.3s",
                }}
              >
                GLOWSTICK MODE
              </h4>
              <p className="font-body" style={{ fontSize: "16px", color: activeMode === 1 ? "#F0F0F5" : "#CFCFCF" }}>
                {MODES[1].body}
              </p>
            </div>

            {activeMode === 1 && (
              <div style={{ position: "relative", width: "100%", aspectRatio: "574 / 670" }}>
                <img
                  src={MODES[1].image}
                  alt={MODES[1].title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )}
          </div>

          {/* Stealth Mode card */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setMode(2)}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode(2); } }}
            aria-label="Activate Stealth Mode"
            style={{ ...cardBorder(2), background: "#100B25", cursor: "pointer", transition: "all 0.3s ease", overflow: "hidden" }}
          >
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4
                className="font-subhead font-bold"
                style={{
                  fontSize: "24px",
                  color: activeMode === 2 ? "#F0F0F5" : "#BABABA",
                  textShadow: activeMode === 2 ? "0px 0px 20px rgba(0,229,255,0.75)" : "none",
                  transition: "color 0.3s, text-shadow 0.3s",
                }}
              >
                STEALTH MODE
              </h4>
              <p className="font-body" style={{ fontSize: "16px", color: activeMode === 2 ? "#F0F0F5" : "#CFCFCF" }}>
                {MODES[2].body}
              </p>
            </div>

            {activeMode === 2 && (
              <div style={{ position: "relative", width: "100%", aspectRatio: "574 / 670" }}>
                <img
                  src={MODES[2].image}
                  alt={MODES[2].title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
