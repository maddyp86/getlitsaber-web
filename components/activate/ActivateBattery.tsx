import { SECTION_IDS, ACTIVATE_BATTERY, LED_COLORS } from "./activate.content";

export default function ActivateBattery() {
  const {
    eyebrow, title, intro, cardLabel, cardBadge, tagline,
    points, callout, legend, legendAxis, caption, media,
  } = ACTIVATE_BATTERY;

  return (
    <section
      id={SECTION_IDS.battery}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-background-elevated"
    >
      <div className="mx-auto w-full max-w-content px-content">

        {/* Section header — centered */}
        <p className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan text-center mb-2">
          {eyebrow}
        </p>

        <h2
          className="font-display font-bold uppercase leading-[1.1] text-center text-white mb-2"
          style={{ fontSize: "clamp(34px, 6vw, 75px)", textShadow: "0 0 50px rgba(255,255,255,0.50)" }}
        >
          {title}
        </h2>

        <p className="font-body text-body-sm lg:text-body text-text-secondary text-center mx-auto mb-16 max-w-[560px]">
          {intro}
        </p>

        {/* Two-column: card left, media right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Content column */}
          <div className="flex flex-col items-start gap-8 flex-[1_0_0] min-w-0">

            {/* Check-battery block (no card chrome per Figma) */}
            <div className="w-full flex flex-col gap-3">
              {/* Header: label + badge */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="font-subhead font-bold text-white leading-none"
                  style={{ fontSize: "clamp(25px, 3vw, 35px)" }}
                >
                  {cardLabel}
                </span>
                <span className="rounded-[4px] border border-accent-cyan text-accent-cyan bg-[rgba(0,229,255,0.08)] px-3 py-1 font-label text-[12px] uppercase shrink-0">
                  {cardBadge}
                </span>
              </div>

              {/* Tagline */}
              <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                {tagline}
              </p>

              {/* Points with divider lines between */}
              <ul className="flex flex-col mt-2" aria-label="Battery check instructions">
                {points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-4 border-b border-[rgba(255,255,255,0.08)] last:border-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[6px] shrink-0 text-accent-cyan"
                      style={{ fontSize: "10px", lineHeight: 1 }}
                    >
                      &#9654;
                    </span>
                    <p
                      className={[
                        "font-body text-body-sm lg:text-body leading-relaxed",
                        point.emphasis
                          ? "text-text-primary font-semibold"
                          : "text-text-secondary",
                      ].join(" ")}
                    >
                      {point.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Battery specs callout */}
            <div className="w-full border-l-4 border-accent-cyan bg-[#0E1023] px-5 py-4">
              <p className="font-body text-body-sm leading-relaxed text-[#CCC]">
                <span className="text-accent-cyan font-bold">{callout.lead} </span>
                {callout.body}
              </p>
            </div>

          </div>

          {/* Media column */}
          <div className="mt-12 flex min-h-[400px] lg:min-h-[600px] flex-col lg:mt-0 lg:w-[380px] xl:w-[440px] shrink-0"
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
              <div className="w-full aspect-[9/16] rounded-card border border-border-pill bg-surface-card flex items-center justify-center">
                <span className="font-label text-eyebrow tracking-[0.12em] uppercase text-text-muted">
                  media pending hosting
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Full-width legend bar — below both columns */}
        <div className="mt-12 lg:mt-20">

          {/* Axis labels: BUTTON / BATTERY SEGMENTS / TIP */}
          <div className="grid grid-cols-3 mb-3" aria-hidden="true">
            <span className="font-label text-[12px] tracking-[0.15em] uppercase text-accent-cyan text-left">
              &#9711; {legendAxis.left}
            </span>
            <span className="font-label text-[12px] tracking-[0.2em] uppercase text-text-muted text-center">
              {legendAxis.center}
            </span>
            <span className="font-label text-[12px] tracking-[0.15em] uppercase text-accent-cyan text-right">
              {legendAxis.right} &#9711;
            </span>
          </div>

          {/* 5-segment static bar (wide landscape segments) */}
          <div
            aria-hidden="true"
            className="grid gap-2 p-3"
            style={{
              gridTemplateColumns: "repeat(5, 1fr)",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
            }}
          >
            {legend.map((seg) => {
              const hex = LED_COLORS[seg.color as keyof typeof LED_COLORS];
              return (
                <div
                  key={seg.color}
                  className="h-12 sm:h-14 md:h-16"
                  style={{
                    background: hex,
                    boxShadow: `0 0 16px ${hex}99, inset 0 0 8px rgba(255,255,255,0.25)`,
                    borderRadius: "6px",
                  }}
                />
              );
            })}
          </div>

          {/* Range + status labels */}
          <div className="grid mt-3" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
            {legend.map((seg) => (
              <div key={seg.color} className="flex flex-col items-center gap-1">
                <span className="font-label text-[13px] sm:text-[15px] tracking-[0.05em] text-text-primary font-bold text-center leading-tight">
                  {seg.range}
                </span>
                <span className="font-label text-[12px] sm:text-[13px] text-text-muted text-center leading-tight">
                  {seg.status}
                </span>
              </div>
            ))}
          </div>

          {/* Centered caption with bold lead */}
          <p className="font-body text-body-sm text-text-secondary leading-relaxed text-center mx-auto mt-8 max-w-[640px]">
            <span className="text-text-primary font-semibold">{caption.lead} </span>
            {caption.body}
          </p>

        </div>
      </div>
    </section>
  );
}