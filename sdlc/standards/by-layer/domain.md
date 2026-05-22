---
name: by-layer-domain
description: "Phase 3 narrow-load pointer for the Domain layer sub-agent (Cohort A)."
---

# Layer Pointer — Domain (Cohort A)

> Pointer file. Cite by ID — do not restate rules. Loaded by the
> Domain sub-agent during Phase 3 coding per
> `sdlc/workflow/implementation.md § Stage 2 Code — per-layer dispatch`.
> Also load `sdlc/standards/by-layer/cross-cutting.md`.

## ABP project slot

`<Project>.<Module>.Domain` per STD-005 R9.2

Key folders:
- `<Module>/<SubModule>/Entities/` — aggregate roots, child entities, owned types
- `<Module>/<SubModule>/Managers/` — domain services / factories
- `<Module>/<SubModule>/Events/` — domain events
- `<Module>/<SubModule>/Specifications/` — specifications

## Rules to load

| Rule | Source § heading | One-line rationale |
| ---- | ---------------- | ------------------ |
| STD-002 R1.1 | [STD-002 § Rule 1.1](../STD-002-dotnet-coding-conventions.md#11-manager-return-type) | Manager methods return `ErrorOr<T>` |
| STD-002 R1.2 | [STD-002 § Rule 1.2](../STD-002-dotnet-coding-conventions.md#12-semantic-factory-methods) | Use semantic factories (`Error.Conflict`, etc.) |
| STD-002 R2.3 | [STD-002 § Rule 2.3](../STD-002-dotnet-coding-conventions.md#23-cross-field-rules) | Domain-state cross-field rules belong in Manager |
| STD-002 R4 | [STD-002 § Rule 4](../STD-002-dotnet-coding-conventions.md#rule-4--repository-query-discipline-iqueryable--whereif) | `IQueryable` + `WhereIf`; no in-memory filter |
| STD-002 R5 | [STD-002 § Rule 5](../STD-002-dotnet-coding-conventions.md#rule-5--aggregate-root-encapsulation-builder-style-mutation) | Private-write properties; named mutation methods |
| STD-005 R1 | [STD-005 § Rule 1](../STD-005-abp-coding-conventions.md#rule-1--built-in-entity-catalog-is-consulted-before-any-entity-is-synthesised) | Check built-in catalog before synthesising entity |
| STD-005 R2 | [STD-005 § Rule 2](../STD-005-abp-coding-conventions.md#rule-2--every-entity-declares-its-base-class-and-rationale) | Entity base-class selection + rationale |
| STD-005 R5 | [STD-005 § Rule 5](../STD-005-abp-coding-conventions.md#rule-5--companion-entity-pattern-for-project-extensions-to-built-ins) | Companion entity is a regular aggregate root |
| STD-005 R8 | [STD-005 § Rule 8](../STD-005-abp-coding-conventions.md#rule-8--no-data-annotations-on-domain-entities) | No data annotations on domain entities |
| STD-005 R11 | [STD-005 § Rule 11](../STD-005-abp-coding-conventions.md#rule-11--node-body-to-service-layer-mapping) | FLW/QRY/CMD body lives in Manager |
| STD-005 R16 | [STD-005 § Rule 16](../STD-005-abp-coding-conventions.md#rule-16--soft-delete-data-filter-discipline) | No manual `IsDeleted` predicate in Manager |
| STD-006 R2 | [STD-006 § Rule 2](../STD-006-logging-conventions.md#rule-2--per-layer-log-levels) | Domain layer is logger-free; `ILogger<T>` injection is a defect |

## Companion rules in other layers (read only on cross-layer touch)

- STD-002 R1.3 (Application.Contracts) — `ErrorOr<T>` must NOT appear in DTOs / interfaces
- STD-002 R1.4 (Application) — AppService unwraps `ErrorOr<T>` and throws `UserFriendlyException`
- STD-005 R13 (Domain.Shared) — error code keys come from `<Module>Keys.cs`

## Common defects this layer must avoid

- Anemic Manager — AppService carries domain body, not Manager (STD-005 R11)
- Direct property assignment: `entity.Status = value` from Manager — use named mutation (STD-002 R5)
- `_logger` injected into a Manager — Domain is logger-free (STD-006 R2)
- `GetListAsync(predicate)` with in-memory filter / page / sort (STD-002 R4)
- `[Required]` / `[StringLength]` annotation on a domain entity (STD-005 R8)
- `ErrorOr<T>` returned from `GetAsync` / `GetListAsync` without a Manager (STD-002 R1.1)
