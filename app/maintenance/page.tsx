import { maintenanceContent as c } from "./maintenance.content";

const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";

export const metadata = {
  title: "Recharging - Litsaber",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  const logoSrc = `${mediaBase}${c.logoPath}`;
  const photoSrc = `${mediaBase}${c.photoPath}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0e1a]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 25% 45%, rgba(22,44,78,0.45), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:gap-10 md:px-10">
        <div className="w-full max-w-xl">
          <img
            src={logoSrc}
            alt="Litsaber"
            className="mb-8 h-9 w-auto md:mb-10 md:h-10"
          />

          <h1
            className="mb-5 text-4xl font-extrabold uppercase leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{ textShadow: "0 0 26px rgba(0,200,255,0.35)" }}
          >
            {c.headline}
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-slate-300">
            {c.body}
          </p>

          <a
            href={`mailto:${c.supportEmail}`}
            className="inline-block rounded border-[1.5px] px-9 py-4 text-sm font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
            style={{
              borderColor: c.accent,
              color: c.accent,
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            {c.ctaLabel}
          </a>
        </div>

        <div className="relative flex w-full items-center justify-center">
          <div
            className="pointer-events-none absolute aspect-square w-[min(700px,90vw)] rounded-full"
            style={{ backgroundColor: "#4B2F81", filter: "blur(150px)" }}
          />

          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-cyan-400/40">
            <img
              src={photoSrc}
              alt="A hand holding a glowing Litsaber"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
