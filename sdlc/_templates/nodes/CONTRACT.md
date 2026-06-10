---
id: CON-NNN
type: contract
title: <Protocol + path/topic — short summary>
status: proposed              # proposed | active | superseded | deprecated
protocol: http                # http | grpc | events | message-queue | other
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
owner_service: null           # SVC-NNN that exposes this contract (null for monolith projects)
consumed_by_services: []      # SVC-NNN IDs that consume this contract (cross-service)
scope: internal               # internal | public | external-facing
schema_ref: null              # path / URI / registry coordinate for typed payloads (when applicable)
schema_version: null
auth: null                    # ACT-NNN or PERM-NNN — required actor / permission (where applicable)
invokes: []                   # FLW-NNN (multi-step) or CMD-NNN / QRY-NNN (single operation)
related: []
version: 1
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# CON-NNN: <Title>

> Body cross-references may use wiki links - `[[ID]]` / `[[ID|label]]` (convention: `sdlc/KB-LAYOUT.md` § Wiki-link syntax; docs/ only).

> A **contract** is any inter-component surface a service exposes —
> HTTP/gRPC route, Kafka topic, queue, ksql stream-as-channel, etc.
> The `protocol:` field discriminates the body sections below.
>
> Reach the relevant section by protocol; the others are skipped.
> CON replaces the prior `EP` node; HTTP endpoints stay HTTP under
> `protocol: http` and lose no detail.

## Authorization

Who can call / produce / consume this, and under what state. References
ACT-NNN and any PERM-NNN guard rules.

- Actor: ACT-NNN
- Permission guards: PERM-NNN

## Versioning

How is this contract versioned (path, header, schema-registry version,
none)? When was it introduced? Successor / predecessor contracts if
any.

- **Backward compatibility policy:** required when `scope: public | external-facing`,
  omit when `scope: internal`. Name which changes are non-breaking (additive fields,
  new optional headers, new optional event fields), and which trigger a major version
  bump (field removal, type change, enum-value removal, semantic shift on an existing
  field, breaking event-schema changes).

## Rate limits and quotas

> Required when `scope: public | external-facing` and
> `protocol: http | grpc`. Omit otherwise.

Per-caller limits, burst allowances, and quota windows. These are part of
the contract surface for any externally-exposed endpoint; without them,
rate-limit responses are undocumented behavior.

- **Limit:** <e.g., 100 req/min per API key, 10 concurrent>
- **Burst:** <token-bucket / fixed-window>
- **Quota exhaustion response:** <e.g., 429 with Retry-After header>

## Failure modes

> **Ownership rule:** CON owns contract-level failure modes — what the
> *producer* or *schema registry* rejects at publish time, and what
> consumers must handle as a contract obligation (e.g., schema
> incompatibility, missing auth). Operational blast-radius and recovery
> detail (what breaks downstream if this surface goes silent) belong on
> the INT node that owns the implementation. Reference `INT-NNN §Blast
> radius` rather than restating it here.

- (Event protocols) Schema-incompatible message → Schema Registry rejects at publish; producer publish fails: …
- Authorization failure: …
- (HTTP/gRPC) Timeout / upstream-unreachable: …
- (HTTP/gRPC) Validation / rate-limit: …

## Brownfield notes

Existing controller / handler / topic / queue this contract maps to:

---

## Protocol-specific sections

The sections below are gated by `protocol:`. Include only the sections
that match this contract's protocol; delete the rest at authoring
time.

### When `protocol: http` or `protocol: grpc`

#### Method and path

`<METHOD> <path>` — one-line purpose. For gRPC, the package +
service + method.

#### Request shape

| Field | Type | Required | Constraint |
| ----- | ---- | -------- | ---------- |
|       |      |          |            |

Notes on encoding / content-type / versioning:

#### Response shape

| Status | Body | Notes |
| ------ | ---- | ----- |
| 200    | …    | success — refer to ENT-NNN |
| 4xx    | …    | client error — see Failure modes |

### When `protocol: events` or `protocol: message-queue`

#### Event types / messages

| Event / message | Producer | Consumer(s) | Notes |
| --------------- | -------- | ----------- | ----- |

#### Schema / payload fields

> **Ownership rule:** If an INT node owns the full schema (e.g., Avro
> field list, KSQL DDL) for this topic, do **not** restate the full
> field table here. Reference `INT-NNN §Contract` and retain only the
> fields that are *contract-relevant to consumers* — typically the
> partition key and any fields used for consumer-side routing or
> filtering. Full schema ownership lives on the INT node.
>
> If no INT node owns this schema, inline the full field table here.

| Field | Type | Description |
| ----- | ---- | ----------- |
|       |      | (contract-relevant fields only — see above) |

#### Partition / routing key

What key is used, why, and what ordering / co-location guarantees it
provides.

#### Delivery semantics

`at-most-once` | `at-least-once` | `exactly-once` — and the reasoning.
Idempotency expectations on consumers.

#### Retention / compaction

Retention window, compaction (log-compaction vs time-based), DLQ
policy.

---

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
