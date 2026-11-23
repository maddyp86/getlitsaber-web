"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { HOLIDAY_HERO } from "@/lib/campaign/holiday2026";
import { track, EVENTS } from "@/lib/analytics/events";

// Homepage hero for the Holiday Sale (requirements section 2). Rendered by
// app/page.tsx in place of <Hero /> only while the campaign is active; the
// regular hero is untouched. Copy and images come from lib/campaign/holiday2026.
//
// Headline, offer line and button share one column: 6% in from the left and
// clamp(420px, 34vw, 620px) wide from lg, the full content width below it. Both
// headline lines are fitted to that column (see LINE1_FIT), so they share the
// same left and right edges at every width.
//
// Desktop: live text on the left over a full-bleed image whose products sit in
// its right half. Below lg: text first, then the square image. One <picture>
// serves both, so each device downloads exactly one file.

// Fit each headline line to the column. Measured from the site's real faces
// (Stellar Bold, Monoton) at 1000px: the inked width of "LIGHT UP" is 3.365em
// and of "THE HOLIDAYS" 8.278em, so font-size = column width / that (100cqw is
// the column). The negative margin removes each face's left side bearing, so
// the ink, not the glyph box, starts on the column edge. Copy changes in
// HOLIDAY_HERO need these re-measured.
const LINE1_FIT = "text-[length:29.7cqw] -ml-[0.02em]";
const LINE2_FIT = "text-[length:12.07cqw] -ml-[0.03em]";

const BULB_COLORS = ["red", "white", "green"] as const;
const BULB_CLASS: Record<(typeof BULB_COLORS)[number], string> = {
  red: "text-holiday-bulb-red fill-holiday-bulb-red",
  white: "text-holiday-bulb-white fill-holiday-bulb-white",
  green: "text-holiday-bulb-green fill-holiday-bulb-green",
};
// x position, socket y, stagger (s), loop length (s). Twelve bulbs along the wire.
const BULBS: ReadonlyArray<[number, number, number, number]> = [
  [30, 23, 0.0, 2.6], [62, 26.5, 1.3, 3.1], [95, 24, 0.6, 2.2],
  [155, 23, 2.1, 2.9], [187, 26.5, 0.9, 3.4], [220, 24, 1.7, 2.4],
  [280, 23, 0.3, 3.0], [312, 26.5, 2.4, 2.7], [345, 24, 1.1, 2.3],
  [405, 23, 0.5, 3.3], [437, 26.5, 1.9, 2.5], [470, 24, 1.4, 2.8],
];

// left %, top %, size px, delay s. Sky area only (top half), desktop.
const STARS: ReadonlyArray<[number, number, number, number]> = [
  [4, 14, 2.4, 0], [11, 31, 4, 1.4], [22, 9, 3, 0.7], [33, 24, 2.4, 2.2],
  [41, 6, 4, 0.4], [52, 18, 2.8, 1.8], [56, 36, 2.4, 1.0], [74, 5, 3.2, 2.6],
  [90, 12, 4, 0.2], [96, 33, 2.6, 1.5], [47, 41, 2.4, 2.9], [16, 43, 2.8, 0.9],
];

const FLAKE_SIZES = [2, 5, 4, 3];
const FLAKE_DURATIONS = [9, 14, 11, 16, 13, 10, 15, 12];
const FLAKE_OPACITY = [0.35, 0.47, 0.59, 0.71, 0.83];
// 28 flakes. Negative delays start each one mid-fall, so snow is already
// falling at first paint.
const FLAKES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  size: FLAKE_SIZES[i % FLAKE_SIZES.length],
  duration: FLAKE_DURATIONS[i % FLAKE_DURATIONS.length],
  delay: -((i * 2) % 11),
  opacity: FLAKE_OPACITY[i % FLAKE_OPACITY.length],
}));

function StringLights() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 500 50"
      className="absolute left-0 -top-px w-full h-auto overflow-visible pointer-events-none"
    >
      <path
        d="M0,13 Q62,40 125,16 Q187,42 250,16 Q312,42 375,16 Q437,40 500,13"
        fill="none"
        strokeWidth="1.6"
        className="stroke-holiday-wire"
      />
      {BULBS.map(([x, y, delay, duration], i) => (
        <g
          key={x}
          className={`holiday-bulb ${BULB_CLASS[BULB_COLORS[i % 3]]}`}
          style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
        >
          <rect x={x - 2.2} y={y} width="4.4" height="4" rx="1" className="fill-holiday-socket" />
          <ellipse cx={x} cy={y + 10.5} rx="4.6" ry="7" />
        </g>
      ))}
    </svg>
  );
}

export default function HolidayHero() {
  const ref = useRef<HTMLElement>(null);

  // Pause every loop while the hero is scrolled out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.removeAttribute("data-offscreen");
      else el.setAttribute("data-offscreen", "");
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const common = { alt: HOLIDAY_HERO.alt, sizes: "100vw", priority: true };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: HOLIDAY_HERO.desktopImage, width: 3200, height: 1800 });
  const {
    props: { srcSet: mobileSrcSet, ...img },
  } = getImageProps({ ...common, src: HOLIDAY_HERO.mobileImage, width: 1400, height: 1400 });

  return (
    <section
      ref={ref}
      aria-label="Holiday Sale"
      className="holiday-hero relative w-full overflow-hidden bg-background-primary flex flex-col lg:justify-center lg:min-h-[clamp(620px,calc(100svh-var(--announce-h)),820px)]"
    >
      {/* Text. First in the DOM and on screen; the image follows on mobile and
          sits behind on desktop. From lg the block is centred top to bottom in
          the hero: equal padding (the navbar's height, so it can never slide
          under the fixed navbar) and the section centres it. */}
      <div className="relative z-20 flex flex-col gap-[18px] lg:gap-7 px-container-mobile pt-[calc(theme(spacing.navbar)+26px)] pb-7 lg:px-0 lg:ml-[6%] lg:py-[theme(spacing.navbar)] lg:w-[clamp(420px,34vw,620px)]">
        {/* The h1 is a size container: each line's font-size is a share of the
            column width, so both lines run exactly edge to edge. */}
        <h1 className="relative w-full flex flex-col gap-[5px] lg:gap-2 [container-type:inline-size]">
          <span className="relative block w-full">
            <span className={`holiday-lightup block font-display font-bold leading-none text-text-primary whitespace-nowrap ${LINE1_FIT}`}>
              {HOLIDAY_HERO.line1}
            </span>
            <StringLights />
          </span>{" "}
          <span className={`holiday-neon block font-accent font-normal leading-[1.05] text-accent-cyan whitespace-nowrap ${LINE2_FIT}`}>
            {HOLIDAY_HERO.line2}
          </span>
        </h1>

        <p className="font-body text-[clamp(18px,1.55vw,24px)] leading-[1.45] text-holiday-body">
          {HOLIDAY_HERO.body.map((part, i) =>
            part.style === "sale" ? (
              <strong key={i} className="font-semibold text-accent-cyan">{part.text}</strong>
            ) : part.style === "strong" ? (
              <strong key={i} className="font-semibold text-white">{part.text}</strong>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
        </p>

        <Link
          href={HOLIDAY_HERO.cta.href}
          data-buy-cta
          onClick={() => track(EVENTS.cta_clicked, { cta: "hero_holiday_shop_now" })}
          className="flex items-center justify-center self-stretch lg:self-start h-[54px] lg:h-16 px-14 rounded-sm bg-cta text-text-primary font-label font-bold text-[14px] lg:text-label tracking-[0.16em] uppercase shadow-glow-cta transition-all duration-200 ease-in-out hover:-translate-y-px hover:shadow-glow-cta-hover active:opacity-80"
        >
          {HOLIDAY_HERO.cta.label}
        </Link>
      </div>

      {/* Image: square and in flow below lg. From lg it is sized by the hero's
          HEIGHT, never its width, so the whole product always fits the first
          screen (a width-fitted cover image put the product below the fold on
          short, wide windows). The products' centre (69.5% across the file)
          is pinned at 75% of the hero (79% below xl, to clear the headline);
          the side edges fade out so no seam
          shows where the image is narrower than the window. */}
      <picture className="relative z-0 block w-full lg:absolute lg:inset-0">
        <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes="100vw" />
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          {...img}
          srcSet={mobileSrcSet}
          className="block w-full h-auto lg:absolute lg:top-0 lg:left-[79%] xl:left-[75%] lg:h-full lg:w-auto lg:max-w-none lg:aspect-[16/9] lg:-translate-x-[69.5%] lg:[mask-image:linear-gradient(to_right,transparent,black_14%,black_90%,transparent)]"
        />
      </picture>

      {/* Desktop legibility gradient behind the text. */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-holiday-scrim/80 via-holiday-scrim/55 via-[34%] to-transparent to-[58%]"
      />

      {/* Twinkling stars, sky area only. */}
      <div aria-hidden="true" className="hidden lg:block absolute inset-x-0 top-0 h-[49%] z-[2] pointer-events-none">
        {STARS.map(([left, top, size, delay]) => (
          <span
            key={`${left}-${top}`}
            className="holiday-star absolute rounded-full bg-white shadow-[0_0_6px_1px_rgb(255_255_255/0.8)]"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      {/* Snow: above the image, below the text. */}
      <div aria-hidden="true" className="holiday-snow absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {FLAKES.map((f, i) => (
          <span
            key={i}
            className="holiday-flake absolute top-0 rounded-full bg-white"
            style={{
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
