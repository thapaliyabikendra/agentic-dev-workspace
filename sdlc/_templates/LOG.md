# <Type> Log

> Append-only chronological log for `docs/<scope>/`. One entry per lifecycle
> event (create, content edit, status change, supersede, deprecate, link).
>
> Format, operation vocabulary, and discipline live in
> [`../workflow/maintenance-discipline.md`](../workflow/maintenance-discipline.md).
> The entry prefix is `## [YYYY-MM-DD] <op> | <ID> <title>`. New entries go at
> the **bottom** of the Entries section; the last 5 are visible via
> `grep "^## \[" log.md | tail -5`.

> **Note (2026-05-16):** Canonical `log.md` was retired on 2026-05-16 for all
> canonical artifacts — nodes, ADRs, and CCCs (see `maintenance-discipline.md`
> → Rule history). This template now applies only to the two surviving log
> surfaces below.

**Replace `<Type>` and `<scope>` above** with the applicable area and folder path:

- **Research** — `docs/research/`
- **Engine-level standards** — `sdlc/standards/`

---

## Entries

<!-- Append new entries here. Oldest first; newest at the bottom. -->
