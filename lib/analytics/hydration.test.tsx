import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import {
  HYDRATION_ERROR_EVENT,
  HYDRATION_ERROR_HEAD_SCRIPT,
  hydrationErrorCode,
  isHydrationErrorMessage,
} from "./hydration";

import HydrationErrorTracker from "@/components/analytics/HydrationErrorTracker";

const { track } = vi.hoisted(() => ({ track: vi.fn() }));
vi.mock("@/lib/analytics/events", () => ({
  track,
  EVENTS: { hydration_failed: "hydration_failed" },
}));

const REACT_418 =
  "Minified React error #418; visit https://react.dev/errors/418 for the full message";
const REACT_423 =
  "Minified React error #423; visit https://react.dev/errors/423 for the full message";

function fireWindowError(message: string) {
  window.dispatchEvent(new ErrorEvent("error", { message }));
}

beforeEach(() => {
  delete window.__hydrationErrors;
  track.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("hydration error detection", () => {
  it("recognises React's production codes and development wording", () => {
    expect(isHydrationErrorMessage(REACT_418)).toBe(true);
    expect(isHydrationErrorMessage("Uncaught Error: " + REACT_423)).toBe(true);
    expect(isHydrationErrorMessage("Hydration failed because the initial UI does not match")).toBe(true);
    expect(isHydrationErrorMessage("Minified React error #31; objects are not valid")).toBe(false);
    expect(isHydrationErrorMessage("TypeError: undefined is not an object")).toBe(false);
  });

  it("extracts the code, or 'dev' for a development message", () => {
    expect(hydrationErrorCode(REACT_418)).toBe("418");
    expect(hydrationErrorCode("Hydration failed")).toBe("dev");
  });
});

describe("head script", () => {
  it("buffers hydration errors and announces them, ignoring other errors", () => {
    const onEvent = vi.fn();
    window.addEventListener(HYDRATION_ERROR_EVENT, onEvent);
    try {
      new Function(HYDRATION_ERROR_HEAD_SCRIPT)();
      fireWindowError("TypeError: not ours");
      fireWindowError(REACT_418);
      expect(window.__hydrationErrors).toEqual([REACT_418]);
      expect(onEvent).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener(HYDRATION_ERROR_EVENT, onEvent);
    }
  });
});

describe("HydrationErrorTracker", () => {
  it("reports errors buffered before mount, then later ones, once per code", () => {
    window.__hydrationErrors = [REACT_418, REACT_418];
    const { unmount } = render(<HydrationErrorTracker />);
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith("hydration_failed", {
      code: "418",
      message: REACT_418,
    });

    act(() => {
      window.dispatchEvent(new CustomEvent(HYDRATION_ERROR_EVENT, { detail: REACT_423 }));
      window.dispatchEvent(new CustomEvent(HYDRATION_ERROR_EVENT, { detail: REACT_423 }));
    });
    expect(track).toHaveBeenCalledTimes(2);
    expect(track).toHaveBeenLastCalledWith("hydration_failed", {
      code: "423",
      message: REACT_423,
    });

    unmount();
    act(() => {
      window.dispatchEvent(new CustomEvent(HYDRATION_ERROR_EVENT, { detail: REACT_418 }));
    });
    expect(track).toHaveBeenCalledTimes(2);
  });
});
