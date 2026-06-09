---
applies_when:
  stack: [agnostic]
---

# Grandfather Registry

> **Type:** Workflow reference (rule book). Pointer-style: each row
> names the clause and links the canonical statement — rule text is
> NOT restated here (reference, never copy). On conflict, the
> canonical home wins; fix this table.

## When to Use

**Use when:** processing a mixed-vintage artifact (FRS / FS / CHG /
FLW / node / `id-claims.md` row) and you need to know which cutover
governs it — i.e., whether a current rule applies or a grandfather
clause exempts it. Also load when adding a new grandfather clause
(append a row here in the same change — 2-file touch: clause's
canonical home + this registry).

**Do NOT use when:** looking for the doctrinal history of a rule
change ([`rule-history.md`](rule-history.md) — append-only narrative,
covers a subset of these) or standards lifecycle events
([`../standards/log.md`](../standards/log.md)).

---

## Active clauses

Rows ordered by cutover date; `#` is positional, not a citable ID —
cite a clause by its canonical statement, never by row number.

| # | Cutover | Rule that changed | Who is grandfathered | Canonical statement | Retirement trigger |
|---|---------|-------------------|----------------------|---------------------|--------------------|
| 1 | 2026-05-14 | ENDPOINT (EP) template superseded by CONTRACT (CON) | Pre-rename `EP-` prefixed nodes keep their prefix | [`../LAYOUT.md`](../LAYOUT.md) (supersession note) | None — permanent |
| 2 | 2026-05-16 | Canonical per-type `log.md` retired (research + standards logs survive) | Pre-existing log entries preserved in git history | [`rule-history.md`](rule-history.md); CLAUDE.md Rule 8 | None — permanent |
| 3 | 2026-05-17 | CHG home moved to milestone `chg/` | Pre-cutover CHGs stay at `specs/FS-NNN-<slug>/nodes/changes/` | [`in-flight-nodes.md`](in-flight-nodes.md); path note in [`../LAYOUT.md`](../LAYOUT.md) | None stated — pre-cutover CHGs stay in place |
| 4 | 2026-05-17 | FS frontmatter `consumes_chgs:` replaces `changes:` | Pre-cutover FSs keep `changes:` | [`../_templates/FS.md`](../_templates/FS.md); branch handling in [`implementation.md`](implementation.md) | None stated |
| 5 | 2026-05-17 | FLW body-shape discriminator (R-NEW-8) | FLWs born pre-cutover carry `created_under: pre-2026-05-17` (currently FLW-003) | [`../_templates/nodes/FLOW.md`](../_templates/nodes/FLOW.md); [`design.md`](design.md) | Marker retires when the last marked FLW reaches `status: active` |
| 6 | 2026-05-17 | `id-claims.md` no longer takes `op: introduce` rows (R-NEW-9 amended) | Pre-cutover `op: introduce` rows are kept, not stripped | CLAUDE.md Rule 6; [`plan.md`](plan.md) | None — rows frozen in place |
| 7 | 2026-05-19 | NDF fifth governance kind — instances of NDF-declared custom types carry `declared_via:` and validate at the Phase 2 type-validity gate | Canonical nodes predating NDF introduction — no `declared_via:` pointer, exempt from NDF binding | [`STD-007`](../standards/STD-007-ndf-governance.md) R8 | None — permanent |
| 8 | 2026-05-22 | `framework:` frontmatter mandatory on FRS / FS (HARD-GATE) | Pre-2026-05-22 FRSs / FSs | CLAUDE.md `## Hard rules`; Blocker handling in [`frs-validation-rules.md`](frs-validation-rules.md) | Next substantive edit to the artifact backfills `stack:` + `framework:` |
| 9 | 2026-05-28 | STD-005 R9.2 / R11 / R15 page-driven AppService naming + permission-string format | CON-012..CON-017 and pre-cutover CMD / QRY nodes with old-format permission strings | [`../standards/log.md`](../standards/log.md) `[2026-05-28]` entry | Next substantive edit to the affected node backfills |
| 10 | 2026-06-05 | Prototype home repointed `docs/exploration/` → `docs/prototypes/` (PROTO-`<slug>` disposition) | Pre-cutover prototypes under `docs/exploration/` with `tag: prototype` (retired in place) | [`prototype-first.md`](prototype-first.md) | None stated — retired entries stay for audit |

## Maintenance

Adding a grandfather clause anywhere in the engine without appending a
row here is the same defect class as a canonical edit without the
index re-sync ([`maintenance-discipline.md`](maintenance-discipline.md)).
Retiring a clause: flip its row to a one-line tombstone (date +
trigger met), don't delete.

## Integration

- **Parent:** [`index.md`](index.md) (rule books section).
- **Siblings:** [`rule-history.md`](rule-history.md) — doctrinal
  why-narrative for a subset of these cutovers;
  [`../standards/log.md`](../standards/log.md) — standards-scoped
  lifecycle log (closest prior aggregator, 5 of 9 clauses).
