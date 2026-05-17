# close-milestone.md — Close a Milestone

> **Maintenance operation.** Consolidates all steps for cleanly closing a
> milestone: pre-condition verification, status flip, state-file finalization,
> home.md update, and roadmap regen.
>
> Run this operation **after** [`verify.md`](verify.md) has emitted
> `## VERIFICATION PASSED` (or the human BA/QA hat has explicitly accepted
> `partial` UAT status and decided to close anyway).

## When to Use

**Use when:** a milestone's Phase 3 QA has passed for all FSs, `UAT.md` has
been written, and the team is ready to declare the milestone done.

**Do NOT use when:**
- Any FS still has `merged: false` — Phase 3 must complete first.
- `UAT.md` has not been written — run [`verify.md`](verify.md) first.
- The milestone is being paused, not closed — update `MILESTONE-STATE.md`
  manually; do not close.

## Completion marker

When all steps below complete successfully, emit:

```
## MILESTONE CLOSED
```

H2 level, exact string, no inline content. Detectable by
`^## MILESTONE CLOSED$`.

---

## Procedure

### C-1 — Verify pre-conditions

Check all of the following before proceeding. If any fails, surface it and
stop — do not force-close.

- [ ] Every FS in `specs/` has `merged: true` in frontmatter.
- [ ] `docs/milestones/M-NN-<slug>/UAT.md` exists and `status:` is `passed`
      or the BA/QA hat has explicitly accepted `partial`.
- [ ] No unresolved Blocker OQs with `origin: validation-gate` or
      `origin: verify` and `gate_effect: blocking` remain open.

### C-2 — Flip milestone portal status

Edit `docs/milestones/M-NN-<slug>/M-NN-<slug>.md`:

1. Set `status: done` in frontmatter.
2. Add `done_date: YYYY-MM-DD` (today) to the frontmatter block, after
   `status:`.

No body changes required unless the "Sequencing notes" or "Out of scope"
sections need a final update.

### C-3 — Finalize MILESTONE-STATE.md

Edit `docs/milestones/M-NN-<slug>/MILESTONE-STATE.md`:

1. Set `dev_phase: done` and `qa_phase: done`.
2. Set `progress_percent: 100`.
3. Set `next_action: "Milestone closed on <YYYY-MM-DD>."`.
4. Clear `session_notes`.
5. Update `## Session continuity`:
   - `Last session completed:` — "Milestone closed."
   - `Next session should start with:` — "N/A — milestone done."

### C-3.5 — Flip milestone-scope discovery to adopted

Edit `docs/milestones/M-NN-<slug>/discovery/milestone-scope.md`:

1. Set frontmatter `status:` from its current value (typically `draft`
   or `done`) to `adopted`.

1-file touch — discovery surface; no `log.md`, no `index.md` re-sync.
Per-FRS discovery files were already flipped to `adopted` at their
Phase 1.5 exit (see
[`design.md → Checklist — Phase 1.5 exit`](design.md#checklist--phase-15-exit-gate-closure));
this step closes the milestone-level survey.

### C-4 — Update docs/home.md (if it exists)

If `docs/home.md` exists, update the milestone's row:
- Change `Status` from `in-progress` to `done`.
- Add `Done date` column value if the table has one.

### C-5 — Regenerate roadmap

Run [`regenerate-roadmap.md`](regenerate-roadmap.md). This moves the
milestone from "Milestones in flight" to "Shipped" in
`docs/ROADMAP.md` and clears any stale stuck-class entries
referencing this milestone's artifacts.

Commit `docs/ROADMAP.md` alongside the close commit.

### C-6 — Dangling cross-reference audit

Run the audit recipe in
[`maintenance-discipline.md § Periodic dangling-reference audit`](maintenance-discipline.md#periodic-dangling-reference-audit).
The milestone-close boundary is the canonical recurring touchpoint —
citations that drifted during the milestone (new framework edits
pointing at not-yet-authored ADRs / STDs / CCCs / tags) surface here
before the next milestone's Phase 3 sessions load them as load-bearing
references. Any dangling reference found is either resolved by
authoring the target in a follow-up commit before close, or downgraded
to a slot description in the citing file.

If the audit finds zero dangling references, record one line in the
close commit message: `audit: 0 dangling refs`. If it finds any,
resolve before flipping milestone status to `done`.

---

## Integration

- **Requires before:** [`verify.md`](verify.md) `## VERIFICATION PASSED`
  (or explicit BA/QA partial-close decision).
- **Reads:** `docs/milestones/M-NN-<slug>/M-NN-<slug>.md`;
  `docs/milestones/M-NN-<slug>/MILESTONE-STATE.md`;
  `docs/milestones/M-NN-<slug>/UAT.md`; all FS frontmatter for `merged:`.
- **Writes:** milestone portal `status: done`, `done_date:`; MILESTONE-STATE.md
  final state; optionally `docs/home.md`; triggers `docs/ROADMAP.md` regen.
- **No tiered touch** — milestone portal and state file are not canonical DDD
  artifacts. No `index.md` / `log.md` pair.
- **Sibling ops:** [`open-milestone.md`](open-milestone.md) (the inverse);
  [`verify.md`](verify.md) (the gate that fires before this op);
  [`regenerate-roadmap.md`](regenerate-roadmap.md) (triggered by C-5).
