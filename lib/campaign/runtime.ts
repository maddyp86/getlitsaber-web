// The campaign the current render is using, readable from plain modules (the
// pricing helpers, the cart store) that cannot use React context.
//
// It is set in two places, both before anything reads it:
//   - on the server, by getActiveCampaign() (lib/campaign/getActiveCampaign.ts)
//   - in client components, by <CampaignProvider>, during its own render, which
//     runs before its children both in SSR and on hydration.
//
// The value is the same for every visitor of a deployment at a given moment
// (one switch, one clock), so module scope is safe on the server.

import { HOLIDAY_2026 } from "./holiday2026";
import type { Campaign, BarPhase } from "./types";

const CAMPAIGNS: Record<string, Campaign> = {
  [HOLIDAY_2026.id]: HOLIDAY_2026,
};

let current: Campaign | null = null;

export function campaignById(id: string | null | undefined): Campaign | null {
  return id ? (CAMPAIGNS[id] ?? null) : null;
}

export function setCurrentCampaign(campaign: Campaign | null): void {
  current = campaign;
}

export function currentCampaign(): Campaign | null {
  return current;
}

/** False once the campaign's end instant has passed. */
export function isWithinWindow(campaign: Campaign, now: Date = new Date()): boolean {
  return now.getTime() < new Date(campaign.end).getTime();
}

/** The bar phase covering `now`, or null between and outside phases. */
export function activeBarPhase(campaign: Campaign, now: Date = new Date()): BarPhase | null {
  const t = now.getTime();
  return (
    campaign.bar.phases.find(
      (p) => t >= new Date(p.start).getTime() && t < new Date(p.end).getTime()
    ) ?? null
  );
}
