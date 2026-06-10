---
id: QRY-NNN
type: query
title: <Query name, Get / List / Search prefix>
status: proposed              # proposed | active | superseded | deprecated
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # entity read, screen consuming, endpoint exposing
audience: internal            # public | internal
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# QRY-NNN: <Title>

> Body cross-references may use wiki links - `[[ID]]` / `[[ID|label]]` (convention: `sdlc/KB-LAYOUT.md` § Wiki-link syntax; docs/ only).

> **Name prefix discloses shape:** `Get…` (single record by identity),
> `List…` (paged collection), `Search…` (filterable / faceted),
> `Count…` (scalar).

## Caller

Who consumes this query?

- Actor: ACT-NNN
- Screen / consumer: SCR-NNN / external system

## Filter inputs

Inputs that restrict the result set. List even when optional — a missing
filter slot is a defect.

| Name | Type | Required | Constraint |
| ---- | ---- | -------- | ---------- |
|      |      |          |            |

## Sort

Default ordering applied when the caller does not request one. A list query
without a deterministic default sort is non-paginable.

- **Default sort:** <field, direction>
- **Allowed sort fields:** <list, or "default only">

## Paging

Required for `List` / `Search` queries; omit for `Get` / `Count`.

- **Page size default:** N
- **Page size max:** N
- **Cursor / offset:** <approach>

## Output projection

Shape of one result row. Reference entity fields rather than restating —
deviations from the entity shape (composed display names, joined
attributes) are called out explicitly.

| Field | Type | Source (entity field or composition) |
| ----- | ---- | ------------------------------------ |

## Authorization

- Allowed actor(s): ACT-NNN
- Scoping rule: <tenant / owner / scope-by-list / public>
- Permission ID: PERM-NNN (if a first-class permission node applies)

## Failure modes

- Not found: …
- Unauthorized: …
- Timeout / upstream unavailable: …

## Performance notes

- Expected result-set size:
- Indexes required:
- Caching strategy: <none | TTL | event-invalidated>
- Invalidating events: <required when `event-invalidated`; list the events from the
  producing CMD/ENT that invalidate this result. An event-invalidated cache
  with no named events is undefined behavior.>

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

Existing query / repository method / SQL view this maps to:
