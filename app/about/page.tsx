import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Founder Story and Team",
};

export default function AboutPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] pt-navbar">
      <p className="font-label text-label text-text-muted tracking-widest uppercase">
        About — coming in Phase 2
      </p>
    </div>
  );
}
