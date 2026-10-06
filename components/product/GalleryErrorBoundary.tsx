"use client";

import { Component, type ReactNode } from "react";
import Image from "next/image";
import { GALLERY_IMAGES } from "./productdisplay.content";

/**
 * Contains a gallery failure to the gallery. Without a boundary, an exception
 * in any gallery control unmounts the whole product page, prices and buy
 * buttons included. The fallback is the lead photo, still and static.
 */
export default class GalleryErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[gallery] crashed, showing the static fallback", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const lead = GALLERY_IMAGES.find((img) => img.type !== "video") ?? GALLERY_IMAGES[0];
    return (
      <div className="relative w-full aspect-square rounded-card overflow-hidden bg-black">
        <Image src={lead.src} alt={lead.alt} fill className="object-cover" sizes="(min-width: 600px) 50vw, 100vw" />
      </div>
    );
  }
}
