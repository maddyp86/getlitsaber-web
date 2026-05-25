"use client";

import Image from "next/image";
import { GALLERY_IMAGES } from "./productdisplay.content";

interface GalleryBlockProps {
  activeThumb: number;
  onThumbClick: (i: number) => void;
}

export default function GalleryBlock({ activeThumb, onThumbClick }: GalleryBlockProps) {
  const mainImage = GALLERY_IMAGES[activeThumb];

  return (
    <>
      {/* Desktop: vertical thumb strip LEFT + tall main image RIGHT */}
      <div className="hidden lg:flex flex-row gap-3 h-full">
        {/* Thumb strip */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => onThumbClick(i)}
              className={`relative w-[100px] h-[100px] rounded-md overflow-hidden flex-shrink-0 cursor-pointer ${
                i === activeThumb
                  ? "border-2 border-accent-cyan shadow-glow-cyan"
                  : "border border-border-inactive opacity-60 hover:opacity-100 transition-opacity"
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

        {/* Main image */}
        <div className="relative w-full w-[500px] h-[500px] aspect-square rounded-card overflow-hidden">
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 500px, 50vw"
            priority
          />
        </div>
      </div>

      {/* Mobile: main image on top + horizontal thumb row below */}
      <div className="flex lg:hidden flex-col gap-3">
        <div className="relative w-full aspect-[4/5] rounded-card overflow-hidden">
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        <div className="flex flex-row gap-2 overflow-x-auto pb-1">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => onThumbClick(i)}
              className={`relative w-[100px] h-[100px] flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${
                i === activeThumb
                  ? "border-2 border-accent-cyan shadow-glow-cyan"
                  : "border border-border-inactive opacity-60 hover:opacity-100 transition-opacity"
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
    </>
  );
}
