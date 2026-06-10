---
name: implementation-stage2-dispatch
description: "Detail file of implementation.md — Stage 2 per-layer dispatch: precondition, Round 1/2/3/D structure, file-disjointness, agent envelope. Load when dispatching per-layer coding sub-agents."
applies_when:
  stack: [agnostic]
---

# Stage 2 detail — per-layer dispatch

> Detail file of [`implementation.md`](../implementation.md) (Phase 3 flow).
> Load when dispatching per-layer coding sub-agents.

**Precondition:** the orchestrator MAY dispatch per-layer agents only when the
FS's "Implementation tasks" rows for the target cohort are mechanically
specified — each row names the file path, type name, method signatures, and
references the relevant CHG `adds[]` / `modifies[]` entries. Vague rows
("implement the query") fall back to main-session authoring per
[`PRINCIPLES.md`](../../PRINCIPLES.md) ("Mechanical work ≠ judgment work").

Round structure (engine default; a project `task-ordering`-tagged ADR, where present, overrides):

**Round 1 (Cohort A):** parallel — `shared` agent + `domain` agent.
Each loads `sdlc/standards/by-layer/<shared|domain>.md` + `cross-cutting.md`. Build-gate after round.

**Round 2 (Cohort B):** parallel — `contracts` agent + `application` agent.
Each loads its pointer file + `cross-cutting.md`. Build-gate after round.

**Round 3 (Cohort C):** `infrastructure` agent.
Loads `sdlc/standards/by-layer/infrastructure.md` + `cross-cutting.md`. Build-gate after round.

Cohort D (`HttpApi.Host`) stays in the main session — no pointer file is defined in this plan.

Per-round file-disjointness: each agent writes only to its ABP project root (STD-005 R9.2).
Cross-layer references go through already-merged code from earlier cohorts — not concurrent writes.

Agent envelope: per [`agent-contracts.md § Code-writing dispatch`](../agent-contracts.md#code-writing-dispatch).
