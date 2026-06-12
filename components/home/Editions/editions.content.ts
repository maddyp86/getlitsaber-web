import type { ModalName } from "@/lib/ui/store";
import { mediaUrl } from "@/lib/media";

export const EYEBROW = "EDITIONS";
export const HEADLINE = "WHAT WE'RE SHIPPING";
export const SUBCOPY =
  "See what's available and what's to drop soon in our inventory";

export type EditionAction =
  | { type: "link"; href: string }
  | { type: "modal"; name: ModalName };

export interface Edition {
  id: string;
  badge: string;
  badgeBorderColor: string;
  badgeTextColor: string;
  /** Full-saturation border color shown on hover */
  cardBorderColor: string;
  /** Reduced-opacity border color shown at rest */
  cardBorderColorResting: string;
  /** RGB values for the inset glow on hover, e.g. "0, 229, 255" */
  hoverGlowRgb: string;
  title: string;
  editionLine: string;
  descriptorLine: string;
  descriptorAccent: boolean;
  actionLabel: string;
  ctaColor: string;
  arrowSrc: string;
  action: EditionAction;
}

export const EDITIONS: Edition[] = [
  {
    id: "og-silver",
    badge: "/ LIVE NOW",
    badgeBorderColor: "#00E5FF",
    badgeTextColor: "#00E5FF",
    cardBorderColor: "#00E5FF",
    cardBorderColorResting: "rgba(0, 229, 255, 0.20)",
    hoverGlowRgb: "0, 229, 255",
    title: "OG SILVER",
    editionLine: "EDITION 01  |  5,000 UNITS",
    descriptorLine: "SHIPS IN 24HRS",
    descriptorAccent: false,
    actionLabel: "SHOP NOW",
    ctaColor: "#00E5FF",
    arrowSrc: mediaUrl("icons/arrow-right-cyan.png"),
    action: { type: "link", href: "/shop/litsaber-og" },
  },
  {
    id: "gold-edition",
    badge: "/ DROPS IN JUNE",
    badgeBorderColor: "#EB3E7C",
    badgeTextColor: "#EB3E7C",
    cardBorderColor: "#EB3E7C",
    cardBorderColorResting: "rgba(235, 62, 124, 0.20)",
    hoverGlowRgb: "235, 62, 124",
    title: "GOLD EDITION",
    editionLine: "EDITION 02  |  1,000 UNITS",
    descriptorLine: "FESTIVAL SEASON COLORWAY",
    descriptorAccent: true,
    actionLabel: "JOIN THE WAITLIST",
    ctaColor: "#EC5793",
    arrowSrc: mediaUrl("icons/arrow-right-pink.png"),
    action: { type: "modal", name: "gold" },
  },
  {
    id: "future-drops",
    badge: "/ COMING SOON",
    badgeBorderColor: "#9764F7",
    badgeTextColor: "#9764F7",
    cardBorderColor: "#9764F7",
    cardBorderColorResting: "rgba(151, 100, 247, 0.20)",
    hoverGlowRgb: "151, 100, 247",
    title: "FUTURE DROPS",
    editionLine: "EDITION 03+ TBD",
    descriptorLine: "LITSABER CONNECT, ALL IN ONE",
    descriptorAccent: true,
    actionLabel: "GET NOTIFIED",
    ctaColor: "#828282",
    arrowSrc: mediaUrl("icons/arrow-right-grey.png"),
    action: { type: "modal", name: "general" },
  },
];
