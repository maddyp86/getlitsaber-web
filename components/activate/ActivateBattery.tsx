import { SECTION_IDS, ACTIVATE_BATTERY, LED_COLORS } from "@/content/activate.content";

const BOLD_LEAD_RE = /^([^.]+\.\s*)/;

function renderPoint(text: string) {
  const match = text.match(BOLD_LEAD_RE);
  if (!match) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold text-text-primary">{match[0]}</strong>
      {text.slice(match[0].length)}
    </>
  );
}

export default function ActivateBattery() {
  const { eyebrow, title, intro, cardLabel, cardBadge, points, legend, legendAxis, caption, media } =
    ACTIVATE_BATTERY;

  return (
    <section
      id={SECTION_IDS.battery}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-background-elevated"
    >
      <div className="mx-auto w-full max-w-content px-content">

        {/* Section header */}
        <p className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan mb-4">
          {eyebrow}
        </p>

        <h2
          className="font-display font-bold uppercase leading-[1.05] text-white mb-6"
          style={{ fontSize: "clamp(32px, 4vw, 55px)" }}
        >
          {title}
        </h2>

        <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed mb-10 max-w-[580px]">
          {intro}
        </p>

        {/* Two-column: content left, media right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Content column */}
          <div className="flex flex-col justify-center items-start gap-8 flex-[1_0_0] self-stretch min-w-0">

            {/* Check-battery card */}
            <div className="rounded-card border border-[rgba(0,229,255,0.20)] bg-surface-card p-6 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-label text-label tracking-[0.1em] uppercase text-text-primary font-semibold">
                  {cardLabel}
                </span>
                <span className="rounded-pill border border-accent-cyan text-accent-cyan bg-[rgba(0,229,255,0.08)] px-3 py-1 font-label text-[10px] tracking-[0.15em] uppercase shrink-0">
                  {cardBadge}
                </span>
              </div>

              <ul className="flex flex-col gap-3" aria-label="Battery check instructions">
                {points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[5px] shrink-0 text-accent-cyan"
                      style={{ fontSize: "10px", lineHeight: 1 }}
                    >
                      &#9654;
                    </span>
                    <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                      {renderPoint(point)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legend bar */}
            <div>
              {/* Axis labels */}
              <div className="flex justify-between mb-2" aria-hidden="true">
                <span className="font-label text-[10px] tracking-[0.12em] uppercase text-text-muted">
                  &#9711; {legendAxis.left}
                </span>
                <span className="font-label text-[10px] tracking-[0.12em] uppercase text-text-muted">
                  {legendAxis.right} &#9711;
                </span>
              </div>

              {/* 5-segment static bar */}
              <div
                aria-hidden="true"
                className="grid gap-1 rounded p-[10px]"
                style={{
                  gridTemplateColumns: "repeat(5, 1fr)",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "4px",
                }}
              >
                {legend.map((seg) => {
                  const hex = LED_COLORS[seg.color];
                  return (
                    <div
                      key={seg.color}
                      style={{
                        background: hex,
                        boxShadow: `0 0 16px ${hex}99, inset 0 0 8px rgba(255,255,255,0.2)`,
                        borderRadius: "2px",
                        aspectRatio: "1 / 1",
                      }}
                    />
                  );
                })}
              </div>

              {/* Range + status labels (readable to AT) */}
              <div className="grid mt-2" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: "4px" }}>
                {legend.map((seg) => (
                  <div key={seg.color} className="flex flex-col items-center gap-0.5">
                    <span className="font-label text-[9px] tracking-[0.05em] text-text-primary font-semibold text-center leading-tight">
                      {seg.range}
                    </span>
                    <span className="font-label text-[9px] text-text-muted text-center leading-tight">
                      {seg.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Caption */}
              <p className="font-body text-body-sm text-text-muted leading-relaxed mt-4">
                {caption}
              </p>
            </div>

          </div>

          {/* Media column */}
          <div className="mt-12 lg:mt-0 min-h-[600px] lg:w-[380px] xl:w-[440px] shrink-0">
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
      </div>
    </section>
  );
}
