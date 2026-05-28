# Litsaber Component Inventory

Pulled from Figma file `cuBHq4i5XibiqCyleuZFHO` across all desktop (1440) and mobile (375) frames. This is the spec Bolt scaffolds against and Claude Code refines.

For each component: purpose, props, states. Use this as the source for prop types and Storybook stories.

---

## Conventions

- All components are React Server Components by default. Mark `"use client"` only when interactivity requires it (cart, animations, form inputs, scroll behaviors, drawers, modals).
- Style via Tailwind utilities pulling from `tokens.json` (mapped into `tailwind.config.ts`).
- No inline hex values in components. Everything routes through the token system.
- Image assets are `next/image` with explicit width/height. Figma asset URLs expire — replace with permanent CDN URLs before Phase 2 ships.
- Mobile-first responsive: Tailwind breakpoints (`sm:`, `md:`, `lg:`) progressively enhance toward desktop layouts.

---

## Site Map (8 pages)

| Route | Page | Mobile node | Desktop node |
|-------|------|-------------|--------------|
| `/` | Homepage | `3760:5314` | `3216:33` |
| `/shop/litsaber-og` | Product Detail (PDP) | `3760:5949` | `3367:320` |
| `/the-tech` | Engineering | `3760:6251` | (responsive from mobile) |
| `/wholesale` | Wholesale | `3760:6421` | (responsive from mobile) |
| `/about` | About | `3760:8363` | (responsive from mobile) |
| `/activate` | Post-purchase Activate | `3760:7964` | (responsive from mobile) |
| `/contact` | Contact + Master FAQ | `3760:6787` | (responsive from mobile) |
| `/policies/*` | Refunds, Warranty, Shipping, Terms, Privacy | `3760:7091` | (responsive from mobile) |
| `/cart` | Full cart page | (drawer on mobile) | `3668:5358` |

---

## Global / Shared Components

### `<Navbar />`
Sticky top nav, transparent over hero, solid black on scroll.

- **Slots:** Logo (left), nav links (center: Home, Shop, The Tech, About, Wholesale), user + cart icons (right)
- **States:** default (transparent), scrolled (black background), mobile (hamburger menu replaces nav links)
- **Behavior:** Cart icon shows live count badge from Shopify cart context.

### `<MobileNavDrawer />`
Full-screen drawer triggered by hamburger.

- **Sections:** 5 primary nav items (Home, Shop, The Tech, About, Wholesale) with submenu indicators on Shop and The Tech, expandable "Quick Links" section (FAQs, Contact Us, Track Your Order, Start A Return), footer with primary CTA ("GET YOURS - $59.99") and "LOGIN TO YOUR ACCOUNT" link
- **States:** closed, opening, open, closing
- **Behavior:** Hamburger toggle; closes on link click or X tap; body scroll locked while open

### `<Footer />`
Full-bleed dark footer.

- **Subsections (top to bottom on mobile, left to right on desktop):**
  - Logo + tagline ("An interactive glowstick that hits 510 carts. Built for festivals, nightlife, and the moments worth being lit for.")
  - Social icons (Instagram, YouTube, TikTok) — *mobile-only currently; needs desktop addition*
  - "DESIGNED IN LA | ASSEMBLED IN ASIA" tagline — *mobile-only currently; needs desktop addition*
  - Nav columns: Explore (Home, Shop Litsaber, Wholesale), Support (Contact Us, Refund & Returns, Warranty), Brand (About, The Tech)
  - Copyright (© 2026 INNOVAPE CONCEPTS · LOS ANGELES) and 21+ disclaimer
  - Full compliance disclaimer (cannabis-free framing)
  - Klarna logo / payment methods strip
- **Note:** Mobile and desktop footers have small content differences. Mobile gets socials + DESIGNED IN LA; desktop currently does not. Treat as drift to reconcile in Phase 3.

### `<WholesaleCTA />` strip
Inline section appearing on most marketing pages above the footer.

- **Copy:** "STOCK LITSABER IN YOUR SHOP." headline + "MOQ 5 · FREE DISPLAY CASE AT 80+" subline
- **CTA button:** "View Wholesale Program →" links to `/wholesale`
- **Note:** Desktop homepage currently still reads "MOQ 25 · 100+" — this needs Figma reconciliation to match the locked MOQ 5 / 80 case pack.

### `<EmailSignup />`
"FESTIVAL DROP LIST" sign-up appearing on most marketing pages above the footer.

- **Copy:** "Get $10 off your first Litsaber and early access to the Gold Edition drop. Festival giveaways. No spam. Just the good stuff."
- **Input:** Email field + "SEND IT" button
- **Integration:** Posts to HubSpot form (`NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID`)
- **States:** default, submitting, success, error

### `<GridLines />`
Decorative background grid (horizontal + vertical lines) on certain sections — Where It Lives, Email Signup, Reviews.

- **Behavior:** Pure decoration. Treat as a `<div>` with CSS-rendered lines (not 40 separate SVG elements as Figma shows).

---

## Modals

### `<AgeGateModal />`
**Compliance-critical.** Blocks site entry until user confirms 21+. Required for vape category.

- **Dimensions:** 448×358 desktop; full-screen on mobile
- **Content:** Logo/icon, "YOU MUST BE 21+ TO ENTER" headline, "This website contains products intended for adults only. By entering, you confirm you are of legal age." body, "I AM 21+" primary button, "EXIT" link (sends to a safe external URL — e.g. google.com)
- **Behavior decisions pending:** first-visit-only or session-based, cookie duration, hard wall or soft (see CLAUDE.md commerce constraints)
- **z-index:** `age-gate` (300) — must sit above everything else

### `<FloatingPromoPopup />`
Email-capture modal with $10 discount offer.

- **Dimensions:** 389×441 desktop; mobile-adjusted
- **Content:** "/ WAIT —" eyebrow, "$10 OFF YOUR FIRST LITSABER" headline, "Drop your email. We'll send a code + early access to the next drop." body, email input + "SEND MY CODE" button, "No spam. Unsubscribe anytime." + "✓ AUTO-APPLIED ✓ ONE-TIME USE ✓ 14-DAY VALID" trust line
- **Triggers (locked 2026-05-28):** 12s time delay + exit-intent (mouse-leave). `armedRef` guards against double-fire; re-arm path re-reads cookies.
- **Frequency cap (locked 2026-05-28):** dismiss → `COOKIE_SEEN` 72h (suppressed, may reappear after); subscribe → `COOKIE_SUBSCRIBED` 365d (never reappears).
- **Offer (locked):** $10. Source tag `floating-promo-$10`. Submits to HubSpot General form per ADR-004.
- **Suppress on:** age gate flow, checkout pages, already-subscribed users (cookie check)

---

## Cart System

### `<CartDrawer />`
Right-side slide-out, available globally via cart icon click.

- **Dimensions:** 450px wide on desktop; 100vw on mobile
- **Header:** "YOUR CART · N ITEMS" + close (✕) button
- **Body — filled state:**
  - List of `<CartLineItem />` components
  - Subtotal row, Shipping row ("CALCULATED AT CHECKOUT"), Promo code field
  - Total row
  - "CHECKOUT →" primary button (links to Shopify hosted checkout)
  - "🔒 SECURE CHECKOUT" + card logos (VISA, MC, AMEX, DISCOVER)
  - "Authorize.net · Free 14-day returns" footer
- **Body — empty state:**
  - Drag handle (mobile)
  - "Empty" subtitle
  - Cart icon illustration
  - "Nothing here yet. / Your Litsaber is one tap away." headline
  - "SHOP NOW" button

### `<CartPage />`
Dedicated `/cart` route — fuller experience than the drawer.

- **Layout (desktop):** 2-column — items table (left, 60%) + Order Summary card (right, 35%)
- **Layout (mobile):** Single column, summary below items
- **Items table:** PRODUCT / PRICE / TOTAL columns, with each row including image + name + variant + qty stepper + price + total + remove (✕)
- **Order Summary card:** Subtotal, Shipping (AT CHECKOUT), Estimated tax (AT CHECKOUT), Promo code field, Total, CHECKOUT button, secure checkout badges
- **Empty state:** Centered cart icon + "Nothing here yet. / Your Litsaber is one tap away." + SHOP NOW button + $0.00 order summary

### `<CartLineItem />`
Single line in cart drawer or cart page.

- **Props:** product image, title, variant (e.g. "SILVER"), quantity, line price, line total
- **Controls:** quantity stepper (− / N / +), Remove link
- **Behavior:** Updates push to Shopify Cart API; UI reflects Shopify state, not local state

### `<QuantityStepper />`
Reusable +/- counter.

- **Props:** value, min, max, onChange
- **Behavior:** Disables − at min, disables + at max or at variant inventory limit

### `<PromoCodeField />`
4-variant component for promo code entry.

- **Variants:**
  - `default` — collapsed "+ HAVE A PROMO CODE?" link
  - `expanded` — input + Apply button
  - `applied` — shows applied code with discount line and remove option
  - `error` — invalid code message
- **Behavior:** Posts to Shopify via `cartDiscountCodesUpdate`; cart state reflects discount. Ships pre-launch bundled with ADR-004 backend, on Phase 5 instrumentation.
- **⚠ Spec gap:** the `error` variant above is required by spec but Figma component `3770:1315` has Default / input / filled / success only — no error state. Design invalid-code / already-used UI before building.

### `<SecureCheckoutBadge />`
"🔒 SECURE CHECKOUT" header + payment method logos row (VISA, MC, AMEX, DISCOVER).

---

## Hero & Homepage Sections

### `<Hero />`
Full-bleed hero — 1440×1460 desktop, 375×750 mobile.

- **Composition (corrected to match current Figma):** Background image with bottom-fade gradient, headline ("HIGHLIGHT THE NIGHT" with "NIGHT" in Monoton cyan), sub-headline, two CTAs, **large-display glow tagline**, **product render of the device**, spec pills row
- **Product render:** The hero shows the Litsaber device (Figma confirmed). May be a separate cutout asset layered over the background scene, or part of the background image — depends on the asset structure. Positioned per Figma (typically right side on desktop, below content on mobile).
- **CTAs:** Primary ("GET YOURS — $59.99", pink `cta` treatment) and secondary ("SEE IT IN MOTION", cyan outline)
- **Glow tagline:** "Glowstick meets 510 battery. This is Litsaber." Rendered as a **large display statement** (Figma confirmed) — bigger than body, sized as a secondary headline, with cyan glow. NOT a small eyebrow label. This is the repositioning thesis line; it earns visual weight.
- **Spec pills:** `41 LEDS · 10 Colors · 3 Modes · 800 mAh · USB-C · 510 Thread`
- **Mobile behavior:** CTAs stack vertically; spec pills become a 2×3 grid; headline scales down; product render moves below the text content
- **Note:** This entry was corrected after a Phase 2 build discrepancy — the original Phase 1.5 spec omitted the product render and under-sized the tagline. Figma was the correct source on both.

### `<StatBar />`
Five-column stat strip directly under the hero.

- **Stats:** `2M+ TikTok Views · 1K+ Units Shipped · Ships in 24hrs · 30-Day Guarantee · Family Owned`
- **Mobile behavior:** Horizontal scroll
- **Source:** Treat as canonical (locked in BRAND.md)

### `<TenWaysSection />`
"INTERACTIVE LIGHTS / TEN WAYS TO BE SEEN."

- **Layout (desktop):** Eyebrow + headline (left), body copy (right), full-width product image below
- **Layout (mobile):** Stacked, single column

### `<ThreeModesSection />`
"THREE MODES / PICK YOUR ENERGY."

- **Layout (desktop):** Headline group top center, two-column: mode cards (left), product visual (right)
- **Layout (mobile):** Single column — headline → mode cards stacked → visual
- **Mode cards:** Three stacked cards — Litsaber Mode (with Behaviour/Sub-Mode toggle), Glowstick Mode, Stealth Mode
- **Each card state:** Active card has cyan glow border; inactive cards are muted
- **Behavior:** Tabs are interactive — clicking switches active card and updates visual

### `<UnderTheHoodSection />`
"UNDER THE HOOD / ENGINEERED TO STAND OUT."

- **Layout (desktop):** Eyebrow + headline (top center), exploded product render (middle), 6-feature grid (bottom, 3×2)
- **Layout (mobile):** Headline → exploded image → 6 features stacked in 1×6 column (note: mobile order differs from desktop — Extra Battery Power leads on mobile, Visual Cues leads on desktop)
- **6 features:** Visual Cues, Dual Activation, Two-Part Build, Extra Battery Power, 3-Voltage System, Universal 510 Threading
- **Each card:** Title + ~96-char body copy
- **Note:** Engineering as credibility for the experience, not engineering as sales

### `<BatteryStatsCallout />`
"Up To 4 hours of charge time / Up To 300 draws per session."

- **Layout:** Two large stat callouts with display-size numbers + body context
- **Visual:** Screenshot or product visual below

### `<SpecGrid />`
2-column × N-row grid of icon + value + label cards. **Used on both Homepage and Engineering page (responsive).**

- **Specs covered (locked):** 1.5yr Lifespan, 800mAh Battery, 3-tier Power settings, 2.4V/2.8V/3.2V Voltage range, 75 mins Time to full charge, 510 Cartridge style, 1.9 oz Weight, 41x Total LEDs, etc.
- **Each cell:** Icon (top), value (large), label (small)
- **Mobile:** 2 columns; **Desktop:** likely 4–6 columns

### `<WhereLightVaporSection />`
"WHERE LIGHT AND VAPOR MEET."

- **Layout:** Full-bleed dark visual background, headline + sub-copy overlay
- **Content policy note:** Avoid showing draw-activated/exhale content on social channels (per BRAND.md); same restraint applies here

### `<WhereItLivesSection />`
"WHERE IT LIVES / Same device. Every room you walk into."

- **Layout (desktop):** Grid background, headline group top center, 4-card horizontal row (Festivals, Raves, House Parties, Events)
- **Layout (mobile):** Same headline, horizontal-scroll carousel of the 4 cards
- **Each card:** Full-bleed image, venue label overlay at bottom

### `<FAQSection />` (homepage)
"BEFORE YOU BUY / COMMON QUESTIONS."

- **Layout (desktop):** Headline (top center), 3×2 grid of FAQ cards
- **Layout (mobile):** Headline + 1×6 stacked FAQ cards
- **Questions (in order):**
  1. How is this different from other 510 batteries?
  2. Will it work with my carts?
  3. How long does the battery last?
  4. How visible are the lights?
  5. What if it breaks or stops working?
  6. Can I travel with it?
- **Each card:** Number tag (`/ 01`), question, answer

### `<ReviewsSection />` (homepage)
"REVIEWS / WHAT CUSTOMERS SAY / The internet is talking."

- **Layout (desktop):** Headline (top center), 4-card horizontal review carousel
- **Each card:** Review text, attribution, source (TikTok handle or platform)
- **Note:** This is the homepage *summary* of reviews. The full reviews subsystem lives on the PDP.

### `<HomepageBuySection />`
The homepage has its **own full buy section** (not just a link to the PDP). Section anchor `id="shop"` is taken by routing conventions — use `id="buy"` for the homepage anchor to avoid collision with the `/shop/litsaber-og` route.

This section reuses several PDP components but is a self-contained purchase experience on the homepage. Structurally based on the earlier `BuySection.tsx` prototype, **with all stale data corrected to locked spec.**

- **Layout (desktop):** Two-column. Left: sticky product carousel. Right: buy panel.
- **Layout (mobile):** Single column, carousel on top, buy panel below.
- **Atmospheric:** `<SectionStarfield />` behind the section content (denser/colorful variant per MOTION.md Part 5). Optional `<GlowOrb />` purple pool. Section is `position: relative; overflow: hidden` so the starfield is clipped to the section.

**Left column — product carousel (`<ProductCarousel />`):**
- Sticky main image (square aspect, rounded, glass-card treatment) with fade transition between images (300ms per MOTION.md)
- Left/right nav arrows (appear on hover, desktop)
- 4-thumbnail strip below; active thumbnail has cyan border, inactive are dimmed
- Images from `public/images/product/`

**Right column — buy panel:**
- Title "LITSABER" (Orbitron) + subtitle "The Interactive 510 Battery" (Inter)
- Price display (Orbitron, large) — reflects selected bundle. Uses the pink `cta` color treatment, not magenta.
- **Style selector (`<StyleSelector />`):** two options
  - Silver — "In stock · Ships 24h" — selectable, cyan ring when active
  - Gold Edition — "Limited drop · Waitlist" — when selected, swaps the buy panel for a waitlist email-capture form (Gold is not purchasable yet, "COMING SOON")
- **Bundle selector (`<BundleSelector />`):** **TWO bundles only (locked — no 3-pack):**
  - Single — $59.99, no savings badge
  - 2-Pack — $99.99, "SAVE $20" badge ("For the lightshow. For the partner. For the never-without")
  - Radio-style selection; active bundle has cyan border + cyan tint background + glow
  - Selecting a bundle updates the price display and the Add to Cart quantity logic (bundle = quantity discount on the single SKU, per locked Shopify strategy)
- **Urgency line:** "SHIPS IN 24 HOURS · ORDER BY 3PM PT" pill. When 2-Pack selected, show "FREE SHIPPING UNLOCKED" (free shipping threshold TBD — confirm against actual policy).
- **Add to Cart button:** primary CTA, pink `cta` color, "powers up" glow on hover per MOTION.md. Adds selected bundle/style to cart (Shopify Cart API in Phase 4; mock in Phase 2).
- **Accordions (`<ProductAccordion />`):** Product Features, Tech Specs, Warranty, Shipping. **Warranty copy must be reconciled** — the prototype said "30-day guarantee" but the policies page specifies a 6-month limited warranty. Use the correct figure; do not reproduce the prototype's 30-day text blindly.

**Data corrections from the prototype (do NOT carry over the stale values):**
- Single is **$59.99**, not $60
- 2-Pack is **$99.99 / SAVE $20**, not $110 / save $10
- **No 3-Pack** (prototype had one at $150 — remove)
- Spec pills say **"10 Colors"**, not "12 Colors"
- Warranty: reconcile 30-day vs 6-month (flagged open question)
- Bundle implementation: quantity discount on single SKU, not separate products

---

## Product Detail Page (PDP)

### `<ProductImageGallery />`
Main image + thumbnail strip.

- **Layout (desktop):** Vertical thumbnail strip (left) + main image (right)
- **Layout (mobile):** Main image + horizontal-swipe thumbnail strip below
- **States:** Default, loading, zoom-on-hover (desktop)
- **Note:** Shares carousel behavior with `<ProductCarousel />` on the homepage buy section. Consider a shared underlying component with PDP and homepage variants.

### `<ProductInfo />`
Container for title, price, features, CTA. Right column on desktop, full-width on mobile.

- **Title:** "LITSABER OG +"  *(note: trailing `+` — verify intentional)*
- **Subtitle:** "The Interactive 510 Battery"
- **Price:** $59.99
- **Feature pills:** 6 pills in 3×2 grid (USB-C charging, 3 modes, 800 mAh, 10 colors, 3 voltage, Pre-heat)

### `<StylesAndBundles />`
Two-section selector — Style (Silver / Gold) and Bundle (Single / 2-Pack).

- **Styles:**
  - Silver — In Stock, Ships in 24 hrs
  - Gold Edition — Coming Soon
- **Bundles:**
  - Single — $59.99 ("One Litsaber")
  - 2-Pack — $99.99 with "SAVE $20" badge ("For the lightshow. For the partner. For the never-without")
- **Behavior:** Selecting a bundle updates `<AddToCartButton />` price and quantity logic

### `<AddToCartButton />` / Sticky purchase bar
Below styles/bundles on desktop; possibly sticky bottom bar on mobile (TBD).

- **States:** default, loading, success (briefly), out-of-stock, disabled

### `<ProductDescription />`
Two-paragraph block under the buy section.

- **Current Figma copy is AI-toned and violates BRAND.md voice rules.** Flagged for rewrite — should match the established voice (no superlatives, no "world's first," no "Ignite your night"). Decision pending.

### `<ProductAccordion />`
Stack of 5 accordion sections under the description.

- **Sections:** Product Features, Tech Specs, Returns & Refunds, Shipping, Warranty
- **States:** collapsed (default), expanded

### Reviews subsystem (PDP)

The reviews section is a complete subsystem with 9 sub-components.

#### `<ReviewsSummary />`
Header showing aggregate rating.

- **Content:** "CUSTOMER REVIEWS" headline, 4.8 average, 5-star display, "BASED ON 462 REVIEWS"
- **Includes:** "WRITE A REVIEW" CTA button

#### `<RatingDistribution />`
5/4/3/2/1 horizontal bar chart with counts.

- **Visual:** Each row has star count, filled bar, raw count number
- **Behavior:** Clicking a row filters the review list

#### `<AISummaryCard />`
"AI SUMMARY" labeled card with synthesized review themes.

- **Content:** "Customers consistently praise..." synthesized paragraph
- **Data source decision pending:** Confirm with ReviewInfra whether AI summary is a built-in feature. If yes, use it. If no, build a custom Claude API endpoint that synthesizes reviews server-side and caches the result. Or ship v1 without this card.

#### `<ReviewsWithMediaCarousel />`
Horizontal carousel of customer photos from reviews.

- **Controls:** Left/right nav arrows
- **Each item:** 160×160 image, links to the full review

#### `<ReviewSearchBar />`
Search input + filters.

- **Components:** Text search, Rating dropdown ("Rating ▾"), "With media" toggle button

#### `<PopularTopicsChips />`
Filterable tag chips for review topics.

- **Chips (current):** festival, build quality, lights, battery, smooth, premium, packaging, voltage
- **Behavior:** Clicking a chip filters review list

#### `<ReviewCard />`
Individual review.

- **Content:** Avatar circle with first initial, reviewer name (e.g. "ALEX M."), VERIFIED BUYER badge, date, 5-star rating, title, body, optional photo grid, "Was this helpful?" with thumbs up/down counters
- **Variants:** with/without photos

#### `<LoadMoreButton />`
"LOAD MORE REVIEWS" button at end of list.

#### `<ReviewsPoweredBy />`
Footer attribution ("REVIEWS POWERED BY REVIEWINFRA"). **Provider locked: ReviewInfra** (https://reviewinfra.dev).

---

## Engineering Page Components

### `<EngineeringHero />` / `<ScrollDownCTA />`
Page hero with "Inhale. Watch what happens." → "A light language." sectional structure.

### `<VoltageTable />`
3-row table — Green/Blue/Red LED with voltage, oil type, and burn description.

- **Rows:**
  - Green LED, 2.4V — Rosin / Live Resin — "Preserves terpenes. Smooth flavor. Cool burn."
  - Blue LED, 2.8V — Cured Resin / Hybrid Oils — "Balanced vapor production and oil efficiency."
  - Red LED, 3.2V — Distillate / Liquid Diamonds — "Dense clouds. Stronger pull. Warm burn."

### `<KineticAnimationCanvas />` (Engineering page only)
Per existing project context, the Engineering page has a "full kinetic animation system." Needs detailed spec from existing implementation or a fresh design pass.

---

## Wholesale Page Components

### `<WholesaleStats />`
Top-of-page stats row.

- **Stats (locked):** MOQ 5, 80 Case pack, $24/unit STARTS AT, 4 Pricing tiers
- **Layout:** Horizontal row of large numeric callouts

### `<BenefitCard />`
Repeating card for wholesale benefits (margin, support, exclusivity, etc).

### `<PricingCallout />`
Tier-pricing summary.

- **Tiers (locked):** Initiate / Knight / Archon / Legend — 4-tier system
- **Note:** The full per-unit pricing for the new 4-tier system needs to be defined. Old 9-tier system in the existing `Litsaber_Wholesale_Pricing_2026.pdf` is outdated.

### `<RetailKitFeatureCard />`
"FREE display case at 80+ units" feature highlight.

### `<HubSpotFormEmbed />`
Embedded form for wholesale inquiries.

- **Integration:** HubSpot form ID `f4b0a43c-c1e0-4452-a5ce-48d36ae56f57` (region `na2`)
- **Behavior:** Loads HubSpot script client-side; form submission flows to HubSpot CRM

### `<ChecklistRow />`
"✓ 4 volume-based pricing tiers from 25 to 10,000+ units" style list — used on Wholesale and About pages.

### `<ExpandableFAQItem />`
Wholesale-specific FAQ accordions (different from homepage `<FAQSection />` cards).

---

## About Page Components

### `<PullQuote />`
Large formatted founder quote.

- **Example:** "What if you could smoke a glowstick? — Brendan Friedrich, 2020"

### `<TeamBioCard />`
Founder bio (Matt Hall, Brendan Friedrich).

- **Content:** Photo, name, role, bio paragraph

### `<PrototypeTimeline />`
Visual timeline of prototype iterations.

### `<ManufacturerCard />`
Manufacturing partner credibility section.

### `<PhotoGrid />`
Behind-the-scenes / lifestyle photo grid.

---

## Activate Page Components (Post-Purchase Onboarding)

### `<ActivateHero />`
Hero with "SCANNED FROM BOX" badge (QR-scan entry detection).

- **Content:** "Your Litsaber is Here." headline, instructions copy, 3-step indicator (POWER ON, SELECT MODE, FIRST DRAW)

### `<StickyChipNav />` / `<SubNav />`
Sticky horizontal chip navigation for jumping to sections.

- **Items:** Quick Start, FUNCTIONS, 3 Modes, PRE-HEAT, VOLTAGE, BATTERY, CHARGING, CART TIPS, SAFETY
- **Behavior:** Scrolls horizontally on mobile; sticky to top on scroll

### `<ThreeStepCard />` / `<StepRow />`
Numbered step instruction blocks (e.g. "/01 POWER ON").

### `<FunctionTable />`
Button-action → result reference table.

- **Rows:** 5 clicks → Power on/off, 4 clicks → Check battery, 3 clicks → Cycle voltage, 2 clicks → Pre-heat, Single click → Cycle colors, Hold 2 sec → Toggle Glowstick/Litsaber, Hold 5 sec → Enter Stealth, Hold 4–5 sec (in Stealth) → Exit Stealth

### `<InstructionBlock />`
Title + duration badge + numbered steps + callout. Used for Pre-Heat, Battery Check, Charging sections.

- **Composition:** Title + CTA pill (e.g. "9 SECONDS", "4 CLICKS", "USB-C") + 3-item bullet list + optional callout box

### `<VideoEmbed />`
Inline product demonstration video placeholder.

- **Multiple instances:** Quick Start, Pre-Heat, Voltage, Battery, Charging sections

### `<SafetyChecklist />`
6-item bullet list with circle markers — Auto-inhale, Cart compatibility, 21+ only, Keep dry, Built-in protections, Auto shut-off.

---

## Contact Page Components

### `<ContactOptionCard />`
Repeating card for contact methods.

- **Three instances:**
  - Email: info@getlitsaber.com — "For orders, support, wholesale, and press. Replies within 24 hours."
  - Phone: (949) 420-9171 — "Mon–Fri, 9am–6pm PT. Voicemail any time."
  - Live Chat: "CHAT WITH US" — "Quick answers on activation, modes, and troubleshooting." (with "COMING SOON" toggle)

### `<QuickLinksRow />`
Inline links to policy pages.

### `<ContactForm />`
"Send us a message" form.

- **Fields:** Name, Email, Subject/Topic, Message
- **Integration:** HubSpot contact form ID `fb0f6c82-3f57-405e-a655-a722321fd93f`

### `<MasterFAQList />`
The full FAQ — much larger than the homepage FAQ.

- **7 categories:** CARTS & PERFORMANCE, BATTERY & CHARGING, USING THE DEVICE, SAFETY & QUALITY, PRICING & COMPARISONS, ORDERS RETURNS & WARRANTY, WHOLESALE & PRESS
- **Each question:** `<ExpandableFAQItem />` with `+` collapse/expand control
- **Note:** Most answer copy in Figma is boilerplate placeholder. Real answers need to be written pre-launch.
- **Decision pending:** Keep or rewrite "How is Litsaber different from Danksaber?" (direct competitor mention)

---

## Policies Page (5 sub-pages)

Treated as a known templated pattern — full Figma frame timed out via MCP, but the structure is standard.

### `<PolicyPageLayout />`
Container with optional TOC sidebar.

### `<PolicyTOC />`
Anchor links to sections.

- **Behavior:** Sticky on desktop, collapsed accordion on mobile

### `<PolicySection />`
Heading + body markdown for each policy section.

### `<LastUpdatedTag />`
Date stamp showing when the policy was last revised.

**Five policies:** Refund & Returns, Warranty, Shipping, Terms of Service, Privacy Policy.

---

## Primitive Components

### `<Button />`
- **Variants:** `primary` (cyan border, cyan-tint background, cyan text), `secondary` (gray border, white-tint background, white text), `ghost` (no border, accent text), `destructive` (for Remove actions)
- **Sizes:** `lg` (329×70 — hero CTAs), `md` (default), `sm`
- **States:** default, hover (intensify cyan glow on primary), focus (visible ring), disabled, loading

### `<ResponsiveImage />`
- **Use:** Art-directed images where mobile and desktop are different files/crops — hero background, venue cards, section backgrounds, product lifestyle shots
- **Props:** `mobileSrc`, `desktopSrc`, `alt`, `breakpoint` (default `"1024px"` matching `lg` token), `className` (default fills container with `object-cover`), `priority` (sets `fetchpriority="high"` + `loading="eager"` + `decoding="sync"`)
- **Renders:** Native `<picture>` with one `<source media="(min-width: {breakpoint})">` for desktop and `<img>` fallback for mobile. Browser preload scanner respects `<picture>` media queries, so mobile devices never fetch the desktop file.
- **Trade-off:** No Next.js automatic WebP conversion. Pre-optimize source files before committing.

### `<SpecPill />`
- **Use:** Spec callouts under hero, feature pills on PDP
- **Visual:** Rounded-full, deep-purple border, cyan Space Mono text
- **Props:** `label` (string)

### `<EyebrowLabel />`
- **Use:** Small uppercase label above section headlines (e.g. "INTERACTIVE LIGHTS")
- **Visual:** Space Mono, 14–24px, accent or muted color

### `<GlowText />`
- **Use:** Statement headlines with white or cyan text-shadow glow
- **Props:** `glowColor` (`'white' | 'cyan'`), `intensity` (`'standard' | 'high'`)

### `<SectionEyebrowHeading />`
- **Composition:** EyebrowLabel + H1/H2 + optional sub-copy
- **Use:** Top of nearly every narrative section
- **Variants:** `centered` (default), `left-aligned`

### `<NumberTag />`
- **Use:** `/ 01`, `/ 02` numerical badges on FAQ cards and step rows

### `<StarRating />`
- **Props:** `value` (0–5, supports half-stars), `size`, `interactive` (for review submission)

### `<VerifiedBuyerBadge />`
- **Use:** Inline tag next to reviewer name on `<ReviewCard />`
- **Visual:** Small checkmark icon + "VERIFIED BUYER" text

### `<Toggle />` / `<Pill toggle>`
- **Use:** "BEHAVIOUR / SUB MODE" toggle in Litsaber Mode card, "COMING SOON" tag

### `<SocialIconRow />`
- **Use:** Instagram + YouTube + TikTok icons in footer (mobile) — needs desktop addition

### `<SectionStarfield />`
- **Use:** Section-scoped drifting starfield behind atmospheric sections (homepage buy section primarily). See MOTION.md Part 5 for full technique.
- **Behavior:** Canvas, `position: absolute` filling a `position: relative` parent, low z-index, `pointer-events: none`, `mix-blend-mode: screen`, ~60% opacity. Stars drift upward and respawn at bottom. IntersectionObserver pauses the loop off-screen. `prefers-reduced-motion` renders a static field.
- **Props:** `density` (~0.00018), `accentRatio` (~0.18 cyan/magenta fraction), `maxSpeed` (~0.4)
- **Colors from tokens:** white `#F0F0F5`, cyan `#00E5FF`, magenta `#FF00E5`. Do NOT hardcode — pull from token values.
- **Note:** Re-implemented fresh in Next.js. The prototype `SectionStarfield.tsx` is reference for technique only.

### `<GlowOrb />`
- **Use:** Blurred background glow circles for "pools of color in the darkness" (e.g. behind the FAQ grid). See MOTION.md Part 5.
- **Visual:** Solid accent color div, `border-radius: 50%`, heavy blur (`blur-3xl`+), low opacity (10–25%), low z-index, `pointer-events: none`. Positioned off-center / partially off-screen.
- **Props:** `color` (purple default, cyan/pink options), `size`, `blur`, `opacity`, position offsets
- **Note:** Static. Often two overlapping orbs of different accents create a multi-color pool.

### A global atmospheric layer
Per MOTION.md, the site also has a **global** faint starfield + **film grain overlay** (SVG noise, 4–6% opacity, fixed, `mix-blend-mode: overlay`, `pointer-events: none`). These wrap the whole app (in `app/layout.tsx` or a client wrapper), distinct from the section-scoped `<SectionStarfield />`. Film grain is the single most important atmospheric element — implement it early.

---

## Component Inventory Summary

| Category | Count |
|----------|-------|
| Global / shared | 6 |
| Modals | 2 |
| Cart system | 5 |
| Homepage sections | 12 (added HomepageBuySection) |
| PDP (incl. reviews subsystem) | 15 |
| Engineering | 3 |
| Wholesale | 6 |
| About | 5 |
| Activate | 7 |
| Contact | 4 |
| Policies | 4 |
| Primitives + atmospheric | 13 |
| **Total** | **~82 components** |

---

## Open Component Questions

- **ReviewInfra integration path:** Path A (use widget as-is) or Path B (use data API, render our own UI)? Action item: email ReviewInfra to confirm if a read API exists.
- **AI Summary feature:** Is it built into ReviewInfra, or do we build it ourselves with a Claude API endpoint, or skip for v1?
- **Warranty period:** 30-day guarantee (homepage buy section + Figma) vs 6-month limited warranty (policies page). These conflict. Lock one figure and apply everywhere.
- **Free shipping threshold:** Homepage buy section shows "FREE SHIPPING UNLOCKED" on 2-Pack. Confirm the actual threshold (the old prototype used $100; with 2-Pack at $99.99 that's a near-miss — intentional or should the threshold be lower?).
- **PDP title:** Is "LITSABER OG +" the intentional product name, or is the `+` a typo?
- **2-Pack savings:** Shows "SAVE $20" but math is $19.99 — round up the label or keep?
- **Engineering kinetic animation:** Detailed spec needed; existing implementation reference or fresh pass?
- **Section 6 on Homepage:** Empty 1440×1820 frame between FAQs and Reviews — cut, design, or defer?
- **Danksaber FAQ question on Contact:** Keep direct competitor name, reframe, or remove?
- **Mobile vs Desktop footer drift:** Mobile has socials + "DESIGNED IN LA"; desktop doesn't. Update desktop?
- **Desktop wholesale CTA drift:** Still reads "MOQ 25 · 100+" — needs Figma fix to MOQ 5 / 80+.
- **Wholesale tier pricing:** Names locked (Initiate/Knight/Archon/Legend), but per-unit pricing for the new 4-tier system needs to be defined.
