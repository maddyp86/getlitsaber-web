import { BUNDLE_OPTIONS, TRUST_LINE } from "./productdisplay.content";

export default function BundleAndCTA() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-body font-medium text-body text-text-secondary uppercase">
        Select Bundle
      </p>

      {/* Bundle rows */}
      <div className="flex flex-col gap-3">
        {BUNDLE_OPTIONS.map((option) => (
          <div
            key={option.id}
            className={`bg-surface-card-deep rounded-btn p-5 flex flex-row items-start justify-between gap-4 cursor-default border ${
              option.active ? "border-accent-cyan" : "border-border-inactive"
            }`}
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label font-bold text-[22px] text-text-primary leading-tight">
                  {option.title}
                </span>
                {option.saveLabel && (
                  <span
                    className="font-label text-[12px] text-accent-cyan rounded-pill px-2 py-0.5"
                    style={{ background: "rgba(0, 229, 255, 0.05)" }}
                  >
                    {option.saveLabel}
                  </span>
                )}
              </div>
              <p className="font-body text-[12px] text-text-secondary leading-snug">
                {option.descriptor}
              </p>
            </div>
            <span className="font-body font-bold text-body text-text-primary flex-shrink-0 text-right">
              {option.price}
            </span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="w-full bg-cta font-label font-bold text-[22px] text-text-primary rounded-btn py-5 px-5 cursor-default"
          style={{ textShadow: "0 0 10px rgba(236, 87, 147, 0.7)" }}
        >
          + ADD TO CART
        </button>

        <button
          type="button"
          className="w-full bg-white font-label font-bold text-[22px] text-black rounded-btn py-5 px-5 cursor-default"
        >
          BUY NOW
        </button>
      </div>

      {/* Trust line */}
      <p className="font-label text-eyebrow text-text-muted text-center tracking-wider">
        {TRUST_LINE}
      </p>
    </div>
  );
}
