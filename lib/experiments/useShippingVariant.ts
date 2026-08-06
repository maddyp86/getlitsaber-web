"use client";

// Reads the shipping-surcharge experiment arm off the PostHog flag
// `single-unit-shipping-surcharge`.
//
// The app inits a single global posthog instance in app/providers.tsx and does
// NOT mount the posthog-js/react context provider, so we subscribe to that
// singleton directly rather than useFeatureFlagVariantKey. The exported contract
// is identical: 'control' | 'surcharge' | undefined (undefined while flags load).
//
// The arm is sticky per device. The flag buckets on distinct_id, and
// identifyByEmail() swaps distinct_id from $device_id to the email at checkout,
// so a live re-read hands back the other arm partway through a session for some
// shoppers. That moves the shipping price they were already quoted and mislabels
// the arm frozen onto the cart, so the first resolved arm wins from then on.

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import type { ShippingVariant } from "@/lib/shipping";

export const SHIPPING_FLAG_KEY = "single-unit-shipping-surcharge";
const STICKY_STORAGE_KEY = "litsaber_shipping_variant";

function coerce(key: string | boolean | null | undefined): ShippingVariant | undefined {
  return key === "control" || key === "surcharge" ? key : undefined;
}

function readSticky(): ShippingVariant | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return coerce(window.localStorage.getItem(STICKY_STORAGE_KEY));
  } catch {
    // Storage unavailable (Safari private mode, blocked storage) — fall through
    // to a live flag read on every call.
    return undefined;
  }
}

function writeSticky(variant: ShippingVariant): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STICKY_STORAGE_KEY, variant);
  } catch {
    // Non-fatal. We re-resolve from the flag next time.
  }
}

// Adopt an arm already frozen elsewhere (the `_shipping_variant` attribute on an
// existing Shopify cart) as this device's sticky value. The cart outranks a
// fresh flag read: the shopper has already been quoted a price under that arm,
// and re-resolving could hand back the other one. No-ops on a non-arm value.
export function adoptShippingVariant(value: string | null | undefined): ShippingVariant | undefined {
  const arm = coerce(value);
  if (arm) writeSticky(arm);
  return arm;
}

// Non-React read for use outside components (e.g. the cart store at cartCreate).
export function readShippingVariant(): ShippingVariant | undefined {
  const sticky = readSticky();
  if (sticky) return sticky;

  const resolved = coerce(posthog.getFeatureFlag(SHIPPING_FLAG_KEY));
  if (resolved) writeSticky(resolved);
  return resolved;
}

export function useShippingVariant(): ShippingVariant | undefined {
  const [variant, setVariant] = useState<ShippingVariant | undefined>(undefined);

  useEffect(() => {
    // Reads through the sticky store, so a mid-session re-bucket cannot change
    // what is already on screen.
    const read = () => setVariant(readShippingVariant());
    read();
    // Flags arrive async after init; re-read when they land. onFeatureFlags
    // returns an unsubscribe fn.
    return posthog.onFeatureFlags(read);
  }, []);

  return variant;
}
