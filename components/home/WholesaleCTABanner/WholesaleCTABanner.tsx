import Link from "next/link";

export default function WholesaleCTABanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 60% 200% at 30% 50%, rgba(236,87,147,0.18) 0%, rgba(10,5,24,0) 70%), #0A0518",
        height:"250px",
        width:"auto"
      }}
    >
      {/* Thin top border to separate from section above */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/5" aria-hidden="true" />

      <div className="h-full mx-auto max-w-screen-xl p-5 lg:px-16 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 lg:gap-6">
        {/* Left: headline + sub-copy */}
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h2
            className="font-subhead font-black uppercase leading-none text-white"
            style={{
              fontSize: "clamp(22px, 3.2vw, 35px)",
              fontStyle: "normal",
              lineHeight:"50px"
            }}
          >
            STOCK LITSABER IN YOUR{" "}
            <span
              className="font-accent"
              style={{ color: "#EC5793", fontWeight: "400" }}
            >
              SHOP.
            </span>
          </h2>

          <p
            className="font-label uppercase text-white/55"
            style={{ fontSize: "clamp(13px, 1.1vw, 16px)" }}
          >
            MOQ 5 &middot; FREE DISPLAY CASE AT 80+
          </p>
        </div>

        {/* Right: CTA button */}
        <Link
          href="/wholesale"
          className="font-label font-bold uppercase tracking-widest text-white opacity-75 transition-opacity duration-200 hover:opacity-100 active:opacity-60 whitespace-nowrap shrink-0"
          style={{
            display: "flex",
            width: "300px",
            height: "60px",
            padding: "20px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            fontSize: "clamp(11px, 1vw, 13px)",
            letterSpacing: "0.14em",
            background: "#EC5793",
            borderRadius: 6,
          }}
        >
          VIEW WHOLESALE PROGRAM
          <span aria-hidden="true" style={{ fontSize: "1em" }}>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}