---
name: plan-fs-authoring
description: "Detail file of plan.md §5 — FS prose authoring: generate-before-converging, ADR/DEC/inline discriminator, section-by-section drafting cadence, implementation-task cohort ordering. Load when authoring FS prose."
applies_when:
  stack: [agnostic]
---

# §5 detail — FS authoring

> Detail file of [`plan.md`](../plan.md) (Phase 2 flow). Load when authoring
> the FS body prose. The core file's HARD-GATEs (no syntax) apply.

The FS answers *how* to implement the user-journeys its FRSs describe. The new canonical
nodes (status: proposed) and the CHG node carry the behavioral content. The FS prose
references nodes by ID — it does not restate their behavior.

What belongs in the FS prose: architecture decisions, data model changes, interface
contracts, ordered tasks, dependencies, edge cases, QA verification checklist.
What does **not** belong: code bodies, implementation file paths, class bodies, behavior
already in a canonical DDD node (link to the canonical node instead). Structural names
(class names, method signatures, table names, route paths) ARE the deliverable.

## Generate before converging

Before settling on an architecture decision, list 2–3 genuinely different approaches
with what each optimizes for and what it gives up. Record under "Alternatives considered"
in the FS (see [`../../_templates/FS.md`](../../_templates/FS.md)).

- **Real alternatives only.** If you can't write a real trade-off, drop it.
- **Skip for obvious / low-stakes calls.** Forced alternatives are procrastination.
- **Lead with your recommendation** and the reasoning behind it.
- **Honor locked decisions.** Dimensions locked in `FS-NNN-CONTEXT.md` are not
  re-litigated. Cite the lock and skip alternatives for that dimension — generate
  alternatives only for dimensions still open.

## Promote to ADR vs file a DEC vs keep inline

Every architecture decision the FS makes faces a three-way fork. Apply the discriminator
on the spot — don't punt it.

- **Promote to ADR-NNN** if the decision constrains how we'd design future features we
  haven't met yet (stack, layering, framework idiom, tooling). Create the ADR via
  [`authoring-adr.md → From an FS`](../authoring-adr.md#three-triggers), add it to the FS's
  `adrs:` frontmatter, and **collapse the FS prose to a reference**.
- **File a DEC-NNN node** if the decision shapes one specific node's behavior. Written
  directly to canonical `docs/<component>/nodes/decisions/DEC-NNN-<slug>.md` with
  `status: proposed`.
- **Keep inline** if the decision is small, scoped to this FS, and not reusable.

The discriminator: *if it'll be referenced by future specs → ADR; if it explains why one
specific node looks the way it does → DEC; otherwise → inline.*

## Section-by-section drafting

Walk the FS template in order — Coverage → New nodes → Change maps → Architecture
decisions → Data model → Interface contracts → Implementation tasks → Dependencies → QA
— and pause for confirmation at **section-group boundaries** (CLAUDE.md HR-ONE-Q):

| Group | Sections |
|---|---|
| 1. Foundation | Coverage + New nodes |
| 2. Design rationale | Change maps + Architecture decisions |
| 3. Structural shapes | Data model + Interface contracts |
| 4. Execution | Implementation tasks + Dependencies + QA |

Ask at most one question per group (3–4 rounds total), wait for the answer, then
proceed through the next group. PRINCIPLES.md "one question per message" doctrine
is preserved — each turn still carries one question; the change is cadence, not
multiplicity. If something stops making sense partway, go back; don't paper over.

## Implementation-task cohort ordering

Group and order Implementation tasks along the architectural cohorts your project's
convention ADRs declare, so each cohort's compilation succeeds before the next starts.
Scan `docs/<component>/adrs/index.md` for the ADR tagged `task-ordering` and consult its
cohort table. Each task references the relevant convention ADR by ID rather than restating
the convention.

> **APP component:** [`ADR-009`](../../../docs/app/adrs/ADR-009-implementation-task-cohort-ordering.md)
> (`task-ordering` tag) — see ADR-009 § Decision for the authoritative cohort
> table (A: Domain + Domain.Shared; B: Application + Application.Contracts;
> C: EntityFrameworkCore; D: HttpApi + HttpApi.Host). Cross-cutting work
> (seed contributors, `en.json`, tests) interleaves per scenario. Other
> components: look up their own `task-ordering`-tagged ADR; if the slot is
> empty, author the ADR before authoring Implementation tasks.

Cross-cutting tasks (test scaffolding, seed data) land at the end as a final cohort or
interleaved per scenario, but never before the cohort they validate compiles.
