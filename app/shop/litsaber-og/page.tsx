import type { Metadata } from "next";
import { getProductByHandle } from "@/lib/shopify/queries";
import { BASE_UNIT_PRICE, MSRP_UNIT_PRICE, getDisplayUnitPrice } from "@/lib/cart/pricing";
import ProductDisplay from "@/components/product/ProductDisplay";
import ComparisonTable from "@/components/product/ComparisonTable";
import JudgemeReviewWidget from "@/components/reviews/JudgemeReviewWidget";
{/*import WriteReviewButton from "@/components/reviews/WriteReviewButton";*/}

const PDP_DESCRIPTION =
  "Litsaber OG, the interactive 510 battery. 41 addressable LEDs, 10 selectable colors, 3 interactive modes, 800 mAh battery, aluminum and steel build, 6-month warranty. $39.99, MSRP $49.99. Free shipping on 2+.";

export const metadata: Metadata = {
  title: "Litsaber OG — The Interactive 510 Battery",
  description: PDP_DESCRIPTION,
  openGraph: {
    title: "Litsaber OG — The Interactive 510 Battery",
    description: PDP_DESCRIPTION,
    url: "/shop/litsaber-og",
  },
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
  const basePrice = silverVariant?.price?.amount
    ? parseFloat(silverVariant.price.amount)
    : BASE_UNIT_PRICE;

  // Product structured data. Price is the floor-guarded live Shopify price, so
  // search results can never advertise less than $39.99.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Litsaber OG",
    description: PDP_DESCRIPTION,
    sku: SILVER_SKU,
    brand: { "@type": "Brand", name: "Litsaber" },
    offers: {
      "@type": "Offer",
      url: "https://getlitsaber.com/shop/litsaber-og",
      priceCurrency: "USD",
      price: getDisplayUnitPrice(basePrice).toFixed(2),
      availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/ListPrice",
        price: MSRP_UNIT_PRICE.toFixed(2),
        priceCurrency: "USD",
      },
    },
  };

  return (
    <div className="pt-navbar py-xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto w-full justify-center max-w-content pt-xl px-content pb-xl">
        <ProductDisplay
          variantId={silverVariant?.id ?? ""}
          available={available}
          surface="pdp"
          basePrice={basePrice}
        />
      </div>

      {/* Divider aligned to content edge */}
      <div className="mx-auto w-full max-w-content px-content">
        <hr className="w-full border-t border-border-divider" />
      </div>

      <div className="mx-auto w-full max-w-content px-content mt-24">
        <ComparisonTable />
      </div>

      <section className="mx-auto w-full max-w-content px-content mt-24">
        <h2
          className="font-display text-h3 lg:text-h1 text-text-primary text-center"
          style={{
            fontSize: "clamp(45px, 3.2vw, 75px)",
            fontStyle: "normal",
            fontWeight: "700",
          }}
        >
          Customer Reviews
        </h2>
        <div className="flex justify-center mb-6">
          {/* <WriteReviewButton /> */}
        </div>
        <JudgemeReviewWidget productId={numericProductId} productTitle="Litsaber OG" />
      </section>
    </div>
  );
}
