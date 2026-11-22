"use client";

import { useMemo } from "react";
import { GALLERY_IMAGES, type GalleryImage } from "./productdisplay.content";
import { useCampaign } from "@/lib/campaign/CampaignProvider";

// Campaign images go in as ordinary thumbnails after the first two slides, so
// the lead image and the light-show clip keep their places.
const CAMPAIGN_INSERT_AT = 2;

/** The PDP gallery: the regular images, plus the active campaign's extras. */
export function useGalleryImages(): GalleryImage[] {
  const campaign = useCampaign();
  return useMemo(() => {
    if (!campaign || campaign.gallery.length === 0) return GALLERY_IMAGES;
    return [
      ...GALLERY_IMAGES.slice(0, CAMPAIGN_INSERT_AT),
      ...campaign.gallery,
      ...GALLERY_IMAGES.slice(CAMPAIGN_INSERT_AT),
    ];
  }, [campaign]);
}
