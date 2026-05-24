import Image from "next/image";
import { EYEBROW, HEADLINE, SUBCOPY, EDITIONS } from "./editions.content";

export default function EditionsSection() {
  return (
    <section id="editions">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <p className="font-label text-eyebrow text-text-accent tracking-widest mb-3">
            {EYEBROW}
          </p>
          <h2
            className="font-display font-bold text-h1 text-white uppercase text-center mb-4"
            style={{ textShadow: "0 0 50px rgba(0, 229, 255, 0.75)", lineHeight: "normal" }}
          >
            {HEADLINE}
          </h2>
          <p className="font-body text-body-sm lg:text-body text-text-secondary max-w-lg mx-auto">
            {SUBCOPY}
          </p>
        </div>

        {/* Cards grid — Figma: 1300px wide, gap 50px, height 406px */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-[50px]">
          {EDITIONS.map((edition) => (
            <div
              key={edition.id}
              className="flex flex-col justify-between p-[30px]"
              style={{
                background: "#111026",
                border: `1px solid ${edition.cardBorderColor}`,
              }}
            >
              {/* Top: text group */}
              <div className="flex flex-col gap-[10px]">
                {/* Badge */}
                <div
                  className="flex items-center justify-center gap-[10px] self-start"
                  style={{
                    height: "37px",
                    padding: "0 20px",
                    border: `1px solid ${edition.badgeBorderColor}`,
                  }}
                >
                  <span
                    className="font-label text-label uppercase"
                    style={{ color: edition.badgeTextColor }}
                  >
                    {edition.badge}
                  </span>
                </div>

                {/* Title — Monoton, 35px, white */}
                <h3
                  className="font-accent text-white uppercase"
                  style={{ fontSize: "35px", fontWeight: 400, lineHeight: "normal" }}
                >
                  {edition.title}
                </h3>

                {/* Edition line — Inter 16px #CCC */}
                <p
                  className="font-body text-label uppercase"
                  style={{ color: "#CCCCCC" }}
                >
                  {edition.editionLine}
                </p>

                {/* Descriptor line — Inter 16px, #CCC or pink accent */}
                <p
                  className="font-body text-label font-medium uppercase"
                  style={{ color: edition.descriptorAccent ? "#CCCCCC" : "#CCCCCC" }}
                >
                  {edition.descriptorLine}
                </p>
              </div>

              {/* Bottom: CTA group */}
              <div
                className="flex items-center justify-between pt-4 mt-6"
                style={{ borderTop: "1px solid rgba(136, 136, 136, 0.3)" }}
              >
                <span
                  className="font-body text-label font-medium uppercase"
                  style={{ color: edition.ctaColor }}
                >
                  {edition.actionLabel}
                </span>
                <Image
                  src={edition.arrowSrc}
                  alt=""
                  width={20}
                  height={27}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
