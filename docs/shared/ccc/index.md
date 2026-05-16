# Cross-Cutting Concerns Index

> The Karpathy-style index for **project-wide NFR baseline defaults**.
> CCCs define what every operation in the project absorbs by default;
> operation-specific deviations are filed as ADRs back-linked to the
> deviating CCC via `related: [CCC-NNN]`. Phase 1.5 snapshots this
> index at gate entry; Phase 2 / Phase 3 narrow-load individual CCC
> pages declared in the consuming artifact's `ccc:` frontmatter.
>
> See [`../../../sdlc/workflow/retrieval-discipline.md`](../../../sdlc/workflow/retrieval-discipline.md)
> and [`../../../sdlc/workflow/authoring-adr.md`](../../../sdlc/workflow/authoring-adr.md)
> (the STD / ADR / CCC / DEC discriminator lives there).
>
> One row per CCC. Title is **one line** — full content belongs in the CCC page itself, not here.

---

## Conventions

- **ID** — `CCC-NNN`. Next ID = ceiling of the IDs in this index + 1. Retired IDs are not reused. No involvement with milestone-scoped `id-claims.md` — CCC IDs are workspace-level like STD and ADR.
- **Status** — `proposed` · `accepted` · `deprecated` · `superseded`.
- **Stack** — comma-joined from the CCC's `stack:` frontmatter.
- **Tags** — free-form, comma-separated.
- **Source** — origin reference. `migrated` when carried over from the v0.1 flat doc; `seed` for fresh authoring; `harvested-from-FRS-NNN` when an FRS surfaces a new baseline.

---

## Active

| ID | Status | Title (≤120 chars) | Stack | Tags | Source | Updated |
|----|--------|--------------------|-------|------|--------|---------|
| [CCC-001](CCC-001-authentication-and-identity.md) | proposed | Authentication & Identity | api | auth, identity | migrated | 2026-05-16 |
| [CCC-002](CCC-002-authorization.md) | proposed | Authorization | api | authz, permissions | migrated | 2026-05-16 |
| [CCC-003](CCC-003-multi-tenancy.md) | proposed | Multi-tenancy | api | tenancy | migrated | 2026-05-16 |
| [CCC-004](CCC-004-auditing.md) | proposed | Auditing | api | audit | migrated | 2026-05-16 |
| [CCC-005](CCC-005-validation.md) | proposed | Validation | api | validation | migrated | 2026-05-16 |
| [CCC-006](CCC-006-exception-handling.md) | proposed | Exception handling | api | exceptions | migrated | 2026-05-16 |
| [CCC-007](CCC-007-localization.md) | proposed | Localization | full-stack | localization, i18n | migrated | 2026-05-16 |
| [CCC-008](CCC-008-caching.md) | proposed | Caching | api | caching | migrated | 2026-05-16 |
| [CCC-009](CCC-009-background-jobs.md) | proposed | Background jobs | api | background-jobs | migrated | 2026-05-16 |
| [CCC-010](CCC-010-distributed-events.md) | proposed | Distributed events | api | events | migrated | 2026-05-16 |
| [CCC-011](CCC-011-session-management.md) | proposed | Session management | api | session | migrated | 2026-05-16 |
| [CCC-012](CCC-012-soft-delete-and-retention.md) | proposed | Soft delete & retention | api | retention, soft-delete | migrated | 2026-05-16 |
| [CCC-013](CCC-013-observability.md) | proposed | Observability | full-stack | observability, logging | migrated | 2026-05-16 |

---

## Superseded / deprecated

| ID | Status | Title (≤120 chars) | Stack | Tags | Source | Updated |
|----|--------|--------------------|-------|------|--------|---------|
| _none yet_ |  |  |  |  |  |  |
