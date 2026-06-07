import type { Metadata } from "next";
import PolicyHeader from "@/components/policies/PolicyHeader";
import QuickSummary from "@/components/policies/QuickSummary";
import { POLICIES_EFFECTIVE_DATE } from "@/content/policies/shared";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Litsaber shipping timelines, return windows, and how to start a return. Plain language, no surprises.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto w-full max-w-content px-content pb-16 lg:pb-24">
      <PolicyHeader
        index={1}
        title="SHIPPING & RETURNS"
        effectiveDate={POLICIES_EFFECTIVE_DATE}
      />
      <QuickSummary>
        <p className="font-body text-body-sm text-text-secondary leading-relaxed">
          <span className="font-bold text-text-primary">Quick summary:</span>{" "}
          Policy content for Shipping &amp; Returns coming in the next prompt.
        </p>
      </QuickSummary>
    </div>
  );
}
