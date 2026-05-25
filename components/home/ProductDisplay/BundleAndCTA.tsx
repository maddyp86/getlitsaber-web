"use client";

import { BUNDLE_OPTIONS, TRUST_LINE } from "./productdisplay.content";

interface BundleAndCTAProps {
  activeBundle: "single" | "twopack";
  onBundleChange: (id: "single" | "twopack") => void;
}

function RadioIndicator({ checked }: { checked: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
        checked ? "border-accent-cyan bg-surface-card-deep" : "border-border-default bg-surface-card-deep"
      }`}
    >
      {checked && (
        <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
      )}
    </div>
  );
}

export default function BundleAndCTA({ activeBundle, onBundleChange }: BundleAndCTAProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-body font-medium text-[14px] text-text-secondary uppercase">
        Select Bundle
      </p>

      {/* Bundle rows */}
      <div className="flex flex-col gap-3">
        {BUNDLE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onBundleChange(option.id)}
            className={`bg-surface-card-deep rounded-selector rounded-btn p-3 flex flex-row items-center gap-4 cursor-pointer border text-left transition-colors ${
              option.id === activeBundle ? "border-accent-cyan" : "border-border-inactive"
            }`}
          >
            <RadioIndicator checked={option.id === activeBundle} />

            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label font-bold text-[16px] text-text-primary leading-tight">
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

            <span className="font-body font-bold text-[16px] text-text-primary flex-shrink-0 text-right">
              {option.price}
            </span>
          </button>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="w-full bg-cta font-label font-bold text-[16px] text-text-primary rounded-md py-4 px-4 cursor-default"
          style={{ textShadow: "0 0 10px rgba(236, 87, 147, 0.7)" }}
        >
          + ADD TO CART
        </button>

        <button
          type="button"
          className="w-full bg-white font-label font-bold text-[16px] text-black rounded-md py-4 px-4 cursor-default"
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
