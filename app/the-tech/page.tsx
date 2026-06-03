import type { Metadata } from "next";
import TechHero from "@/components/the-tech/TechHero";
import InhaleVideo from "@/components/the-tech/InhaleVideo";
import BreathResponse from "@/components/the-tech/BreathResponse";
import PowerSection from "@/components/the-tech/PowerSection";
import VoltageSection from "@/components/the-tech/VoltageSection";
import UniversalFit from "@/components/the-tech/UniversalFit";
import TechCta from "@/components/the-tech/TechCta";

export const metadata: Metadata = {
  title: "The Tech — Engineering Deep Dive | Litsaber",
  description:
    "41 individually-addressable LEDs. 800mAh cobalt cell. Auto-inhalation sensor. Built to be seen.",
};

export default function TheTechPage() {
  return (
    <main className="bg-background-primary pt-navbar">
      <TechHero />
      <InhaleVideo />
      <BreathResponse />
      <PowerSection />
      <VoltageSection />
      <UniversalFit />
      <TechCta />
    </main>
  );
}
