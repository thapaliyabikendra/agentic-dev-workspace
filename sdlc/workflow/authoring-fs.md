---
name: authoring-fs
description: "Discoverability alias. The Feature Spec authoring procedure lives in plan.md (operation name: generate-feat-spec). This file is a pointer for keyword/glob searches that expect an authoring-fs.md file by analogy with authoring-adr.md."
---

# Authoring a Feature Spec

> **This file is a pointer, not the procedure.**
> The canonical Feature Spec authoring flow is
> [`plan.md`](plan.md) (operation: `generate-feat-spec`).

The name asymmetry exists because the Plan flow predates the
`authoring-<type>.md` naming convention used by `authoring-adr.md`.
Renaming `plan.md` would invalidate ~30 cross-references across the
workflow; this alias preserves discoverability without the churn.

## Where to go next

- **Phase 2 entry / FS authoring procedure:** [`plan.md`](plan.md)
- **FS artifact template:** [`../_templates/FS.md`](../_templates/FS.md)
- **Upstream FRS template:** [`../_templates/FRS.md`](../_templates/FRS.md)
- **In-flight node lifecycle (CHG mechanics):** [`in-flight-nodes.md`](in-flight-nodes.md)
- **Pre-Phase-2 architecture lock-in (optional):** [`discuss.md`](discuss.md)
- **Tiered touch rule book (for the 2-file node touch fired during ingest):** [`maintenance-discipline.md`](maintenance-discipline.md)
- **What to load at Phase 2 entry:** [`retrieval-discipline.md`](retrieval-discipline.md)

## Sibling authoring files

- [`authoring-adr.md`](authoring-adr.md) — ADR authoring + STD/ADR/CCC/DEC discriminator
- [`new-component-bootstrap.md`](new-component-bootstrap.md) — declare a new component before its first node ingest
- [`open-milestone.md`](open-milestone.md) — create the `docs/milestones/M-NN-<slug>/` folder tree before Phase 0
