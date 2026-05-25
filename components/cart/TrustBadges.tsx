export function CardBadge({ label }: { label: string }) {
  return (
    <span
      className="font-label text-text-muted"
      style={{
        fontSize: "9px",
        border: "1px solid rgba(240, 240, 245, 0.15)",
        borderRadius: "3px",
        padding: "2px 4px",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </span>
  );
}

export function TrustBadges() {
  return (
    <div className="flex flex-col items-center gap-1 pt-1">
      <div className="flex items-center gap-2">
        <CardBadge label="VISA" />
        <CardBadge label="MC" />
        <CardBadge label="AMEX" />
        <CardBadge label="DISC" />
      </div>
      <p className="font-label text-text-muted text-center" style={{ fontSize: "10px" }}>
        Authorize.net · Free 14-day returns
      </p>
    </div>
  );
}
