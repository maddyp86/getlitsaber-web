import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AGE_CONFIRMED_EVENT,
  AGE_GATE_HEAD_SCRIPT,
  ageGateBodyScript,
  hasAgeCookie,
  isAgeGateExempt,
  isAgeVerified,
  readCookie,
} from "./ageGate";

const run = (code: string) => new Function(code)();

/** Make document.cookie throw, as it does in sandboxed or embedded views. */
function makeCookiesThrow() {
  Object.defineProperty(document, "cookie", {
    configurable: true,
    get() {
      throw new DOMException("cookies disabled", "SecurityError");
    },
    set() {
      throw new DOMException("cookies disabled", "SecurityError");
    },
  });
}
const restoreCookies = () => delete (document as { cookie?: string }).cookie;

function clearCookie() {
  document.cookie = "litsaber_age_verified=; max-age=0; path=/";
}

function mountGate() {
  document.body.innerHTML = `
    <div id="age-gate" role="dialog">
      <button type="button" data-age-confirm>I AM 21+</button>
      <a href="https://www.google.com" data-age-exit>EXIT</a>
    </div>`;
  run(ageGateBodyScript());
  return {
    gate: document.getElementById("age-gate")!,
    confirm: document.querySelector<HTMLButtonElement>("[data-age-confirm]")!,
    exit: document.querySelector<HTMLAnchorElement>("[data-age-exit]")!,
  };
}

beforeEach(() => {
  clearCookie();
  document.documentElement.removeAttribute("data-age-ok");
  document.documentElement.removeAttribute("data-age-gate");
  delete window.__ageGate;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("age gate helpers", () => {
  it("reads only an exact true cookie", () => {
    expect(hasAgeCookie("a=1; litsaber_age_verified=true")).toBe(true);
    expect(hasAgeCookie("litsaber_age_verified=false")).toBe(false);
    expect(hasAgeCookie("xlitsaber_age_verified=true")).toBe(false);
  });

  it("counts a confirmation on this page even without a cookie", () => {
    expect(isAgeVerified({ cookie: "", pathname: "/", confirmedAt: 1 })).toBe(true);
    expect(isAgeVerified({ cookie: "litsaber_age_verified=true", pathname: "/" })).toBe(true);
    expect(isAgeVerified({ cookie: "", pathname: "/activate" })).toBe(true);
  });

  it("stays fail-closed with no cookie, no exemption and no confirmation", () => {
    expect(isAgeVerified({ cookie: "", pathname: "/" })).toBe(false);
    expect(isAgeVerified({ cookie: "litsaber_age_verified=false", pathname: "/shop/litsaber-og" })).toBe(false);
  });

  it("reads an unreadable cookie as empty instead of throwing", () => {
    makeCookiesThrow();
    try {
      expect(readCookie()).toBe("");
    } finally {
      restoreCookies();
    }
  });

  it("exempts only the owner pages", () => {
    expect(isAgeGateExempt("/activate")).toBe(true);
    expect(isAgeGateExempt("/show-it-off")).toBe(true);
    expect(isAgeGateExempt("/")).toBe(false);
    expect(isAgeGateExempt("/shop/litsaber-og")).toBe(false);
  });
});

describe("head script", () => {
  it("leaves the gate up for an unverified visitor (fail-closed)", () => {
    run(AGE_GATE_HEAD_SCRIPT);
    expect(document.documentElement.hasAttribute("data-age-ok")).toBe(false);
  });

  it("hides the gate before paint for a verified visitor", () => {
    document.cookie = "litsaber_age_verified=true; path=/";
    run(AGE_GATE_HEAD_SCRIPT);
    expect(document.documentElement.hasAttribute("data-age-ok")).toBe(true);
  });
});

describe("inline confirm", () => {
  it("focuses the confirm button when the gate opens", () => {
    const { confirm } = mountGate();
    expect(document.activeElement).toBe(confirm);
  });

  it("acknowledges the press at once, sets the 30-day cookie, then closes", async () => {
    const { gate, confirm } = mountGate();
    const onConfirmed = vi.fn();
    window.addEventListener(AGE_CONFIRMED_EVENT, onConfirmed);

    confirm.dispatchEvent(new Event("pointerdown"));
    expect(confirm.hasAttribute("data-pressed")).toBe(true);

    confirm.click();
    expect(document.cookie).toContain("litsaber_age_verified=true");
    await new Promise((r) => setTimeout(r, 5));
    expect(document.documentElement.hasAttribute("data-age-ok")).toBe(true);
    expect(gate.getAttribute("aria-hidden")).toBe("true");
    expect(onConfirmed).toHaveBeenCalledTimes(1);
    window.removeEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
  });

  it("handles a double tap as one confirmation", async () => {
    const { confirm } = mountGate();
    const onConfirmed = vi.fn();
    window.addEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
    confirm.click();
    confirm.click();
    confirm.click();
    await new Promise((r) => setTimeout(r, 5));
    expect(onConfirmed).toHaveBeenCalledTimes(1);
    window.removeEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
  });

  it("still closes when the browser throws on cookies", async () => {
    const { gate, confirm } = mountGate();
    const onConfirmed = vi.fn();
    window.addEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
    makeCookiesThrow();
    try {
      confirm.click();
      await new Promise((r) => setTimeout(r, 5));
      expect(document.documentElement.hasAttribute("data-age-ok")).toBe(true);
      expect(gate.getAttribute("aria-hidden")).toBe("true");
      expect(onConfirmed).toHaveBeenCalledTimes(1);
    } finally {
      restoreCookies();
      window.removeEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
    }
  });

  it("closes again if the gate is shown after a confirmation, without a second event", async () => {
    const { confirm } = mountGate();
    const onConfirmed = vi.fn();
    window.addEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
    confirm.click();
    await new Promise((r) => setTimeout(r, 5));
    // Something shows the gate again (the old lockout: no cookie found).
    document.documentElement.removeAttribute("data-age-ok");
    confirm.click();
    await new Promise((r) => setTimeout(r, 5));
    expect(document.documentElement.hasAttribute("data-age-ok")).toBe(true);
    expect(onConfirmed).toHaveBeenCalledTimes(1);
    window.removeEventListener(AGE_CONFIRMED_EVENT, onConfirmed);
  });

  it("keeps Tab focus inside the gate while it is open", () => {
    const { confirm, exit } = mountGate();
    const tab = (shiftKey = false) =>
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey, bubbles: true }));
    tab();
    expect(document.activeElement).toBe(exit);
    tab();
    expect(document.activeElement).toBe(confirm);
    tab(true);
    expect(document.activeElement).toBe(exit);
  });

  it("shows the pressed state for keyboard confirmation", () => {
    const { confirm } = mountGate();
    confirm.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(confirm.hasAttribute("data-pressed")).toBe(true);
  });

  it("exit is a plain link to the safe destination", () => {
    const { exit } = mountGate();
    expect(exit.getAttribute("href")).toBe("https://www.google.com");
  });
});
