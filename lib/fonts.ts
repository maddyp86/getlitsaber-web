import { Monoton, Orbitron, Inter, Space_Mono } from "next/font/google";

// Stellar (display font) — paid license held by Innovape
// Drop the file at public/fonts/Stellar.woff2, uncomment the localFont block below,
// and remove the CSS variable override in globals.css.
//
// import localFont from "next/font/local";
// export const stellar = localFont({
//   src: "../public/fonts/Stellar.woff2",
//   variable: "--font-stellar",
//   display: "swap",
//   fallback: ["system-ui", "Arial Black", "sans-serif"],
// });

export const monoton = Monoton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-monoton",
  display: "swap",
});

export const orbitron = Orbitron({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});
