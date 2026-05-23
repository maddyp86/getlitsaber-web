import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatBar from "@/components/home/StatBar";
import BeSeen from "@/components/home/BeSeen/BeSeen";
import ThreeModes from "@/components/home/ThreeModes/ThreeModes";
import UnderTheHood from "@/components/home/UnderTheHood/UnderTheHood";
import LightMeetsVapor from "@/components/home/LightMeetsVapor/LightMeetsVapor";
import WhereItLives from "@/components/home/WhereItLives/WhereItLives";
import CommonQuestions from "@/components/home/CommonQuestions/CommonQuestions";
import Section6 from "@/components/home/Section6/Section6";
import EditionsSection from "@/components/home/Editions/EditionsSection";
import ProductDisplay from "@/components/home/ProductDisplay/ProductDisplay";

export const metadata: Metadata = {
  title: "Litsaber — The Interactive 510 Battery",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatBar />
      <BeSeen />
      <ThreeModes />
      <UnderTheHood />
      <LightMeetsVapor />
      <WhereItLives />
      <CommonQuestions />
      <Section6>
        <EditionsSection />
        <ProductDisplay />
      </Section6>
    </>
  );
}
