import type { Metadata } from "next";
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
import { getProductByHandle } from "@/lib/shopify/queries";

export const metadata: Metadata = {
  title: "Litsaber — The Interactive 510 Battery",
};

const SILVER_SKU = "LTS-OG-SLV";

export default async function HomePage() {
  const product = await getProductByHandle("litsaber-og");
  const silverVariant = product?.variants.edges
    .map((e) => e.node)
    .find((v) => v.sku === SILVER_SKU) ?? null;

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
        <ProductDisplay
          variantId={silverVariant?.id ?? ""}
          available={silverVariant !== null}
        />
      </WhatWereShipping>
    </>
  );
}
