import { mediaUrl } from "@/lib/media";

export interface Stage {
  eyebrow: string;
  headline: string;
  body: string;
  desktopImg: string;
  mobileImg: string;
}

export const STAGES: Stage[] = [
  {
    eyebrow: "THE LIFESTYLE",
    headline: "BE SEEN ACROSS THE CROWD",
    body: "Most batteries hide in your pocket. Litsaber is the thing the stranger across the bar walks over to ask about. The first thing your friend's friend notices. The conversation that starts before the cart does and keeps going long after.",
    desktopImg: mediaUrl("home/litsaber-festival.jpg"),
    mobileImg: mediaUrl("home/litsaber-festival-mobile.jpg"),
  },
  {
    eyebrow: "THE INTERACTION",
    headline: "LIGHTSHOW. SEARCH PARTY. WALK HOME.",
    body: "Lightshow gear at the headliner. The flare you raise when your friend's looking for you in the crowd. The flashlight on the walk back. 41 individually-addressable LEDs trusted by performers and the friend everyone's trying to find.",
    desktopImg: mediaUrl("home/litsaber-interaction.jpg"),
    mobileImg: mediaUrl("home/litsaber-interaction-mobile.jpg"),
  },
  {
    eyebrow: "THE ENDURANCE",
    headline: "BUILT TO OUTLAST THE NIGHT",
    body: "Aluminum and brass on top. Polycarbonate and reinforced foam below. Faceted edges that won't roll off the bar. Drop-resistant grip you can trust at 3 AM. Made for the headliner, the afters, and the next weekend after that.",
    desktopImg: mediaUrl("home/litsaber-endurance.jpg"),
    mobileImg: mediaUrl("home/litsaber-endurance-mobile.jpg"),
  },
];
