"use client";

import Image from "next/image";
import { BAND_IMAGE_SRC, BAND_IMAGE_ALT } from "./about.content";

export default function JourneyImageBand() {
  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Litsaber components"
      style={{ height: "clamp(300px, 56vw, 810px)" }}
    >
      <Image
        src={BAND_IMAGE_SRC}
        alt={BAND_IMAGE_ALT}
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={false}
      />
    </section>
  );
}