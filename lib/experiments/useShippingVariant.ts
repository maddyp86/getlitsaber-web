"use client";

// Reads the shipping-surcharge experiment arm off the PostHog flag
// `single-unit-shipping-surcharge`.
//
// The app inits a single global posthog instance in app/providers.tsx and does
// NOT mount the posthog-js/react context provider, so we subscribe to that
// singleton directly rather than useFeatureFlagVariantKey. The exported contract
// is identical: 'control' | 'surcharge' | undefined (undefined while flags load).

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import type { ShippingVariant } from "@/lib/shipping";

export const SHIPPING_FLAG_KEY = "single-unit-shipping-surcharge";

function coerce(key: string | boolean | undefined): ShippingVariant | undefined {
  return key === "control" || key === "surcharge" ? key : undefined;
}

// Non-React read for use outside components (e.g. the cart store at cartCreate).
export function readShippingVariant(): ShippingVariant | undefined {
  return coerce(posthog.getFeatureFlag(SHIPPING_FLAG_KEY));
}

export function useShippingVariant(): ShippingVariant | undefined {
  const [variant, setVariant] = useState<ShippingVariant | undefined>(undefined);

  useEffect(() => {
    const read = () => setVariant(coerce(posthog.getFeatureFlag(SHIPPING_FLAG_KEY)));
    read();
    // Flags arrive async after init; re-read when they land. onFeatureFlags
    // returns an unsubscribe fn.
    return posthog.onFeatureFlags(read);
  }, []);

  return variant;
}
