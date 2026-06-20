import { mediaUrl, videoUrl } from "@/lib/media";

export interface Mode {
  title: string;
  titleColor: "white" | "muted";
  body: string;
  image: string;
  video: string;
}

export const MODES: Mode[] = [
  {
    title: "LITSABER MODE",
    titleColor: "white",
    body: "Each pull triggers a unique light pattern in your chosen color. The lights are wired to your breath — pull, and the device responds in real time.",
    image: mediaUrl("home/litsaber_mode_poster.jpg"),
    video: videoUrl("home/litsaber_mode.mp4"),
  },
  {
    title: "GLOWSTICK MODE",
    titleColor: "muted",
    body: "Turn up the party and turn your vape into a glowstick. Use the Litsaber and give someone a light show or even find things in the dark.",
    image: mediaUrl("home/glowstick_mode_poster.jpg"),
    video: videoUrl("home/glowstick_mode.mp4"),
  },
  {
    title: "STEALTH MODE",
    titleColor: "muted",
    body: "When daylight comes give your eyes and battery a break. Turn off the lights to save power and vape discreetly throughout day.",
    image: mediaUrl("home/stealth_mode_poster.jpg"),
    video: videoUrl("home/stealth_mode.mp4"),
  },
];

export const PULL_BUILD = [
  {
    label: "THE PULL",
    description:
      "Each pull triggers a unique light pattern in your chosen color. The lights are wired to your breath. Pull, and the device responds in real time.",
    video: videoUrl("home/litsaber_mode.mp4"),
    image: mediaUrl("home/litsaber_mode_poster.jpg"),
  },
  {
    label: "THE BUILD",
    description:
      "Every device has a max draw. Litsaber turns the cutoff into a rainbow strobe — our signature performance moment hidden inside the safety floor.",
    video: videoUrl("home/litsaber-mode-build.mp4"),
    image: mediaUrl("home/litsaber_mode_build_poster.jpg"),
  },
];
