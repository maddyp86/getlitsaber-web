/*
 * UI visibility store — ephemeral state only, no persistence.
 * Components must NEVER import useUIStore directly.
 * Use the derived hooks exported below.
 */

"use client";

import { create } from "zustand";

type UIStore = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const useUIStore = create<UIStore>()((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));

export function useIsCartOpen(): boolean {
  return useUIStore((s) => s.isCartOpen);
}

export function useCartUIActions(): { openCart: () => void; closeCart: () => void } {
  const openCart = useUIStore((s) => s.openCart);
  const closeCart = useUIStore((s) => s.closeCart);
  return { openCart, closeCart };
}
