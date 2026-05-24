import { EYEBROW, HEADLINE, SUBCOPY, EDITIONS, AccentColor } from "./editions.content";

const ACCENT_CLASSES: Record<
  AccentColor,
  { border: string; text: string; stripe: string; bracket: string }
> = {
  cyan: {
    border: "border-accent-cyan",
    text: "text-accent-cyan",
    stripe: "bg-accent-cyan",
    bracket: "border-accent-cyan",
  },
  magenta: {
    border: "border-accent-magenta",
    text: "text-accent-magenta",
    stripe: "bg-accent-magenta",
    bracket: "border-accent-magenta",
  },
  purple: {
    border: "border-accent-purple",
    text: "text-accent-purple",
    stripe: "bg-accent-purple",
    bracket: "border-accent-purple",
  },
};

export default function EditionsSection() {
  return (
    <section
      id="editions"
    >
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <p className="font-label text-eyebrow text-text-accent tracking-widest mb-3">
            {EYEBROW}
          </p>
          <h2
            className="font-display font-bold text-h1 text-white uppercase text-center mb-4"
            style={{ textShadow: "0 0 50px rgba(0, 229, 255, 0.75)", lineHeight: "normal" }}
          >
            {HEADLINE}
          </h2>
          <p className="font-body text-body-sm lg:text-body text-text-secondary max-w-lg mx-auto">
            {SUBCOPY}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {EDITIONS.map((edition) => {
            const accent = ACCENT_CLASSES[edition.accentColor];
            return (
              <div
                key={edition.id}
                className="relative bg-background-elevated rounded-card overflow-hidden flex flex-col"
              >
                {/* Left-edge accent stripe */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-[3px] ${accent.stripe}`}
                />

                {/* Top-left corner bracket (horizontal arm) */}
                <div
                  className={`absolute top-0 left-0 w-6 h-[3px] ${accent.stripe}`}
                />

                {/* Bottom-left corner bracket (horizontal arm) */}
                <div
                  className={`absolute bottom-0 left-0 w-6 h-[3px] ${accent.stripe}`}
                />

                {/* Card content */}
                <div className="flex flex-col flex-1 pl-6 pr-5 pt-5 pb-5">
                  {/* Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block font-label text-eyebrow ${accent.text} border ${accent.border} rounded-pill px-3 py-1`}
                    >
                      {edition.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-accent text-h3 lg:text-h2 ${accent.text} leading-tight mb-4`}
                  >
                    {edition.title}
                  </h3>

                  {/* Edition + descriptor lines */}
                  <div className="flex flex-col gap-1 mb-8">
                    <p className="font-label text-label text-text-secondary uppercase tracking-wide">
                      {edition.editionLine}
                    </p>
                    <p className="font-label text-label text-text-secondary uppercase tracking-wide">
                      {edition.descriptorLine}
                    </p>
                  </div>

                  {/* Action link — INERT placeholder, wired in Phase 3 */}
                  <div className="mt-auto pt-4 border-t border-border-default/30 flex items-center justify-between">
                    <span
                      className={`font-label text-label uppercase tracking-widest ${accent.text} cursor-default`}
                    >
                      {edition.actionLabel}
                    </span>
                    <span className={`text-lg ${accent.text}`}>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
