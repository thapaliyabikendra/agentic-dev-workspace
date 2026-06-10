---
description: Author a milestone's FRSs — design.md Phase 0 (scope/SURVEY) -> Phase 1 (FRS + FLW + CHG) -> Phase 1.5 validation gate. Routes extraction on seed medium: prototype | raw requirements | existing code. Requires an open milestone.
argument-hint: [milestone id/slug — plus prototype path or requirements if not already seeded]
---

Author the FRSs for an open milestone. Runs `sdlc/workflow/design.md` Phase 0 (scope / SURVEY), Phase 1 (FRS + FLW + CHG authoring), and the Phase 1.5 validation gate. Seed-medium routing (design.md Phase 0 callout): prototype → `sdlc/workflow/prototype-first.md` (bidirectional doctrine) + `sdlc/workflow/frs-prototype-extraction-rules.md`, `PROTO-<slug>` at `docs/prototypes/`, `[inferred from prototype]` tags, SURVEY `prototype_ref:`; existing code → `sdlc/workflow/frs-code-extraction-rules.md`, `[inferred from code]`; raw requirements → neither rule book (prose is confirmed intent). One-question-per-turn cadence applies throughout (CLAUDE.md HR-ONE-Q).

**Milestone + seed:** $ARGUMENTS
(If empty, ask for the milestone id/slug and any seed input before starting.)

> **Canonical flow:** load `sdlc/workflow/design.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. Supporting
> files (`sdlc/workflow/frs-prototype-extraction-rules.md`,
> `sdlc/workflow/frs-code-extraction-rules.md`,
> `sdlc/workflow/frs-validation-rules.md`) are loaded on demand per the
> seed-medium routing. This command sets scope and names the contract; the flow
> file governs. If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Milestone container must exist — run `/open-milestone` first. Do not begin this command without an allocated M-NN, a portal file, and a `MILESTONE-STATE.md` in place.

**HARD-GATE (restate — defense-in-depth):** every FRS authored here MUST declare both `framework:` and `stack:` in frontmatter (CLAUDE.md HARD-GATE, 2026-05-22). Missing either is a Phase 1.5 Blocker (`type: frontmatter-presence`) per `sdlc/workflow/frs-validation-rules.md`.

## Phase & boundaries

Phases 0, 1, and 1.5 — all within one session (no `/clear` between them). `/clear` fires on exit, before `/author-fs`.

**HARD-GATE (restate — defense-in-depth):** do NOT advance to Phase 2 (`/author-fs`) until every FRS clears Phase 1.5 (zero unresolved-without-OQ; cross-FRS sweep clean) AND a `/clear` + reload of `sdlc/workflow/plan.md` has happened.

## Produces

`discovery/milestone-scope.md` SURVEY; `frs/FRS-NNN-*.md` with `framework:` + `stack:` in frontmatter; proposed `FLW-NNN` nodes (+ flows `index.md`); draft `CHG-NNN` nodes (when `touches_nodes:` non-empty); `OQ-NNN` for deferred findings. The flow file owns the detail of each artifact.

## On completion

Phase 1.5 gate clears (zero unresolved Blockers/Majors). Then: `/clear` → `/author-fs`.
