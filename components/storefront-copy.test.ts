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
  // Sector vocabulary removed 2026-11-15 for ad-platform review (Meta, TikTok).
  // Compliance disclaimers may still say "cannabis"; marketing copy does not
  // name concentrates, dispensaries, vapor or smoke.
  ["dispensary", /\bdispensar(y|ies)\b/i],
  ["THC", /\bTHC\b/],
  ["concentrate names", /\b(rosin|live resin|cured resin|distillate|liquid diamonds|terpenes?)\b/i],
  ["vape as a noun or verb", /\bvape[sd]?\b(?! ?-?related)/i],
  // "smoke shops" is a retail channel and icons/cloud.png is a file, not copy.
  ["vapor or clouds", /\b(vapor|vapour|clouds?(?!\.png)|smoke(?! ?shops?))\b/i],
];

const read = (file: string) => readFileSync(join(ROOT, file), "utf8");

// Asset paths are file names, not copy: a Blob file may be called
// "litsaber-holiday-deal.jpg" without the storefront ever saying "deal". Drop
// the argument of mediaUrl()/videoUrl() before scanning for banned words.
const copyOnly = (text: string) =>
  text.replace(/\b(?:mediaUrl|videoUrl)\(\s*(["'`])[^"'`]*\1\s*\)/g, "");

describe("storefront copy", () => {
  it.each(STOREFRONT_FILES)("%s has no banned words or retired offers", (file) => {
    const text = copyOnly(read(file));
    const hits = BANNED.filter(([, re]) => re.test(text)).map(([name]) => name);
    expect(hits).toEqual([]);
  });

  it("the offer copy never uses sale, was or save language", () => {
    for (const file of ["components/product/productdisplay.content.ts", "components/home/hero.content.ts"]) {
      expect(read(file)).not.toMatch(/\b(sale|was|save)\b/i);
    }
  });

  // The Holiday Sale 2026 config (ADR-012) is the one place "sale" is allowed.
  // Every other copy rule still applies to it, and it never says Black Friday
  // or Cyber Monday (owner decision 2026-11-21).
  it("the holiday campaign copy keeps every other copy rule", () => {
    const text = read("lib/campaign/holiday2026.ts");
    const hits = BANNED.filter(([, re]) => re.test(copyOnly(text))).map(([name]) => name);
    expect(hits).toEqual([]);
    expect(text).not.toMatch(/black friday|cyber monday|bfcm/i);
    expect(text).not.toMatch(/!["`']/);
  });

  it("asset paths are exempt from the word bans, copy beside them is not", () => {
    const sample = 'src: mediaUrl("product/litsaber-holiday-deal.jpg"), alt: "A great deal"';
    expect(copyOnly(sample)).not.toMatch(/litsaber-holiday-deal/);
    expect(copyOnly(sample)).toMatch(/A great deal/);
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
