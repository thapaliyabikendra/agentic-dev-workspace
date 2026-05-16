---
id: CCC-007
title: Localization
status: proposed
created: 2026-05-16
updated: 2026-05-16
stack: [full-stack]
related: []
supersedes: null
superseded_by: null
source: migrated
---

# CCC-007: Localization

> Project-wide NFR baseline default. FRSs cite this CCC by ID rather than
> restating its content. An operation that needs to deviate from this
> baseline files the deviation as an ADR back-linked here via
> `related: [CCC-007]` in the ADR's frontmatter. Cross-cutting governance
> rule: STD / ADR / CCC / DEC discriminator in
> [`../../../sdlc/workflow/authoring-adr.md`](../../../sdlc/workflow/authoring-adr.md).

## Baseline

Localization defaults use ABP localization with English (en) as the base
language (TBD — ABP localization; English (en) as base; additional locales
and resource file conventions to be fixed by the first FRS that touches a
localized surface).

## Deviation path

Operation-specific deviations are filed as ADRs (component-scoped under
`docs/<component>/adrs/`, or cross-component under `docs/shared/adrs/`).
Each deviation ADR carries `related: [CCC-007]` in its frontmatter and a
prose explanation of the override. The CCC baseline stays put; the ADR
captures the override.

## Stack-specific notes

This CCC applies full-stack — both server-side resource files (ABP
localization modules) and client-side string bundles must reference the same
locale base.

## Revision history

| Version | Date | Notes |
|---------|------|-------|
| 0.1 | 2026-05-16 | Migrated from `cross-cutting-concerns.md` v0.1 — Default remains TBD. |
