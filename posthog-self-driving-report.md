# PostHog Self-driving Setup Report

**Project:** Litsaber - Live (id: 480206)  
**Date:** 2026-07-13  
**Run by:** Claude Code (self-driving-setup skill v1.29.1)

## Summary

PostHog Self-driving has been configured for getlitsaber.com. Error tracking, session replay, support, and GitHub Issues signal sources are now active; the scout coordinator picks up fresh configs within ~30 minutes, after which findings will start appearing in the Self-driving inbox at https://us.posthog.com/project/480206/inbox.

---

## AI data processing

**Approved.** Organization-level AI data processing approval was confirmed before this run started (enforced by the wizard gate).

---

## GitHub

**Already connected** (integration id: 178530, account: maddyp86). No action required — the integration was in place from a prior setup on 2026-06-22.

---

## Products enabled

The `products-enable` API tool was unavailable in this PostHog deploy. Products were confirmed active via server-side probes and the existing client init.

| Product | Status | Notes |
|---|---|---|
| Session Replay | **Active (confirmed)** | Recordings exist (probe returned a recording from today). `posthog.init` has no `disable_session_recording` override — server settings are honored. |
| Error Tracking | **Active (confirmed)** | 1+ active error issues found. `capture_exceptions` is explicitly enabled in `app/providers.tsx`. |
| Support (Conversations) | **Enabled (dormant)** | Source row created. Tickets will only arrive once an inbound channel (email / inbox / Slack) is connected in PostHog. See follow-ups. |

**`posthog.init` check** (`app/providers.tsx`): clean — no `disable_session_recording: true`, no `capture_exceptions: false`. Both products are fully active client-side.

---

## Signal sources

| source_product | source_type | Action | Config ID |
|---|---|---|---|
| `signals_scout` | `cross_source_issue` | **On by default** — no row needed; the scout gate is always active | — |
| `error_tracking` | `issue_created` | **Enabled** | `019f5d42-a03c-752f-9b18-a3446009540b` |
| `error_tracking` | `issue_reopened` | **Enabled** | `019f5d42-a4a7-75d9-b336-be040a379486` |
| `error_tracking` | `issue_spiking` | **Enabled** | `019f5d42-a89d-7fd0-9893-a7c198069d3b` |
| `session_replay` | `session_analysis_cluster` | **Enabled** (sample_rate: 0.1 server default) | `019f5d42-ac82-791e-90f3-534c2ae37ca3` |
| `conversations` | `ticket` | **Enabled** (dormant until inbound channel connected) | `019f5d42-aecf-72ab-b1dd-f95930d52041` |
| `github` | `issue` | **Enabled** | `019f5d4a-4651-75a6-a9c8-77ef3fad3d9a` |
| `llm_analytics` | — | **Skipped** — internal-only, not a user-facing responder |  |
| `logs` | — | **Skipped** — not a v1 responder |  |
| `linear` | — | **Skipped** — not selected by user |  |
| `zendesk` | — | **Skipped** — not selected by user |  |
| `pganalyze` | — | **Skipped** — not selected by user |  |

---

## Connected tools

| Tool | Status |
|---|---|
| **GitHub Issues** | **Connected by this setup.** Warehouse source id: `019f5d4a-322e-0000-c510-cc1099bbfa43`, repository: `maddyp86/getlitsaber-web`, syncing `issues` table incrementally. First sync started automatically. Only the `issues` table is syncing; additional tables (pull requests, etc.) can be enabled in the PostHog data warehouse UI. |
| Linear | Not used (not selected). |
| Zendesk | Not used (not selected). |
| pganalyze | Not used (not selected). |

---

## Scout troop

**4 active** (general + 2 specialists + 1 custom); **23 disabled**.

### Enabled

| Scout | Reason |
|---|---|
| `signals-scout-general` | Always on — cross-product correlations and uncovered surfaces |
| `signals-scout-web-analytics` | Primary specialist: getlitsaber.com is a Shopify storefront; per-channel session volume, attribution breakage, and landing-page health are core signals |
| `signals-scout-product-analytics` | Secondary specialist: funnel and conversion tracking (PDP → add-to-cart → checkout) are the key product metrics for this business |
| `signals-scout-litsaber-pdp-to-cart` | Custom scout (see below) |

### Disabled

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | **Covered by native source** — error_tracking source rows handle this; a duplicate scout would add noise |
| `signals-scout-session-replay` | **Covered by native source** — session_replay source handles this |
| `signals-scout-web-vitals` | Re-enable if Core Web Vitals (`$web_vitals`) tracking is confirmed active — see follow-ups |
| `signals-scout-feature-flags` | No `$feature_flag_called` events or PostHog feature flag usage confirmed in this repo |
| `signals-scout-surveys` | No active PostHog surveys (probe returned 0) |
| `signals-scout-revenue-analytics` | No revenue SDK — payments flow through Shopify hosted checkout to Authorize.net; no PostHog revenue events instrumented |
| `signals-scout-ai-observability` | No `$ai_*` events or LLM SDK in use |
| `signals-scout-experiments` | No active A/B experiments configured |
| `signals-scout-csp-violations` | No CSP reporting (`$csp_violation`) configured |
| `signals-scout-logs` | PostHog logs product not confirmed in use |
| `signals-scout-anomaly-detection` | Covered by `general` for now; re-enable if dashboard collection grows |
| `signals-scout-customer-analytics` | B2C storefront — no group/accounts analytics |
| `signals-scout-data-pipelines` | No CDP destinations, hog flows, or batch exports configured |
| `signals-scout-data-warehouse` | Re-enable once the GitHub Issues source has synced several times and a sync health baseline exists |
| `signals-scout-apm` | No OpenTelemetry tracing configured |
| `signals-scout-health-checks` | Covered by `general` on a fresh setup |
| `signals-scout-inbox-validation` | Not appropriate for a fresh setup — no resolved reports to validate yet |
| `signals-scout-ingestion-warnings` | Covered by `general` initially |
| `signals-scout-insight-alerts` | No configured insight alerts yet |
| `signals-scout-mcp-tool-calls` | No `$mcp_tool_call` events |
| `signals-scout-observability-gaps` | Covered by `general`; re-enable as the event taxonomy grows |
| `signals-scout-replay-vision` | No Replay Vision scanners configured |
| `signals-scout-skills-store` | Skill hygiene — not a priority at launch |

---

## Custom scouts

### Created: `signals-scout-litsaber-pdp-to-cart`

**Config id:** `019f5d57-c606-7ecd-88d9-db1f7de22883` — enabled, emitting, daily schedule.

**What it watches:** The ratio of product detail page visits (`/shop/litsaber-og`) to add-to-cart actions. A drop of ≥ 25% relative to the 14-day trailing average, sustained over ≥ 2 consecutive days, triggers a report.

**Discriminator:** PDP pageview volume from `$pageview` on `$current_url` containing `/shop/litsaber-og` vs downstream cart action rate (autocaptured click events on add-to-cart buttons, or a named `add_to_cart` event if found via `read-data-schema`). The scout falls back to autocapture click events on `components/home/ProductDisplay/` button elements.

**Why no built-in scout covers it:** `signals-scout-product-analytics` watches *saved funnel insights* — if none are configured yet (this is a pre-launch site), it stays silent. `signals-scout-web-analytics` watches channel/session level, not page-to-action conversion ratio. Neither catches a broken cart button or slow-loading PDP on the raw event stream. Error tracking covers JS errors but not conversion drops.

**Disqualifiers baked in:** site-wide traffic drops (defer to `web-analytics`), single-day dips, post-deploy variance, thin traffic (< 20 PDP sessions in 7 days — closes cheaply at pre-launch).

**Surfaces considered and ruled out:**

| Surface | Filter that killed it |
|---|---|
| Age gate compliance monitor | Not ready: no confirmed named PostHog event for age gate confirmation; autocaptured button clicks exist but session-level "did this session see the gate" logic requires uncertain SQL patterns |
| HubSpot form conversion health | Not ready: event names for form submissions unconfirmed; HubSpot embedded forms may not fire PostHog events by default |
| Core Web Vitals | Already covered by the disabled built-in `signals-scout-web-vitals` — see re-enable follow-up |

**Noise escape hatch:** If `signals-scout-litsaber-pdp-to-cart` turns out noisy during the pre-launch quiet period, set `emit: false` on its config (id: `019f5d57-c606-7ecd-88d9-db1f7de22883`) in PostHog to switch it to dry-run. The scout continues running and logging, but files nothing to the inbox until you flip it back.

---

## Follow-ups

- [ ] **Connect a Support inbound channel.** The Conversations product source is enabled but dormant — tickets won't reach the inbox until you connect an email address, shared inbox, or Slack channel in PostHog. Settings → Integrations → Conversations.
- [ ] **Enable `products-enable` products via project admin.** The `products-enable` tool was unavailable in this deploy. Verify Session Replay, Error Tracking, and Conversations are toggled ON in PostHog project settings if any appear off.
- [ ] **Re-enable `signals-scout-web-vitals`** if Core Web Vitals (`$web_vitals`) events are being captured. This is a Next.js storefront where LCP/INP/CLS directly affect SEO and conversion — it's a high-value scout once the event stream exists. Enable it from the PostHog Self-driving scouts list.
- [ ] **Create at least one saved funnel insight** (e.g. Homepage → PDP → cart) in PostHog so `signals-scout-product-analytics` has a saved flow to watch. Without a saved funnel, the specialist has nothing to compare against.
- [ ] **Confirm or name the `add_to_cart` event.** The custom PDP-to-cart scout currently falls back to autocaptured click events. If a named `add_to_cart` (or similar) event is fired via `posthog.capture()` anywhere in the codebase, update the scout body to use it as the primary signal — it will be more reliable than autocapture text matching.
- [ ] **Consider age gate monitoring.** Once a named PostHog event for age gate confirmation is confirmed (e.g. `age_gate_confirmed`), a dedicated compliance scout watching bypass rate would be valuable for this 21+ vape product. Flag to PostHog wizard to design it.
- [ ] **Grant additional repos to the PostHog GitHub App** if other repositories are relevant to this project (e.g. a separate backend or infra repo). The current grant covers `maddyp86/getlitsaber-web` only.
- [ ] **Re-enable `signals-scout-data-warehouse`** once the GitHub Issues source (`019f5d4a-322e-0000-c510-cc1099bbfa43`) has been syncing for a few days and a health baseline exists.

---

## What happens next

The scout coordinator picks up fresh configs within ~30 minutes. Scouts run on their daily schedule; `signals-scout-litsaber-pdp-to-cart` will close out cheaply on its first run (pre-launch, thin traffic) and begin building its baseline. As traffic grows post-launch, it will have a 14-day window to compare against.

Error tracking and session replay findings reach the inbox as native sources — any new error issue or replay cluster will appear there without waiting for a scout run.

Your inbox: **https://us.posthog.com/project/480206/inbox**
