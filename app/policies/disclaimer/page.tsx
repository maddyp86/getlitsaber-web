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
  S03_PARA1,
  S03_PARA2,
  S03_PARA3,
  S04_PARA1,
  S05_PARA1,
  S05_PARA2,
  S06_PARA1,
  S06_BULLETS,
  S06_PARA2,
  S07_PARA1,
  S07_PARA2,
  S07_PARA3,
  S08_PARA1,
  IMPORTANT_NOTICE,
} from "@/components/policies/disclaimer";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Litsaber website and product disclaimer: information provided as is, adults 21 and over, disclosure of paid and affiliate content, MSRP pricing, lithium battery handling, and limitation of liability.",
};

const P = "font-body text-body-sm lg:text-body text-text-secondary leading-relaxed";

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-content px-content pb-16 lg:pb-24">
      <PolicyHeader index={5} title="DISCLAIMER" effectiveDate={POLICIES_EFFECTIVE_DATE} />

      <QuickSummary>
        <p className={P}>{renderPara(QUICK_SUMMARY)}</p>
      </QuickSummary>

      <div className="mt-10 lg:mt-14 flex flex-col gap-12 lg:gap-16">
        <PolicySection number="01" title="Information on this site">
          <p className={P}>{renderPara(S01_PARA1)}</p>
          <p className={P}>{renderPara(S01_PARA2)}</p>
        </PolicySection>

        <PolicySection number="02" title="Adults only">
          <p className={P}>{renderPara(S02_PARA1)}</p>
        </PolicySection>

        <PolicySection number="03" title="Disclosure of material connections">
          <p className={P}>{renderPara(S03_PARA1)}</p>
          <p className={P}>{renderPara(S03_PARA2)}</p>
          <p className={P}>{renderPara(S03_PARA3)}</p>
        </PolicySection>

        <PolicySection number="04" title="Reviews">
          <p className={P}>{renderPara(S04_PARA1)}</p>
        </PolicySection>

        <PolicySection number="05" title="Pricing and struck-through prices">
          <p className={P}>{renderPara(S05_PARA1)}</p>
          <p className={P}>{renderPara(S05_PARA2)}</p>
        </PolicySection>

        <PolicySection number="06" title="Lithium battery and safe handling">
          <p className={P}>{renderPara(S06_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S06_BULLETS.map((item) => (
              <li key={item} className={P}>
                {item}
              </li>
            ))}
          </ul>
          <p className={P}>{renderPara(S06_PARA2)}</p>
        </PolicySection>

        <PolicySection number="07" title="Limitation of liability">
          <p className={P}>{renderPara(S07_PARA1)}</p>
          <p className={P}>{renderPara(S07_PARA2)}</p>
          <p className={P}>{renderPara(S07_PARA3)}</p>
        </PolicySection>

        <PolicySection number="08" title="Questions">
          <p className={P}>{renderPara(S08_PARA1)}</p>
          <PolicyCallout variant="info">
            <p className={P}>{renderPara(IMPORTANT_NOTICE)}</p>
          </PolicyCallout>
        </PolicySection>
      </div>
    </div>
  );
}
