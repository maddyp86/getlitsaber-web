"use client";

// Surcharge-arm upsell: nudges a single-unit shopper to a two-pack, which is
// free shipping in both arms. Renders only for the 'surcharge' arm at units < 2;
// returns null cleanly otherwise (control, two-or-more, or flag still loading) so
// there is no stray gap. Tapping bumps the quantity to 2 via onAddOne.

import { useShippingVariant } from "@/lib/experiments/useShippingVariant";

interface ShippingUpsellNudgeProps {
  units: number;
  onAddOne: () => void;
  className?: string;
}

export default function ShippingUpsellNudge({
  units,
  onAddOne,
  className,
}: ShippingUpsellNudgeProps) {
  const variant = useShippingVariant();
  if (variant !== "surcharge" || units >= 2) return null;

  return (
    <button
      type="button"
      onClick={onAddOne}
      className={`w-full flex items-center justify-between gap-3 rounded-btn border border-accent-cyan px-4 py-3 text-left transition-colors hover:bg-[rgba(0,229,255,0.08)] ${
        className ?? ""
      }`}
      style={{ background: "rgba(0, 229, 255, 0.05)" }}
    >
      <span className="font-label text-[13px] text-accent-cyan leading-snug">
        Add one more · shipping&apos;s on us
      </span>
      <span className="font-label text-[13px] font-bold text-accent-cyan flex-shrink-0">
        +1 →
      </span>
    </button>
  );
}
