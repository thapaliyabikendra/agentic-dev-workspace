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

1. Copy the seed block below to `docs/shared/ccc/CCC-NNN-<slug>.md`, substituting:
   - `CCC-NNN` — next sequential ID from `docs/shared/ccc/index.md`.
   - `<slug>` — lowercase kebab-case of the category name (drop `&` and short connectives).
   - `<Category name>` — human-readable title.
   - `<stack token>` — one of: `api`, `full-stack`, `ui`, `test`, `infra`, `agnostic`.
   - Baseline prose — one short paragraph (≤140 chars) stating the project default.
2. Add a row to `docs/shared/ccc/index.md` (Active table). 2-file touch — no
   `ccc/log.md`; chronological audit is git history (canonical `log.md`
   retired 2026-05-16).

Opt-in sections (add only when populated, not as empty placeholders):

- `## Stack-specific notes` — UI / test / infra constraints distinct from
  the default stack scope.
- `## Revision history` — created on first content edit (per
  [`../workflow/baseline-references.md`](../workflow/baseline-references.md)
  Op 2). The `created` event is auditable via git history of this file
  and its `index.md` row.

Surface open questions (e.g., "which identity provider?") as `OQ-NNN` under
`docs/discovery/open-questions/` rather than guessing.

Governance: STD / ADR / CCC / DEC discriminator in
[`../workflow/authoring-adr.md`](../workflow/authoring-adr.md). FRSs cite the
CCC by ID; deviations file an ADR with `related: [CCC-NNN]` in its frontmatter.

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

## Baseline

<One short paragraph stating the project's default. Keep ≤140 chars total.
The TBD marker remains until fixed by an FRS that surfaces the specific value.>

> Deviation → ADR with `related: [CCC-NNN]`; rule: [`../../../sdlc/workflow/authoring-adr.md`](../../../sdlc/workflow/authoring-adr.md).
```
