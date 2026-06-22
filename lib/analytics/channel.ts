// Channel is derived synchronously here rather than read from PostHog because
// $channel_type is a query-time computed property and is not readable on the
// client via get_property(). Raw referrer and UTM fields are carried alongside
// channel_type for sub-source analysis in PostHog and Supabase.

"use client";

export interface ChannelAttribution {
  channel_type: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
}

const PAID_MEDIUMS = new Set(["cpc", "cpm", "cpv", "cpa", "ppc", "retargeting"]);

const SOCIAL_SOURCES = new Set([
  "tiktok", "instagram", "facebook", "fb", "twitter", "x", "youtube",
  "reddit", "snapchat", "linkedin",
]);

const SEARCH_SOURCES = new Set([
  "google", "bing", "duckduckgo", "yahoo", "ecosia", "baidu",
]);

const SOCIAL_HOSTNAMES = new Set([
  "tiktok.com", "instagram.com", "facebook.com", "twitter.com", "x.com",
  "youtube.com", "reddit.com", "snapchat.com", "linkedin.com",
]);

const SEARCH_HOSTNAMES = new Set([
  "google.com", "bing.com", "duckduckgo.com", "yahoo.com", "ecosia.org", "baidu.com",
]);

function deriveChannel(referrer: string, utmSource: string, utmMedium: string): string {
  const medium = utmMedium.toLowerCase();
  const source = utmSource.toLowerCase();

  if (PAID_MEDIUMS.has(medium) || medium.startsWith("paid")) return "Paid";
  if (source && SOCIAL_SOURCES.has(source)) return "Organic Social";
  if (source && SEARCH_SOURCES.has(source)) return "Organic Search";
  if (source) return "Campaign";

  if (!referrer) return "Direct";

  try {
    const hostname = new URL(referrer).hostname.replace(/^www\./, "");
    if (SEARCH_HOSTNAMES.has(hostname)) return "Organic Search";
    if (SOCIAL_HOSTNAMES.has(hostname)) return "Organic Social";
    return "Referral";
  } catch {
    return "Direct";
  }
}

export function getChannelAttribution(): ChannelAttribution {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source") ?? "";
  const utmMedium = params.get("utm_medium") ?? "";
  const utmCampaign = params.get("utm_campaign") ?? "";
  const referrer = document.referrer;

  return {
    channel_type: deriveChannel(referrer, utmSource, utmMedium),
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    referrer,
  };
}
