"use client";

import { useMemo } from "react";
import { GALLERY_IMAGES, type GalleryImage } from "./productdisplay.content";
import { useCampaign } from "@/lib/campaign/CampaignProvider";

// Campaign images lead the gallery (slots 1 and 2) while a campaign is live;
// the regular lead image and the light-show clip follow them.
const CAMPAIGN_INSERT_AT = 0;

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
