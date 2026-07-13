"use client";

import { useLayoutEffect } from "react";
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

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
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
      before_send: dropOpaqueScriptErrors,
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
