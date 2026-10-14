import Link from "next/link";
import { DECISION_BLOCK } from "./productdisplay.content";

/**
 * The facts a shopper checks before buying, directly under the PDP buy
 * buttons so nothing pushes them down on mobile (roadmap phase 7).
 */
export default function DecisionBlock({ qty }: { qty: number }) {
  const { fits, box, shipping, returns, warranty } = DECISION_BLOCK;
  const rows: Array<{ label: string; text: string; link?: { label: string; href: string } }> = [
    { label: fits.label, text: fits.text },
    { label: box.label, text: box.text },
    { label: shipping.label, text: `${qty >= 2 ? shipping.multi : shipping.single} ${shipping.dispatch}` },
    { label: returns.label, text: returns.text, link: returns.link },
    { label: warranty.label, text: warranty.text, link: warranty.link },
  ];

  return (
    <dl data-testid="decision-block" className="flex flex-col border-t border-border-divider">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[88px_1fr] gap-3 py-2.5 border-b border-border-divider">
          <dt className="font-label text-[11px] uppercase tracking-wider text-text-muted pt-[2px]">{row.label}</dt>
          <dd className="font-body text-[13px] leading-snug text-text-secondary">
            {row.text}
            {row.link && (
              <>
                {" "}
                <Link href={row.link.href} className="underline underline-offset-2 hover:text-text-primary">
                  {row.link.label}
                </Link>
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
