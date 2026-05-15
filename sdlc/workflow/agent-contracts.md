# agent-contracts.md — Agent I/O Contract Reference

This is a **reference file** (posture: same as `frs-validation-rules.md`) —
not a procedural operation. Load it when authoring an operation that spawns
subagents, or when extending orchestrator outcome routing.

Two layers are defined here. They are orthogonal: Layer 1 governs what a
dispatched subagent returns; Layer 2 governs what a completed operation emits
to its caller. A subagent return and an operation completion marker can coexist
in one session without conflict.

---

## When to Use

**Use when:** writing a new operation file that spawns subagents and needs to
declare a return shape or emit a completion marker; extending the orchestrator
outcome-routing table; or verifying that an existing operation's marker string
matches the canonical regex.

**Do NOT use when:** you only need the dispatch rules — those live in
[`CLAUDE.md → When to Use (inline subagent dispatch)`](../../CLAUDE.md#when-to-use-inline-subagent-dispatch)
and are not duplicated here.

---

## Contract Layer 1 — Subagent dispatch return shape

**Canonical home:** [`sdlc/WORKFLOW.md → Inline dispatch shape for gates`](../WORKFLOW.md#inline-dispatch-shape-for-gates).
Reproduced here as a readable reference only — the canonical home wins on any discrepancy.

### Return shape (3-block format)

Every dispatched subagent returns exactly these three blocks:

```
## Findings
- <severity>: <finding> (file:line)

## Risks
- <severity>: <risk>

## Open questions
- <question> (raise as OQ-NNN if blocking)
```

≤ 400 words per dispatch. Cite by file path — do not restate rule books.
The main session merges findings; it never concatenates raw subagent reports.

### Orchestrator outcome routing

The orchestrator classifies each subagent return into one of four handles:

| Handle | Meaning | Orchestrator action |
|--------|---------|---------------------|
| `DONE` | No findings, no risks, no open questions | Proceed to next step |
| `DONE_WITH_CONCERNS` | Risks or low-severity findings present | Log concerns; proceed; flag at exit gate |
| `NEEDS_CONTEXT` | Subagent lacked required files or scope | Re-dispatch with corrected scope |
| `BLOCKED` | Blocking finding or blocking OQ raised | Stop; surface to human; raise OQ-NNN |

`BLOCKED` is the only handle that halts the phase flow. `DONE_WITH_CONCERNS`
accumulates into the exit gate summary — it does not stop progress.

---

## Contract Layer 2 — Operation completion markers

Completion markers are H2-level strings emitted at the end of an operation's
output to signal to an orchestrator that the operation's success path completed.
They are machine-detectable and distinct from Layer 1 subagent returns.

### Marker table

| Marker | Emitting operation | Condition | Consumer |
|--------|--------------------|-----------|----------|
| `## PLANNING COMPLETE` | `plan.md` | FS + all TCs validated; ready for `/clear` | Orchestrators entering Phase 3 |
| `## DISCUSSION COMPLETE` | `discuss.md` | `DISCUSSION-LOG.md` + all `FS-NNN-CONTEXT.md` written | Orchestrators triggering `/clear` |
| `## VERIFICATION PASSED` | `verify.md` | All FRS criteria confirmed-passing in `UAT.md` | Orchestrators closing milestone |
| `## MILESTONE OPENED` | `open-milestone.md` | Milestone folder, portal doc, and `MILESTONE-STATE.md` created | Orchestrators entering Phase 0 |
| `## MILESTONE CLOSED` | `close-milestone.md` | Milestone `status: done`, `MILESTONE-STATE.md` finalized, roadmap regenerated | Orchestrators archiving a milestone |

### Marker syntax rules

- **H2 level only.** The marker is a bare `##` heading.
- **Exact string.** No variation in casing, spacing, or punctuation.
- **No inline content on the marker line.** The line contains only the marker.
- **Placed at end of operation output.** Nothing follows the marker line in
  the same operation emission.
- **Detection regex:**
  ```
  ^## (PLANNING COMPLETE|DISCUSSION COMPLETE|VERIFICATION PASSED|MILESTONE OPENED|MILESTONE CLOSED)$
  ```

### Failure paths

Failure paths do **not** emit a Layer 2 marker. They use the Layer 1
`BLOCKED` handle: the operation's subagent (or the orchestrator itself)
returns a `## Findings` block with severity `blocking` and the orchestrator
routes to the `BLOCKED` handle above.

### Adding a new marker

1. Coin the marker string here first, in the marker table above.
2. One marker per operation per success path. An operation with two distinct
   success exits coins two markers — one per exit, both listed here.
3. Failure paths use the Layer 1 `BLOCKED` handle, not a new marker.
4. Update the detection regex after coining.
5. Update the emitting operation's file to emit the marker at its success exit.

---

## Existing dispatch shapes (from CLAUDE.md)

Cross-reference only — not duplicated here. See
[`CLAUDE.md → When to Use (inline subagent dispatch)`](../../CLAUDE.md#when-to-use-inline-subagent-dispatch)
for the four dispatch shapes (Forked / Dispatcher / Background / Multi-phase),
the dispatch quality tests (Isolability / One concern / Tool floor / Parallelism
rule), and the mutation verification posture for write-capable dispatches.

---

## Integration

- **Canonical Layer 1 home:**
  [`sdlc/WORKFLOW.md → Inline dispatch shape for gates`](../WORKFLOW.md#inline-dispatch-shape-for-gates) —
  the source of truth for the return shape and mutation verification procedure.
- **Dispatch shape taxonomy:**
  [`CLAUDE.md → When to Use (inline subagent dispatch)`](../../CLAUDE.md#when-to-use-inline-subagent-dispatch) —
  load before dispatching.
- **Phase flow files that emit Layer 2 markers:**
  - [`workflow/plan.md`](plan.md) — emits `## PLANNING COMPLETE`
  - [`workflow/discuss.md`](discuss.md) — emits `## DISCUSSION COMPLETE`
  - [`workflow/verify.md`](verify.md) — emits `## VERIFICATION PASSED`
  - [`workflow/open-milestone.md`](open-milestone.md) — emits `## MILESTONE OPENED`
  - [`workflow/close-milestone.md`](close-milestone.md) — emits `## MILESTONE CLOSED`
