import Link from "next/link";
import { ACTIVATE_CTA } from "@/content/activate.content";
import FestivalDropList from "./FestivalDropList";

export default function ActivateCta() {
  const { heading, body, primary, secondary } = ACTIVATE_CTA;

  return (
    <>
      {/* Festival Drop List band */}
      <FestivalDropList />

      {/* Still Stuck CTA */}
      <section className="py-section-y-mobile lg:py-section-y border-t border-border-divider">
        <div className="mx-auto w-full max-w-content px-content text-center flex flex-col items-center gap-8">

          <div className="flex flex-col items-center gap-4">
            <h2
              className="font-display font-bold uppercase leading-[1.05] text-white"
              style={{ fontSize: "clamp(32px, 4vw, 55px)" }}
            >
              {heading}
            </h2>
            <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[440px]">
              {body}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Primary — magenta-filled */}
            <Link
              href={primary.href}
              className="inline-block rounded-pill px-8 py-3 font-label text-label tracking-widest uppercase transition-all duration-200"
              style={{
                background: "#FF00E5",
                color: "#ffffff",
                border: "1px solid #FF00E5",
              }}
            >
              {primary.label}
            </Link>

            {/* Secondary — outlined ghost */}
            <Link
              href={secondary.href}
              className="inline-block rounded-pill px-8 py-3 font-label text-label tracking-widest uppercase text-text-secondary border border-[rgba(255,255,255,0.20)] hover:border-[rgba(255,255,255,0.40)] transition-colors duration-200"
            >
              {secondary.label}
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
