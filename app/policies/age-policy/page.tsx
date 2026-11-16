import type { Metadata } from "next";
import PolicyHeader from "@/components/policies/PolicyHeader";
import QuickSummary from "@/components/policies/QuickSummary";
import PolicySection from "@/components/policies/PolicySection";
import PolicyCallout from "@/components/policies/PolicyCallout";
import { renderPara } from "@/lib/policies/renderPara";
import { POLICIES_EFFECTIVE_DATE } from "@/components/policies/shared";
import {
  QUICK_SUMMARY,
  S01_PARA1,
  S01_PARA2,
  S02_PARA1,
  S02_PARA2,
  S03_PARA1,
  S03_PARA2,
  S04_PARA1,
  S05_PARA1,
  IMPORTANT_NOTICE,
} from "@/components/policies/age-policy";

export const metadata: Metadata = {
  title: "Age Policy",
  description:
    "Litsaber is sold only to adults 18 and over, or older where local law requires. How age is certified at purchase and verified on request.",
};

const P = "font-body text-body-sm lg:text-body text-text-secondary leading-relaxed";

export default function AgePolicyPage() {
  return (
    <div className="mx-auto w-full max-w-content px-content pb-16 lg:pb-24">
      <PolicyHeader index={6} title="AGE POLICY" effectiveDate={POLICIES_EFFECTIVE_DATE} />

      <QuickSummary>
        <p className={P}>{renderPara(QUICK_SUMMARY)}</p>
      </QuickSummary>

      <div className="mt-10 lg:mt-14 flex flex-col gap-12 lg:gap-16">
        <PolicySection number="01" title="Who may buy">
          <p className={P}>{renderPara(S01_PARA1)}</p>
          <p className={P}>{renderPara(S01_PARA2)}</p>
        </PolicySection>

        <PolicySection number="02" title="How age is confirmed">
          <p className={P}>{renderPara(S02_PARA1)}</p>
          <p className={P}>{renderPara(S02_PARA2)}</p>
        </PolicySection>

        <PolicySection number="03" title="What the product is">
          <p className={P}>{renderPara(S03_PARA1)}</p>
          <p className={P}>{renderPara(S03_PARA2)}</p>
        </PolicySection>

        <PolicySection number="04" title="Wholesale and retail partners">
          <p className={P}>{renderPara(S04_PARA1)}</p>
        </PolicySection>

        <PolicySection number="05" title="Questions">
          <p className={P}>{renderPara(S05_PARA1)}</p>
          <PolicyCallout variant="info">
            <p className={P}>{renderPara(IMPORTANT_NOTICE)}</p>
          </PolicyCallout>
        </PolicySection>
      </div>
    </div>
  );
}
