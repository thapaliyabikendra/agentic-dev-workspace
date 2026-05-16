# Cross-Cutting Concerns Log

> Append-only chronological log of CCC lifecycle events. Companion to
> [`index.md`](index.md) — the index is the content-oriented catalog;
> this file is the timeline.
>
> Entry format and operation vocabulary live in
> [`../../../sdlc/workflow/maintenance-discipline.md`](../../../sdlc/workflow/maintenance-discipline.md).
> Single-line entries: `## [YYYY-MM-DD] <op> | <node-id> — <one-line note>`.
> New entries go at the **bottom** of the Entries section.

---

## Entries

## [2026-05-16] created | CCC-001 — Migrated from cross-cutting-concerns.md v0.1; auth defaults TBD pending first FRS that touches the auth surface
## [2026-05-16] created | CCC-002 — Migrated from cross-cutting-concerns.md v0.1; permission keys per module TBD pending first FRS that touches the permission surface
## [2026-05-16] created | CCC-003 — Migrated from cross-cutting-concerns.md v0.1; tenant scope (host | tenant | both) TBD pending first multi-tenant operation FRS
## [2026-05-16] created | CCC-004 — Migrated from cross-cutting-concerns.md v0.1; ABP audit logging defaults; additional fields and retention TBD per FRS
## [2026-05-16] created | CCC-005 — Migrated from cross-cutting-concerns.md v0.1; DataAnnotations + FluentValidation; errors surface as UserFriendlyException
## [2026-05-16] created | CCC-006 — Migrated from cross-cutting-concerns.md v0.1; ABP exception filter; BusinessException for domain rules
## [2026-05-16] created | CCC-007 — Migrated from cross-cutting-concerns.md v0.1; ABP localization; English (en) as base
## [2026-05-16] created | CCC-008 — Migrated from cross-cutting-concerns.md v0.1; ABP distributed cache; per-operation opt-in
## [2026-05-16] created | CCC-009 — Migrated from cross-cutting-concerns.md v0.1; ABP background workers / Hangfire; scheduler / retry / failure handling TBD per FRS
## [2026-05-16] created | CCC-010 — Migrated from cross-cutting-concerns.md v0.1; ABP event bus (local + distributed); transport and ordering TBD per FRS
## [2026-05-16] created | CCC-011 — Migrated from cross-cutting-concerns.md v0.1; ABP current user / session; session duration and concurrent-session policy TBD per FRS
## [2026-05-16] created | CCC-012 — Migrated from cross-cutting-concerns.md v0.1; ABP ISoftDelete; retention windows per category TBD per FRS
## [2026-05-16] created | CCC-013 — Migrated from cross-cutting-concerns.md v0.1; Serilog structured logging; correlation IDs; sinks / alerting thresholds TBD per FRS
