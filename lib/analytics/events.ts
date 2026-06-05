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
    source: "homepage_buy" | "pdp";
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
    source: "drawer" | "cart_page" | "buy_now";
  };
  cart_remove_item: {
    variant: "silver";
    quantity: number;
  };
  promo_popup_shown: {
    trigger: "time_delay" | "exit_intent";
  };
  promo_email_submitted: {
    source: string;
  };
  promo_code_captured: {
    code: string;
  };
  promo_popup_dismissed: {
    method: "close_button" | "backdrop" | "escape";
  };
  contact_form_submitted: {
    reason: string;
    source: string;
  };
  festival_droplist_signup: {
    source: string;
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
  cart_remove_item: "cart_remove_item",
  promo_popup_shown: "promo_popup_shown",
  promo_email_submitted: "promo_email_submitted",
  promo_code_captured: "promo_code_captured",
  promo_popup_dismissed: "promo_popup_dismissed",
  contact_form_submitted: "contact_form_submitted",
  festival_droplist_signup: "festival_droplist_signup",
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

// ---------------------------------------------------------------------------
// trackWhenReady() — for events that fire at or near mount, before PostHog
// finishes its async init. If PostHog is already loaded, delegates to track()
// immediately. If not, defers via onFeatureFlags (fires once after init).
// Use this instead of track() for any mount-time or early-lifecycle event.
// ---------------------------------------------------------------------------

export function trackWhenReady<E extends keyof FunnelEvents>(
  event: E,
  properties: PayloadFor<E>
): void {
  if (typeof window === "undefined") return;
  if (posthog.__loaded) {
    posthog.capture(event, properties as Record<string, unknown>);
  } else {
    posthog.onFeatureFlags(() => {
      track(event, properties);
    });
  }
}
