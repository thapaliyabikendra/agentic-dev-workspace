---
applies_when:
  stack: [agnostic]
---

# Maintenance discipline

> Routing gate for canonical edits. Every op has its own file — find your
> op in the routing table, follow the link, read only that file. This file
> exists to preserve cross-reference anchors and to be the single entry-
> point for "which op fires here?"

> **HARD-GATE:** Do NOT consider an edit closed until **every required file
> has been touched in the same atomic operation** — the artifact, the
> per-type `index.md`, and every reciprocal `related:` target
> (`(base + N)` expansion). If any one is missing, the event is half-fired
> and the canonical store is silently inconsistent. (Cross-cutting rule:
> [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
> "Tiered touch for canonical edits".)

## When to Use

**Use when:** any canonical-node, ADR, or CCC file (`docs/<component>/nodes/<type>/`,
`docs/<component>/adrs/`, `docs/shared/adrs/`, `docs/shared/ccc/`) is about to change —
content edit, frontmatter edit, status flip, supersession, link addition, or initial
creation. Load before the edit; the touch fires as part of the edit, not after.

**Do NOT use when:** the artifact is a milestone-scoped CHG node, an
FRS, an FS, a TC, a discovery surface (OQ / EXP / RESEARCH), or one of
the project-owned baselines (`docs/shared/glossary.md`,
`docs/shared/tech-stack.md`). Those live under different cadences — see
[`baseline-references.md`](baseline-references.md) for glossary;
[`discovery-surface.md`](discovery-surface.md) for OQ / EXP / RESEARCH;
[`plan.md`](plan.md) for CHG and FS. CHG mechanics:
[`in-flight-nodes.md → CHG mechanics`](in-flight-nodes.md#chg-mechanics).
Individual CCC-NNN artifacts under `docs/shared/ccc/` are first-class and
**do** fall under this rule (see [`ccc-edit.md`](ccc-edit.md)).

**Vs. sibling files:** [`authoring-adr.md`](authoring-adr.md) /
[`legacy-absorption.md`](legacy-absorption.md) /
[`evolving-the-workflow.md`](evolving-the-workflow.md) /
[`new-component-bootstrap.md`](new-component-bootstrap.md) are the
**callers** that fire the touches as part of their own procedures; this
file (and the 16 op files it routes to) is the **rule book** they consult.

## Routing table — 16 ops

| # | Op | File | One-line summary |
|---|----|------|------------------|
| 1 | Canonical node edit (any) | [`node-edit.md`](node-edit.md) | 2-file touch (node + per-type `index.md`); opens with Phase 1.5 carve-out cross-reference |
| 2 | Node `related:` add / remove | [`bidirectional-link.md`](bidirectional-link.md) | (2 + N) escalation — every target fires its own 2-file touch |
| 3 | Node semantic content change | [`node-versioning.md`](node-versioning.md) | `version: N` bump rule (mechanical, not a judgment call) |
| 4 | Phase 1.5 round-trip body edit on Phase-1-born FLW or CHG | [`phase-15-roundtrip.md`](phase-15-roundtrip.md) | 1-file carve-out; tightly scoped, not generalizable |
| 5 | ADR edit (any) | [`adr-edit.md`](adr-edit.md) | 2-file touch (ADR + `adrs/index.md`) |
| 6 | CCC edit (any) | [`ccc-edit.md`](ccc-edit.md) | 2-file touch (CCC + `ccc/index.md`); CCCs always at `docs/shared/ccc/` |
| 7 | NDF edit (any) | [`ndf-edit.md`](ndf-edit.md) | 2-file touch + two NDF HARD-GATEs (shape-coverage, type-validity) |
| 8 | Promote inline DEC → standalone | [`dec-promotion.md`](dec-promotion.md) | Allocate ID, create DEC file, replace inline with link, fire bidirectional enforcement |
| 9 | Cross-type supersession (ADR ↔ DEC) | [`cross-type-supersession.md`](cross-type-supersession.md) | Each side fires its own 2-file touch; `supersedes:` / `superseded_by:` accept either prefix |
| 10 | Tech-stack version / command change | [`tech-stack-touch.md`](tech-stack-touch.md) | Phase 3 merge — update `docs/shared/tech-stack.md` if any of 7 questions is yes |
| 11 | Cross-reference (citation) at edit time | [`cross-ref-guard.md`](cross-ref-guard.md) | Citation atomicity rule + periodic dangling-reference audit at milestone close |
| 12 | Lifecycle vocabulary in prose / `status:` / surviving logs | [`operation-vocabulary.md`](operation-vocabulary.md) | Closed set of ops; log entry format; append-only discipline |
| 13 | Discovery-surface artifact edit (OQ / EXP / RESEARCH) | [`discovery-surface.md`](discovery-surface.md) | 1-file routine / 2-file terminal lifecycle; no bidirectional enforcement |
| 14 | First node of a new type (folder + index lazy-create) | [`lazy-creation.md`](lazy-creation.md) | `<type>/index.md` materialises on first node; no companion `log.md` |
| 15 | Doctrinal rule changes shaping the discipline | [`rule-history.md`](rule-history.md) | CCC promoted (2026-05-16); Phase 1 birth list trimmed (2026-05-17); canonical `log.md` retired (2026-05-16) |
| 16 | Anti-pattern + Process Flow diagram | [`anti-pattern-lightweight.md`](anti-pattern-lightweight.md) | "The Lightweight Shortcut"; the 2-file + (base+N) touch graph |

If your operation is not in the table, read the per-op file whose
description matches your edit. If still unsure, follow the closest match
and surface the ambiguity as an OQ (`origin: workflow-evolution`).

---

## Files to touch on a canonical node edit

> Every canonical node edit (content, frontmatter, status flip, supersession,
> initial creation) fires the **2-file node touch**. When `related:` changes,
> escalates to **(2 + N)** — see [`bidirectional-link.md`](bidirectional-link.md).
> Full procedure + event-driven touch list: [`node-edit.md`](node-edit.md).

## Phase 1.5 round-trip body-edit exception

> 1-file body-edit carve-out for Phase-1-born FLW or CHG during Phase 1.5
> round-trip when `status:` stays unchanged. The framework's only exception
> to the universal 2-file rule. Full procedure + scope restrictions:
> [`phase-15-roundtrip.md`](phase-15-roundtrip.md).

## Bidirectional-link enforcement

> `related:` is a bidirectional contract — every target fires its own 2-file
> touch in the same atomic operation. The 2-file touch becomes `(2 + N)`.
> Full procedure + worked example: [`bidirectional-link.md`](bidirectional-link.md).

## Tech-stack touch at merge

> At Phase 3 merge, ask 7 questions about stack versions / layout / commands
> / environments / migrations / milestone progress / release tags. If any
> answer is yes, update `docs/shared/tech-stack.md` in the same merge. Full
> procedure: [`tech-stack-touch.md`](tech-stack-touch.md).

## Promoting an inline DEC to standalone

> When an inline DEC trips a standalone-trigger, allocate the next DEC-NNN,
> create the file, fire the 2-file touch, replace inline with link, fire
> bidirectional enforcement. Same operation, same commit.
> Full procedure: [`dec-promotion.md`](dec-promotion.md).

## Files to touch on an ADR edit

> 2-file touch — ADR file + `docs/<component>/adrs/index.md`. Lifecycle
> events captured in the index row's Status column + git history.
> Full procedure: [`adr-edit.md`](adr-edit.md).

## Files to touch on a CCC edit

> 2-file touch — CCC file + `docs/shared/ccc/index.md`. CCCs are always
> under `docs/shared/ccc/` — no component-scoped CCC path.
> Full procedure: [`ccc-edit.md`](ccc-edit.md).

## Files to touch on an NDF edit

> 2-file touch — NDF file + `node-definitions/index.md` (per-component or
> shared). Two HARD-GATEs apply (NDF shape-coverage + Phase 2 type-validity).
> Full procedure: [`ndf-edit.md`](ndf-edit.md).

## Cross-reference guard at edit time

> Citation atomicity rule: any ID / tag citation either targets an existing
> artifact or is authored in the same atomic operation. Plus the periodic
> dangling-reference audit at milestone close.
> Full procedure: [`cross-ref-guard.md`](cross-ref-guard.md).

### Periodic dangling-reference audit

> One-shot scan (≤ 5 min) at milestone close — collect citation patterns,
> verify each ID file exists at its declared path, verify each tag is in
> the matching index. Fix or downgrade in the same edit that closes the
> milestone.
> Full procedure: [`cross-ref-guard.md#periodic-dangling-reference-audit`](cross-ref-guard.md#periodic-dangling-reference-audit).

## Operation vocabulary (closed set)

> Closed set: `created` / `updated` / `status-change` / `superseded` /
> `deprecated` / `linked` / `renamed` / `rule-history` / `plan-consolidated`.
> Plus reserved-but-not-fired `merged-into` and `derived-genesis`.
> Full list + usage: [`operation-vocabulary.md`](operation-vocabulary.md).

## Log entry format

> Single-line for atomic events; multi-line block for `plan-consolidated`.
> Format: `## [YYYY-MM-DD] <op> | <id> — <note>`. Scope: surviving logs
> only (`docs/research/log.md`, `sdlc/standards/log.md`).
> Full procedure: [`operation-vocabulary.md#log-entry-format`](operation-vocabulary.md#log-entry-format).

## Discovery surface discipline

> Lighter touch for working notes — 1-file routine, 2-file terminal lifecycle,
> no `log.md` (research excepted), no bidirectional `related:` enforcement.
> Full procedure: [`discovery-surface.md`](discovery-surface.md).

## Cross-type supersession (ADR ↔ DEC)

> When a DEC is promoted to an ADR (or rarely demoted), each side fires its
> own 2-file touch. `supersedes:` / `superseded_by:` accept either prefix.
> Precedent: ADR-029 supersedes DEC-009 (2026-05-13).
> Full procedure: [`cross-type-supersession.md`](cross-type-supersession.md).

## Node versioning — `version: N`

> Frontmatter integer tracking revision activity orthogonal to status —
> bumps on semantic content changes, not status flips or formatting.
> Pin-syntax for stability-sensitive cross-refs: `ENT-007@v3`.
> Full procedure: [`node-versioning.md`](node-versioning.md).

## Append-only, oldest first

> Never edit or reorder existing log entries except under the retroactive
> consolidation carve-out. New entries at the bottom. One `plan-consolidated`
> entry per plan execution touching multiple artifacts.
> Full procedure: [`operation-vocabulary.md#append-only-oldest-first`](operation-vocabulary.md#append-only-oldest-first).

## Lazy creation

> `docs/<component>/nodes/<type>/` folders and `<type>/index.md` materialize
> on first node. ADR / CCC / NDF indexes follow the same lazy rule. No
> companion `log.md` is ever created.
> Full procedure: [`lazy-creation.md`](lazy-creation.md).

## Rule history — CCC promoted to first-class artifacts (2026-05-16)

> CCCs promoted from a single baseline file to first-class CCC-NNN artifacts
> under `docs/shared/ccc/`. Tiered-touch covers CCCs with the same 2-file
> shape as nodes and ADRs.
> Full entry: [`rule-history.md#ccc-promoted-to-first-class-artifacts-2026-05-16`](rule-history.md#ccc-promoted-to-first-class-artifacts-2026-05-16).

## Rule history — Phase 1 birth list trimmed (2026-05-17)

> ACT relocated from Phase 1 birth to Phase 2 birth. R-NEW-2a retired;
> R-NEW-7 / R-NEW-8 narrowed to FLW only. Duplicate-actor detection at
> Phase 1.5 explicitly dropped.
> Full entry: [`rule-history.md#phase-1-birth-list-trimmed-2026-05-17`](rule-history.md#phase-1-birth-list-trimmed-2026-05-17).

## Rule history — canonical `log.md` retired (2026-05-16)

> The lifecycle 3-file touch (third file was a per-type `log.md`) was retired
> for all canonical artifacts. Nodes / ADRs / CCCs now use the 2-file touch
> uniformly. Surviving logs: `docs/research/log.md`, `sdlc/standards/log.md`.
> Full entry: [`rule-history.md#canonical-logmd-retired-2026-05-16`](rule-history.md#canonical-logmd-retired-2026-05-16).

---

## Integration

**Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
— "Tiered touch for canonical edits" is the doctrinal anchor; the op files
below are its procedural detail.

**Required before:** [`../PRINCIPLES.md`](../PRINCIPLES.md) — "Silent node
or ADR edits" and "If it can drift, the operation isn't atomic enough" are
the named anti-patterns this rule book prevents. See also
[`anti-pattern-lightweight.md`](anti-pattern-lightweight.md).

**Required before:** [`../BOUNDARY.md ## Engine-vs-project axis`](../BOUNDARY.md#engine-vs-project-axis)
— canonical home for the four status vocabularies (node / ADR / FRS / OQ)
that the `status-change` op references.

**Callers (this file is wholesale-read by):**
[`plan.md`](plan.md), [`implementation.md`](implementation.md),
[`bug-fix.md`](bug-fix.md), [`legacy-absorption.md`](legacy-absorption.md),
[`authoring-adr.md`](authoring-adr.md),
[`new-component-bootstrap.md`](new-component-bootstrap.md). Each routes
through this gate to the specific op file for its edit.

**Sibling rule books:** [`legacy-absorption.md`](legacy-absorption.md),
[`authoring-adr.md`](authoring-adr.md),
[`evolving-the-workflow.md`](evolving-the-workflow.md),
[`new-component-bootstrap.md`](new-component-bootstrap.md),
[`baseline-references.md`](baseline-references.md).
