"use client";

import Image from "next/image";
import { MFG_BAND_SRC, MFG_BAND_ALT } from "./about.content";

export default function ManufacturingImageBand() {
  return (
    <div
      className="relative hidden lg:block w-full overflow-hidden"
      style={{ height: "clamp(400px, 35vw, 500px)" }}
      aria-hidden="true"
    >
      <Image
        src={MFG_BAND_SRC}
        alt={MFG_BAND_ALT}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      
    </div>
  );
}
