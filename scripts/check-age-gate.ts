// Browser check for the age gate's confirm button against a running site.
//
//   pnpm build && pnpm start            # in one terminal
//   pnpm check-age-gate                 # http://localhost:3000
//   pnpm check-age-gate https://<preview>.vercel.app
//
// Needs Playwright with Chromium (`npx playwright install chromium`); it is
// not a project dependency. Each case loads the homepage with an iPhone
// profile, taps "I AM 21+" and expects the gate to close and the cookie to be
// set:
//
//   clean           a normal load
//   prepended-node  an element inserted at the top of <body> before React
//                   hydrates, as content blockers, translation and
//                   accessibility tools do. React 18 then rebuilds the page
//                   on the client, which replaced the confirm button with one
//                   that had no handler (visitors locked out 2026-10-17 and
//                   2026-10-29). The delegated handler must still confirm,
//                   and the head script must have recorded the hydration
//                   error for analytics.
//   from-exempt     land on /activate (no gate), navigate client-side into
//                   the store: the controller shows the gate, and a tap on
//                   the same (never inline-bound) button must close it.

import { createRequire } from "node:module";

type Chromium = {
  launch(): Promise<{
    newContext(o: object): Promise<{
      newPage(): Promise<Page>;
      close(): Promise<void>;
    }>;
    close(): Promise<void>;
  }>;
};
type Page = {
  addInitScript(script: string): Promise<void>;
  goto(url: string, o: object): Promise<unknown>;
  waitForTimeout(ms: number): Promise<void>;
  tap(selector: string, o: object): Promise<void>;
  evaluate<T>(fn: () => T): Promise<T>;
  waitForFunction(fn: () => unknown, arg?: unknown, o?: object): Promise<unknown>;
};

type NextWindow = Window & { next?: { router?: { push(path: string): void } } };

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

const PREPEND_NODE = `document.addEventListener("DOMContentLoaded", function () {
  var d = document.createElement("div"); d.id = "injected-by-extension";
  document.body.insertBefore(d, document.body.firstChild);
});`;

function probe() {
  const gate = document.getElementById("age-gate");
  return {
    gateClosed: !!gate && getComputedStyle(gate).display === "none",
    cookieSet: /litsaber_age_verified=true/.test(document.cookie),
    hydrationErrors: (window.__hydrationErrors ?? []).length,
  };
}

async function main() {
  let chromium: Chromium;
  let devices: Record<string, object>;
  try {
    ({ chromium, devices } = createRequire(import.meta.url)("playwright"));
  } catch {
    console.error("playwright is not installed: npm i -g playwright && npx playwright install chromium");
    process.exit(2);
  }
  const browser = await chromium.launch();
  const failures: string[] = [];
  const cases: Array<{ name: string; init?: string; fromExempt?: boolean; expectHydrationError?: boolean }> = [
    { name: "clean" },
    { name: "prepended-node", init: PREPEND_NODE, expectHydrationError: true },
    { name: "from-exempt", fromExempt: true },
  ];
  for (const c of cases) {
    const ctx = await browser.newContext({ ...devices["iPhone 13"] });
    const page = await ctx.newPage();
    if (c.init) await page.addInitScript(c.init);
    await page.goto(`${BASE}${c.fromExempt ? "/activate" : "/"}`, { waitUntil: "load", timeout: 60_000 });
    await page.waitForTimeout(3000); // let hydration (and any fallback) finish
    if (c.fromExempt) {
      await page.evaluate(() => (window as NextWindow).next?.router?.push("/"));
      await page.waitForFunction(
        () => location.pathname === "/" && !document.documentElement.hasAttribute("data-age-ok"),
        undefined,
        { timeout: 15_000 }
      );
    }
    await page.tap("[data-age-confirm]", { timeout: 5000 });
    await page.waitForTimeout(500);
    const result = await page.evaluate(probe);
    const problems: string[] = [];
    if (!result.gateClosed) problems.push("gate did not close");
    if (!result.cookieSet) problems.push("cookie not set");
    if (c.expectHydrationError && result.hydrationErrors === 0) {
      problems.push("no hydration error recorded (was the page rebuilt on the client?)");
    }
    console.log(`${problems.length ? "FAIL" : "ok  "} ${c.name.padEnd(15)} ${JSON.stringify(result)}`);
    if (problems.length) failures.push(`${c.name}: ${problems.join(", ")}`);
    await ctx.close();
  }
  await browser.close();
  if (failures.length) {
    console.error(`\n${failures.length} case(s) failed:\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
  console.log("\nAge gate confirm works in every case.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
