---
id: MOD-NNN
type: module
title: <Bounded context name>
status: proposed              # proposed | active | superseded | deprecated
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
contains: []                  # node IDs (ACT/ENT/CMD/FLW/STA/SCR/CON/PERM/...) within this bounded context
upstream: []                  # MOD-NNN IDs this module depends on
downstream: []                # MOD-NNN IDs that depend on this module
realized_by: []               # SVC-NNN IDs realizing this bounded context (multi-service projects)
in_areas: []                  # FA-NNN IDs this module participates in
shipped_by: []                # M-NN milestone IDs that delivered work into this module
owner_actor: null             # ACT-NNN, if a single actor primarily operates within the module
related: []
version: 1
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# MOD-NNN: <Title>

> Body cross-references may use wiki links - `[[ID]]` / `[[ID|label]]` (convention: `sdlc/KB-LAYOUT.md` § Wiki-link syntax; docs/ only).

> **MOD is the bounded-context node.** Engineering-facing — the unit of
> domain invariants. Cross-cutting product capability that spans multiple
> MODs is an **FA** (functional area). Single deployable unit realizing a
> MOD is an **SVC** (service). MOD is the durable domain concept; SVC is
> the realization and FA is the product framing.
>
> Durable counterpart to a milestone: milestones SHIP work into a MOD; the
> MOD itself lives across releases.

## Purpose

One sentence on the bounded context this module represents — what it owns,
what it answers for.

## Bounded context boundary

> **Layer split — applies to both codebase and knowledge-base nodes.**
>
> **Presentation:** SCR nodes surface use cases to actors and invoke CON
> nodes only. A SCR referencing FLW, CMD, or QRY directly is a
> modelling violation.
>
> **Contract surface:** CON nodes are the mandatory boundary between
> presentation (or other services) and domain. CON dispatches to FLW for
> multi-step use cases or directly to CMD/QRY for single operations.
> Web UIs invoke `protocol: http` contracts; cross-service consumers
> invoke `events` / `grpc` / `message-queue` contracts per their kind.
>
> **Orchestration:** FLW nodes sequence CMD and QRY calls for use cases
> with branching or async steps.
>
> **Domain Services:** CMD nodes mutate state and raise domain events;
> QRY nodes read and project state without side effects.
>
> **Domain Objects:** ENT and STA nodes are what domain services operate
> on. They carry no tier designation.

What's inside this module vs. what's just adjacent. Make the boundary
explicit so future FRSs know whether a new behavior belongs here or in a
neighbor.

- Inside: …
- Adjacent (not inside): …

## Contained nodes

Mirrors the `contains:` frontmatter, grouped by node type.

- Actors: ACT-NNN, ACT-NNN
- Entities: ENT-NNN
- Commands: CMD-NNN
- Flows: FLW-NNN
- States: STA-NNN
- Screens: SCR-NNN
- Contracts: CON-NNN
- Permissions: PERM-NNN

## Upstream / downstream modules

- Upstream (this module depends on): MOD-NNN — <one-line reason>
- Downstream (depend on this module): MOD-NNN — <one-line reason>

## Invariants

Module-level invariants that span its contained nodes. Cross-node rules go
here; single-node rules stay on the node.

- …

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

Existing code package / directory / service this module maps to:
