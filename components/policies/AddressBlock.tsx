import Link from "next/link";
import { RETURN_ADDRESS } from "@/content/policies/shared";

export interface ContactRow {
  rowLabel: string;
  display: string;
  href: string;
}

export interface AddressBlockData {
  label: string;
  recipient: string;
  attn: string;
  line1: string;
  line2: string;
  contacts?: ContactRow[];
  addressLabel?: string;
}

interface AddressBlockProps {
  data?: AddressBlockData;
}

const LINK_CLASS =
  "text-accent-cyan underline-offset-2 hover:underline transition-colors duration-150";

export default function AddressBlock({ data }: AddressBlockProps) {
  const addr: AddressBlockData = data ?? RETURN_ADDRESS;

  return (
    <div className="flex flex-col gap-2">
      <p className="font-label text-eyebrow text-text-muted tracking-widest uppercase mb-1">
        -- {addr.label}
      </p>
      <div className="border border-border-default rounded-sm p-5 font-label text-body-sm text-text-secondary leading-relaxed">
        {addr.contacts && addr.contacts.length > 0 && (
          <>
            <div className="flex flex-col gap-1 mb-3">
              {addr.contacts.map((row) => (
                <div key={row.rowLabel} className="flex gap-3">
                  <span className="text-text-muted uppercase tracking-widest min-w-[72px]">
                    {row.rowLabel}
                  </span>
                  {row.href.startsWith("mailto:") ? (
                    <a href={row.href} className={LINK_CLASS}>
                      {row.display}
                    </a>
                  ) : (
                    <Link href={row.href} className={LINK_CLASS}>
                      {row.display}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="border-b border-border-default mb-3" />
            {addr.addressLabel && (
              <p className="text-text-muted uppercase tracking-widest text-[11px] mb-2">
                {addr.addressLabel}
              </p>
            )}
          </>
        )}
        <p>{addr.recipient}</p>
        <p>{addr.attn}</p>
        <p>{addr.line1}</p>
        <p>{addr.line2}</p>
      </div>
    </div>
  );
}
