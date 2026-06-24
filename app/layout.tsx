import type { Metadata } from "next";
import "./globals.css";
import { stellar, monoton, orbitron, inter, spaceMono } from "@/lib/fonts";
import SiteChrome from "@/components/layout/SiteChrome";
import PostHogProvider from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import JudgemeScripts from "@/components/reviews/JudgemeScripts";
import { headers } from "next/headers";

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
    "A glowstick that hits 510 carts. Built for festivals, nightlife, and the moments worth being lit for.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://getlitsaber.com"
  ),
  openGraph: {
    siteName: "Litsaber",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
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
  return (
    <html
      lang="en"
      className={[
        stellar.variable,
        monoton.variable,
        orbitron.variable,
        inter.variable,
        spaceMono.variable,
      ].join(" ")}
    >
      <body className="font-body bg-background-primary text-text-primary antialiased">
        <JudgemeScripts />
        <PostHogProvider>
          <SiteChrome suppressChrome={suppressChrome}>{children}</SiteChrome>
        </PostHogProvider>
           <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
