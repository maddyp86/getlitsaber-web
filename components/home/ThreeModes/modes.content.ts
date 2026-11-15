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
    body: "Every breath triggers a unique light pattern in your chosen color. The lights are wired to you: breathe in, and the device responds in real time.",
    image: mediaUrl("home/litsaber_mode_poster.jpg"),
    video: videoUrl("home/litsaber_mode_v2.mp4"),
  },
  {
    title: "GLOWSTICK MODE",
    titleColor: "muted",
    body: "Turn up the party and turn the device into a glowstick. Give someone a light show, or find your way in the dark.",
    image: mediaUrl("home/glowstick_mode_poster.jpg"),
    video: videoUrl("home/glowstick_mode_v2_full.mp4"),
  },
  {
    title: "STEALTH MODE",
    titleColor: "muted",
    body: "When daylight comes, give your eyes and battery a break. Turn off the lights to save power and use it quietly through the day.",
    image: mediaUrl("home/stealth_mode_poster.jpg"),
    video: videoUrl("home/stealth_mode.mp4"),
  },
];

export const PULL_BUILD = [
  {
    label: "THE BREATH",
    description:
      "Every breath triggers a unique light pattern in your chosen color. The lights are wired to you. Breathe in, and the device responds in real time.",
    video: videoUrl("home/litsaber_mode_v2.mp4"),
    image: mediaUrl("home/litsaber_mode_poster.jpg"),
  },
  {
    label: "THE BUILD",
    description:
      "Every 510 battery has a cutoff on a long breath. Litsaber turns that cutoff into a rainbow strobe, the signature moment hidden inside the safety floor.",
    video: videoUrl("home/litsaber-mode-build.mp4"),
    image: mediaUrl("home/litsaber_mode_build_poster.jpg"),
  },
];
