---
description: Lightweight defect track — bug-fix.md. Files an EXP audit trail, reproduces, triages (canonical correct vs under-specified), fixes on fix/<slug> with a regression test, or escalates to FRS. Skips milestone/FRS/FS ceremony; canonical edits still fire the 2-file touch.
argument-hint: [bug description, or path to an existing EXP-<slug> exploration]
---

Run the lightweight bug-fix track for a surfaced defect. A bug is "the code drifted from canonical" or "canonical was under-specified" — not a milestone-scoping problem. The track files a workspace-level Exploration as the audit trail, reproduces and locates the defect, triages whether canonical needs correcting, lands the fix on a `fix/<slug>` branch with a regression test, and checks the escalation criteria before absorbing work it shouldn't.

**Bug:** $ARGUMENTS
(If empty, ask for the bug description — symptom, where it surfaced (production/staging/dev), and any reproduction hint — before starting.)

> **Canonical flow:** load `sdlc/workflow/bug-fix.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry.
> `sdlc/workflow/maintenance-discipline.md` is wholesale-read only if a canonical
> edit fires. This command sets scope and names the contract; the flow file
> governs. If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

A defect must have surfaced and the fix must be restoring *intended* behavior. Check the escalation criteria **first** (multi-day design work; structural gap; bug cluster around one canonical area; new behavior beyond restoring intent → that's a change request): escalated bugs flip the Exploration to `adopted` and load `design.md` under a milestone — do not run the lightweight track on them.

**HARD-GATE (restate — defense-in-depth):** do NOT edit a canonical node (FLW or otherwise) during a bug fix without firing the 2-file node touch (node + per-type `index.md` re-sync). Silent canonical edits are not the discount — the flow file's named anti-pattern is "The Obvious Tweak".

## Phase & boundaries

Standalone lightweight track — skips Phase 0/1/1.5/2, CHG nodes, and the Coverage Matrix. Requires: reproduction recorded, regression test added, canonical updated only if actually wrong (never silently), Exploration file as audit trail.

## Produces

`docs/exploration/EXP-<slug>.md` (template `sdlc/_templates/EXPLORATION.md`; `severity:` + `affects_nodes:` in frontmatter); fix on `fix/<slug>` + regression test; `canonical_changed: true|false` recorded; on direct fix Exploration → `status: done` + `fixed:` date; on escalation → `status: adopted` + `adopted_into: [FRS-NNN]`. The flow file owns the detail.

## On completion

Direct path: fix merged, Exploration `done`. Escalation path: hand to `/author-frs` under a new or existing milestone per the change-request routing in `sdlc/WORKFLOW.md`.

**Commit discipline (rule 11):** never `git commit` (or merge `fix/<slug>`) without explicit user authorization, per commit.
