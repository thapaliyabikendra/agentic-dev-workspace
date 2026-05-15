---
id: STD-002
title: Engine-level .NET implementation conventions
status: proposed
created: 2026-05-13
updated: 2026-05-13
supersedes: null
superseded_by: null
tags: [placeholder, dotnet, application-layer]
scope: engine
source: seed
related_adrs: [ADR-004, ADR-010]
---

# STD-002: Engine-level .NET implementation conventions

> **Engine-level technical standard.** Applies to any .NET project using this
> methodology. Project-specific deviations are ADRs that back-link here;
> node-local atomic decisions are DECs. See
> [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) for the
> Standard / ADR / DEC discriminator.

## Scope

Result-vs-exception policy, async/await naming, DI container conventions,
LINQ-vs-loop guidance, cancellation-token discipline. Rules that apply
regardless of which .NET framework (ABP, vanilla ASP.NET Core, MAUI) the
project uses.

## Standards

**Placeholder — currently empty.** Populate during the next FRS that touches
application-layer code. Project-specific .NET conventions currently live in
[ADR-004](../../docs/adrs/ADR-004-application-layer-conventions.md) and
[ADR-010](../../docs/adrs/ADR-010-cqrs-without-mediator.md); harvesting to
engine level happens when this standard is first populated.

## Consequences

When populated, this standard constrains every application-layer node
(CMD, QRY) in any .NET project using this methodology. Phase 1.5 conflict
detection applies.

## Project-specific deviations

Empty until populated.

## Revisit if

The methodology expands to languages beyond .NET. At that point this standard
narrows its scope (or splits) so non-.NET projects aren't bound by .NET-shaped
rules.
