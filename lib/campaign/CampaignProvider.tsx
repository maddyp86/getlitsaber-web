"use client";

import { createContext, useContext } from "react";
import { campaignById, setCurrentCampaign } from "./runtime";
import type { Campaign } from "./types";

const CampaignContext = createContext<Campaign | null>(null);

/**
 * Hands the server's campaign decision to client components and to the plain
 * modules (pricing, cart store) through lib/campaign/runtime.ts. Only the id
 * crosses the server/client boundary; the config is looked up on each side.
 */
export default function CampaignProvider({
  campaignId,
  children,
}: {
  campaignId: string | null;
  children: React.ReactNode;
}) {
  const campaign = campaignById(campaignId);
  // Set during render, on purpose: children read it through the pricing
  // helpers while they render, so an effect would be too late.
  setCurrentCampaign(campaign);
  return <CampaignContext.Provider value={campaign}>{children}</CampaignContext.Provider>;
}

export function useCampaign(): Campaign | null {
  return useContext(CampaignContext);
}
