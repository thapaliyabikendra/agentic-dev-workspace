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

**Do NOT use when:** you only need the dispatch shapes or quality tests and no contract
definition work is happening — jump directly to [`## Dispatch shapes`](#dispatch-shapes).

---

## Contract Layer 1 — Subagent dispatch return shape

**Canonical home:** This file. The gate-specific preamble, return contract, mutation verification, and orchestrator outcome routing are all authoritative here.

### Gate-specific preamble

Gate checks that fan out to multiple specialist passes — **Phase 1.5
validation** (the eight Pass 1 checks: `existence`, `sanity`,
`adr-conflict`, `standard-conflict`, `ccc-deviation`, `flw-coverage`,
`phase-1-bare-body-shape`, `chg-sanity` — per
[`design.md → Pass 1`](design.md#pass-1--per-frs-gate-runs-after-each-frs-is-authored))
and the **Phase 3 QA hat ADR-conformance check** (against the FS's declared
`adrs:`) — run as **parallel** inline `Agent(subagent_type=Explore, ...)`
dispatches in a single message, followed by synthesis in the main session.
The dispatches are file-disjoint over one FRS — each reads the FRS plus
the Phase-1-born FLW (per `produced_flw:`) and Phase-1-born CHG (per
non-empty `touches_nodes:` — the chg-sanity dispatch skips when
`touches_nodes:` is empty), but each writes to a disjoint finding row.
(ACT-NNN is a Phase-1 ID claim only; the ACT file is born at Phase 2 —
R-NEW-2a retired 2026-05-17.)

Every dispatch must be self-contained: include the goal, the exact
files in scope, the conventions to follow, and the expected return
shape (JSON schema, structured list, file paths only). Free-form prose
returns force the orchestrator to re-read and re-interpret, erasing
the token savings.

### Phase 1 authoring (FRS + FLW + CHG) — main-session work

Phase 1 authors up to three artifacts per user-journey: the FRS, the
Phase-1-born FLW (per R-NEW-1 / R-NEW-2), and the Phase-1-born CHG (per
R-CHG-1..4 — when the FRS declares non-empty `touches_nodes:`). When the
FRS introduces a new actor role (`produced_actor:` set), the ACT-NNN ID
is claimed at Phase 1 in `id-claims.md` but the ACT file is authored at
Phase 2 (R-NEW-2a retired 2026-05-17). Default posture: **sequential
authoring in one main session**, in the order FRS → FLW → CHG (FLW after
FRS body because Scenarios must map back to ACs; CHG last because the
behavior-language `modifies[]` delta is grounded in the FRS's ACs / BRs
and the target canonical node's current body — both available at this
point). One-shot subagent dispatch covering all three is **acceptable but
not required** — the deliverable IS the prose (per § Dispatch shapes
"Don't dispatch when the deliverable IS the prose"), so dispatching adds
little when the human-author session can produce the artifacts in a few
turns. No existing contract assumes FLW or CHG are authored at Phase 2 —
the Phase 1.5 Pass 1 checks above read them from canonical / milestone-
scoped (FLW born to canonical at Phase 1; CHG born to milestone-scoped
`chg/` at Phase 1; ACT file is authored at Phase 2 with the rest of the
Phase-2-born nodes).

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

### Mutation verification (write-capable dispatches only)

After any write-capable subagent returns:

1. The orchestrator confirms the change — a diff, a grep, or a re-read
   of one canary file. Do not trust the return message alone; subagents
   reliably report success on edits they partially or incorrectly applied.
2. On wrong or empty result: do not retry the same dispatch blindly.
   Either re-dispatch to a stronger model or split the task into smaller,
   more mechanical units. A failed weak-model call followed by a
   successful strong-model call is signal about task shape, not a defeat.

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

## Dispatch shapes

Four canonical shapes for inline subagent dispatch:

- **Forked** — one `Agent(subagent_type=Explore, ...)`; read-heavy self-contained task
  (codebase scan, doc dig).
- **Dispatcher** — ≥ 2 `Agent(...)` in one message (parallel); main session synthesizes.
  Right for the Phase 1.5 gate and the Phase 3 ADR-conformance check.
- **Background** — `Agent(..., run_in_background=true)`; output is a write, not a sync reply.
- **Multi-phase** — sequential `Agent(...)` calls; each phase's summary feeds the next dispatch.

Don't dispatch for trivial work, for tasks needing user clarification mid-run, or when the
deliverable IS the prose (FRS / FS / OQ authoring — main session).

### Dispatch quality tests

Apply before any dispatch:

- **Isolability**: can you write the success criterion before dispatching? If not, keep it in the main session.
- **One concern**: each subagent gets one verb on one scoped set of files. Two verbs = two dispatches.
- **Tool floor**: default to read-only (Read / Grep / Glob). Promote to Edit / Write only when the task explicitly demands a mutation.
- **Parallelism rule**: fan out N subagents in parallel when their work is file-disjoint and order-independent. Serialize when subagents share files or when one output feeds another's input. Gate checks (Phase 1.5 + Phase 3) are the canonical parallel instances.

---

## Integration

- **Canonical Layer 1 home:** This file — [`## Contract Layer 1`](#contract-layer-1--subagent-dispatch-return-shape).
- **Dispatch shape taxonomy:** [`## Dispatch shapes`](#dispatch-shapes) in this file — load before dispatching.
- **Phase flow files that emit Layer 2 markers:**
  - [`workflow/plan.md`](plan.md) — emits `## PLANNING COMPLETE`
  - [`workflow/discuss.md`](discuss.md) — emits `## DISCUSSION COMPLETE`
  - [`workflow/verify.md`](verify.md) — emits `## VERIFICATION PASSED`
  - [`workflow/open-milestone.md`](open-milestone.md) — emits `## MILESTONE OPENED`
  - [`workflow/close-milestone.md`](close-milestone.md) — emits `## MILESTONE CLOSED`
