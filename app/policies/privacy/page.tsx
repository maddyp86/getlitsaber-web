import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] pt-navbar">
      <p className="font-label text-label text-text-muted tracking-widest uppercase">
        Privacy Policy — coming in Phase 2
      </p>
    </div>
  );
}
