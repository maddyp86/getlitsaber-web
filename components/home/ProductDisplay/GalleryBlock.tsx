"use client";

import Image from "next/image";
import { GALLERY_IMAGES } from "./productdisplay.content";

interface GalleryBlockProps {
  activeThumb: number;
  onThumbClick: (i: number) => void;
}

export default function GalleryBlock({ activeThumb, onThumbClick }: GalleryBlockProps) {
  const total = GALLERY_IMAGES.length;
  const mainImage = GALLERY_IMAGES[activeThumb];

  function prev() {
    onThumbClick((activeThumb - 1 + total) % total);
  }

  function next() {
    onThumbClick((activeThumb + 1) % total);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image with hover-reveal prev/next arrows */}
      <div className="group relative w-full aspect-square rounded-card overflow-hidden">
        <Image
          src={mainImage.src}
          alt={mainImage.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />

        {/* Prev arrow */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Horizontal thumbnail strip — scrollable, shows ~4 at a time */}
      <div className="flex flex-row gap-2 overflow-x-auto pb-1 no-scrollbar">
        {GALLERY_IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => onThumbClick(i)}
            aria-label={img.alt}
            className={`relative w-[100px] h-[100px] flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-opacity ${
              i === activeThumb
                ? "border-2 border-accent-cyan shadow-glow-cyan opacity-100"
                : "border border-border-inactive opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
