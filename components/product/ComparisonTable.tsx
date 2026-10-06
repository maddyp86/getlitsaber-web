import Link from "next/link";
import { COMPARISON } from "./productdisplay.content";

/** Litsaber vs. a typical light-up 510 battery. Never names a competitor. */
export default function ComparisonTable() {
  return (
    <section aria-labelledby="comparison-heading" className="flex flex-col gap-6 items-center">
      <h2
        id="comparison-heading"
        className="font-display text-text-primary text-center text-[clamp(32px,3.2vw,56px)] font-bold"
      >
        {COMPARISON.heading}
      </h2>

      <div className="w-full max-w-[760px] overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{COMPARISON.heading}</caption>
          <thead>
            <tr className="border-b border-border-divider">
              <td className="py-3 pr-3" />
              <th
                scope="col"
                className="py-3 px-3 font-label font-bold text-[13px] sm:text-[14px] uppercase tracking-wider text-accent-cyan"
              >
                {COMPARISON.columns[0]}
              </th>
              <th
                scope="col"
                className="py-3 pl-3 font-label font-bold text-[13px] sm:text-[14px] uppercase tracking-wider text-text-muted"
              >
                {COMPARISON.columns[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.rows.map((row) => (
              <tr key={row.label} className="border-b border-border-divider">
                <th
                  scope="row"
                  className="py-3 pr-3 font-label text-[12px] sm:text-[13px] uppercase tracking-wider text-text-muted font-normal"
                >
                  {row.label}
                </th>
                <td className="py-3 px-3 font-body text-[14px] sm:text-[16px] font-semibold text-text-primary">
                  {row.label === "Warranty" ? (
                    <Link
                      href={COMPARISON.warrantyLink.href}
                      className="underline underline-offset-2 hover:text-accent-cyan transition-colors duration-150"
                    >
                      {row.litsaber}
                    </Link>
                  ) : (
                    row.litsaber
                  )}
                </td>
                <td className="py-3 pl-3 font-body text-[14px] sm:text-[16px] text-text-secondary">
                  {row.typical}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
