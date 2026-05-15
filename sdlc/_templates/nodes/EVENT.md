---
id: EVT-NNN
type: event
title: <EventName, past-tense verb phrase>
status: active               # active | superseded | deprecated
raised_by: []                # [CMD-NNN, SVC-NNN, ...] — what publishes this event
consumed_by: []              # [INT-NNN, SVC-NNN, FLW-NNN, ...]
linked_contract: CON-NNN     # required — the CON node that owns the transport (topic/exchange)
transport: kafka             # kafka | rabbitmq
source_ref: []               # [{frs: FRS-NNN, fs: FS-NNN, op: introduce}] · brownfield: [{absorption: <path>, op: introduce}]
related: []
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# EVT-NNN: <Title>

## Payload

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |

## Producers

Who publishes this event and under what postcondition.

- Published by: CMD-NNN / SVC-NNN
- Condition: …
- Publishing mechanism: ABP outbox | Kafka producer | …

## Consumers

| Consumer | Role / reaction |
| -------- | --------------- |

## Transport

- **Channel:** CON-NNN (link to CONTRACT node)
- **Broker:** Kafka | RabbitMQ
- **Delivery guarantee:** at-least-once | exactly-once

## Versioning

- **Strategy:** additive-only | versioned-type | ~
- **Current version:** 1
- **Breaking-change policy:** …

## Failure modes

- <scenario> — observable result:
- …

## Decisions

> **Inline DEC** — single-node atomic rationale lives here. Promote to a
> standalone DEC under `docs/nodes/decisions/` when scope spans ≥2 nodes.
> Omit this section if the node has no node-local decisions worth recording.

### DEC-inline-1 — <slug>

**Decision:** <one or two sentences>
**Why:** <one or two sentences>
**Related:** <node IDs this rationale touches beyond the host, if any>

## Brownfield notes

Existing Kafka message class / ABP distributed-event DTO / RabbitMQ message this maps to:
