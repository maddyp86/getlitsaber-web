// Fails if a retired storefront promise (old dispatch window, "Free 14-day
// returns", 12 colors, old tier prices...) reappears anywhere in the D2C
// storefront source. The rendered-page counterpart is scripts/check-promises.ts.
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { findRetiredClaims, RETIRED_CLAIMS } from "@/lib/copy/retiredClaims";

const ROOT = join(__dirname, "..");

// Wholesale, affiliate and API code are not D2C storefront copy.
const EXCLUDED = [/^components\/wholesale\//, /^app\/wholesale\//, /^components\/affiliates\//, /^app\/affiliates\//, /^app\/api\//];

function sourceFiles(dir: string): string[] {
  return readdirSync(join(ROOT, dir)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    if (statSync(join(ROOT, rel)).isDirectory()) return sourceFiles(rel);
    if (!/\.tsx?$/.test(name) || /\.test\.tsx?$/.test(name)) return [];
    if (rel === "lib/copy/retiredClaims.ts") return [];
    return EXCLUDED.some((re) => re.test(rel)) ? [] : [rel];
  });
}

const FILES = ["app", "components", "lib"].flatMap(sourceFiles);

describe("retired storefront promises", () => {
  it("scans the product page, cart and policy sources", () => {
    for (const required of [
      "components/product/accordion.content.ts",
      "components/product/productdisplay.content.ts",
      "components/cart/TrustBadges.tsx",
      "components/layout/CartDrawer.tsx",
      "components/cart/CartPageBody.tsx",
      "components/policies/shipping-returns.ts",
      "components/policies/warranty.ts",
    ]) {
      expect(FILES).toContain(required);
    }
  });

  it.each(FILES)("%s has no retired claims", (file) => {
    expect(findRetiredClaims(readFileSync(join(ROOT, file), "utf8"))).toEqual([]);
  });

  it("each pattern catches the string it retires", () => {
    const samples: Record<string, string> = {
      "Free 14-day returns": "Authorize.net · Free 14-day returns",
      "free shipping on all US orders": "Free USPS shipping on all US orders.",
      "12 colors": "12 color options including white",
      "$45.99": "$45.99",
      "$44.99": "$44.99",
      "$89.99": "$89.99",
      "24-hour dispatch": "Ships in 24hrs",
      "same-day fulfillment": "and same-day fulfillment.",
      "up to 5 business days": "Allow up to 5 business days during launches",
      "5 to 7 business days": "Arrives in 5 to 7 business days.",
      "ships within 1 to 2 business days": "Orders ship within 1 to 2 business days.",
      "If it's 510, it works": "If it's 510, it works.",
      "repair or replace": "we'll repair or replace it",
      "dated Gold launch": "Gold Edition launches this summer 2026",
    };
    for (const [label] of RETIRED_CLAIMS) {
      expect(findRetiredClaims(samples[label]), label).toContain(label);
    }
  });

  it("the current wording passes", () => {
    for (const ok of [
      "Orders ship within 2 business days.",
      "14-day returns on unopened devices.",
      "10 color options including white and rainbow",
      "We resolve most issues within 1 to 2 business days.",
      "replacement, repair, or store credit",
    ]) {
      expect(findRetiredClaims(ok), ok).toEqual([]);
    }
  });
});
