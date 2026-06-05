// ─── Image — Journey band ────────────────────────────────────────────────────
export const BAND_IMAGE_SRC = "mages/about/litsaber-assembly.jpg";
export const BAND_IMAGE_ALT = "Litsaber components laid out for assembly";

// ─── Images — Hero ───────────────────────────────────────────────────────────
export const HERO_IMAGE_SRC = "/images/about/comiccon-about-us.jpg";
export const HERO_IMAGE_ALT = "Matt and Brendan at ComicCon 2025";

// ─── Images — Team ───────────────────────────────────────────────────────────
export const MATT_HEADSHOT_SRC = "/images/about/matt-headshot.jpg";
export const BRENDAN_HEADSHOT_SRC = "/images/about/brendan-headshot.jpg";

// ─── Images — Prototype Timeline ─────────────────────────────────────────────
export const PROTOTYPE_2019_SRC = "/images/about/prototype-image-2019.jpg";
export const PROTOTYPE_2020_SRC = "/images/about/prototype-image-2020.jpg";
export const PROTOTYPE_2021_SRC = "/images/about/prototype-image-2021.jpg";
export const PROTOTYPE_2022_SRC = "/images/about/prototype-image-2022.jpg";
export const PROTOTYPE_2023_SRC = "/images/about/prototype-image-2023.jpg";
export const PROTOTYPE_2024_SRC = "/images/about/prototype-image-2024.jpg";

// ─── Images — Manufacturing Gallery ──────────────────────────────────────────
export const PRODUCTION_IMAGES = [
  { src: "/images/about/litsaber-production-01.jpg", alt: "Litsaber production — step 1" },
  { src: "/images/about/litsaber-production-02.jpg", alt: "Litsaber production — step 2" },
  { src: "/images/about/litsaber-production-03.jpg", alt: "Litsaber production — step 3" },
  { src: "/images/about/litsaber-production-04.jpg", alt: "Litsaber production — step 4" },
  { src: "/images/about/litsaber-production-05.jpg", alt: "Litsaber production — step 5" },
  { src: "/images/about/litsaber-production-06.jpg", alt: "Litsaber production — step 6" },
  { src: "/images/about/litsaber-production-07.jpg", alt: "Litsaber production — step 7" },
  { src: "/images/about/litsaber-production-08.jpg", alt: "Litsaber production — step 8" },
  { src: "/images/about/litsaber-production-09.jpg", alt: "Litsaber production — step 9" },
  { src: "/images/about/litsaber-production-10.jpg", alt: "Litsaber production — step 10" },
] as const;

// ─── Images — Manufacturing band ─────────────────────────────────────────────
export const MFG_BAND_SRC = "/images/about/collage-litsaber-about.jpg";
export const MFG_BAND_ALT = "Litsaber devices glowing on a surface";

// ─── Images — Now / Events ───────────────────────────────────────────────────
export const EVENT_IMAGES = [
  { src: "/images/about/starwars-hollywood-bowl.jpg", alt: "Litsaber at Star Wars Night — Hollywood Bowl" },
  { src: "/images/about/mjbizcon-litsaber-booth.jpg", alt: "Litsaber booth at MJBizCon" },
  { src: "/images/about/mjbizcon-afterparty.jpg", alt: "MJBizCon afterparty with Litsaber" },
  { src: "/images/about/legacy-expo-litsaber.jpg", alt: "Litsaber at Legacy Expo" },
] as const;

// ─── Section 1 — Hero ────────────────────────────────────────────────────────
export const HERO_EYEBROW = "OUR STORY";
export const HERO_HEADLINE_LINE1 = "BUILT FOR THE NIGHT YOU CAME TO";
export const HERO_HEADLINE_ACCENT = "BE A PART OF.";
export const HERO_BODY =
  "A small family team in Los Angeles. Six years of engineering. One vape battery that actually gets noticed. Not for being first to the party. For being the reason people remembered they showed up.";
export const HERO_CTA = "LEARN MORE";

// ─── Section 2 — Origin ──────────────────────────────────────────────────────
export const ORIGIN_EYEBROW = "/ 01 — ORIGIN";
export const ORIGIN_HEADLINE = "It started with a question.";
export const ORIGIN_BODY_INTRO =
  "In 2020, the two of us were hanging out one night. Brendan was a raver, deep in the lightshow community, and on this particular night he'd lost his vape. So he picked up his LED glowsticks and started waving them around. Improvised a lightshow with what was in his hand. Then he asked the question.";
export const ORIGIN_PULLQUOTE = "What if you could";
export const ORIGIN_PULLQUOTE_ACCENT = "smoke a glowstick?";
export const ORIGIN_PULLQUOTE_ATTRIBUTION = "Brendan Friedrich, 2020";
export const ORIGIN_BODY_CLOSING =
  "We'd been thinking about hardware for a while. Matt had four years in consumer electronics, including a smart fashion accessory called Locket, and factory connections in China. We knew this was buildable. What we didn't know was how long it would take to get it right.";

// ─── Section 3 — Team ────────────────────────────────────────────────────────
export const TEAM_EYEBROW = "/ 02 — THE TEAM";
export const TEAM_HEADLINE = "Two of us. Two roles.";
export const TEAM_INTRO =
  "Matt and Brendan are cousins. We're a small family-owned company headquartered in Los Angeles, operating under Innovape Concepts. Litsaber is our first product.";

export interface TeamMember {
  name: string;
  role: string;
  roles: string[];
  bio: string;
  imageSrc: string;
  imageAlt: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Matthew Hall",
    role: "Co-Founder",
    roles: ["MARKETING", "PRODUCT", "OPERATIONS"],
    bio: "Matt runs business operations, go-to-market, and product direction. He spent four years in consumer electronics before Litsaber, learning what makes hardware stick and what makes it disappear. He's also the one managing the factory relationship, the wholesale accounts, and the day-to-day.",
    imageSrc: MATT_HEADSHOT_SRC,
    imageAlt: "Matthew Hall, co-founder of Litsaber",
  },
  {
    name: "Brendan Friedrich",
    role: "Co-Founder",
    roles: ["R&D", "SALES", "BD", "FINANCE"],
    bio: "Brendan is the origin of the idea, the technical mind behind the hardware, and a fixture in the lightshow and festival community where Litsaber lives. He's the one at every show. He's the one who talked to thousands of people before we sold a single unit, asking what they actually wanted.",
    imageSrc: BRENDAN_HEADSHOT_SRC,
    imageAlt: "Brendan Friedrich, co-founder of Litsaber",
  },
];

// ─── Section 4 — Journey ─────────────────────────────────────────────────────
export const JOURNEY_EYEBROW = "/ 03 — THE JOURNEY";
export const JOURNEY_HEADLINE = "It took longer than we thought.";
export const JOURNEY_BODY_INTRO =
  "Honestly, building hardware is hard. We went through six prototypes over six years. Each one worked. Each one had a reason it wasn't ready yet. We went through multiple factories, multiple suppliers. We wanted to make something that would hold up at a show, charge fast, and look like it was designed to be held.";
export const JOURNEY_BODY_CLOSING =
  "COVID hit in the middle of it all. Factory access shut down. Shipping timelines fell apart. We kept iterating anyway, remotely, on a device we couldn't physically touch for months. Eventually we found the partner who could build it right.";

export interface Prototype {
  version: string;
  title: string;
  blurb: string;
  year: string;
  imageSrc: string;
  imageAlt: string;
}

export const PROTOTYPES: Prototype[] = [
  {
    version: "V1",
    title: "V1: The Concept",
    blurb: "A highlighter was our inspiration.",
    year: "2019",
    imageSrc: PROTOTYPE_2019_SRC,
    imageAlt: "Litsaber V1 prototype — 2019",
  },
  {
    version: "V2",
    title: "V2: Proof of Concept",
    blurb: "Figuring out form factor and the overall look.",
    year: "2020",
    imageSrc: PROTOTYPE_2020_SRC,
    imageAlt: "Litsaber V2 prototype — 2020",
  },
  {
    version: "V3",
    title: "V3: First Cart Mount",
    blurb: "New industrial design with 3D-printed parts.",
    year: "2021",
    imageSrc: PROTOTYPE_2021_SRC,
    imageAlt: "Litsaber V3 prototype — 2021",
  },
  {
    version: "V4",
    title: "V4: Looks Like",
    blurb: "First CNC'd looks-like prototype with real materials.",
    year: "2022",
    imageSrc: PROTOTYPE_2022_SRC,
    imageAlt: "Litsaber V4 prototype — 2022",
  },
  {
    version: "V5",
    title: "V5: Working LEDs",
    blurb: "First time the lights came on with working vape functions.",
    year: "2023",
    imageSrc: PROTOTYPE_2023_SRC,
    imageAlt: "Litsaber V5 prototype — 2023",
  },
  {
    version: "V6",
    title: "V6: Pre-Production",
    blurb: "Our redesigned, ready-to-manufacture unit.",
    year: "2024",
    imageSrc: PROTOTYPE_2024_SRC,
    imageAlt: "Litsaber V6 pre-production — 2024",
  },
];

// ─── Section 5 — Manufacturing ───────────────────────────────────────────────
export const MFG_EYEBROW = "/ 04 — MANUFACTURING";
export const MFG_HEADLINE_PART1 = "Designed in LA. Built by ";
export const MFG_HEADLINE_ACCENT = "DOPEX";
export const MFG_BODY =
  "Litsaber is designed and engineered in LA and SF. The hardware is manufactured by **DOPEX**, a premium cannabis vaporization solutions provider based in Shenzhen, China. **DOPEX is one of the most established vape hardware manufacturers in the industry.** They build to spec, they ship on time, and they hold to the kind of quality control that lets us put our name on every unit that comes out.";
export const DOPEX_CARD_EYEBROW = "— OUR MANUFACTURING PARTNER";
export const DOPEX_CARD_NAME = "DOPEX";
export const DOPEX_CARD_BODY =
  "Premium cannabis vaporization solutions provider. Based in Shenzhen, China, with a US office in Walnut, CA.";
export const DOPEX_CARD_LINK = "www.dopex.com";
export const DOPEX_CARD_HREF = "https://www.dopex.com";

// ─── Section 6 — Now ─────────────────────────────────────────────────────────
export const NOW_EYEBROW = "/ 05 — WHERE WE ARE NOW";
export const NOW_HEADLINE = "Iterating in public.";
export const NOW_BODY =
  "**Gold Edition launches summer of 2026.** Festivals, events, the cannabis circuit. This year the calendar gets full through summer and beyond. We're doing every major show we can get into. The Jack Herer Experience party-bus roadshow is putting the device in front of thousands of qualified buyers across California.\n\nFuture drops are in development. Deeper lighting modes are on the roadmap. New colorways, new editions, new collaborations planned. The hardware platform we've been building for six years isn't done. It's just getting started.\n\nIt's still the two of us, as a small family team in LA, building something we wanted to exist.";
export const NOW_WILD_EYEBROW = "OUT IN THE WILD";

// ─── Section 7 — Closing CTA ─────────────────────────────────────────────────
export const CLOSING_HEADLINE_PART1 = "MADE IN LOS ANGELES,";
export const CLOSING_HEADLINE_ACCENT = "BY PEOPLE WHO SHOW UP.";
export const CLOSING_BODY =
  "Litsaber ships from Los Angeles, backed by a 30-day guarantee and same-day fulfillment. We're a small company that makes one product. We'd love for you to have it.";
export const CLOSING_CTA_PRIMARY = "GET YOURS";
export const CLOSING_CTA_PRIMARY_HREF = "/shop/litsaber-og";
export const CLOSING_CTA_SECONDARY = "GET IN TOUCH";
export const CLOSING_CTA_SECONDARY_HREF = "/contact";