# <Type> Log

> Append-only chronological log for `docs/<scope>/`. One entry per lifecycle
> event (create, content edit, status change, supersede, deprecate, link).
>
> Format, operation vocabulary, and discipline live in
> [`../workflow/maintenance-discipline.md`](../workflow/maintenance-discipline.md).
> The entry prefix is `## [YYYY-MM-DD] <op> | <ID> <title>`. New entries go at
> the **bottom** of the Entries section; the last 5 are visible via
> `grep "^## \[" log.md | tail -5`.

**Replace `<Type>` and `<scope>` above** with the actual type (Actors, Entities,
Commands, Flows, States, Decisions, Integrations, ADRs) and folder path
(`nodes/actors/`, `adrs/`, etc.).

---

## Entries

<!-- Append new entries here. Oldest first; newest at the bottom. -->
