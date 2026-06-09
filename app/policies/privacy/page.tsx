import type { Metadata } from "next";
import PolicyHeader from "@/components/policies/PolicyHeader";
import QuickSummary from "@/components/policies/QuickSummary";
import PolicySection from "@/components/policies/PolicySection";
import PolicyContents from "@/components/policies/PolicyContents";
import PolicyCallout from "@/components/policies/PolicyCallout";
import AddressBlock from "@/components/policies/AddressBlock";
import { renderPara } from "@/lib/policies/renderPara";
import { POLICIES_EFFECTIVE_DATE } from "@/components/policies/shared";
import {
  SECTIONS,
  QUICK_SUMMARY,
  S01_PARA1,
  S01_BULLETS_A,
  S01_PARA2,
  S01_BULLETS_B,
  S01_SUBHEAD_AUTO,
  S01_PARA3,
  S01_BULLETS_C,
  S02_PARA1,
  S02_SUBHEAD_THIRD,
  S02_PARA2,
  S02_THIRD_PARTIES,
  S02_GAOPTOUT_URL,
  S03_PARA1,
  S03_BULLETS,
  S03_CALLOUT,
  S04_PARA1,
  S04_SUBHEAD_SVC,
  S04_PARA2,
  S04_BULLETS,
  S04_PARA3,
  S04_SUBHEAD_ADS,
  S04_DAA_URL,
  S04_SUBHEAD_LEGAL,
  S04_PARA5,
  S04_SUBHEAD_BIZ,
  S04_PARA6,
  S04_SUBHEAD_CONSENT,
  S04_PARA7,
  S05_SUBHEAD_COMM,
  S05_PARA1,
  S05_PARA2,
  S05_BULLETS,
  S05_PARA3,
  S05_SUBHEAD_CORRECTION,
  S05_PARA4,
  S06_PARA1,
  S06_BULLETS,
  S06_SUBHEAD_DNT,
  S06_PARA2,
  S07_PARA1,
  S08_PARA1,
  S08_BULLETS,
  S08_PARA2,
  S09_PARA1,
  S09_PARA2,
  S10_PARA1,
  PRIVACY_CONTACT_BLOCK,
} from "@/components/policies/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | Litsaber",
  description:
    "How Litsaber collects, uses, and protects your personal information.",
};

const P = "font-body text-body-sm lg:text-body text-text-secondary leading-relaxed";
const SUBHEAD = "font-subhead font-bold text-text-primary uppercase text-[13px] lg:text-[14px] tracking-wider pt-2";
const EXTLINK = "text-accent-cyan underline-offset-2 hover:underline transition-colors duration-150";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-content px-content pb-16 lg:pb-24">
      <PolicyHeader
        index={4}
        title="PRIVACY POLICY"
        effectiveDate={POLICIES_EFFECTIVE_DATE}
      />

      <QuickSummary>
        <p className={P}>{renderPara(QUICK_SUMMARY)}</p>
      </QuickSummary>

      <div className="mt-10 lg:mt-14">
        <PolicyContents sections={SECTIONS} />
      </div>

      <div className="mt-10 lg:mt-14 flex flex-col gap-12 lg:gap-16">

        <PolicySection number="01" title="Information We Collect" id="01">
          <p className={P}>{renderPara(S01_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S01_BULLETS_A.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S01_PARA2)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S01_BULLETS_B.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={SUBHEAD}>{S01_SUBHEAD_AUTO}</p>
          <p className={P}>{renderPara(S01_PARA3)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S01_BULLETS_C.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection number="02" title="Cookies & Tracking" id="02">
          <p className={P}>{renderPara(S02_PARA1)}</p>
          <p className={SUBHEAD}>{S02_SUBHEAD_THIRD}</p>
          <p className={P}>{renderPara(S02_PARA2)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S02_THIRD_PARTIES.map((tp) => (
              <li key={tp.label} className={P}>
                {tp.label} -{" "}
                <a
                  href={tp.policyUrl}
                  className={EXTLINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy
                </a>
              </li>
            ))}
          </ul>
          <p className={P}>
            You can control cookies through your browser settings, and you can opt
            out of Google Analytics by installing the{" "}
            <a
              href={S02_GAOPTOUT_URL}
              className={EXTLINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>
        </PolicySection>

        <PolicySection number="03" title="How We Use Your Information" id="03">
          <p className={P}>{renderPara(S03_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S03_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <PolicyCallout variant="info">
            {renderPara(S03_CALLOUT)}
          </PolicyCallout>
        </PolicySection>

        <PolicySection number="04" title="Sharing & Disclosure" id="04">
          <p className={P}>{renderPara(S04_PARA1)}</p>
          <p className={SUBHEAD}>{S04_SUBHEAD_SVC}</p>
          <p className={P}>{renderPara(S04_PARA2)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S04_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S04_PARA3)}</p>
          <p className={SUBHEAD}>{S04_SUBHEAD_ADS}</p>
          <p className={P}>
            We work with third-party advertising companies to show you ads on our
            site and on other sites. These partners may use cookies, pixels, and
            similar technologies to collect data about your browsing behavior. You
            can opt out of personalized advertising through industry tools like the{" "}
            <a
              href={S04_DAA_URL}
              className={EXTLINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Advertising Alliance opt-out page
            </a>
            .
          </p>
          <p className={SUBHEAD}>{S04_SUBHEAD_LEGAL}</p>
          <p className={P}>{renderPara(S04_PARA5)}</p>
          <p className={SUBHEAD}>{S04_SUBHEAD_BIZ}</p>
          <p className={P}>{renderPara(S04_PARA6)}</p>
          <p className={SUBHEAD}>{S04_SUBHEAD_CONSENT}</p>
          <p className={P}>{renderPara(S04_PARA7)}</p>
        </PolicySection>

        <PolicySection number="05" title="Your Choices" id="05">
          <p className={SUBHEAD}>{S05_SUBHEAD_COMM}</p>
          <p className={P}>{renderPara(S05_PARA1)}</p>
          <p className={P}>{renderPara(S05_PARA2)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S05_BULLETS.map((seg, i) => (
              <li key={i} className={P}>{renderPara(seg)}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S05_PARA3)}</p>
          <p className={SUBHEAD}>{S05_SUBHEAD_CORRECTION}</p>
          <p className={P}>{renderPara(S05_PARA4)}</p>
        </PolicySection>

        <PolicySection number="06" title="California Residents" id="06">
          <p className={P}>{renderPara(S06_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S06_BULLETS.map((seg, i) => (
              <li key={i} className={P}>{renderPara(seg)}</li>
            ))}
          </ul>
          <p className={SUBHEAD}>{S06_SUBHEAD_DNT}</p>
          <p className={P}>{renderPara(S06_PARA2)}</p>
        </PolicySection>

        <PolicySection number="07" title="Age of Consent" id="07">
          <p className={P}>{renderPara(S07_PARA1)}</p>
        </PolicySection>

        <PolicySection number="08" title="Data Security" id="08">
          <p className={P}>{renderPara(S08_PARA1)}</p>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {S08_BULLETS.map((item) => (
              <li key={item} className={P}>{item}</li>
            ))}
          </ul>
          <p className={P}>{renderPara(S08_PARA2)}</p>
        </PolicySection>

        <PolicySection number="09" title="Changes to This Policy" id="09">
          <p className={P}>{renderPara(S09_PARA1)}</p>
          <p className={P}>{renderPara(S09_PARA2)}</p>
        </PolicySection>

        <PolicySection number="10" title="Contact Information" id="10">
          <p className={P}>{renderPara(S10_PARA1)}</p>
          <AddressBlock data={PRIVACY_CONTACT_BLOCK} />
        </PolicySection>

      </div>
    </div>
  );
}
