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
            className={`relative bg-surface-card-deep rounded-selector p-3 flex flex-col items-start gap-[30px] cursor-pointer border text-left transition-colors ${
              option.id === activeStyle ? "border-accent-cyan" : "border-border-inactive"
            }`}
          >
            <div className="flex items-start gap-[10px] self-stretch">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={option.swatchSrc}
                  alt={option.swatchAlt}
                  fill
                  className="object-contain"
                  sizes="25px"
                />
              </div>
              <div className="flex flex-col justify-center items-start gap-[5px] flex-1">
                <span className="font-label font-bold text-[18px] text-text-primary leading-tight">
                  {option.label}
                </span>
                <span className="font-body text-[12px] text-text-secondary leading-snug">
                  {option.status}
                </span>
              </div>
            </div>

            {/* Active checkmark — bottom-right corner */}
            {option.id === activeStyle && (
              <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-accent-cyan flex items-center justify-center">
                <Image
                  src="/images/icons/checkmark-icon.svg"
                  alt="Selected"
                  width={14}
                  height={14}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
