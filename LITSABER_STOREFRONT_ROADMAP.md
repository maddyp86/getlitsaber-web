# Litsaber storefront roadmap

Version 1 · October 6, 2026 (last updated October 13, 2026)
Source: Ploy buyer journey and conversion audit (updated October 6, 2026) and the 90-day traffic and conversion analysis (v2).

This file is the working checklist for storefront changes. Work top to bottom. Check items off as they ship, and record the production deploy date next to each phase.

---

## How to use this file (instructions for Claude Code)

1. Before starting any phase, explore the repo and summarize the files you will touch. Wait for approval before large changes.
2. Work one phase at a time. Do not start the next phase until the current one is checked off or I tell you to.
3. Items marked **[OWNER]** need an answer or action from me. Do not guess these. Leave a clearly marked `TODO(owner)` and list it in your summary.
4. After each phase, give me: files changed, copy changes (old → new), tests added, anything ambiguous, and the exact commit or deploy you want recorded.
5. Never invent product claims, policy terms, timelines, or specs. Use only facts in this file, the repo, or ones I confirm.
6. Do not submit real payments, real addresses, or real customer data during testing. Use Shopify test mode or a development store. Live transaction checks are done by me.
7. Update the checkboxes in this file as you finish each item, and add the deploy date in the phase header.

---

## Fixed decisions (do not change or re-recommend)

- Single: $39.99, shown against a struck-through $49.99 (MSRP; no visible label, owner decision 2026-10-05, reconfirmed 2026-10-06), plus $5.99 shipping. This is the regular price, not a sale.
- Two Pack: $79.98, shown against a struck-through $99.98 (MSRP, no visible label), free shipping.
- No 3-, 4-, or 5-unit offer tiers.
- The $5 promo code and promo popup are removed. No replacement discount, popup, or email-capture offer.
- Keep the cart and Add to Cart as they are. Buy Now and the cart are both valid routes to checkout.
- The product has **10 colors**. Any reference to 12 is wrong.
- Spec pills: 41 ADDRESSABLE LEDS · 10 SELECTABLE COLORS · 3 INTERACTIVE MODES · 800 MAH BATTERY · ALUMINUM + BRASS BUILD · WARRANTY INCLUDED. Never use "NeoPixel." (Corrected 2026-10-06: the device has no steel; materials are aluminum, brass, plastic and silicone.)
- Positioning is durable, high-quality hardware, not a disposable battery. No unsupported claims (waterproof, indestructible, lifetime, etc.). Do not use "premium," "sale," "deal," "cheap," "affordable," "pen," or "cart battery" in customer copy.
- Keep the 21+ age gate. Fix its responsiveness only; never remove, hide, auto-confirm, or weaken it.
- No A/B tests. Traffic is too low. Ship changes and judge them directionally.
- No Star Wars or lightsaber references.

---

## Phase 0 · Verify what is already live

Earlier work (repricing, offer tiers, copy, spec pills) may be fully or partly deployed. Confirm before building on it.

- [x] Product page shows Single $39.99 (MSRP $49.99 struck through) + $5.99 shipping, and Two Pack $79.98 (MSRP $99.98 struck through) with free shipping.
- [x] No 3-, 4-, or 5-unit tiers anywhere, including structured data and emails. (Code and structured data verified. HubSpot emails are disabled or sent manually; Shopify notifications render order data, not hardcoded prices.)
- [x] $5 code, promo popup, and any banner offer are gone from code and templates. Report any discount codes still referenced so I can deactivate them in Shopify. (Only active Shopify code: LITFAM10, a deliberate exception. The /show-it-off $5 post-purchase rebate stays, owner decision 2026-10-06.)
- [x] Spec pills match the fixed list above, and the build pill reads ALUMINUM + BRASS BUILD (corrected 2026-10-06; the earlier "steel" wording was wrong).
- [x] Hero subhead and product showcase headline match the approved copy, if that change was shipped. (Shipped in #71.)
- [x] List anything from the earlier prompts that is not live yet. Do not redo shipped work. (Everything from #71 to #77 is live; production was on e5946f0 at verification, 2026-10-06.)

**Deploy date:** 10/6/2026

---

## Phase 1 · Fix now: make every promise agree (Ploy priority 1)

Goal: product page, cart, checkout handoff, policies, FAQ, About, and emails all say the same thing.

- [x] Shipping accordion: remove "free shipping on all US orders." Replace with the real rule: $5.99 on one unit, free on two or more.
- [x] Cart and cart drawer: replace "Free 14-day returns" with "14-day returns on unopened devices." linking to /policies/shipping-returns.
- [x] Shipping & Returns policy (/policies/shipping-returns), confirmed by owner. Make these edits and leave the rest of the policy unchanged:
  - Quick summary: replace with "We ship Monday through Friday from our warehouse in California, within 2 business days of your order. US orders ship via USPS Ground Advantage and typically arrive 2–5 business days after shipment. Returns are accepted for unopened, unused products within 14 days of delivery. You cover return shipping for change-of-mind returns; we cover it when an item arrives damaged, defective, or incorrect. Defective devices are also covered under our 6-month limited warranty."
  - Section 01 Shipping, first two paragraphs: replace "Due to high order volume, please allow up to 5 business days for order processing..." and "Please allow up to 7 business days for delivery after shipment." with: "Orders ship within 2 business days, Monday through Friday, excluding US holidays. We ship all US orders via USPS Ground Advantage. Delivery typically takes 2–5 business days after shipment. Delivery times are estimates and are not guaranteed once your order is with the carrier." Keep the tracking, rerouting, and carrier paragraphs that follow.
  - Section 05 Sale Items: keep the existing text and add at the end: "Our regular price is shown alongside the manufacturer's suggested retail price (MSRP). Purchases at our regular price are not sale purchases and are eligible for returns under the terms above."
- [x] Warranty policy (/policies/warranty): the intro says "we'll repair or replace it," but section 01 offers replacement only. Change the intro to: "If your device has a defect, contact us and we'll replace it at no cost." Six-month term confirmed by owner; leave the rest unchanged.
- [x] Site footer tagline currently reads "An interactive glowstick that hits 510 carts." Replace with: "An interactive 510 battery built for festivals, nightlife, and the moments worth being lit for." (Glowstick framing conflicts with the durable-hardware positioning.)
- [x] Dispatch and arrival: list every existing claim (24-hour dispatch, same-day fulfillment, 1–2 business days, up to 5 during launches, 5–7 or 2–5 days in transit) with file and line, then replace each with the confirmed wording below. Confirmed by owner: orders ship within 2 business days via USPS Ground Advantage; transit is typically 2–5 business days within the US.
  - Product page, near the price: "Ships within 2 business days."
  - Shipping accordion and FAQ: "Orders ship within 2 business days. Once shipped, delivery typically takes 2–5 business days within the US via USPS Ground Advantage. You'll get tracking by email when your order ships."
  - Shipping policy: "We ship orders within 2 business days of purchase, excluding weekends and US holidays. We ship US orders with USPS Ground Advantage, and transit typically takes 2–5 business days after shipment. Delivery times are estimates and are not guaranteed once the order is with the carrier."
  - About page: replace "same-day fulfillment" with "Orders ship within 2 business days."
  - Homepage: replace any "ships in 24 hours" claim with "Ships in 2 business days."
  - Remove "up to 5 days during launches or sales" and any other dispatch window that conflicts with the above.
- [x] Colors: change every reference to 12 colors to 10 (product page, The Tech, FAQ, meta descriptions, alt text).
- [x] Compatibility: replace "If it's 510, it works" and any absolute compatibility claims with the verified statement already in the specs or FAQ (about 95–99% of 510 carts, with diameter and contact caveats). **[OWNER]** confirms the statement.
  - `COMPATIBILITY_STATEMENT` in `components/product/specs.content.ts`, owner wording 2026-10-06: "Compatible with live resin, rosin, distillate and liquid diamonds. Has a 4.0mm pin depth, tuned for 95 to 99% cart compatibility. If it's 510, it likely works."
  - Owner follow-ups 2026-10-06: homepage FAQ 01 glowstick line replaced; Terms section 08 now replacement only; "UNIVERSAL 510 THREADING" kept; shipping policy keeps the section 01 wording.
- [x] About page: replace the past Gold launch date with "Coming soon."
- [x] Warranty: wherever warranty is mentioned on product, FAQ, and cart surfaces, describe it as a 6-month limited warranty against manufacturing defects, with replacement (not refund), linking to /policies/warranty.
- [x] Add a test or script that checks the product page, cart, and policy pages for the old strings ("Free 14-day returns," "free shipping on all US orders," "12 colors," "$45.99," "$44.99," "$89.99") and fails if any reappear.
  - `components/storefront-promises.test.ts` (source, runs in `pnpm test`) and `pnpm check-promises <url>` (rendered pages). Patterns in `lib/copy/retiredClaims.ts`.

**Done when:** a scripted walkthrough of both offers from product page to checkout handoff finds zero mismatches in price, shipping, returns, dispatch, colors, or compatibility.

*Verified 2026-10-06 on preview `get-litsaber-mvu88bi6c` (commit 8ffdb90): `pnpm check-promises` clean on 9 pages; Single and Two Pack each reached Shopify checkout via Add to Cart and via Buy Now with the right units and subtotal ($39.99 x1, $79.98 x2). Shipping in checkout needs an address, so it is verified in Phase 4.*

**Deploy date:** 10/6/2026

---

## Phase 2 · Fix now: product media works on the first tap (Ploy priority 2)

Goal: images, gallery navigation, and video respond the first time someone tries them, on desktop and mobile.

- [ ] **[OWNER]** Before code changes: I will watch the five most active product-page replays from the last 30 days in PostHog and note exactly what people clicked. Recordings expire after 30 days, so this happens first. Add my notes here: ____
- [x] Inventory every element in the product gallery and media area: images, thumbnails, arrows, swatches, video, play controls. For each, record whether it is meant to be interactive and whether it works.
- [x] Make image zoom or lightbox work on click and tap.
- [x] Make gallery navigation work by arrows, thumbnails, and swipe on mobile.
- [x] Make the video play in place on the first tap, with a visible loading state and an error fallback.
- [x] Remove play, zoom, or hover styling from anything that is not actually interactive, so it does not invite clicks.
- [x] Repair existing controls where possible. Do not replace the gallery library unless the current one cannot be fixed; explain why first.
- [x] Test on a fresh load, on a throttled (slow CPU and network) profile, and at 375px, 768px, and 1440px widths.

*Findings and results 2026-10-06 (branch `fix/product-media`). No replay notes were added, so PostHog dead and rage clicks stood in: 18 dead clicks on the main video (all but one before the Oct 5 autoplay fix, #65) and rage clicks on the Next arrow.*

| Element | Meant to be interactive | Before | Now |
|---|---|---|---|
| Main photo | Yes (zoom) | Lightbox opened; tapping the photo inside did nothing under a zoom-out cursor | Lightbox; tap zooms 2.5x at that point, move to pan, tap again to zoom out |
| Lightbox | Yes | Escape and backdrop only; no navigation; focus not managed | Prev/next buttons, arrow keys and swipe between photos; focus moves in, stays in, returns |
| Prev/next arrows | Yes | Worked, but the next photo loaded only on tap, blanking the viewer (repeated taps) | Neighbours preloaded after the photo on screen; spinner if still loading after 250ms; visible on keyboard focus on desktop |
| Swipe on the photo | Yes (mobile) | Not implemented | Left/right swipe; vertical scroll untouched; off while a clip plays (seek bar) |
| Thumbnails | Yes | Worked; strip did not follow the active slide | Strip follows; tiles load only when visible (they are full-size originals) |
| Video thumbnails (play icon) | Yes | Play icon only selected the clip; a second tap played it | First tap selects and plays in place |
| Main video play overlay | Yes | Worked, with loading state | Same; plus error fallback "Video didn't load. Tap to retry" |
| Spec pills, style swatches | Yes | Pills open Tech Specs; swatches select a style | Unchanged (honest styling) |

*Tested on the preview at 375, 768 and 1440px, fresh load, normal and throttled (4x CPU, ~1.6Mbps, 150ms): every control acknowledged the first tap; lightbox opens in under 15ms; a video thumbnail shows "Loading" at once and frames play in 8 to 51ms once buffered; a blocked clip shows the retry message; no horizontal overflow, no page errors. Throttled, Next draws the next photo in 2.0 to 2.8s (image 1 previously did not draw within 15s).*
*Found and fixed during testing: tapping the zoomed photo crashed and unmounted the whole page (a React event read inside a state updater); a gallery error boundary now keeps the buy controls alive if the gallery ever fails. The first slide's preload wrapped to the last photo, a 14MB file.*
- *Image weight (resolved 2026-10-06, #84): `images.unoptimized: true` (since June 23) served original files; the 24 photos totalled 28MB, six close-ups 1.7 to 13.8MB. Owner chose to turn image optimization back on, so Vercel now resizes each photo to its rendered width.*

**Done when:** every intended media interaction works on the first attempt in repeated desktop and mobile testing, including slow-device conditions.

**Deploy date:** 10/6/2026 (gallery #82; image optimization re-enabled #84, same day)

---

## Phase 3 · Fix now: product page responds quickly (Ploy priority 3)

Goal: the product page reacts promptly to clicks and taps. Field data showed p75 INP of 752 ms on desktop and 326 ms on mobile (small samples).

- [x] Profile the slow interactions (gallery, swatches, offer selection, quantity, Add to Cart, Buy Now) using performance traces. For each, separate input delay, handler processing, and rendering time.
- [x] Identify long main-thread tasks, hydration timing, gallery initialization, and third-party scripts (analytics, reviews widget, replay recorder, age gate).
- [x] Defer or lazy-load anything not needed for the first purchase decision. Keep offer selection, Add to Cart, and Buy Now ready as early as possible.
  - *Evaluated 2026-10-11: nothing needed deferring. A tap on an offer during page load responds in 32 ms on the throttled phone profile, and long-frame traces show no first-party or third-party script hot spot to move.*
- [x] Fix the measured bottleneck. Do not do a cosmetic redesign as a performance fix.
  - *#87: lighter lightbox (solid backdrop, no full-screen blur; a quarter of the pixels to decode on phones), and zoomed panning drags 1:1 under the finger without re-rendering the gallery on every move.*
- [x] Keep layout stable (CLS is currently near zero; do not regress it).
  - *#87 changes only the fixed-position lightbox overlay, which cannot shift page layout. Field CLS to be confirmed with the INP check.*
- [x] Report before and after trace timings for each control. (Table below; after #87 on the phone profile: Add to Cart 104 → 80 ms, every other control 24 to 56 ms.)

*Findings 2026-10-11 (branch `perf/pdp-inp`):*
- *The 752 / 326 ms field numbers predate the October 6 fixes (#82 gallery, #84 image optimization). Before then: desktop p75 240 ms (37 samples), mobile 326 ms (16). Since: desktop 3 samples, all under 70 ms; mobile 4 samples, two slow, both iPhones in the gallery: 1,096 ms on Safari (1,064 ms of it handler processing, target already removed from the page) and 272 ms on Chrome iOS opening the lightbox (249 ms input delay, the main thread busy before the tap).*
- *PostHog INP attribution (element, input delay, processing, presentation) is already on: posthog-js 1.438 enables it by default. Nothing to change.*
- *Lab, local production build, real taps through Chrome DevTools Protocol, 5 fresh loads each. Median ms, phone at 4x CPU and ~1.6 Mbps / desktop at 2x CPU:*

| Control | Phone | Desktop |
|---|---|---|
| Add to Cart | 104 | 48 |
| Gallery arrow, thumbnails | 32 to 56 | 16 to 48 |
| Lightbox open, zoom, next, close | 24 to 56 | 16 to 40 |
| Styles, offers, spec pills, accordion | 24 to 48 | 16 to 24 |
| Buy Now | 56 | 16 |
| Tap during load (hydration) | 32 | 32 |

- *About one fresh load in five had a single 250 to 420 ms tap, each time while a photo size was being fetched and decoded for the first time; not reproducible on demand. Long-frame attribution shows no first-party script hot spot, so nothing was deferred or split.*
- *Change (iPhone hypothesis, not proven in the lab): the lightbox backdrop is solid black instead of 97% black + full-screen `backdrop-blur` (same look; the blur is costly to paint in Safari), and the lightbox requests 1920w instead of 3840w on a 3x phone (14.7 → 3.7 megapixels to decode per photo, ~104 → 36 KB), 2048w instead of 3840w on retina desktop. After: Add to Cart 80 ms, everything else 24 to 56 ms on the phone profile.*
- *Owner confirmed 2026-10-12 the 1,096 ms Safari sample was not internal (it arrived from a ChatGPT link), so it is a real shopper.*
- *Real iPhone, 2026-10-12 (iOS 18.7, Safari 27, preview with the #87 changes, tap timing readout from #88): worst tap 112 ms (starting the unboxing video: 57 ms processing, 55 ms presentation); closing the lightbox 40 ms; lightbox, arrows and thumbnails 32 to 48 ms. The 1,096 ms tap did not reproduce. The first taps of the run (age gate, first arrows, first lightbox open) were cut by a 12-row limit, since fixed; a fresh-load run is still to do.*
- *Tap timing readout (#88): open any Vercel preview URL with `?perf=1` to see each tap's input delay, processing and presentation on a real phone; `copy` exports the log. Never renders in production.*
- *Still open: field p75 INP at or below 200 ms on desktop and mobile, with sample counts and the slow samples' `interactionTarget`, 2 to 3 weeks after deploy (first check around 2026-10-26).*

**Done when:** reproduced interactions respond promptly in traces, with a target of p75 INP at or below 200 ms on both devices in field data over the following weeks. Report sample counts with any field numbers.

**Deploy date:** 10/11/2026 (#87; field check pending, so the phase stays open)

---

## Phase 4 · Fix now: checkout works end to end (Ploy priority 4)

Goal: confirm both routes (Buy Now and cart) reach a correct checkout, and fix anything broken. 8 people started checkout in the 90-day window and 3 orders were paid.

- [x] Map both checkout routes in code: Buy Now from the product page and checkout from the cart. Confirm each passes the correct offer, quantity, and line items to Shopify.
- [x] Confirm no old discount, old tier price, or extra unit can reach checkout from either route.
- [x] Show an accurate estimated total (product plus shipping, labeled "before tax") on the product page and in the cart before handoff.
- [x] Confirm returning from checkout to the storefront keeps the selected offer and cart state.
- [x] In a development store or Shopify test mode only: run Single and Two Pack through both routes, with guest checkout, a valid address, an invalid address, and a declined test card. Record each result.
  - *Owner, Shopify test mode, 2026-10-13: #1042 Single via Add to Cart: 1 unit, $39.99 + $5.99 Standard (USPS Ground) + $4.10 tax = $50.08. #1043 Two Pack via Buy Now: 2 units, $79.98, Free Shipping (USPS Ground), $8.20 tax = $88.18. Both `test: true`, no discount, `_shipping_variant=surcharge`, correct `_fulfillment_sku`. PostHog: one `purchase` per order, both `is_internal`, both browsers' persons flagged internal; #1043's `checkout_started` has `route: buy_now`, 2 units. Invalid-address and declined-card cases not run.*
- [x] **[OWNER]** I will run at least one real end-to-end order (Single and Two Pack) on the live site and refund it, then confirm shipping and tax show correctly.
  - *Done in Shopify test mode on the live site (#1042, #1043 above), not with a real card (owner decision 2026-10-13). Units, shipping and tax confirmed; the real Authorize.net charge step was not exercised.*
- [x] Fix any reproduced failure. Do not change checkout platform or payment gateway.

*Findings 2026-10-13 (#90, branch `fix/checkout-phase4`):*
- *Cart route (drawer and cart page): hands off exactly the cart's lines, with the `?discount=` affiliate code appended. No change.*
- *Buy Now: **bug, reproduced on the live checkout page.** It added the selected offer to the shopper's persisted cart and checked out everything in it: one unit already in the cart + Single + Buy Now reached checkout as 2 units, $79.98 (5 in the cart would hand off 5). It also dropped the `?discount=` code. Owner decision: Buy Now checks out only the selection. It now builds a one-off Shopify cart with exactly the selected units (same attribution and shipping stamp), leaves the cart alone, and keeps the discount passthrough.*
- *Shopify: Silver $39.99, compare-at $49.99; the only active discount is LITFAM10 (owner exception). No tier price or retired code can apply.*
- *Totals: PDP shows "Est. total $45.98 before tax" (Single) / "$79.98" (Two Pack) under the offers; drawer and cart page say "Estimated total · before tax" next to "Estimated tax: at checkout".*
- *Return from checkout: the PDP remembers the selected offer for the tab session; a page restored from the back/forward cache re-reads the cart from Shopify.*
- *Verified on the #90 preview against the live Shopify checkout (no details entered): one unit in the cart, Buy Now Single → checkout 1 unit, $39.99; back → Single still selected, cart unchanged; Buy Now Two Pack → 2 units, $79.98; back and reload → Two Pack still selected. Cart route verified in Phase 1 ($39.99 x1, $79.98 x2).*
- *Not done by Claude: the address and card cases. Checkout runs on the live payment gateway, so invalid address, declined card and shipping/tax checks are part of the owner's live test order below.*
- *Observation for the owner: Shopify checkout pre-ticks "Email me with news and offers" (a Shopify checkout setting, not storefront code).*

**Done when:** every tested route produces the correct units, price, shipping, and total, and failures are fixed or listed.

**Deploy date:** 10/13/2026 (#90)

---

## Phase 5 · Fix now: age gate responds on the first tap (Ploy priority 5)

Goal: "I AM 21+" acknowledges a valid tap or keypress immediately. 12 real visitors had a click on it flagged as unresponsive.

- [x] Check whether the button is clickable before its script is ready, and whether a first tap can be lost on mobile.
- [x] Give immediate visual feedback on tap or press.
- [x] Confirm keyboard confirmation and focus work.
- [x] Prevent duplicate handling of the same confirmation.
- [x] Keep the same age requirement, explicit confirmation, and persistence behavior.

*Findings and results 2026-10-06 (branch `fix/age-gate-first-tap`):*
- *Cause: the gate mounted after React hydrated, so on a throttled phone it appeared ~5.7 s after load, ~3.3 s after the page painted, leaving the site visible and tappable without it. The 17 PostHog `$dead_click`s on "I AM 21+" (90 days, 16 non-internal) were each followed by that visitor's `age_gate_confirmed` within ~0.5 s: the tap worked, but the dialog was removed in the same task, so PostHog saw no change after the click.*
- *Fix: gate server-rendered and shown by default (fail-closed); a head script hides it before paint for verified visitors; an inline handler confirms from first paint with an immediate pressed state, ignores repeat taps, and closes on the next frame; Exit is a plain link; Tab stays in the gate.*
- *Throttled mobile (4x CPU, slow 3G-class network), 5 fresh visits, median (max): gate visible at 5,673 (5,686) ms → 1,450 (1,797) ms, now before first paint; tap input delay 110 (145) → 65 (104) ms; tap to gate closed 156 (201) → 88 (145) ms. All 10 visits confirmed on the first tap. Desktop worst tap 336 → 56 ms.*

**Done when:** a first tap or keypress is acknowledged every time in repeated testing on desktop and mobile, with no change to the gate's requirement.

*Follow-up 2026-10-12 (branch `fix/age-gate-blocked-cookies`): found through the homepage INP data. Since the October 6 change, 10 of 11 sessions that clicked "I AM 21+" got through on the first click; one (Windows Chrome, from chatgpt.com, Oct 7) clicked it 234 times over 90 minutes, reloaded ~15 times and never got in. Reproduced: with cookies blocked, a confirm before hydration closed the gate, then the controller found no cookie and showed it again, and the inline handler dropped every later tap as a duplicate. Separately, where reading cookies throws (sandboxed or embedded views), the controller crashed the whole site. Fix: a confirmation on this page counts even if the cookie could not be saved; cookie reads and writes cannot throw; a tap on a gate that is showing again closes it, still with one confirmed event. Requirement unchanged: explicit tap, fail-closed, a new page load asks again when there is no cookie, 30-day cookie when cookies work.*

**Deploy date:** 10/6/2026

---

## Phase 6 · Fix now: measurement we can trust (Ploy priority 6)

Run alongside Phases 1–5 so the next review is usable.

- [x] Capture page views on in-site navigation (route changes), without double-counting the initial load.
- [x] Separate product-page exposure from homepage product-module exposure, for example with a `surface` property on `product_viewed` ("product_page" or "homepage_module").
- [x] Record `cart_add_to_cart` only on successful additions.
- [x] Record a checkout handoff event for both routes with `route` ("buy_now" or "cart"), `offer_selected` ("single" | "two_pack" | "custom_qty"), `item_count`, and estimated `shipping_amount`.
- [x] Fire exactly one `purchase` event per paid Shopify order, deduplicated by order ID, linked to the same PostHog person who browsed the storefront. Include `order_id`, `subtotal`, `shipping_amount`, `item_count`, and `offer_selected`.
- [x] Never send customer names, emails, addresses, phone numbers, or payment details to PostHog.
  - *Owner decision 2026-10-06: exception for email. The orders webhook sets the paid order's email on the buyer's PostHog person (person property only, never on events or from the storefront). Names, addresses, phones and payment details still never go.*
- [x] Treat getlitsaber.com and checkout.getlitsaber.com as one site for attribution, so returns from checkout are not counted as new referrals and the original source carries through.
- [x] Tag the packaging QR code and activation insert links with consistent UTMs, and add an `is_owner_visit` marker for activation pages.
- [x] Mark internal and test traffic with the internal-user property, including test checkouts, instead of relying on one email and one order ID.
  - *2026-10-06: PostHog's internal/test filter now also excludes events with `is_internal` = true (test-mode orders, carts from `?internal=` browsers, Shopify customers tagged internal or test). The old email and order-id rules stay only so past data stays filtered.*
- [x] Find out why the 90-day window had 6 people with a purchase event against 3 paid Shopify orders, and report the cause.

*Findings and results 2026-10-06 (branch `fix/measurement`):*
- *Pageviews: 27 of 43 sessions (63%) that reached the PDP in the last 30 days had no PDP pageview; client-side navigation was not captured. Now `capture_pageview: "history_change"`; fires only when the path changes, so the first load is not counted twice.*
- *`product_viewed` already carried `surface` (`pdp` / `homepage_buy`, live since before this phase); values kept so the weekly agent's boards keep working.*
- *`cart_add_to_cart` already fired only after Shopify confirmed the add; verified, no change.*
- *`checkout_started` is the handoff event on all three buttons, with `route` (`buy_now` / `cart`), `offer_selected`, `item_count`, `shipping_amount`.*
- *Purchase: once per paid order (`financial_status: paid`; checkout captures at purchase), deduped by order id, on the browsing visitor's anonymous id. Test-mode orders, carts from internal browsers (`_internal` cart attribute) and Shopify customers tagged `internal` or `test` are marked `is_internal` and set `$internal_or_test_user`.*
- *Personal data: the storefront and both webhooks sent email to PostHog (`identify` with email; email on `rebate_refund_granted`; names, email and post link on `rebate_form_submitted`). All removed; PII query parameters are stripped from every URL property.*
- *6 purchase-event people vs 3 paid orders: the 3 real buyers (#1037, #1040, #1041) plus test orders placed through the live checkout and later deleted in Shopify (deleting an order never retracts its event). #1035, #1038 and #1039 had no visitor id on the cart, so each fallback `order_<id>` id became its own person; #1030 to #1032 came from an owner test browser that was never flagged internal (#1033 to #1034 were flagged). That is 7 non-internal people in a strict 90-day window, or 6 if the window starts after the morning of July 14. #1040 was also counted 3 times before the August idempotency fix (events, not people).*
- *Controlled test journey on the preview (PostHog project "Litsaber - Test", which previews report to): one event per action, return from checkout carried the original source, owner visit marked, no email in any event.*
- **[OWNER]** *Approve the PostHog internal/test filter change (see summary). Printed QR codes: 38 people reached a bare `/activate` with no UTMs; confirm which printed item carries it. Use `/qr/box`, `/qr/insert`, `/qr/rebate` for future print runs.*

**Done when:** a controlled test journey produces one correct event per action and one purchase event per paid order, and owner, shopper, and internal traffic can be separated.

**Deploy date:** 10/6/2026

---

## Phase 7 · Build next: decision block beside the purchase controls (Ploy priority 7)

Goal: a shopper can understand fit, contents, cost, delivery, returns, and warranty without leaving the buy area.

- [x] Add a compact block directly under the price and offer selector covering:
  - Compatibility (the verified statement from Phase 1)
  - What's in the box **[OWNER]** confirms contents
  - Shipping for the selected offer and the dispatch and arrival estimate from Phase 1
  - Returns summary and warranty, each linking to its policy
  - Build facts (aluminum and brass build, 41 addressable LEDs, 10 selectable colors, 3 interactive modes, 800 mAh battery)
  - A link to the review summary
- [x] Use supported facts only. No superlatives or unsupported durability claims.
- [ ] **[OWNER]** confirms the reviews shown are from real buyers. If any are not, they come down before the review link goes in.
- [x] Keep it short enough that the Add to Cart and Buy Now buttons stay near the top on mobile.

*2026-10-13: a five-row block under the buy buttons shipped in #92, then was replaced at the owner's call because four rows repeated the dropdowns directly below (fit is in Product Features and Tech Specs; shipping, returns and warranty each have a tab; the selected offer's shipping is already on the offer card and the estimated total). The only new fact, the box contents, is now its own dropdown, "What's in the Box", after Tech Specs: Litsaber OG, quick start guide, QR code to the activation page; no charging cable, any USB-C cable works (owner: no cable by design). The one-line trust strip is back under the buttons, so Add to Cart and Buy Now stay where they were on mobile. Every fact is one tap from the buy area. No review link: reviews are hidden until they come from verified buyers (#93).*

**Done when:** every fact in the block matches the policies and specs, and purchase buttons are not pushed further down on mobile.

**Deploy date:** 10/13/2026 (#92; box contents moved to a dropdown in the follow-up)

---

## Phase 8 · Build next: lead with the device lit (Ploy priority 8)

- [x] **[OWNER]** supplies the lit-device hero image and a short demonstration clip (under 15 seconds, muted autoplay-friendly).
  - *In the gallery (owner, 2026-10-13): lit rainbow handheld photo, and the 7.6s light-show clip (`pdp/lightshow-pdp.mp4`, 3MB).*
- [x] Make the first gallery item the device lit, and the second a short in-place demonstration. Keep packaging and detail shots after them.
  - *2026-10-13: the light-show clip moved from slot 7 to slot 2; packaging and detail shots follow.*
- [x] Reduce gallery height on mobile so the offer selector and purchase buttons are reachable sooner, without hiding them.
  - *Main viewer 4:3 below 1024px (square on desktop). Add to Cart 1,371 → 1,288px at 375px, 1,366 → 1,280px at 390px; desktop unchanged. Tried the Silver/Gold cards side by side on mobile too: labels clipped, reverted.*
- [x] Apply the same order on desktop. (One gallery list serves both.)
- [x] Point the homepage "See It in Motion" button to the product demonstration rather than lifestyle storytelling, or confirm with me first if you think it should stay.
  - *Owner chose the Three Modes section (2026-10-13). It is lazy-mounted, so its anchor now sits on the always-present wrapper; verified landing at 375 and 1440px, with and without scroll anchoring.*

**Done when:** the first thing a shopper sees is the device lit, the demo plays in place, and purchase controls are reachable sooner on mobile.

**Deploy date:** ____

---

## Phase 9 · Build next: switch offers in the cart (Ploy priority 9)

- [ ] In the cart and cart drawer, let shoppers switch between Single and Two Pack (or adjust quantity), keeping Remove.
- [ ] Keep price, shipping, and checkout quantity in sync after every change.
- [ ] Label totals as estimated before tax.
- [ ] Do not recreate 3-, 4-, or 5-unit tiers.

**Done when:** switching offers shows the right units, price, and shipping, and the same values reach checkout.

**Deploy date:** ____

---

## Phase 10 · Build next: show the modes working on the product page (owner request, 2026-10-13)

Goal: shoppers see each mode working on the product page, not only read about it. Prompted by a review of competitor product pages (Vessel, Smyle Labs Danksaber), which show the device working below the buy area.

- [x] A "Three modes" section on the PDP, below the description and above the dropdowns, with each mode's title and copy beside a muted loop of that mode. Reuses the homepage modes content and clips.
- [x] Nothing moves near the buy buttons (Add to Cart 1,288px at 375px, 815px at 1440px, unchanged).
- [x] Clips load only when the section nears the viewport and pause off screen; reduced-motion visitors see the still poster.
- [x] `pdp_modes_viewed` fires once when the section is seen, so reviews can show how many product-page visitors reach it.
- [ ] **[OWNER]** Optional: a ~10s trim of the Glowstick clip (currently 34.6s, 6.2MB; the other two are 12.7s and 7.4s).

**Done when:** the section plays on phone and desktop without slowing the buy controls, and the next weekly review reports how many product-page visitors reached it.

**Deploy date:** ____

---

## Not in scope right now

- A/B tests or experiments of any kind.
- New discounts, popups, or email-capture offers.
- Removing the cart or Add to Cart.
- Changing checkout platform or payment gateway.
- Changes to wholesale or distributor pricing, or to B2B materials.
- Paid acquisition or marketing work.

---

## Owner checklist (answers needed from me)

- [x] True dispatch window and arrival estimate (Phase 1): ships within 2 business days, USPS Ground Advantage, 2–5 business days transit
- [x] Return-policy wording for the regular-price clarification (Phase 1): 14-day returns on unopened devices; wording in Phase 1
- [x] Verified compatibility statement (Phase 1)
- [x] Confirm warranty term (Phase 1): 6-month limited warranty, replacement only
- [x] Watch the five most active product-page replays before they expire (Phase 2)
- [x] Live test orders, Single and Two Pack, then refund (Phase 4): run in Shopify test mode, #1042 and #1043
- [x] Confirm box contents (Phase 7)
- [ ] Confirm review provenance (Phase 7)
- [x] Supply lit-device image and demonstration clip (Phase 8)
- [ ] Confirm whether the 3 modes respond to use; if not, change the pill to "3 LIGHT MODES"
- [ ] Explain the July 13 activation spike and missing orders #1038 and #1039, for the next analysis

---

## How we will judge progress

- Record the deploy date for each phase. If several ship together, results cannot be attributed to any one change.
- Each phase is first judged by direct testing: controls work, prices and terms match, events fire once.
- Review weekly: product-page shoppers, successful media interactions, cart additions, checkout handoffs by route, and paid orders matched to Shopify. Always show counts, not just percentages, and keep owner traffic separate.
- First directional checkpoint 30 days after Phases 1–6 deploy. Extend to 60–90 days if numbers are still small. No winner claims.
