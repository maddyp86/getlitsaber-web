import type { Metadata } from "next";
import PolicyHeader from "@/components/policies/PolicyHeader";
import QuickSummary from "@/components/policies/QuickSummary";
import PolicySection from "@/components/policies/PolicySection";
import PolicyCallout from "@/components/policies/PolicyCallout";
import AddressBlock from "@/components/policies/AddressBlock";
import { renderPara } from "@/lib/policies/renderPara";
import { POLICIES_EFFECTIVE_DATE } from "@/components/policies/shared";
import {
  QUICK_SUMMARY,
  S01_PARA1,
  S01_PARA2,
  S01_BULLETS,
  S01_CALLOUT,
  S02_PARA1,
  S02_PARA2,
  S02_BULLETS,
  S02_PARA3,
  S02_CALLOUT,
  S03_PARA1,
  S03_BULLETS,
  S03_PARA2,
  S03_PARA3,
  S04_PARA1,
  S04_PARA2,
  S04_PARA3,
  S05_PARA1,
  WARRANTY_CONTACT_BLOCK,
} from "@/components/policies/warranty";

export const metadata: Metadata = {
  title: "Warranty Policy | Litsaber",
  description:
    "Litsaber 6-month limited warranty: what's covered, how to submit a claim, and warranty contact information.",
};

const P = "font-body text-body-sm lg:text-body text-text-secondary leading-relaxed";

export default function WarrantyPage() {
  return (
    <div className="mx-auto w-full max-w-content px-content pb-16 lg:pb-24">
      <PolicyHeader
        index={2}
        title="WARRANTY POLICY"
        effectiveDate={POLICIES_EFFECTIVE_DATE}
      />

      <QuickSummary>
        <p className={P}>{renderPara(QUICK_SUMMARY)}</p>
      </QuickSummary>

      <div className="mt-10 lg:mt-14 flex flex-col gap-12 lg:gap-16">

        {/* 01 — Six (6) Month Limited Warranty */}
        <PolicySection number="01" title="Six (6) Month Limited Warranty">
          <p className={P}>{renderPara(S01_PARA1)}</p>
          <p className={P}>{renderPara(S01_PARA2)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S01_BULLETS.map((item) => (
              <li key={item} className={P}>
                {item}
              </li>
            ))}
          </ul>
          <PolicyCallout variant="info">
            {renderPara(S01_CALLOUT)}
          </PolicyCallout>
        </PolicySection>

        {/* 02 — How to Submit a Warranty Claim */}
        <PolicySection number="02" title="How to Submit a Warranty Claim">
          <p className={P}>{renderPara(S02_PARA1)}</p>
          <p className={P}>{renderPara(S02_PARA2)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S02_BULLETS.map((item) => (
              <li key={item} className={P}>
                {item}
              </li>
            ))}
          </ul>
          <p className={P}>{renderPara(S02_PARA3)}</p>
          <PolicyCallout variant="warning">
            {renderPara(S02_CALLOUT)}
          </PolicyCallout>
        </PolicySection>

        {/* 03 — Limitations & Exclusions */}
        <PolicySection number="03" title="Limitations & Exclusions">
          <p className={P}>{renderPara(S03_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S03_BULLETS.map((item) => (
              <li key={item} className={P}>
                {item}
              </li>
            ))}
          </ul>
          <p className={P}>{renderPara(S03_PARA2)}</p>
          <p className={P}>{renderPara(S03_PARA3)}</p>
        </PolicySection>

        {/* 04 — Counterfeit Products */}
        <PolicySection number="04" title="Counterfeit Products">
          <p className={P}>{renderPara(S04_PARA1)}</p>
          <p className={P}>{renderPara(S04_PARA2)}</p>
          <p className={P}>{renderPara(S04_PARA3)}</p>
        </PolicySection>

        {/* 05 — Warranty Contact */}
        <PolicySection number="05" title="Warranty Contact">
          <p className={P}>{renderPara(S05_PARA1)}</p>
          <AddressBlock data={WARRANTY_CONTACT_BLOCK} />
        </PolicySection>

      </div>
    </div>
  );
}
