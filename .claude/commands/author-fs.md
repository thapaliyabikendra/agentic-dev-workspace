---
description: Author a milestone's Feature Specs — plan.md Phase 2 Ingest. Drafts FS-NNN, ingests proposed canonical nodes (ACT/ENT/CMD/QRY/...), enriches the Phase-1 FLW + CHG. Structural names only, no code/syntax. Run after Phase 1.5 + /clear.
argument-hint: [milestone id/slug, or specific FRS scope]
---

Author the Feature Specs for a milestone by running the Phase-2 Ingest flow. The canonical flow here is `sdlc/workflow/plan.md` — the Phase-2 Ingest flow — which is **distinct from the `/plan` slash command** (generic work-item planner); the name `/author-fs` was chosen specifically to avoid that collision. This command drafts FS-NNN files, ingests proposed canonical nodes (ACT/ENT/CMD/QRY and the other 15 Phase-2-born types), and enriches the Phase-1 FLW + CHG nodes. Deliverables are structural names only — no method bodies, brace blocks, SQL, YAML payloads, or file paths. FS drafting pauses at the 3–4 section-group boundaries (CLAUDE.md rule 10), one question per round.

**Milestone or FRS scope:** $ARGUMENTS
(If empty, ask for the milestone id/slug or FRS scope before starting.)

> **Canonical flow:** load `sdlc/workflow/plan.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Entered after Phase 1.5 cleared and a `/clear` was issued. Every FRS for this milestone must have passed Phase 1.5 (zero unresolved-without-OQ; cross-FRS sweep clean) before this command starts.

**HARD-GATE (restate — defense-in-depth):** no method bodies / brace blocks / SQL / YAML payloads / file paths / line-level code in FS, nodes, or CHG — structural names are the deliverable.

**HARD-GATE (restate — defense-in-depth):** Phase 2 type-validity check — reject node types not in the 15 Phase-2-born types nor the component's `node_definitions:` (per the flow file's type registry).

## Phase & boundaries

Phase 2 — entered after `/clear` from Phase 1.5. On completion, `/clear` → `/implement-milestone`.

## Produces

`specs/FS-NNN-*/FS-NNN.md`; proposed canonical nodes (2-file touch each: node + per-type `index.md`); CHG enriched in place (`adds[]`, `migration_steps[]`, structural `modifies[]`; status → `approved`). The flow file owns the artifact detail.

## On completion

FS validation loop passes (zero Blockers/Majors). Then: `/clear` → `/implement-milestone`.
