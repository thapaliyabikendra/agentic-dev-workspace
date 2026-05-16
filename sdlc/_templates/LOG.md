# <Type> Log

> Append-only chronological log for `docs/<scope>/`. One entry per lifecycle
> event (create, content edit, status change, supersede, deprecate, link).
>
> Format, operation vocabulary, and discipline live in
> [`../workflow/maintenance-discipline.md`](../workflow/maintenance-discipline.md).
> The entry prefix is `## [YYYY-MM-DD] <op> | <ID> <title>`. New entries go at
> the **bottom** of the Entries section; the last 5 are visible via
> `grep "^## \[" log.md | tail -5`.

> **Note (2026-05-16):** Per-type node `log.md` was dropped on 2026-05-16
> (see `maintenance-discipline.md` → Rule history). This template no longer
> applies to canonical node-type folders (Actors, Entities, Commands, Flows,
> States, Decisions, Integrations, etc.).

**Replace `<Type>` and `<scope>` above** with the applicable area and folder path:

- **ADRs** — component-level: `docs/<component>/adrs/`; cross-component: `docs/shared/adrs/`
- **Research** — `docs/research/`
- **Engine-level standards** — `sdlc/standards/`

---

## Entries

<!-- Append new entries here. Oldest first; newest at the bottom. -->
