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
import HomepageEngagementTracker from "@/components/home/HomepageEngagementTracker";
import WhatCustomersSay from "@/components/home/WhatCustomersSay/WhatCustomersSay";
import WholesaleCTABanner from "@/components/home/WholesaleCTABanner/WholesaleCTABanner";
import EmailSignupBanner from "@/components/global/EmailSignupBanner/EmailSignupBanner";
import { getProductByHandle } from "@/lib/shopify/queries";

export const metadata: Metadata = {
  title: "Litsaber — The Interactive 510 Battery",
};

const SILVER_SKU = "LTS-OG-SLV";
const shopifyConfigured = Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);

export default async function HomePage() {
  const product = await getProductByHandle("litsaber-og");
  const silverVariant = product?.variants.edges
    .map((e) => e.node)
    .find((v) => v.sku === SILVER_SKU) ?? null;

  // If Shopify is not configured (local dev without env vars), default to
  // showing the buy buttons rather than "Currently unavailable".
  const available = shopifyConfigured ? silverVariant !== null : true;

  return (
    <>
      <HomepageEngagementTracker />
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
          available={available}
          surface="homepage_buy"
        />
      </WhatWereShipping>
      <WhatCustomersSay />
      <EmailSignupBanner />
      <WholesaleCTABanner />
    </>
  );
}
