import { beforeEach, describe, expect, it, vi } from "vitest";

const shopifyFetch = vi.fn();
vi.mock("@/lib/shopify/client", () => ({ shopifyFetch: (...args: unknown[]) => shopifyFetch(...args) }));
vi.mock("@/lib/analytics/events", () => ({ track: vi.fn(), EVENTS: new Proxy({}, { get: (_t, key) => key }) }));

import { useCartStore } from "./store";

const VARIANT = "gid://shopify/ProductVariant/1";

function oneOffCart(qty: number) {
  return {
    cartCreate: {
      cart: {
        id: "gid://shopify/Cart/one-off",
        checkoutUrl: "https://checkout.getlitsaber.com/cart/c/one-off",
        attributes: [],
        lines: {
          edges: [
            {
              node: {
                id: "gid://shopify/CartLine/x",
                quantity: qty,
                merchandise: { id: VARIANT },
                cost: { totalAmount: { amount: (39.99 * qty).toFixed(2), currencyCode: "USD" } },
              },
            },
          ],
        },
      },
    },
  };
}

beforeEach(() => {
  shopifyFetch.mockReset();
  // The shopper already has one unit in their persisted cart.
  useCartStore.setState({
    cartId: "gid://shopify/Cart/existing",
    checkoutUrl: "https://checkout.getlitsaber.com/cart/c/existing",
    items: [
      { id: "line-1", variantId: VARIANT, qty: 1, title: "Litsaber OG — Silver", variantTitle: "Silver", price: 39.99, lineTotal: 39.99, image: "" },
    ],
  });
});

describe("buyNow", () => {
  it("checks out exactly the selected units in a one-off cart, leaving the cart alone", async () => {
    shopifyFetch.mockResolvedValue(oneOffCart(1));
    const result = await useCartStore.getState().buyNow(VARIANT, 1);

    expect(result).toEqual({
      status: "ready",
      checkoutUrl: "https://checkout.getlitsaber.com/cart/c/one-off",
      qty: 1,
      lineTotal: 39.99,
    });
    // A cartCreate for 1 unit, not an add to the existing cart.
    const [mutation, vars] = shopifyFetch.mock.calls[0];
    expect(mutation).toContain("cartCreate");
    expect(vars.lines).toEqual([
      { merchandiseId: VARIANT, quantity: 1, attributes: [{ key: "_fulfillment_sku", value: "LTS-OG-SLV" }] },
    ]);
    expect(vars.attributes).toContainEqual({ key: "_shipping_variant", value: "surcharge" });
    // The persisted cart is untouched.
    const state = useCartStore.getState();
    expect(state.cartId).toBe("gid://shopify/Cart/existing");
    expect(state.items.map((i) => i.qty)).toEqual([1]);
  });

  it("never sends more than the cart cap", async () => {
    shopifyFetch.mockResolvedValue(oneOffCart(5));
    await useCartStore.getState().buyNow(VARIANT, 9);
    expect(shopifyFetch.mock.calls[0][1].lines[0].quantity).toBe(5);
  });

  it("reports a failure without touching the cart", async () => {
    shopifyFetch.mockRejectedValue(new Error("network down"));
    const result = await useCartStore.getState().buyNow(VARIANT, 2);
    expect(result).toEqual({ status: "failed", reason: "network down" });
    expect(useCartStore.getState().items).toHaveLength(1);
  });
});
