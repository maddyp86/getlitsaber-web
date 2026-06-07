interface PolicyHeaderProps {
  index: number;
  title: string;
  effectiveDate: string;
}

export default function PolicyHeader({
  index,
  title,
  effectiveDate,
}: PolicyHeaderProps) {
  const indexLabel = `-- POLICY ${String(index).padStart(2, "0")}`;

  return (
    <header className="pt-14 pb-8 lg:pt-20 lg:pb-10">
      <p className="font-label text-eyebrow text-text-muted tracking-widest uppercase mb-4">
        {indexLabel}
      </p>
      <h1
        className="font-subhead font-bold uppercase text-text-primary mb-4"
        style={{ fontSize: "clamp(36px, 4vw, 60px)", lineHeight: "1.1" }}
      >
        {title}
      </h1>
      <p className="font-label text-eyebrow text-text-muted tracking-widest uppercase">
        EFFECTIVE: {effectiveDate.toUpperCase()}
      </p>
    </header>
  );
}
