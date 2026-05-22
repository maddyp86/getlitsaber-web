import type { Metadata } from "next";
import "./globals.css";
import { stellar, monoton, orbitron, inter, spaceMono } from "@/lib/fonts";
import AgeGateModal from "@/components/layout/AgeGateModal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Litsaber — The Interactive 510 Battery",
    template: "%s | Litsaber",
  },
  description:
    "A glowstick that hits 510 carts. Built for festivals, nightlife, and the moments worth being lit for.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://getlitsaber.com"
  ),
  openGraph: {
    siteName: "Litsaber",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[
        stellar.variable,
        monoton.variable,
        orbitron.variable,
        inter.variable,
        spaceMono.variable,
      ].join(" ")}
    >
      <body className="font-body bg-background-primary text-text-primary antialiased">
        {/* Age gate sits at z-age-gate (300) — above everything */}
        <AgeGateModal />

        {/* Navbar sits at z-navbar (50) */}
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
