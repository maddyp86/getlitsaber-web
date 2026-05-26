/*
 * UI visibility store — ephemeral state only, no persistence.
 * Components must NEVER import useUIStore directly.
 * Use the derived hooks exported below.
 */

"use client";

import { create } from "zustand";

export type ModalName = "gold" | "general";

type UIStore = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  activeModal: ModalName | null;
  openModal: (name: ModalName) => void;
  closeModal: () => void;

  isAgeGateVisible: boolean;
  setAgeGateVisible: (v: boolean) => void;
  dismissAgeGate: () => void;
};

const useUIStore = create<UIStore>()((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  activeModal: null,
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),

  isAgeGateVisible: false,
  setAgeGateVisible: (v) => set({ isAgeGateVisible: v }),
  dismissAgeGate: () => set({ isAgeGateVisible: false }),
}));

export function useIsCartOpen(): boolean {
  return useUIStore((s) => s.isCartOpen);
}

export function useCartUIActions(): { openCart: () => void; closeCart: () => void } {
  const openCart = useUIStore((s) => s.openCart);
  const closeCart = useUIStore((s) => s.closeCart);
  return { openCart, closeCart };
}

export function useActiveModal(): ModalName | null {
  return useUIStore((s) => s.activeModal);
}

export function useModalActions(): { openModal: (name: ModalName) => void; closeModal: () => void } {
  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);
  return { openModal, closeModal };
}

export function useIsAgeGateVisible(): boolean {
  return useUIStore((s) => s.isAgeGateVisible);
}

export function useAgeGateActions(): {
  setAgeGateVisible: (v: boolean) => void;
  dismissAgeGate: () => void;
} {
  const setAgeGateVisible = useUIStore((s) => s.setAgeGateVisible);
  const dismissAgeGate = useUIStore((s) => s.dismissAgeGate);
  return { setAgeGateVisible, dismissAgeGate };
}
