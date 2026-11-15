// Ad-click parameters that must survive the hop to Shopify checkout.
//
// The storefront and checkout are different domains, so the utm_* tags and
// Meta's fbclid on the landing URL would otherwise be lost at the handoff.
// They are remembered on landing (CartHydrator) and appended to the checkout
// URL (lib/cart/checkoutHref.ts), where Shopify records them on the order and
// Meta's pixel on checkout can read fbclid. Pure functions plus thin storage
// helpers, so they are unit-testable.
//
// Kept for 7 days (Meta's click attribution window); the latest landing that
// carries any of these parameters replaces the stored set. No personal data
// is involved: utm_* are campaign labels and fbclid is an opaque click id.

export const CARRIED_PARAM = /^(utm_[a-z0-9_]+|fbclid)$/i;

const STORAGE_KEY = "litsaber_landing_params";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type LandingParams = Record<string, string>;

/** The carried parameters present in a query string. */
export function landingParamsFrom(search: string): LandingParams {
  const out: LandingParams = {};
  for (const [key, value] of Array.from(new URLSearchParams(search).entries())) {
    if (CARRIED_PARAM.test(key) && value) out[key.toLowerCase()] = value;
  }
  return out;
}

/** Remember this landing's carried parameters, if it has any. */
export function rememberLandingParams(search: string, now: number = Date.now()): void {
  const params = landingParamsFrom(search);
  if (Object.keys(params).length === 0) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ params, at: now }));
  } catch {
    // Storage unavailable: attribution falls back to what the checkout URL already has.
  }
}

export function readLandingParams(now: number = Date.now()): LandingParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const stored = JSON.parse(raw) as { params?: LandingParams; at?: number };
    if (typeof stored.at !== "number" || now - stored.at > TTL_MS) return {};
    return stored.params ?? {};
  } catch {
    return {};
  }
}

/**
 * Append the given parameters to a URL. A parameter the URL already carries
 * is left as is. Returns the URL unchanged when there is nothing to add or it
 * cannot be parsed.
 */
export function appendParamsToUrl(url: string, params: LandingParams): string {
  const entries = Object.entries(params);
  if (entries.length === 0) return url;
  try {
    const parsed = new URL(url);
    let changed = false;
    for (const [key, value] of entries) {
      if (parsed.searchParams.has(key)) continue;
      parsed.searchParams.append(key, value);
      changed = true;
    }
    return changed ? parsed.toString() : url;
  } catch {
    return url;
  }
}
