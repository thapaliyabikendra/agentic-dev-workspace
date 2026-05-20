---
name: tech-stack-touch
description: "Tech-stack touch at Phase 3 merge — when versions, layout, commands, environments, runtime state, or milestone progress moved, update docs/shared/tech-stack.md in the same merge."
applies_when:
  stack: [agnostic]
---

# Tech-stack touch at merge

[`../../docs/shared/tech-stack.md`](../../docs/shared/tech-stack.md) is the
project's operational baseline (versions, layout, operational commands,
environments, runtime state, milestone progress). It is **not** a canonical
node and does **not** participate in the per-type tiered touch — its update
cadence is coarser and project-level.

At Phase 3 merge, ask:

1. Did this merge change any pinned stack version? (new dependency,
   version bump, removed component)
2. Did this merge add / remove / rename projects in the application
   layout?
3. Did this merge change build / run / test / migrate commands?
4. Did this merge introduce a new environment or change an endpoint?
5. Did this merge land a new database migration (business or workflow
   schema)?
6. Did this merge change the milestone's `FS merged` count or status?
7. Did this merge create a new release tag or change `Current branch`?

If **any** answer is yes, update the affected section of
`docs/shared/tech-stack.md` in the same merge. No per-type index
re-sync — the file is its own source of truth. If every answer is no,
no touch is required; silence is correct.

Decisions about the stack (a new component adopted, an existing
component replaced, an environment topology rethought) still author an
ADR — `docs/shared/tech-stack.md` is updated **after** the ADR lands and
points to it from the affected row.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Caller:** [`node-edit.md`](node-edit.md) — fires alongside the Phase 3 merge
touch when stack state moved.
**Related:** [`adr-edit.md`](adr-edit.md) (stack-changing decisions land an ADR first).
