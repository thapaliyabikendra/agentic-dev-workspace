---
name: cross-type-supersession
description: "Cross-type supersession (ADR ↔ DEC) — when a DEC is promoted to an ADR (or demoted) because the original classification was wrong from the start. Each side fires its own 2-file touch."
applies_when:
  stack: [agnostic]
---

# Cross-type supersession (ADR ↔ DEC)

When a DEC is promoted to an ADR (or, rarely, an ADR is demoted to a
DEC) because the original classification was wrong from the start, the
supersession spans two type folders. Each side fires its own 2-file touch:

- The ADR side: ADR file + `docs/<component>/adrs/index.md` (new row in
  Active, body of the ADR names the superseded DEC).
- The DEC side: DEC file + `docs/<component>/nodes/decisions/index.md` (move
  row from Active to Superseded/deprecated, Status column flips to
  `superseded`).

Frontmatter wiring is the same as same-type supersession: the new
artifact's `supersedes:` holds the old ID; the old artifact's
`superseded_by:` holds the new ID. The fields accept either prefix.
See [`authoring-adr.md → Cross-type supersession`](authoring-adr.md#cross-type-supersession-adr-supersedes-dec-or-vice-versa)
for the editorial procedure. The cross-type audit trail is the two index
rows + git history. Precedent: ADR-029 supersedes DEC-009 (2026-05-13).

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Caller:** [`authoring-adr.md`](authoring-adr.md) — editorial procedure.
**Related:** [`adr-edit.md`](adr-edit.md), [`node-edit.md`](node-edit.md)
(DEC is a canonical node type).
