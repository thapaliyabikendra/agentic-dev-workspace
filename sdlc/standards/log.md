# Standards Log

> Append-only chronological log of engine-level standards lifecycle events.
> Companion to [`index.md`](index.md) — the index is the content-oriented
> catalog; this file is the timeline.
>
> Format, operation vocabulary, and discipline live in
> [`../workflow/maintenance-discipline.md`](../workflow/maintenance-discipline.md).
> The entry prefix is `## [YYYY-MM-DD] <op> | <ID> <title>`. New entries go at
> the **bottom** of the Entries section; the last 5 are visible via
> `grep "^## \[" log.md | tail -5`.

---

## Entries

<!-- Append new entries here. Oldest first; newest at the bottom. -->

## [2026-05-13] created | STD-001 Engine-level DDD constraints

Placeholder. Populate when the first FRS touches the domain layer.

## [2026-05-13] created | STD-002 Engine-level .NET implementation conventions

Placeholder. Populate when the first FRS touches application-layer code.

## [2026-05-13] created | STD-003 Engine-level API design rules

Placeholder. Populate when the first FRS touches an HTTP boundary.

## [2026-05-13] created | STD-004 Engine-level per-node-type contract guarantees

Placeholder. Populate when the first node-type contract needs codification.

## [2026-05-15] updated | Engine — Added PROJECT.md template

Introduced `sdlc/_templates/PROJECT.md` as the canonical project configuration
manifest template. Projects seed `docs/project.md` from this template.
