"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Preview-only tap timing readout, for profiling on a real phone (roadmap
 * phase 3, iPhone Safari). Open a preview URL with ?perf=1 and every tap shows
 * its INP breakdown: input delay, handler processing, presentation. Copy puts
 * the log on the clipboard to paste into a report.
 *
 * Never renders in production: it needs NEXT_PUBLIC_VERCEL_ENV === "preview"
 * (set by Vercel on preview builds) or a local dev server.
 */

const ENABLED =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || process.env.NODE_ENV === "development";
const STORAGE_KEY = "litsaber_perf_overlay";
const MAX_ROWS = 12;

// interactionId is not in this TypeScript version's DOM lib.
type EventTimingEntry = PerformanceEventTiming & { interactionId?: number };

interface Row {
  id: number;
  name: string;
  target: string;
  total: number;
  delay: number;
  processing: number;
  presentation: number;
}

function describe(node: EventTarget | null): string {
  if (!(node instanceof Element)) return "(none)";
  // The control around the tapped node (an img inside the zoom button names
  // the button), else the media or role element itself.
  const el = node.closest("button, a, input, select, [role=radio]") ?? node.closest("video, img, [role]") ?? node;
  const label = el.getAttribute("aria-label") || el.getAttribute("data-testid") || el.textContent?.trim().slice(0, 30) || "";
  return `${el.tagName.toLowerCase()}${label ? ` "${label.slice(0, 40)}"` : ""}`;
}

export default function InteractionTimings() {
  const [on, setOn] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [copied, setCopied] = useState(false);
  // Targets recorded when the event fires, keyed by event timeStamp (equal to
  // the timing entry's startTime): a control that removes itself on tap, like
  // the lightbox close button, leaves the entry with a null target.
  const targets = useRef(new Map<number, string>());

  useEffect(() => {
    if (!ENABLED) return;
    try {
      const param = new URLSearchParams(window.location.search).get("perf");
      if (param === "1") sessionStorage.setItem(STORAGE_KEY, "1");
      if (param === "0") sessionStorage.removeItem(STORAGE_KEY);
      setOn(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setOn(new URLSearchParams(window.location.search).get("perf") === "1");
    }
  }, []);

  useEffect(() => {
    if (!on || typeof PerformanceObserver === "undefined") return;
    const remember = (e: Event) => {
      targets.current.set(Math.round(e.timeStamp), describe(e.target));
      if (targets.current.size > 200) targets.current.delete(targets.current.keys().next().value as number);
    };
    const types = ["pointerdown", "pointerup", "click", "keydown"];
    types.forEach((t) => window.addEventListener(t, remember, { capture: true, passive: true }));

    const byInteraction = new Map<number, Row>();
    const observer = new PerformanceObserver((list) => {
      let changed = false;
      for (const entry of list.getEntries() as EventTimingEntry[]) {
        if (!entry.interactionId) continue;
        const row: Row = {
          id: entry.interactionId,
          name: entry.name,
          target: entry.target ? describe(entry.target) : (targets.current.get(Math.round(entry.startTime)) ?? "(removed)") + " [removed]",
          total: Math.round(entry.duration),
          delay: Math.round(entry.processingStart - entry.startTime),
          processing: Math.round(entry.processingEnd - entry.processingStart),
          presentation: Math.round(entry.startTime + entry.duration - entry.processingEnd),
        };
        const prev = byInteraction.get(row.id);
        if (!prev || row.total > prev.total || (row.total === prev.total && row.processing > prev.processing)) {
          byInteraction.set(row.id, row);
          changed = true;
        }
      }
      if (changed) setRows(Array.from(byInteraction.values()).sort((a, b) => b.id - a.id).slice(0, MAX_ROWS));
    });
    try {
      observer.observe({ type: "event", durationThreshold: 16, buffered: true } as PerformanceObserverInit);
    } catch {
      return;
    }
    return () => {
      observer.disconnect();
      types.forEach((t) => window.removeEventListener(t, remember, { capture: true }));
    };
  }, [on]);

  if (!on) return null;

  const copy = async () => {
    const text = [
      navigator.userAgent,
      location.pathname,
      ...rows.map((r) => `${r.total}ms  delay ${r.delay}  proc ${r.processing}  pres ${r.presentation}  ${r.name}  ${r.target}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy the timings:", text);
    }
  };

  return (
    <div
      // Under the navbar, clear of the sticky buy bar. Records taps, never
      // intercepts them outside its own buttons.
      className="fixed left-2 top-navbar z-toast w-[min(360px,calc(100vw-16px))] rounded-md bg-black text-white font-mono text-[10px] leading-tight p-2 pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-accent-cyan">tap timings (ms) · {typeof PerformanceObserver !== "undefined" && PerformanceObserver.supportedEntryTypes?.includes("event") ? "Event Timing" : "Event Timing unsupported"}</span>
        <span className="flex gap-1 pointer-events-auto">
          <button type="button" onClick={copy} className="px-2 py-1 rounded bg-white/15">{copied ? "copied" : "copy"}</button>
          <button type="button" onClick={() => setRows([])} className="px-2 py-1 rounded bg-white/15">clear</button>
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="text-white/60">Tap something. Taps under 16 ms are not listed.</p>
      ) : (
        rows.map((r) => (
          <p key={r.id} className={r.total >= 200 ? "text-cta" : ""}>
            <b>{r.total}</b> = {r.delay} + {r.processing} + {r.presentation} · {r.target}
          </p>
        ))
      )}
    </div>
  );
}
