export interface Mode {
  title: string;
  titleColor: "white" | "muted";
  body: string;
  image: string;
}

export const MODES: Mode[] = [
  {
    title: "LITSABER MODE",
    titleColor: "white",
    body: "Each pull triggers a unique light pattern in your chosen color. The lights are wired to your breath — pull, and the device responds in real time.",
    image: "/images/home/mode-placeholder.jpg",
  },
  {
    title: "GLOWSTICK MODE",
    titleColor: "muted",
    body: "Turn up the party and turn your vape into a glowstick. Use the Litsaber and give someone a light show or even find things in the dark.",
    image: "/images/home/mode-placeholder.jpg",
  },
  {
    title: "STEALTH MODE",
    titleColor: "muted",
    body: "When daylight comes give your eyes and battery a break. Turn off the lights to save power and vape discreetly throughout day.",
    image: "/images/home/mode-placeholder.jpg",
  },
];

export const PULL_BUILD = [
  {
    label: "THE PULL",
    description:
      "Each pull triggers a unique light pattern in your chosen color. The lights are wired to your breath. Pull, and the device responds in real time.",
  },
  {
    label: "THE BUILD",
    description:
      "Every device has a max draw. Litsaber turns the cutoff into a rainbow strobe — our signature performance moment hidden inside the safety floor.",
  },
];
