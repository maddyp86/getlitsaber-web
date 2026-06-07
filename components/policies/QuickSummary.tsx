import type { ReactNode } from "react";

export default function QuickSummary({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-4 border-accent-cyan bg-surface-tint-cyan rounded-sm px-6 py-5">
      {children}
    </div>
  );
}
