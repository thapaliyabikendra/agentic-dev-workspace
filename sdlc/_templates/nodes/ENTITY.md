---
id: ENT-NNN
type: entity
title: <Entity name>
status: proposed              # proposed | active | superseded | deprecated
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # commands, flows, states, other entities
value_object: false           # true → omit Identity and Lifecycle sections
is_aggregate_root: false      # true if this entity owns invariants across a cluster; false for child entities
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# ENT-NNN: <Title>

## Purpose

2–3 sentences. What does this entity represent in the domain, who
creates it, and what's the headline modeling choice (key invariant,
core variant, or aggregate-root relationship)? Do not restate field
constraints or invariants — those have their own sections below.

## Identity

> Omit when `value_object: true`.

What defines this entity's identity? (Field or composite key.)

- **Owned by:** ENT-NNN (aggregate root) — required when `is_aggregate_root: false`.
  A child entity's identity is scoped to its aggregate; it is never referenced
  from outside the aggregate boundary.

## Aggregate composition

> Required when `is_aggregate_root: true`. Omit otherwise.

Child entities and value objects this aggregate owns. The aggregate is the
consistency boundary: invariants listed below this section must be enforceable
within this composition. Rules that span multiple aggregates belong on the
containing MOD or on a domain-service CMD — not here.

- **Child entities:** ENT-NNN — <one-line role>
- **Owned value objects:** <VO concept name> — <one-line role>

## Fields

| Field | Type | Constraint |
| ----- | ---- | ---------- |
|       |      |            |

## Invariants

Rules that must always hold. Violated invariants are bugs.

- …

## Lifecycle

> Omit when `value_object: true`.

How is this entity created, modified, retired? Link to State node if it has a
formal state machine.

- Created by: CMD-NNN
- Modified by: CMD-NNN, CMD-NNN
- State machine: STA-NNN | none — see [`../../KB-LAYOUT.md → Node-type discriminators`](../../KB-LAYOUT.md#node-type-discriminators) (STA vs. inline-on-entity)

## Relationships

References to entities in **other** aggregates. Intra-aggregate children
appear under Aggregate composition above; this section captures cross-
aggregate links only. Cross-aggregate references are by ID, never by
navigation — eager loading across an aggregate boundary is a modelling
smell.

| Kind | Target | Cardinality | FK field on this entity |
| ---- | ------ | ----------- | ----------------------- |
| 1:1 \| 1:N \| N:1 | ENT-NNN | <e.g., exactly one, zero-or-more> | <field name> |

## Domain events

Lifecycle events raised by this entity that other nodes consume. Required
events have a known consumer in this milestone.

| Event | Raised on | Consumed by |
| ----- | --------- | ----------- |

### Deferred events

Events identified as candidates but with no known consumer yet — kept here so
they're surfaced when a consumer arrives, not promoted to the main table.
Omit this sub-section if empty.

- <event> — <why deferred, future consumer if any>

## Decisions

> **Inline DEC** — single-node atomic rationale lives here. Promote to a
> standalone DEC under `docs/nodes/decisions/` when **any** of these
> trigger: scope spans ≥2 nodes; lifecycle (`status` / `superseded_by`) is
> needed; rationale grows past ~5 sentences with explicit Alternatives /
> Revisit-if blocks; external nodes need to cite by ID. See
> [`../../workflow/authoring-adr.md`](../../workflow/authoring-adr.md).
>
> Omit this section if the node has no node-local decisions worth recording.

### DEC-inline-1 — <slug>

**Decision:** <one or two sentences>
**Why:** <one or two sentences>
**Related:** <node IDs this rationale touches beyond the host, if any>

<!-- Add additional inline DECs as needed; promote to standalone when triggers fire. -->

## Brownfield notes

Existing table / class / module this entity maps to:
