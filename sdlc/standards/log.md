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

## [2026-05-15] created | STD-005 ABP framework coding conventions

Absorbed from `guidelines/abp-guidelines.md`. Covers 9 rules: built-in entity
catalog check (Rule 1), entity base-class declaration with rationale (Rule 2),
DTO audit-level mirroring (Rule 3), query input/output wrappers (Rule 4),
companion entity pattern for ABP built-in extensions (Rule 5), PascalCase
property naming (Rule 6), C# enums for bounded-value fields (Rule 7), no data
annotations on domain entities (Rule 8), and file/folder/type-suffix/DB-object
naming conventions (Rule 9). Status: accepted. Validation hooks fire at Phase
1.5, Phase 2, and Phase 3 merge gate.

## [2026-05-16] rule-history | Engine — Standards now declare `applies_when:` for stack-conditional applicability

Added `applies_when:` block to `_templates/STANDARD.md` and to the standards
`index.md` schema (new `Applies when` column). STD-001..004 backfilled to
`agnostic`; STD-003 narrowed to `api`; STD-005 narrowed to `abp-net`. STD-005's
body prose claim "applies to any .NET project using ABP" was dropped — the
applicability now lives in frontmatter only. Companion change to the
CLAUDE.md Hard rule ("Four governance sources: STD / ADR / CCC / DEC")
and to the 4-way discriminator in
[`../workflow/authoring-adr.md`](../workflow/authoring-adr.md). Rationale: the
prior tension where STD-005 was engine-scoped but ABP-conditional had no
mechanical home; `applies_when:` generalizes to any future conditional engine
standard without forking the scope axis.

## [2026-05-16] rule-history | STD-005 — applies_when reshaped to stack + framework axes

`abp-net` was not in `BOUNDARY.md § Stack axis` (which enumerates functional
roles: `api`, `ui`, `test`, `full-stack`, `infra`, `agnostic`). The shape
`applies_when.stack: [abp-net]` mixed a framework name into the functional-role
enum. Resolved by splitting applicability across two axes:
`applies_when.stack: [api]` (functional role) plus
`applies_when.framework: [abp-net]` (framework binding). Added new `Framework
axis` section to `BOUNDARY.md`; updated `_templates/STANDARD.md` to include the
optional `framework:` line and remove `abp-net` from the stack enum comment;
updated `standards/index.md` Applies-when column description to cover both
axes; updated the worked example in `workflow/authoring-adr.md`. A consuming
artifact intersects on both axes when both are declared.
