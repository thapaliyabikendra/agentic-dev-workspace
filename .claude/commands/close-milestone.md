---
description: Close a milestone — close-milestone.md. Verifies pre-conditions (all FS merged, UAT.md passed/accepted), flips portal to done, finalizes MILESTONE-STATE.md, updates home.md, regenerates the roadmap, runs the dangling-cross-ref audit. Run after /verify-milestone emits VERIFICATION PASSED.
argument-hint: [milestone id/slug]
---

Cleanly close a milestone. Runs the close checklist — pre-condition verification, portal status flip, `MILESTONE-STATE.md` finalization, milestone-scope discovery flip to `adopted`, `home.md` update, roadmap regen, and the dangling cross-reference audit. Steps C-1…C-6 are owned by the flow file.

**Milestone:** $ARGUMENTS
(If empty, ask which milestone before starting.)

> **Canonical flow:** load `sdlc/workflow/close-milestone.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Do NOT begin until `/verify-milestone` has emitted `## VERIFICATION PASSED` — OR the human BA/QA hat has **explicitly** accepted a `partial` UAT status and decided to close anyway (ask; never assume the partial-accept). Pre-conditions verified by C-1 before any mutation: every FS `merged: true`; `UAT.md` exists with `status: passed` (or explicit partial-accept); no unresolved Blocker OQs (`origin: validation-gate` / `origin: verify`, `gate_effect: blocking`). If any pre-condition fails, surface it and stop — never force-close. Pausing a milestone is NOT closing — update `MILESTONE-STATE.md` instead.

## Phase & boundaries

Terminal milestone-lifecycle utility (the inverse of `/open-milestone`). No tiered touch — portal and state file are not canonical DDD artifacts. C-6's dangling-reference audit must come back clean (or be resolved) before the status flip is final.

## Produces

Portal `status: done` + `done_date:`; `MILESTONE-STATE.md` finalized (`dev_phase: done`, `qa_phase: done`, `progress_percent: 100`); `discovery/milestone-scope.md` → `adopted`; `docs/home.md` row updated; `docs/ROADMAP.md` regenerated (via `regenerate-roadmap.md`, flow step C-5); audit result line for the close commit. The flow file owns the detail.

## On completion

Flow emits `## MILESTONE CLOSED`. Call `advisor()` before declaring the milestone complete (CLAUDE.md Advisor gate — declaring a milestone complete).

**Commit discipline (HR-COMMIT):** the close commit (portal + state + roadmap) needs explicit user authorization — never commit without it.
