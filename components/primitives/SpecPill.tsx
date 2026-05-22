interface SpecPillProps {
  label: string;
}

export default function SpecPill({ label }: SpecPillProps) {
  return (
    <span className="inline-flex items-center px-md py-xs rounded-pill border border-border-pill font-label text-eyebrow text-accent-cyan tracking-widest uppercase whitespace-nowrap w-auto">
      {label}
    </span>
  );
}
