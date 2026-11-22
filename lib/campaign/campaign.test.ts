import { describe, expect, it } from "vitest";
import { resolveCampaign, switchKey } from "./resolve";
import { activeBarPhase, isWithinWindow } from "./runtime";
import { HOLIDAY_2026 } from "./holiday2026";

const on = async () => true;
const at = (iso: string) => new Date(iso);
const text = (segments: { text: string }[]) => segments.map((s) => s.text).join("");

describe("the holiday switch", () => {
  it("renders the holiday site when the switch is on, inside the window", async () => {
    expect(await resolveCampaign(on, at("2026-11-25T12:00:00-08:00"))).toBe(HOLIDAY_2026);
  });

  it("renders the regular site when the switch is off or unset", async () => {
    const now = at("2026-11-25T12:00:00-08:00");
    expect(await resolveCampaign(async () => false, now)).toBeNull();
    expect(await resolveCampaign(async () => undefined, now)).toBeNull();
    // Only a real boolean true counts; a stray string does not turn it on.
    expect(await resolveCampaign(async () => "true", now)).toBeNull();
  });

  it("fails closed to the regular site when the switch cannot be read", async () => {
    const broken = async () => {
      throw new Error("edge config unavailable");
    };
    expect(await resolveCampaign(broken, at("2026-11-25T12:00:00-08:00"))).toBeNull();
  });

  it("turns itself off after Dec 16, 11:59pm Pacific, with the switch still on", async () => {
    expect(await resolveCampaign(on, at("2026-12-16T23:59:59-08:00"))).toBe(HOLIDAY_2026);
    expect(await resolveCampaign(on, at("2026-12-17T00:00:00-08:00"))).toBeNull();
    expect(isWithinWindow(HOLIDAY_2026, at("2027-01-05T00:00:00-08:00"))).toBe(false);
  });

  it("uses a separate switch for preview deployments", () => {
    expect(switchKey("production")).toBe("holidayMode");
    expect(switchKey("preview")).toBe("holidayModePreview");
    expect(switchKey(undefined)).toBe("holidayModePreview");
  });
});

describe("announcement bar schedule (Pacific)", () => {
  it.each([
    ["2026-11-21T22:00:00-08:00", "A"],
    ["2026-11-30T23:59:59-08:00", "A"],
    ["2026-12-01T00:00:00-08:00", "C"],
    ["2026-12-12T23:59:59-08:00", "C"],
    ["2026-12-13T00:00:00-08:00", "D"],
    ["2026-12-14T23:59:59-08:00", "D"],
    ["2026-12-15T00:00:00-08:00", "E"],
    ["2026-12-16T23:59:59-08:00", "E"],
  ])("%s is phase %s", (iso, phase) => {
    expect(activeBarPhase(HOLIDAY_2026, at(iso))?.id).toBe(phase);
  });

  it("shows no bar from Dec 17", () => {
    expect(activeBarPhase(HOLIDAY_2026, at("2026-12-17T00:00:00-08:00"))).toBeNull();
  });

  it("has no gaps or overlaps between phases", () => {
    const phases = HOLIDAY_2026.bar.phases;
    for (let i = 1; i < phases.length; i++) {
      expect(phases[i].start).toBe(phases[i - 1].end);
    }
    expect(phases[phases.length - 1].end).toBe(HOLIDAY_2026.end);
  });

  it("keeps every phase to 1 to 3 messages with mobile lines under 40 characters", () => {
    for (const phase of HOLIDAY_2026.bar.phases) {
      expect(phase.messages.length).toBeGreaterThanOrEqual(1);
      expect(phase.messages.length).toBeLessThanOrEqual(3);
      for (const m of phase.messages) {
        expect(text(m.mobile ?? m.desktop).length, m.id).toBeLessThan(40);
      }
    }
  });

  it("makes no Christmas delivery claim in the final phase", () => {
    const last = HOLIDAY_2026.bar.phases.find((p) => p.id === "E");
    for (const m of last?.messages ?? []) {
      expect(text(m.desktop)).not.toMatch(/christmas/i);
    }
  });
});
