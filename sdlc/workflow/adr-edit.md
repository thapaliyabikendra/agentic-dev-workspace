---
name: adr-edit
description: "Files to touch on an ADR edit — 2-file touch (ADR file + adrs/index.md). Includes routine and lifecycle transitions; index Status column + git history are the audit trail."
applies_when:
  stack: [agnostic]
---

# Files to touch on an ADR edit

1. **The ADR file itself** — `docs/<component>/adrs/ADR-NNN-<slug>.md`
   (e.g., `docs/<component>/adrs/ADR-001-<slug>.md` — see `docs/project.md § Components`
   for each component's ADR range).
2. **The ADR index** — `docs/<component>/adrs/index.md`. Add the row to
   Active, or move it to Superseded/deprecated on terminal transitions.
   Re-sync the row's Status column on any lifecycle event. Use the ADR
   discriminator in [`authoring-adr.md`](authoring-adr.md) to determine
   whether the ADR belongs to a specific component or `docs/shared/adrs/`.

Lifecycle events (`created`, `status-change`, `superseded`, `deprecated`,
`linked`, `renamed`) are observable in the index row's Status column and in
git history — there is no `adrs/log.md` (see
[`rule-history.md`](rule-history.md) for the retirement date).

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Caller:** [`authoring-adr.md`](authoring-adr.md) — every ADR lifecycle event
fires this 2-file touch.
**Related:** [`cross-type-supersession.md`](cross-type-supersession.md) (ADR ↔ DEC),
[`bidirectional-link.md`](bidirectional-link.md) (ADR `related:` edges),
[`rule-history.md`](rule-history.md) (canonical `log.md` retirement).
