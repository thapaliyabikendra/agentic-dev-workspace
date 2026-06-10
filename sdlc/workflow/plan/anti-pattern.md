---
name: plan-anti-pattern
description: "Detail file of plan.md — Anti-Pattern: The Obvious Path (full narrative). Load at first-time Phase 2 entry for the doctrinal frame."
applies_when:
  stack: [agnostic]
---

# Anti-Pattern: "The Obvious Path"

> Detail file of [`plan.md`](../plan.md) (Phase 2 flow). Load at first-time
> Phase 2 entry. The core file's HARD-GATEs apply — this is a sub-resource,
> not a standalone flow.

Writing a method body, a SQL statement, a YAML configuration block, or a brace-delimited
code snippet inside the FS or a new node because the implementation looks "obvious" —
already in your head, no point waiting for Phase 3. The validation gate catches it, but
the cheaper fix is not to drift in the first place. Phase 2 names structures (a
`OrderManager` aggregate root with a `Cancel(reason)` method and a `Cancelled` domain
event); Phase 3 writes them (the `{ ... }` body, the `WHERE` clause, the
`appsettings.Production.json` block).

The same drift wears subtler disguises:

- **"Just one config block"** — a YAML payload in the FS "so Phase 3 doesn't
  have to guess." Phase 3 doesn't guess; it reads the structural names and the
  convention STDs.
- **"The SQL is the spec"** — a `WHERE` clause standing in for a QRY node's
  Filter-inputs section. Name the filter inputs; the clause is Phase 3's.
- **"Pre-written for efficiency"** — method bodies drafted in the FS to "save a
  step." They bypass the convention ADR/STD/CCC load that Phase 3's coding
  stage performs, so the saved step is repaid as drift.
