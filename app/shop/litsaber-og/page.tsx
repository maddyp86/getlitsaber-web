import type { Metadata } from "next";
import { getProductByHandle } from "@/lib/shopify/queries";
import ProductDisplay from "@/components/product/ProductDisplay/ProductDisplay";
import PdpViewTracker from "@/components/pdp/PdpViewTracker";
import JudgemeReviewWidget from "@/components/reviews/JudgemeReviewWidget";
import WriteReviewButton from "@/components/reviews/WriteReviewButton";

export const metadata: Metadata = {
  title: "Litsaber OG — The Interactive 510 Battery",
};

const SILVER_SKU = "LTS-OG-SLV";
const shopifyConfigured = Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);

export default async function PDPPage() {
  const product = await getProductByHandle("litsaber-og");
  const silverVariant = product?.variants.edges
    .map((e) => e.node)
    .find((v) => v.sku === SILVER_SKU) ?? null;

  const available = shopifyConfigured ? silverVariant?.availableForSale === true : true;
  const numericProductId = product?.id?.split("/").pop() ?? "";

  return (
<div className="pt-navbar lg:px-[50px] py-xl">
      <PdpViewTracker />
      <div className="mx-auto w-full max-w-[1250px] pb-xl">
        <ProductDisplay
          variantId={silverVariant?.id ?? ""}
          available={available}
          surface="pdp"
        />
      </div>
      <hr className="w-full border-t border-border-divider" />
      <section className="mx-auto w-full max-w-[1250px] mt-24 px-5 lg:px-0">
        <h2 className="font-display text-h3 lg:text-h1 text-text-primary text-center mb-10"
          style={{
              fontSize: "clamp(45px, 3.2vw, 75px)",
              fontStyle: "normal",
              fontWeight:"700"
            }}>
          Customer Reviews
        </h2>
        <div className="flex justify-end mb-6">
          <WriteReviewButton />
        </div>
        <JudgemeReviewWidget productId={numericProductId} productTitle="Litsaber OG" />
      </section>
    </div>
  );
}
