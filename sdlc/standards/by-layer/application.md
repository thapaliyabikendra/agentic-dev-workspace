---
name: by-layer-application
description: "Phase 3 narrow-load pointer for the Application layer sub-agent (Cohort B)."
---

# Layer Pointer — Application (Cohort B)

> Pointer file. Cite by ID — do not restate rules. Loaded by the
> Application sub-agent during Phase 3 coding per
> `sdlc/workflow/implementation.md § Stage 2 Code — per-layer dispatch`.
> Also load `sdlc/standards/by-layer/cross-cutting.md`.

## ABP project slot

`<Project>.<Module>.Application` per STD-005 R9.2

Key folders:
- `<Module>/<SubModule>/AppServices/` — `<AggregateName>AppService.cs` implementations
- `<Module>/<SubModule>/Mappers/` — Mapperly `[Mapper] partial class <Aggregate>Mapper`

## Rules to load

| Rule | Source § heading | One-line rationale |
| ---- | ---------------- | ------------------ |
| STD-002 R1.3 | [STD-002 § Rule 1.3](../STD-002-dotnet-coding-conventions.md#13-erroror-boundary--never-past-the-appservice) | AppService interface returns `T`, not `ErrorOr<T>` |
| STD-002 R1.4 | [STD-002 § Rule 1.4](../STD-002-dotnet-coding-conventions.md#14-appservice-unwrap-pattern) | AppService unwraps `ErrorOr<T>` → `UserFriendlyException` |
| STD-002 R1.5 | [STD-002 § Rule 1.5](../STD-002-dotnet-coding-conventions.md#15-multiple-errors) | Multiple errors: iterate `result.Errors`, fold to one exception |
| STD-005 R10 | [STD-005 § Rule 10](../STD-005-abp-coding-conventions.md#rule-10--auto-api-controllers-are-the-default-http-exposure) | `IApplicationService` auto-exposed; manual controllers need DEC |
| STD-005 R11 | [STD-005 § Rule 11](../STD-005-abp-coding-conventions.md#rule-11--node-body-to-service-layer-mapping) | AppService: authorize → delegate → unwrap → project only |
| STD-005 R14 | [STD-005 § Rule 14](../STD-005-abp-coding-conventions.md#rule-14--typed-abp-exceptions-only-http-status-mapping) | Typed ABP exceptions only; no raw `Exception` / `ApplicationException` |
| STD-005 R15 | [STD-005 § Rule 15](../STD-005-abp-coding-conventions.md#rule-15--authorization-placement-and-grouping) | `[Authorize]` on AppService only; never on Manager |
| STD-005 R16 | [STD-005 § Rule 16](../STD-005-abp-coding-conventions.md#rule-16--soft-delete-data-filter-discipline) | No manual `IsDeleted` predicate in AppService |
| STD-005 R17 | [STD-005 § Rule 17](../STD-005-abp-coding-conventions.md#rule-17--audit-logging-via-abp-audit-module-not-ilogger) | `[Audited]` attribute + `Configure<AbpAuditingOptions>(…)` |
| STD-006 R1 | [STD-006 § Rule 1](../STD-006-logging-conventions.md#rule-1--iloggert-injection-only) | Inject `ILogger<T>` only; no `Serilog.ILogger` or `Log.*` |
| STD-006 R2 | [STD-006 § Rule 2](../STD-006-logging-conventions.md#rule-2--per-layer-log-levels) | `Information` per op; `Warning` for recoverable violations |
| STD-006 R3 | [STD-006 § Rule 3](../STD-006-logging-conventions.md#rule-3--structured-logging-with-named-properties) | Named `{Placeholder}` templates; no `$"…"` or `string.Format` |
| STD-006 R4 | [STD-006 § Rule 4](../STD-006-logging-conventions.md#rule-4--never-log-sensitive-data) | Never log passwords, tokens, OTPs, card numbers |
| STD-006 R5 | [STD-006 § Rule 5](../STD-006-logging-conventions.md#rule-5--correlation-enrichment-via-abp-serilog) | ABP enricher handles correlation/tenant/user; no manual push |
| STD-006 R6 | [STD-006 § Rule 6](../STD-006-logging-conventions.md#rule-6--audit-logging-via-abp-audit-module-not-ilogger) | Audit trails via `IAuditingStore`, not `ILogger` |

## Companion rules in other layers (read only on cross-layer touch)

- STD-002 R1.1 (Domain) — Manager is what AppService delegates to
- STD-002 R2.5 (Application.Contracts) — every input DTO must have a validator at Contracts layer
- STD-005 R15 Contracts half — permission constants are defined in `Application.Contracts/Permissions/`

## Common defects this layer must avoid

- Business logic in AppService — delegate to Manager (STD-005 R11)
- `throw new Exception(...)` or `throw new ApplicationException(...)` (STD-005 R14)
- `[Authorize]` on a Manager-suffixed type (STD-005 R15)
- Manual `_logger.Log*` audit trail — use `IAuditingStore` / `[Audited]` (STD-006 R6)
- `$"…"` string interpolation inside a log call (STD-006 R3)
- `ErrorOr<T>` returned from an `I<Aggregate>AppService` interface method (STD-002 R1.3)
