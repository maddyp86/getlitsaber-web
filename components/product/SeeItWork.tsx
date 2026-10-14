"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MODES } from "@/components/home/ThreeModes/modes.content";
import { track, EVENTS } from "@/lib/analytics/events";
import { SEE_IT_WORK_HEADING } from "./productdisplay.content";

/** play() is a promise in current browsers and undefined in some older ones. */
function tryPlay(v: HTMLVideoElement) {
  const p = v.play();
  if (p) p.catch(() => {});
}

/** "LITSABER MODE" → "Litsaber in litsaber mode", for the poster alt text. */
function posterAlt(title: string): string {
  return `Litsaber in ${title.toLowerCase()}`;
}

/**
 * One mode clip: a muted loop in a fixed 9:16 box, over its still poster.
 *
 * Loading: the video starts buffering about one screen before the row
 * arrives (on a phone connection, mounting it only when visible meant it
 * never started playing before the shopper scrolled past). Playing: only
 * while at least a third of the box is on screen, so clips never decode
 * side by side. The video stays invisible until it is actually playing,
 * then fades in over the poster, so there is no blank or jumping frame.
 * Reduced-motion visitors keep the still poster.
 */
function ModeClip({ video, poster, title }: { video: string; poster: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inView = useRef(false);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Start buffering about one screen ahead.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play only while a third of the box is on screen.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) tryPlay(v);
        else v.pause();
      },
      { threshold: 0.33 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // React sets `muted` only as a property; iOS Safari also wants the
  // attribute before it will play a video inline without a tap.
  const attachVideo = (v: HTMLVideoElement | null) => {
    videoRef.current = v;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    if (inView.current) tryPlay(v);
  };

  return (
    <div ref={boxRef} className="relative w-full aspect-[9/16] overflow-hidden rounded-card bg-black">
      <Image src={poster} alt={posterAlt(title)} fill sizes="(min-width: 768px) 300px, 240px" className="object-cover" />
      {load && !reducedMotion && (
        <video
          ref={attachVideo}
          src={video}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 motion-reduce:transition-none ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

/**
 * PDP "Three modes": a full-width section between the buy area and the
 * comparison table. Each mode is a row of copy and its muted loop, the clip
 * alternating sides on tablet and desktop (stacked on phones). Same titles,
 * copy and clips as the homepage modes section, without its interactive state.
 */
export default function SeeItWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewed = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewed.current) {
          viewed.current = true;
          track(EVENTS.pdp_modes_viewed, {});
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="see-it-work-heading"
      data-testid="see-it-work"
      className="flex flex-col items-center gap-12 lg:gap-20"
    >
      <h2
        id="see-it-work-heading"
        className="font-display text-text-primary text-center text-[clamp(32px,3.2vw,56px)] font-bold"
      >
        {SEE_IT_WORK_HEADING}
      </h2>
      {MODES.map((mode, i) => {
        const clipFirst = i % 2 === 1;
        return (
          <div
            key={mode.title}
            data-testid="mode-row"
            className="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12"
          >
            <div className={`flex flex-col gap-3 ${clipFirst ? "md:order-2" : ""}`}>
              <h3 className="font-label font-bold text-[18px] uppercase tracking-wider text-accent-cyan">{mode.title}</h3>
              <p className="font-body text-[16px] leading-relaxed text-text-secondary">{mode.body}</p>
            </div>
            <div className={`w-full max-w-[240px] md:max-w-[300px] mx-auto ${clipFirst ? "md:order-1" : ""}`}>
              <ModeClip video={mode.video} poster={mode.image} title={mode.title} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
