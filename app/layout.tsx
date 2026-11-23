import type { Metadata } from "next";
import "./globals.css";
import { stellar, monoton, orbitron, inter, spaceMono } from "@/lib/fonts";
import SiteChrome from "@/components/layout/SiteChrome";
import PostHogProvider from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import JudgemeScripts from "@/components/reviews/JudgemeScripts";
import MetaPixel from "@/components/analytics/MetaPixel";
import { headers } from "next/headers";
import { HYDRATION_ERROR_HEAD_SCRIPT } from "@/lib/analytics/hydration";
import { REVIEWS_ENABLED } from "@/lib/reviews";
import { getActiveCampaign } from "@/lib/campaign/getActiveCampaign";
import { activeBarPhase } from "@/lib/campaign/runtime";
import CampaignProvider from "@/lib/campaign/CampaignProvider";

export const metadata: Metadata = {
  title: {
    default: "Litsaber — The Interactive 510 Battery",
    template: "%s | Litsaber",
  },
  icons: {
    icon: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/global/litsaber-icon-white.png",
    shortcut: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/global/litsaber-icon-white.png",
    apple: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/global/litsaber-icon-white.png",
  },
  description:
    "An interactive 510 battery built for festivals, nightlife, and the moments worth being lit for.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://getlitsaber.com"
  ),
  openGraph: {
    siteName: "Litsaber",
    type: "website",
    locale: "en_US",
  },
  // Meta Business Manager domain verification (added 2026-11-15 for the ad
  // launch). It renders as a static <meta> in <head> on every page, which is
  // what Meta's crawler needs; a tag injected by JavaScript fails the check.
  verification: {
    other: {
      "facebook-domain-verification": "god5r5emem549zmxkwfoeqic2xcg90",
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let suppressChrome = false;
  try {
    suppressChrome = headers().get("x-maintenance-mode") === "1";
  } catch {
    suppressChrome = false;
  }
  // Holiday (or regular) site: one decision per request, shared with every
  // client component through CampaignProvider. Null renders the regular site.
  const campaign = suppressChrome ? null : await getActiveCampaign();
  const barPhase = campaign ? activeBarPhase(campaign) : null;
  return (
    <html
      lang="en"
      // Browser extensions and third-party scripts can add attributes to
      // <html> before hydration.
      suppressHydrationWarning
      className={[
        stellar.variable,
        monoton.variable,
        orbitron.variable,
        inter.variable,
        spaceMono.variable,
      ].join(" ")}
    >
      <head>
        {/* Buffers React hydration errors, which fire before any effect runs
            (lib/analytics/hydration.ts); HydrationErrorTracker reports them. */}
        <script dangerouslySetInnerHTML={{ __html: HYDRATION_ERROR_HEAD_SCRIPT }} />
        {/* No preconnect to the PostHog host: PostHog now starts after the page
            settles (app/providers.tsx), so an early connection sat unused and
            PageSpeed flagged it. */}
      </head>
      <body
        className="font-body bg-background-primary text-text-primary antialiased"
        // Reserves the campaign bar's height (app/globals.css) before paint.
        data-announce={barPhase ? "" : undefined}
      >
        {/* Meta Pixel: renders nothing unless NEXT_PUBLIC_META_PIXEL_ID is set. */}
        <MetaPixel />
        {/* Judge.me only loads while reviews are shown (lib/reviews.ts). */}
        {REVIEWS_ENABLED && <JudgemeScripts />}
        <PostHogProvider>
          <CampaignProvider campaignId={campaign?.id ?? null}>
            <SiteChrome
              suppressChrome={suppressChrome}
              barPhase={barPhase}
              barHref={campaign?.href}
            >
              {children}
            </SiteChrome>
          </CampaignProvider>
        </PostHogProvider>
           <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
