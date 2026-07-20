import type { Metadata } from "next";
import RebateHero from "@/components/rebate/RebateHero";
import HowItWorks from "@/components/rebate/HowItWorks";
import RebateFaq from "@/components/rebate/RebateFaq";
import RebatePageTracker from "@/components/rebate/RebatePageTracker";

export const metadata: Metadata = {
  title: "Show It Off, Get $5 Off — Litsaber Rebate",
  description:
    "Post your Litsaber lit up on TikTok or Instagram, submit the form with your order number, and we'll send $5 back to you within 3 to 5 business days.",
  openGraph: {
    title: "Show It Off, Get $5 Off — Litsaber Rebate",
    description:
      "Catch your Litsaber lit up on camera, post it, and claim a $5 rebate.",
    url: "https://getlitsaber.com/show-it-off",
  },
};

export default function ShowItOffPage() {
  return (
    <main>
      <RebatePageTracker />
      <RebateHero />
      <HowItWorks />
      <RebateFaq />
    </main>
  );
}
