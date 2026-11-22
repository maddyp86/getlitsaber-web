// Server-only: decides whether the holiday site or the regular site renders.
//
// The switch is a boolean in Vercel Edge Config (the store that already holds
// `maintenanceMode`): `holidayMode` for production, `holidayModePreview` for
// preview deployments, so a preview can be reviewed before production flips.
// Flipping it takes effect on the next request; no deploy.
//
// Two guards sit on top of the switch:
//   - the campaign's end date. After it the regular site renders even if the
//     switch was left on, so an expired price is never advertised.
//   - fail closed. If Edge Config cannot be read, the regular site renders.

import { cache } from "react";
import { get } from "@vercel/edge-config";
import { setCurrentCampaign } from "./runtime";
import { resolveCampaign, switchKey } from "./resolve";
import type { Campaign } from "./types";

async function readSwitch(): Promise<unknown> {
  // Local development has no Edge Config. HOLIDAY_MODE_FORCE=on turns the
  // campaign on there; it is ignored in production.
  if (process.env.VERCEL_ENV !== "production" && process.env.HOLIDAY_MODE_FORCE === "on") {
    return true;
  }
  return get(switchKey());
}

export const getActiveCampaign = cache(async (): Promise<Campaign | null> => {
  const campaign = await resolveCampaign(readSwitch);
  setCurrentCampaign(campaign);
  return campaign;
});
