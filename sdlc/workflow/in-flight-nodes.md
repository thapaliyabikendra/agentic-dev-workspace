---
name: in-flight-nodes
description: "Lifecycle rules for nodes with status: proposed — CHG mechanics, cross-FS dependencies, abandonment procedure, and the workflow self-extension note. Load when authoring or merging an FS that introduces new nodes or modifies existing canonical nodes."
---

# In-Flight Nodes (`status: proposed`)

New DDD nodes drafted during Phase 2 land directly in canonical
`docs/<component>/nodes/<type>/<ID>-<slug>.md` with `status: proposed` in
frontmatter. The 2-file node touch fires at that ingest — node file +
`proposed` row in the per-type `index.md`. Phase 3 merge flips
`proposed → active` by editing the node's frontmatter and re-syncing the
per-type `index.md` Status column. DDD node lifecycle:
`proposed → active → superseded | deprecated`. (Canonical lifecycle events
do not fire a `log.md` entry — see
[`maintenance-discipline.md → Rule history`](maintenance-discipline.md#rule-history--canonical-logmd-retired-2026-05-16).)

## CHG mechanics

**Existing canonical nodes are not modified at Phase 2.** When an FS's
FRS declares `touches_nodes`, the FS emits a CHG-NNN node (milestone-
scoped, permanent at
`milestones/M-NN-<slug>/specs/FS-NNN-<slug>/nodes/changes/CHG-NNN-<slug>.md`)
that documents the intended delta in its `modifies[]` / `removes[]` /
`supersedes[]` fields. The delta is *applied* at Phase 3 — never at
Phase 2 — so canonical nodes never carry partially-applied changes
while an FS is in flight. Phase 3 applies `updated` / `superseded` /
`status-change` deltas to the canonical targets (each fires its 2-file
node touch — node file + per-type `index.md` re-sync) and flips the
CHG's status `approved → merged` in place.

## Cross-FS dependencies

An FS may read a `proposed` sibling-FS node
via `depends_on_specs:`. An FS may **not** include a `proposed`
sibling-FS node in its `touches_nodes` / CHG `modifies[]` — proposed
nodes are provisional, not modify targets. Phase 3 enforces merge
order: every spec in `depends_on_specs:` must have `merged: true`
before this FS's Phase 3 begins.

## Abandonment

If an FS is abandoned before reaching Phase 3, each
of its new canonical nodes flips `proposed → deprecated` (never
deleted; the append-only log keeps the history); the index row moves
to the Superseded/deprecated section. IDs are not reused.
Bidirectional `related:` back-links to a deprecated proposed node
remain (existing deprecated-node pattern).

## Workflow self-extension during Phase 2

Planning sometimes surfaces
the need to extend the workflow itself — a new node type the current
13 don't model, a new derived-report type the existing BUSINESS /
TECHNICAL templates don't carry, or a doc template that needs
refinement before the in-flight FS can use it. When it does, the
extension lands in the methodology **before** the new artifact, not
after — same discipline as [Brownfield muscle](../WORKFLOW.md#brownfield-muscle)
surfacing-not-absorbing. See [`evolving-the-workflow.md`](evolving-the-workflow.md).

---

## Integration

**Canonical home of:** the `status: proposed` lifecycle rules, CHG-NNN
mechanics, cross-FS dependency enforcement, abandonment procedure, and
workflow self-extension during Phase 2.

**Parent:** [`../WORKFLOW.md → In-flight nodes`](../WORKFLOW.md#in-flight-nodes-status-proposed) —
WORKFLOW.md carries the always-loaded summary; this file is the full procedure.

**Related:** [`../KB-LAYOUT.md`](../KB-LAYOUT.md) — where in the folder
tree proposed nodes land; [`maintenance-discipline.md`](maintenance-discipline.md) —
the 2-file touch (node, ADR, CCC uniformly) that fires at `created` and
`status-change` events.
