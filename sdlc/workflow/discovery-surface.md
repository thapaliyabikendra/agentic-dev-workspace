---
name: discovery-surface
description: "Discovery surface discipline — lighter touch rules for working notes under docs/discovery/ (OQ / EXP / RESEARCH). 1-file routine, 2-file terminal lifecycle, no log.md, no bidirectional related: enforcement."
applies_when:
  stack: [agnostic]
---

# Discovery surface discipline

The discovery surface (`docs/discovery/`) is working notes, not canonical
wiki. Lighter discipline applies:

- **Routine edit** — **1-file touch** (the discovery artifact only). No index update.
- **Terminal lifecycle event** (`adopted`, `rejected`, `merged`, `done`, `fixed`,
  `escalated`) — **2-file touch** (artifact + `docs/discovery/<type>/index.md` if one
  exists). No `log.md` for the discovery surface — git history + the index's status
  column are the audit trail. (Research is the exception — see
  [`operation-vocabulary.md → Log entry format`](operation-vocabulary.md#log-entry-format) scope.)
- No bidirectional `related:` enforcement on discovery artifacts — loose linking is fine
  for working notes.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Surface:** `docs/discovery/open-questions/`, `docs/discovery/exploration/`,
`docs/discovery/research/`.
**Related:** [`operation-vocabulary.md`](operation-vocabulary.md) (research
log.md uses the standard vocabulary).
