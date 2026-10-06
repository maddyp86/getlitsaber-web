"use client";

import { track, EVENTS } from "./events";
import { offerForQty } from "@/lib/cart/offers";
import { getDisplayShipping } from "@/lib/shipping";

export type CheckoutSource = "drawer" | "cart_page" | "buy_now";

/**
 * The checkout handoff: fired by every button that sends a shopper to Shopify
 * checkout. `route` separates Buy Now from the cart (drawer or cart page);
 * offer and shipping are derived from the units handed off, by the same rules
 * the PDP and the orders webhook use.
 */
export function trackCheckoutHandoff(source: CheckoutSource, cartValue: number, itemCount: number): void {
  track(EVENTS.checkout_started, {
    route: source === "buy_now" ? "buy_now" : "cart",
    source,
    offer_selected: offerForQty(itemCount),
    item_count: itemCount,
    cart_value: cartValue,
    shipping_amount: getDisplayShipping(itemCount) ?? 0,
    has_promo_code: false,
  });
}
