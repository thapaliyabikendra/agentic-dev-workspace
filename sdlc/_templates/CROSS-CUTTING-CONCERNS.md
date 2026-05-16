# Cross-Cutting Concern (CCC) — Per-CCC Template

> **Type:** Project-owned per-CCC NFR baseline page. One file per concern.
> Seed each new CCC into `docs/shared/ccc/CCC-NNN-<slug>.md`.
> Maintained by the project's curator — see
> [`../workflow/baseline-references.md`](../workflow/baseline-references.md)
> for Add / Change / Retire / Drift procedures.
> **Template path:** `sdlc/_templates/CROSS-CUTTING-CONCERNS.md`
> **Seed path:** `docs/shared/ccc/CCC-NNN-<slug>.md`

---

## Instructions

1. Copy this template to `docs/shared/ccc/CCC-NNN-<slug>.md`, substituting:
   - `CCC-NNN` — next sequential ID from `docs/shared/ccc/index.md`.
   - `<slug>` — lowercase kebab-case of the category name (drop `&` and short connectives).
   - `<Category name>` — human-readable title.
   - `<stack token>` — one of: `api`, `full-stack`, `ui`, `test`, `infra`, `agnostic`.
   - Baseline prose — one short paragraph (≤140 chars) stating the project default.
2. Add a row to `docs/shared/ccc/index.md` (Active table).
3. Append a `created` entry to `docs/shared/ccc/log.md`.

Surface open questions (e.g., "which identity provider?") as `OQ-NNN` under
`docs/discovery/open-questions/` rather than guessing.

---

```markdown
---
id: CCC-NNN
title: <Category name>
status: proposed
created: YYYY-MM-DD
updated: YYYY-MM-DD
stack: [<stack token>]
related: []
supersedes: null
superseded_by: null
source: <origin reference>
---

# CCC-NNN: <Category name>

> Project-wide NFR baseline default. FRSs cite this CCC by ID rather than
> restating its content. An operation that needs to deviate from this
> baseline files the deviation as an ADR back-linked here via
> `related: [CCC-NNN]` in the ADR's frontmatter. Cross-cutting governance
> rule: STD / ADR / CCC / DEC discriminator in
> [`../../../sdlc/workflow/authoring-adr.md`](../../../sdlc/workflow/authoring-adr.md).

## Baseline

<One short paragraph stating the project's default. Keep ≤140 chars total.
The TBD marker remains until fixed by an FRS that surfaces the specific value.>

## Deviation path

Operation-specific deviations are filed as ADRs (component-scoped under
`docs/<component>/adrs/`, or cross-component under `docs/shared/adrs/`).
Each deviation ADR carries `related: [CCC-NNN]` in its frontmatter and a
prose explanation of the override. The CCC baseline stays put; the ADR
captures the override.

## Stack-specific notes

*(Optional. Add when the baseline has UI-side, test-side, or infra-side
constraints distinct from the default stack scope.)*

## Revision history

| Version | Date | Notes |
|---------|------|-------|
| 0.1 | YYYY-MM-DD | <Initial authoring note.> |
```
