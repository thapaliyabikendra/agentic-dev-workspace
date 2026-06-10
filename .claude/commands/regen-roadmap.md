---
description: Regenerate docs/ROADMAP.md — regenerate-roadmap.md. Recomputes the five Stuck classes (Stale FRSs, Stale OQs, Stalled milestones, Stuck CHGs, Blocked-by-OQ) and rebuilds the in-flight/shipped tables from milestone portals + MILESTONE-STATE.md. On-demand; never hand-edit the output.
argument-hint: [optional reason/trigger note — e.g. "stakeholder review", "pre-close M-04"]
---

Regenerate the roadmap planning artifact. Walks the template's `Pulls from` list (Karpathy indexes first), computes **all five** Stuck classes exhaustively, fills the in-flight / shipped milestone tables (progress + next-action from each `MILESTONE-STATE.md`), and overwrites `docs/ROADMAP.md` with fresh `generated_at:` / `source_commit:`. ROADMAP.md is **project state**, not an audience overview — BUSINESS/TECHNICAL regen is `/derived-report`, drift detection in canonical content is `/kb-lint`.

**Trigger note:** $ARGUMENTS
(Optional — context only; the procedure is the same regardless.)

> **Canonical flow:** load `sdlc/workflow/regenerate-roadmap.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

On-demand — no phase gates it (also fired by `/close-milestone` step C-5). Triggers: stakeholder review, suspected silently-stuck milestone/FRS, periodic discipline.

**Posture (restate — defense-in-depth):** the five Stuck classes are a **closed set, walked exhaustively per regen** — the flow file's named anti-pattern is "The Partial Roadmap". An empty class is omitted from the rendered file; a skipped class fabricates coverage. Never hand-edit `docs/ROADMAP.md` (derived — fix source data and regenerate); never add a sixth stuck class here (route through `evolving-the-workflow.md`); never auto-run per commit.

## Phase & boundaries

Standalone maintenance operation. No tiered touch — `docs/ROADMAP.md` is a regenerated planning artifact, not a canonical node. The advisory helper `sdlc/scripts/regenerate-roadmap.sh` may draft the stuck-class data; review its output — manual judgment fills the narrative tables.

## Produces

`docs/ROADMAP.md` overwritten from `sdlc/_templates/OVERVIEW-ROADMAP.md`: Stuck-class tables (per-class row shapes owned by the flow file), in-flight table (Progress + Next action from `MILESTONE-STATE.md`), shipped table, `generated_at:` + `source_commit:` (or `filesystem-snapshot` when uncommitted edits exist).

## On completion

Summarize the stuck-class counts and anything newly surfaced. Stuck findings that warrant action route to their per-artifact procedure (FS abandonment via `maintenance-discipline.md`, CHG re-evaluation via `plan.md`) — the roadmap surfaces; it does not resolve.

**Commit discipline (HR-COMMIT):** commit the regenerated ROADMAP.md alongside the motivating work only with explicit user authorization.
