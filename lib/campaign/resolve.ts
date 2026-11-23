// The switch decision, kept free of React and Edge Config so it is unit-tested
// directly (lib/campaign/campaign.test.ts). getActiveCampaign.ts supplies the
// real switch reader.

import { HOLIDAY_2026 } from "./holiday2026";
import { isWithinWindow } from "./runtime";
import type { Campaign } from "./types";

/** Edge Config key: one switch for production, a separate one for previews. */
export function switchKey(vercelEnv: string | undefined = process.env.VERCEL_ENV): string {
  return vercelEnv === "production" ? "holidayMode" : "holidayModePreview";
}

/**
 * The campaign to render, or null for the regular site. On only when the
 * switch reads exactly `true` AND the campaign has not ended. A switch that
 * cannot be read counts as off.
 */
export async function resolveCampaign(
  readSwitch: () => Promise<unknown>,
  now: Date = new Date()
): Promise<Campaign | null> {
  let on = false;
  try {
    on = (await readSwitch()) === true;
  } catch {
    on = false;
  }
  if (!on) return null;
  return isWithinWindow(HOLIDAY_2026, now) ? HOLIDAY_2026 : null;
}
