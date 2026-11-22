"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track, EVENTS } from "@/lib/analytics/events";
import type { BarMessage, BarSegment } from "@/lib/campaign/types";

const ROTATE_MS = 5000;

function Segments({ segments }: { segments: BarSegment[] }) {
  return (
    <>
      {segments.map((s, i) =>
        s.accent ? (
          <span key={i} className="text-accent-cyan">
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        )
      )}
    </>
  );
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
      className="fixed top-0 inset-x-0 z-navbar h-[var(--announce-h)] bg-background-primary border-b border-accent-cyan shadow-glow-bar font-label uppercase text-text-primary text-[11px] sm:text-[13px] tracking-[0.14em] overflow-hidden"
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
            <Segments segments={m.mobile ?? m.desktop} />
          </span>
          <span className="hidden sm:inline">
            <Segments segments={m.desktop} />
          </span>
        </span>
      ))}
    </Link>
  );
}
