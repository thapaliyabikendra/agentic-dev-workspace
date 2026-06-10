---
description: Regenerate a wiki-derived report under docs/reports/ — derived-reports.md. Aggregate snapshots (BUSINESS.md, TECHNICAL.md, JOURNEYS.md) or multi-instance category outputs (release-notes, articles, api, overviews). Build artifacts — link by ID, never hand-edit, fix the source wiki and regenerate. NOT for ROADMAP.md (that is /regen-roadmap).
argument-hint: [report kind — business | technical | journeys | release-notes | articles | api | overviews — plus instance topic for multi-instance kinds]
---

Regenerate an audience-facing derived report. Copies the kind's template, walks its `Pulls from` list (Karpathy indexes first, narrow-load per section — same retrieval discipline as Phase 2/3), fills sections with one-line summaries that **link by ID**, stamps `generated_at:` + `source_commit:`, and overwrites the output. Aggregate snapshots are singletons (`docs/reports/BUSINESS.md`, `TECHNICAL.md`, `JOURNEYS.md` — the BA front door — no index pair); multi-instance kinds land slug-named under `docs/reports/<category>/` with a per-category `index.md` catalog row (no `log.md` — git history is the audit).

**Report kind (+ instance topic):** $ARGUMENTS
(If empty, ask which kind — and for multi-instance kinds, which release/topic/version/feature instance.)

> **Canonical flow:** load `sdlc/workflow/derived-reports.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

On-demand — no phase gates it ("regenerate the `<kind>` overview" is the expected prompt). Reroute first: `docs/ROADMAP.md` → `/regen-roadmap` (project state, five Stuck classes — not an audience report); a report that misstates a fact → fix the **source** (nodes/ADRs/FRSs) and regenerate, never patch the report; canonical-node edits → `maintenance-discipline.md`; drift detection → `/kb-lint`.

**Posture (restate — defense-in-depth):** reports are build artifacts — reference-never-copy applies one step up: link by ID, no paraphrased node bodies, no hand edits, no append-only history. If synthesis surfaces a concept with no canonical KB node, trigger `sdlc/workflow/absorb-concept.md` (fix the wiki, then regenerate) — never inline the concept into the report.

## Phase & boundaries

Standalone regeneration operation. `docs/reports/` is lazy — first regen of a kind creates it. A new report *type* (no existing template) is a workflow extension: route through the flow file's § Defining a new report type + `evolving-the-workflow.md`, not improvised here.

## Produces

Aggregate kinds: `docs/reports/<KIND>.md` overwritten from `sdlc/_templates/OVERVIEW-<KIND>.md`. Multi-instance kinds: `docs/reports/<category>/<slug>.md` from the category's `REPORT-<KIND>.md` template + its row in the per-category `index.md`. All outputs carry `generated_at:` + `source_commit:`. Empty-source sections are dropped, not placeholdered. The flow file owns the detail.

## On completion

Report what was regenerated and from which sources; list any concepts routed to `absorb-concept.md`.

**Commit discipline (HR-COMMIT):** the regenerated report stays uncommitted without explicit user authorization.
