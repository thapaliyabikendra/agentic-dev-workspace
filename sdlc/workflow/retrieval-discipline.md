---
name: retrieval-discipline
description: "When and what to load at each phase entry. The primary token lever — wholesale-read the index, narrow-load individual pages. Load this file when entering any phase or when a retrieval decision is in doubt."
---

# Retrieval Discipline

The primary token lever. Skill prompts compact at the margin; not re-deriving
the corpus each session is the 10× win.

## Section routing

This file is itself section-routable. The Title above and the
[Executor contract](#executor-contract-for-section-routed-flow-files)
below are this file's doctrinal preamble — always read on first phase
entry of a milestone. The returning reader who knows which phase is
firing reads only the sections the table names.

| Operation | Sections to read |
|---|---|
| Phase 0 / Phase 1 entry | [Nodes → Phase 0/1 — discovery reads](#phase-01--discovery-reads) + [Baselines](#baselines) + [ADRs](#adrs) + [Exceptions](#exceptions) |
| Phase 1.5 entry (Validation gate) | [Baselines](#baselines) + [STDs and CCCs](#stds-and-cccs) (Phase 1.5 row of the matrix) + [ADRs](#adrs) + [Exceptions](#exceptions) |
| Phase 2 entry (Ingest) | [Nodes → Phase 2/3 — ingest and merge reads](#phase-23--ingest-and-merge-reads) + [STDs and CCCs](#stds-and-cccs) (Phase 2 row + [Index opt-out](#index-opt-out)) + [Test artifact rule books](#test-artifact-rule-books) + [ADRs](#adrs) + [Exceptions](#exceptions) |
| Phase 3 entry (Merge + Code) | [Nodes → Phase 2/3 — ingest and merge reads](#phase-23--ingest-and-merge-reads) + [STDs and CCCs](#stds-and-cccs) (Phase 3 row) + [Tech-stack operational baseline](#tech-stack-operational-baseline) + [Test artifact rule books](#test-artifact-rule-books) + [ADRs](#adrs) + [Exceptions](#exceptions) |
| QA track entry (test-plan-ingest / test-suite-codegen / qa-gate) | [QA-track retrieval](#qa-track-retrieval) (per `qa_phase`) + [ADRs](#adrs) + [Exceptions](#exceptions) |
| Index row schema lookup (any phase) | [ADRs → Index row schemas](#index-row-schemas) |
| ADR / DEC body-budget or title-cap question | [ADRs](#adrs) |
| Maintenance op firing (load-on-trigger) | [Maintenance operation references](#maintenance-operation-references) — jump to the firing op's row |

Returning-reader savings depend on **executor compliance**: if a session
loads the whole file by default after the second phase entry of a
milestone, the routing table provides nothing. The
[Executor contract](#executor-contract-for-section-routed-flow-files)
below makes section-routing the *intended* read pattern for this file
and the other flow files that declare a routing table.

If your operation is not in the table, read the file in full.

## Executor contract for section-routed flow files

Flow files in `sdlc/workflow/` that carry a `## Section routing` table
near the top — currently [`design.md`](design.md), [`plan.md`](plan.md),
[`implementation.md`](implementation.md),
[`maintenance-discipline.md`](maintenance-discipline.md), and this file
([`retrieval-discipline.md`](retrieval-discipline.md)) — may be
**section-routed** at entry. The first-time reader consumes the file top
to bottom (title, hard-gate, when-to-use, anti-pattern); the returning
reader who knows which operation is firing reads only the sections the
routing table names for that operation.

Wholesale-read is the safe default. Section-route only when:

1. The flow file declares a `## Section routing` table.
2. Your operation appears as a row in that table.
3. You've already consumed the file's doctrinal preamble at least once
   this milestone (hard-gate, anti-pattern, when-to-use; for this file,
   Title + this Executor contract).

Convention sections the routing table calls out as "skim once per
session" are not optional — read them on first session entry.

This rule is the executor-side contract that makes the routing tables
in the flow files realize their token savings. Without it, the tables
are decorative.

## Nodes

### Phase 0/1 — discovery reads

At Phase 0 (milestone scoping) and Phase 1 (FRS authoring), for each node
type plausibly in scope read `docs/<component>/nodes/<type>/index.md` first —
it carries one line per node (same bounded-file posture as the ADR index).
Glob the type folder (`docs/<component>/nodes/<type>/*.md`) only when no
`index.md` exists for that type yet (expected on a green KB or a type with
no nodes ingested yet). Record node IDs identified from the index in the
milestone-scope discovery's "Existing nodes scanned" section and in FRS
`touches_nodes` frontmatter.

### Phase 2/3 — ingest and merge reads

When entering Phase 2 (Ingest) or Phase 3 (Merge + Code), read
**only** the nodes the milestone's FRSs declare in `touches_nodes` and
`produces_nodes`, plus one hop of transitive references (nodes those nodes
link in `related`). Do **not** pre-load `docs/<component>/nodes/` wholesale "to be safe."
If a node not on that list turns out to be necessary, stop, update the FRS
to declare it, and surface the omission to the QA hat — silently broadening
the load defeats the whole point.

Phase 2 retrieval reads canonical the same as every other phase — there is
no separate staging tree. The FS's `new_nodes:` frontmatter is the routing
list for nodes the FS introduces (each carries `status: proposed` in
canonical until Phase 3 merge flips it to `active`); the CHG node's
`modifies[]` is the routing list for canonical nodes the FS intends to
modify (Phase 3 applies the deltas).

## ADRs

A parallel rule. At every generator entry (Phase 0 / 1 / 2 / 3),
the **one file** wholesale-read is `adrs/index.md` — by
design it carries one line per ADR, bounded size. From the index, pick the
ADR IDs relevant to the scope and narrow-load those pages only. Declare the
consulted IDs in the artifact's `adrs:` frontmatter. **Individual ADR pages
are not wholesale-loaded.** Same rule, second corpus.

**Budgets.** Index row carries a title cell ≤120 chars (the title *is* the
one-line summary — if it doesn't fit, re-draft). ADR body ≤80 lines
(excl. frontmatter). DEC body ≤60 lines. These caps keep the index cheap
when always-loaded and bodies scannable when narrow-loaded. Section caps
live in the templates ([`../_templates/ADR.md`](../_templates/ADR.md),
[`../_templates/nodes/DECISION.md`](../_templates/nodes/DECISION.md)).

### Index row schemas

The canonical row format for `adrs/index.md`, `nodes/decisions/index.md`,
and per-component variants. Same shape everywhere; deviations are bugs.

```
| ID | Status | Title (≤120 chars) | Tags | Stack | Source | Updated |
|----|--------|--------------------|------|-------|--------|---------|
```

- **ID** — `ADR-NNN` or `DEC-NNN`.
- **Status** — `proposed` / `accepted` / `active` / `superseded` / `deprecated`.
  Superseded and deprecated rows live in a separate `Superseded/deprecated`
  table below the Active table.
- **Title** — the artifact's `title` frontmatter, one sentence imperative, ≤120 chars. If a title doesn't fit, the title itself is wrong — re-draft.
- **Tags** — comma-joined from the artifact's `tags:` frontmatter.
- **Stack** — comma-joined from the artifact's `stack:` frontmatter (e.g., `api`, `ui`, `agnostic`). The Phase 2 / Phase 3 retrieval narrows by intersection with the consuming artifact's `stack:`.
- **Source** — origin reference, mapped per type:
  - **ADRs** — comma-join non-null `frs_origin` and `fs_origin`
    (e.g., `FRS-007`, or `FRS-007, FS-012`). Standalone ADR with neither
    set → `—`.
  - **DECs** — take the first entry from `source_ref[]` and render as
    `FRS-NNN` / `FS-NNN` / `absorption:<basename>`. Multi-source DECs
    show first only; full list stays in body frontmatter.
- **Updated** — the artifact's `updated:` frontmatter date.

**Row hygiene:** one row per artifact, no multi-line cells, no prose
outside the table. Lifecycle moves (status flip, supersede) re-sync the
row per [`maintenance-discipline.md`](maintenance-discipline.md).

## STDs and CCCs

Two more parallel corpora, same posture as ADRs.

- **Engine standards** — `sdlc/standards/index.md` is wholesale-read at Phase
  1.5 (for the STD-conformance check), Phase 2 plan context load, Phase 3
  implementation context load, and the QA gate. Narrow-load each STD whose
  `applies_when.stack:` intersects the consuming artifact's `stack:` plus
  every STD declared in the artifact's `standards:` frontmatter. STDs tagged
  `convention` / `task-ordering` / `code-quality` are loaded at Phase 3 + QA
  gate even when the FS missed declaring them (surface the gap; update the
  FS).
- **Cross-cutting concerns** — `docs/shared/ccc/index.md` is snapshot-read at
  Phase 1.5 (replacing the prior flat-doc snapshot) and wholesale-read at
  Phase 2 / Phase 3 / QA gate. Narrow-load each CCC declared in the
  consuming artifact's `ccc:` frontmatter. Individual CCC pages are not
  wholesale-loaded.

Phase-by-phase retrieval matrix:

| Phase | STD index | CCC index | Narrow-load posture |
|-------|-----------|-----------|---------------------|
| 1.5   | scan      | snapshot  | STDs whose `applies_when.stack:` matches FRS `stack:`; CCCs declared in FRS `ccc:`. Drives the STD-conformance + CCC-deviation Pass 1 checks. |
| 2     | wholesale | wholesale | STDs from FS `standards:` ∪ convention-tagged; CCCs from FS `ccc:`. |
| 3     | wholesale | wholesale | Same as Phase 2, plus convention-tagged STDs not yet in FS. |
| QA gate | wholesale | wholesale | Drives STD-conformance + CCC-deviation subagent dispatches alongside the existing ADR-conformance check. |

### Index opt-out

The CCC index is the only opt-out-able corpus. When the consuming
artifact declares `ccc: []` in frontmatter, **skip the CCC index load
at Phase 2 and Phase 3 entry**. The empty declaration is the executor's
commitment that no CCC applies to this work.

- **Scope.** Phase 2 / Phase 3 entry only. The Phase 1.5 snapshot and
  the QA-gate wholesale-read remain non-negotiable — those gates do
  independent verification, not trust of the FS's declaration.
- **STD and ADR indexes do NOT opt out.** Both corpora have
  convention-tag fallbacks (STDs tagged `convention` / `task-ordering` /
  `code-quality`; ADRs tagged `convention`) that the executor must
  discover from the index even when the consuming artifact missed
  declaring them. With CCCs there is no convention-tag fallback — the
  FS's `ccc:` list is the complete authority.
- **Cost.** CCC index is ~820 tokens at 13 entries today; the opt-out
  recovers that on every Phase 2 / 3 entry where `ccc:` is empty.
  Catalog growth makes this lever bigger over time.

If `ccc:` is present but non-empty, load the index normally and
narrow-load each declared CCC's Baseline section as per the matrix
above.

## Baselines

`docs/shared/glossary.md` is snapshot-read once at every Phase 1.5 gate
entry (and at Phase 0 / Phase 1 drafting sessions that consult it for term
resolution). The CCC baselines previously lived in a flat
`docs/shared/cross-cutting-concerns.md` snapshot; that file was retired
2026-05-16 in favor of per-CCC files under `docs/shared/ccc/` — see the
`## STDs and CCCs` section above for the new snapshot posture. The current
version of each consulted baseline / index is captured in any Phase 1.5
Validation finding that fires (audit reproducibility set —
see [`frs-validation-rules.md`](frs-validation-rules.md#audit-reproducibility-set)).
Edits between runs follow
[Maintaining baseline references](./baseline-references.md).

**Body budget.** Each CCC's Baseline section keeps the default to one
short paragraph (≤140 chars per the prior cell-budget convention); nuance
that won't fit escapes to an ADR (back-linked via `related: [CCC-NNN]`)
and the Baseline becomes `See ADR-NNN.` This keeps the always-snapshot-read
CCC index injectable. Enforcement:
[`baseline-references.md § Hard rules across all ops`](baseline-references.md#hard-rules-across-all-ops).

## Tech-stack operational baseline

`tech-stack.md` is
the project's living operational reference — pinned stack versions,
application layout, operational commands, environments, runtime state,
milestone progress. **Wholesale-read at Phase 3 implementation entry**
alongside the ADR index and the FS; **not snapshot-read at Phase 1.5**
(its mutability is intentional and decoupled from requirements
validation). Updated at Phase 3 merge when its sections change — see
[`maintenance-discipline.md → Tech-stack touch at merge`](maintenance-discipline.md).
Stack *decisions* still author ADRs; tech-stack reflects the operational
state those decisions reduce to.

## Test artifact rule books

[`test-data-generation.md`](test-data-generation.md) is
wholesale-read at Phase 2 Test plan ingest (to populate every TC's
`## Test Data` section) and at Phase 3 Test suite codegen (to interpolate
directive tokens into test runner code).
[`test-runner-cookbook.md`](test-runner-cookbook.md) is
wholesale-read at Phase 3 Test suite codegen (action-inference, code
emission, full spec template). Both are bounded-size reference docs —
same retrieval posture as the Phase 1.5 rule books.

## Maintenance operation references

Each is wholesale-read **only** when the matching operation fires; otherwise unread.

- [`maintenance-discipline.md`](maintenance-discipline.md) —
  Phase 3 merge, ADR lifecycle events, or any canonical node edit (the
  tiered touch).
- [`baseline-references.md`](baseline-references.md) —
  add / change / retire / drift-detection ops on
  `docs/shared/glossary.md` or `docs/shared/ccc/` (entry: `docs/shared/ccc/index.md`). Runs between
  Phase 1.5 gates, never during one.
- [`authoring-adr.md`](authoring-adr.md) — authoring an
  ADR (standalone, from an FRS, or from an FS).
- [`derived-reports.md`](derived-reports.md) —
  regenerate the BUSINESS / TECHNICAL / `<kind>` overview.
- [`absorb-concept.md`](absorb-concept.md) —
  `absorb-concept` pass: routes insights surfaced during report synthesis
  to canonical KB nodes via RESEARCH staging.
- [`legacy-absorption.md`](legacy-absorption.md) —
  `absorb-legacy-doc` pass on `docs-backup/` artifacts.
- [`evolving-the-workflow.md`](evolving-the-workflow.md) —
  defining a new node type, refining a template, coining a new
  derived-report type.
- [`phase-state.md`](phase-state.md) —
  milestone phase-position tracking; lazy-create, read, update, and
  persist `MILESTONE-STATE.md` across session boundaries.
- [`verify.md`](verify.md) —
  post-Phase-3 UAT confirmation; walks FRS acceptance criteria in
  aggregate, routes gaps, emits `UAT.md`. Non-blocking — fires after
  Phase 3 QA passes, before milestone close.
- [`agent-contracts.md`](agent-contracts.md) —
  reference for the two agent I/O contract layers (subagent dispatch
  return shape + operation completion markers). Load when authoring an
  operation that spawns subagents.

## QA-track retrieval

Each QA flow starts a fresh session (its own `/clear` boundary). Load only
what the flow needs at entry; do not carry forward dev-track reads.

### test-plan-ingest (`qa_phase: qa-plan`)

Load the FS, every FRS declared in the FS's `frs:` frontmatter, each FRS's
referenced FLW nodes (scenario anchors), and each FRS's referenced ENT nodes
(field constraints). Load the milestone's `id-claims.md` for TC ID
allocation. Wholesale-read [`coverage-matrix.md`](coverage-matrix.md) and
[`test-data-generation.md`](test-data-generation.md) rule books. Do **not**
load production code at this phase.

### test-suite-codegen (`qa_phase: qa-suite`)

Load the FS, all TC files under `test-plans/`, the runner config (e.g.,
`playwright.config.ts`), and `tests/.env.example` if present.
Wholesale-read [`test-runner-cookbook.md`](test-runner-cookbook.md) and
[`test-data-generation.md`](test-data-generation.md) rule books.
Production code may be loaded **only** for selector discovery (a
post-implementation explorer pass) — not for behavioral context.

### qa-gate (`qa_phase: qa-gate`)

Load the FS, every ADR declared in the FS's `adrs:` frontmatter plus any
convention-tagged ADRs identified from `docs/<component>/adrs/index.md`,
every STD declared in the FS's `standards:` plus convention-tagged STDs
from `sdlc/standards/index.md`, every CCC declared in the FS's `ccc:` (read
the Baseline section of each), the generation report produced by
`test-suite-codegen.md`, the test results (pass/fail), and all affected
canonical nodes. Wholesale-read
[`agent-contracts.md`](agent-contracts.md) for the ADR-conformance,
STD-conformance, and CCC-deviation dispatch contracts.

## Exceptions

Always-on index reads (every phase consumes these as one-line summaries;
individual pages are narrow-loaded):
- ADR index — `docs/<component>/adrs/index.md` + `docs/shared/adrs/index.md`.
- STD index — `sdlc/standards/index.md`.
- CCC index — `docs/shared/ccc/index.md` (except at Phase 2 / Phase 3
  entry when the consuming artifact declares `ccc: []` — see
  [§ Index opt-out](#index-opt-out)).

Phase 0 / Phase 1 only:
- Change-request KB scan — reads per-type `docs/<component>/nodes/<type>/index.md`
  for each node type in scope; globs the type folder only when no `index.md` exists
  for that type yet. See [`design.md`](design.md) and `§Phase 0/1 — discovery reads` above.

---

## Integration

**Canonical home of:** the retrieval posture for nodes, ADRs, baselines,
tech-stack, test rule books, and maintenance operation references across
all phases.

**Parent:** [`../WORKFLOW.md → Retrieval discipline`](../WORKFLOW.md#retrieval-discipline) —
WORKFLOW.md carries the always-loaded summary; this file is the full procedure.

**Related:** [`../PRINCIPLES.md`](../PRINCIPLES.md) — "Wholesale-reading the
KB" is the named anti-pattern; this file is the preventive discipline.
