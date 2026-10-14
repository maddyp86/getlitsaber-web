"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MODES } from "@/components/home/ThreeModes/modes.content";
import { track, EVENTS } from "@/lib/analytics/events";
import { SEE_IT_WORK_HEADING } from "./productdisplay.content";

/** "LITSABER MODE" → "Litsaber in litsaber mode", for the poster alt text. */
function posterAlt(title: string): string {
  return `Litsaber in ${title.toLowerCase()}`;
}

/**
 * One mode clip: a muted loop in a fixed 9:16 box. The poster renders at once;
 * the video mounts only when the box is near the viewport, and pauses when it
 * leaves, so three clips never compete with the gallery or buy controls.
 * Reduced-motion visitors keep the still poster.
 */
function ModeClip({ video, poster, title }: { video: string; poster: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="relative w-full aspect-[9/16] overflow-hidden rounded-card bg-black">
      <Image src={poster} alt={posterAlt(title)} fill sizes="(min-width: 768px) 300px, 240px" className="object-cover" />
      {near && !reducedMotion && (
        <video
          ref={videoRef}
          src={video}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
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
