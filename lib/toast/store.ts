/*
 * Toast store — ephemeral, no persistence.
 * Components must NEVER import useToastStore directly.
 * Use the derived hooks exported at the bottom of this file.
 */

"use client";

import { create } from "zustand";

export type ToastVariant = "success" | "error";

export type Toast = {
  id: string;
  variant: ToastVariant;
  message: string;
};

type ToastStore = {
  toasts: Toast[];
  addToast: (payload: { variant: ToastVariant; message: string }) => void;
  dismissToast: (id: string) => void;
};

const AUTO_DISMISS_MS = 5000;

const useToastStore = create<ToastStore>()((set, get) => ({
  toasts: [],

  addToast({ variant, message }) {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, variant, message }] }));
    setTimeout(() => get().dismissToast(id), AUTO_DISMISS_MS);
  },

  dismissToast(id) {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export function useToasts(): Toast[] {
  return useToastStore((s) => s.toasts);
}

export function useToastActions(): {
  addToast: ToastStore["addToast"];
  dismissToast: ToastStore["dismissToast"];
} {
  const addToast = useToastStore((s) => s.addToast);
  const dismissToast = useToastStore((s) => s.dismissToast);
  return { addToast, dismissToast };
}
