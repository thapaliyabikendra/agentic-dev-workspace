---
name: lazy-creation
description: "Lazy creation — docs/<component>/nodes/<type>/ folders and per-type index.md files materialize when the first node of the type lands. ADR / CCC indexes follow the same lazy rule. No companion log.md is created."
applies_when:
  stack: [agnostic]
---

# Lazy creation

`docs/<component>/nodes/<type>/` folders do not exist until the first node of the type
lands. When that happens, the same commit that creates the node also creates
`<type>/index.md` from [`../_templates/INDEX.md`](../_templates/INDEX.md). No
companion `log.md` is created (see [`rule-history.md`](rule-history.md)).

ADR folders (`docs/<component>/adrs/`, `docs/shared/adrs/`) lazy-create
`index.md` on first ADR. No `adrs/log.md` is created.

The CCC folder (`docs/shared/ccc/`) lazy-creates `index.md` on first CCC,
same as ADRs. No `ccc/log.md` is created. Every subsequent CCC-NNN file
is added to the catalog via the 2-file touch (see
[`ccc-edit.md`](ccc-edit.md)).

NDF folders (`docs/<component>/node-definitions/`, `docs/shared/node-definitions/`)
lazy-create `index.md` on first NDF. No `node-definitions/log.md` is created.
See [`ndf-edit.md`](ndf-edit.md).

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Caller:** [`node-edit.md`](node-edit.md), [`adr-edit.md`](adr-edit.md),
[`ccc-edit.md`](ccc-edit.md), [`ndf-edit.md`](ndf-edit.md) — each fires
lazy-create on the first artifact of its kind.
**Related:** [`new-component-bootstrap.md`](new-component-bootstrap.md)
(component-level lazy bootstrap),
[`rule-history.md`](rule-history.md) (canonical `log.md` retired 2026-05-16).
