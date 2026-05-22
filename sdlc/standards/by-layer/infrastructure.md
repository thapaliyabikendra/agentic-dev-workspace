---
name: by-layer-infrastructure
description: "Phase 3 narrow-load pointer for the EntityFrameworkCore (Infrastructure) layer sub-agent (Cohort C)."
---

# Layer Pointer — EntityFrameworkCore / Infrastructure (Cohort C)

> Pointer file. Cite by ID — do not restate rules. Loaded by the
> EntityFrameworkCore sub-agent during Phase 3 coding per
> `sdlc/workflow/implementation.md § Stage 2 Code — per-layer dispatch`.
> Also load `sdlc/standards/by-layer/cross-cutting.md`.

## ABP project slot

`<Project>.<Module>.EntityFrameworkCore` per STD-005 R9.2

Key folders:
- `<Module>/EntityConfigurations/` — `<AggregateName>Configuration.cs` (one per entity)
- `Migrations/` — `<UtcTimestamp>_<DescriptiveName>.cs`
- `<RootNamespace>DbContext.cs` — DbContext (one per solution)

## Rules to load

| Rule | Source § heading | One-line rationale |
| ---- | ---------------- | ------------------ |
| STD-005 R7 | [STD-005 § Rule 7](../STD-005-abp-coding-conventions.md#rule-7--bounded-value-fields-are-c-enums) | Enums persist as strings via `HasConversion<string>()` |
| STD-005 R8 | [STD-005 § Rule 8](../STD-005-abp-coding-conventions.md#rule-8--no-data-annotations-on-domain-entities) | All persistence concerns in `IEntityTypeConfiguration<T>` |
| STD-005 R9.4 | [STD-005 § Rule 9.4](../STD-005-abp-coding-conventions.md#94-database-object-naming) | Table / column / FK / index naming conventions |
| STD-005 R9.5 | [STD-005 § Rule 9.5](../STD-005-abp-coding-conventions.md#95-migration-file-naming) | Migration: `<UtcTimestamp>_<PresentTenseVerb><Description>.cs` |
| STD-005 R12 | [STD-005 § Rule 12](../STD-005-abp-coding-conventions.md#rule-12--ientitytypeconfigurationt-enforcement-tightens-rule-8--rule-92) | One `<Aggregate>Configuration.cs`; no inline `OnModelCreating` |
| STD-005 R13 | [STD-005 § Rule 13](../STD-005-abp-coding-conventions.md#rule-13--shared-validation--schema-constants-per-module) | `HasMaxLength` / `HasPrecision` read from `<Module>Consts.cs` |
| STD-005 R16 | [STD-005 § Rule 16](../STD-005-abp-coding-conventions.md#rule-16--soft-delete-data-filter-discipline) | No manual `IsDeleted` predicate; use `IDataFilter.Disable<ISoftDelete>()` |
| STD-005 R17 | [STD-005 § Rule 17](../STD-005-abp-coding-conventions.md#rule-17--audit-logging-via-abp-audit-module-not-ilogger) | `IAuditingStore` wiring in `AbpAuditingOptions` |
| STD-006 R1 | [STD-006 § Rule 1](../STD-006-logging-conventions.md#rule-1--iloggert-injection-only) | Inject `ILogger<T>` only; no `Serilog.ILogger` or `Log.*` |
| STD-006 R2 | [STD-006 § Rule 2](../STD-006-logging-conventions.md#rule-2--per-layer-log-levels) | `Debug` for routine ops; `Error` (with exception) for faults |
| STD-006 R3 | [STD-006 § Rule 3](../STD-006-logging-conventions.md#rule-3--structured-logging-with-named-properties) | Named `{Placeholder}` templates; no interpolation |
| STD-006 R4 | [STD-006 § Rule 4](../STD-006-logging-conventions.md#rule-4--never-log-sensitive-data) | Never log passwords, tokens, card numbers |

## Companion rules in other layers (read only on cross-layer touch)

- STD-005 R13 Domain.Shared half — `<Module>Consts.cs` is the constant source
- STD-005 R2 (Domain) — entity base class determines which audit columns EF must map

## Common defects this layer must avoid

- Inline `builder.Entity<X>(b => b.ToTable(...).HasMaxLength(...))` inside `OnModelCreating` (STD-005 R12)
- Missing `<AggregateName>Configuration.cs` for a new entity (STD-005 R12)
- Hardcoded `HasMaxLength(<int-literal>)` — read from `<Module>Consts.cs` (STD-005 R13)
- Enum column stored as integer — must use `HasConversion<string>()` (STD-005 R7)
- Manual `.Where(x => !x.IsDeleted)` outside a `Disable<ISoftDelete>()` block (STD-005 R16)
- `using Serilog;` or `Serilog.ILogger` field in infrastructure code (STD-006 R1)
