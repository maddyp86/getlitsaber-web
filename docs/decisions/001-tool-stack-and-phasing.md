# ADR-001: Tool stack and phasing — Bolt → Claude Code → n8n

**Status:** Accepted
**Date:** 2026-05-16
**Decider:** Matt Hall

## Context

We're replatforming `getlitsaber.com` from a WordPress/Avada site (built by an external agency) to a Next.js storefront on Shopify, instrumented with a weekly production AI agent for conversion analysis. The build spans seven phases over roughly five weeks.

The temptation in 2026 is to pick one AI coding tool and use it for everything. Cursor, Claude Code, Bolt, v0, Lovable — each is marketed as a one-stop shop. In practice, each has a *mode* it's best at, and forcing one tool through a mode it's not designed for produces sloppy work.

This project has three distinct modes:
1. **Visual scaffold** from a Figma design to working pages — needs speed and design fidelity, doesn't need deep code reasoning.
2. **Integration depth** — Shopify cart, webhooks, type safety, observability — needs whole-repo context, planning, and command execution.
3. **Orchestration** — a weekly cron that gathers data, calls Claude, formats a report, posts to Slack — needs durable scheduling and connector fluency.

## Decision

Use three tools, one per phase, picked for the mode each is best at:

| Mode | Tool | Why |
|------|------|-----|
| Visual scaffold | **Bolt** | Fastest path from Figma to Next.js. Exports cleanly to GitHub at ~70% done. |
| Integration depth | **Claude Code** | Owns the full repo, plans multi-file changes, runs commands. Right mode for Shopify integration, observability instrumentation, and ongoing dev. |
| Orchestration | **n8n** | Existing fluency. Better story than a custom Python service. Visual workflow makes the agent's data-gathering steps inspectable. |

Bolt hands off to Claude Code at the GitHub export point. Claude Code owns everything from that handoff forward. n8n runs in parallel from Phase 6.

## Consequences

**Positive**
- Each tool used inside its design envelope. Output quality is higher per phase.
- The narrative for interviews and content is *tool-fit reasoning*, not *tool fluency* — a senior signal.
- Handoff points are explicit and testable: at the Bolt → GitHub export, we audit the scaffold; at the n8n → Claude API call, we test the prompt and tool schema in isolation.

**Negative**
- Three tools means three subscriptions, three sets of credentials, three learning curves. Worth the cost on a real project; would be overkill on a hobby build.
- Handoff friction is real. The Bolt → Claude Code handoff in particular needs an explicit audit step (Phase 3) — Bolt's output looks right but often has structural issues only visible from inside the repo.

**Neutral**
- Locks us into a multi-tool workflow. Could be re-evaluated if one tool eats another's mode (e.g. if Bolt gains repo-level reasoning, or Claude Code gains a no-code orchestration UI).

## Alternatives considered

- **Claude Code for everything.** Strongest single-tool option, but slower than Bolt at the visual scaffold phase and lacks an orchestration UI. The Phase 1 → Phase 2 speed loss alone was the dealbreaker.
- **Cursor + custom Python orchestrator.** Cursor is excellent at line-level pair programming but weaker than Claude Code at planning multi-file changes. A custom Python service adds maintenance overhead with no upside over n8n.
- **Lovable / v0 for the full scaffold.** Comparable to Bolt at this task; choice between them is preference-level, not principled. Bolt picked for prior familiarity.
