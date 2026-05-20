---
name: anti-pattern-lightweight
description: "Anti-Pattern: 'The Lightweight Shortcut' — firing the artifact edit but skipping the index.md re-sync or reciprocal related: back-link. The cost: silent corpus drift. Plus the canonical Process Flow diagram for the 2-file + (base+N) touch."
applies_when:
  stack: [agnostic]
---

# Anti-Pattern: "The Lightweight Shortcut"

Firing the artifact edit but skipping the `index.md` re-sync, or the
reciprocal `related:` back-link on a target — because the edit is small, the
operation already feels long, or "the next session will catch it".
The cost: the index goes stale; cross-type retrieval (`Read the per-type
index.md before globbing`, from
[`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)) returns
the wrong view of canonical; future readers consume the index summary
and write derivative artifacts against the wrong shape. **Half-fired
events are how the corpus drifts silently.** Doctrinal anchor:
[`../PRINCIPLES.md`](../PRINCIPLES.md) — *Silent node or ADR edits* and
*If it can drift, the operation isn't atomic enough.*

## Process Flow

```dot
digraph maintenance_touch {
    rankdir=TB;
    node [fontname="Helvetica"];

    event     [shape=oval,    label="Canonical edit pending\n(node, ADR, or CCC)"];
    base      [shape=box,     label="2-file touch:\nartifact + per-type index.md\n(status flips recorded\nin index row;\ngit history is the\nchronological audit)"];
    related   [shape=diamond, label="related: edges\nadded / removed?"];
    plusN     [shape=box,     label="(base + N) expansion:\nfor each target ID,\nfire its own 2-file touch"];
    gate      [shape=diamond, label="Post-op grep:\nback-links present\non every target?"];
    incomp    [shape=box,     label="Incomplete — fix in\nsame operation"];

    done      [shape=doublecircle, label="Edit closed\n(atomic, audited)"];

    event -> base;
    base -> related;
    related -> plusN [label="yes"];
    related -> done  [label="no"];
    plusN -> gate;
    gate -> done     [label="all back-links present"];
    gate -> incomp   [label="missing"];
    incomp -> plusN  [label="repair"];
}
```

All canonical artifacts fire the same **2-file touch** (artifact + per-type
`index.md`). The single remaining diamond — the **related-edge diamond** —
classifies the cross-reference delta and decides whether N reciprocal touches
are owed via the `(base + N)` expansion.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Doctrinal anchor:** [`../PRINCIPLES.md`](../PRINCIPLES.md) — *Silent node
or ADR edits* and *If it can drift, the operation isn't atomic enough*.
**Related:** [`node-edit.md`](node-edit.md), [`bidirectional-link.md`](bidirectional-link.md).
