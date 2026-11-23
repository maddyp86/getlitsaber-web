"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track, EVENTS } from "@/lib/analytics/events";
import type { BarMessage, BarSegment } from "@/lib/campaign/types";

const ROTATE_MS = 5000;

// The whole line is one colour: accent flags in the config are not styled.
function lineText(segments: BarSegment[]): string {
  return segments.map((s) => s.text).join("");
}

interface AnnouncementBarProps {
  phaseId: string;
  messages: BarMessage[];
  href: string;
}

/**
 * Sitewide campaign bar, fixed above the navbar. Copy and schedule come from
 * the campaign config (lib/campaign); the server picks the phase and this only
 * rotates its messages. The bar's height is reserved by `--announce-h`
 * (app/globals.css), set whenever the bar is rendered, so nothing shifts.
 */
export default function AnnouncementBar({ phaseId, messages, href }: AnnouncementBarProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;
    // Reduced motion: the first message stays up and nothing rotates.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % messages.length),
      ROTATE_MS
    );
    return () => window.clearInterval(id);
  }, [messages.length]);

  const current = messages[active] ?? messages[0];
  if (!current) return null;

  return (
    <Link
      href={href}
      data-testid="announcement-bar"
      onClick={() =>
        track(EVENTS.announcement_bar_click, { phase: phaseId, message_id: current.id })
      }
      className="fixed top-0 inset-x-0 z-navbar h-[var(--announce-h)] bg-holiday-bar font-label font-bold uppercase text-holiday-bar-ink text-[12px] sm:text-[15px] tracking-[0.12em] overflow-hidden"
    >
      {messages.map((m, i) => (
        <span
          key={m.id}
          aria-hidden={i !== active}
          className={`absolute inset-0 flex items-center justify-center px-3 whitespace-nowrap transition-opacity duration-500 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="sm:hidden">
            {lineText(m.mobile ?? m.desktop)}
          </span>
          <span className="hidden sm:inline">
            {lineText(m.desktop)}
          </span>
        </span>
      ))}
    </Link>
  );
}
