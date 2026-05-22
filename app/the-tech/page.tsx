import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Tech — Engineering Deep Dive",
};

export default function TheTechPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] pt-navbar">
      <p className="font-label text-label text-text-muted tracking-widest uppercase">
        The Tech — coming in Phase 2
      </p>
    </div>
  );
}
