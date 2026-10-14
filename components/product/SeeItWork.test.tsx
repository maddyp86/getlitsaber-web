import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";

vi.mock("@/lib/analytics/events", () => ({ track: vi.fn(), EVENTS: new Proxy({}, { get: (_t, key) => key }) }));

import SeeItWork from "./SeeItWork";

afterEach(cleanup);

describe("PDP Three modes", () => {
  it("shows each mode with its copy and poster, before any video loads", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }));
    render(<SeeItWork />);
    const section = within(screen.getByTestId("see-it-work"));
    expect(section.getByRole("heading", { level: 3 }).textContent).toBe("Three modes");
    expect(section.getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual([
      "LITSABER MODE",
      "GLOWSTICK MODE",
      "STEALTH MODE",
    ]);
    expect(section.getByAltText("Litsaber in glowstick mode")).toBeTruthy();
    // jsdom has no IntersectionObserver here, so clips mount at once; each is
    // muted, looping, inline and hidden from assistive tech.
    const videos = document.querySelectorAll("video");
    expect(videos).toHaveLength(3);
    videos.forEach((v) => {
      expect(v.muted).toBe(true);
      expect(v.loop).toBe(true);
      expect(v.hasAttribute("playsinline")).toBe(true);
      expect(v.getAttribute("aria-hidden")).toBe("true");
    });
    vi.unstubAllGlobals();
  });

  it("keeps the still poster for reduced-motion visitors", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }));
    render(<SeeItWork />);
    expect(document.querySelectorAll("video")).toHaveLength(0);
    expect(screen.getAllByRole("img")).toHaveLength(3);
    vi.unstubAllGlobals();
  });

  it("has no em-dash or exclamation mark in the mode copy", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }));
    const { container } = render(<SeeItWork />);
    expect(container.textContent).not.toMatch(/[—!]/);
    vi.unstubAllGlobals();
  });
});
