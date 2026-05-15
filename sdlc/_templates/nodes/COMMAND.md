---
id: CMD-NNN
type: command
title: <Command name, imperative>
status: proposed              # proposed | active | superseded | deprecated
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # actor, entity, flow, integration
audience: internal            # public | internal
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# CMD-NNN: <Title>

## Trigger

Who/what fires this command, under what circumstances?

- Actor: ACT-NNN
- Triggering event: …

## Inputs

| Name | Type | Constraint |
| ---- | ---- | ---------- |

## Outputs

| Name | Type | Notes |
| ---- | ---- | ----- |

## Preconditions

Must be true before the command can fire.

- …

## Postconditions

Must be true after the command completes successfully.

- …

## Idempotency

How does this command behave under retry? At-least-once delivery is the
default assumption for any non-synchronous caller, so this section is
required for every write command.

- **Mode:** `naturally-idempotent` \| `key-based` \| `non-idempotent` \| `not-applicable`
- **Key strategy:** <name the key — natural domain key, explicit idempotency-key header,
  request-id correlation, etc. Omit when `mode: naturally-idempotent` or `not-applicable`.>
- **Duplicate-call behavior:** <what the second call returns — same response, no-op,
  conflict error, etc.>

## Concurrency

What happens when two callers race on the same target. Required for any
command that mutates state already touched by another command.

- **Model:** `optimistic-version` \| `row-lock` \| `aggregate-lock` \| `single-writer` \| `not-applicable`
- **Conflict resolution:** <what happens on lost-update — last-write-wins, reject with
  conflict, merge rule, etc.>

## Failure modes

- <failure> — observable result:
- …

## Domain events raised

> In-process (local) framework events only. Async/distributed events
> published to a message broker → coin an EVT-NNN node instead.

Events emitted on successful completion. Required events have a known
consumer in this milestone.

| Event | Consumed by |
| ----- | ----------- |

### Deferred events

Events identified as candidates but with no known consumer yet — kept here so
they're surfaced when a consumer arrives, not promoted to the main table.
Omit this sub-section if empty.

- <event> — <why deferred, future consumer if any>

## Targets

- Entity: ENT-NNN
- Used in flows: FLW-NNN

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

Existing handler / service method / endpoint route this command maps to:
