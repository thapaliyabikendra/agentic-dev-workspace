---
name: ccc-edit
description: "Files to touch on a CCC edit — 2-file touch (CCC file + ccc/index.md). Same shape as ADR. CCCs are always under docs/shared/ccc/ — no component-scoped CCC path."
applies_when:
  stack: [agnostic]
---

# Files to touch on a CCC edit

1. **The CCC file itself** — `docs/shared/ccc/CCC-NNN-<slug>.md`.
2. **The CCC index** — `docs/shared/ccc/index.md`. Add the row (schema:
   `| ID | Status | Title | Stack | Tags | Source | Updated |`) or update
   the existing row; move to the Superseded/deprecated section on terminal
   transitions. CCCs are always under `docs/shared/ccc/` — there is no
   component-scoped CCC path.

Lifecycle events on CCCs follow the same audit pattern as ADRs — index row
Status column + git history. There is no `ccc/log.md` (see
[`rule-history.md`](rule-history.md)).

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Caller:** [`baseline-references.md`](baseline-references.md) — CCC lifecycle
operations fire this 2-file touch.
**Related:** [`adr-edit.md`](adr-edit.md) (same shape),
[`rule-history.md`](rule-history.md) (canonical `log.md` retirement; CCC
promotion to first-class artifacts 2026-05-16).
