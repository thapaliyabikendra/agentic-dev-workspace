---
description: Review pass — review.md. Qualitative pass over a scoped corpus subset (QA gate, author self-review, ADR-conformance sweep, friction-triggered audit). Every finding classifies as design-fit (rule is wrong) or execution-debt (rule is right, corpus doesn't conform) before routing.
argument-hint: [scope — artifact ID(s), milestone slug, FS/FRS set, or a friction signal to triage]
---

Run a structured review pass over a scoped artifact set and route every finding by the two-heading rule: `design-fit` findings drive a methodology change (via `/evolve-workflow` / the relevant rule book / PRINCIPLES.md); `execution-debt` findings drive per-artifact tiered-touch fixes (via `maintenance-discipline.md`, one focused commit per finding group).

**Scope:** $ARGUMENTS
(If empty, ask for the artifact set, milestone slug, or the friction signal that triggered the pass.)

> **Canonical flow:** load `sdlc/workflow/review.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at operation entry.
> This command sets scope and names the contract; the flow file governs.
> If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

**HARD-GATE (restate — defense-in-depth):** every finding MUST be classified `design-fit` or `execution-debt` BEFORE any routing decision. A finding carrying both shapes is **split into two findings** — never filed under both headings. Wrong tool for: the Phase 1.5 validation gate (that is `design.md` + `frs-validation-rules.md`), periodic debt-class scanning (`/kb-lint`), or a single-artifact edit (`maintenance-discipline.md` directly).

## Phase & boundaries

Maintenance operation, not a phase — fires standalone, at Phase 3 QA completion (FS `adrs:` scopes the review), at Phase 2-close author self-review, or when a friction signal warrants a focused audit. No `/clear` boundary. Dispatched review subagents return the 3-block contract per `sdlc/workflow/agent-contracts.md`; the parent-side outcome rubric in the flow file governs routing.

## Produces

A classified findings list (session output — findings are not a new artifact type) with specific artifact IDs + paths per finding; `design-fit` routings into `evolving-the-workflow.md` / rule books / PRINCIPLES.md; `execution-debt` routings into `maintenance-discipline.md` tiered touches; `OQ-NNN` for any finding whose classification is genuinely ambiguous.

## On completion

Report findings count per heading, every routing decision made (finding → destination), fixes applied vs deferred, and any OQs raised. State whether the pass closed clean or is blocked.

**Commit discipline (rule 11):** never `git commit` without explicit user authorization, per commit.
