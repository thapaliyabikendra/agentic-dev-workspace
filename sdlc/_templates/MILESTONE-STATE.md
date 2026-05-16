---
milestone_id: M-NN-<slug>
dev_phase: 0          # 0 | 1 | 1.5 | 2 | 3 | done
qa_phase: not-started # not-started | qa-plan | qa-suite | qa-gate | done
phase_entered: YYYY-MM-DD
next_action: "<brief description of the immediate next step>"
progress_percent: 0
session_notes: ""
---

# Milestone State — M-NN-<slug>

> **Not a canonical DDD artifact.** No tiered touch; single-file read/write only.
> Instance location: `docs/milestones/M-NN-<slug>/MILESTONE-STATE.md`
> Lazy-create on first phase entry. Template: `sdlc/_templates/MILESTONE-STATE.md`

---

## Phase history

<!-- Append-only. One row per phase transition. Track is dev | qa. -->

| Date       | Track | From phase | To phase | Session summary                          |
| ---------- | ----- | ---------- | -------- | ---------------------------------------- |
| YYYY-MM-DD | dev   | —          | 0        | Milestone opened; state file initialized |

---

## Accumulated context

<!-- ID list of produced artifacts — not prose. One ID per line. -->

- (none yet)

---

## Handoff metadata

**Open blockers:**
- (none)

**Blocking OQ-NNN IDs:**
- (none)

**Cross-FS dependencies:**
- (none)

---

## Session continuity

**Last session completed:** (nothing yet)

**Next session should start with:** Load this file; check `dev_phase`, `qa_phase`, and `next_action`; load the relevant flow file for the track being worked.
