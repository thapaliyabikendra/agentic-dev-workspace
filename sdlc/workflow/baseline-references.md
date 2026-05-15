# Maintaining baseline references (glossary, cross-cutting concerns)

> Rule book for the four operations (Add / Change / Retire / Drift
> detection) on the two project-owned baselines:
> [`docs/glossary.md`](../glossary.md) and
> [`docs/cross-cutting-concerns.md`](../cross-cutting-concerns.md).
> These are domain-vocabulary and NFR-default documents every FRS
> inherits — neither canonical nodes (no `index.md` / `log.md` pair)
> nor ADRs (deviations become ADRs; baselines do not absorb them).

> **HARD-GATE:** Do NOT run an Add / Change / Retire operation on
> either baseline while a Phase 1.5 gate is **active** for any FRS in
> the milestone. The gate snapshots both files at entry; editing
> mid-gate invalidates the snapshot's audit reproducibility and can
> change a finding's classification under the author's feet. Baseline
> ops run **between** gates (or before, or after — never during).
> (Cross-cutting rules:
> [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
> "Reference, never copy"; [`../PRINCIPLES.md`](../PRINCIPLES.md) —
> *If it can drift, the operation isn't atomic enough.*)

## When to Use

**Use when:** a glossary term or cross-cutting-concerns category needs
to be added, changed (clarification or breaking), or retired — typically
surfaced by a Phase 1 FRS clarifying dialog, a Phase 1.5 validation
finding, an absorption pass producing glossary terms, or a periodic
drift-detection sweep against FRS bodies.

**Do NOT use when:** the deviation should become an ADR (the FRS
codifies a project-specific override of a baseline default — file via
[`authoring-adr.md`](authoring-adr.md)), or when the surface is a
canonical node body (use the standard 3-file touch via
[`maintenance-discipline.md`](maintenance-discipline.md)), or when a
Phase 1.5 gate is currently open against any FRS that cites the
baseline.

**Vs. sibling files:** [`maintenance-discipline.md`](maintenance-discipline.md)
governs the per-type tiered touch on canonical nodes and ADRs;
baselines explicitly do **not** participate in that touch (see the
final paragraph of this file). [`authoring-adr.md`](authoring-adr.md)
is where an FRS deviation from a baseline gets recorded;
[`legacy-absorption.md`](legacy-absorption.md) can produce baseline
additions (Op 1 below) as part of an absorption pass.

## Anti-Pattern: "The Mid-Gate Correction"

Editing the glossary or `cross-cutting-concerns.md` while a Phase 1.5
gate is active for an FRS in the milestone — because a finding
surfaced ambiguous vocabulary or an under-specified NFR default, and
"the fix is small". The cost: the gate's snapshot at entry no longer
matches the live file; a re-validation pass on the same finding gets
a different classification; the audit-reproducibility set in each
Validation finding's row stops being reproducible. **The right move
during an open gate is to record the gap as a Validation finding
(severity Major or Minor as appropriate) and route the baseline edit
to fire between gates**, with the resolving FRS's revision citing the
new baseline version. Doctrinal anchor:
[`../PRINCIPLES.md`](../PRINCIPLES.md) — *If it can drift, the
operation isn't atomic enough.*

[`docs/glossary.md`](../glossary.md) and
[`docs/cross-cutting-concerns.md`](../cross-cutting-concerns.md) are
**project-owned baselines** — domain vocabulary and NFR defaults that
every FRS inherits. They sit outside the canonical DDD wiki (no per-type
`index.md` / `log.md` pair — they are flat documents, not node types) and
outside the ADR commitment store (an FRS deviation from a baseline
category becomes an ADR; the baseline file does not absorb the
deviation).

Lifecycle operations run **between** Phase 1.5 gates, never during one —
the gate snapshots both files at entry.

## Op 1: Add

- *Glossary.* Check for an existing entry by name; if found, halt and
  decide edit vs rename. Insert alphabetically within the chosen
  subsection (Project-specific by default). Adding to the Baseline
  subsection is rare and warrants a major version bump. Bump version,
  append a Revision History row.
- *Cross-cutting concerns.* Check for overlap with an existing category;
  if found, halt and decide fold-in vs new. Insert at the next
  sequential number — **never renumber existing categories.** Append
  `**Origin:** project-added (v<new-version>)` at the foot of the new
  category, before the `---` separator. Bump version with the
  classification (see Op 2).

## Op 2: Change

- *Glossary.* Edit definition in place. Pure typo fixes do not require a
  version bump but ARE recorded in Revision History.
- *Cross-cutting concerns.* Edit category content in place; **preserve
  the Origin line** (it records provenance, not edit history). Classify:
  - **Non-breaking (clarification)** — wording tightened, examples
    added, obligation made more explicit without changing assumptions.
    Minor version bump.
  - **Breaking** — category narrows, contradicts, or removes an
    obligation existing FRSs may have relied on by reference. Every FRS
    citing it should be re-audited. Major version bump. The Revision
    History row names the affected FRS sections (typically Behavior,
    Brownfield impact) and recommends Phase 1.5 re-validation against
    affected FRSs.

Pure typo fixes on either file do not bump the version but ARE recorded
in Revision History.

## Op 3: Retire

- *Glossary.* Two-step. First mark `[deprecated — use <Replacement>]`
  in the entry's first content line; keep the entry in place; bump
  version; Revision History row notes the deprecation. After zero FRSs
  reference the deprecated term (verify via grep on FRS bodies), remove
  the entry, bump version, add a Revision History row.
- *Cross-cutting concerns.* **Never remove a category outright** — mark
  the category content `[retired — see <Replacement> | absorbed into
  platform default]` while keeping the heading and number intact. The
  cross-reference contract requires the number to remain.

## Op 4: Drift detection

A periodic pass that compares FRS content (in `docs/milestones/**/frs/`)
against the baselines and produces a report. Never auto-fix — the report
is the output; the human applies findings via Op 1 / Op 2 / Op 3 or via
FRS edits.

- *Glossary drift.* Type A — domain term used in an FRS body but not in
  the glossary (add to glossary OR rename in FRS). Type B — glossary
  entry not referenced by any FRS (candidate for deprecation; some
  baseline terms are legitimate foundations even when unreferenced —
  flag, don't auto-retire).
- *Cross-cutting drift.* Type A — FRS restates baseline content rather
  than citing it (replace with forward reference). Type B — FRS cites a
  category that no longer exists or has been retired (revise the FRS).
  Type C — multiple FRSs keep restating the same operation-specific
  deviation (candidate for promoting to a new baseline category, OR for
  an ADR that captures the common deviation).

## Hard rules across all ops

- **Glossary alphabetical insertion** is the contract within the chosen
  subsection — Phase 1.5 term resolution assumes case-insensitive
  alphabetical order and `See also` synonym resolution.
- **Cross-cutting numbering is permanent.** Never renumber. Retired
  categories keep their heading and number with a `[retired]` note.
- **Cross-cutting Origin lines are immutable** after the category is
  created. Op 2 (Change) preserves them.
- **Every meaningful edit bumps version and lands a Revision History
  row** classified breaking / non-breaking. The version stamps every
  Phase 1.5 Validation finding's audit reproducibility set.
- **Never edit FRS bodies from a drift report.** Surface the finding;
  the FRS author chooses the resolution.

These baselines do **not** participate in the tiered touch — the
per-type `index.md` + `log.md` discipline applies to canonical DDD nodes
and ADRs only. See [`maintenance-discipline.md`](maintenance-discipline.md).

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Reference, never copy" governs the Op 2 (Change) breaking-vs-non-breaking
  classification; FRSs reference baselines by citation, never restate.
- **Required before:** [`../PRINCIPLES.md`](../PRINCIPLES.md) — *If it
  can drift, the operation isn't atomic enough* is the doctrinal
  anchor of this flow's HARD-GATE.
- **Required before:** [`design.md`](design.md) — Phase 1.5 gate
  semantics (the gate this flow's HARD-GATE protects).
- **Callers (this file is wholesale-read by):**
  [`legacy-absorption.md`](legacy-absorption.md) (Op 1 — glossary
  terms added from absorption passes),
  [`design.md`](design.md) (Phase 1 / 1.5 — clarifying dialog surfaces
  a glossary or cross-cutting gap; the edit is queued for between
  gates).
- **Adjacent (not callers but consulted):**
  [`authoring-adr.md`](authoring-adr.md) — when a Change classifies as
  breaking and the FRS codifies an override, the ADR captures it.
- **Sibling rule books:**
  [`maintenance-discipline.md`](maintenance-discipline.md),
  [`authoring-adr.md`](authoring-adr.md),
  [`legacy-absorption.md`](legacy-absorption.md),
  [`evolving-the-workflow.md`](evolving-the-workflow.md),
  [`new-component-bootstrap.md`](new-component-bootstrap.md).
