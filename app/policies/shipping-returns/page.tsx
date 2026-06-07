import type { Metadata } from "next";
import Link from "next/link";
import PolicyHeader from "@/components/policies/PolicyHeader";
import QuickSummary from "@/components/policies/QuickSummary";
import PolicySection from "@/components/policies/PolicySection";
import PolicyCallout from "@/components/policies/PolicyCallout";
import AddressBlock from "@/components/policies/AddressBlock";
import { POLICIES_EFFECTIVE_DATE } from "@/content/policies/shared";
import {
  type Para,
  QUICK_SUMMARY,
  S01_PARA1,
  S01_PARA2,
  S01_PARA3,
  S01_PARA4,
  S02_PARA1,
  S02_PARA2,
  S02_QUALIFICATIONS,
  S02_PARA3,
  S02_CALLOUT_LEADIN,
  S02_CALLOUT_BODY,
  S03_PARA1,
  S04_PARA1,
  S04_PARA2,
  S05_PARA1,
  S06_PARA1,
  S07_PARA1,
  S07_PARA2,
  S08_PARA1,
} from "@/content/policies/shipping-returns";

export const metadata: Metadata = {
  title: "Shipping & Returns | Litsaber",
  description:
    "Litsaber shipping timelines, return windows, and how to start a return. Plain language, no surprises.",
};

const LINK_CLASS =
  "text-accent-cyan underline-offset-2 hover:underline transition-colors duration-150";

function renderPara(para: Para): React.ReactNode[] {
  return para.map((seg, i) => {
    const key = i;
    switch (seg.t) {
      case "b":
        return (
          <strong key={key} className="font-bold text-text-primary">
            {seg.v}
          </strong>
        );
      case "link":
        return (
          <Link key={key} href={seg.href} className={LINK_CLASS}>
            {seg.v}
          </Link>
        );
      case "email":
        return (
          <a key={key} href={`mailto:${seg.v}`} className={LINK_CLASS}>
            {seg.v}
          </a>
        );
      case "mag":
        return (
          <span key={key} style={{ color: "#FF00E5" }}>
            {seg.v}
          </span>
        );
      default:
        return <span key={key}>{seg.v}</span>;
    }
  });
}

const P = "font-body text-body-sm lg:text-body text-text-secondary leading-relaxed";

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto w-full max-w-content px-content pb-16 lg:pb-24">
      <PolicyHeader
        index={1}
        title="SHIPPING & RETURNS"
        effectiveDate={POLICIES_EFFECTIVE_DATE}
      />

      <QuickSummary>
        <p className={P}>{renderPara(QUICK_SUMMARY)}</p>
      </QuickSummary>

      <div className="mt-10 lg:mt-14 flex flex-col gap-12 lg:gap-16">

        {/* 01 — Shipping */}
        <PolicySection number="01" title="Shipping">
          <p className={P}>{renderPara(S01_PARA1)}</p>
          <p className={P}>{renderPara(S01_PARA2)}</p>
          <p className={P}>{renderPara(S01_PARA3)}</p>
          <p className={P}>{renderPara(S01_PARA4)}</p>
        </PolicySection>

        {/* 02 — Returns & Refunds */}
        <PolicySection number="02" title="Returns & Refunds">
          <p className={P}>{renderPara(S02_PARA1)}</p>
          <p className={P}>{renderPara(S02_PARA2)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S02_QUALIFICATIONS.map((item) => (
              <li key={item} className={P}>
                {item}
              </li>
            ))}
          </ul>
          <p className={P}>{renderPara(S02_PARA3)}</p>
          <PolicyCallout variant="warning">
            <span style={{ color: "#FF00E5" }}>{S02_CALLOUT_LEADIN}</span>
            {S02_CALLOUT_BODY}
          </PolicyCallout>
        </PolicySection>

        {/* 03 — Return Address */}
        <PolicySection number="03" title="Return Address">
          <p className={P}>{renderPara(S03_PARA1)}</p>
          <AddressBlock />
        </PolicySection>

        {/* 04 — Refund Processing */}
        <PolicySection number="04" title="Refund Processing">
          <p className={P}>{renderPara(S04_PARA1)}</p>
          <p className={P}>{renderPara(S04_PARA2)}</p>
        </PolicySection>

        {/* 05 — Sale Items */}
        <PolicySection number="05" title="Sale Items">
          <p className={P}>{renderPara(S05_PARA1)}</p>
        </PolicySection>

        {/* 06 — Defective Products */}
        <PolicySection number="06" title="Defective Products">
          <p className={P}>{renderPara(S06_PARA1)}</p>
        </PolicySection>

        {/* 07 — Risk of Loss & Carrier Delays */}
        <PolicySection number="07" title="Risk of Loss & Carrier Delays">
          <p className={P}>{renderPara(S07_PARA1)}</p>
          <p className={P}>{renderPara(S07_PARA2)}</p>
        </PolicySection>

        {/* 08 — Questions */}
        <PolicySection number="08" title="Questions">
          <p className={P}>{renderPara(S08_PARA1)}</p>
        </PolicySection>

      </div>
    </div>
  );
}
