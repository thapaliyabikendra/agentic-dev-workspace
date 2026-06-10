---
id: STD-001
title: Engine-level DDD constraints
status: proposed
created: 2026-05-13
updated: 2026-06-10
supersedes: null
superseded_by: null
tags: [placeholder, ddd, domain-layer]
scope: engine
applies_when:
  stack: [agnostic]
source: seed
related_adrs: []
deferred_until: "first project FRS touches the domain layer; the hosting milestone MUST carry a named STD-001-graduation task row — see § Graduation trigger"
operative_source: "docs/<component>/adrs/ (search by tag domain-layer)"
---

# STD-001: Engine-level DDD constraints

> **Engine-level technical standard.** Applies to any project using this
> methodology. Project-specific deviations are ADRs in
> [`../../docs/app/adrs/`](../../docs/app/adrs/) that back-link here; node-local
> atomic decisions are DECs (inline under a host node's `## Decisions`
> heading, or standalone). See
> [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) for the
> Standard / ADR / DEC discriminator.

## Scope

Aggregate-root encapsulation, entity-vs-VO distinction, identity rules,
invariant placement, domain-event raising semantics. Rules that apply
regardless of stack, framework, or persistence choice.

## Standards

**Placeholder — currently empty.** Populate during the next FRS that touches
the domain layer. Until then, the project's domain-layer convention ADR
(find it by searching the ADR index for the tag `domain-layer`) is the
operative source.

When this standard is populated, engine-level rules harvested from the
project's domain-layer convention ADR(s) migrate here. Project-specific
rules stay in `docs/<component>/adrs/`; those that prove engine-level are
superseded by this standard via the cross-type supersession path documented
in [`../workflow/authoring-adr.md → Cross-type supersession`](../workflow/authoring-adr.md#cross-type-supersession-adr-supersedes-dec-or-vice-versa).

## Graduation trigger

Graduation is **not** best-effort (REVIEW-SDLC Rec-05, 2026-06-10).
When the first FRS touching the domain layer (any ENT or CMD in
`touches_nodes:` / `produces_nodes:`) enters Phase 1, its milestone
plan MUST carry a named task row — *"Graduate STD-001 (migrate STD-002
R5)"* — so the migration has an owner and cannot silently slip. The
graduation operation is atomic across three files:

1. **This file** — populate § Standards with the harvested rules;
   [STD-002 Rule 5](STD-002-dotnet-coding-conventions.md#rule-5--aggregate-root-encapsulation-builder-style-mutation)
   (aggregate-root encapsulation) migrates here, substance unchanged.
2. **STD-002** — Rule 5 body replaced by a back-link to the new home;
   STD-002's domain-layer scope narrows (see STD-002 § Revisit if).
3. **[`by-layer/domain.md`](by-layer/domain.md)** — the R5 row in
   "Rules to load" and the R5 common-defects bullet re-point
   STD-002 R5 → STD-001 R\<n\> in the same operation.

Until graduation, STD-002 R5 is the operative aggregate-encapsulation
rule. Known, accepted gap: STD-002 is `applies_when.stack: [api]`, so
index-level filtering hides R5 from non-API projects even though the
rule is DDD-universal — the gap is bounded by this trigger, not fixed
by re-scoping (per-rule `applies_when` has no index mechanism).

## Consequences

When populated, this standard constrains every domain-layer node (ENT, CMD)
in any project using this methodology. The Phase 1.5 validation gate
snapshots this file at gate entry; FRSs that contradict an engine-level
rule halt with a `standard-conflict` finding rather than silently absorbing
the deviation.

## Project-specific deviations

ADRs that codify deviations from this standard. Empty until the standard
has content for ADRs to deviate from.

## Revisit if

The methodology adopts a non-DDD modeling paradigm as default (event
sourcing, actor model, functional core / imperative shell). At that point
this standard either retires or supersedes itself with the new paradigm's
constraints.
