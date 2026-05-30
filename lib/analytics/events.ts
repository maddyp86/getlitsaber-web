"use client";

import posthog from "posthog-js";

// ---------------------------------------------------------------------------
// Event name → payload type map (locked snake_case names)
// All funnel captures must route through track() — no inline posthog.capture
// ---------------------------------------------------------------------------

type FunnelEvents = {
  age_gate_confirmed: Record<string, never>;
  homepage_engaged: { trigger: "scroll" | "dwell" | "cta_click" };
  product_viewed: { surface: "pdp" | "homepage_buy" };
  cart_add_to_cart: {
    variant: "silver";
    quantity: number;
    tier_price: number;
    unit_price: number;
  };
  buy_now_clicked: {
    variant: "silver";
    quantity: number;
    tier_price: number;
  };
  checkout_started: {
    cart_value: number;
    item_count: number;
    has_promo_code: boolean;
  };
};

export type PayloadFor<E extends keyof FunnelEvents> = FunnelEvents[E];

// Locked event name constants — components reference EVENTS.x, never raw strings
export const EVENTS = {
  age_gate_confirmed: "age_gate_confirmed",
  homepage_engaged: "homepage_engaged",
  product_viewed: "product_viewed",
  cart_add_to_cart: "cart_add_to_cart",
  buy_now_clicked: "buy_now_clicked",
  checkout_started: "checkout_started",
} as const satisfies Record<keyof FunnelEvents, string>;

// ---------------------------------------------------------------------------
// track() — the single capture path
// A wrong or missing payload property is a compile error.
// No-ops silently if PostHog is not initialized.
// ---------------------------------------------------------------------------

export function track<E extends keyof FunnelEvents>(
  event: E,
  properties: PayloadFor<E>
): void {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;
  posthog.capture(event, properties as Record<string, unknown>);
}
