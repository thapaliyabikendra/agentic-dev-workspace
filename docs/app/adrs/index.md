# APP ADR Index

> The Karpathy-style index for **APP component architectural decision records**. The only
> ADR file generators wholesale-read. At every phase entry, scan this table to identify
> relevant ADRs, then narrow-load the individual ADR pages declared in the consuming
> artifact's `adrs:` frontmatter.
>
> See [`../../sdlc/workflow/retrieval-discipline.md`](../../sdlc/workflow/retrieval-discipline.md)
> and [`../../sdlc/workflow/authoring-adr.md`](../../sdlc/workflow/authoring-adr.md) (the
> STD / ADR / CCC / DEC discriminator lives there).
>
> One row per ADR. Title is **one line** (≤120 chars) — full rationale belongs in the
> ADR page itself, not here.

---

## Conventions

- **ID** — `ADR-NNN`. Increment from the highest existing ID. Retired IDs are not reused.
- **Status** — `proposed` · `accepted` · `deprecated` · `superseded`.
- **Tags** — free-form, comma-separated; drives index filtering.
- **Stack** — comma-joined from the ADR's `stack:` frontmatter (e.g., `api`, `ui`, `agnostic`).
  Canonical enum in [`../../sdlc/BOUNDARY.md § Stack axis`](../../sdlc/BOUNDARY.md#stack-axis-frontmatter-enum).
- **Source** — comma-join non-null `frs_origin` and `fs_origin` (e.g., `FRS-007`, or
  `FRS-007, FS-012`). Standalone ADR with neither set → `—`.
- **Updated** — the ADR's `updated:` frontmatter date.

---

## Active

| ID | Status | Title (≤120 chars) | Tags | Stack | Source | Updated |
|----|--------|--------------------|------|-------|--------|---------|
| _none yet_ |  |  |  |  |  |  |

---

## Superseded / deprecated

Kept for audit trail. Reference, do not delete — superseding ADRs link back
via `supersedes:` and the originals carry `superseded_by:`.

| ID | Status | Title (≤120 chars) | Tags | Stack | Source | Updated |
|----|--------|--------------------|------|-------|--------|---------|
| _none yet_ |  |  |  |  |  |  |
