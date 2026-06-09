import { SECTION_IDS, ACTIVATE_CHARGING } from "@/content/activate.content";
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

function renderBullet(text: string) {
  const target = "fills as the battery climbs";
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
  const { eyebrow, title, intro, bullet, caption, media } = ACTIVATE_CHARGING;

  return (
    <section
      id={SECTION_IDS.charging}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-background-primary"
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

        <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed mb-8 max-w-[580px]">
          {intro}
        </p>

        {/* Bullet */}
        <div className="flex items-start gap-3 mb-10 max-w-[640px]">
          <span
            aria-hidden="true"
            className="mt-[5px] shrink-0 text-accent-cyan"
            style={{ fontSize: "10px", lineHeight: 1 }}
          >
            &#9654;
          </span>
          <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
            {renderBullet(bullet)}
          </p>
        </div>

        {/* Two-column: bar left, media right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Bar column */}
          <div className="flex flex-col justify-center items-start gap-4 flex-[1_0_0] self-stretch min-w-0">
            {/* Bar label row */}
            <div className="flex justify-between" aria-hidden="true">
              <span className="font-label text-[10px] tracking-[0.1em] uppercase text-text-muted">
                &#9711; BUTTON
              </span>
              <span className="font-label text-[10px] tracking-[0.1em] uppercase text-text-muted hidden sm:block">
                CHARGING BEHAVIOR
              </span>
              <span className="font-label text-[10px] tracking-[0.1em] uppercase text-text-muted">
                TIP &#9711;
              </span>
            </div>

            {/* Animated charging bar */}
            <ChargingAnimation />

            {/* Caption */}
            <p className="font-body text-body-sm text-text-muted leading-relaxed">
              {renderCaption(caption)}
            </p>
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
