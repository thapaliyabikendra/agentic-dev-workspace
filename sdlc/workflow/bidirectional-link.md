---
name: bidirectional-link
description: "Bidirectional-link enforcement — when a node's related: lists targets, the targets MUST carry the reciprocal back-link in the same atomic operation. The 2-file touch becomes (2 + N)."
applies_when:
  stack: [agnostic]
---

# Bidirectional-link enforcement

`related:` declarations are bidirectional contracts. When a node's
`related:` lists targets `[X, Y, Z]`, the targets MUST carry the reciprocal
back-link in **the same atomic operation**. The 2-file touch on A
becomes `(2 + N)` where N is the number of `related:` targets — each
target fires its own 2-file touch.

**Worked example — creating a new ENT with three `related:` targets.**

Suppose you author `docs/app/nodes/entities/ENT-007-invoice.md` at
Phase 2 ingest with `related: [CMD-012, QRY-005, EVT-003]`. The base
touch on ENT-007 is **2-file**. The `(base + N)` expansion adds **N = 3**
target touches, each of which is *itself* a 2-file node touch. Total
files touched in this atomic operation:

1. `docs/app/nodes/entities/ENT-007-invoice.md` — new file (ENT-007 body).
2. `docs/app/nodes/entities/index.md` — new `proposed` row for ENT-007.
3. `docs/app/nodes/commands/CMD-012-<slug>.md` — add `ENT-007` to its `related:`.
4. `docs/app/nodes/commands/index.md` — re-sync the CMD-012 row's `related` column.
5. `docs/app/nodes/queries/QRY-005-<slug>.md` — add `ENT-007` to its `related:`.
6. `docs/app/nodes/queries/index.md` — re-sync the QRY-005 row's `related` column.
7. `docs/app/nodes/events/EVT-003-<slug>.md` — add `ENT-007` to its `related:`.
8. `docs/app/nodes/events/index.md` — re-sync the EVT-003 row's `related` column.

**8 files** for one node create with three reciprocal links. Skipping
any of these is a half-fired touch — the canonical store is silently
inconsistent until the next operation catches up.

**Atomicity scope (2026-06-10).** "Same atomic operation" means one
uninterrupted edit sequence — every file in the unit is written before
any other operation (a different node's ingest, a commit, a phase step)
begins. It is **not** a commit-granularity rule: one commit may carry
many units, and a unit may sit uncommitted (CLAUDE.md Rule 11 governs
commits separately). The unit is **per node create/edit**: one node's
`(2 + N)` file set — the worked example's 8 files — is one unit. A bulk
Phase 2 ingest of M nodes is M sequential units, each closed before the
next opens — never one M-node mega-unit, which would leave an unbounded
half-linked surface if interrupted mid-ingest. The step-4 post-op grep
gate fires once **per unit**, at unit close — M times across a bulk
ingest, not once at the end.

**Concrete steps when `related:` changes on node A:**

1. For each ID added to A's `related:`: open the target node file, add A
   to its `related:` if absent. If the target is a legacy-schema node
   without a `related:` field, add the field.
2. For each ID removed from A's `related:`: open the target node, remove A
   from its `related:`.
3. Each touched target fires its own 2-file touch (target file + target's
   per-type `index.md` — for a node, the type folder; for an ADR,
   `adrs/index.md`; for a CCC, `ccc/index.md`).
4. **Post-op gate**: grep the target files for the back-reference; if
   missing, the operation is incomplete.

**Inline DECs and `related:` — exception**: an inline DEC's effective
`related:` is implicit (the host node, plus any node IDs cited in the
inline block's body). Cited node IDs do not require reciprocal back-links;
the host node carries the citation as natural prose. If reciprocal linking
becomes desirable, promote inline → standalone (see
[`dec-promotion.md`](dec-promotion.md)).

**Why this rule exists**: silent half-linkage produced the legacy slug
residue and missing ENT-side back-links surfaced in the 2026-05-13 DEC
audit. See [`PRINCIPLES.md`](../PRINCIPLES.md) — *If it can drift, the
operation isn't atomic enough.*

**Wiki-link body citations are out of scope (2026-06-10).** A `[[ID]]` /
`[[ID|label]]` token in docs/ body prose (convention:
[`KB-LAYOUT.md § Wiki-link syntax`](../KB-LAYOUT.md#wiki-link-syntax-docs-only))
is a display-only citation — it does NOT add the target to `related:` and
does NOT trigger this file's `(2 + N)` reciprocal touch. Only frontmatter
`related:` entries do. A wiki link may *satisfy* the "every `related:` ID
appears as a navigable body link" rule, but the causality runs one way:
`related:` demands a body link; a body link demands nothing.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Caller:** [`node-edit.md`](node-edit.md) — the base 2-file touch escalates here.
**Related:** [`dec-promotion.md`](dec-promotion.md),
[`lint.md`](lint.md) (orphan-node / index-entry-missing checks).
