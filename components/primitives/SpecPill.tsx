interface SpecPillProps {
  label: string;
}

export default function SpecPill({ label }: SpecPillProps) {
  return (
    <span
      className="flex justify-center items-center gap-[5px] font-label text-eyebrow text-accent-cyan tracking-widest uppercase"
      style={{
        padding: "5px 10px",
        borderRadius: "20px",
        border: "1px solid #2D1C53",
        flex: "1 0 0",
        alignSelf: "stretch",
        width: "auto"
      }}
    >
      {label}
    </span>
  );
}
