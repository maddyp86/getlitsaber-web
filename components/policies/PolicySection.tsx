import type { ReactNode } from "react";

interface PolicySectionProps {
  number: string;
  title: string;
  id?: string;
  children: ReactNode;
}

export default function PolicySection({
  number,
  title,
  id,
  children,
}: PolicySectionProps) {
  return (
    <section
      id={id ? `section-${id}` : undefined}
      className={`flex flex-col gap-4${id ? " scroll-mt-[160px]" : ""}`}
    >
      <div className="flex items-baseline gap-4">
        <span className="font-subhead font-bold text-accent-cyan text-[20px] shrink-0">
          {number}
        </span>
        <h2
          className="font-subhead font-bold text-text-primary uppercase"
          style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
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
