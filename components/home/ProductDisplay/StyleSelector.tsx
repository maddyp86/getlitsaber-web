import Image from "next/image";
import { STYLE_OPTIONS } from "./productdisplay.content";

export default function StyleSelector() {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-body font-medium text-body text-text-secondary uppercase">
        Available Styles
      </p>

      <div className="grid grid-cols-2 gap-3">
        {STYLE_OPTIONS.map((option) => (
          <div
            key={option.id}
            className={`bg-surface-card-deep rounded-selector p-5 flex flex-col items-start gap-[30px] cursor-default border ${
              option.active ? "border-accent-cyan" : "border-border-inactive"
            }`}
          >
            <div className="flex items-start gap-[11px] self-stretch">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={option.swatchSrc}
                  alt={option.swatchAlt}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col justify-center items-start gap-[5px] flex-1">
                <span className="font-label font-bold text-[18px] text-text-primary leading-tight">
                  {option.label}
                </span>
                <span className="font-body text-label text-text-secondary leading-snug">
                  {option.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
