---
id: FS-NNN
title: <Spec title — usually mirrors the milestone slice>
status: draft                 # draft | reviewed | approved | implemented
milestone: M-NN               # blank for CR track (mutually exclusive with cr:)
cr:                           # CR-NNN for CR track; blank for milestone track
frs: [FRS-NNN, FRS-NNN]       # subset of the milestone's FRSs aggregated by this FS
new_nodes: []                 # DDD node IDs this FS introduces — written directly to docs/nodes/<type>/ with status: proposed at Phase 2 (formerly `scoped_nodes:`)
# consumes_chgs: list of CHG-NNN IDs this FS owns and enriches (R-CHG-3).
# CHGs are born at Phase 1 per FRS when touches_nodes: is non-empty; the
# FS lists them here at Phase 2. Cardinality: one CHG ⇒ at most one FS
# (one-to-many from FS side). Default at Phase 2: consume every CHG born
# by this FS's constituent FRSs. Subset consumption + CHG merging allowed
# per R-CHG-3. Empty for pure-addition FSs.
consumes_chgs: []             # CHG-NNN IDs this FS consumes from the Phase-1-born CHG set
# `changes:` retired post-2026-05-17 cutover — replaced by `consumes_chgs:`.
# Pre-cutover FSs with `changes:` are grandfathered.
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
> CHG nodes live at the milestone-scoped permanent home
> `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` (sibling to `specs/`),
> never promoted to canonical. FS-CHG coupling is by frontmatter
> reference (`consumes_chgs:`), not filesystem nesting. Pre-cutover CHGs
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
- STA-NNN — <new state machine>
- MOD-NNN — <module / feature area>
- SCR-NNN — <UI screen / view>
- CON-NNN — <contract surface — HTTP route / event topic / queue>
- PERM-NNN — <authorization rule>
- DEC-NNN — <node-scoped decision>
- INT-NNN — <integration>

FLW-NNN is **not** listed here — FLW is Phase-1-born by the producing FRS
(per R-NEW-1), not Phase-2-introduced by the FS. The FS enriches the
Phase-1-bare FLW in place at Phase 2 (Sequence / Branches / Compensating /
Postconditions / Decisions); the enrichment is recorded by appending a
`{frs, fs, op: detail}` entry to the FLW's `source_ref:`, not by adding
the FLW to this "New nodes" list. See
[`../workflow/plan.md § 3 (b) Phase-1-born FLW enrichment`](../workflow/plan.md#3-new-node-canonical-ingest--phase-1-born-flw-enrichment).

Each entry above is born to canonical at this FS's Phase 2 ingest — the
per-type `index.md` row IS the claim (R-NEW-9 amended 2026-05-17 — no
`id-claims.md` introduce row written). See
[`../workflow/plan.md → ID-claim protocol`](../workflow/plan.md#id-claim-protocol).

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

Lists the CHG-NNN nodes this FS **consumes** — born at Phase 1 by the
FS's constituent FRSs whose `touches_nodes:` is non-empty (R-CHG-1).
Mirrors `consumes_chgs:` frontmatter. Empty for pure-addition FSs.

- CHG-NNN — targets ENT-NNN, STA-NNN. <one-line summary of the FS-side
  structural enrichment added on top of the Phase-1 behavior delta>
- CHG-NNN — targets CMD-NNN. <…>

**Cardinality and merging** (R-CHG-3). One CHG belongs to at most one FS.
Default at Phase 2: consume every CHG born by this FS's constituent FRSs.
Two adjustments allowed:

- **Subset consumption** — when splitting heuristics fire (different
  bounded context, risk, reviewer), this FS consumes only a subset; the
  unconsumed CHGs route to a sibling FS in the same milestone. Each CHG
  ends up consumed by exactly one FS before milestone close.
- **CHG merging** — at FS-authoring time, two sibling CHGs (born by
  sibling FRSs in the same milestone) may be merged when they target the
  same bounded context with matching risk and reviewer profile. Retain
  one CHG ID; fold the other's `modifies[]` / invariant deltas into it;
  flip the unused ID to `status: deprecated` (do NOT reuse). The
  retained CHG's `source_ref:` accumulates both originating FRS IDs.

Each consumed CHG lives **permanently** at
`milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` (sibling to `specs/`).
CHG nodes are never promoted to canonical — there is no
`docs/<component>/nodes/changes/` subtree. Phase 2 FS enrichment adds
structural before/after on each `modifies[]` entry, fills `adds[]`
(mirroring new node ingest), fills `migration_steps[]`. FS-validation
exit flips each consumed CHG `draft → approved`. Phase 3 implementation
applies the CHG's `modifies[]` / `removes[]` / `supersedes[]` deltas to
canonical targets and flips the CHG's status `approved → merged` in
place.

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
