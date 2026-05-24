export const EYEBROW = "EDITIONS";
export const HEADLINE = "WHAT WE'RE SHIPPING";
export const SUBCOPY =
  "See what's available and what's to drop soon in our inventory";

export interface Edition {
  id: string;
  badge: string;
  badgeBorderColor: string;
  badgeTextColor: string;
  cardBorderColor: string;
  title: string;
  editionLine: string;
  descriptorLine: string;
  descriptorAccent: boolean;
  actionLabel: string;
  ctaColor: string;
  arrowSrc: string;
}

export const EDITIONS: Edition[] = [
  {
    id: "og-silver",
    badge: "/ LIVE NOW",
    badgeBorderColor: "#00E5FF",
    badgeTextColor: "#00E5FF",
    cardBorderColor: "#00E5FF",
    title: "OG SILVER",
    editionLine: "EDITION 01  |  5,000 UNITS",
    descriptorLine: "SHIPS IN 24HRS",
    descriptorAccent: false,
    actionLabel: "SHOP NOW",
    ctaColor: "#00E5FF",
    arrowSrc: "/images/icons/arrow-right-cyan.png",
  },
  {
    id: "gold-edition",
    badge: "/ DROPS IN JUNE",
    badgeBorderColor: "#EB3E7C",
    badgeTextColor: "#EB3E7C",
    cardBorderColor: "#EB3E7C",
    title: "GOLD EDITION",
    editionLine: "EDITION 02  |  1,000 UNITS",
    descriptorLine: "FESTIVAL SEASON COLORWAY",
    descriptorAccent: true,
    actionLabel: "JOIN THE WAITLIST",
    ctaColor: "#EC5793",
    arrowSrc: "/images/icons/arrow-right-pink.png",
  },
  {
    id: "future-drops",
    badge: "/ COMING SOON",
    badgeBorderColor: "#9764F7",
    badgeTextColor: "#9764F7",
    cardBorderColor: "#4B2F81",
    title: "FUTURE DROPS",
    editionLine: "EDITION 03+ TBD",
    descriptorLine: "LITSABER CONNECT, ALL IN ONE",
    descriptorAccent: true,
    actionLabel: "GET NOTIFIED",
    ctaColor: "#828282",
    arrowSrc: "/images/icons/arrow-right-grey.png",
  },
];
