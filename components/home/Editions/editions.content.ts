export const EYEBROW = "EDITIONS";
export const HEADLINE = "WHAT WE'RE SHIPPING";
export const SUBCOPY =
  "See what's available and what's to drop soon in our inventory";

export type AccentColor = "cyan" | "magenta" | "purple";

export interface Edition {
  id: string;
  badge: string;
  accentColor: AccentColor;
  title: string;
  editionLine: string;
  descriptorLine: string;
  actionLabel: string;
}

export const EDITIONS: Edition[] = [
  {
    id: "og-silver",
    badge: "/ LIVE NOW",
    accentColor: "cyan",
    title: "OG SILVER",
    editionLine: "EDITION 01  |  5,000 UNITS",
    descriptorLine: "SHIPS IN 24HRS",
    actionLabel: "SHOP NOW",
  },
  {
    id: "gold-edition",
    badge: "/ DROPS IN JUNE",
    accentColor: "magenta",
    title: "GOLD EDITION",
    editionLine: "EDITION 02  |  1,000 UNITS",
    descriptorLine: "FESTIVAL SEASON COLORWAY",
    actionLabel: "JOIN THE WAITLIST",
  },
  {
    id: "future-drops",
    badge: "/ COMING SOON",
    accentColor: "purple",
    title: "FUTURE DROPS",
    editionLine: "EDITION 03+ TBD",
    descriptorLine: "LITSABER CONNECT, ALL IN ONE",
    actionLabel: "GET NOTIFIED",
  },
];
