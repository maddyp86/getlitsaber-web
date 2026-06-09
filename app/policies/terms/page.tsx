import type { Metadata } from "next";
import PolicyHeader from "@/components/policies/PolicyHeader";
import QuickSummary from "@/components/policies/QuickSummary";
import PolicySection from "@/components/policies/PolicySection";
import PolicyContents from "@/components/policies/PolicyContents";
import AddressBlock from "@/components/policies/AddressBlock";
import { renderPara } from "@/lib/policies/renderPara";
import { POLICIES_EFFECTIVE_DATE } from "@/components/policies/shared";
import {
  SECTIONS,
  QUICK_SUMMARY,
  S01_PARA1,
  S01_PARA2,
  S01_PARA3,
  S02_PARA1,
  S02_PARA2,
  S02_BULLETS,
  S02_PARA3,
  S03_PARA1,
  S03_PARA2,
  S03_PARA3,
  S04_PARA1,
  S04_BULLETS,
  S04_PARA2,
  S05_PARA1,
  S05_BULLETS,
  S05_PARA2,
  S06_PARA1,
  S07_PARA1,
  S07_BULLETS,
  S07_PARA2,
  S08_PARA1,
  S08_SUBHEAD_1,
  S08_PARA2,
  S08_SUBHEAD_2,
  S08_PARA3,
  S08_BULLETS,
  S09_PARA1,
  S09_BULLETS,
  S09_PARA2,
  S10_PARA1,
  S10_BULLETS,
  S10_PARA2,
  S11_PARA1,
  S12_PARA1,
  S12_BULLETS,
  S12_PARA2,
  S13_PARA1,
  S13_PARA2,
  S14_PARA1,
  S14_BULLETS,
  S15_PARA1,
  S16_PARA1,
  S17_PARA1,
  TERMS_CONTACT_BLOCK,
} from "@/components/policies/terms";

export const metadata: Metadata = {
  title: "Terms of Service | Litsaber",
  description:
    "Litsaber terms of service covering use of the site, purchases, and your agreement with Innovape Concepts.",
};

const P = "font-body text-body-sm lg:text-body text-text-secondary leading-relaxed";
const SUBHEAD = "font-subhead font-bold text-text-primary uppercase text-[13px] lg:text-[14px] tracking-wider pt-2";

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-content px-content pb-16 lg:pb-24">
      <PolicyHeader
        index={3}
        title="TERMS OF SERVICE"
        effectiveDate={POLICIES_EFFECTIVE_DATE}
      />

      <QuickSummary>
        <p className={P}>{renderPara(QUICK_SUMMARY)}</p>
      </QuickSummary>

      <div className="mt-10 lg:mt-14">
        <PolicyContents sections={SECTIONS} />
      </div>

      <div className="mt-10 lg:mt-14 flex flex-col gap-12 lg:gap-16">

        <PolicySection number="01" title="Overview" id="01">
          <p className={P}>{renderPara(S01_PARA1)}</p>
          <p className={P}>{renderPara(S01_PARA2)}</p>
          <p className={P}>{renderPara(S01_PARA3)}</p>
        </PolicySection>

        <PolicySection number="02" title="Eligibility & Age Requirement" id="02">
          <p className={P}>{renderPara(S02_PARA1)}</p>
          <p className={P}>{renderPara(S02_PARA2)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S02_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S02_PARA3)}</p>
        </PolicySection>

        <PolicySection number="03" title="Products & Use" id="03">
          <p className={P}>{renderPara(S03_PARA1)}</p>
          <p className={P}>{renderPara(S03_PARA2)}</p>
          <p className={P}>{renderPara(S03_PARA3)}</p>
        </PolicySection>

        <PolicySection number="04" title="Payment Terms" id="04">
          <p className={P}>{renderPara(S04_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S04_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S04_PARA2)}</p>
        </PolicySection>

        <PolicySection number="05" title="Order Acceptance & Cancellation" id="05">
          <p className={P}>{renderPara(S05_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S05_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S05_PARA2)}</p>
        </PolicySection>

        <PolicySection number="06" title="Pricing & Availability" id="06">
          <p className={P}>{renderPara(S06_PARA1)}</p>
        </PolicySection>

        <PolicySection number="07" title="Shipping & Delivery" id="07">
          <p className={P}>{renderPara(S07_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S07_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S07_PARA2)}</p>
        </PolicySection>

        <PolicySection number="08" title="Returns & Warranty" id="08">
          <p className={P}>{renderPara(S08_PARA1)}</p>
          <p className={SUBHEAD}>{S08_SUBHEAD_1}</p>
          <p className={P}>{renderPara(S08_PARA2)}</p>
          <p className={SUBHEAD}>{S08_SUBHEAD_2}</p>
          <p className={P}>{renderPara(S08_PARA3)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S08_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection number="09" title="Chargebacks & Fraud" id="09">
          <p className={P}>{renderPara(S09_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S09_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S09_PARA2)}</p>
        </PolicySection>

        <PolicySection number="10" title="Prohibited Uses" id="10">
          <p className={P}>{renderPara(S10_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S10_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S10_PARA2)}</p>
        </PolicySection>

        <PolicySection number="11" title="Intellectual Property" id="11">
          <p className={P}>{renderPara(S11_PARA1)}</p>
        </PolicySection>

        <PolicySection number="12" title="Limitation of Liability" id="12">
          <p className={P}>{renderPara(S12_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S12_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S12_PARA2)}</p>
        </PolicySection>

        <PolicySection number="13" title="Disclaimer" id="13">
          <p className={P}>{renderPara(S13_PARA1)}</p>
          <p className={P}>{renderPara(S13_PARA2)}</p>
        </PolicySection>

        <PolicySection number="14" title="Indemnification" id="14">
          <p className={P}>{renderPara(S14_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S14_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection number="15" title="Governing Law" id="15">
          <p className={P}>{renderPara(S15_PARA1)}</p>
        </PolicySection>

        <PolicySection number="16" title="Changes to Terms" id="16">
          <p className={P}>{renderPara(S16_PARA1)}</p>
        </PolicySection>

        <PolicySection number="17" title="Contact Information" id="17">
          <p className={P}>{renderPara(S17_PARA1)}</p>
          <AddressBlock data={TERMS_CONTACT_BLOCK} />
        </PolicySection>

      </div>
    </div>
  );
}
