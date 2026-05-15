---
id: STD-001
title: Engine-level DDD constraints
status: proposed
created: 2026-05-13
updated: 2026-05-13
supersedes: null
superseded_by: null
tags: [placeholder, ddd, domain-layer]
scope: engine
source: seed
related_adrs: []
---

# STD-001: Engine-level DDD constraints

> **Engine-level technical standard.** Applies to any project using this
> methodology. Project-specific deviations are ADRs in
> [`../../docs/adrs/`](../../docs/adrs/) that back-link here; node-local
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
