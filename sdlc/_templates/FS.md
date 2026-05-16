---
id: FS-NNN
title: <Spec title — usually mirrors the milestone slice>
status: draft                 # draft | reviewed | approved | implemented
milestone: M-NN
frs: [FRS-NNN, FRS-NNN]       # subset of the milestone's FRSs aggregated by this FS
new_nodes: []                 # DDD node IDs this FS introduces — written directly to docs/nodes/<type>/ with status: proposed at Phase 2 (formerly `scoped_nodes:`)
changes: []                   # CHG-NNN IDs emitted by this FS (empty if pure addition); CHG files live at nodes/changes/ permanently
depends_on_specs: []          # sibling FSs whose proposed nodes this FS reads — must merge first
service_repos: []             # workspace-relative paths of service repos this FS touches; multi-service projects only — empty for monolith. Branch-coherence check at Phase 3 verifies each is on `feat/FS-NNN-<slug>`. See sdlc/scripts/check-branch-coherence.sh.
adrs: []                      # ADR IDs consulted (carried from FRSs + anything mid-draft)
standards: []                 # STD IDs this FS consumes (carried from FRSs + anything mid-draft); narrowed at Phase 2 context load
ccc: []                       # CCC IDs this FS cites (carried from FRSs); deviations filed as ADRs in `adrs:`
stack: []                     # subset of api | ui | test | full-stack | infra | agnostic — canonical enum in ../BOUNDARY.md § Stack axis
resolves: []                  # OQ-NNN IDs this FS closes; reciprocal — each OQ's `resolved_by:` cites this FS
test_plan_path:               # filled by the QA-track Test plan ingest flow (post-Phase-2, independent session), relative to this FS folder (e.g. "test-plans/")
created: YYYY-MM-DD
merged: false                 # flipped true at Phase 3 after CHG deltas applied and new-node statuses flipped proposed→active
merge_sha:                    # git sha of HEAD at the moment Phase 3 merge completes
---

# FS-NNN: <Title>

> Planning artifact. **No syntax — the FS names structures; Phase 3 writes them.**
> The behavioral content lives in the
> canonical DDD nodes at `docs/nodes/<type>/` (this FS's new nodes are
> written directly there at Phase 2 with `status: proposed`) — this file
> references them, does not redescribe them. If you find yourself
> restating what a canonical node says, replace the restatement with a
> link to the canonical file.
>
> **Empty optional sections are omitted** — no `_none yet_`, "n/a", or "none
> identified" stubs. Either the section has content or it does not appear.
>
> File location:
> `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/FS-NNN.md`
> CHG nodes live under `nodes/changes/` alongside this file (milestone-
> scoped, permanent — never promoted to canonical).

## Open blockers

*Conditional. Render this section only when at least one OQ-NNN with
`gate_effect: blocking` applies to this FS. Otherwise omit entirely.*
Non-blocking OQs stay in the "Open questions" section at the bottom.

- **OQ-NNN** — cite by ID. The OQ file under
  `docs/discovery/open-questions/` carries the question, origin, and
  resolution path. Do not duplicate the question text here.

## Coverage

Every FRS acceptance criterion in scope is **fully covered** in this table — one row per
Flow scenario it spans (e.g., happy + fault paths get one row each); no AC partially
covered or duplicated within a scenario.
If a criterion cannot be mapped to a scoped Flow scenario, raise an
`OQ-NNN` under `docs/discovery/open-questions/` with
`origin: fs-authoring, origin_ref: <this FS>, gate_effect: blocking`,
and cite the OQ ID in the "Flow scenario" column — not as loose FS prose.

| FRS    | Acceptance criterion          | Flow scenario      | Task(s)  |
| ------ | ----------------------------- | ------------------ | -------- |
| FRS-NNN | …                            | FLW-NNN happy path | T1, T3   |
| FRS-NNN | …                            | FLW-NNN fault path | T5       |

## New nodes

Every DDD node this FS **introduces**, written directly to canonical at
`docs/nodes/<type>/<ID>-<slug>.md` with `status: proposed` at Phase 2
ingest. The 2-file node touch fires per new node at Phase 2 (node file +
`proposed` row in the per-type `index.md`). Phase 3 merge flips each
to `status: active` by editing the node's frontmatter and re-syncing the
index row's Status column. Modifications to existing canonical nodes are
captured in the CHG (see "Change maps" below), not here.

- ACT-NNN — <new actor, one line>
- ENT-NNN — <new entity / new invariant / new lifecycle>
- CMD-NNN — <new command, write operation>
- QRY-NNN — <new query, read operation>
- FLW-NNN — <new flow>
- STA-NNN — <new state machine>
- MOD-NNN — <module / feature area>
- SCR-NNN — <UI screen / view>
- CON-NNN — <contract surface — HTTP route / event topic / queue>
- PERM-NNN — <authorization rule>
- DEC-NNN — <node-scoped decision>
- INT-NNN — <integration>

ID-claims for every entry above must already be recorded in the milestone's
`id-claims.md`. See [`../workflow/plan.md → ID-claim protocol`](../workflow/plan.md#id-claim-protocol).

## Test plan

The TC files the QA-track Test plan ingest flow produced for this FS,
grouped by use-case sub-folder. Filled by
[`../workflow/test-plan-ingest.md`](../workflow/test-plan-ingest.md) after
the FS validation loop passes — runs in an independent session on the
QA-track operator's cadence (no shared session with Phase 2).

TC files live at `test-plans/<use-case>/TC-NNN-<slug>.md` relative to
this FS folder; `test_plan_path:` in the frontmatter records the
relative root (typically `test-plans/`). TCs are milestone-scoped — no
promotion to canonical at Phase 3 merge, no per-type `index.md` / `log.md`.

- `<use-case>/` (display | add | edit | delete | toggle | reorder | search | export | view | preview | auth | bulk | workflow)
  - TC-NNN — <one-line title>, traces to AC-NN + FLW-NNN#happy
  - TC-NNN — <one-line title>, traces to Matrix: <row name>

## Change maps

Filled only when any FRS in this FS lists IDs in `touches_nodes`. Empty for
pure-addition FSs.

- CHG-NNN — targets ENT-NNN, STA-NNN. <one-line summary of the delta>
- CHG-NNN — targets CMD-NNN. <…>

Each CHG-NNN lives **permanently** at
`nodes/changes/CHG-NNN-<slug>.md` (relative to this FS folder). CHG nodes
are never promoted to canonical — there is no `docs/nodes/changes/`
subtree. Phase 3 implementation applies the CHG's `modifies[]` /
`removes[]` / `supersedes[]` deltas to canonical targets and flips the
CHG's status `approved → merged` in place.

## Architecture decisions

- Decision: …
  - Why: …
  - Alternatives considered:
    - Option A — optimizes for …, trades off …
    - Option B — optimizes for …, trades off …
    *(Optional. Omit when the call is obvious / low-stakes — do not fabricate
    strawmen to fill the slot. See `workflow/plan.md` → "Generate before
    converging".)*
  - Existing components reused:
  - **Route this decision:**
    - **Promote to ADR-NNN?** Yes if it constrains how we'd design future
      features we haven't met yet — stack, layering, framework idiom,
      tooling, cross-cutting policy. Author via
      [`../workflow/plan.md → "Promote to ADR vs file a DEC vs keep inline"`](../workflow/plan.md#promote-to-adr-vs-file-a-dec-vs-keep-inline),
      then collapse this prose to a reference.
    - **File a DEC-NNN standalone node?** Yes if it shapes one specific
      node's behavior. Written directly to canonical
      `docs/nodes/decisions/DEC-NNN-<slug>.md` with `status: proposed`
      at Phase 2; Phase 3 flips to `active`.
    - **Keep inline?** Yes if small, scoped to this FS, and not reusable.
    - Discriminator: *ADR if it constrains future nodes we haven't met yet;
      DEC if it shapes one specific node's behavior; inline otherwise.*

## Data model changes

Migrations, schema changes, new tables. Reference the canonical ENT-NNN
nodes (this FS's new entities at Phase 2 with `status: proposed`) for
invariants — do not restate.

## Interface contracts

Contract surface — HTTP routes, event payloads, queues. Reference scoped
CON-NNN nodes for routes / topics / queues and scoped CMD-NNN nodes for
trigger / input / output details. Do not duplicate.

## Implementation tasks

Ordered. Each task small and independently actionable. Phase 3 Stage 1
Merge (flip `proposed → active` on new nodes + apply CHG deltas) is task
T0 implicitly — list code tasks from T1.

**Cohort ordering.** Group and order tasks along the architectural
cohorts your project's convention ADRs declare, so that each cohort's
compilation succeeds before the next starts. See
[`../workflow/plan.md → Implementation-task cohort ordering`](../workflow/plan.md#implementation-task-cohort-ordering)
for the procedure and the relevant convention ADR for this project's
cohort table.

1. T1 — …
2. T2 — …

## Dependencies and constraints

- Brownfield constraints (canonical nodes this FS modifies via CHG):
- Sibling-FS dependencies (`depends_on_specs:`):
- External dependencies:
- Sequencing within the FS:

## QA verification (gate before `implemented`)

Solo means QA hat ≠ skipped. Before marking this spec `implemented`:

- [ ] Every linked Flow scenario (happy / edge / fault) has been executed.
- [ ] Every FRS acceptance criterion in the Coverage table has passed.
- [ ] TC files exist for every use-case sub-folder declared in the
      `## Test plan` section.
- [ ] Every FRS acceptance criterion traces to at least one TC via the
      TC's `**Traces to:**` line.
- [ ] Every FLW scenario (happy / edge / fault) traces to at least one TC.
- [ ] Test spec files generated under `tests/{test_dir}/<feature>/`
      and run green for every use case with resolved selectors. See
      [`../workflow/test-runner-cookbook.md`](../workflow/test-runner-cookbook.md)
      and [`../workflow/test-suite-codegen.md`](../workflow/test-suite-codegen.md).
- [ ] Every node in `new_nodes:` has had its canonical status flipped
      `proposed → active` and the per-type index row's Status column
      re-synced (2-file node touch — see
      [`../workflow/maintenance-discipline.md`](../workflow/maintenance-discipline.md)).
- [ ] Every CHG `modifies[]` entry has been applied to its canonical
      target, with the per-type index row re-synced as needed (2-file
      node touch).
- [ ] Every CHG node's status flipped `approved → merged` in place at its
      milestone path (no canonical promotion).
- [ ] No silent edits to canonical nodes outside what `new_nodes:` or CHG
      `modifies[]` declared, irrespective of phase.
- [ ] No invented new nodes — every node in `new_nodes:` has a populated
      `source_ref` that traces to a specific FRS acceptance criterion or
      Behavior paragraph. Nodes without a clause to back them are removed
      or promoted to a DEC.
- [ ] No `OQ-NNN` is marked `resolved` without a non-null `resolved_by:`
      pointing at a DEC / ADR / FRS revision / FS revision / CHG /
      RESEARCH doc, and the resolver carries `resolves: [OQ-NNN]` reciprocally.
- [ ] `merged: true` and `merge_sha:` set on this FS.

## Open questions

If any remain with `gate_effect: blocking`, **the spec is not ready for
Phase 3.** Cite by `OQ-NNN`; do not duplicate the question text. OQ files
live under `docs/discovery/open-questions/`.

- [ ] OQ-NNN — one-line summary (optional; the OQ file is the source of
      truth)
