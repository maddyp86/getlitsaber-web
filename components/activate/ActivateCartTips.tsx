import { SECTION_IDS, ACTIVATE_CART } from "./activate.content";

export default function ActivateCartTips() {
  const { eyebrow, title, intro, cards } = ACTIVATE_CART;

  return (
    <section
      id={SECTION_IDS.cart}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-background-elevated"
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

        <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed mb-10 max-w-[640px]">
          {intro}
        </p>

        {/* 2-column grid desktop, 1-column mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.num}
              className="rounded-card border border-[rgba(255,255,255,0.08)] bg-surface-card p-6 flex flex-col gap-4"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-label text-[11px] tracking-[0.15em] text-text-muted shrink-0">
                  {card.num}
                </span>
                <h3 className="font-display font-bold uppercase text-white leading-tight" style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}>
                  {card.title}
                </h3>
              </div>
              <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
