---
id: {COMPONENT}-NDF-NNN          # component-prefixed (FDE-NDF-001) or unqualified (NDF-001) per component convention
title: <Type name in noun form, one sentence>
status: proposed                  # proposed | active | deprecated | superseded
declared_type: ABBR               # 2-4 char uppercase abbreviation (ALG, SCN, STR, ...)
prefix: {COMPONENT}-ABBR          # ID prefix for instances ({PREFIX}-NNN); unqualified for brownfield-exempt components
folder: <slug>/                   # path under docs/<component>/nodes/<folder>/ where instances live
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
coined_by: FRS-NNN                # FRS that motivated coining this type
related: [ADR-NNN]                # ADR-039 (the NDF spec ADR) + any per-type ADRs
supersedes: null                  # NDF-NNN if this replaces a prior declaration
superseded_by: null               # NDF-NNN if this has been replaced

# --- Type contract (the declaration this NDF carries) ---
required_frontmatter:
  - <field-name>                  # one entry per required field on every instance
optional_frontmatter:
  - <field-name>
body_sections:
  - <Section heading>              # ordered list; every instance carries these headings
allowed_related_types: [<ABBR>]   # node-type abbreviations permitted in instance `related:`
lifecycle: [proposed, active, deprecated, superseded]  # status vocabulary for instances

# --- Engine-evolution gate evidence (per `sdlc/workflow/evolving-the-workflow.md`) ---
shape_coverage_walk:
  # Record the walk against the engine-default 15-type catalog + every existing NDF.
  # Each entry: { type: <ABBR>, coverage: <pct>, why_not: <one-line> } for types <60%.
  - { type: <ABBR>, coverage: <int>, why_not: "<one-line reason>" }
---

# {COMPONENT}-NDF-NNN: <Title>

> **Node Definition Node (NDF) — per-component custom node type declaration.**
> Declares the shape (frontmatter, body, allowed relations, lifecycle) of a custom
> node type living under `docs/<component>/nodes/<folder>/`. Instances of the type
> carry `declared_via: {COMPONENT}-NDF-NNN` and validate against this contract.
>
> See [ADR-039](../../shared/adrs/ADR-039-ndf-fifth-governance-kind.md) for the
> NDF specification and the STD-vs-ADR-vs-CCC-vs-NDF-vs-DEC discriminator.

## Why this type

What recurring shape no engine-default type carries naturally. Cite the ≥3
instances expected within the foreseeable horizon (per
[`sdlc/workflow/evolving-the-workflow.md`](../../../sdlc/workflow/evolving-the-workflow.md)).
**Two short paragraphs.**

## Shape-coverage walk

Justify why no existing type covers ≥60% of the new shape. The
machine-readable record is `shape_coverage_walk:` in frontmatter; this section
is the prose narrative. Walk the engine-default 15-type catalog
(`sdlc/KB-LAYOUT.md`) + every existing NDF across all components. **One
paragraph; identify the closest two types and where they fall short.**

## Required frontmatter

One row per field listed in `required_frontmatter:`. The `<field-name>` is
the YAML key; the value column states the field's enum / type / shape.

| Field | Type | Notes |
|-------|------|-------|
| `<field-name>` | `<enum \| string \| list>` | <one-line semantics> |

## Optional frontmatter

Same shape as Required. **≤8 entries.** If a field's optionality is
context-dependent (e.g., required only when `kind: X`), state the condition.

## Body sections

The ordered headings every instance must carry. **One sub-bullet per
heading**: state what content lives in that section. **≤8 entries.**

## Allowed `related:` types

The node-type abbreviations an instance may name in its `related:` list.
Includes both engine-default types (CMD, FLW, ENT, ...) and other NDF-declared
types in the same component (or shared NDFs after a promotion ADR). Used by the
NDF-validator to reject malformed cross-references.

## Lifecycle

`proposed → active → (optionally) deprecated | superseded`. The default; if
this type warrants a non-standard vocabulary, document the deviation here
and surface it as an open question on the next NDF refresh.

## Instances

| ID | Title | Status |
|----|-------|--------|
| <PREFIX>-NNN | <one-line title> | proposed |

(Index row also lives in the per-folder `index.md`. This table is a
convenience cross-reference — regenerated, not hand-maintained.)

## Revisit if

Conditions that would prompt re-running the discriminator on this NDF.
**≤3 bullets.** Typical triggers:

- A second component wants this type → file a promotion ADR; move to `docs/shared/node-definitions/`.
- The contract surfaces a generalization that should absorb into STD-004 (per STD-004's `## Revisit if`).
- Instance count drops below ~2 → re-evaluate whether this is really a node type vs. an ADR/DEC.

---

> Index row carries `title` (≤120 chars). Schema:
> [`../workflow/retrieval-discipline.md § Index row schemas`](../workflow/retrieval-discipline.md#index-row-schemas).
