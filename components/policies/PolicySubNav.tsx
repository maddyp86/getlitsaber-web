"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const TABS = [
  { label: "SHIPPING & RETURNS", href: "/policies/shipping-returns" },
  { label: "WARRANTY", href: "/policies/warranty" },
  { label: "TERMS OF SERVICE", href: "/policies/terms" },
  { label: "PRIVACY POLICY", href: "/policies/privacy" },
] as const;
export default function PolicySubNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const activeEl = list.querySelector(
      '[aria-current="page"]'
    ) as HTMLElement | null;
    activeEl?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [pathname]);
  return (
    <nav
      className="sticky top-navbar z-sticky"
      style={{
        background: "#120C27;",
        borderTop: "1px solid rgba(0,229,255,0.20)",
        borderBottom: "1px solid rgba(0,229,255,0.20)",
      }}
      aria-label="Policy sections"
    >
      <div className="mx-auto w-full max-w-content px-content lg:px-[75px]">
        <ul
          ref={listRef}
          className="no-scrollbar flex h-[70px] items-stretch justify-start gap-[35px] overflow-x-auto lg:justify-center"
          style={{ scrollSnapType: "x mandatory" }}
          role="list"
        >
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <li
                key={tab.href}
                className="flex-shrink-0"
                style={{ scrollSnapAlign: "center" }}
                role="listitem"
              >
                <Link
                  href={tab.href}
                  className={[
"flex h-full min-w-[175px] items-left justify-center whitespace-nowrap border-b-2 px-5 font-label text-eyebrow uppercase tracking-widest transition-colors duration-200",
                    isActive
                      ? "border-accent-cyan text-accent-cyan"
                      : "border-transparent text-text-muted hover:text-text-secondary",
                  ].join(" ")}
                  style={isActive ? { background: "#172543" } : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}