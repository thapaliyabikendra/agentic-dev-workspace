---
name: in-flight-nodes
description: "Lifecycle rules for nodes with status: proposed — CHG mechanics, cross-FS dependencies, abandonment procedure, and the workflow self-extension note. Load when authoring or merging an FS that introduces new nodes or modifies existing canonical nodes."
applies_when:
  stack: [agnostic]
---

# In-Flight Nodes (`status: proposed`)

New DDD nodes land in canonical `docs/<component>/nodes/<type>/<ID>-<slug>.md`
with `status: proposed` in frontmatter. The birth phase is **type-keyed**:

- **FLW** is born at **Phase 1** alongside the FRS that introduces it (per
  R-NEW-1 / R-NEW-2) — the FRS's `produced_flw:` scalar declares the ID.
  See [FLW lifecycle](#flw-lifecycle) below.
- **CHG** (milestone-scoped, not canonical) is born at **Phase 1** by the
  FRS when its `touches_nodes:` is non-empty (one CHG per FRS, parallel
  to `produced_flw:`) — per R-CHG-1. See [CHG mechanics](#chg-mechanics)
  below.
- **ACT** is born at **Phase 2** when the FS is authored, when the FRS
  declares `produced_actor:` (per R-NEW-2a retirement 2026-05-17). The
  ACT-NNN ID is claimed at Phase 1 via the FRS frontmatter
  `produced_actor:` field itself (R-NEW-9 amended 2026-05-17 — no
  `id-claims.md` introduce row written); the ACT file does not exist on
  disk until Phase 2. See [ACT-NNN ID claim lifecycle](#act-nnn-id-claim-lifecycle)
  below.
- **ENT, CMD, STA, CON, INT, DEC, PERM, QRY** are born at **Phase 2** when the
  FS is authored (per the FRS's `produces_nodes:` list).

The 2-file node touch fires at every ingest — node file + `proposed` row in
the per-type `index.md`. Phase 3 merge flips `proposed → active` for both
Phase-1-born and Phase-2-born nodes by editing the node's frontmatter and
re-syncing the per-type `index.md` Status column. DDD node lifecycle:
`proposed → active → superseded | deprecated`. (Canonical lifecycle events
do not fire a `log.md` entry — see
[`maintenance-discipline.md → Rule history`](maintenance-discipline.md#rule-history--canonical-logmd-retired-2026-05-16).)

## FLW lifecycle

A FLW is born at Phase 1 in canonical with `status: proposed` and a
**Phase-1-bare** body shape: Trigger (Actor: ACT-NNN — no `Initiating
command:` line) + three Scenarios (happy / edge / fault, Given/When/Then,
business language only — no ENT/CMD/STA IDs) + optional Brownfield notes.
`related: []` (empty). The 2-file touch fires: FLW file +
`nodes/flows/index.md`. Source-ref records the introducing FRS:
`source_ref: [{frs: FRS-NNN, op: introduce}]`. Per R-NEW-2.

Phase 2 (when the FS that consumes this FLW is authored) **enriches the same
file in place** — same file, body content added, `related:` populated,
`status:` unchanged. The Phase-2 sections (Sequence, Branches and gates,
Compensating actions, Postconditions, Decisions) are filled and the
Trigger's `Initiating command: CMD-NNN` line is restored. The 2-file touch
fires (FLW file + `nodes/flows/index.md`); the index row's Status column
stays `proposed`. Source-ref appends a `{frs: FRS-NNN, fs: FS-NNN, op: detail}`
entry recording the enrichment. Per R-NEW-2 / R-NEW-4.

Phase 3 merge flips `status: proposed → active` (uniform with Phase-2-born
nodes). Per R-NEW-4.

Status flip is Phase 3's job alone — Phase 2 enrichment does not flip it,
even though the body becomes fully wired (the `related: []` → `related: [...]`
transition is the body-shape signal per [Phase-1-bare vs. Phase-2-wired
discriminator](#phase-1-bare-vs-phase-2-wired-discriminator-flw-only) below).

## ACT-NNN ID claim lifecycle

R-NEW-2a retired 2026-05-17. ACT is born at **Phase 2** (alongside ENT /
CMD / STA / etc.), not Phase 1. At Phase 1, only the ACT-NNN ID is claimed
when the FRS sets `produced_actor:` — the claim lives **in the FRS
frontmatter itself** (R-NEW-9 amended 2026-05-17 — `id-claims.md`
introduce rows are no longer written; the `produced_actor:` field is the
authoritative claim). No ACT file is created at this stage.

**Phase 1.** `produced_actor: ACT-NNN` on the FRS frontmatter IS the
claim. No `id-claims.md` row. No ACT file. Phase 1.5 verifies the
`produced_actor:` value is unique against (a) sibling FRSs'
`produced_actor:` glob and (b) canonical `nodes/actors/index.md`, but
does not look up an ACT body (there is none).

**Phase 2.** The consuming FS authors the ACT file in full at
`docs/<component>/nodes/actors/ACT-NNN-<slug>.md` with `status: proposed`
— all template sections filled at birth: Description, Goals, Preconditions
to act (PERM-NNN refs allowed), Commands they trigger (CMD-NNN), Queries
they issue (QRY-NNN, optional), Flows they initiate (FLW-NNN IDs — real).
`related:` populated. 2-file touch (ACT file + `nodes/actors/index.md`).
`source_ref: [{frs: FRS-NNN, fs: FS-NNN, op: introduce}]`.

**Phase 3.** Merge flips `status: proposed → active`. Per R-NEW-4.

Cross-FRS duplicate-actor detection at Phase 1.5 is explicitly dropped
(accepted trade-off — surfaces at Phase 2 FS authoring as an ID collision
against canonical `nodes/actors/index.md` plus the cross-FRS
`produced_actor:` glob when both FRSs claim the same actor name;
R-NEW-9 amended 2026-05-17 — `id-claims.md` is no longer the collision
surface).

## Phase-1-bare vs. Phase-2-wired discriminator (FLW only)

A `status: proposed` FLW can be either Phase-1-bare (just born, awaiting
Phase 2 enrichment) or Phase-2-wired (enriched, awaiting Phase 3 merge).
The two are disambiguated by **body shape** per R-NEW-8 (narrowed to FLW
only 2026-05-17 — see [`maintenance-discipline.md → Rule history`](maintenance-discipline.md#rule-history--canonical-logmd-retired-2026-05-16)) —
no new frontmatter field:

| `related:` frontmatter | Phase state | Reader interpretation |
|---|---|---|
| `related: []` (empty) | Phase-1-bare | Body carries Trigger + Scenarios only. Awaiting Phase 2 enrichment. |
| `related: [...]` populated | Phase-2-wired | Body carries full template content. Awaiting Phase 3 merge. |
| `status: active` | merged | Phase 3 completed; no longer in-flight. |

ACT does NOT use this discriminator — Phase-2-born ACTs are authored with
`related:` populated at birth, so the empty-vs-populated signal carries no
phase information for ACTs (an ACT with `related: []` would simply be a
malformed Phase-2 birth, caught at FS validation).

**One-off exemption per B5:** nodes with frontmatter `created_under:
pre-2026-05-17` are exempt from the body-shape discriminator — they were
born straight to Phase-2-wired body shape under grandfather (FRS-003's
FLW-003 is the only known instance). Downstream readers
(test-plan-ingest.md, retrieval-discipline.md, frs-validation-rules.md)
check `created_under:` before applying the discriminator. The marker is
NOT a permanent template feature; Phase 1.5 Pass 1 sanity check flags any
FLW with `created_under:` set whose `created:` date is after the cutover
as a Major finding.

Downstream consumers (test-plan-ingest, retrieval discipline, lint) read
frontmatter and skip Phase-1-bare nodes when their op needs Phase-2-wired
anchors.

## Phase 1.5 round-trip handling (R-NEW-7)

A new doctrinal carve-out to the universal 2-file touch rule (canonical
home: [`maintenance-discipline.md → Phase 1.5 round-trip body-edit exception`](maintenance-discipline.md)).

**Trigger:** Phase 1.5 round-trip on a Phase-1-born FLW, where the revision
is body-only and `status:` stays `proposed`. (R-NEW-7 narrowed to FLW only
2026-05-17 — ACT is no longer Phase-1-born.)

**Action:** 1-file touch — edit the canonical node body only. The per-type
`index.md` is NOT re-synced (Status column unchanged; Title / Description
columns are frontmatter-sourced, also unchanged). The node's `updated:`
frontmatter timestamp DOES fire.

**Scope restrictions — not generalizable:**

- Only Phase-1-born FLW. Not Phase-2-born nodes (ACT / ENT / CMD / STA / …).
- Only during Phase 1.5 round-trip. Not during free-form edits.
- Only when `status:` does not change. Any status flip → 2-file touch as
  usual.
- Body edits that change frontmatter fields driving index columns → 2-file
  touch as usual.

Other status-change events keep the existing 2-file touch: Phase 3
activation `proposed → active`, full FRS abandonment `proposed → deprecated`
(see [Abandonment](#abandonment) below).

## CHG mechanics

**Existing canonical nodes are not modified at Phase 2.** Post-2026-05-17
cutover (R-CHG-1..7), CHGs are born at **Phase 1** by the FRS whose
`touches_nodes:` is non-empty — one CHG per FRS — and consumed +
enriched at **Phase 2** by the consuming FS via its `consumes_chgs:`
frontmatter. The delta is *applied* at **Phase 3** — never at Phase 2 —
so canonical nodes never carry partially-applied changes while an FS is
in flight.

**Lifecycle:**

| Phase | Event | Status flip |
|---|---|---|
| **Phase 1** | FRS births CHG when `touches_nodes:` is non-empty (R-CHG-1). Allocated by globbing the milestone's `chg/` folder for the next free `CHG-NNN-<slug>.md` filename (R-NEW-9 amended 2026-05-17 — the CHG file itself is the claim; no `id-claims.md` introduce row). Body carries behavior-language `modifies[]`, optional milestone-level `invariants_before/after`, optional `removes[]` / `supersedes[]`. No `adds[]`, no `migration_steps[]`, no structural before/after. | birth → `draft` |
| **Phase 1.5** | Pass 1 `chg-sanity` validates each CHG's behavior delta against FRS ACs + target node state (R-CHG-5). Pass 2 cross-FRS sweep catches CHG-conflicts (R-CHG-6). Round-trip body edits use the 1-file touch carve-out (R-NEW-7 extension) when `status:` stays `draft`. | unchanged (`draft`) |
| **Phase 2** | Consuming FS lists CHG in `consumes_chgs:` (R-CHG-3); enriches in place — structural before/after on `modifies[]`, `adds[]` mirroring new node ingest, `migration_steps[]`. 2-file touch fires on the CHG file (CHG has no per-type `index.md` today — see [`maintenance-discipline.md`](maintenance-discipline.md)). | unchanged (`draft`) |
| **Phase 2 close** | FS-validation exit (per [`plan.md § 6`](plan.md#6-fs-validation-loop)) flips each consumed CHG. | `draft → approved` |
| **Phase 3** | Merge applies `modifies[]` / `removes[]` / `supersedes[]` deltas to canonical targets (each fires its 2-file node touch) and flips the CHG. | `approved → merged` |
| **(merged out)** | Sibling-CHG fold (R-CHG-3 CHG-merging): unused ID flips. No reuse. | `draft → deprecated` |

**Path** (permanent milestone-scoped home — never promoted to canonical):

- Milestone track: `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md`
- CR track: `docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md`

(Pre-cutover CHGs at `specs/FS-NNN-<slug>/nodes/changes/` are grandfathered
and stay where they are — see
[`change-request.md`](change-request.md) for the frozen-layout callout.)

## FS-CHG consumption

Per R-CHG-3. The FS's `consumes_chgs: [CHG-NNN, ...]` frontmatter is the
authoritative FS↔CHG link — replacing the retired `target_fs:` field on
the CHG side and the old filesystem-nesting coupling.

**Cardinality.** One CHG ⇒ at most one FS (one-to-many from FS side).
Phase 2 FS validation enforces this by globbing every FS's
`consumes_chgs:` across the milestone; double-consumption is a Blocker
(per [`plan.md § 6`](plan.md#6-fs-validation-loop)).

**Default at Phase 2.** Consume every CHG born by this FS's constituent
FRSs. Two adjustments allowed:

- **Subset consumption.** When splitting heuristics fire (different
  bounded context, risk profile, or reviewer), this FS consumes only a
  subset of its FRSs' CHGs. The unconsumed CHGs route to a sibling FS in
  the same milestone. Each Phase-1-born CHG ends up consumed by exactly
  one FS before milestone close (or merged per the next bullet, or flipped
  to `deprecated` under explicit abandonment).
- **CHG merging.** Two sibling CHGs (born by sibling FRSs in the same
  milestone) may be merged at FS-authoring time when they target the same
  bounded context with matching risk and reviewer profile. Procedure:
  retain one CHG ID; fold the other's `modifies[]` / invariant deltas
  into it; flip the unused ID to `status: deprecated` (**IDs are never
  reused**). The retained CHG's `source_ref:` accumulates both originating
  FRS IDs.

**Audit hook.** The FS-side `consumes_chgs:` reverse-glob replaces the
retired CHG-side `target_fs:` lookup. To find which FS owns CHG-NNN:
grep every FS in the milestone for `CHG-NNN` in `consumes_chgs:`.

**Phase 3 preflight.** The Phase 3 merger globs `consumes_chgs:` across
all FSs in the milestone before applying any CHG delta — verifying each
milestone-scoped CHG is consumed exactly once (or deprecated by merge).
Double-consumption aborts merge.

## CHG `status: draft` discriminator

Per R-CHG-7 (parallel to R-NEW-8 for FLW; R-NEW-8 narrowed to FLW only
2026-05-17). Post-cutover `status: draft` overlaps two states; the
discriminator is body-shape, not a new frontmatter field:

| Body-shape signal | CHG phase state | Reader interpretation |
|---|---|---|
| CHG ID not yet listed in any FS's `consumes_chgs:` (reverse-glob returns zero hits) | Phase-1-bare | Born by FRS at Phase 1; awaiting FS consumption + enrichment. Body carries business-language `modifies[]` only; no `adds[]`, no `migration_steps[]`, no structural before/after on `modifies[]`. |
| Listed in an FS's `consumes_chgs:` AND structural sections (`migration_steps[]`, structural before/after on `modifies[]`) populated | Phase-2-wired | FS-enriched; awaiting FS-validation exit (which flips to `approved`) and Phase 3 merge. |
| `status: approved` | FS-validation passed | Awaiting Phase 3 merge. |
| `status: merged` | Phase 3 complete | No longer in-flight. |
| `status: deprecated` | Retired (R-CHG-3 merge collapsed it, or full abandonment) | IDs never reused. |

No new frontmatter field — readers infer from `consumes_chgs:` lookup +
body structural-section presence. Phase 1.5 sees only Phase-1-bare CHGs;
Phase 2 FS validation sees Phase-2-wired CHGs.

## Cross-FS dependencies

An FS may read a `proposed` sibling-FS node
via `depends_on_specs:`. An FS may **not** include a `proposed`
sibling-FS node in its `touches_nodes` / CHG `modifies[]` — proposed
nodes are provisional, not modify targets. Phase 3 enforces merge
order: every spec in `depends_on_specs:` must have `merged: true`
before this FS's Phase 3 begins.

## Abandonment

If an FS is abandoned before reaching Phase 3, each of its new canonical
nodes flips `proposed → deprecated` (never deleted; git history keeps the
audit trail); the index row moves to the Superseded/deprecated section.
IDs are not reused. Bidirectional `related:` back-links to a deprecated
proposed node remain (existing deprecated-node pattern).

**Full FRS abandonment (Phase 1 / 1.5).** If an FRS is abandoned before
reaching Phase 2, the FRS's Phase-1-born FLW **and CHG (if any — born
when `touches_nodes:` was non-empty)** flip together: FLW flips
`proposed → deprecated`; CHG flips `draft → deprecated`. Single FRS
abandonment event, two-to-three artifact-side touches (FRS, FLW, CHG).
2-file touch fires per canonical node (canonical body + per-type
`index.md` Status column re-sync) because this is a status-change event,
not a body-only edit (R-NEW-7's carve-out does not apply); for the CHG,
the touch is 1-file on the CHG file (CHG has no per-type `index.md`
today). **ACT-NNN ID release.** If the abandoned FRS claimed an ACT-NNN
via the FRS frontmatter `produced_actor:` field, the release is recorded
by appending a fresh `op: released` row to the milestone's
`id-claims.md` (Source = the abandoned FRS) — this is the only audit
trail because the FRS frontmatter itself is being retired. The ID is
not reused; no canonical ACT file exists yet to deprecate. FRS **split-and-replace** (FRS revised to split into two new
FRSs) retires the originals as `deprecated` and allocates fresh IDs for
the splits; IDs are never reused.

## Workflow self-extension during Phase 2

Planning sometimes surfaces
the need to extend the workflow itself — a new node type the current
16 don't model, a new derived-report type the existing BUSINESS /
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
