"use client";

import Image from "next/image";
import { GALLERY_IMAGES } from "./productdisplay.content";

interface GalleryBlockProps {
  activeThumb: number;
  onThumbClick: (i: number) => void;
}

export default function GalleryBlock({ activeThumb, onThumbClick }: GalleryBlockProps) {
  const total = GALLERY_IMAGES.length;

  function prev() {
    onThumbClick((activeThumb - 1 + total) % total);
  }

  function next() {
    onThumbClick((activeThumb + 1) % total);
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main viewer — all images pre-loaded and stacked; opacity swap is instant */}
      <div className="group relative w-full aspect-square rounded-card overflow-hidden">
        {GALLERY_IMAGES.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            className={`object-cover transition-opacity duration-200 ${
              i === activeThumb ? "opacity-100" : "opacity-0"
            }`}
            sizes="(min-width: 600px) 50vw, 100vw"
            priority={i === 0}
            loading="eager"
          />
        ))}

        {/* Prev arrow */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          type="button"
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Horizontal thumbnail strip — fixed 72px tiles, scrollable */}
      <div
        className="flex flex-row gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}
      >
        {GALLERY_IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => onThumbClick(i)}
            aria-label={img.alt}
            className={`relative shrink-0 w-[72px] h-[72px] rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
              i === activeThumb
                ? "border-2 border-accent-cyan brightness-100"
                : "brightness-50 hover:brightness-100"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="72px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
