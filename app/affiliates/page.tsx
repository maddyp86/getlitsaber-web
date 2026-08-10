import type { Metadata } from "next";
import AffiliatesAtmosphere from "@/components/affiliates/AffiliatesAtmosphere";
import AffiliatesHero from "@/components/affiliates/AffiliatesHero";
import AffiliateEarnings from "@/components/affiliates/AffiliateEarnings";
import ConversationStarter from "@/components/affiliates/ConversationStarter";
import SampleKit from "@/components/affiliates/SampleKit";
import WhoItsFor from "@/components/affiliates/WhoItsFor";
import ProgramTerms from "@/components/affiliates/ProgramTerms";
import AffiliatesFaq from "@/components/affiliates/AffiliatesFaq";
import AffiliatesCta from "@/components/affiliates/AffiliatesCta";

export const metadata: Metadata = {
  title: "Affiliate Program — Litsaber | Earn 20% On Every Sale",
  description:
    "Earn 20% commission on every Litsaber sale you send. 30-day tracking, monthly PayPal payouts, no follower minimum. Get your link in two minutes.",
  alternates: { canonical: "/affiliates" },
  openGraph: {
    title: "Affiliate Program — Litsaber",
    description:
      "20% per sale. 30-day tracking. Paid monthly. No follower minimum. Get your link in two minutes.",
    url: "https://getlitsaber.com/affiliates",
  },
};

export default function AffiliatesPage() {
  return (
    <main className="bg-background-primary">
      {/* Atmospheric top half: hero through terms share one glow field */}
      <div className="relative isolate overflow-hidden">
        <AffiliatesAtmosphere />
        <AffiliatesHero />
        <AffiliateEarnings />
        <ConversationStarter />
        <SampleKit />
        <WhoItsFor />
        <ProgramTerms />
      </div>

      <AffiliatesFaq />
      <AffiliatesCta />
    </main>
  );
}
