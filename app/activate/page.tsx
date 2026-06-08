import type { Metadata } from "next";
import ActivateHero from "@/components/activate/ActivateHero";
import ActivateSubNav from "@/components/activate/ActivateSubNav";
import ActivateQuickStart from "@/components/activate/ActivateQuickStart";
import ActivateFunctions from "@/components/activate/ActivateFunctions";
import ActivateModes from "@/components/activate/ActivateModes";
import ActivatePreheat from "@/components/activate/ActivatePreheat";
import ActivateVoltage from "@/components/activate/ActivateVoltage";
import ActivateBattery from "@/components/activate/ActivateBattery";
import ActivateCharging from "@/components/activate/ActivateCharging";
import ActivateCartTips from "@/components/activate/ActivateCartTips";
import ActivateSafety from "@/components/activate/ActivateSafety";
import ActivateCta from "@/components/activate/ActivateCta";

export const metadata: Metadata = {
  title: "Activate Your Litsaber | Litsaber",
  description:
    "Step-by-step setup guide for your Litsaber. Quick start, modes, pre-heat, voltage, charging, and cart tips. Most people are up and running in under a minute.",
};

export default function ActivatePage() {
  return (
    // No overflow-x-hidden — it would kill the sticky sub-nav.
    <main className="bg-background-primary pt-navbar">
      <ActivateHero />
      <ActivateSubNav />
      <ActivateQuickStart />
      <ActivateFunctions />
      <ActivateModes />
      <ActivatePreheat />
      <ActivateVoltage />
      <ActivateBattery />
      <ActivateCharging />
      <ActivateCartTips />
      <ActivateSafety />
      <ActivateCta />
    </main>
  );
}
