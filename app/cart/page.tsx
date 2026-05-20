import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="font-label text-label text-text-muted tracking-widest uppercase">
        Cart — coming in Phase 2
      </p>
    </div>
  );
}
