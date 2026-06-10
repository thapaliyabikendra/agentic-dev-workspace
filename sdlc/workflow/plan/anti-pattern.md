---
name: plan-anti-pattern
description: "Detail file of plan.md — Anti-Patterns: The Obvious Path + Too Simple to Need a Spec (full narratives). Load at first-time Phase 2 entry for the doctrinal frame."
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

# Anti-Pattern: "Too Simple to Need a Spec"

Skipping the FS because the work feels small — a one-entity CRUD slice, a
field addition, a toggle. The cost: simple work is where unexamined
assumptions cause the most wasted effort; with no FS there is no declared
node set, no CHG consumption, no validation gate, and the change lands as
silent drift the next FS trips over. **Write the short FS anyway.** A
narrow slice produces a narrow FS — a screenful of Coverage + tasks — and
the discipline (declared sets, proposed-node ingest, QA traceability) is
exactly what keeps small work cheap. If the work is genuinely below the
FS line, it is a bug fix ([`../bug-fix.md`](../bug-fix.md)) — that track
exists so "too simple" has an honest home, not an exemption.
