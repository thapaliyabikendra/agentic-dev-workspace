---
id: CCC-004
title: Auditing
status: proposed
created: 2026-05-16
updated: 2026-05-16
stack: [api]
related: []
supersedes: null
superseded_by: null
source: migrated
---

# CCC-004: Auditing

> Project-wide NFR baseline default. FRSs cite this CCC by ID rather than
> restating its content. An operation that needs to deviate from this
> baseline files the deviation as an ADR back-linked here via
> `related: [CCC-004]` in the ADR's frontmatter. Cross-cutting governance
> rule: STD / ADR / CCC / DEC discriminator in
> [`../../../sdlc/workflow/authoring-adr.md`](../../../sdlc/workflow/authoring-adr.md).

## Baseline

Auditing defaults rely on ABP audit logging; entities and application services
are auto-audited by default (TBD — ABP audit logging defaults: entities and
application services auto-audited; additional audit fields and retention to be
specified by the first FRS that touches an audited operation).

## Deviation path

Operation-specific deviations are filed as ADRs (component-scoped under
`docs/<component>/adrs/`, or cross-component under `docs/shared/adrs/`).
Each deviation ADR carries `related: [CCC-004]` in its frontmatter and a
prose explanation of the override. The CCC baseline stays put; the ADR
captures the override.

## Stack-specific notes

*(Optional. Add when the baseline has UI-side, test-side, or infra-side
constraints distinct from the default stack scope.)*

## Revision history

| Version | Date | Notes |
|---------|------|-------|
| 0.1 | 2026-05-16 | Migrated from `cross-cutting-concerns.md` v0.1 — Default remains TBD. |
