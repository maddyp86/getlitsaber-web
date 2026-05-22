import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Get in Touch",
};

export default function ContactPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] pt-navbar">
      <p className="font-label text-label text-text-muted tracking-widest uppercase">
        Contact — coming in Phase 2
      </p>
    </div>
  );
}
