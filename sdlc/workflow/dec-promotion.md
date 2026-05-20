---
name: dec-promotion
description: "Promoting an inline DEC to standalone — when an inline DEC trips a standalone-trigger, the procedure that lifts it into its own DEC-NNN file with bidirectional links."
applies_when:
  stack: [agnostic]
---

# Promoting an inline DEC to standalone

When an inline DEC trips a standalone-trigger (see
[`authoring-adr.md → Inline vs standalone DEC`](authoring-adr.md#inline-vs-standalone-dec-sub-discriminator)),
the promotion procedure:

1. **Allocate** the next free `DEC-NNN` ID from
   `docs/<component>/nodes/decisions/index.md` (e.g.,
   `docs/app/nodes/decisions/index.md`).
2. **Create** the standalone file `docs/<component>/nodes/decisions/DEC-NNN-<slug>.md`
   from [`../_templates/nodes/DECISION.md`](../_templates/nodes/DECISION.md).
   Move the inline body content into the new file's body sections. Populate
   `related:` with every node ID the decision shapes.
3. **Fire the 2-file touch** on the standalone DEC: file +
   decisions/index.md (new row, Status = `proposed` or `active` per the
   promoting context). See [`node-edit.md`](node-edit.md).
4. **Replace the inline section** in the host node with a one-line link:
   `> See [DEC-NNN — <title>](../decisions/DEC-NNN-<slug>.md).` The host
   node's own 2-file touch fires (its index.md row's summary may re-sync if
   the inline removal changes the host's one-line description).
5. **Fire bidirectional-link enforcement** for the new standalone DEC's
   `related:` — every target node carries a back-link to the new DEC. See
   [`bidirectional-link.md`](bidirectional-link.md).

Same operation, same commit. Inline → standalone is not a multi-step
spread.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Trigger:** [`authoring-adr.md → Inline vs standalone DEC`](authoring-adr.md#inline-vs-standalone-dec-sub-discriminator).
**Related:** [`node-edit.md`](node-edit.md), [`bidirectional-link.md`](bidirectional-link.md).
