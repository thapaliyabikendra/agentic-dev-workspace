---
description: Debt scan — lint.md (project-KB drift, judgment-routed) + sdlc/tools/engine-lint.mjs (engine-file drift, mechanical). Walks the five debt classes (orphan-node, stale-proposed, baseline-not-cited, stale-version-ref, index-entry-missing); routes findings to OQ-NNN or direct tiered touch. Detection, not gating.
argument-hint: [optional scope — component, debt class, or "engine" for the mechanical runner only]
---

Run the periodic debt scan. Two halves with a deliberate scope split (lint.md § Mechanical engine-lint runner): **project-KB drift** (`docs/`) is the manual operation — walk each debt class' detection rule and scan procedure, route findings by judgment; **engine-file drift** (`sdlc/`, `CLAUDE.md`, `README.md`, `.claude/commands/`) is mechanical — run `node sdlc/tools/engine-lint.mjs` (`--strict` to promote warns). This command is an invocation shim only: it loads the flow file and walks it; the judgment-routing stays human — nothing here automates the project-KB half.

**Scope:** $ARGUMENTS
(If empty, run both halves over the full workspace. "engine" = runner only; a component or debt-class name narrows the manual walk.)

> **Canonical flow:** load `sdlc/workflow/lint.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry.
> `sdlc/workflow/maintenance-discipline.md` loads only if an `index-entry-missing`
> direct fix fires. This command sets scope and names the contract; the flow file
> governs. If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

On-demand — no phase gates it. Suggested triggers (flow file § When to run): before a milestone close, picking up a stale workspace, periodic discipline, or "something feels off". Do NOT use for Phase 1.5 validation (that is `frs-validation-rules.md`), per-artifact lifecycle events (`maintenance-discipline.md`), qualitative scoped review (`review.md`), or report regen (`derived-reports.md` / `regenerate-roadmap.md`).

**Posture (restate — defense-in-depth):** lint is **detection, not gating** — the flow file's named anti-pattern is "The Lint Gate". Never treat a dirty scan as phase-blocking, and never auto-fix: findings route to OQ-NNN (orphan-node, stale-proposed, baseline-not-cited, stale-version-ref) or a direct 2-file tiered touch (index-entry-missing only). The engine runner is detection-only too — it never edits files.

## Phase & boundaries

Standalone maintenance operation, any time between phase gates. Walk **all** debt classes in scope — partial walks misreport coverage. New debt classes are not invented here; they go through `evolving-the-workflow.md`.

## Produces

A one-line-per-finding summary report (`<debt-class> | <artifact-id> | <detail>` per the flow file's output format — not persisted); OQ-NNN files for resolution-worthy drift; direct index-row fixes for `index-entry-missing` (each a 2-file touch); the engine-lint run output (exit 0 clean / 1 findings, exemptions logged). The OQs and index rows are the durable record, not the report.

## On completion

Report findings grouped by routing (OQs opened / direct fixes applied / engine findings). If `index-entry-missing` violations accumulate, flag the tiered-touch erosion as a methodology concern per the flow file — don't just patch.

**Commit discipline (rule 11):** direct fixes and OQ files stay uncommitted without explicit user authorization.
