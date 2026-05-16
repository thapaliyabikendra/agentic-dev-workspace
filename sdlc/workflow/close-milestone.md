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
4. Append a final row to `## Phase history` (track is `dev` for the closing
   transition since the milestone overall closes from the dev-track perspective):
   ```
   | YYYY-MM-DD | dev | 3 | done | Milestone declared done; UAT.md status: <value>. |
   ```
5. Clear `session_notes`.
6. Update `## Session continuity`:
   - `Last session completed:` — "Milestone closed."
   - `Next session should start with:` — "N/A — milestone done."

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
