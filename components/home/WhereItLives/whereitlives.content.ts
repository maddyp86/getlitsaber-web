export const EYEBROW = "WHERE IT LIVES";

export const HEADLINE = "SAME DEVICE. EVERY ROOM YOU WALK INTO.";

export const BODY =
  "Built for rooms & spaces where everything fades into dark";

export interface VenueCard {
  label: string;
  imageSrc: string;
  alt: string;
}

export const VENUE_CARDS: VenueCard[] = [
  {
    label: "FESTIVALS",
    // TODO: replace placeholder
    imageSrc: "/images/home/mode-placeholder.jpg",
    alt: "Festival crowd with Litsaber lights",
  },
  {
    label: "RAVES",
    // TODO: replace placeholder
    imageSrc: "/images/home/mode-placeholder.jpg",
    alt: "Rave dance floor lit by Litsaber devices",
  },
  {
    label: "HOUSE PARTIES",
    // TODO: replace placeholder
    imageSrc: "/images/home/mode-placeholder.jpg",
    alt: "House party with Litsaber glow",
  },
  {
    label: "EVENTS",
    // TODO: replace placeholder
    imageSrc: "/images/home/mode-placeholder.jpg",
    alt: "Live event venue with Litsaber crowd",
  },
];
