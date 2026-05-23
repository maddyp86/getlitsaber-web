"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MODES, PULL_BUILD } from "./modes.content";
import { useModesState } from "./useModesState";

interface ThreeModesDesktopProps {
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


export default function ThreeModesDesktop({ className }: ThreeModesDesktopProps) {
  const { activeMode, activePullBuild, setMode, togglePullBuild } = useModesState();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lightstreakVisible, setLightstreakVisible] = useState(false);
  const lightstreakRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
      { threshold: 0.3, rootMargin: "0px 0px -100px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardBorder = (i: number): React.CSSProperties => {
  const isActive = activeMode === i;
  const isHovered = hoveredCard === i;
  
  if (isActive || isHovered) {
    return {
      borderTop: "1px solid #00E5FF",
      borderRight: "1px solid #00E5FF",
      borderBottom: "1px solid #00E5FF",
      borderLeft: "6px solid #00E5FF",
      borderRadius: "20px",
      transition: "all 0.3s ease",
    };
  }
  
  return {
    border: "1px solid #303030",
    borderRadius: "20px",
    transition: "all 0.3s ease",
  };
};

  return (
    <section
      id="three-modes"
      className={`w-full bg-background-primary overflow-hidden${className ? ` ${className}` : ""}`}
      aria-label="Pick Your Energy — Three Modes"
    >
      {/* ── TOP BAND ────────────────────────────────────────────────────── */}
     <div className="relative w-full overflow-hidden" style={{ minHeight: "1000px", paddingTop: "80px", paddingBottom: "50px",maxWidth: "100vw" }}>

        {/* Lightstreak — real-space block, clips internally, slides LEFT to RIGHT on scroll */}
        <div
          ref={lightstreakRef}
          style={{ width: "100%", aspectRatio: "143 / 72", overflow: "hidden", position: "absolute", top: "318px", left: 0, zIndex: 0 }}
        >
          {reducedMotion ? (
            <img
              src="/images/home/litsaber-lightstreaks.jpg"
              alt=""
              aria-hidden="true"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <motion.img
              src="/images/home/litsaber-lightstreaks.jpg"
              alt=""
              aria-hidden="true"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              initial={{ x: "-100%" }}
              animate={lightstreakVisible ? { x: 0 } : { x: "-100%" }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          )}
        </div>

        {/* Scrim — left edge readable, fades toward center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1, background: "linear-gradient(to right, #0A0518 0%, rgba(10,5,24,0.9) 35%, rgba(10,5,24,0.4) 60%, transparent 80%)" }}
          aria-hidden="true"
        />

        {/* Text row — headline block LEFT, body RIGHT, inline-flex gap-45 */}
        <div
  className="relative"
  style={{ zIndex: 2, paddingLeft: "100px", paddingRight: "100px", paddingBottom: "440px" }}
>
  <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "45px", justifyContent: "space-between" }}>
    {/* Headline block */}
    <div style={{ display: "flex", flexDirection: "column", flex: "1 0 0", justifyContent: "center", gap: "19px" }}>
      <p className="font-label text-label text-accent-cyan tracking-widest uppercase">
        INTERACTIVE LIGHTS
      </p>
              <div>
                <span
                  className="font-display font-bold text-text-primary block"
                  style={{ fontSize: "80px", lineHeight: "80px" }}
                >
                  TEN WAYS TO
                </span>
                <span
                  className="font-accent text-accent-cyan block"
                  style={{ fontSize: "80px", lineHeight: "80px", fontWeight: 400 }}
                >
                  BE SEEN
                </span>
              </div>
            </div>

            {/* Body text — 554px */}
<p
      className="font-body"
      style={{ flex: "1 0 0", fontSize: "25px", lineHeight: "normal", color: "#D3D3D3" }}
    >
      41 individually-addressable LEDs run the full length of the body. Glowstick at the festival. Flashlight in the tent. Signal flare in the crowd. Color-matched to your fit!
    </p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ width: "100%", minHeight: "1350px", background: "#000000" }}
      >
        {/* Ellipse glow */}
        <div
          className="absolute pointer-events-none"
         style={{
  width: "800px",
  height: "800px",
  borderRadius: "800px",
  background: "rgba(30, 0, 77, 0.50)",
  filter: "blur(150px)",
  top: "240px",      // Changed from 0px
  left: "320px",     // Changed from 0px
  zIndex: 0,
  position: "absolute"
}}
          aria-hidden="true"
        />

        {/* Geometric shape #1 — top-right */}
        <div
          className="absolute pointer-events-none"
          style={{ width: "540px", height: "451px", top: 0, left: "800px", opacity: 0.4, zIndex: 1 }}
          aria-hidden="true"
        >
          <Image src="/images/home/geometric-shape.png" alt="" fill sizes="540px" style={{ objectFit: "contain" }} />
        </div>

        {/* Geometric shape #2 — bottom-left */}
        <div
          className="absolute pointer-events-none"
          style={{ width: "378px", height: "481px", top: "1000px", left: -50, opacity: 0.4, zIndex: 1 }}
          aria-hidden="true"
        >
          <Image src="/images/home/geometric-shape.png" alt="" fill sizes="378px" style={{ objectFit: "contain" }} />
        </div>

        {/* Inner content — centered column, 280px from top */}
        <div
          className="absolute"
          style={{ display: "flex", flexDirection: "column",  alignItems: "center", width: "auto", maxWidth:"1250px", top: "150px", gap: "100px", zIndex: 10 }}
        >
          {/* "Pick Your Energy" heading group */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }}>
            <p className="font-label text-label text-accent-cyan tracking-widest uppercase">
              THREE MODES
            </p>
            <h2
              className="font-display font-bold text-text-primary"
              style={{ fontSize: "75px", lineHeight: "100px", textShadow: "0px 0px 50px rgba(255,255,255,0.75)" }}
            >
              PICK YOUR ENERGY
            </h2>
            <p
              className="font-body"
              style={{ fontSize: "22px", lineHeight: "normal", color: "#CCCCCC", width: "751px", textAlign: "center" }}
            >
              Three lighting behaviors built into the device designed to be as dynamic as your social life. Whether you&apos;re at a festival, a party, or just chilling with friends, adapts to every vibe you bring.
            </p>
          </div>

{/* Modes row: cards LEFT, image RIGHT */}
<div style={{ display: "flex", width: "100%", gap: "50px", alignItems: "center", justifyContent: "center" }}>

  {/* Left — mode cards */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "20px", flex: "1 0 0", alignSelf: "stretch" }}>

    {/* Litsaber Mode card */}
    <div
      role="button"
      tabIndex={0}
      onClick={() => setMode(0)}
      onMouseEnter={() => setHoveredCard(0)}
      onMouseLeave={() => setHoveredCard(null)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode(0); } }}
      aria-label="Activate Litsaber Mode"
      style={{
        ...cardBorder(0),
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: "1 0 0",
        alignSelf: "stretch",
        padding: "30px",
        background: hoveredCard === 0 || activeMode === 0 ? "rgba(0, 229, 255, 0.08)" : "#100B25",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <h3
        className="font-subhead font-bold"
        style={{
          fontSize: "25px",
          color: activeMode === 0 ? "#F0F0F5" : "#BABABA",
          textShadow: activeMode === 0 ? "0px 0px 20px rgba(0,229,255,0.75)" : "none",
          transition: "color 0.3s, text-shadow 0.3s",
        }}
      >
        LITSABER MODE
      </h3>

      {/* Toggles — THE PULL / THE BUILD */}
      <div style={{ display: "flex", gap: "10px", width: "100%" }}>
        {PULL_BUILD.map((pb, i) => {
          const isActive = activePullBuild === i;
          return (
            <button
              key={pb.label}
              onClick={(e) => { e.stopPropagation(); if (!isActive) togglePullBuild(); }}
              aria-pressed={isActive}
              style={{
                flex: 1,
                padding: "10px",
                background: isActive ? "rgba(0,229,255,0.20)" : "transparent",
                border: isActive ? "1px solid #00E5FF" : "1px solid #CCCCCC",
                borderRadius: "2px",
                color: isActive ? "#00E5FF" : "#CCCCCC",
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "16px",
                fontWeight: 400,
                cursor: "pointer",
                transition: "all 0.3s ease",
                letterSpacing: "0.1em",
              }}
            >
              {pb.label}
            </button>
          );
        })}
      </div>

      {/* Description — fades per toggle */}
      <div style={{ minHeight: "80px" }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${activePullBuild}`}
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

    {/* Glowstick Mode card */}
    <div
      role="button"
      tabIndex={0}
      onClick={() => setMode(1)}
      onMouseEnter={() => setHoveredCard(1)}
      onMouseLeave={() => setHoveredCard(null)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode(1); } }}
      aria-label="Activate Glowstick Mode"
      style={{
        ...cardBorder(1),
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: "1 0 0",
        alignSelf: "stretch",
        padding: "30px",
        background: hoveredCard === 1 || activeMode === 1 ? "rgba(0, 229, 255, 0.08)" : "#100B25",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <h3
        className="font-subhead font-bold"
        style={{
          fontSize: "25px",
          color: activeMode === 1 ? "#F0F0F5" : "#BABABA",
          textShadow: activeMode === 1 ? "0px 0px 20px rgba(0,229,255,0.75)" : "none",
          transition: "color 0.3s, text-shadow 0.3s",
        }}
      >
        GLOWSTICK MODE
      </h3>
      <p className="font-body" style={{ fontSize: "16px", color: activeMode === 1 ? "#F0F0F5" : "#CFCFCF" }}>
        {MODES[1].body}
      </p>
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
      style={{
        ...cardBorder(2),
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: "1 0 0",
        alignSelf: "stretch",
        padding: "30px",
        background: hoveredCard === 2 || activeMode === 2 ? "rgba(0, 229, 255, 0.08)" : "#100B25",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <h3
        className="font-subhead font-bold"
        style={{
          fontSize: "25px",
          color: activeMode === 2 ? "#F0F0F5" : "#BABABA",
          textShadow: activeMode === 2 ? "0px 0px 20px rgba(0,229,255,0.75)" : "none",
          transition: "color 0.3s, text-shadow 0.3s",
        }}
      >
        STEALTH MODE
      </h3>
      <p className="font-body" style={{ fontSize: "16px", color: activeMode === 2 ? "#F0F0F5" : "#CFCFCF" }}>
        {MODES[2].body}
      </p>
    </div>
  </div>

  {/* Right — mode image */}
  <div
    style={{
      width: "576px",
      height: "auto",
      flex: "1 0 0",
      alignSelf: "stretch",
      borderRadius: "10px",
      border: "1px solid #4B2F81",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <AnimatePresence mode="wait">
      <motion.img
        key={`mode-image-${activeMode}`}
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

       