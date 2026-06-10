---
name: ndf-edit
description: "Files to touch on an NDF (Node Definition Node) edit — 2-file touch (NDF file + node-definitions/index.md). Includes the two HARD-GATEs that apply to NDF coining and Phase 2 ingest of NDF-declared instances."
applies_when:
  stack: [agnostic]
---

# Files to touch on an NDF edit

NDF (Node Definition Node) is the fifth governance kind per
[`STD-007`](../standards/STD-007-ndf-governance.md).
An NDF declares a per-component custom node-type contract; instances of
the declared type live under `docs/<component>/nodes/<folder>/` per the
NDF's `folder:` field. Touch shape:

1. **The NDF file itself** —
   `docs/<component>/node-definitions/{PREFIX}-NDF-NNN-<slug>.md`
   (per-component) or `docs/shared/node-definitions/NDF-NNN-<slug>.md`
   (cross-component, post-promotion).
2. **The NDF index** —
   `docs/<component>/node-definitions/index.md` (per-component) or
   `docs/shared/node-definitions/index.md` (shared). Add the row, or update
   on lifecycle events; move to Superseded/deprecated on terminal
   transitions. Re-sync the row's Status column on any lifecycle event.

Lifecycle events follow the same audit pattern as ADRs / CCCs — index row
Status column + git history. There is no `node-definitions/log.md`. Two
HARD-GATEs apply to NDF coining and to Phase 2 ingest of NDF-declared
instances — canonical homes are `evolving-the-workflow.md` (shape-coverage)
and `plan.md` (type-validity); the restatements below carry the **identical
wording** (CLAUDE.md HR-STYLE defense-in-depth).

> **HARD-GATE — NDF shape-coverage walk required.** Do NOT coin a new Node
> Definition Node (NDF) until the 60% shape-coverage walk has been run
> against (a) the engine-default 16-type catalog in
> [`../KB-LAYOUT.md`](../KB-LAYOUT.md) and (b) every existing NDF in the
> target component's `node_definitions:` plus every NDF promoted to
> `docs/shared/node-definitions/`. If any existing type covers ≥60% of the
> new shape, **extend that type** (the existing type's template, or the
> existing NDF's contract) — do not coin. Record the walk in the NDF's
> `shape_coverage_walk:` frontmatter and the prose narrative in
> `## Shape-coverage walk`. (NDF spec:
> [`STD-007`](../standards/STD-007-ndf-governance.md);
> engine-evolution 60% gate:
> [`evolving-the-workflow.md`](evolving-the-workflow.md).)

> **HARD-GATE — Phase 2 type-validity check.** Do NOT ingest a
> Phase-2-born canonical node whose type abbreviation is in **neither** (a)
> the 15 Phase-2-born canonical types in KB-LAYOUT.md's 16-type catalog
> (ACT / ENT / CMD / QRY / FLW / STA / DEC / INT / MOD / SCR / CON / PERM /
> SVC / FA / EVT — CHG is Phase-1-born and milestone-scoped, per
> [`../KB-LAYOUT.md`](../KB-LAYOUT.md)) **nor** (b) the target component's
> `node_definitions:` frontmatter on its `COMPONENT.md` (NDF-declared per
> [`STD-007`](../standards/STD-007-ndf-governance.md)).
> A node whose type-abbreviation is unknown to both surfaces is rejected at
> Phase 2 FS validation as a **Blocker**. Pre-existing canonical nodes that
> predate NDF introduction (2026-05-19) carry no `declared_via:` pointer and
> are grandfathered (per STD-007 R8).

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Caller:** [`evolving-the-workflow.md`](evolving-the-workflow.md) (NDF
coining), [`plan.md`](plan.md) (Phase 2 type-validity check).
**Related:** [`new-component-bootstrap.md`](new-component-bootstrap.md)
(`node_definitions:` frontmatter on `COMPONENT.md`).
