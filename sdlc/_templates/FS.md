---
id: FS-NNN
title: <Spec title — usually mirrors the milestone slice>
status: draft                 # draft | reviewed | approved | implemented
milestone: M-NN               # blank for CR track (mutually exclusive with cr:)
cr:                           # CR-NNN for CR track; blank for milestone track
frs: [FRS-NNN, FRS-NNN]       # subset of the milestone's FRSs aggregated by this FS
new_nodes: []                 # DDD node IDs this FS introduces — born to docs/<component>/nodes/<type>/ at Phase 2 with status: proposed
consumes_chgs: []             # CHG-NNN IDs this FS consumes from the Phase-1-born CHG set (R-CHG-3; see ../workflow/plan.md §4)
# `changes:` retired post-2026-05-17 — grandfathered on pre-cutover FSs.
depends_on_specs: []          # sibling FSs whose proposed nodes this FS reads — must merge first
service_repos: []             # workspace-relative paths of service repos this FS touches; multi-service only. Branch-coherence check at Phase 3 — see sdlc/scripts/check-branch-coherence.sh.
adrs: []                      # ADR IDs consulted (carried from FRSs + anything mid-draft)
standards: []                 # STD IDs this FS consumes (carried from FRSs + anything mid-draft); narrowed at Phase 2 context load
ccc: []                       # CCC IDs this FS cites (carried from FRSs); deviations filed as ADRs in `adrs:`
stack: []                     # subset of api | ui | test | full-stack | infra | agnostic — canonical enum in ../BOUNDARY.md § Stack axis
framework: []                 # MANDATORY since 2026-05-22 — subset of abp-net | agnostic — canonical enum in ../BOUNDARY.md § Framework axis. Use [agnostic] for framework-independent specs. Phase 1.5 fails on missing (grandfathered for pre-2026-05-22 FSs).
resolves: []                  # OQ-NNN IDs this FS closes; reciprocal — each OQ's `resolved_by:` cites this FS
test_plan_path:               # filled by the QA-track Test plan ingest flow (post-Phase-2, independent session), relative to this FS folder (e.g. "test-plans/")
created: YYYY-MM-DD
merged: false                 # flipped true at Phase 3 after CHG deltas applied and new-node statuses flipped proposed→active
merge_sha:                    # git sha of HEAD at the moment Phase 3 merge completes
---

# FS-NNN: <Title>

> Planning artifact. **No syntax — the FS names structures; Phase 3 writes them.**
> Behavioral content lives in canonical DDD nodes; this file references
> them by ID, never restates them (CLAUDE.md HR-REF). Body-prose ID
> citations may use wiki links — `[[ENT-NNN]]` / `[[FLW-NNN#happy|happy path]]`
> (convention: `sdlc/KB-LAYOUT.md` § Wiki-link syntax; display-only —
> frontmatter declarations remain plain ID lists).
>
> **Empty optional sections are omitted** — no `_none yet_` / "n/a" stubs.
>
> File location: `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/FS-NNN.md`.
> CHG nodes: `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` (sibling to
> `specs/`), permanent, never promoted. FS-CHG coupling is by
> `consumes_chgs:` frontmatter, not filesystem nesting. Pre-cutover CHGs
> at `specs/FS-NNN-<slug>/nodes/changes/` are grandfathered.

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

DDD nodes this FS **introduces** at Phase 2 ingest. Modifications to
existing canonical nodes go in "Change maps" below, not here. Ingest
mechanics + ID-claim protocol:
[`../workflow/plan.md § 3`](../workflow/plan.md#3-new-node-canonical-ingest--phase-1-born-flw-enrichment)
and [`../workflow/plan.md → ID-claim protocol`](../workflow/plan.md#id-claim-protocol).

- ACT-NNN — <new actor, one line>
- ENT-NNN — <new entity / new invariant / new lifecycle>
- CMD-NNN — <new command, write operation>
- QRY-NNN — <new query, read operation>
- STA-NNN — <new state machine>
- MOD-NNN — <module / feature area>
- SCR-NNN — <UI screen / view>
- CON-NNN — <contract surface — HTTP route / event topic / queue>
- PERM-NNN — <authorization rule>
- DEC-NNN — <node-scoped decision>
- INT-NNN — <integration>

FLW-NNN is **not** listed here — FLW is Phase-1-born by the producing FRS
(R-NEW-1); the FS enriches in place at Phase 2 via FLW `source_ref:`. See
[`../workflow/plan.md § 3 (b)`](../workflow/plan.md#3-new-node-canonical-ingest--phase-1-born-flw-enrichment).

## Test plan

TC files produced by the QA-track flow, grouped by use-case sub-folder.
Filled by [`../workflow/test-plan-ingest.md`](../workflow/test-plan-ingest.md)
after FS validation passes (independent session).

TC files live at `test-plans/<use-case>/TC-NNN-<slug>.md` relative to this
FS folder; `test_plan_path:` frontmatter records the relative root. TCs
are milestone-scoped — no canonical promotion.

- `<use-case>/` (display | add | edit | delete | toggle | reorder | search | export | view | preview | auth | bulk | workflow)
  - TC-NNN — <one-line title>, traces to AC-NN + FLW-NNN#happy
  - TC-NNN — <one-line title>, traces to Matrix: <row name>

## Change maps

CHG-NNN nodes this FS **consumes** (R-CHG-1; mirrors `consumes_chgs:`).
Empty for pure-addition FSs.

- CHG-NNN — targets ENT-NNN, STA-NNN. <one-line summary of the FS-side
  structural enrichment added on top of the Phase-1 behavior delta>
- CHG-NNN — targets CMD-NNN. <…>

Cardinality, subset consumption, sibling CHG merging (R-CHG-3) and the
Phase 2 → Phase 3 status lifecycle (`draft → approved → merged`) live in
[`../workflow/plan.md § 4`](../workflow/plan.md#4-chg-node-consumption--enrichment)
and [`../workflow/in-flight-nodes.md`](../workflow/in-flight-nodes.md).

## Architecture decisions

- Decision: …
  - Why: …
  - Alternatives considered:
    - Option A — optimizes for …, trades off …
    - Option B — optimizes for …, trades off …
    *(Optional. Omit when the call is obvious / low-stakes.)*
  - Existing components reused:
  - Route: ADR / DEC / inline per
    [`../workflow/plan.md → Promote to ADR vs file a DEC vs keep inline`](../workflow/plan.md#promote-to-adr-vs-file-a-dec-vs-keep-inline).
    Collapse this prose to a reference once routed.

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

Cross-FS sequencing lives in the milestone portal's `## Sequencing notes`
([`../../M-NN-<slug>.md`](../../M-NN-<slug>.md)) — do not restate it
here. Frontmatter `depends_on_specs:` is the machine-readable surface.
This section carries only FS-internal constraints that have no other home.

- Brownfield constraints (canonical nodes this FS modifies via CHG): …
- External dependencies (libraries, services outside the canonical
  wiki): …
- Sequencing within the FS (task-level ordering inside this FS, not
  cross-FS): …

## QA verification (gate before `implemented`)

Run the shared FS QA-verification checklist before flipping this spec
`implemented`. The rule book carries the full row set; this section
records per-instance check state and any `n/a` annotations.

See [`../workflow/fs-qa-verification.md`](../workflow/fs-qa-verification.md).

## Open questions

If any remain with `gate_effect: blocking`, **the spec is not ready for
Phase 3.** Cite by `OQ-NNN`; do not duplicate the question text. OQ files
live under `docs/discovery/open-questions/`.

- [ ] OQ-NNN — one-line summary (optional; the OQ file is the source of
      truth)
