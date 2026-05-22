import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
};

export default function ShippingPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] pt-navbar">
      <p className="font-label text-label text-text-muted tracking-widest uppercase">
        Shipping Policy — coming in Phase 2
      </p>
    </div>
  );
}
