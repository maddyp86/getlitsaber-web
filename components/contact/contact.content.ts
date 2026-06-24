// ─── Hero ─────────────────────────────────────────────────────────────────────
export const HERO_HEADLINE_LINE1 = "HOW CAN WE";
export const HERO_HEADLINE_ACCENT = "HELP!";
export const HERO_BODY =
  "Reach us directly, or find an answer below. We're a small team in LA. We read every message and reply within 24 hours.";

// ─── Contact Methods ──────────────────────────────────────────────────────────
export interface ContactMethod {
  icon: "email" | "phone" | "chat";
  label: string;
  value: string;
  description: string;
  badge?: string;
}

export const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: "email",
    label: "EMAIL",
    value: "info@getlitsaber.com",
    description: "For orders, support, wholesale, and press. Replies within 24 hours.",
  },
  {
    icon: "phone",
    label: "PHONE",
    value: "(949) 420-9171",
    description: "Mon–Fri, 9am–6pm PT. Voicemail any time.",
  },
  {
    icon: "chat",
    label: "CHAT WITH US",
    value: "",
    description: "Quick answers on activation, modes, and troubleshooting.",
    badge: "COMING SOON",
  },
];

// ─── Quick Links ──────────────────────────────────────────────────────────────
export interface QuickLink {
  label: string;
  href: string;
    external?: boolean;
}

export const QUICK_LINKS: QuickLink[] = [
  { label: "Track Order", href: "https://account.getlitsaber.com/orders", external: true },
  { label: "Start a Return", href: "https://checkout.getlitsaber.com/apps/return_prime", external: true },
  { label: "Shipping & Returns", href: "/policies/refunds" },
  { label: "Warranty", href: "/policies/warranty" },
  { label: "Terms of Service", href: "/policies/terms" },
  { label: "Privacy Policy", href: "/policies/privacy" },
];

// ─── Contact Form ─────────────────────────────────────────────────────────────
export const FORM_HEADLINE = "SEND US A MESSAGE";
export const FORM_SUBHEAD = "We respond within 24 hours, usually faster.";
export const FORM_REASON_OPTIONS = [
  "Order Issue",
  "Product Support",
  "Content Creator / Collaboration",
  "Wholesale / Retail Inquiry",
  "Press / Media",
  "General Question",
  "Other",
] as const;

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const FAQ_HEADLINE_PART1 = "Common";
export const FAQ_HEADLINE_ACCENT = "Questions";
export const FAQ_SUBHEAD =
  "Answers to the questions we hear most. If you don't see yours, send us a message.";

export type FaqAnswerPart =
  | { type: "paragraph"; text: string }
  | { type: "ordered-list"; items: string[] };

export interface FaqItem {
  question: string;
  answer: FaqAnswerPart[];
  defaultOpen?: boolean;
}

export interface FaqCategory {
  index: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    index: "/01",
    title: "CARTS & PERFORMANCE",
    items: [
      {
        question: "My cart isn't hitting well. What can I try?",
        defaultOpen: true,
        answer: [
          { type: "paragraph", text: "Try these in order:" },
          {
            type: "ordered-list",
            items: [
              "Back off a quarter to half turn. Our 510 connection is engineered for broad compatibility, with a center pin depth tested at a midpoint that works for most carts. Some carts (especially deeper-pin formats) hit cleanest when threaded back a quarter to half turn from fully tightened. Try this first.",
              "Try a different voltage. 2.4V (green) for rosin and live resin. 2.8V (blue) for cured resin and hybrids. 3.2V (red) for distillate and liquid diamonds. Mismatched voltage is a common cause of weak hits.",
              "Check the cart and battery. Make sure the cart is properly seated. Make sure your battery is charged (press the button 4 times quickly to check).",
              "Try a different cart. If the issue persists with a different cart that's known to work, contact us. It may be a device issue.",
            ],
          },
        ],
      },
      {
        question: "What carts work with Litsaber?",
        answer: [
          {
            type: "paragraph",
            text: "Litsaber's 510 connection is engineered for 95 to 99% cartridge compatibility across the major brands. We support standard 510-thread cartridges from 10.5mm to 14.5mm diameter. Half-gram, full-gram, and 2g carts all fit.",
          },
          {
            type: "paragraph",
            text: "Our center pin depth (4.0mm) is set at a tested midpoint that accommodates the full range of cart designs, from shallower-pin carts to deeper-pin formats. Because cart manufacturers vary in pin protrusion, some carts hit cleanest when threaded back a quarter to half turn from fully tightened. That's the inherent tradeoff of designing for broad compatibility rather than optimizing for one brand.",
          },
        ],
      },
      {
        question: "My cart is leaking. Is that the device?",
        answer: [
          {
            type: "paragraph",
            text: "Leaking is almost always cart-related, not device-related. A few things to check:",
          },
          {
            type: "ordered-list",
            items: [
              "Store the device upright when not in use. Carts can leak when stored on their side or upside down.",
              "Don't overtighten. Over-tightening can crack cart seals.",
              "Check the cart itself. Some carts leak straight from the dispensary due to manufacturing variability. Try a fresh cart.",
              "Avoid temperature extremes. Heat (a hot car) thins the oil and increases leaking.",
            ],
          },
          {
            type: "paragraph",
            text: "If oil has leaked into the 510 connection, clean it with a dry cotton swab. Avoid liquid cleaners.",
          },
        ],
      },
    ],
  },
  {
    index: "/02",
    title: "BATTERY & CHARGING",
    items: [
      {
        question: "How long does the battery last?",
        answer: [
          {
            type: "paragraph",
            text: "Litsaber has an 800mAh battery built from a 10500 pure cobalt cell (2 x 400mAh). On a full charge, it's built to run the headliner, the afters, and the cab home. Most users get a full festival night out of one charge depending on use.",
          },
          {
            type: "paragraph",
            text: "Battery lifespan is 1 to 1.5 years with 300+ recharge cycles. That's roughly a full year of festivals before you'd notice any drop in performance.",
          },
          {
            type: "paragraph",
            text: "To check the current charge level, press the button 4 times quickly. LED segments light up to indicate remaining battery, then return to your current mode after 3 seconds.",
          },
        ],
      },
      {
        question: "How long does it take to charge?",
        answer: [
          {
            type: "paragraph",
            text: "Full charge in under 75 minutes via USB-C. The LEDs animate during charging. You'll see a breathing light pattern. When fully charged, the LEDs dim until you unplug.",
          },
          {
            type: "paragraph",
            text: "Use any standard USB-C cable and a 5V/1A wall adapter or higher. No proprietary connectors. One cable for everything.",
          },
        ],
      },
      {
        question: "My battery isn't charging or charges slowly.",
        answer: [
          {
            type: "ordered-list",
            items: [
              "Try a different USB-C cable. Some cables are data-only or low-amperage and don't deliver full charging current.",
              "Try a different wall adapter. A standard 5V/1A or higher adapter is required. Some PC USB ports under-deliver.",
              "Check the port. Use a dry cotton swab to clear any debris from the USB-C port. Don't use liquid cleaners.",
              "Watch for the breathing LED. If the LED isn't animating when plugged in, the device isn't receiving power. Likely a cable or adapter issue.",
            ],
          },
          {
            type: "paragraph",
            text: "If you've tried all of the above and the device still won't charge, send us a message with your order number.",
          },
        ],
      },
    ],
  },
  {
    index: "/03",
    title: "USING THE DEVICE",
    items: [
      {
        question: "How do I turn it on and switch modes?",
        answer: [
          { type: "paragraph", text: "Quick reference:" },
          {
            type: "ordered-list",
            items: [
              "Power on/off: press the button 5 times quickly",
              "Switch to Litsaber Mode: hold the button for 2 seconds",
              "Enter Stealth Mode: hold the button for 5 seconds",
              "Cycle colors: single-click the button",
              "Cycle voltage: press 3 times quickly",
              "Pre-heat: press 2 times quickly",
              "Check battery: press 4 times quickly",
            ],
          },
          {
            type: "paragraph",
            text: "Full activation guide with videos and walkthroughs: getlitsaber.com/activate",
          },
        ],
      },
      {
        question: "My Litsaber isn't lighting up when I hit it.",
        answer: [
          {
            type: "ordered-list",
            items: [
              "Check if you're in Stealth Mode. Stealth Mode turns the LEDs off while keeping the heater active. Hold the button for 4 to 5 seconds to exit. The device will return to Glowstick Mode.",
              "Check the battery. Press the button 4 times quickly to see remaining charge.",
              "Check the cart seating. A loose or improperly seated cart can prevent the airflow sensor from triggering. Try removing and reseating the cart, or back off a quarter turn.",
              "Try a deeper pull. Auto-inhalation requires sufficient airflow through the device. A very light pull may not activate the heater.",
            ],
          },
        ],
      },
      {
        question: "My device is stuck in a rainbow strobe. Is it broken?",
        answer: [
          {
            type: "paragraph",
            text: "No. That's an intentional feature called Blinker Mode, the signature payoff inside Litsaber Mode.",
          },
          {
            type: "paragraph",
            text: "Every vape battery has a max draw duration. A safety floor that pauses the heater after a sustained pull. Most batteries just cut you off. Litsaber turns that moment into a rainbow strobe that cycles through all twelve colors. The longer you hold the pull, the more the lights build, until the device peaks in Blinker Mode.",
          },
          {
            type: "paragraph",
            text: "To exit: stop pulling. The device resets automatically after a few seconds.",
          },
        ],
      },
    ],
  },
  {
    index: "/04",
    title: "SAFETY & QUALITY",
    items: [
      {
        question: "Is Litsaber safe to use?",
        answer: [
          { type: "paragraph", text: "The device is engineered with multiple layers of protection:" },
          {
            type: "ordered-list",
            items: [
              "Overcharge and over-discharge protection on the battery",
              "Short-circuit protection on the heater circuit",
              "Vibration and drop protection built into the body",
              "Auto shut-off after 300 seconds of inactivity in certain modes",
              "Max-draw safety floor that pauses the heater on extended pulls (this is the Blinker Mode behavior)",
            ],
          },
          {
            type: "paragraph",
            text: "Litsaber is sold as a 510-thread battery accessory. We don't produce, manufacture, or distribute cannabis or any oil. The device is not intended for use with nicotine, e-juice, or e-liquids. We strongly encourage sourcing carts from licensed dispensaries to ensure oil quality and lab testing.",
          },
          {
            type: "paragraph",
            text: "21+ only. Use responsibly and in accordance with your local laws.",
          },
        ],
      },
      {
        question: "What is the material made of?",
        answer: [
          {
            type: "paragraph",
            text: "Premium materials, chosen for where they matter. Aluminum and brass at the 510 connection for a solid, conductive thread. Polycarbonate diffuser and reinforced internal foam at the light section, so the 41-LED array glows evenly and the device shrugs off the drops a festival night guarantees. It feels like hardware, not a disposable.",
          },
        ],
      },
    ],
  },
  {
    index: "/05",
    title: "PRICING & COMPARISONS",
    items: [
      {
        question: "Why is Litsaber more expensive than other 510 batteries?",
        answer: [
          {
            type: "paragraph",
            text: "You're not buying a vape pen. You're buying an experience that has utility beyond one.",
          },
          {
            type: "paragraph",
            text: "A commodity 510 battery is a $10 cylinder with a button. Litsaber is engineered hardware with a specific job: turn the device into a piece of light to be seen with.",
          },
          { type: "paragraph", text: "What that costs to build:" },
          {
            type: "ordered-list",
            items: [
              "41 individually-addressable LEDs beneath a polycarbonate diffuser. The whole device illuminates, not a tiny indicator.",
              "Aluminum and brass at the connection, polycarbonate and reinforced foam at the light. Premium materials, drop-resistant build.",
              "800mAh cobalt cell with 1.48Wh energy capacity and 300+ recharge cycles.",
              "Custom-engineered 510 connection with 4.0mm center pin depth, tested for 95 to 99% cart compatibility.",
              "Three-voltage system (2.4V / 2.8V / 3.2V) mapped to specific oil types.",
              "Designed in Los Angeles, manufactured by Dopex. A premium vaporization solutions partner.",
            ],
          },
          {
            type: "paragraph",
            text: "If you're comparing Litsaber to a $15 generic battery, you're comparing the wrong things. Compare it to anything else you'd bring to a festival as a statement piece.",
          },
        ],
      },
      {
        question: "How is Litsaber different from Danksaber?",
        answer: [
          {
            type: "paragraph",
            text: "Two products in the same category, two different design philosophies.",
          },
          {
            type: "paragraph",
            text: "Danksaber is built around discretion. The cart hides inside the body of the device. Their priority is making the cart invisible.",
          },
          {
            type: "paragraph",
            text: "Litsaber is built around visibility. The cart sits exposed at the top, and the entire body of the device illuminates from a 41-LED array beneath a polycarbonate diffuser. The whole device glows like a lightsaber blade. Our priority is making the device a piece of light to be seen with.",
          },
          {
            type: "paragraph",
            text: "Different products for different moments. If you want to vape without anyone noticing, Danksaber is the right call. If you want the device to be the centerpiece of the night, that's Litsaber.",
          },
        ],
      },
    ],
  },
  {
    index: "/06",
    title: "ORDERS, RETURNS & WARRANTY",
    items: [
      {
        question: "What's your return policy?",
        answer: [
          {
            type: "paragraph",
            text: "We back every Litsaber. Unopened devices can be returned within 14 days of delivery for a refund. If your device arrives defective or fails through normal use, our 6-month limited warranty has you covered with a replacement.",
          },
          {
            type: "paragraph",
            text: "To start a return or replacement, send us a message with your order number and a description of the issue.",
          },
        ],
      },
      {
        question: "How long does shipping take?",
        answer: [
          {
            type: "paragraph",
            text: "We ship in 24 hours from Los Angeles. Once your order is in the carrier's hands, standard shipping times apply (typically 2 to 5 business days within the continental US).",
          },
          {
            type: "paragraph",
            text: "You'll receive a tracking number by email once the package leaves our warehouse.",
          },
        ],
      },
      {
        question: "My order arrived damaged or wrong.",
        answer: [
          {
            type: "paragraph",
            text: "We're sorry. Send us a message with your order number, a photo of the issue, and a brief description. We'll send a replacement at no cost as quickly as possible.",
          },
          {
            type: "paragraph",
            text: "For damaged-in-transit claims, please contact us within 7 days of delivery so we can file with the carrier.",
          },
        ],
      },
      {
        question: "Do you offer a warranty?",
        answer: [
          {
            type: "paragraph",
            text: "Yes. Every Litsaber is backed by a 6-month limited warranty against manufacturing defects. We stand behind the hardware. If something fails through normal use, we replace it.",
          },
        ],
      },
    ],
  },
  {
    index: "/07",
    title: "WHOLESALE & PRESS",
    items: [
      {
        question: "I want to carry Litsaber in my shop.",
        answer: [
          {
            type: "paragraph",
            text: "We work with dispensaries, smoke shops, and lifestyle retailers. Wholesale starts at 5 units with tiered pricing from $24/unit. Free display case at 80+ units.",
          },
          {
            type: "paragraph",
            text: "Full program details: view the Wholesale Program at getlitsaber.com/wholesale. Or email info@getlitsaber.com with your shop name and location.",
          },
        ],
      },
      {
        question: "Press, partnerships, or collaborations.",
        answer: [
          {
            type: "paragraph",
            text: "For press inquiries, partnership opportunities, or collab proposals, email info@getlitsaber.com with a brief intro and what you're hoping to do.",
          },
          {
            type: "paragraph",
            text: "We respond to all serious inquiries within 24 hours.",
          },
        ],
      },
      {
        question: "Do you offer free samples?",
        answer: [
          {
            type: "paragraph",
            text: "We don't send free samples, but we make it easy to see the product in person. Wholesale orders of 80+ units include a free acrylic display case and a demo-mode Litsaber pre-programmed to cycle every LED effect, so your staff and customers can see it light up before anyone commits. Carrying fewer? Reach out and we'll figure something out.",
          },
        ],
      },
    ],
  },
];

// ─── Festival Drop List ────────────────────────────────────────────────────────
export const DROP_LIST_EYEBROW = "WAIT LIST";
export const DROP_LIST_HEADLINE = "FESTIVAL DROP LIST";
export const DROP_LIST_BODY =
  "Get $10 off your first Litsaber and early access to the Gold Edition drop. Festival giveaways. No spam. Just the good stuff.";
export const DROP_LIST_CTA = "SEND IT";
