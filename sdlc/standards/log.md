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

## [2026-05-13] created | STD-001 Engine-level DDD constraints (placeholder)

Seeded as part of the `sdlc/standards/` scaffolding adoption — methodology
update predates the MVS refinement that removed `extension-log.md`;
subsequent methodology changes land directly per
[`../workflow/evolving-the-workflow.md`](../workflow/evolving-the-workflow.md).
Body is intentionally empty pending the first FRS that touches the domain layer.
Status: `proposed` — promoted to `accepted` when content lands. Project-specific
DDD shape currently lives in [ADR-003](../../docs/adrs/ADR-003-domain-layer-conventions.md);
the engine-level lift will harvest from that ADR when triggered.

## [2026-05-13] created | STD-002 Engine-level .NET implementation conventions (placeholder)

Seeded. Body empty pending first FRS that touches application-layer code.
Status: `proposed`. Related candidate ADRs for future harvesting:
[ADR-004](../../docs/adrs/ADR-004-application-layer-conventions.md),
[ADR-010](../../docs/adrs/ADR-010-cqrs-without-mediator.md).

## [2026-05-13] created | STD-003 Engine-level API design rules (placeholder)

Seeded. Body empty pending first FRS that touches an HTTP boundary. Status:
`proposed`. Related candidate ADRs: [ADR-020](../../docs/adrs/ADR-020-http-response-envelope-and-pagination-convention.md).

## [2026-05-13] created | STD-004 Engine-level per-node-type contract guarantees (placeholder)

Seeded. Body empty pending codification of the first node-type contract.
Status: `proposed`. Existing node-type templates at
[`../_templates/nodes/`](../_templates/nodes/) carry the de-facto contracts;
this standard will lift the contracts to engine-level prose when triggered.

## [2026-05-15] updated | Engine — Added PROJECT.md template and project.md manifest

Introduced `sdlc/_templates/PROJECT.md` as the canonical template for project
configuration manifests. Projects seed `docs/project.md` from this template.
The manifest consolidates project-specific information
(identity, components, tech stack, cross-cutting constants, Phase A grep terms,
milestones) that was previously scattered across `CLAUDE.md`, `sdlc/LAYOUT.md`,
`sdlc/BOUNDARY.md`, and node templates. No existing files modified.
