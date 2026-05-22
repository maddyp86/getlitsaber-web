import localFont from "next/font/local";
import { Monoton, Orbitron, Inter, Space_Mono } from "next/font/google";

export const stellar = localFont({
  src: [
    { path: "../public/fonts/Stellar-light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Stellar-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Stellar-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Stellar-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-stellar",
  display: "swap",
  fallback: ["Arial Black", "system-ui", "sans-serif"],
});

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
