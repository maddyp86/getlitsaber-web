/**
 * Decorative glow pools behind the upper half of the page. Radial gradients
 * rather than blurred solids: same look, no filter cost on scroll.
 * Purely presentational, no motion, so it stays a server component.
 */
export default function AffiliatesAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-[200px] -right-[120px] h-[620px] w-[620px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.16) 0%, rgba(0,229,255,0.05) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[620px] -left-[200px] h-[460px] w-[460px]"
        style={{
          background:
            "radial-gradient(circle, rgba(236,87,147,0.14) 0%, rgba(236,87,147,0.04) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[320px] -right-[260px] h-[720px] w-[720px]"
        style={{
          background:
            "radial-gradient(circle, rgba(157,95,255,0.14) 0%, rgba(157,95,255,0.04) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
