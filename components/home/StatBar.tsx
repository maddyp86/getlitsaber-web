const STATS = [
  { value: "2M+", label: "TikTok Views" },
  { value: "1K+", label: "Units Shipped" },
  { label: "Ships in 24hrs" },
  { label: "30-Day Guarantee" },
  { label: "Family Owned" },
] as const;

function StatItem({ value, label }: { value?: string; label: string }) {
  return (
    <span className="flex items-center gap-sm flex-shrink-0">
      <span className="text-accent-purple opacity-40 font-label text-eyebrow lg:text-label select-none">
        /
      </span>
      {value && (
        <span className="font-label font-bold text-eyebrow lg:text-label text-accent-cyan">
          {value}
        </span>
      )}
      <span className="font-label text-eyebrow lg:text-label text-text-muted">
        {label}
      </span>
    </span>
  );
}

export default function StatBar() {
  return (
    <section data-analytics="stat-bar" className="w-full bg-background-primary py-xl overflow-hidden">
      <div className="flex gap-2xl animate-marquee">
        {[...STATS, ...STATS].map((stat, i) => (
          <StatItem key={i} label={stat.label} value={"value" in stat ? stat.value : undefined} />
        ))}
      </div>
    </section>
  );
}
