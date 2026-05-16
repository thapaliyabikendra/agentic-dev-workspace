# phase-state.md — Milestone Phase State Tracking

## When to Use

Load and update this operation whenever:
- Entering a new phase on a milestone (lazy-create if absent)
- Closing a session mid-phase (record what completed, what is next)
- Opening a new session on an in-flight milestone (read before any phase work)
- Transitioning between phases (flip `dev_phase` or `qa_phase`, append Phase history row)

## Do NOT use when

- Documenting a canonical artifact decision — that belongs in an ADR or DEC.
- Recording FRS/FS content — use the artifact itself.
- This file does **not** substitute for loading the relevant per-phase flow file
  ([`design.md`](design.md), [`plan.md`](plan.md), [`implementation.md`](implementation.md)).

## Vs. sibling files

- **CLAUDE.md / WORKFLOW.md** — always-on rules; this operation is milestone-instance state.
- **design.md / plan.md / implementation.md** — per-phase procedure; this file tracks *where* you
  are in that procedure, not *what* the procedure is.
- **id-claims.md** — ID reservation ledger; separate from phase tracking.

---

## Process Flow

```
Milestone opened
      ↓
Lazy-create MILESTONE-STATE.md (copy template, fill milestone_id, set dev_phase: 0, qa_phase: not-started)
      ↓
Read at session start (always — do not rely on in-session memory)
      ↓
Work the phase (design / plan / implementation, or QA-track flow)
      ↓
Update during session (session_notes, accumulated_context as artifacts land)
      ↓
Update at phase transition (flip dev_phase or qa_phase, phase_entered, next_action; append Phase history row)
      ↓
Update at session close (record "completed X, next Y" in Session continuity)
```

---

## Procedure

### Lazy create

**Trigger:** MILESTONE-STATE.md absent from `docs/milestones/M-NN-<slug>/`.

1. Copy `sdlc/_templates/MILESTONE-STATE.md` to `docs/milestones/M-NN-<slug>/MILESTONE-STATE.md`.
2. Fill `milestone_id` with the milestone's ID.
3. Set `dev_phase: 0`, `qa_phase: not-started`, and `phase_entered` to today's date.
4. Set `next_action` to the first concrete step for this milestone.
5. Leave all other sections at their template defaults.

No tiered touch — this file is not a canonical DDD artifact. No index.md or log.md entry.

### Read at session start

**Trigger:** Any session beginning work on a milestone.

1. Read `docs/milestones/M-NN-<slug>/MILESTONE-STATE.md`.
2. Note `dev_phase`, `qa_phase`, `next_action`, blocking OQ-NNN IDs, and cross-FS dependencies.
3. Identify which track this session works in (the user's intent decides — both tracks may be live):
   - Dev-track session → load the flow file matching `dev_phase`:
     - Phase 0 / 1 / 1.5 → `design.md`
     - Phase 2 → `plan.md`
     - Phase 3 → `implementation.md`
   - QA-track session → load the flow file matching `qa_phase`:
     - `qa-plan` → `test-plan-ingest.md`
     - `qa-suite` → `test-suite-codegen.md`
     - `qa-gate` → `qa-gate.md`
4. Proceed with phase or flow work. Do **not** rely on in-session memory as a substitute for reading this file.

### Update at phase transition

**Trigger:** Moving from one phase to the next on either track (e.g., Phase 1 → 1.5
on dev; qa-suite → qa-gate on QA).

1. Flip the affected field — `dev_phase` for dev-track transitions, `qa_phase` for
   QA-track transitions. The other field's value is independent and is not changed.
2. Set `phase_entered` to today's date.
3. Set `next_action` to the first concrete step in the new phase.
4. Append a row to `## Phase history`:
   ```
   | YYYY-MM-DD | <track> | <from> | <to> | <one-sentence session summary> |
   ```
   Track is `dev` or `qa`.
5. Clear `session_notes` (stale mid-phase notes belong in history, not the live field).
6. Re-derive `progress_percent` from the new `(dev_phase, qa_phase)` pair
   using the anchor table in
   [`../_templates/MILESTONE-STATE.md → Progress-percent formula`](../_templates/MILESTONE-STATE.md#progress-percent-formula).
   The value is the table cell for the current pair — no free-form
   interpolation.
7. Remind user: a `/clear` is required before loading the next flow file on any of these
   five transitions (per CLAUDE.md Hard rules):
   - Phase 1.5 → 2 (design → plan)
   - Phase 2 → 3 (plan → implementation)
   - Phase 2 → qa-plan (after `plan.md` exit, entering QA track)
   - Phase 3 → qa-suite (after `implementation.md` exit, entering QA track)
   - qa-suite → qa-gate (within QA track, before final QA flow)

### Update during session

**Trigger:** An artifact lands (FRS drafted, FS validated, CHG written, TC ingest complete, etc.).

1. Add the artifact ID to `## Accumulated context`.
2. Append a brief note to `session_notes` (overwrite; not append-only — this is a working field).
3. If a new OQ-NNN is raised as blocking, add it to `## Handoff metadata → Blocking OQ-NNN IDs`.

### Update at session close

**Trigger:** End of session, before closing the conversation.

1. Set `session_notes` to an empty string (or a brief "session closed" marker).
2. Update `## Session continuity`:
   - `Last session completed:` — one sentence on the last milestone action taken.
   - `Next session should start with:` — the exact first step for the next session.
3. Re-derive `progress_percent` from the `(dev_phase, qa_phase)` pair using
   the anchor table in
   [`../_templates/MILESTONE-STATE.md → Progress-percent formula`](../_templates/MILESTONE-STATE.md#progress-percent-formula).
   The value is the table cell for the current pair — no free-form
   interpolation.

---

## Field reference

| Field              | Type    | Allowed values                   | Meaning                                             |
| ------------------ | ------- | -------------------------------- | --------------------------------------------------- |
| `milestone_id`     | string  | `M-NN-<slug>`                    | Milestone identifier                                |
| `dev_phase`        | string  | `0 \| 1 \| 1.5 \| 2 \| 3 \| done` | Current dev-track phase                            |
| `qa_phase`         | string  | `not-started \| qa-plan \| qa-suite \| qa-gate \| done` | Current QA-track flow                  |
| `phase_entered`    | date    | `YYYY-MM-DD`                     | Date the current (most-recently-entered) phase began |
| `next_action`      | string  | Free text                        | Immediate next step; updated at every transition    |
| `progress_percent` | integer | `10 \| 25 \| 40 \| 55 \| 70 \| 80 \| 90 \| 95 \| 100` | Derived from the `(dev_phase, qa_phase)` pair — see [`../_templates/MILESTONE-STATE.md → Progress-percent formula`](../_templates/MILESTONE-STATE.md#progress-percent-formula). Not free-form. |
| `session_notes`    | string  | Free text                        | Working field; cleared at session close             |

> **Dev-track vs. QA-track orthogonality.** The two `*_phase` fields are
> independent — a milestone may sit at `dev_phase: 3` (implementation in flight)
> while `qa_phase: not-started`, or `qa_phase: qa-gate` (QA-track final flow in
> flight) while dev-track is otherwise complete. Sessions advance one track at a
> time; the other field's value is not changed in the same transition.

---

## Anti-Pattern: "Session Memory Substitute"

**Description:** Skipping the "Read at session start" step because the previous session's
context feels fresh — the FRS set is still visible, the Phase 1.5 findings are recent,
and reading the state file feels redundant.

**Why it fails:** In-session context drifts silently across phase boundaries. The state file
is the durable ground truth; session memory is not. A phase transition not recorded in
MILESTONE-STATE.md is invisible to the next session, leading to repeated work, missed
blockers, or advancing past a gate that wasn't verified.

**Rule:** Read MILESTONE-STATE.md before any phase work. No exceptions.

---

## Integration

- **Callers (must load this file):**
  - [`design.md`](design.md) — Phase 0 / 1 / 1.5 entry
  - [`plan.md`](plan.md) — Phase 2 entry
  - [`implementation.md`](implementation.md) — Phase 3 entry
- **Template:** `sdlc/_templates/MILESTONE-STATE.md`
- **Instance location:** `docs/milestones/M-NN-<slug>/MILESTONE-STATE.md`
- **Not referenced by:** per-type indexes, log.md, or home.md — this is session-scoped
  operational state, not a canonical artifact.
