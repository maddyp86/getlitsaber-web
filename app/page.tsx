import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Litsaber — The Interactive 510 Battery",
};

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="font-label text-label text-text-muted tracking-widest uppercase">
        Homepage — coming in Phase 2
      </p>
    </div>
  );
}
