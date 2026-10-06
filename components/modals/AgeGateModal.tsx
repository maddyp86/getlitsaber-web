import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import { AGE_GATE_EXIT_URL, ageGateBodyScript } from "@/lib/ageGate";

/**
 * 21+ age gate. Server-rendered so it is in the first paint for every visitor
 * who has not confirmed; a <head> script hides it before paint for verified
 * visitors and exempt paths (fail-closed). The inline script below handles
 * confirm without waiting for hydration, and AgeGateController keeps it in
 * sync on client-side navigation. Requirement, confirmation and the 30-day
 * cookie are unchanged.
 */
export default function AgeGateModal() {
  return (
    <>
    <div
      id="age-gate"
      suppressHydrationWarning
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-body"
      className="fixed inset-0 z-age-gate items-center justify-center lg:p-container-mobile"
      style={{ backgroundColor: "rgba(5, 5, 16, 0.80)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      {/* Modal panel — full screen on mobile, card on desktop */}
      <div className="age-gate-panel relative w-full flex flex-col items-center justify-center text-center lg:rounded-card"
        style={{
          paddingTop: "50px",
          paddingBottom: "40px",
          paddingLeft: "33px",
          paddingRight: "33px",
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            .age-gate-panel {
              max-width: 450px;
              background: rgba(5, 5, 16, 0.60);
              border: 1px solid rgba(0, 229, 255, 0.20);
              box-shadow: 0 0 20px 0 rgba(0, 229, 255, 0.05) inset;
              backdrop-filter: blur(6px);
              -webkit-backdrop-filter: blur(6px);
            }
          }
          .age-gate-confirm, .age-gate-exit {
            /* Kill the mobile tap delay and give an immediate pressed state so a
               tap that is still being processed (busy main thread during
               hydration) feels acknowledged instead of dead, curbing re-taps. */
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          .age-gate-confirm {
            background: #050510;
            border: 1px solid #00E5FF;
            color: #00E5FF;
            transition: background 0.2s ease, color 0.2s ease, transform 0.05s ease;
          }
          .age-gate-confirm:hover {
            background: #00E5FF;
            color: #050510;
          }
          .age-gate-confirm:active,
          .age-gate-confirm[data-pressed] {
            background: #00E5FF;
            color: #050510;
            transform: scale(0.98);
          }
          .age-gate-exit {
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: 1px solid rgba(240, 240, 245, 0.20);
            color: #F0F0F5;
            transition: border-color 0.2s ease, transform 0.05s ease;
          }
          .age-gate-exit:hover {
            border-color: rgba(240, 240, 245, 1);
          }
          .age-gate-exit:active {
            border-color: rgba(240, 240, 245, 1);
            transform: scale(0.98);
          }
        `}</style>

        {/* Logo */}
        <div className="mb-md">
          <Image
            src={mediaUrl("global/litsaber-blue.png")}
            alt="Litsaber"
            width={125}
            height={40}
            style={{ width: "125px", height: "auto" }}
          />
        </div>

        {/* Headline */}
        <h1
          id="age-gate-title"
          className="font-display font-bold text-text-primary uppercase mb-md"
          style={{ fontSize: "35px", lineHeight: "36px" }}
        >
          You must be 21+<br />to enter
        </h1>

        {/* Body */}
        <p
          id="age-gate-body"
          className="font-body mb-lg"
          style={{
            color: "rgba(240, 240, 245, 0.70)",
            fontSize: "14px",
            lineHeight: "20px",
          }}
        >
          This website contains products intended for adults only.<br />
          By entering, you confirm you are of legal age.
        </p>

        {/* Confirm button */}
        <button
          type="button"
          data-age-confirm
          suppressHydrationWarning
          className="age-gate-confirm w-full font-label tracking-widest uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan mb-md"
          style={{
            maxWidth: "382px",
            height: "58px",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          I AM 21+
        </button>

        {/* Exit: a plain link, so it works before any script runs */}
        <a
          href={AGE_GATE_EXIT_URL}
          data-age-exit
          className="age-gate-exit w-full font-label tracking-widest uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-text-muted"
          style={{
            maxWidth: "382px",
            height: "58px",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          EXIT
        </a>
      </div>
    </div>
    {/* Confirm works from first paint, before React hydrates (lib/ageGate.ts). */}
    <script dangerouslySetInnerHTML={{ __html: ageGateBodyScript() }} />
    </>
  );
}
