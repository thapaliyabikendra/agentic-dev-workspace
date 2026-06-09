---
id: STD-007
title: NDF governance — per-component custom node-type declaration (fifth governance kind)
status: accepted
created: 2026-06-10
updated: 2026-06-10
supersedes: null
superseded_by: null
tags: [methodology, ndf, governance, node-types, custom-types]
scope: engine
applies_when:
  stack: [agnostic]
source: harvested-from-ADR-039
related_adrs: []
---

# STD-007: NDF governance — custom node-type declaration

> **Engine-level methodology standard.** Defines **NDF (Node Definition
> Node)** — the fifth governance kind (STD / ADR / CCC / **NDF** / DEC)
> and the engine-owned specification all NDF cites resolve to. Normative
> content harvested 2026-06-10 from the originating project's adoption
> ADR (see § Provenance); this file replaces that ADR as the spec's
> canonical home.

## Scope

What an NDF is, where it lives, how it is registered, which gates govern
coining and ingest, how instances bind to it, and how its contracts
escalate to engine level. Pointer-style: gates and procedures keep their
canonical homes; this file is the normative hub they hang from.

## Standards

**R1 — Definition.** An NDF declares a **per-component custom node-type
contract** (frontmatter fields, body sections, link shape) for node
types beyond the engine-default 16-type catalog in
[`../KB-LAYOUT.md`](../KB-LAYOUT.md). One NDF per custom type;
component-scoped, never methodology-universal (that is STD-004's
reserved scope).

**R2 — Placement + ID.** NDFs live at
`docs/<component>/node-definitions/{PREFIX}-NDF-NNN-<slug>.md`
(unqualified `NDF-NNN` for the brownfield-exempt APP component). An NDF
adopted by a second component is promoted to
`docs/shared/node-definitions/` — the per-component original cites the
promoted copy; reference, never copy.

**R3 — Registration.** The owning component's `COMPONENT.md` lists every
authored NDF ID in its `node_definitions:` frontmatter (empty list when
the component uses only the engine-default catalog). This field is the
machine-checkable registration surface the Phase 2 type-validity gate
reads (R6).

**R4 — Authoring contract.** [`../_templates/NDF.md`](../_templates/NDF.md)
is the operative per-NDF contract — template-as-contract, the same model
STD-004 uses via `operative_source:`. Mandatory: `shape_coverage_walk:`
frontmatter and the `## Shape-coverage walk` prose narrative.

**R5 — Coining gate (pointer).** No NDF is coined until the 60%
shape-coverage walk passes. Canonical HARD-GATE wording:
[`../workflow/evolving-the-workflow.md`](../workflow/evolving-the-workflow.md);
defense-in-depth copies: `WORKFLOW.md § Validation gates`,
[`../workflow/ndf-edit.md`](../workflow/ndf-edit.md).

**R6 — Ingest gate (pointer).** A Phase-2-born node whose
type-abbreviation is in neither the 16-type catalog nor the target
component's `node_definitions:` is rejected as a **Blocker**. Canonical
enforcement home: [`../workflow/plan.md`](../workflow/plan.md) (Phase 2
type-validity HARD-GATE); copy: `WORKFLOW.md § Validation gates`.

**R7 — Instance binding.** Every instance of an NDF-declared type
carries `declared_via: <NDF-ID>` in frontmatter and validates against
that NDF's contract at Phase 2 ingest.

**R8 — Grandfathering.** Canonical nodes predating NDF introduction
(**2026-05-19**) carry no `declared_via:` and are grandfathered —
registry row:
[`../workflow/grandfather-registry.md`](../workflow/grandfather-registry.md).
This section is the engine home for what pre-promotion cites referenced
as "ADR-039 § Brownfield impact".

**R9 — Escalation (NDF ↔ STD-004).** When a deployed NDF's contract
surfaces a cross-project generalization, STD-004 absorbs it; the NDF
stays as the per-component instance and cites STD-004 via `related:`.
Mechanics: [`STD-004 § Bidirectional escalation`](STD-004-node-definitions.md).

**R10 — Discriminator.** Whether a rule is STD / ADR / CCC / NDF / DEC
is decided by the 5-way discriminator in
[`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) — not
re-stated here.

Edit / supersession procedure:
[`../workflow/ndf-edit.md`](../workflow/ndf-edit.md).

## Consequences

A fresh deployment gets the complete NDF chain inside `sdlc/` — no
project artifact required. Lifecycle of one custom type: 5-way
discriminator (R10) → shape-coverage walk (R5) → NDF authored from the
template (R4) at its component path (R2) → registered (R3) → instances
ingest at Phase 2 under the type-validity gate (R6) with
`declared_via:` (R7).

## Project-specific deviations

A project MAY record its adoption of NDF governance as a project ADR
back-linking here; such an ADR is an adoption record and adds no
normative content. The originating project's ADR-039 is the existing
instance of this pattern.

## Provenance

Harvested 2026-06-10 from the originating project's
`docs/shared/adrs/ADR-039-ndf-fifth-governance-kind.md` — historical
reference only, absent in fresh deployments. Promotion event:
[`log.md`](log.md) `[2026-06-10]`; doctrine narrative:
[`../workflow/rule-history.md`](../workflow/rule-history.md).

## Revisit if

STD-004's `deferred_until:` trigger fires and the per-node-type contract
codification lands — re-check the R1/R9 scope boundary (component-scoped
NDF vs methodology-universal STD-004) still partitions cleanly; or a
second promotion surface beyond `docs/shared/node-definitions/` appears.
