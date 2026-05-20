---
applies_when:
  stack: [agnostic]
---

# Maintaining baseline references (glossary, cross-cutting concerns)

> Rule book for the four operations (Add / Change / Retire / Drift
> detection) on the two project-owned baselines:
> [`docs/shared/glossary.md`](../../docs/shared/glossary.md) and the
> per-CCC tree at [`docs/shared/ccc/`](../../docs/shared/ccc/).
> These are domain-vocabulary and NFR-default documents every FRS
> inherits — neither canonical nodes (no per-type `index.md` for the
> glossary) nor ADRs (deviations from a CCC become ADRs; baselines do
> not absorb them).

> **HARD-GATE:** Do NOT run an Add / Change / Retire operation on
> either baseline while a Phase 1.5 gate is **active** for any FRS in
> the milestone. The gate snapshots both baselines at entry; editing
> mid-gate invalidates the snapshot's audit reproducibility and can
> change a finding's classification under the author's feet. Baseline
> ops run **between** gates (or before, or after — never during).
> (Cross-cutting rules:
> [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
> "Reference, never copy"; [`../PRINCIPLES.md`](../PRINCIPLES.md) —
> *If it can drift, the operation isn't atomic enough.*)

## When to Use

**Use when:** a glossary term or CCC category needs to be added, changed
(clarification or breaking), or retired — typically surfaced by a Phase 1
FRS clarifying dialog, a Phase 1.5 validation finding, an absorption pass
producing glossary terms, or a periodic drift-detection sweep against
FRS bodies.

**Do NOT use when:** the deviation should become an ADR (the FRS
codifies a project-specific override of a CCC baseline default — file
via [`authoring-adr.md`](authoring-adr.md)), or when the surface is a
canonical node body (use the 2-file node touch via
[`maintenance-discipline.md`](maintenance-discipline.md)), or when a
Phase 1.5 gate is currently open against any FRS that cites the
baseline. To decide between CCC and ADR for a new governance rule, run
the 5-way STD / ADR / CCC / NDF / DEC discriminator in
[`authoring-adr.md`](authoring-adr.md).

**Vs. sibling files:** [`maintenance-discipline.md`](maintenance-discipline.md)
governs the 2-file touch on canonical nodes, ADRs, and CCCs uniformly;
the glossary remains outside that pattern.
[`authoring-adr.md`](authoring-adr.md) is where an FRS deviation from
a CCC baseline gets recorded;
[`legacy-absorption.md`](legacy-absorption.md) can produce baseline
additions (Op 1 below) as part of an absorption pass.

## Anti-Pattern: "The Mid-Gate Correction"

Editing the glossary or a CCC file while a Phase 1.5 gate is active
for an FRS in the milestone — because a finding surfaced ambiguous
vocabulary or an under-specified NFR default, and "the fix is small".
The cost: the gate's snapshot at entry no longer matches the live
baseline; a re-validation pass on the same finding gets a different
classification; audit-reproducibility stops being reproducible.
**The right move during an open gate is to record the gap as a
Validation finding (severity Major or Minor) and route the baseline
edit to fire between gates**, with the resolving FRS's revision citing
the updated baseline. Doctrinal anchor:
[`../PRINCIPLES.md`](../PRINCIPLES.md) — *If it can drift, the
operation isn't atomic enough.*

[`docs/shared/glossary.md`](../../docs/shared/glossary.md) and the
CCC tree at [`docs/shared/ccc/`](../../docs/shared/ccc/) are
**project-owned baselines** — domain vocabulary and NFR defaults that
every FRS inherits. The glossary is a flat document (no per-type
`index.md`); the CCC store is a structured tree with `index.md` and
per-CCC files (no companion `log.md` — retired 2026-05-16). Neither
absorbs FRS deviations — an FRS override of a CCC baseline becomes an
ADR back-linked to the CCC via `related: [CCC-NNN]`.

Lifecycle operations run **between** Phase 1.5 gates, never during one.

## Glossary read contract

The Phase 1.5 validation gate snapshots
[`docs/shared/glossary.md`](../../docs/shared/glossary.md) at gate entry and
captures the version in any Validation finding that fires
([audit reproducibility set](frs-validation-rules.md#audit-reproducibility-set)).
Drafters reference the glossary while writing the FRS body and the
Phase-1-born FLW Scenarios; the gate cross-checks that every term used in
either resolves to an entry there. The glossary version is captured as `glossary_version` in every
Validation finding's audit reproducibility set.

## Glossary format

Each entry is one term with one definition. Definitions are written in
business language — no technical surfaces, no schema references. When a
term has both a long form and an abbreviation, list both at the term head
and use either consistently across FRS bodies.

Format:

```
### Term Name (TLA, if any)

One- or two-sentence business definition. The definition explains what the
term means in this project, not what it means in the dictionary or in
another industry. If the term is regulator-defined, cite the regulation.

**Examples** *(when helpful):*
- Concrete example 1
- Concrete example 2

**See also:** RelatedTerm1, RelatedTerm2 *(when relevant)*
```

Avoid nesting subterms inside an entry. If a sub-term needs its own
definition, give it its own entry and cross-reference.

**Matching is case-insensitive** and resolves `See also` synonyms — so a
body mention of "audit log" matches an entry titled `Audit Trail` if that
entry's `See also` lists it (or vice versa). Entries are inserted
alphabetically within their subsection (see Op 1).

## Op 1: Add

**Op 1 adds a new baseline entry** — glossary term or new CCC category.

- *Glossary.* Check for an existing entry by name; if found, halt and
  decide edit vs rename. Insert alphabetically within the chosen
  subsection (Project-specific by default). Adding to the Baseline
  subsection is rare and warrants a major version bump. Bump version,
  append a Revision History row.
- *Cross-cutting concerns.* Author a new `CCC-NNN-<slug>.md` from
  [`sdlc/_templates/CROSS-CUTTING-CONCERNS.md`](../_templates/CROSS-CUTTING-CONCERNS.md).
  Steps:
  1. Determine next ID: ceiling of all IDs in `docs/shared/ccc/index.md`
     + 1. Retired IDs are not reused.
  2. Create `docs/shared/ccc/CCC-NNN-<slug>.md` with `status: proposed`.
     Keep the Baseline section ≤140 chars; surface open questions as
     `OQ-NNN` under `docs/discovery/open-questions/` rather than guessing.
  3. Fire the **2-file touch**:
     a. The new CCC file.
     b. Add a row to `docs/shared/ccc/index.md` (Active table) — `Updated` = today.

  **Verify:** grep `docs/shared/ccc/index.md` for the new ID.
  **On failure:** if the index row is missing, the touch is half-fired —
  complete before declaring done
  (see [`maintenance-discipline.md`](maintenance-discipline.md)).

## Op 2: Change

**Op 2 edits an existing baseline entry** — content clarification or
breaking change.

- *Glossary.* Edit definition in place. Pure typo fixes do not require a
  version bump but ARE recorded in Revision History.
- *Cross-cutting concerns.* Edit the CCC's Baseline section in place.
  Classify the change:
  - **Non-breaking (clarification)** — wording tightened, examples
    added, obligation made more explicit without changing assumptions.
    Fire the **2-file touch**: CCC file + re-sync the row in
    `docs/shared/ccc/index.md` (`Updated` = today).
  - **Breaking** — Baseline narrows, contradicts, or removes an
    obligation existing FRSs may have relied on (e.g., tightening
    retention windows). Every FRS citing the CCC should be re-audited.
    Same **2-file touch** (no separate log file — git history captures
    the chronological audit). The CCC's `Revision history` section
    names the affected FRS sections and recommends Phase 1.5
    re-validation.

  **Verify:** confirm the index row's `Updated` field re-synced. For a
  breaking change, confirm the CCC's Revision history names the
  affected FRSs.
  **On failure:** complete the missing file before closing.

## Op 3: Retire

**Op 3 retires a baseline entry** that is no longer authoritative.

- *Glossary.* Two-step. First mark `[deprecated — use <Replacement>]`
  in the entry's first content line; keep the entry in place; bump
  version; Revision History row notes the deprecation. After zero FRSs
  reference the deprecated term (verify via grep on FRS bodies), remove
  the entry, bump version, add a Revision History row.
- *Cross-cutting concerns.* Flip CCC frontmatter:
  `status: deprecated` (no successor) or `status: superseded` +
  `superseded_by: CCC-NNN` (when a replacement CCC exists). Then fire
  the **2-file touch**:
  a. The CCC file (update frontmatter, note reason in Revision history).
  b. Move the row in `docs/shared/ccc/index.md` from Active to the
     Superseded/deprecated table; Status column re-syncs.

  **Never delete a CCC file or reuse its ID.** The ID and file remain
  in place with the retired status.

  **Verify:** confirm the index row is in the Superseded/deprecated
  table; confirm the CCC's frontmatter and Revision history capture the
  retirement.
  **On failure:** complete the missing file before closing.

## Op 4: Drift detection

**Op 4 is a periodic sweep** that compares FRS content (in
`docs/milestones/**/frs/`) against the baselines and produces a
report. Run between Phase 1.5 gates. Never auto-fix — the report is
the output; the human applies findings via Op 1 / Op 2 / Op 3 or via
FRS edits.

- *Glossary drift.* Type A — domain term used in an FRS body but not in
  the glossary (add to glossary OR rename in FRS). Type B — glossary
  entry not referenced by any FRS (candidate for deprecation; some
  baseline terms are legitimate foundations even when unreferenced —
  flag, don't auto-retire).
- *CCC drift.* Type A — FRS restates CCC baseline content rather than
  citing the CCC by ID (replace with `CCC-NNN` citation). Type B —
  FRS cites a CCC-NNN that has been retired or superseded (revise the
  FRS to cite the successor or remove the citation). Type C — multiple
  FRSs keep restating the same operation-specific deviation (candidate
  for promoting to a new CCC via Op 1, OR for an ADR that captures the
  common deviation — apply the 5-way discriminator in
  [`authoring-adr.md`](authoring-adr.md)).

## Hard rules across all ops

- **Glossary alphabetical insertion** within the chosen subsection — full
  entry shape, matching semantics, and synonym resolution:
  [§ Glossary format](#glossary-format).
- **CCC IDs are permanent.** Never reuse a retired ID. Retired CCCs
  keep their file and index row (Superseded/deprecated table) with a
  retired status.
- **CCC Baseline section ≤140 chars.** If the baseline needs more
  nuance than fits, file an ADR and replace the Baseline prose with
  `See ADR-NNN.` Applies to Op 1 (Add) and Op 2 (Change); keeps the
  always-snapshot-read baseline injectable. Anchor:
  [`retrieval-discipline.md § Baselines`](retrieval-discipline.md#baselines).
- **Every meaningful CCC edit re-syncs the `Updated` field** in the
  index row. The `Updated` stamp plus git history are the Phase 1.5
  audit trail (canonical `log.md` retired 2026-05-16).
- **Never edit FRS bodies from a drift report.** Surface the finding;
  the FRS author chooses the resolution.

The glossary remains outside the tiered-touch pattern (no companion
`index.md` or `log.md`). All CCC edits — routine or lifecycle — fire the
2-file touch (CCC + index re-sync); chronological audit is git history.
Full tiered-touch mechanics:
[`maintenance-discipline.md`](maintenance-discipline.md).

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Reference, never copy" governs the Op 2 breaking-vs-non-breaking
  classification; FRSs reference baselines by citation, never restate.
- **Required before:** [`../PRINCIPLES.md`](../PRINCIPLES.md) — *If it
  can drift, the operation isn't atomic enough* is the doctrinal
  anchor of this flow's HARD-GATE.
- **Required before:** [`design.md`](design.md) — Phase 1.5 gate
  semantics (the gate this flow's HARD-GATE protects).
- **Callers (this file is wholesale-read by):**
  [`legacy-absorption.md`](legacy-absorption.md) (Op 1 — glossary
  terms and CCC entries added from absorption passes),
  [`design.md`](design.md) (Phase 1 / 1.5 — clarifying dialog surfaces
  a glossary or CCC gap; the edit is queued for between gates).
- **Adjacent (not callers but consulted):**
  [`authoring-adr.md`](authoring-adr.md) — when a Change classifies as
  breaking or an FRS deviation needs recording, the ADR captures it;
  also hosts the 5-way STD / ADR / CCC / NDF / DEC discriminator.
  [`docs/shared/ccc/index.md`](../../docs/shared/ccc/index.md) — Karpathy-style
  content catalog; read wholesale at Phase 1.5 gate entry.
- **Sibling rule books:**
  [`maintenance-discipline.md`](maintenance-discipline.md),
  [`authoring-adr.md`](authoring-adr.md),
  [`legacy-absorption.md`](legacy-absorption.md),
  [`evolving-the-workflow.md`](evolving-the-workflow.md),
  [`new-component-bootstrap.md`](new-component-bootstrap.md).
