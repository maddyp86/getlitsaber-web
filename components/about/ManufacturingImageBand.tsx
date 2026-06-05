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
      {/* Bottom fade into next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #0A0518 100%)",
        }}
      />
    </div>
  );
}
