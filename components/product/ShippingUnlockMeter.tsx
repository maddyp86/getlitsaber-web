"use client";

// Surcharge-arm progress meter: shows a single-unit cart how close it is to the
// free-shipping threshold (2 units). Renders only for the surcharge arm below 2
// units; returns null cleanly otherwise (control, 2 or more, or flag still loading).

import { useShippingVariant } from "@/lib/experiments/useShippingVariant";

interface ShippingUnlockMeterProps {
  itemCount: number;
  className?: string;
}

export default function ShippingUnlockMeter({ itemCount, className }: ShippingUnlockMeterProps) {
  const variant = useShippingVariant();
  if (variant !== "surcharge" || itemCount >= 2) return null;

  // Single-unit surcharge cart resolves to 50%.
  const pct = Math.max(0, Math.min(100, (itemCount / 2) * 100));

  return (
    <div className={className}>
      <div style={{ height: "6px", borderRadius: "4px", background: "#14142c", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#00E5FF", borderRadius: "4px" }} />
      </div>
      <p
        className="font-label"
        style={{ marginTop: "8px", fontSize: "11px", letterSpacing: "1px", color: "#9a9ab5" }}
      >
        ADD 1 TO UNLOCK FREE SHIPPING · <span style={{ color: "#00E5FF" }}>SAVE $5.99</span>
      </p>
    </div>
  );
}
