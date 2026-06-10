---
id: INT-NNN
type: integration
title: <External system / service>
status: proposed              # proposed | active | superseded | deprecated
direction: outbound           # outbound | inbound | bidirectional — bidirectional is rare; prefer two separate INTs when possible
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # commands and flows that use this integration
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# INT-NNN: <Title>

> Body cross-references may use wiki links - `[[ID]]` / `[[ID|label]]` (convention: `sdlc/KB-LAYOUT.md` § Wiki-link syntax; docs/ only).

## System

What external service or boundary is this?

## Trigger

What causes this integration to execute? The trigger discriminates how the
integration is invoked and where retries originate.

- **outbound:** command-triggered (CMD-NNN), event-triggered (event name),
  or scheduled (cron / interval).
- **inbound:** the inbound endpoint or webhook route on our side.
- **bidirectional:** both — name each leg.

## Contract

> **Ownership rule:** If a CON node exists for this integration's
> surface (HTTP route, Kafka topic, queue), the INT node owns the
> *implementation-context* content: full field schema / DDL, KSQL stream
> definitions, SLA targets, auth wiring, and operational detail. It does
> **not** restate the contract-surface content (delivery semantics,
> retention, DLQ policy) that the CON node owns — reference `CON-NNN
> §<section>` instead. If no CON node exists, inline everything here.

Endpoints, payload shapes, auth, versioning.

| Endpoint / Topic | Method / Format | Purpose |
| ---------------- | --------------- | ------- |

## SLA

- Availability:
- Latency:
- Rate limits:

## Idempotency

Required for `direction: outbound` writes and for `direction: inbound`
endpoints that accept retried calls. Determines whether a duplicate
delivery corrupts state.

- **Mode:** `naturally-idempotent` \| `key-based` \| `non-idempotent` \| `not-applicable`
- **Key strategy:** <natural key, request-id header, partner's correlation ID, etc.>
- **Duplicate-call behavior:** <what we return / what we expect them to handle>

## Failure handling

- **Failure impact boundary:** `hard | soft | eventual` — see
  [`docs/shared/glossary.md`](../../../shared/glossary.md).
- **Domain-event gating:** `eager | committed-only` — see
  [`docs/shared/glossary.md`](../../../shared/glossary.md).
- Timeout behavior:
- Retry policy:
- Circuit breaker / fallback:

## Blast radius

What internal flows or commands break if this integration is down?

- FLW-NNN, CMD-NNN

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

Existing client / adapter / wrapper:
