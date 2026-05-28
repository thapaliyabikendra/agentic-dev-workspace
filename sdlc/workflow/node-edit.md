---
name: node-edit
description: "Files to touch on a canonical node edit — 2-file touch (artifact + per-type index.md), escalating to (base + N) when related: declarations change. The first rule references the Phase 1.5 round-trip carve-out."
applies_when:
  stack: [agnostic]
---

# Files to touch on a canonical node edit

**First rule — Phase 1.5 carve-out cross-reference.** A Phase 1.5 round-trip
body edit on a Phase-1-born FLW (or CHG) under tight scope restrictions is the
framework's only exception to the 2-file touch rule below. Read
[`phase-15-roundtrip.md`](phase-15-roundtrip.md) before applying the 2-file
touch to any Phase-1-born artifact in a Phase 1.5 round-trip context.

Every canonical node edit — content change, frontmatter update, status flip,
supersession, or initial creation — fires the **2-file node touch**. When the
edit involves `related:` declarations, it becomes a **(2 + N) touch** — see
[`bidirectional-link.md`](bidirectional-link.md). A separate optional touch
on [`../../docs/shared/tech-stack.md`](../../docs/shared/tech-stack.md) fires
at the same Phase 3 merge whenever stack versions, application layout,
operational commands, environments, runtime state, or milestone progress
moved — see [`tech-stack-touch.md`](tech-stack-touch.md). The tech-stack
touch is **not** triggered by individual node lifecycle events; it tracks
project-level operational state, not behavioral content.

1. **The node file itself** — `docs/<component>/nodes/<type>/<ID>-<slug>.md`
   (e.g., `docs/<component>/nodes/flows/<ID>-<slug>.md` or
   `docs/<component>/nodes/contracts/<PREFIX>-CON-NNN-<slug>.md` — see
   `docs/project.md § Components` for component slugs and prefixes).
2. **The per-type index** — `docs/<component>/nodes/<type>/index.md`. Add or update one
   row (ID, one-line summary, tags, source, status). Status flips
   (`proposed → active`, `active → superseded`, `active → deprecated`) are
   recorded by re-syncing the row's Status column and, for terminal
   transitions, moving the row to the Superseded/deprecated section.
   Create the file from [`_templates/INDEX.md`](../_templates/INDEX.md) if
   this is the first node of the type (see [`lazy-creation.md`](lazy-creation.md)).
3. **Each `related:` target** — for every node ID declared in the page's
   `related:` frontmatter, update the target node's `related:` to carry the
   reciprocal back-link. See [`bidirectional-link.md`](bidirectional-link.md).

Node lifecycle events (`created`, `status-change`, `superseded`,
`deprecated`, `linked`, `renamed`) are captured by the index row's Status
column and git history — there is no companion `log.md`. See
[`rule-history.md`](rule-history.md) for the consolidation date and
rationale.

**Event-driven touches** (the touch fires at each edit, not at a fixed phase
boundary):

- **Phase 1 ingest of a Phase-1-born FLW** (per R-NEW-1) — new row in
  `nodes/flows/index.md` with Status = `proposed`. Node written directly to
  `docs/<component>/nodes/flows/FLW-NNN-<slug>.md` with `status: proposed`
  and a Phase-1-bare body shape (per R-NEW-2 — see
  [`in-flight-nodes.md → FLW lifecycle`](in-flight-nodes.md)). 2-file
  touch fires immediately. ACT is no longer Phase-1-born (R-NEW-2a retired
  2026-05-17 — ACT births at Phase 2).
- **Phase 1 birth of a Phase-1-born CHG** (per R-CHG-1) — when the FRS's
  `touches_nodes:` is non-empty, the CHG file is written with `status:
  draft` at the milestone path; the touch is **1-file** because CHG has no
  per-type `index.md` today (see [CHG index.md gap](phase-15-roundtrip.md#chg-indexmd-gap)).
  CHG mechanics: [`in-flight-nodes.md → CHG mechanics`](in-flight-nodes.md#chg-mechanics).
  Touches do not compound across artifact types — independent from any FLW
  birth in the same session.
- **Phase 1.5 round-trip body edit** on a Phase-1-born FLW or CHG — see
  [`phase-15-roundtrip.md`](phase-15-roundtrip.md). The framework's
  first and only carve-out to the universal 2-file rule.
- **Phase 2 enrichment of a Phase-1-born FLW** — same file edited in place,
  body content added (Sequence / Branches / Compensating / Postconditions /
  Decisions), `related:` populated, `status:` unchanged (`proposed`). 2-file
  touch fires; the index row's Status column stays `proposed`. Plus the
  `(2 + N)` expansion fires because `related:` just transitioned `[] → [...]`.
- **Phase 2 birth of an ACT** (per `produced_actor:`, R-NEW-2a retired
  2026-05-17) — new row in `nodes/actors/index.md` with Status = `proposed`.
  ACT file written at `docs/<component>/nodes/actors/ACT-NNN-<slug>.md` with
  all sections filled at birth; `related:` populated at birth. 2-file touch
  fires immediately.
- **Phase 2 ingest of a new Phase-2-born node** (ENT / CMD / STA / CON /
  INT / DEC / PERM / QRY) — new row in the per-type `index.md` with Status
  = `proposed`. 2-file touch fires immediately. ADR `created` events fire
  the same 2-file touch on the ADR store
  (see [`adr-edit.md`](adr-edit.md)).
- **Phase 3 merge of an FS** — for each new node listed in the FS's
  `new_nodes:`, the canonical node's frontmatter flips `proposed → active`
  and the index row's Status column re-syncs. For each CHG `modifies[]`
  entry, the delta is applied to the canonical target and the index row
  re-syncs if summary/tags/status/source changed. For each CHG `removes[]`
  / `supersedes[]` entry, the canonical target's Status column flips
  (`superseded` or `deprecated`) and the index row moves to the
  Superseded/deprecated section.
- **Brownfield absorption** — absorbed nodes go straight to `status:
  active`; the `proposed` stage applies only to FS-generated nodes. See
  [`legacy-absorption.md`](legacy-absorption.md).
- **FS abandonment** — each `proposed` new node in the abandoned FS flips
  to `deprecated`; the index row moves to Superseded/deprecated. Files are
  never deleted; IDs are not reused.

CHG nodes are milestone-scoped (not canonical) and fire a **1-file touch**
on the CHG file (no per-type `index.md` today). Full mechanics:
[`in-flight-nodes.md → CHG mechanics`](in-flight-nodes.md#chg-mechanics).

The master catalog [`docs/home.md`](../../docs/home.md) is **derived**, not
hand-maintained per event. Its node-type and ADR tables regenerate on
demand from the per-type indexes — same treatment as the derived reports at
`docs/reports/` (see [`derived-reports.md`](derived-reports.md)). The Planning
Artifacts section in `home.md` (milestones, FRSs, feature specs, discovery)
stays hand-maintained until per-type indexes exist for those artifacts.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Related ops:** [`bidirectional-link.md`](bidirectional-link.md),
[`phase-15-roundtrip.md`](phase-15-roundtrip.md),
[`node-versioning.md`](node-versioning.md),
[`tech-stack-touch.md`](tech-stack-touch.md),
[`lazy-creation.md`](lazy-creation.md),
[`rule-history.md`](rule-history.md).
