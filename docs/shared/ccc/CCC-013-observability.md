---
id: CCC-013
title: Observability
status: proposed
created: 2026-05-16
updated: 2026-05-16
stack: [full-stack]
related: []
supersedes: null
superseded_by: null
source: migrated
---

# CCC-013: Observability

> Project-wide NFR baseline default. FRSs cite this CCC by ID rather than
> restating its content. An operation that needs to deviate from this
> baseline files the deviation as an ADR back-linked here via
> `related: [CCC-013]` in the ADR's frontmatter. Cross-cutting governance
> rule: STD / ADR / CCC / DEC discriminator in
> [`../../../sdlc/workflow/authoring-adr.md`](../../../sdlc/workflow/authoring-adr.md).

## Baseline

Observability defaults use Serilog structured logging with correlation IDs
(TBD — Serilog structured logging; correlation IDs; log sinks, sampling
rates, and alerting thresholds to be fixed by the first FRS that touches a
production observability surface).

## Deviation path

Operation-specific deviations are filed as ADRs (component-scoped under
`docs/<component>/adrs/`, or cross-component under `docs/shared/adrs/`).
Each deviation ADR carries `related: [CCC-013]` in its frontmatter and a
prose explanation of the override. The CCC baseline stays put; the ADR
captures the override.

## Stack-specific notes

This CCC applies full-stack — both server-side Serilog sinks and client-side
telemetry (browser error tracking, front-end performance instrumentation)
must emit correlation IDs that allow end-to-end trace reconstruction.

## Revision history

| Version | Date | Notes |
|---------|------|-------|
| 0.1 | 2026-05-16 | Migrated from `cross-cutting-concerns.md` v0.1 — Default remains TBD. |
