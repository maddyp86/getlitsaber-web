import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutOrigin from "@/components/about/AboutOrigin";
import AboutTeam from "@/components/about/AboutTeam";
import AboutJourney from "@/components/about/AboutJourney";
import JourneyVideoBand from "@/components/about/JourneyVideoBand";
import AboutManufacturing from "@/components/about/AboutManufacturing";
import ManufacturingImageBand from "@/components/about/ManufacturingImageBand";
import AboutNow from "@/components/about/AboutNow";
import AboutClosingCta from "@/components/about/AboutClosingCta";

export const metadata: Metadata = {
  title: "Our Story | Litsaber",
  description:
    "Two cousins, five years, six prototypes. The origin story of the Litsaber — a 510 battery built to stand out at festivals, shows, and sessions.",
};

export default function AboutPage() {
  return (
    <main className="bg-background-primary pt-navbar">
      <AboutHero />
      <AboutOrigin />
      <AboutTeam />
      <AboutJourney />
      <JourneyVideoBand />
      <AboutManufacturing />
      <ManufacturingImageBand />
      <AboutNow />
      <AboutClosingCta />
    </main>
  );
}
