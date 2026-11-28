"use client";

import { useMemo } from "react";
import { GALLERY_IMAGES, type GalleryImage } from "./productdisplay.content";
import { useCampaign } from "@/lib/campaign/CampaignProvider";
import type { GalleryExtra } from "@/lib/campaign/types";

/**
 * Places a campaign's images into the regular gallery. An image with a `slot`
 * lands in that slot (counting from 1) of the finished gallery; one without
 * goes to the front, in the order listed. Slots are filled lowest first, so
 * each one is the image's final position.
 */
export function mergeGallery(base: GalleryImage[], extras: GalleryExtra[]): GalleryImage[] {
  if (extras.length === 0) return base;
  const merged = [...base];
  const unslotted = extras.filter((e) => e.slot === undefined);
  const slotted = extras
    .filter((e): e is GalleryExtra & { slot: number } => e.slot !== undefined)
    .sort((a, b) => a.slot - b.slot);
  merged.unshift(...unslotted.map(({ src, alt }) => ({ src, alt })));
  for (const { src, alt, slot } of slotted) {
    const index = Math.min(Math.max(Math.round(slot) - 1, 0), merged.length);
    merged.splice(index, 0, { src, alt });
  }
  return merged;
}

/** The PDP gallery: the regular images, plus the active campaign's extras. */
export function useGalleryImages(): GalleryImage[] {
  const campaign = useCampaign();
  return useMemo(() => mergeGallery(GALLERY_IMAGES, campaign?.gallery ?? []), [campaign]);
}
