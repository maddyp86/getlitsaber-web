import Link from "next/link";
import { BUILT_TO_LAST } from "./productdisplay.content";

/** Three-line durability block directly under the PDP price. */
export default function BuiltToLast() {
  return (
    <section
      aria-labelledby="built-to-last-heading"
      className="flex flex-col gap-1 border-l-2 border-accent-cyan pl-4"
    >
      <h2
        id="built-to-last-heading"
        className="font-label font-bold text-[14px] uppercase tracking-wider text-text-primary"
      >
        {BUILT_TO_LAST.heading}
      </h2>
      {BUILT_TO_LAST.lines.map((line) => (
        <p key={line} className="font-body text-[15px] text-text-secondary">
          {line}
        </p>
      ))}
      <p className="font-body text-[15px] text-text-secondary">
        {BUILT_TO_LAST.warranty}{" "}
        <Link
          href={BUILT_TO_LAST.warrantyLink.href}
          className="text-text-primary underline underline-offset-2 hover:text-accent-cyan transition-colors duration-150"
        >
          {BUILT_TO_LAST.warrantyLink.label}
        </Link>
      </p>
    </section>
  );
}
