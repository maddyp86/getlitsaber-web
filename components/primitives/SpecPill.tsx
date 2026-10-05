import Link from "next/link";

interface SpecPillProps {
  label: string;
  /** When set, the pill links to the detail it implies. Session replays showed
   *  people tapping the bordered pills expecting them to open something. */
  href?: string;
  onClick?: () => void;
}

const PILL_CLASS =
  "flex justify-center text-center items-center gap-[5px] font-label text-eyebrow text-accent-cyan tracking-widest uppercase border border-border-pill";

const PILL_STYLE = {
  padding: "5px 10px",
  borderRadius: "20px",
  flex: "1 0 0",
  alignSelf: "stretch",
  width: "auto",
} as const;

export default function SpecPill({ label, href, onClick }: SpecPillProps) {
  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={`${label}, see the tech`}
        className={`${PILL_CLASS} touch-manipulation transition-colors hover:border-accent-cyan hover:bg-surface-tint-cyan active:opacity-80`}
        style={PILL_STYLE}
      >
        {label}
      </Link>
    );
  }

  return (
    <span className={PILL_CLASS} style={PILL_STYLE}>
      {label}
    </span>
  );
}
