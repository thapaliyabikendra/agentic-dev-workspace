---
name: design-anti-patterns
description: "Detail file of design.md — Anti-Pattern: The Pre-resolved Gate (full narrative). Load at first-time Phase 1.5 entry for the doctrinal frame."
applies_when:
  stack: [agnostic]
---

# Anti-Pattern: "The Pre-resolved Gate"

> Detail file of [`design.md`](../design.md) (Phase 0/1/1.5 flow). Load at
> first-time Phase 1.5 entry.

Writing `resolution: resolved` (or "addressed in Phase 2") in a finding
row before the resolution has actually landed — because the path forward
looks obvious. Once the row says resolved, the finding falls off the
attention surface, and the obvious-looking fix turns into Phase 2 silent
drift. Findings are resolved when the *artifact* is fixed (FRS revised,
ADR updated, scope retracted) or deferred with an `OQ-NNN` filed — not
when a sentence committing to the fix has been written. If you can't
point at the artifact change that resolved it, the finding is still
open. (Doctrinal anchor: see
[`PRINCIPLES.md` → "Anti-Pattern: Doctrinal Override by Convenience"](../../PRINCIPLES.md#anti-pattern-doctrinal-override-by-convenience).)
