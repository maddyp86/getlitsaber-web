import { SECTION_IDS } from "@/content/activate.content";

export default function ActivateQuickStart() {
  return (
    <section
      id={SECTION_IDS.quickStart}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y"
    >
      <div className="mx-auto w-full max-w-content px-content">
        <h2 className="font-display font-bold uppercase text-text-primary" style={{ fontSize: "clamp(32px, 4vw, 55px)" }}>
          Quick Start
        </h2>
        {/* TODO: build in follow-up prompt */}
      </div>
    </section>
  );
}
