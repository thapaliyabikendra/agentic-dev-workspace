---
name: plan-common-mistakes
description: "Detail file of plan.md — Common Mistakes (full ❌/✅ pairs). Load for a mid-Phase-2 quality check or reviewer audit."
applies_when:
  stack: [agnostic]
---

# Common Mistakes — Phase 2

> Detail file of [`plan.md`](../plan.md) (Phase 2 flow). Load for a
> mid-Phase-2 quality check; the core file's Red Flags list is the compact form.

**❌ Writing a method body or SQL statement in the FS** — Phase 2 names; Phase 3 writes.
**✅ Name the structure** (e.g. `OrderManager.Cancel(reason)` + `Cancelled` event) and
leave the `{ ... }` body for Phase 3.

**❌ Globbing `docs/*/nodes/**` during context loading** — floods the session and violates
the token discipline that makes the workflow sustainable.
**✅ Narrow-load only** the node IDs declared in the FRSs' `touches_nodes` and
`produces_nodes`, plus exactly one `related` hop (per R-LOAD-1).

**❌ Editing an existing canonical node body during Phase 2** — canonical nodes are the
source of truth; mid-phase edits create un-audited drift.
**✅ Emit a CHG node** documenting the intended delta; Phase 3 applies it.

**❌ Silently resolving an ID collision** — two FSs claiming the same ID creates invisible
Phase 3 merge conflicts.
**✅ Surface the collision** immediately, stop allocation, and reconcile before proceeding.

**❌ Listing a CHG in `consumes_chgs:` for a pure-addition FS** — there is no CHG to consume
when no canonical node is being modified (post-cutover CHGs are born at Phase 1 only when
the FRS declares non-empty `touches_nodes:`).
**✅ Only populate `consumes_chgs:` when at least one constituent FRS declared
non-empty `touches_nodes:`** — pure additions are audited by `source_ref`, the
per-type `index.md` row, and git history (R-NEW-9 amended 2026-05-17 — no
`id-claims.md` introduce row).
