import type { Metadata } from "next";
import WaitlistForm from "@/components/forms/WaitlistForm";
import ModalTestTriggers from "@/components/dev/ModalTestTriggers";
import Hero from "@/components/home/Hero";
import StatBar from "@/components/home/StatBar";
import BeSeen from "@/components/home/BeSeen/BeSeen";
import ThreeModes from "@/components/home/ThreeModes/ThreeModes";
import UnderTheHood from "@/components/home/UnderTheHood/UnderTheHood";
import LightMeetsVapor from "@/components/home/LightMeetsVapor/LightMeetsVapor";
import WhereItLives from "@/components/home/WhereItLives/WhereItLives";
import CommonQuestions from "@/components/home/CommonQuestions/CommonQuestions";
import WhatWereShipping from "@/components/home/WhatWereShipping/WhatWereShipping";
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
      <WhatWereShipping>
        <EditionsSection />
        <ProductDisplay />
      </WhatWereShipping>

      {/* TEMP: Phase 3c-1 isolation test — remove after HubSpot submission verified */}
      <section className="px-[13px] lg:px-[70px] py-16 max-w-md mx-auto">
        <WaitlistForm
          list="gold"
          source="isolation-test"
          headline="Gold Waitlist Test"
          copy="Temp test mount — remove after verification."
          buttonLabel="JOIN WAITLIST"
        />
      </section>

      {/* TEMP: Phase 3c-2 modal test triggers — remove before Phase 3d commit */}
      <ModalTestTriggers />
    </>
  );
}
