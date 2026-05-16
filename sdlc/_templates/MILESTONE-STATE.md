---
milestone_id: M-NN-<slug>
dev_phase: 0          # 0 | 1 | 1.5 | 2 | 3 | done
qa_phase: not-started # not-started | qa-plan | qa-suite | qa-gate | done
phase_entered: YYYY-MM-DD
next_action: "<brief description of the immediate next step>"
progress_percent: 10  # derived from the (dev_phase, qa_phase) table — see § Progress-percent formula
session_notes: ""
---

# Milestone State — M-NN-<slug>

> **Not a canonical DDD artifact.** No tiered touch; single-file read/write only.
> Instance location: `docs/milestones/M-NN-<slug>/MILESTONE-STATE.md`
> Lazy-create on first phase entry. Template: `sdlc/_templates/MILESTONE-STATE.md`

---

## Progress-percent formula

`progress_percent` is **derived from the (dev_phase, qa_phase) pair**,
not free-form. Anchor values:

| dev_phase | qa_phase    | progress_percent |
| --------- | ----------- | ---------------- |
| 0         | not-started | 10               |
| 1         | not-started | 25               |
| 1.5       | not-started | 40               |
| 2         | not-started | 55               |
| 3         | not-started | 70               |
| done      | qa-plan     | 80               |
| done      | qa-suite    | 90               |
| done      | qa-gate     | 95               |
| done      | done        | 100              |

The field is updated whenever either phase advances (see
[`../workflow/phase-state.md`](../workflow/phase-state.md)). Free-form
intermediate values (e.g., "45") are not permitted; if a milestone is
between two anchors, the table value of the **current** pair is correct.
The roadmap regen consumes this field as-is.

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

> Next-session handoff lives in frontmatter `next_action:` — load this
> file, check `dev_phase` / `qa_phase` / `next_action`, then load the
> relevant flow file for the track being worked. Do not restate
> `next_action` in this body section.
