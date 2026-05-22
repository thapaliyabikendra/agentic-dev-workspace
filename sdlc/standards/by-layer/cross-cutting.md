---
name: by-layer-cross-cutting
description: "Cross-cutting rules every Phase 3 layer sub-agent must load alongside its per-layer pointer file."
---

# Layer Pointer — Cross-cutting (all layers)

> Pointer file. Cite by ID — do not restate rules. Every Phase 3
> layer sub-agent loads this file **plus** its own
> `sdlc/standards/by-layer/<layer>.md` per
> `sdlc/workflow/implementation.md § Stage 2 Code — per-layer dispatch`.

## Rules to load

| Rule | Source § heading | One-line rationale |
| ---- | ---------------- | ------------------ |
| STD-005 R6 | [STD-005 § Rule 6](../STD-005-abp-coding-conventions.md#rule-6--property-names-use-pascalcase) | PascalCase on every property, every layer |
| STD-005 R9.1 | [STD-005 § Rule 9.1](../STD-005-abp-coding-conventions.md#91-one-c-type-per-file-file-name-matches-type-name) | One type per file; file name = type name |
| STD-005 R9.2 | [STD-005 § Rule 9.2](../STD-005-abp-coding-conventions.md#92-project-folder-layout--group-by-type-within-each-module) | Canonical folder-slot table for every layer |
| STD-005 R9.3 | [STD-005 § Rule 9.3](../STD-005-abp-coding-conventions.md#93-type-name-suffix-conventions) | Required type-name suffixes (`Manager`, `AppService`, `Dto`, …) |
| STD-005 R9.6 | [STD-005 § Rule 9.6](../STD-005-abp-coding-conventions.md#96-folder-name-vs-namespace) | Folder hierarchy = namespace; drift is a merge-gate defect |

## Common defects (all layers)

- Wrong type-name suffix — breaks DI / endpoint auto-discovery (STD-005 R9.3)
- Folder path diverges from namespace (STD-005 R9.6)
- Multiple public types in one file (STD-005 R9.1)
- `snake_case` or `camelCase` property names (STD-005 R6)
