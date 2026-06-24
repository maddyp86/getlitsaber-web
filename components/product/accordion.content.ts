export interface AccordionBullet {
  lead: string;
  text: string;
}

export interface AccordionSpecGroup {
  label: string;
  bullets: string[];
}

export type AccordionBody =
  | { type: "bullets"; items: AccordionBullet[] }
  | { type: "specs"; groups: AccordionSpecGroup[] }
  | { type: "prose"; blocks: AccordionProseBlock[] };

export interface AccordionProseBlock {
  lead?: string;
  text?: string;
  bullets?: string[];
}

export interface AccordionItem {
  id: string;
  title: string;
  body: AccordionBody;
}

export const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: "features",
    title: "Product Features",
    body: {
      type: "bullets",
      items: [
        {
          lead: "Light-show first.",
          text: "41 individually-addressable LEDs respond to your breath in real time. The longer you pull, the brighter it builds. Built to be the thing the stranger across the bar walks over to ask about.",
        },
        {
          lead: "Cart-agnostic.",
          text: "4.0mm pin depth, tuned for 95 to 99% cart compatibility. Live resin, rosin, distillate, liquid diamonds. If it's 510, it works.",
        },
        {
          lead: "Three modes.",
          text: "Glowstick for the breathing glow. Litsaber for the cascading saber effect. Stealth for when you don't want the show.",
        },
        {
          lead: "Built for the night.",
          text: "800mAh cell. Full charge in under 75 minutes. USB-C, any cable. Aluminum body, brass internals.",
        },
      ],
    },
  },
  {
    id: "specs",
    title: "Tech Specs",
    body: {
      type: "specs",
      groups: [
        {
          label: "LIGHTING",
          bullets: [
            "41 individually-addressable LEDs",
            "12 color options including white and rainbow modes",
            "3 lighting modes: Glowstick, Litsaber, Stealth",
            "Breath-responsive intensity (in Litsaber Mode)",
          ],
        },
        {
          label: "POWER",
          bullets: [
            "800mAh cobalt cell (2 × 400mAh, 10500 format)",
            "1.48Wh energy capacity",
            "300+ recharge cycles",
            "300-second auto shut-off (Glowstick Mode)",
          ],
        },
        {
          label: "VOLTAGE",
          bullets: [
            "3 adjustable settings, color-coded",
            "2.4V (green LED) for Rosin / Live resin",
            "2.8V (blue LED) for Cured resin / Hybrid oils",
            "3.2V (red LED) for Distillate / Liquid diamonds",
          ],
        },
        {
          label: "CART COMPATIBILITY",
          bullets: [
            "510-thread connection",
            "4.0mm center pin depth",
            "Fits 10.5 to 14.5mm cart diameter",
            "Fits 0.5g to 2g cart capacity",
            "95 to 99% compatibility rate",
          ],
        },
        {
          label: "CHARGING",
          bullets: [
            "USB-C input, any standard cable",
            "5V/1A or higher",
            "Full charge in under 75 minutes",
            "5-color charge progress indicator",
          ],
        },
        {
          label: "PHYSICAL",
          bullets: [
            "21.3 × 20.3 × 147mm",
            "56.5g (device) / 120g (with packaging)",
            "Aluminum body, brass internals, polycarbonate diffuser",
            "Dual-mode activation: auto-draw + button",
          ],
        },
        {
          label: "SAFETY",
          bullets: [
            "Overcharge, over-discharge, short-circuit, vibration, and drop protection",
            "Auto-cutoff at max draw (Blinker Mode)",
            "21+ only — not for nicotine or e-juice",
          ],
        },
      ],
    },
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    body: {
      type: "prose",
      blocks: [
        {
          lead: "14-day return window for unopened devices.",
          text: "Original packaging required. For change-of-mind returns, you cover return shipping.",
        },
        {
          lead: "How to return?",
          text: 'Email <a href="mailto:order@getlitsaber.com" class="underline">order@getlitsaber.com</a> with your order number and we send return instructions and a return label. We recommend a tracked service for items over $75.',
        },
        {
          lead: "Refund timing.",
          text: "Once we receive and inspect your return, you'll get a confirmation email. Approved refunds process to your original payment method within 7 to 10 business days.",
        },
        {
          lead: "What we can't accept",
          bullets: [
            "Opened or used devices (those go through warranty instead, see below)",
            "Sale items (final sale)",
          ],
        },
        {
          lead: "Arrived damaged, defective, or incorrect?",
          text: "That's not a standard return, it's covered separately. We send a return label at our cost and ship a free replacement. See the Warranty section.",
        },
      ],
    },
  },
  {
    id: "shipping",
    title: "Shipping",
    body: {
      type: "prose",
      blocks: [
        {
          lead: "Free USPS shipping on all US orders.",
          text: "Ships from California, Monday through Friday.",
        },
        {
          lead: "Orders ship within 1 to 2 business days.",
          text: "Allow up to 5 business days during launches or sales.",
        },
        {
          lead: "Arrives in 5 to 7 business days.",
          text: "Tracking email sent when your order leaves the warehouse. Allow 1 to 2 days for the carrier to update tracking.",
        },
        {
          text: "Tracking link is in your shipping confirmation email and your account at getlitsaber.com under Order History.",
        },
        {
          lead: "Canada and international orders coming soon.",
          text: 'Email <a href="mailto:order@getlitsaber.com" class="underline">order@getlitsaber.com</a> and let us know if you\'re interested.',
        },
      ],
    },
  },
  {
    id: "warranty",
    title: "Warranty",
    body: {
      type: "prose",
      blocks: [
        {
          lead: "6-month limited warranty against defects.",
          text: "From the date of purchase. We cover manufacturing defects, LED failures, charging issues, and anything that fails because we built it wrong.",
        },
        {
          lead: "How to claim:",
          text: 'Email <a href="mailto:order@getlitsaber.com" class="underline">order@getlitsaber.com</a> with your order number and a photo or video showing the issue.',
        },
        {
          lead: "We reply within 24 hours.",
          text: "If a return is needed, we send a return label at our cost. Most claims are processed within 4 business days of receiving the device.",
        },
        {
          lead: "What's covered",
          bullets: [
            "Manufacturing defects",
            "LEDs failing under normal use",
            "Battery not holding charge under normal use",
            "Charging port malfunctions",
          ],
        },
        {
          lead: "What's not covered",
          bullets: [
            "Drops, water damage, accidents",
            "Cosmetic wear (scratches, dents)",
            "Devices that have been opened or modified",
            "Normal battery degradation",
            "Counterfeits or unauthorized resellers (eBay, unverified Amazon, etc.)",
          ],
        },
        {
          lead: "Bought it somewhere else?",
          text: "The warranty applies only to Litsabers purchased through getlitsaber.com or an authorized retailer. If you bought from an unverified source, we can't honor the warranty, but we can confirm whether your seller is authorized. Email us with the details.",
        },
      ],
    },
  },
];