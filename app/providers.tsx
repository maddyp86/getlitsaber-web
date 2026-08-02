"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import type { CaptureResult } from "posthog-js";

declare global {
  interface Window {
    posthog?: typeof posthog;
  }
}

/**
 * Drop opaque cross-origin "Script error." exceptions.
 *
 * When a script loaded from another origin without CORS throws, the browser
 * masks the detail and hands the error handler only the string "Script error."
 * with no stack. posthog-js captures this as a synthetic, unhandled $exception
 * with an empty stack trace. It carries no actionable detail (no message, no
 * frames, no file/line), so it is pure triage noise in error tracking. The PDP
 * loads several such cross-origin scripts (Judge.me, Turnstile, Shopify,
 * HubSpot) without a crossorigin attribute, which is where these originate.
 *
 * This filters only the detail-less case: a synthetic exception whose value is
 * "Script error." and which has no stack frames. A real error that happens to
 * mention "Script error." keeps its stack and is not dropped.
 */
function dropOpaqueScriptErrors(
  event: CaptureResult | null
): CaptureResult | null {
  if (!event || event.event !== "$exception") return event;

  const exceptions = event.properties?.$exception_list;
  if (!Array.isArray(exceptions) || exceptions.length === 0) return event;

  const allOpaque = exceptions.every((exception) => {
    const value =
      typeof exception?.value === "string" ? exception.value.trim() : "";
    const isScriptError = value === "Script error." || value === "Script error";
    const isSynthetic = exception?.mechanism?.synthetic === true;
    const frames = exception?.stacktrace?.frames;
    const hasNoStack = !Array.isArray(frames) || frames.length === 0;
    return isScriptError && isSynthetic && hasNoStack;
  });

  return allOpaque ? null : event;
}

/**
 * Drop exceptions thrown by an injected in-app browser bridge, not our code.
 *
 * Meta's in-app browsers (Instagram, Facebook) inject their own script that
 * posts to a native handler on pagehide via `window.webkit.messageHandlers`.
 * On iOS that handler is not always present, so the injected script throws
 * `TypeError: undefined is not an object (evaluating
 * 'window.webkit.messageHandlers')` from its `sendPageHideMessage` /
 * `sendDataToNative` functions. The injected script has no source URL, so the
 * browser attributes the frames to our document and posthog-js's global
 * onerror captures it as one of ours. Nothing breaks for the visitor — the
 * message just fails silently — but it clutters error tracking, and Instagram
 * link-in-bio is a live acquisition channel so it keeps recurring.
 *
 * This matches narrowly: the exact `window.webkit.messageHandlers` message,
 * plus a stack whose named frames are only the known bridge functions (any
 * other frame must be anonymous). None of these function names exist anywhere
 * in this codebase, so a real first-party error cannot match.
 */
const IN_APP_BROWSER_BRIDGE_FUNCTIONS = new Set([
  "sendDataToNative",
  "sendPageHideMessage",
]);

function dropInAppBrowserBridgeErrors(
  event: CaptureResult | null
): CaptureResult | null {
  if (!event || event.event !== "$exception") return event;

  const exceptions = event.properties?.$exception_list;
  if (!Array.isArray(exceptions) || exceptions.length === 0) return event;

  const allBridge = exceptions.every((exception) => {
    const value = typeof exception?.value === "string" ? exception.value : "";
    if (!value.includes("window.webkit.messageHandlers")) return false;

    const frames = exception?.stacktrace?.frames;
    if (!Array.isArray(frames) || frames.length === 0) return false;

    // Every named frame must be a known bridge function; other frames must be
    // anonymous (no function name). At least one bridge frame must be present.
    let hasBridgeFrame = false;
    const framesOk = frames.every((frame) => {
      const fn = typeof frame?.function === "string" ? frame.function : "";
      if (!fn || fn === "?") return true;
      if (IN_APP_BROWSER_BRIDGE_FUNCTIONS.has(fn)) {
        hasBridgeFrame = true;
        return true;
      }
      return false;
    });

    return framesOk && hasBridgeFrame;
  });

  return allBridge ? null : event;
}

function filterThirdPartyNoise(
  event: CaptureResult | null
): CaptureResult | null {
  const afterScriptErrors = dropOpaqueScriptErrors(event);
  return dropInAppBrowserBridgeErrors(afterScriptErrors);
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useEffect (not useLayoutEffect): PostHog init spins up autocapture, dead-click
  // capture, and session recording (rrweb), which observe the DOM and issue
  // network requests. Running that synchronously before first paint blocks the
  // main thread during hydration — exactly when a visitor makes their first tap
  // (age gate, nav, accordions), so that tap reads as a "dead click" until the
  // thread frees. Deferring to after paint lets those handlers respond promptly.
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
    if (typeof window === "undefined" || !token) return;

    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
      capture_dead_clicks: true,
      internal_or_test_user_hostname: /^(localhost|127\.0\.0\.1|.*\.vercel\.app)$/,
      before_send: filterThirdPartyNoise,
    });

    if (typeof window !== "undefined") {
      window.posthog = posthog;
      const INTERNAL_FLAG_TOKEN = process.env.NEXT_PUBLIC_INTERNAL_FLAG_TOKEN;
      const internalParam = new URLSearchParams(window.location.search).get("internal");
      if (INTERNAL_FLAG_TOKEN && internalParam === INTERNAL_FLAG_TOKEN) {
        posthog.setInternalOrTestUser();
      } else if (internalParam === "off") {
        posthog.setPersonProperties({ $internal_or_test_user: false });
      }
    }
  }, []);

  return <>{children}</>;
}
