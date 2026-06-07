import type { ReactNode } from "react";

interface PolicySectionProps {
  number: string;
  title: string;
  children: ReactNode;
}

export default function PolicySection({
  number,
  title,
  children,
}: PolicySectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline gap-4">
        <span className="font-subhead font-bold text-accent-cyan text-h3 shrink-0">
          {number}
        </span>
        <h2
          className="font-subhead font-bold text-text-primary uppercase"
          style={{ fontSize: "clamp(18px, 2vw, 24px)" }}
        >
          {title}
        </h2>
      </div>
      <div className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
