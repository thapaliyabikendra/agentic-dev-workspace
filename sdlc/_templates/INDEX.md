# <Type> Index

> Karpathy-style content index for `docs/<scope>/`. One row per page.
> Generators wholesale-read this file when scoping work for the matching
> type; individual node/ADR pages are narrow-loaded from here.
>
> See [`../workflow/maintenance-discipline.md`](../workflow/maintenance-discipline.md)
> and [`../WORKFLOW.md → Retrieval discipline`](../WORKFLOW.md#retrieval-discipline).

**Replace `<Type>` and `<scope>` above** with the actual type (Actors, Entities,
Commands, Flows, States, Decisions, Integrations, ADRs) and folder path
(`nodes/actors/`, `adrs/`, etc.).

---

## Conventions

- **ID** — Type-specific prefix and zero-padded number (`ACT-NNN`, `ENT-NNN`,
  `CMD-NNN`, `FLW-NNN`, `STA-NNN`, `DEC-NNN`, `INT-NNN`, `ADR-NNN`). Increment
  from the highest existing ID of the type. Retired IDs are not reused.
- **Summary** — one line. Full behavior or reasoning lives in the page itself,
  not here.
- **Tags** — free-form, comma-separated. Used for relevance filtering when a
  generator scopes which IDs to narrow-load.
- **Status** — per the lifecycle on the type's template. For DDD nodes:
  `proposed` (Phase 2 ingest — written by an unmerged FS), `active`
  (Phase 3 merge has flipped it from proposed; or brownfield-absorbed
  directly), `superseded` (replaced by another node), `deprecated` (no
  longer authoritative; or the originating FS was abandoned). For ADRs:
  `proposed` / `accepted` / `deprecated` / `superseded`. For CHG nodes
  (milestone-scoped, never canonical): `draft` / `approved` / `merged`.
- **Source** — the FRS, FS, or `standalone` that produced this page. Mirrors
  the page's `source_ref` / `frs_origin` / `fs_origin` frontmatter.

---

## Active

| ID  | Title (one line summary) | Status | Tags | Source |
| --- | ------------------------ | ------ | ---- | ------ |
| _none yet_ |  |  |  |  |

---

## Superseded / deprecated

Kept for audit trail. Superseding pages link back via `supersedes:`; originals
carry `superseded_by:`.

| ID  | Title (one line summary) | Status | Superseded by | Date |
| --- | ------------------------ | ------ | ------------- | ---- |
| _none yet_ |  |  |  |  |
