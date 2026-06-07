import type { Metadata } from "next";
import PolicyHeader from "@/components/policies/PolicyHeader";
import QuickSummary from "@/components/policies/QuickSummary";
import { POLICIES_EFFECTIVE_DATE } from "@/content/policies/shared";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Litsaber collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-content px-content pb-16 lg:pb-24">
      <PolicyHeader
        index={4}
        title="PRIVACY POLICY"
        effectiveDate={POLICIES_EFFECTIVE_DATE}
      />
      <QuickSummary>
        <p className="font-body text-body-sm text-text-secondary leading-relaxed">
          Policy content for Privacy Policy coming in the next prompt.
        </p>
      </QuickSummary>
    </div>
  );
}
