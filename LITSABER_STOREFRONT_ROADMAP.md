# Litsaber storefront roadmap

Version 1 · October 6, 2026
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
- **[OWNER]** *Image weight: `images.unoptimized: true` (since June 23) serves original files; the 24 photos total 28MB, six close-ups are 1.7 to 13.8MB (litsaber-button-2.jpg is 13.8MB). Decide: turn image optimization back on, or recompress those six and add small thumbnail files.*

**Done when:** every intended media interaction works on the first attempt in repeated desktop and mobile testing, including slow-device conditions.

**Deploy date:** 10/6/2026 (gallery #82; image optimization re-enabled #84, same day)

---

## Phase 3 · Fix now: product page responds quickly (Ploy priority 3)

Goal: the product page reacts promptly to clicks and taps. Field data showed p75 INP of 752 ms on desktop and 326 ms on mobile (small samples).

- [ ] Profile the slow interactions (gallery, swatches, offer selection, quantity, Add to Cart, Buy Now) using performance traces. For each, separate input delay, handler processing, and rendering time.
- [ ] Identify long main-thread tasks, hydration timing, gallery initialization, and third-party scripts (analytics, reviews widget, replay recorder, age gate).
- [ ] Defer or lazy-load anything not needed for the first purchase decision. Keep offer selection, Add to Cart, and Buy Now ready as early as possible.
- [ ] Fix the measured bottleneck. Do not do a cosmetic redesign as a performance fix.
- [ ] Keep layout stable (CLS is currently near zero; do not regress it).
- [ ] Report before and after trace timings for each control.

**Done when:** reproduced interactions respond promptly in traces, with a target of p75 INP at or below 200 ms on both devices in field data over the following weeks. Report sample counts with any field numbers.

**Deploy date:** ____

---

## Phase 4 · Fix now: checkout works end to end (Ploy priority 4)

Goal: confirm both routes (Buy Now and cart) reach a correct checkout, and fix anything broken. 8 people started checkout in the 90-day window and 3 orders were paid.

- [ ] Map both checkout routes in code: Buy Now from the product page and checkout from the cart. Confirm each passes the correct offer, quantity, and line items to Shopify.
- [ ] Confirm no old discount, old tier price, or extra unit can reach checkout from either route.
- [ ] Show an accurate estimated total (product plus shipping, labeled "before tax") on the product page and in the cart before handoff.
- [ ] Confirm returning from checkout to the storefront keeps the selected offer and cart state.
- [ ] In a development store or Shopify test mode only: run Single and Two Pack through both routes, with guest checkout, a valid address, an invalid address, and a declined test card. Record each result.
- [ ] **[OWNER]** I will run at least one real end-to-end order (Single and Two Pack) on the live site and refund it, then confirm shipping and tax show correctly.
- [ ] Fix any reproduced failure. Do not change checkout platform or payment gateway.

**Done when:** every tested route produces the correct units, price, shipping, and total, and failures are fixed or listed.

**Deploy date:** ____

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

- [ ] Add a compact block directly under the price and offer selector covering:
  - Compatibility (the verified statement from Phase 1)
  - What's in the box **[OWNER]** confirms contents
  - Shipping for the selected offer and the dispatch and arrival estimate from Phase 1
  - Returns summary and warranty, each linking to its policy
  - Build facts (aluminum and brass build, 41 addressable LEDs, 10 selectable colors, 3 interactive modes, 800 mAh battery)
  - A link to the review summary
- [ ] Use supported facts only. No superlatives or unsupported durability claims.
- [ ] **[OWNER]** confirms the reviews shown are from real buyers. If any are not, they come down before the review link goes in.
- [ ] Keep it short enough that the Add to Cart and Buy Now buttons stay near the top on mobile.

**Done when:** every fact in the block matches the policies and specs, and purchase buttons are not pushed further down on mobile.

**Deploy date:** ____

---

## Phase 8 · Build next: lead with the device lit (Ploy priority 8)

- [ ] **[OWNER]** supplies the lit-device hero image and a short demonstration clip (under 15 seconds, muted autoplay-friendly).
- [ ] Make the first gallery item the device lit, and the second a short in-place demonstration. Keep packaging and detail shots after them.
- [ ] Reduce gallery height on mobile so the offer selector and purchase buttons are reachable sooner, without hiding them.
- [ ] Apply the same order on desktop.
- [ ] Point the homepage "See It in Motion" button to the product demonstration rather than lifestyle storytelling, or confirm with me first if you think it should stay.

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
- [ ] Live test orders, Single and Two Pack, then refund (Phase 4)
- [x] Confirm box contents (Phase 7)
- [ ] Confirm review provenance (Phase 7)
- [ ] Supply lit-device image and demonstration clip (Phase 8)
- [ ] Confirm whether the 3 modes respond to use; if not, change the pill to "3 LIGHT MODES"
- [ ] Explain the July 13 activation spike and missing orders #1038 and #1039, for the next analysis

---

## How we will judge progress

- Record the deploy date for each phase. If several ship together, results cannot be attributed to any one change.
- Each phase is first judged by direct testing: controls work, prices and terms match, events fire once.
- Review weekly: product-page shoppers, successful media interactions, cart additions, checkout handoffs by route, and paid orders matched to Shopify. Always show counts, not just percentages, and keep owner traffic separate.
- First directional checkpoint 30 days after Phases 1–6 deploy. Extend to 60–90 days if numbers are still small. No winner claims.
