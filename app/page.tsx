import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatBar from "@/components/home/StatBar";
import BeSeen from "@/components/home/BeSeen/BeSeen";
import ThreeModes from "@/components/home/ThreeModes/ThreeModes";
import PartyVideo from "@/components/home/PartyVideo/PartyVideo";
import UnderTheHood from "@/components/home/UnderTheHood/UnderTheHood";
import LightMeetsVapor from "@/components/home/LightMeetsVapor/LightMeetsVapor";
import WhereItLives from "@/components/home/WhereItLives/WhereItLives";
import CommonQuestions from "@/components/home/CommonQuestions/CommonQuestions";
import WhatWereShipping from "@/components/home/WhatWereShipping/WhatWereShipping";
import EditionsSection from "@/components/home/Editions/EditionsSection";
import ProductDisplay from "@/components/product/ProductDisplay";
import HomepageEngagementTracker from "@/components/home/HomepageEngagementTracker";
import WhatCustomersSay from "@/components/home/WhatCustomersSay/WhatCustomersSay";
import WholesaleCTABanner from "@/components/home/WholesaleCTABanner/WholesaleCTABanner";
import EmailSignupBanner from "@/components/global/EmailSignupBanner/EmailSignupBanner";
import { getProductByHandle } from "@/lib/shopify/queries";
import { BASE_UNIT_PRICE } from "@/lib/cart/pricing";
import DiagProvider from "@/components/diag/DiagContext";
import { parseDiag } from "@/lib/diag";
import LazyMount from "@/components/primitives/LazyMount";

export const metadata: Metadata = {
  title: "Litsaber — The Interactive 510 Battery",
};

const SILVER_SKU = "LTS-OG-SLV";
const shopifyConfigured = Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const diag = parseDiag(searchParams);
  const product = await getProductByHandle("litsaber-og");
  const silverVariant = product?.variants.edges
    .map((e) => e.node)
    .find((v) => v.sku === SILVER_SKU) ?? null;

  // If Shopify is not configured (local dev without env vars), default to
  // showing the buy buttons rather than "Currently unavailable".
  const available = shopifyConfigured ? silverVariant !== null : true;
  const basePrice = silverVariant?.price?.amount
    ? parseFloat(silverVariant.price.amount)
    : BASE_UNIT_PRICE;

  return (
    <DiagProvider value={diag}>
      <HomepageEngagementTracker />
      <Hero />
      <StatBar />
      {/* `?diag=lite` renders only the above-the-fold hero, to isolate whether
          the crash is cumulative below-the-fold weight vs. something global. */}
      {/* Below-the-fold sections are lazy-mounted: each renders only as it nears
          the viewport and unmounts once well past, so the full heavy DOM never
          exists at once. This keeps peak memory near the `?diag=lite` level and
          fixes the mobile OOM crash. `?diag=lite` still strips them entirely. */}
      {!diag.lite && (
        <>
          <LazyMount minHeight="300vh">
            <BeSeen />
          </LazyMount>
          <LazyMount minHeight="1800px">
            <ThreeModes />
          </LazyMount>
          <LazyMount minHeight="480px">
            <PartyVideo />
          </LazyMount>
          <LazyMount minHeight="900px">
            <UnderTheHood />
          </LazyMount>
          <LazyMount minHeight="600px">
            <LightMeetsVapor />
          </LazyMount>
          <LazyMount minHeight="600px">
            <WhereItLives />
          </LazyMount>
          <LazyMount minHeight="800px">
            <CommonQuestions />
          </LazyMount>
          <LazyMount minHeight="1200px">
            <WhatWereShipping>
              <EditionsSection />
              <ProductDisplay
                variantId={silverVariant?.id ?? ""}
                available={available}
                surface="homepage_buy"
                basePrice={basePrice}
              />
            </WhatWereShipping>
          </LazyMount>
          <LazyMount minHeight="800px">
            <WhatCustomersSay />
          </LazyMount>
          <LazyMount minHeight="400px">
            <EmailSignupBanner />
          </LazyMount>
          <LazyMount minHeight="400px">
            <WholesaleCTABanner />
          </LazyMount>
        </>
      )}
    </DiagProvider>
  );
}
