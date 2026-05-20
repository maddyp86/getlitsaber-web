import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warranty Policy",
};

export default function WarrantyPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="font-label text-label text-text-muted tracking-widest uppercase">
        Warranty Policy — coming in Phase 2
      </p>
    </div>
  );
}
