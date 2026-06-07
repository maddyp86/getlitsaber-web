import type { ReactNode } from "react";

interface PolicyCalloutProps {
  variant: "warning" | "info";
  children: ReactNode;
}

export default function PolicyCallout({
  variant,
  children,
}: PolicyCalloutProps) {
  const styles =
    variant === "warning"
      ? "border-l-4 border-accent-magenta bg-surface-tint-purple"
      : "border-l-4 border-accent-cyan bg-surface-tint-cyan";

  return (
    <div
      className={`${styles} rounded-sm px-6 py-5 font-body text-body-sm text-text-secondary leading-relaxed`}
    >
      {children}
    </div>
  );
}
