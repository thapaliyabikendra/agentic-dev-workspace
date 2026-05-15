---
name: retrieval-discipline
description: "When and what to load at each phase entry. The primary token lever — wholesale-read the index, narrow-load individual pages. Load this file when entering any phase or when a retrieval decision is in doubt."
---

# Retrieval Discipline

The primary token lever. Skill prompts compact at the margin; not re-deriving
the corpus each session is the 10× win.

## Nodes

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

## Baselines

`glossary.md` and `cross-cutting-concerns.md` are
snapshot-read once at every Phase 1.5 gate entry (and at Phase 0 / Phase 1
drafting sessions that consult them for term resolution or
baseline-category citation). The current version of each is captured in
any Phase 1.5 Validation finding that fires (audit reproducibility set —
see [`frs-validation-rules.md`](frs-validation-rules.md#audit-reproducibility-set)).
Edits between runs follow
[Maintaining baseline references](../WORKFLOW.md#maintaining-baseline-references-glossary-cross-cutting-concerns).

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
  `glossary.md` or `cross-cutting-concerns.md`. Runs between
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

## Exceptions

Two, both at Phase 0 or Phase 1:
- Change-request KB scan — walks `docs/<component>/nodes/**` to find what an FRS
  *should* declare. See [`design.md`](design.md).
- ADR-index scan — always-on, every phase. The index file is the
  wholesale-read target; individual ADRs are not.

---

## Integration

**Canonical home of:** the retrieval posture for nodes, ADRs, baselines,
tech-stack, test rule books, and maintenance operation references across
all phases.

**Parent:** [`../WORKFLOW.md → Retrieval discipline`](../WORKFLOW.md#retrieval-discipline) —
WORKFLOW.md carries the always-loaded summary; this file is the full procedure.

**Related:** [`../PRINCIPLES.md`](../PRINCIPLES.md) — "Wholesale-reading the
KB" is the named anti-pattern; this file is the preventive discipline.
