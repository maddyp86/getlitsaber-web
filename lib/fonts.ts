import localFont from "next/font/local";

// Every font is self-hosted so the build never fetches from Google Fonts
// (next/font/google failed Vercel builds when Google returned a bad response).
// Monoton, Orbitron, Inter and Space Mono are the Latin-subset woff2 files
// Google served for these weights (all SIL Open Font License). Orbitron and
// Inter are variable fonts: one file is declared at 400 and 700, as Google's
// CSS does, so in-between weights still snap instead of interpolating.

export const stellar = localFont({
  src: [
    { path: "../public/fonts/Stellar-light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Stellar-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Stellar-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Stellar-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-stellar",
  display: "swap",
  fallback: ["Arial", "system-ui", "sans-serif"],
});

export const monoton = localFont({
  src: [{ path: "../public/fonts/monoton-regular-latin.woff2", weight: "400", style: "normal" }],
  variable: "--font-monoton",
  display: "swap",
});

export const orbitron = localFont({
  src: [
    { path: "../public/fonts/orbitron-variable-latin.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/orbitron-variable-latin.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-orbitron",
  display: "swap",
});

export const inter = localFont({
  src: [
    { path: "../public/fonts/inter-variable-latin.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/inter-variable-latin.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const spaceMono = localFont({
  src: [
    { path: "../public/fonts/space-mono-regular-latin.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/space-mono-bold-latin.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-space-mono",
  display: "swap",
});
