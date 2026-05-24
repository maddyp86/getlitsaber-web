import type { ReactNode } from "react";

interface Section6Props {
  children: ReactNode;
}

export default function Section6({ children }: Section6Props) {
  return (
    <section
      className="relative py-section-y-mobile lg:py-section-y px-container-mobile lg:px-container"
      style={{
        background:
          "linear-gradient(180deg, rgba(18,8,32,0.75) 0%, rgba(15,8,36,0.75) 61.06%, rgba(45,28,83,0.75) 96.63%), #0A0518",
        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* TODO: <Starfield /> — section-scoped animated canvas layer, Phase Motion */}

      <div className="relative z-base mx-auto flex w-full max-w-[1250px] flex-col gap-section-y-mobile lg:gap-section-y">
        {children}
      </div>
    </section>
  );
}
