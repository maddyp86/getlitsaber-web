import { SECTION_IDS, ACTIVATE_SAFETY } from "@/content/activate.content";

export default function ActivateSafety() {
  const { eyebrow, title, intro, points } = ACTIVATE_SAFETY;

  return (
    <section
      id={SECTION_IDS.safety}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-background-primary"
    >
      <div className="mx-auto w-full max-w-content px-content">

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

        {/* 2-column grid desktop, 1-column mobile */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          aria-label="Safe use guidelines"
        >
          {points.map((point) => (
            <li
              key={point.lead}
              className="flex items-start gap-3 rounded-card border border-[rgba(255,255,255,0.06)] bg-surface-card p-5"
            >
              <span
                aria-hidden="true"
                className="mt-[5px] shrink-0 text-accent-cyan"
                style={{ fontSize: "10px", lineHeight: 1 }}
              >
                &#9654;
              </span>
              <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                <strong className="font-semibold text-text-primary">{point.lead} </strong>
                {point.body}
              </p>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
