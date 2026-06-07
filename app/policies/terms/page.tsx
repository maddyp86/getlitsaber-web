import type { Metadata } from "next";
import PolicyHeader from "@/components/policies/PolicyHeader";
import QuickSummary from "@/components/policies/QuickSummary";
import { POLICIES_EFFECTIVE_DATE } from "@/content/policies/shared";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Litsaber terms of service covering use of the site, purchases, and your agreement with Innovape Concepts.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-content px-content pb-16 lg:pb-24">
      <PolicyHeader
        index={3}
        title="TERMS OF SERVICE"
        effectiveDate={POLICIES_EFFECTIVE_DATE}
      />
      <QuickSummary>
        <p className="font-body text-body-sm text-text-secondary leading-relaxed">
          Policy content for Terms of Service coming in the next prompt.
        </p>
      </QuickSummary>
    </div>
  );
}
