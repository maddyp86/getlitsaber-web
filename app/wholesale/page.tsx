import type { Metadata } from "next";
import WholesaleHero from "@/components/wholesale/WholesaleHero";
import WholesaleStatsBar from "@/components/wholesale/WholesaleStatsBar";
import SellsItself from "@/components/wholesale/SellsItself";
import SellThrough from "@/components/wholesale/SellThrough";
import DemandSection from "@/components/wholesale/DemandSection";
import MarginsSection from "@/components/wholesale/MarginsSection";
import RetailKit from "@/components/wholesale/RetailKit";
import WholesaleFaq from "@/components/wholesale/WholesaleFaq";
import WholesaleCta from "@/components/wholesale/WholesaleCta";

export const metadata: Metadata = {
  title: "Wholesale — Litsaber | Stock the 510 Battery Customers Ask For",
  description:
    "Litsaber wholesale program. Flat $20/unit pricing, MOQ 5 units. $49.99 MSRP. Apply for the full pricing sheet and get a response within 24 hours.",
  openGraph: {
    title: "Wholesale — Litsaber",
    description:
      "Flat $20/unit. $49.99 MSRP. MOQ 5 units. Apply for the full sheet.",
    url: "https://getlitsaber.com/wholesale",
  },
};

export default function WholesalePage() {
  return (
    <main>
      <WholesaleHero />
      <WholesaleStatsBar />
      <SellsItself />
      <SellThrough />
      <DemandSection />
      <MarginsSection />
      <RetailKit />
      <WholesaleFaq />
      <WholesaleCta />
    </main>
  );
}
