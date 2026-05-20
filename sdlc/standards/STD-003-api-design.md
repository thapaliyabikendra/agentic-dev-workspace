---
id: STD-003
title: Engine-level API design rules
status: proposed
created: 2026-05-13
updated: 2026-05-20
supersedes: null
superseded_by: null
tags: [placeholder, api, http]
scope: engine
applies_when:
  stack: [api]
source: seed
related_adrs: []
deferred_until: "first project FRS touches an HTTP boundary; engine-level rules harvested from project ADR(s) at that time"
operative_source: "docs/<component>/adrs/ (search by tag api or http)"
---

# STD-003: Engine-level API design rules

> **Engine-level technical standard.** Applies to any project exposing an
> HTTP API under this methodology. Project-specific deviations are ADRs;
> endpoint-local atomic decisions are DECs. See
> [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) for the
> Standard / ADR / DEC discriminator.

## Scope

HTTP verb / status code semantics, REST vs RPC choice criteria, response
envelope shape, pagination contract, error response shape, idempotency
keys, versioning rules. Rules that apply regardless of which web framework
or gateway sits in front.

## Standards

**Placeholder — currently empty.** Populate when the first FRS touches
an HTTP boundary. Project-specific HTTP-boundary shape lives in the
project's API/HTTP convention ADRs; harvesting to engine level happens
when this standard is first populated.

## Consequences

When populated, this standard constrains every CON node with
`protocol: http` (and any SCR that invokes one) in any project using this
methodology. Phase 1.5 conflict detection applies.

## Project-specific deviations

Empty until populated.

## Revisit if

The methodology expands to non-HTTP API surfaces (gRPC streams, GraphQL
subscriptions, WebSocket-only protocols). At that point this standard
narrows its scope or peer standards land alongside.
