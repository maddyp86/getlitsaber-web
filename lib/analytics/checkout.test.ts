import { describe, expect, it, vi } from "vitest";

const track = vi.fn();
vi.mock("./events", () => ({ track: (...a: unknown[]) => track(...a), EVENTS: { checkout_started: "checkout_started" } }));

import { trackCheckoutHandoff } from "./checkout";

describe("checkout handoff", () => {
  it("records the route, offer, units and estimated shipping for each route", () => {
    trackCheckoutHandoff("buy_now", 39.99, 1);
    trackCheckoutHandoff("drawer", 79.98, 2);
    trackCheckoutHandoff("cart_page", 119.97, 3);
    expect(track.mock.calls.map((c) => c[1])).toEqual([
      { route: "buy_now", source: "buy_now", offer_selected: "single", item_count: 1, cart_value: 39.99, shipping_amount: 5.99, has_promo_code: false },
      { route: "cart", source: "drawer", offer_selected: "two_pack", item_count: 2, cart_value: 79.98, shipping_amount: 0, has_promo_code: false },
      { route: "cart", source: "cart_page", offer_selected: "custom_qty", item_count: 3, cart_value: 119.97, shipping_amount: 0, has_promo_code: false },
    ]);
  });
});
