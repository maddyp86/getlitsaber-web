import type { Config } from "tailwindcss";
import tokens from "./tokens.json";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: tokens.color.background.primary.value,
          elevated: tokens.color.background.elevated.value,
          raised: tokens.color.background.raised.value,
          overlay: tokens.color.background.overlay.value,
        },
        accent: {
          cyan: tokens.color.accent.cyan.value,
          "cyan-alpha-10": tokens.color.accent["cyan-alpha-10"].value,
          "cyan-alpha-50": tokens.color.accent["cyan-alpha-50"].value,
          magenta: tokens.color.accent.magenta.value,
          "magenta-alpha-10": tokens.color.accent["magenta-alpha-10"].value,
          purple: tokens.color.accent.purple.value,
          "purple-alpha-10": tokens.color.accent["purple-alpha-10"].value,
          "purple-alpha-50": tokens.color.accent["purple-alpha-50"].value,
        },
        cta: {
          DEFAULT: tokens.color.cta.DEFAULT.value,
          "alpha-10": tokens.color.cta["alpha-10"].value,
          "alpha-40": tokens.color.cta["alpha-40"].value,
          "alpha-70": tokens.color.cta["alpha-70"].value,
        },
        text: {
          primary: tokens.color.text.primary.value,
          secondary: tokens.color.text.secondary.value,
          muted: tokens.color.text.muted.value,
          accent: tokens.color.text.accent.value,
        },
        border: {
          default: tokens.color.border.default.value,
          accent: tokens.color.border.accent.value,
          cta: tokens.color.border.cta.value,
          pill: tokens.color.border.pill.value,
        },
        surface: {
          "tint-cyan": tokens.color.surface["tint-cyan"].value,
          "tint-cta": tokens.color.surface["tint-cta"].value,
          "tint-purple": tokens.color.surface["tint-purple"].value,
          "tint-white": tokens.color.surface["tint-white"].value,
          card: tokens.color.surface.card.value,
        },
        semantic: {
          verified: tokens.color.semantic.verified.value,
          rating: tokens.color.semantic.rating.value,
          discount: tokens.color.semantic.discount.value,
        },
      },
      fontFamily: {
        display: ["var(--font-stellar)", "sans-serif"],
        accent: ["var(--font-monoton)", "sans-serif"],
        subhead: ["var(--font-orbitron)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        label: ["var(--font-space-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": tokens.font.size["display-xl"].value,
        "display-lg": tokens.font.size["display-lg"].value,
        "display-accent": tokens.font.size["display-accent"].value,
        h1: tokens.font.size.h1.value,
        h2: tokens.font.size.h2.value,
        h3: tokens.font.size.h3.value,
        h4: tokens.font.size.h4.value,
        subhead: tokens.font.size.subhead.value,
        body: tokens.font.size.body.value,
        "body-sm": tokens.font.size["body-sm"].value,
        label: tokens.font.size.label.value,
        eyebrow: tokens.font.size.eyebrow.value,
        "stat-display": tokens.font.size["stat-display"].value,
      },
      borderRadius: {
        none: tokens.radius.none.value,
        sm: tokens.radius.sm.value,
        md: tokens.radius.md.value,
        pill: tokens.radius.pill.value,
        card: tokens.radius.card.value,
        full: tokens.radius.full.value,
      },
      spacing: {
        xs: tokens.spacing.xs.value,
        sm: tokens.spacing.sm.value,
        md: tokens.spacing.md.value,
        lg: tokens.spacing.lg.value,
        xl: tokens.spacing.xl.value,
        "2xl": tokens.spacing["2xl"].value,
        "section-y": tokens.spacing["section-y"].value,
        "section-y-mobile": tokens.spacing["section-y-mobile"].value,
        container: tokens.spacing.container.value,
        "container-mobile": tokens.spacing["container-mobile"].value,
        navbar: tokens.component["navbar-height"].value,
      },
      boxShadow: {
        "glow-white": tokens.shadow["glow-white"].value,
        "glow-cyan": tokens.shadow["glow-cyan"].value,
        "glow-purple": tokens.shadow["glow-purple"].value,
        "glow-cta": tokens.shadow["glow-cta"].value,
        "glow-cta-hover": tokens.shadow["glow-cta-hover"].value,
        modal: tokens.shadow.modal.value,
        drawer: tokens.shadow.drawer.value,
      },
      backgroundImage: {
        "hero-fade": tokens.gradient["hero-fade"].value,
        "gradient-cta": tokens.gradient.cta.value,
        "gradient-cta-radial": tokens.gradient["cta-radial"].value,
        "gradient-stats-banner": tokens.gradient["stats-banner"].value,
      },
      height: {
        navbar: tokens.component["navbar-height"].value,
      },
      maxWidth: {
        container: tokens.component["container-max-width"].value,
      },
      width: {
        "cart-drawer": tokens.component["cart-drawer-width-desktop"].value,
        "modal-age-gate": tokens.component["modal-age-gate-width"].value,
        "modal-promo": tokens.component["modal-promo-width"].value,
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 15s linear infinite",
        "marquee-slow": "marquee 40s linear infinite",
      },
      zIndex: {
        base: String(tokens["z-index"].base.value),
        sticky: String(tokens["z-index"].sticky.value),
        navbar: String(tokens["z-index"].navbar.value),
        drawer: String(tokens["z-index"].drawer.value),
        modal: String(tokens["z-index"].modal.value),
        "age-gate": String(tokens["z-index"]["age-gate"].value),
      },
      screens: {
        sm: tokens.breakpoint.sm.value,
        md: tokens.breakpoint.md.value,
        lg: tokens.breakpoint.lg.value,
        xl: tokens.breakpoint.xl.value,
        "2xl": tokens.breakpoint["2xl"].value,
      },
    },
  },
  plugins: [],
};

export default config;
