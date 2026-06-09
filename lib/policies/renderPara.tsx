import Link from "next/link";
import type { Para } from "@/components/policies/shipping-returns";

const LINK_CLASS =
  "text-accent-cyan underline-offset-2 hover:underline transition-colors duration-150";

export function renderPara(para: Para): React.ReactNode[] {
  return para.map((seg, i) => {
    switch (seg.t) {
      case "b":
        return (
          <strong key={i} className="font-bold text-text-primary">
            {seg.v}
          </strong>
        );
      case "link":
        return (
          <Link key={i} href={seg.href} className={LINK_CLASS}>
            {seg.v}
          </Link>
        );
      case "email":
        return (
          <a key={i} href={`mailto:${seg.v}`} className={LINK_CLASS}>
            {seg.v}
          </a>
        );
      case "mag":
        return (
          <span key={i} style={{ color: "#FF00E5" }}>
            {seg.v}
          </span>
        );
      case "mag-b":
        return (
          <strong key={i} style={{ color: "#FF00E5" }}>
            {seg.v}
          </strong>
        );
      default:
        return <span key={i}>{seg.v}</span>;
    }
  });
}
