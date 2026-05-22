---
name: by-layer-contracts
description: "Phase 3 narrow-load pointer for the Application.Contracts layer sub-agent (Cohort B)."
---

# Layer Pointer — Application.Contracts (Cohort B)

> Pointer file. Cite by ID — do not restate rules. Loaded by the
> Application.Contracts sub-agent during Phase 3 coding per
> `sdlc/workflow/implementation.md § Stage 2 Code — per-layer dispatch`.
> Also load `sdlc/standards/by-layer/cross-cutting.md`.

## ABP project slot

`<Project>.<Module>.Application.Contracts` per STD-005 R9.2

Key folders:
- `<Module>/<SubModule>/AppServices/` — `I<AggregateName>AppService.cs` interfaces
- `<Module>/<SubModule>/Dtos/` — all input and output DTOs
- `<Module>/<SubModule>/Validators/` — `<DtoName>Validator.cs` files
- `Permissions/` — `<Module>Permissions.cs` constants + `<Project>PermissionDefinitionProvider`

## Rules to load

| Rule | Source § heading | One-line rationale |
| ---- | ---------------- | ------------------ |
| STD-002 R1.3 | [STD-002 § Rule 1.3](../STD-002-dotnet-coding-conventions.md#13-erroror-boundary--never-past-the-appservice) | `ErrorOr<T>` must NOT appear in DTOs or interfaces |
| STD-002 R2.1 | [STD-002 § Rule 2.1](../STD-002-dotnet-coding-conventions.md#21-validator-type-and-slot) | `AbstractValidator<TDto>` at `Validators/` slot |
| STD-002 R2.2 | [STD-002 § Rule 2.2](../STD-002-dotnet-coding-conventions.md#22-no-magic-numbers-no-inline-messages) | No magic numbers; no inline messages in validators |
| STD-002 R2.4 | [STD-002 § Rule 2.4](../STD-002-dotnet-coding-conventions.md#24-validation-failure-path) | Validator fails → `AbpValidationException` (HTTP 400) |
| STD-002 R2.5 | [STD-002 § Rule 2.5](../STD-002-dotnet-coding-conventions.md#25-mandatory-validator-enforcement) | Every input DTO requires a matching validator file |
| STD-005 R3 | [STD-005 § Rule 3](../STD-005-abp-coding-conventions.md#rule-3--dtos-mirror-the-entitys-audit-level) | Output DTO base class mirrors entity audit level |
| STD-005 R4 | [STD-005 § Rule 4](../STD-005-abp-coding-conventions.md#rule-4--query-inputs-and-outputs-use-the-standard-requestresult-wrappers) | `PagedAndSortedResultRequestDto` / `PagedResultDto<T>` |
| STD-005 R5 | [STD-005 § Rule 5](../STD-005-abp-coding-conventions.md#rule-5--companion-entity-pattern-for-project-extensions-to-built-ins) | Companion entity → companion DTO (same audit level) |
| STD-005 R7 | [STD-005 § Rule 7](../STD-005-abp-coding-conventions.md#rule-7--bounded-value-fields-are-c-enums) | DTO exposes enum directly; nullable `[Required]` for mandatory |
| STD-005 R15 | [STD-005 § Rule 15](../STD-005-abp-coding-conventions.md#rule-15--authorization-placement-and-grouping) | Permission constants + `PermissionDefinitionProvider` slot |

## Companion rules in other layers (read only on cross-layer touch)

- STD-002 R3 (Domain.Shared) — `<Module>Keys.cs` is the source for `WithMessage(...)` keys
- STD-002 R2.3 (Domain) — domain-state cross-field rules belong in Manager, not validator
- STD-005 R15 AppService half (Application) — `[Authorize]` on AppService uses these constants

## Common defects this layer must avoid

- `ErrorOr<T>` leaking into DTO or `I<Aggregate>AppService` interface (STD-002 R1.3)
- Missing validator for an input DTO (`Create…Dto`, `Update…Dto`, etc.) (STD-002 R2.5)
- Magic number inline in validator — read from `<Module>Consts.cs` (STD-002 R2.2)
- Inline string message in `.WithMessage(...)` — read from `_l[<Module>Keys.<Member>]` (STD-002 R2.2)
- Output DTO base class not matching source entity audit level (STD-005 R3)
- Inline string at `[Authorize("...")]` — must reference `<Project>Permissions.<Name>` constant (STD-005 R15)
