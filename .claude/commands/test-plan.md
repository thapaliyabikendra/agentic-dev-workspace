---
description: Generate a Feature Spec's test plan — test-plan-ingest.md (QA track). Derives TC-NNN cases (happy/edge/fault) from FRS ACs + FLW scenarios + ENT constraints and populates the FS Test plan section. Run after FS validation passes.
argument-hint: [FS id, or milestone/feature scope]
---

Generate a Feature Spec's test plan on the QA track. This command launches the test-plan-ingest flow for the given FS or feature scope — it sets scope, states the entry HARD-GATE, and names the canonical flow; the flow governs step sequencing, TC authoring, and completion details.

**FS or scope:** $ARGUMENTS
(If empty, ask which FS id or feature scope to target before proceeding.)

> **Canonical flow:** load `sdlc/workflow/test-plan-ingest.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Do NOT begin until ALL of the following are true:

- FS validation loop passed (zero Blockers, zero Majors).
- Every FLW referenced by the FS has all three scenarios filled and is Phase-2-wired.
- Every new ENT in the FS carries field-level constraints.

The QA track is trigger-independent — it opens with its own `/clear` regardless of which path led here (implementation, mid-milestone handoff, etc.).

## Phase & boundaries

QA track entry. Preceded by a `/clear` (this command's entry boundary). The successor is `/test-suite` (preceded by another `/clear`).

## Produces

`specs/<FS>/test-plans/<use-case>/TC-NNN-*.md` — TC IDs globally unique across `specs/**/test-plans/**`; FS `test_plan_path:` set; `## Test plan` section in the FS grouped by use-case. The flow owns all detail.

## On completion

`/clear` → `/test-suite`.
