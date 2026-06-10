import { SECTION_IDS, ACTIVATE_CART } from "./activate.content";

export default function ActivateCartTips() {
  const { eyebrow, title, intro, cards } = ACTIVATE_CART;

  return (
    <section
      id={SECTION_IDS.cart}
      className="scroll-mt-[150 px] py-section-y-mobile lg:py-section-y bg-[#090517]"
    >
      <div className="mx-auto w-full max-w-content px-content">

        <p className="font-label text-eyebrow text-center uppercase text-accent-cyan mb-2">
          {eyebrow}
        </p>

        <h2
          className="font-display font-bold uppercase leading-[1.1] text-center text-white mb-2"
          style={{ fontSize: "clamp(45px, 6vw, 75px)", textShadow: "0 0 50px rgba(255,255,255,0.50)" }}
        >
          {title}
        </h2>

        <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed text-center mx-auto mb-16 max-w-[640px] mx-auto">
          {intro}
        </p>

        {/* 2-column grid desktop, 1-column mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.num}
              className="rounded-card border border-[rgba(255,255,255,0.08)] bg-surface-card p-6 flex flex-col gap-4"
            >
              <div className="flex flex-col items-baseline gap-3">
                <span className="font-label text-[16px] md:text-[18px] text-accent-cyan shrink-0">
                  {card.num}
                </span>
                <h3
                  className="font-subhead font-bold uppercase text-white leading-tight"
                  style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
                >
                  {card.title}
                </h3>
              </div>
              <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}