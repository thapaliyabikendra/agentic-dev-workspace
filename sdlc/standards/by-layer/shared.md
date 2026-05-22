---
name: by-layer-shared
description: "Phase 3 narrow-load pointer for the Domain.Shared layer sub-agent (Cohort A)."
---

# Layer Pointer — Domain.Shared (Cohort A)

> Pointer file. Cite by ID — do not restate rules. Loaded by the
> Domain.Shared sub-agent during Phase 3 coding per
> `sdlc/workflow/implementation.md § Stage 2 Code — per-layer dispatch`.
> Also load `sdlc/standards/by-layer/cross-cutting.md`.

## ABP project slot

`<Project>.<Module>.Domain.Shared` per STD-005 R9.2

Key folders:
- `Enums/<Module>/` — C# enum definitions
- `<Module>/Localization/` — `<Module>Keys.cs` (localization-key constants)
- `<Module>/` — `<Module>Consts.cs` (validation / schema numeric constants)

## Rules to load

| Rule | Source § heading | One-line rationale |
| ---- | ---------------- | ------------------ |
| STD-002 R3 | [STD-002 § Rule 3](../STD-002-dotnet-coding-conventions.md#rule-3--localization-key-constants) | `<Module>Keys.cs` — every user-facing key constant |
| STD-005 R7 | [STD-005 § Rule 7](../STD-005-abp-coding-conventions.md#rule-7--bounded-value-fields-are-c-enums) | Enums in `Domain.Shared/Enums/<Module>/` |
| STD-005 R13 | [STD-005 § Rule 13](../STD-005-abp-coding-conventions.md#rule-13--shared-validation--schema-constants-per-module) | `<Module>Consts.cs` — numeric and regex constants |

## Companion rules in other layers (read only on cross-layer touch)

- STD-002 R1.2 (Domain) — ErrorOr codes ARE localization keys (same `<Module>Keys.cs`)
- STD-002 R2.2 (Application.Contracts) — validator `WithMessage` reads `<Module>Keys`
- STD-005 R13 EF half (EntityFrameworkCore) — `HasMaxLength` reads from `<Module>Consts.cs`

## Common defects this layer must avoid

- Inline string literal used as ErrorOr code — use `<Module>Keys.<Member>` constant (STD-002 R3.6)
- Enum stored as integer column — always `HasConversion<string>()` in EF config (STD-005 R7)
- `<Module>Errors.cs` or `<Module>Messages.cs` alongside `<Module>Keys.cs` — single file only (STD-002 R3)
- Localization key value not present in `en.json` — keys and resource file are 1:1 (STD-002 R3.3)
