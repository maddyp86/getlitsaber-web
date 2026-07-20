"use client";

// Gates the temporary warehouse shipping-delay notice behind a PostHog boolean
// flag so it can be flipped off (Monday) with no deploy. Mirrors the singleton
// pattern in lib/experiments/useShippingVariant.ts: the app inits one global
// posthog instance in app/providers.tsx and does not mount the posthog-js/react
// provider, so we read the singleton directly and re-read when flags land.
//
// Fail-closed: the notice shows only when the flag evaluates to true. If PostHog
// is unavailable (e.g. local dev with no token, or blocked), the notice stays
// hidden. See lib/promo/shippingNotice.ts for the rollback checklist.

import { useEffect, useState } from "react";
import posthog from "posthog-js";

export const SHIPPING_NOTICE_FLAG = "warehouse-shipping-notice";

export function useShippingNoticeEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const read = () =>
      setEnabled(posthog.isFeatureEnabled(SHIPPING_NOTICE_FLAG) === true);
    read();
    // Flags arrive async after init; re-read when they land / change.
    // onFeatureFlags returns an unsubscribe fn.
    return posthog.onFeatureFlags(read);
  }, []);

  return enabled;
}
