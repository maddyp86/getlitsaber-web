"use client";

import posthog from "posthog-js";
import type { OfferId } from "@/lib/cart/offers";

// ---------------------------------------------------------------------------
// Event name → payload type map (locked snake_case names)
// All funnel captures must route through track() — no inline posthog.capture
// ---------------------------------------------------------------------------

type FunnelEvents = {
  age_gate_confirmed: Record<string, never>;
  homepage_engaged: { trigger: "scroll" | "dwell" | "cta_click" };
  product_viewed: { surface: "pdp" | "homepage_buy" };
  // Fires when the shopper picks an offer card or steps the quantity on the
  // product page. `offer` is derived from quantity (lib/cart/offers.ts), the
  // same rule the orders webhook uses for `offer_selected` on purchase.
  product_offer_selected: {
    offer: OfferId;
    quantity: number;
    line_price: number;
    surface: "pdp" | "homepage_buy";
  };
  // `tier_price` keeps its name for insight continuity; since ADR-009 it is
  // simply the line price (unit price x quantity).
  cart_add_to_cart: {
    variant: "silver";
    quantity: number;
    tier_price: number;
    unit_price: number;
    offer: OfferId;
    source: AddSource;
  };
  cta_clicked: {
    cta: CtaId;
  };
  cart_add_failed: {
    variant: "silver";
    quantity: number;
    source: AddSource | "buy_now";
    reason: string;
  };
  buy_now_clicked: {
    variant: "silver";
    quantity: number;
    tier_price: number;
    offer: OfferId;
  };
  // The checkout handoff (lib/analytics/checkout.ts). `route` is "buy_now" or
  // "cart"; `source` keeps the finer drawer / cart_page split.
  checkout_started: {
    route: "buy_now" | "cart";
    source: "drawer" | "cart_page" | "buy_now";
    offer_selected: OfferId;
    item_count: number;
    cart_value: number;
    /** Estimated shipping for these units: 5.99 for one, 0 for two or more. */
    shipping_amount: number;
    has_promo_code: boolean;
  };
  cart_remove_item: {
    variant: "silver";
    quantity: number;
  };
  promo_code_captured: {
    code: string;
  };
  // Shopify returned a cart line priced below $39.99 a unit (an automatic
  // discount or variant price is misconfigured). The storefront displays the
  // floor instead; this event is the alarm that the Shopify config needs fixing.
  price_floor_violation: {
    quantity: number;
    line_total: number;
    source: "shopify_cart";
  };
  contact_form_submitted: {
    reason: string;
    source: string;
  };
  festival_droplist_signup: {
    source: string;
  };
  rebate_page_viewed: {
    source: string;
  };
  rebate_form_started: Record<string, never>;
  // Never names, email or the post link (personal data stays in HubSpot).
  rebate_form_submitted: {
    order_number: string;
    platform: string;
    source: string;
  };
  rebate_submit_error: {
    reason: string;
    source: string;
  };
  device_activated: {
    activation_source: "packaging_qr" | "insert_qr" | "direct";
    is_first_activation: boolean;
  };
};

/** Every surface that can add Silver to the cart. */
export type AddSource = "homepage_buy" | "pdp" | "home_strip" | "pdp_sticky";

/** Buy-path CTAs, tracked on click so homepage -> PDP reach is measurable. */
export type CtaId =
  | "hero_get_yours"
  | "hero_see_motion"
  | "hero_spec_pill"
  | "home_strip_details"
  | "nav_shop";

export type PayloadFor<E extends keyof FunnelEvents> = FunnelEvents[E];

// Locked event name constants — components reference EVENTS.x, never raw strings
export const EVENTS = {
  age_gate_confirmed: "age_gate_confirmed",
  homepage_engaged: "homepage_engaged",
  product_viewed: "product_viewed",
  product_offer_selected: "product_offer_selected",
  cta_clicked: "cta_clicked",
  cart_add_failed: "cart_add_failed",
  cart_add_to_cart: "cart_add_to_cart",
  buy_now_clicked: "buy_now_clicked",
  checkout_started: "checkout_started",
  cart_remove_item: "cart_remove_item",
  promo_code_captured: "promo_code_captured",
  price_floor_violation: "price_floor_violation",
  contact_form_submitted: "contact_form_submitted",
  festival_droplist_signup: "festival_droplist_signup",
  device_activated: "device_activated",
  rebate_page_viewed: "rebate_page_viewed",
  rebate_form_started: "rebate_form_started",
  rebate_form_submitted: "rebate_form_submitted",
  rebate_submit_error: "rebate_submit_error",
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
