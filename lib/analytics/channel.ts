"use client";

import posthog from "posthog-js";

export interface ChannelAttribution {
  channel_type: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
}

/**
 * Reads session channel attribution at cart-create time.
 * PostHog's $channel_type degrades to "unknown" when PostHog is not yet loaded
 * (same race-condition behavior as getCartAnalyticsId / detectDeviceType).
 * UTM params and referrer are read directly from the URL and document, so they
 * are always available regardless of PostHog load state.
 */
export function getChannelAttribution(): ChannelAttribution {
  const params = new URLSearchParams(window.location.search);

  let channelType = "unknown";
  if (typeof posthog !== "undefined" && posthog.__loaded) {
    const ph = posthog.get_property("$channel_type");
    if (typeof ph === "string" && ph.length > 0) channelType = ph;
  }

  return {
    channel_type: channelType,
    utm_source: params.get("utm_source") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
    referrer: document.referrer,
  };
}
