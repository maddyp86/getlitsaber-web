import type { Metadata } from "next";
import "./globals.css";
import { stellar, monoton, orbitron, inter, spaceMono } from "@/lib/fonts";
import AgeGateModal from "@/components/layout/AgeGateModal";
import CartDrawer from "@/components/layout/CartDrawer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoldWaitlistModal from "@/components/modals/GoldWaitlistModal";
import FutureDropsModal from "@/components/modals/FutureDropsModal";
import FloatingPromoPopup from "@/components/layout/FloatingPromoPopup";
import CartHydrator from "@/components/layout/CartHydrator";

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

        {/* Cart drawer sits at z-drawer (100), available on every page */}
        <CartDrawer />

        {/* Waitlist modals sit at z-modal (200), available on every page */}
        <GoldWaitlistModal />
        <FutureDropsModal />

        {/* Promo popup sits at z-modal (200) — gated by age confirm + conditions */}
        <FloatingPromoPopup />

        {/* Hydrates cart from Shopify on mount using persisted cartId */}
        <CartHydrator />
      </body>
    </html>
  );
}
