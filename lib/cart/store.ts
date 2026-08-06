/*
 * PHASE 4b — Shopify cart mutations
 *
 * This store is the single interface between the UI and the cart backend.
 *   addItem    → cartCreate (first item) + cartLinesAdd (subsequent)
 *   removeItem → cartLinesRemove
 *   updateQty  → cartLinesUpdate
 *   clear      → cartLinesRemove all lines; cartId nulled on success only
 *   hydrate    → re-fetches cart from Shopify on app load via cartId in localStorage
 *
 * Components must NEVER import useCartStore or zustand directly.
 * They import the derived hooks exported at the bottom of this file.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { detectDeviceType } from "@/lib/device";
import { getCartAnalyticsId } from "@/lib/analytics/identify";
import { adoptShippingVariant, readShippingVariant } from "@/lib/experiments/useShippingVariant";
import type { ShippingVariant } from "@/lib/shipping";
import { getChannelAttribution } from "@/lib/analytics/channel";
import { getTierPrice, MAX_QTY, BASE_UNIT_PRICE } from "@/lib/cart/pricing";
import { mediaUrl } from "@/lib/media";
import { shopifyFetch } from "@/lib/shopify/client";
import type { ShopifyCart, ShopifyCartResponse, AttributeInput } from "@/lib/shopify/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CartLine = {
  id: string;           // Shopify cart line GID
  variantId: string;    // Shopify variant GID
  qty: number;
  title: string;
  variantTitle: string;
  price: number;        // base unit price in dollars; for per-unit display and optimistic fallback only
  lineTotal: number;    // Shopify-provided discounted line total; seeded optimistically, overwritten on mutation response
  image: string;
};

export type CartState = {
  items: CartLine[];
  cartId: string | null;
  checkoutUrl: string | null;
  capReached: boolean;  // transient — true when the last addItem was clamped at MAX_QTY
  // Shared promise while a cartCreate is in-flight.
  // A second concurrent addItem awaits this, then routes through cartLinesAdd.
  pendingCartCreate: Promise<void> | null;
  // Persisted alongside cartId. Attribution attributes are written at cartCreate
  // only, so a cart that predates them (or was created before posthog-js had
  // loaded) would reach the orders webhook bare and lose the purchase. False on
  // those carts, which makes hydrate() backfill once.
  attributesStamped: boolean;
};

type CartActions = {
  addItem(line: Omit<CartLine, "id" | "lineTotal">): Promise<void>;
  removeItem(lineId: string): Promise<void>;
  updateQty(lineId: string, qty: number): Promise<void>;
  clear(): Promise<void>;
  hydrate(): Promise<void>;
};

type CartStore = CartState & CartActions;

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------

const CART_FRAGMENT = `
  id
  checkoutUrl
  attributes {
    key
    value
  }
  lines(first: 10) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const CART_CREATE = `
  mutation CartCreate($lines: [CartLineInput!]!, $attributes: [AttributeInput!]) {
    cartCreate(input: { lines: $lines, attributes: $attributes }) {
      cart { ${CART_FRAGMENT} }
    }
  }
`;

const CART_LINES_ADD = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FRAGMENT} }
    }
  }
`;

const CART_LINES_REMOVE = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FRAGMENT} }
    }
  }
`;

const CART_LINES_UPDATE = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ${CART_FRAGMENT} }
    }
  }
`;

const CART_ATTRIBUTES_UPDATE = `
  mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart { ${CART_FRAGMENT} }
    }
  }
`;

const CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ${CART_FRAGMENT} }
  }
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Hard-coded for the single Silver SKU. Revisit when multi-product.
function transformShopifyCart(cart: ShopifyCart): CartLine[] {
  return cart.lines.edges.map(({ node }) => ({
    id: node.id,
    variantId: node.merchandise.id,
    qty: node.quantity,
    title: "Litsaber OG — Silver",
    variantTitle: "Silver",
    price: BASE_UNIT_PRICE,
    lineTotal: parseFloat(node.cost.totalAmount.amount),
    image: mediaUrl("product/litsaber-packaging-1.jpg"),
  }));
}

function shopifyEnvPresent(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
}

function fulfillmentSku(qty: number): string {
  return qty <= 1 ? "LTS-OG-SLV" : `LTS-OG-SLV-${qty}`;
}

// Attribution attributes the orders webhook reads back off the order: who the
// visitor is, where they came from, and which experiment arm they shopped under.
// Shared by cartCreate and the hydrate() backfill so the two cannot drift.
// `frozenArm` is the arm already on an existing cart; when present it wins over
// a fresh flag read so a re-stamp cannot move a price mid-cart.
function buildCartAttributes(frozenArm?: ShippingVariant): AttributeInput[] {
  const attributes: AttributeInput[] = [];

  const phId = getCartAnalyticsId();
  if (phId) attributes.push({ key: "posthog_distinct_id", value: phId });

  const storedDiscount = sessionStorage.getItem("litsaber_discount");
  if (storedDiscount) attributes.push({ key: "discount_code", value: storedDiscount });

  attributes.push({ key: "device_type", value: detectDeviceType() });

  const channel = getChannelAttribution();
  attributes.push({ key: "channel_type", value: channel.channel_type });
  attributes.push({ key: "utm_source", value: channel.utm_source });
  attributes.push({ key: "utm_medium", value: channel.utm_medium });
  attributes.push({ key: "utm_campaign", value: channel.utm_campaign });
  attributes.push({ key: "referrer", value: channel.referrer });

  // Shipping-surcharge arm. Underscore-prefixed so it is suppressed from the
  // checkout UI while visible to the Order API. readShippingVariant() is sticky
  // per device, so re-stamping cannot flip a shopper's arm. "unresolved" when
  // flags have not loaded: the Shopify delivery Function treats anything that is
  // not "surcharge" as free shipping, and labelling it honestly keeps an
  // unbucketed order from being filed under control and diluting that arm.
  attributes.push({
    key: "_shipping_variant",
    value: frozenArm ?? readShippingVariant() ?? "unresolved",
  });

  return attributes;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      capReached: false,
      pendingCartCreate: null,
      attributesStamped: false,

      async addItem(line) {
        // Compute clamped quantities before touching state.
        const existingLine = get().items.find((i) => i.variantId === line.variantId);
        const existingQty = existingLine?.qty ?? 0;
        const resultQty = Math.min(existingQty + line.qty, MAX_QTY);
        const effectiveAddQty = resultQty - existingQty;
        const clamped = resultQty < existingQty + line.qty;

        // Already at cap — nothing to add.
        if (effectiveAddQty <= 0) {
          set({ capReached: true });
          return;
        }

        // Optimistic update — lineTotal seeded from local tier table; overwritten on Shopify response.
        set((state) => {
          const existing = state.items.find((i) => i.variantId === line.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === line.variantId
                  ? { ...i, qty: resultQty, lineTotal: getTierPrice(resultQty) }
                  : i
              ),
              capReached: clamped,
            };
          }
          return {
            items: [...state.items, { ...line, qty: resultQty, lineTotal: getTierPrice(resultQty), id: crypto.randomUUID() }],
            capReached: clamped,
          };
        });

        const optimisticItems = get().items;

        try {
          // If a cartCreate is already in-flight, wait for it so we have a cartId.
          const pending = get().pendingCartCreate;
          if (pending) {
            await pending;
          }

          const { cartId } = get();

          if (!cartId) {
            // First item — create the cart.
            let resolveCreate!: () => void;
            const createPromise = new Promise<void>((res) => {
              resolveCreate = res;
            });
            set({ pendingCartCreate: createPromise });

            try {
              const attributes = buildCartAttributes();
              if (process.env.NODE_ENV !== "production") {
                console.log("[cart] cart attributes =", attributes);
              }
              const data = await shopifyFetch<ShopifyCartResponse>(CART_CREATE, {
                lines: [{ merchandiseId: line.variantId, quantity: resultQty, attributes: [{ key: "_fulfillment_sku", value: fulfillmentSku(resultQty) }] }],
                attributes,
              });
              const cart = data.cartCreate!.cart;
              set({
                cartId: cart.id,
                items: transformShopifyCart(cart),
                checkoutUrl: cart.checkoutUrl,
                pendingCartCreate: null,
                // Only "stamped" once identity actually made it on. posthog-js
                // may still have been loading here, and without the visitor id
                // the purchase cannot be joined back to an exposure — leave the
                // flag false so hydrate() retries on the next visit.
                attributesStamped: attributes.some((a) => a.key === "posthog_distinct_id"),
              });
            } finally {
              resolveCreate();
            }
          } else if (existingLine) {
            // Variant already in cart — set to the absolute clamped total (idempotent on retry).
            const data = await shopifyFetch<ShopifyCartResponse>(CART_LINES_UPDATE, {
              cartId,
              lines: [{ id: existingLine.id, quantity: resultQty, attributes: [{ key: "_fulfillment_sku", value: fulfillmentSku(resultQty) }] }],
            });
            set({
              items: transformShopifyCart(data.cartLinesUpdate!.cart),
              checkoutUrl: data.cartLinesUpdate!.cart.checkoutUrl,
            });
          } else {
            // New variant — add line.
            const data = await shopifyFetch<ShopifyCartResponse>(CART_LINES_ADD, {
              cartId,
              lines: [{ merchandiseId: line.variantId, quantity: resultQty, attributes: [{ key: "_fulfillment_sku", value: fulfillmentSku(resultQty) }] }],
            });
            set({
              items: transformShopifyCart(data.cartLinesAdd!.cart),
              checkoutUrl: data.cartLinesAdd!.cart.checkoutUrl,
            });
          }
        } catch (err) {
          console.error("[cart] addItem failed:", err);
          // TODO: wire toast — "Failed to add item. Please try again."
          set({ items: optimisticItems, pendingCartCreate: null });
        }
      },

      async removeItem(lineId) {
        const { cartId, items } = get();

        // Optimistic update — clearing capReached since qty will drop below MAX_QTY.
        set((state) => ({
          items: state.items.filter((i) => i.id !== lineId),
          capReached: false,
        }));

        if (!cartId) return;

        try {
          const data = await shopifyFetch<ShopifyCartResponse>(CART_LINES_REMOVE, {
            cartId,
            lineIds: [lineId],
          });
          set({
            items: transformShopifyCart(data.cartLinesRemove!.cart),
            checkoutUrl: data.cartLinesRemove!.cart.checkoutUrl,
          });
        } catch (err) {
          console.error("[cart] removeItem failed:", err);
          // TODO: wire toast — "Failed to remove item. Please try again."
          set({ items });
        }
      },

      async updateQty(lineId, qty) {
        if (qty <= 0) {
          return get().removeItem(lineId);
        }

        const clampedQty = Math.min(qty, MAX_QTY);
        const { cartId, items } = get();
        const originalQty = items.find((i) => i.id === lineId)?.qty ?? clampedQty;

        // Optimistic update — lineTotal reseeded from local tier table; overwritten on Shopify response.
        set((state) => ({
          items: state.items.map((i) =>
            i.id === lineId ? { ...i, qty: clampedQty, lineTotal: getTierPrice(clampedQty) } : i
          ),
        }));

        if (!cartId) return;

        try {
          const data = await shopifyFetch<ShopifyCartResponse>(CART_LINES_UPDATE, {
            cartId,
            lines: [{ id: lineId, quantity: clampedQty, attributes: [{ key: "_fulfillment_sku", value: fulfillmentSku(clampedQty) }] }],
          });
          set({
            items: transformShopifyCart(data.cartLinesUpdate!.cart),
            checkoutUrl: data.cartLinesUpdate!.cart.checkoutUrl,
          });
        } catch (err) {
          console.error("[cart] updateQty failed:", err);
          // TODO: wire toast — "Failed to update quantity. Please try again."
          set((state) => ({
            items: state.items.map((i) =>
              i.id === lineId ? { ...i, qty: originalQty } : i
            ),
          }));
        }
      },

      async clear() {
        const { cartId, items } = get();

        // Optimistic wipe of items only; keep cartId during the Shopify call.
        set({ items: [] });

        if (!cartId) return;

        try {
          const lineIds = items.map((i) => i.id);
          await shopifyFetch<ShopifyCartResponse>(CART_LINES_REMOVE, {
            cartId,
            lineIds,
          });
          // Null cartId only on confirmed success. Next addItem triggers a fresh cartCreate.
          set({ cartId: null, checkoutUrl: null, attributesStamped: false });
        } catch (err) {
          console.error("[cart] clear failed:", err);
          // TODO: wire toast — "Failed to clear cart. Please try again."
          set({ items });
        }
      },

      async hydrate() {
        if (!shopifyEnvPresent()) return;

        const { cartId } = get();
        if (!cartId) return;

        try {
          const data = await shopifyFetch<ShopifyCartResponse>(CART_QUERY, { cartId });
          const cart = data.cart;
          if (!cart) {
            // Cart expired or invalid — clean up stale localStorage reference.
            set({ cartId: null, items: [], checkoutUrl: null, attributesStamped: false });
            return;
          }
          set({ items: transformShopifyCart(cart), checkoutUrl: cart.checkoutUrl });

          // An arm already frozen on the cart is authoritative — the shopper has
          // been quoted a price under it. Adopt it as this device's sticky value
          // so the UI and any re-stamp agree with what checkout will charge.
          const frozenArm = adoptShippingVariant(
            cart.attributes?.find((a) => a.key === "_shipping_variant")?.value
          );

          // Backfill attribution onto a cart that never got it. Carts are only
          // stamped at cartCreate, so one created before this shipped (or before
          // posthog-js had loaded) reaches the orders webhook with no visitor id
          // and the purchase falls back to a synthetic `order_<id>` that can
          // never join an experiment exposure. Channel here is the current
          // session's rather than first touch, which is still strictly better
          // than the "unknown" those orders carry today. The arm is carried over
          // verbatim, never re-resolved: the brief's "if already present, NEVER
          // overwrite" rule is what keeps a mid-cart price from moving.
          if (!get().attributesStamped) {
            const attributes = buildCartAttributes(frozenArm);
            if (attributes.some((a) => a.key === "posthog_distinct_id")) {
              await shopifyFetch<ShopifyCartResponse>(CART_ATTRIBUTES_UPDATE, {
                cartId,
                attributes,
              });
              set({ attributesStamped: true });
            }
          }
        } catch (err) {
          console.error("[cart] hydrate failed:", err);
          // Silently fail — user sees stale local state; next action will surface any real error.
        }
      },
    }),
    {
      name: "litsaber-cart",
      // Only persist cartId and whether its attribution attributes landed. Items
      // and checkoutUrl are re-fetched from Shopify on hydration.
      partialize: (state) => ({
        cartId: state.cartId,
        attributesStamped: state.attributesStamped,
      }),
    }
  )
);

// ---------------------------------------------------------------------------
// Derived selector hooks — components import ONLY these
// ---------------------------------------------------------------------------

export function useCartItems(): CartLine[] {
  return useCartStore((s) => s.items);
}

export function useCartId(): string | null {
  return useCartStore((s) => s.cartId);
}

export function useItemCount(): number {
  return useCartStore((s) => s.items.reduce((acc, i) => acc + i.qty, 0));
}

export function useSubtotal(): number {
  // Sum Shopify's discounted line totals. Line-level summing is correct for
  // the current single-SKU setup; cart.cost.totalAmount is the more
  // future-proof source once order-level discounts or multiple SKUs exist.
  return useCartStore(
    (s) => s.items.reduce((acc, i) => acc + i.lineTotal, 0)
  );
}

export function useCartLineTotal(lineId: string): number {
  return useCartStore((s) => {
    const line = s.items.find((i) => i.id === lineId);
    return line ? line.lineTotal : 0;
  });
}

export function useCartActions(): Pick<CartActions, "addItem" | "removeItem" | "updateQty" | "clear"> {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clear = useCartStore((s) => s.clear);
  return { addItem, removeItem, updateQty, clear };
}

export function useCartHydrate(): () => Promise<void> {
  return useCartStore((s) => s.hydrate);
}

export function useCheckoutUrl(): string | null {
  return useCartStore((s) => s.checkoutUrl);
}

export function useCapReached(): boolean {
  return useCartStore((s) => s.capReached);
}
