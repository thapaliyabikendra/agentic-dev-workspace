---
description: Resume an in-flight milestone in a fresh session — phase-state.md. Reads MILESTONE-STATE.md (dev_phase / qa_phase / next_action / blockers), then loads the flow file matching the active phase before any phase work. Durable state wins over session memory.
argument-hint: [milestone id/slug — plus "dev" or "qa" if both tracks are live]
---

Open a session on an in-flight milestone. Reads the milestone's durable state file, reports where each track stands (`dev_phase`, `qa_phase`, `next_action`, blocking OQ-NNN IDs, cross-FS dependencies), then loads the flow file matching the active phase before any phase work begins. The flow file's named anti-pattern is "Session Memory Substitute" — read `MILESTONE-STATE.md` before any phase work, no exceptions; in-session memory from a prior session never substitutes.

**Milestone (+ optional track):** $ARGUMENTS
(If empty, ask which milestone — list `docs/milestones/` candidates with `status: in-progress` if helpful. If both tracks are live and no track is named, ask which one this session works: the user's intent decides.)

> **Canonical flow:** load `sdlc/workflow/phase-state.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

The milestone folder must exist with a `MILESTONE-STATE.md` (lazy-create from `sdlc/_templates/MILESTONE-STATE.md` per the flow file if absent — but an absent folder means the milestone was never opened; route to `/open-milestone` instead).

**HARD-GATE (restate — defense-in-depth):** do NOT begin phase work until the flow file matching the active phase is loaded. Routing per phase-state.md § Read at session start: dev_phase 0/1/1.5 → `design.md` (i.e. continue inside `/author-frs` scope); 2 → `plan.md` (`/author-fs`); 3 → `implementation.md` (`/implement-milestone`); qa_phase qa-plan → `test-plan-ingest.md` (`/test-plan`); qa-suite/qa-gate → `test-suite-codegen.md` + `qa-gate.md` (`/test-suite`).

## Phase & boundaries

Session-opening utility — phase-neutral; it positions, it does not advance. This command runs at the start of a fresh session (post-`/clear` by construction), so no additional `/clear` is needed before loading the phase's flow file. The two `*_phase` fields are orthogonal — resume one track per session; do not flip the other.

## Produces

No artifacts. A short status report (current phases, `next_action`, blockers, what the state file says the next session should start with) and the correct flow file loaded. State-file updates during/at the end of the session follow the flow file's § Update triggers (session notes, accumulated context, session continuity).

## On completion

Hand straight into the phase work named by `next_action` — this command is the on-ramp, not the work. At session close, fire the flow file's § Update at session close so the next `/resume-milestone` lands cleanly.
