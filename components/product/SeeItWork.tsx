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
      <Image src={poster} alt={posterAlt(title)} fill sizes="(min-width: 1024px) 200px, 40vw" className="object-cover" />
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
 * PDP "Three modes": each mode shown working, a muted loop beside its copy.
 * Same titles, copy and clips as the homepage modes section, in a lighter
 * layout for the product page (no interactive state).
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
    <section ref={sectionRef} aria-labelledby="see-it-work-heading" data-testid="see-it-work" className="flex flex-col gap-4">
      <h3 id="see-it-work-heading" className="font-body text-[25px] font-bold text-text-primary leading-normal">
        {SEE_IT_WORK_HEADING}
      </h3>
      {MODES.map((mode) => (
        <div
          key={mode.title}
          className="grid grid-cols-[1fr_40%] lg:grid-cols-[1fr_200px] gap-4 items-center border-t border-border-divider pt-4"
        >
          <div className="flex flex-col gap-2">
            <h4 className="font-label font-bold text-[15px] uppercase tracking-wider text-accent-cyan">{mode.title}</h4>
            <p className="font-body text-[15px] leading-relaxed text-text-secondary">{mode.body}</p>
          </div>
          <ModeClip video={mode.video} poster={mode.image} title={mode.title} />
        </div>
      ))}
    </section>
  );
}
