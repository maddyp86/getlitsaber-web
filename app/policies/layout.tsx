import type { ReactNode } from "react";
import PoliciesHero from "@/components/policies/PoliciesHero";
import PolicySubNav from "@/components/policies/PolicySubNav";
import RelatedResources from "@/components/policies/RelatedResources";

export default function PoliciesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PoliciesHero />
      <PolicySubNav />
      {children}
      <RelatedResources />
    </>
  );
}
