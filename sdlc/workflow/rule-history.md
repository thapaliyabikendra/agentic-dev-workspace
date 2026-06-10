---
name: rule-history
description: "Doctrinal rule changes that shaped the current canonical-edit discipline — CCC promoted to first-class artifacts (2026-05-16), Phase 1 birth list trimmed (2026-05-17), canonical log.md retired (2026-05-16), NDF spec promoted to engine STD-007 (2026-06-10), Phase-2 close gate ordered + atomicity/AST clarifications (2026-06-10)."
applies_when:
  stack: [agnostic]
---

# Rule history

Append-only record of doctrinal rule changes shaping the canonical-edit
discipline. Surface for readers who encounter unfamiliar references in
older artifacts or who need to trace why the current rule is what it is.

> Covers the why-narrative for a subset of cutovers. The complete
> active-clause table (who is grandfathered, by which cutover, with
> what retirement trigger) is
> [`grandfather-registry.md`](grandfather-registry.md).

## CCC promoted to first-class artifacts (2026-05-16)

CCCs promoted from a single baseline file (`docs/shared/cross-cutting-concerns.md`,
now retired) to first-class CCC-NNN artifacts under `docs/shared/ccc/`. The
tiered-touch rule now covers CCCs with the same 2-file shape as nodes and
ADRs (CCC + `ccc/index.md`). The exclusion of `cross-cutting-concerns.md`
from the When to Use gate was removed and replaced with a note that individual
CCC-NNN artifacts are first-class and in scope. See [`ccc-edit.md`](ccc-edit.md).

## Phase 1 birth list trimmed (2026-05-17)

ACT was relocated from Phase 1 birth to Phase 2 birth (alongside ENT /
CMD / STA / CON / INT / DEC / PERM / QRY). Two rule changes landed:

- **R-NEW-2a retired.** The Phase-1-bare ACT body shape (Description +
  Goals + business Preconditions + Flows initiated; `related: []`) no
  longer exists because there is no Phase-1 ACT body. The FRS's
  `produced_actor:` scalar now carries a forward-reference ACT-NNN — the
  ID is claimed at Phase 1 via the FRS's `produced_actor:` frontmatter
  itself (R-NEW-9 amended 2026-05-17 — the FRS field IS the claim; no
  `id-claims.md` introduce row), but the ACT file is authored at Phase
  2 with all sections filled at birth.
- **R-NEW-7 narrowed to FLW only.** The 1-file body-edit carve-out for
  Phase 1.5 round-trip applies to Phase-1-born nodes; with ACT moved to
  Phase 2 birth, the carve-out's scope is FLW alone (plus the parallel
  CHG body-edit extension under R-CHG-1..7). See
  [`phase-15-roundtrip.md`](phase-15-roundtrip.md).
- **R-NEW-8 narrowed to FLW only.** The `related: []` Phase-1-bare body-
  shape discriminator now applies to FLW only. ACT births at Phase 2
  with `related:` populated; an ACT with `related: []` would be a
  malformed Phase-2 birth, not a Phase-1-bare body.

**Duplicate-actor detection at Phase 1.5 is explicitly dropped** —
accepted trade-off. Two failure modes that the prior canonical-ACT-index
scan caught now both route to Phase 2 FS authoring:
- **Cross-FRS duplicate-actor:** two sibling FRSs in the same milestone
  independently introduce the same actor role.
- **FRS-vs-canonical duplicate-actor:** a new FRS introduces an actor
  role whose title duplicates an existing canonical ACT.

Both surface at Phase 2 when the FS attempts to author the ACT file and
either the chosen slug collides with an existing canonical ACT file (FS
validation flags it) or the author notices the duplicate role-name
during ACT authoring and resolves by reusing the canonical ACT-NNN
(retroactive `produced_actor:` clear-out on the originating FRS via
`R-NEW-10` loop-back).

**Survey inlining for simple FRSs.** Parallel change on the same date:
FRS frontmatter `discovery:` accepts `inline` as an enum value (Path C
in `design.md § Phase 1`). When `discovery: inline`, the per-FRS Survey
content is absorbed into the FRS's "Brownfield impact" section; no
separate file at `discovery/FRS-NNN-<slug>.md` is created. Use for
narrow FRSs (pure-addition or single-node change-request) where a
separate survey file would be less than one screen.

## Canonical `log.md` retired (2026-05-16)

The earlier rule split canonical edits into a routine 2-file touch and a
lifecycle 3-file touch — the third file being a per-type `log.md` (node-type
log, `adrs/log.md`, `ccc/log.md`). On 2026-05-16 the lifecycle log was
retired for all canonical artifacts: nodes, ADRs, and CCCs now use the
2-file touch uniformly. The surviving append-only logs are
`docs/research/log.md` (discovery surface) and `sdlc/standards/log.md`
(engine standards).

**Rationale:**

- One-human-all-roles. The audit-for-others case is weak;
  audit-for-future-self is covered by git history + the per-type `index.md`
  Status column.
- The per-type canonical `index.md` row + node frontmatter `source_ref:`
  + git history together cover `created` events from the planning side
  (R-NEW-9 amended 2026-05-17 — `id-claims.md` no longer mirrors them).
- ADR / CCC supersession chains are visible in `superseded_by:` /
  `supersedes:` frontmatter and the Active vs Superseded/deprecated
  sections of the index. The chronological view a `log.md` added is
  available via `git log --oneline -- docs/<component>/adrs/`.
- Zero `adrs/log.md` / `ccc/log.md` files were populated at the time of
  decision; no migration cost.
- Lifecycle vocabulary (`created`, `status-change`, `superseded`,
  `deprecated`, `linked`, `renamed`) survives in descriptive prose, in
  `status:` field values, and in the surviving research / standards log
  entries. See [`operation-vocabulary.md`](operation-vocabulary.md).

If even the surviving 2-file touch proves too heavy, the next fallback
would be to drop the per-type `index.md` re-sync on routine content edits
(retaining it only for status flips and `related:` changes) — make that
call explicitly; don't let it erode by drift.

## NDF spec promoted from project ADR to engine STD-007 (2026-06-10)

When NDF became the fifth governance kind (2026-05-19), its
specification landed in the originating project's
`docs/shared/adrs/ADR-039-ndf-fifth-governance-kind.md`, and ~24 engine
sites across 13 files cited that project artifact as binding authority.
REVIEW-SDLC Rec-01 flagged the engine-purity violation: a fresh
deployment carries no `docs/`, so the NDF spec resolved nowhere.

On 2026-06-10 the normative content was harvested into
[`../standards/STD-007-ndf-governance.md`](../standards/STD-007-ndf-governance.md)
(`source: harvested-from-ADR-039`) and every engine cite re-pointed in
the same operation. The originating project's ADR-039 is demoted to an
**adoption record** — the pattern STD-007 § Project-specific deviations
now names for any project. The former "ADR-039 § Brownfield impact"
grandfathering lives at STD-007 R8 with a
[`grandfather-registry.md`](grandfather-registry.md) row (cutover
2026-05-19). Gate canonical homes are unchanged:
[`evolving-the-workflow.md`](evolving-the-workflow.md) (shape-coverage),
[`plan.md`](plan.md) (type-validity). Historical ADR-039 mentions in
append-only logs are intentionally intact. Full landing record:
[`../standards/log.md`](../standards/log.md) `[2026-06-10]`.

## Phase-2 close gate ordered + atomicity/AST clarifications (2026-06-10)

REVIEW-SDLC Rec-03/05/06/07 batch — four clarifications, **no rule
content changed**:

- **`plan.md` §6 (Rec-03).** The Phase-2 close gate's Blocker
  checkboxes (formerly one flat, unordered list interleaving writes
  with audits) are regrouped: §6a entry gate (canonical-state
  reconnaissance) → §6b writes (confirm each §5 write landed) → §6c
  verifications (read-only audits, run only after every §6b box).
  Four hard dependencies named: recon precedes §5 modify-intent
  sections; new nodes precede CHG `adds[]` + type-validity;
  `consumes_chgs:` → CHG structural deltas → `op: modify` id-claims
  rows; ADR filed before `adrs:` declares it. Every box's text is
  verbatim-preserved; only grouping and order changed.
- **`bidirectional-link.md` (Rec-06).** "Same atomic operation" scope
  defined: one uninterrupted edit sequence per node create/edit (the
  `(2+N)` set is one unit), not a commit-granularity rule; a bulk
  Phase 2 ingest of M nodes is M sequential units; the post-op grep
  gate fires per unit.
- **STD-001 graduation trigger made binding (Rec-05)** and **STD-002
  R5.6 / STD-005 R16 merge-gate scans tagged manual-review-or-AST
  (Rec-07)** — standards-side record:
  [`../standards/log.md`](../standards/log.md) `[2026-06-10] updated`.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Anchors referenced from other files:**
`maintenance-discipline.md#rule-history--canonical-logmd-retired-2026-05-16` —
preserved by [`maintenance-discipline.md`](maintenance-discipline.md) stub.
**Related:** [`operation-vocabulary.md`](operation-vocabulary.md) (the
surviving logs use the closed-set vocabulary),
[`node-edit.md`](node-edit.md) (the 2-file touch rule current shape).
