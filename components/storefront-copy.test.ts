// Regression guard for the D2C storefront copy rules (ADR-009). Scans the
// customer-facing content files the storefront renders. Wholesale, affiliate
// and legal policy copy are deliberately out of scope.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");

const STOREFRONT_FILES = [
  "components/home/hero.content.ts",
  "components/home/StatBar.tsx",
  "components/home/CommonQuestions/commonquestions.content.ts",
  "components/home/UnderTheHood/underthehood.content.ts",
  "components/home/BeSeen/crowd.content.ts",
  "components/product/productdisplay.content.ts",
  "components/product/specs.content.ts",
  "components/product/accordion.content.ts",
  "components/product/ShippingUnlockMeter.tsx",
  "components/the-tech/the-tech.content.ts",
  "components/about/about.content.ts",
  "components/activate/activate.content.ts",
  "components/contact/contact.content.ts",
  "components/global/EmailSignupBanner/EmailSignupBanner.tsx",
  "app/shop/litsaber-og/page.tsx",
];

const BANNED: Array<[string, RegExp]> = [
  ["premium", /\bpremium\b/i],
  ["deal", /\bdeals?\b/i],
  ["affordable", /\baffordable\b/i],
  ["cheap", /\bcheap\b/i],
  ["pen", /\b(vape )?pens?\b/i],
  ["cart battery", /\bcart(ridge)? battery\b/i],
  ["fire emoji", /\uD83D\uDD25/],
  ["lightsaber", /\blight ?sabers?\b/i],
  ["NeoPixel", /\bneo ?pixels?\b/i],
  ["saber effect", /\bsaber effect\b/i],
  ["jedi", /\bjedi\b/i],
  ["sci-fi weapon", /sci-fi weapon/i],
  ["$5 off", /\$5 off/i],
  ["30-day guarantee", /30-day guarantee/i],
];

const read = (file: string) => readFileSync(join(ROOT, file), "utf8");

describe("storefront copy", () => {
  it.each(STOREFRONT_FILES)("%s has no banned words or retired offers", (file) => {
    const text = read(file);
    const hits = BANNED.filter(([, re]) => re.test(text)).map(([name]) => name);
    expect(hits).toEqual([]);
  });

  it("the offer copy never uses sale, was or save language", () => {
    for (const file of ["components/product/productdisplay.content.ts", "components/home/hero.content.ts"]) {
      expect(read(file)).not.toMatch(/\b(sale|was|save)\b/i);
    }
  });

  it("no storefront copy advertises a unit price below $39.99", () => {
    for (const file of STOREFRONT_FILES) {
      for (const literal of read(file).match(/\$\d+\.\d{2}\b/g) ?? []) {
        const amount = parseFloat(literal.slice(1));
        // $5.99 is the shipping rate, not a product price.
        if (amount === 5.99) continue;
        expect(amount, `${file}: ${literal}`).toBeGreaterThanOrEqual(39.99);
      }
    }
  });
});
