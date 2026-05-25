"use client";

import Image from "next/image";
import { STYLE_OPTIONS } from "./productdisplay.content";

interface StyleSelectorProps {
  activeStyle: "silver" | "gold";
  onStyleChange: (id: "silver" | "gold") => void;
}

export default function StyleSelector({ activeStyle, onStyleChange }: StyleSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-body font-medium text-[16px] text-text-secondary uppercase">
        Available Styles
      </p>

      <div className="grid grid-cols-2 gap-2">
        {STYLE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onStyleChange(option.id)}
            className={`bg-surface-card-deep rounded-selector p-3 flex flex-row items-center justify-between gap-3 cursor-pointer border text-left transition-colors ${
              option.id === activeStyle ? "border-accent-cyan" : "border-border-inactive"
            }`}
          >
            {/* Swatch + label group */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={option.swatchSrc}
                  alt={option.swatchAlt}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <div className="flex flex-col gap-[4px] min-w-0">
                <span className="font-label font-bold text-[16px] text-text-primary leading-tight">
                  {option.label}
                </span>
                <span className="font-body text-[11px] text-text-secondary leading-snug">
                  {option.status}
                </span>
              </div>
            </div>

            {/* Checkmark — takes up reserved space so layout never shifts */}
            <div className="flex-shrink-0 w-[25px] h-[25px] flex items-center justify-center">
              {option.id === activeStyle && (
                <div className="w-[25px] h-[25px] rounded-full bg-accent-cyan flex items-center justify-center">
                  <Image
                    src="/images/icons/checkmark-icon.svg"
                    alt="Selected"
                    width={14}
                    height={14}
                  />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
