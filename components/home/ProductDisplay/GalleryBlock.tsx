"use client";

import Image from "next/image";
import { GALLERY_IMAGES } from "./productdisplay.content";

export default function GalleryBlock() {
  const mainImage = GALLERY_IMAGES[0];

  return (
    <>
      {/* Desktop: vertical thumb strip LEFT + tall main image RIGHT */}
      <div className="hidden lg:flex flex-row gap-3 h-full">
        {/* Thumb strip */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className={`relative w-[100px] h-[100px] rounded-md overflow-hidden flex-shrink-0 cursor-default ${
                i === 0
                  ? "border-2 border-accent-cyan shadow-glow-cyan"
                  : "border border-border-inactive"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="100px"
              />
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="relative flex-1 rounded-card overflow-hidden min-h-[500px]">
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            className="object-cover"
            sizes="width:100px"
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
            <div
              key={img.src}
              className={`relative w-[100px] h-[100px] flex-shrink-0 rounded-md overflow-hidden cursor-default ${
                i === 0
                  ? "border-2 border-accent-cyan shadow-glow-cyan"
                  : "border border-border-inactive"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="100px"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
