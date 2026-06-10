import Link from "next/link";
import { SECTION_IDS, ACTIVATE_CHARGING } from "./activate.content";
import ChargingAnimation from "./ChargingAnimation";

function renderCaption(text: string) {
  const target = "you\u2019re fully charged";
  const idx = text.indexOf(target);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-text-primary">{target}</strong>
      {text.slice(idx + target.length)}
    </>
  );
}

export default function ActivateCharging() {
  const {
    eyebrow, title, intro, cardLabel, cardBadge, tagline,
    points, callout, barLabel, caption, media,
  } = ACTIVATE_CHARGING;

  return (
    <section
      id={SECTION_IDS.charging}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-[#000000]"
    >
      <div className="mx-auto w-full items-center max-w-content px-content">

        {/* Section header — left aligned per Figma */}
        <p className="font-label text-eyebrow  text-center uppercase text-accent-cyan mb-2">
          {eyebrow}
        </p>

        <h2
          className="font-display font-bold  text-center uppercase leading-[1.1] text-white mb-2"
          style={{ fontSize: "clamp(45px, 6vw, 75px)", textShadow: "0 0 50px rgba(255,255,255,0.50)" }}
        >
          {title}
        </h2>

        <p className="font-body text-body-sm  text-center lg:text-body text-text-secondary leading-relaxed mb-16 max-w-content">
          {intro}
        </p>

        {/* Two-column: content left, media right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Content column */}
          <div className="flex flex-col items-start gap-8 flex-[1_0_0] min-w-0">

            {/* Charging block (no card chrome per Figma) */}
           <div className="flex flex-col justify-center items-start gap-5 flex-[1_0_0] self-stretch min-w-0">
              {/* Header: label + badge */}
              <div className="flex flex-wrap items-center gap-3">
               <span
                  className="font-subhead font-bold text-white leading-none"
                  style={{ fontSize: "clamp(25px, 3vw, 35px)" }}
                >
                  {cardLabel}
                </span>
                <span className="rounded-[4px] border border-accent-cyan text-accent-cyan bg-[rgba(0,229,255,0.08)] px-3 py-1 font-label text-[10px] tracking-[0.15em] uppercase shrink-0">
                  {cardBadge}
                </span>
              </div>

              {/* Tagline */}
              <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                {tagline}
              </p>

              {/* Bullets with divider lines */}
              <ul className="flex flex-col mt-2" aria-label="Charging instructions">
                {points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-4 border-b border-[#113757] last:border-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[6px] shrink-0 text-accent-cyan"
                      style={{ fontSize: "10px", lineHeight: 1 }}
                    >
                      &#9654;
                    </span>
                    <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                      {"lead" in point && point.lead ? (
                        <>
                          <strong className="font-semibold text-text-primary">{point.lead}</strong>
                          {point.text}
                        </>
                      ) : (
                        point.text
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not charging callout — magenta accent */}
            <div className="w-full border-l-4 border-accent-magenta bg-[rgba(255,0,229,0.06)] px-5 py-4">
              <p className="font-body text-body-sm leading-relaxed text-[#CCC]">
                <span className="text-accent-magenta font-bold">{callout.lead} </span>
                {callout.body}
                <Link
                  href={callout.linkHref}
                  className="text-accent-cyan underline underline-offset-2 hover:no-underline"
                >
                  {callout.linkLabel}
                </Link>
                {callout.bodyAfter}
              </p>
            </div>

          </div>

          {/* Media column */}
          <div className="mt-12 flex min-h-[400px] lg:min-h-[600px] flex-col lg:mt-0 lg:w-[380px] xl:w-[440px] shrink-0">
            {media.src ? (
              <video
                src={media.src}
                poster={media.poster ?? undefined}
                aria-label={media.alt}
                muted
                autoPlay
                loop
                playsInline
                className="w-full rounded-card object-cover"
              />
            ) : (
              <div className="w-full flex-1 rounded-card border border-border-pill bg-[#000000] flex flex-col items-center justify-center gap-3">
                <span className="font-label text-eyebrow tracking-[0.12em] uppercase text-text-muted">
                  media pending hosting
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Full-width charging bar below both columns */}
        <div className="mt-12 lg:mt-20">

          {/* Axis labels: BUTTON / CHARGING BEHAVIOR / TIP */}
          <div className="grid grid-cols-3 mb-3" aria-hidden="true">
            <span className="font-label text-[12px] tracking-[0.15em] uppercase text-accent-cyan text-left">
              &#9711; {barLabel.left}
            </span>
            <span className="font-label text-[12px] tracking-[0.2em] uppercase text-text-muted text-center">
              {barLabel.center}
            </span>
            <span className="font-label text-[12px] tracking-[0.15em] uppercase text-accent-cyan text-right">
              {barLabel.right} &#9711;
            </span>
          </div>

          {/* Animated charging bar */}
          <ChargingAnimation />

          {/* Centered italic caption */}
          <p className="font-body text-body-sm italic text-text-muted leading-relaxed text-center mx-auto mt-8 max-w-[640px]">
            {renderCaption(caption)}
          </p>

        </div>
      </div>
    </section>
  );
}