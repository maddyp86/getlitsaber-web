/*
 * PHASE 4 SWAP SEAM — read before modifying
 *
 * This store is the single interface between the UI and the cart backend.
 * Phases 1–3: all action bodies operate on local Zustand state only.
 *             No network calls, no Shopify imports anywhere in this file.
 * Phase 4:    Swap the action bodies to Shopify Storefront API mutations:
 *               addItem    → cartCreate (first item) + cartLinesAdd
 *               removeItem → cartLinesRemove
 *               updateQty  → cartLinesUpdate
 *               clear      → cartLinesRemove all lines
 *             cartId transitions from null → Shopify's opaque cart handle
 *             (returned by cartCreate). The component layer does not change.
 *
 * Components must NEVER import useCartStore or zustand directly.
 * They import the derived hooks exported at the bottom of this file.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CartLine = {
  id: string;          // line id — local: crypto.randomUUID(); Phase 4: Shopify line id
  variantId: string;   // opaque variant key e.g. "silver-single", "silver-twopack"
  qty: number;
  title: string;       // product title e.g. "Litsaber OG — Silver"
  variantTitle: string;// e.g. "Single" | "Two Pack"
  price: number;       // unit price in dollars (59.99 / 99.99)
  image: string;       // thumbnail path
};

export type CartState = {
  items: CartLine[];
  cartId: string | null; // null until Phase 4 wires cartCreate; do not set locally
};

type CartActions = {
  addItem(line: Omit<CartLine, "id">): void;
  removeItem(lineId: string): void;
  updateQty(lineId: string, qty: number): void;
  clear(): void;
};

type CartStore = CartState & CartActions;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      cartId: null,

      addItem(line) {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === line.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === line.variantId
                  ? { ...i, qty: i.qty + line.qty }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...line, id: crypto.randomUUID() },
            ],
          };
        });
      },

      removeItem(lineId) {
        set((state) => ({
          items: state.items.filter((i) => i.id !== lineId),
        }));
      },

      updateQty(lineId, qty) {
        if (qty <= 0) {
          set((state) => ({
            items: state.items.filter((i) => i.id !== lineId),
          }));
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === lineId ? { ...i, qty } : i
            ),
          }));
        }
      },

      clear() {
        set({ items: [], cartId: null });
      },
    }),
    {
      name: "litsaber-cart",
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
  return useCartStore(
    (s) => s.items.reduce((acc, i) => acc + i.price * i.qty, 0)
  );
}

export function useCartActions(): CartActions {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clear = useCartStore((s) => s.clear);
  return { addItem, removeItem, updateQty, clear };
}
