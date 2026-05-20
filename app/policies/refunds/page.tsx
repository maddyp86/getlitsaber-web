import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Returns Policy",
};

export default function RefundsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="font-label text-label text-text-muted tracking-widest uppercase">
        Refund and Returns Policy — coming in Phase 2
      </p>
    </div>
  );
}
