---
id: FA-NNN
type: functional-area
title: <Functional area name — short summary>
status: proposed              # proposed | active | superseded | deprecated
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
modules: []                   # MOD-NNN IDs this functional area spans
services: []                  # SVC-NNN IDs that contribute to this area
owner_actors: []              # ACT-NNN IDs primarily operating in this area
shipped_by: []                # M-NN milestone IDs that delivered work into this area
related: []
version: 1
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# FA-NNN: <Title>

> A **functional area** is a cross-cutting feature concept that spans one
> or more bounded contexts and one or more services. It is the
> stakeholder-facing slice (e.g., "fraud detection," "case
> investigation"); MOD is the engineering-facing bounded context inside
> it.
>
> Use FA when the slice is genuinely cross-cutting. A capability that
> lives inside one MOD is a MOD, not an FA.

## Purpose

One or two sentences. What capability does this functional area
deliver, and to whom? Stakeholder framing — avoid restating the
contained MODs' invariants.

## Spanned modules

Mirrors the `modules:` frontmatter. Bounded contexts this area
incorporates. Each MOD remains independent; the FA composes them into
a delivered capability.

- MOD-NNN — <how this MOD participates>

## Contributing services

Mirrors `services:`. SVC nodes that realize the spanned modules and
contribute behavior to this area. Empty for monolith projects.

- SVC-NNN — <contribution>

## Capability outline

Cross-MOD invariants, the stakeholder-visible flows, the journey
across services. This is the place to describe what is true of the
area as a whole that isn't true of any single MOD.

- Capability: …
- Cross-MOD invariant: …
- Headline flows: FLW-NNN, FLW-NNN

## Owner actors

Mirrors `owner_actors:`. The actors who primarily operate in this
area.

- ACT-NNN — <role in this area>

## Brownfield notes

Existing product surface / domain language this area maps to:

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
