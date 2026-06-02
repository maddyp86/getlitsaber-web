"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Edition } from "./editions.content";
import { useModalActions } from "@/lib/ui/store";

type Props = Pick<
  Edition,
  | "id"
  | "badge"
  | "badgeBorderColor"
  | "badgeTextColor"
  | "cardBorderColor"
  | "cardBorderColorResting"
  | "hoverGlowRgb"
  | "title"
  | "editionLine"
  | "descriptorLine"
  | "actionLabel"
  | "ctaColor"
  | "arrowSrc"
  | "action"
>;

export default function EditionCard({
  badge,
  badgeBorderColor,
  badgeTextColor,
  cardBorderColor,
  cardBorderColorResting,
  hoverGlowRgb,
  title,
  editionLine,
  descriptorLine,
  actionLabel,
  ctaColor,
  arrowSrc,
  action,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const { openModal } = useModalActions();

  const cardStyle = {
    background: "#111026",
    border: `1px solid ${hovered ? cardBorderColor : cardBorderColorResting}`,
    boxShadow: hovered
      ? `inset 0 0 60px rgba(${hoverGlowRgb}, 0.08), inset 0 0 20px rgba(${hoverGlowRgb}, 0.06)`
      : "none",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
  };

  const inner = (
    <>
      {/* Top: text group */}
      <div className="flex flex-col gap-[15px]">
        {/* Badge */}
        <div
          className="flex items-center justify-center gap-[10px] self-start"
          style={{
            height: "37px",
            padding: "0 20px",
            border: `1px solid ${badgeBorderColor}`,
          }}
        >
          <span
            className="font-label text-label uppercase"
            style={{ color: badgeTextColor, fontSize: "12px" }}
          >
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-accent text-white uppercase"
          style={{ fontSize: "35px", fontWeight: 400, lineHeight: "1.1" }}
        >
          {title}
        </h3>

        {/* Edition line */}
        <p className="font-body text-label uppercase" style={{ color: "#CCCCCC" }}>
          {editionLine}
        </p>

        {/* Descriptor line */}
        <p className="font-body text-label font-medium uppercase" style={{ color: "#CCCCCC" }}>
          {descriptorLine}
        </p>
      </div>

      {/* Bottom: CTA */}
      <div
        className="pt-4 mt-6"
        style={{ borderTop: "1px solid rgba(136, 136, 136, 0.3)" }}
      >
        <div className="flex items-center justify-between w-full">
          <span
            className="font-body text-label font-medium uppercase"
            style={{ color: ctaColor }}
          >
            {actionLabel}
          </span>
          <Image src={arrowSrc} alt="" width={20} height={27} />
        </div>
      </div>
    </>
  );

  if (action.type === "link") {
    return (
      <Link
        href={action.href}
        className="flex flex-col justify-between p-[30px] hover:opacity-90 transition-opacity"
        style={cardStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openModal(action.name)}
      className="flex flex-col justify-between p-[30px] text-left w-full hover:opacity-90 transition-opacity"
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </button>
  );
}
