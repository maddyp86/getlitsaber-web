"use client";

import Image from "next/image";
import Link from "next/link";
import type { EditionAction } from "./editions.content";
import { useModalActions } from "@/lib/ui/store";

interface EditionActionButtonProps {
  action: EditionAction;
  label: string;
  ctaColor: string;
  arrowSrc: string;
  visualOnly?: boolean;
}

export default function EditionActionButton({
  action,
  label,
  ctaColor,
  arrowSrc,
  visualOnly,
}: EditionActionButtonProps) {
  const { openModal } = useModalActions();

  const inner = (
    <>
      <span
        className="font-body text-label font-medium uppercase"
        style={{ color: ctaColor }}
      >
        {label}
      </span>
      <Image src={arrowSrc} alt="" width={20} height={27} />
    </>
  );

  if (action.type === "link") {
    return (
      <Link
        href={action.href}
        className="flex items-center justify-between w-full hover:opacity-80 transition-opacity"
      >
        {inner}
      </Link>
    );
  }

  if (visualOnly) {
    return (
      <div className="flex items-center justify-between w-full">
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openModal(action.name)}
      className="flex items-center justify-between w-full hover:opacity-80 transition-opacity"
    >
      {inner}
    </button>
  );
}
