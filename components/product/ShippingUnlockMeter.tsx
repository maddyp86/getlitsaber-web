"use client";

// Surcharge-arm free-shipping progress meter. Renders only for the surcharge
// arm below 2 units; returns null otherwise (control, 2 or more, or flag loading).
// The whole meter (track + label) is a button: tapping calls the caller-supplied
// onUnlock, which bumps the cart to the free-shipping two-pack via the existing
// cart updateQty path. After that mutation itemCount reaches 2 and this hides
// itself through the itemCount < 2 condition below.

import { useShippingVariant } from "@/lib/experiments/useShippingVariant";

interface ShippingUnlockMeterProps {
  itemCount: number;
  onUnlock: () => void;
  className?: string;
}

export default function ShippingUnlockMeter({ itemCount, onUnlock, className }: ShippingUnlockMeterProps) {
  const variant = useShippingVariant();
  if (variant !== "surcharge" || itemCount >= 2) return null;

  // Single-unit surcharge cart resolves to 50%.
  const pct = Math.max(0, Math.min(100, (itemCount / 2) * 100));

  return (
    <button
      type="button"
      onClick={onUnlock}
      aria-label="Add one more to unlock free shipping"
      className={`group block w-full text-left cursor-pointer ${className ?? ""}`}
      style={{ borderTop: "1px solid #1a1a30", paddingTop: "12px", paddingBottom: "2px" }}
    >
      <div
        className="rounded transition-shadow group-hover:shadow-[0_0_0_1px_rgba(0,229,255,0.5)]"
        style={{ height: "6px", borderRadius: "4px", background: "#14142c", overflow: "hidden" }}
      >
        <div
          className="transition-[filter] group-hover:brightness-125"
          style={{ height: "100%", width: `${pct}%`, background: "#00E5FF", borderRadius: "4px" }}
        />
      </div>
      <p
        className="font-label"
        style={{ marginTop: "8px", fontSize: "11px", letterSpacing: "1px", color: "#9a9ab5" }}
      >
        ADD 1 MORE TO UNLOCK FREE SHIPPING · <span style={{ color: "#00E5FF" }}>SAVE $5.99</span>
      </p>
    </button>
  );
}
