"use client";

/**
 * Cloudflare Turnstile widget (explicit render).
 *
 * Renders the Turnstile challenge and hands the resulting single-use token to
 * the parent via onToken. The parent sends that token with the form POST; the
 * API route verifies it server-side (lib/security/turnstile.ts) before
 * forwarding to HubSpot.
 *
 * Site key: NEXT_PUBLIC_TURNSTILE_SITE_KEY. When the key is absent (local dev
 * without config), the widget renders nothing and the form falls back to the
 * server's fail-open path — so the form is never blocked by missing config.
 *
 * Tokens are single-use and expire (~5 min). Call reset() (exposed via ref)
 * after each submit so the next submission gets a fresh token.
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  theme?: "auto" | "light" | "dark";
  appearance?: "always" | "execute" | "interaction-only";
  action?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileRenderOptions) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("turnstile script failed to load"))
      );
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("turnstile script failed to load"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export interface TurnstileHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
  /**
   * "always" (default) renders the widget box up front. "interaction-only"
   * keeps it invisible for legit users and only surfaces a visible challenge
   * when Cloudflare requires one — use it on compact / high-conversion forms.
   */
  appearance?: "always" | "execute" | "interaction-only";
}

const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  function TurnstileWidget(
    { onToken, onExpire, onError, className, appearance = "always" },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      if (!sitekey) return;
      let cancelled = false;

      loadTurnstileScript()
        .then(() => {
          if (cancelled || !containerRef.current || !window.turnstile) return;
          if (widgetIdRef.current) return; // already rendered
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey,
            theme: "dark",
            appearance,
            callback: (token) => onToken(token),
            "expired-callback": () => onExpire?.(),
            "error-callback": () => onError?.(),
          });
        })
        .catch(() => onError?.());

      return () => {
        cancelled = true;
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
      // Callbacks are stable state setters from the parent; re-running on the
      // sitekey is sufficient and avoids re-rendering the widget on every keystroke.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sitekey]);

    if (!sitekey) return null;

    return <div ref={containerRef} className={className} />;
  }
);

export default TurnstileWidget;
