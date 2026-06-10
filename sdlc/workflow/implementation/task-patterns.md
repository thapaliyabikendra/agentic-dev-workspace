---
name: implementation-task-patterns
description: "Detail file of implementation.md — the four task-level patterns (needs research / hits a bug / too big / internal service surfaces). Load when a Stage 2 task hits a non-standard situation."
applies_when:
  stack: [agnostic]
---

# Stage 2 detail — task-level patterns

> Detail file of [`implementation.md`](../implementation.md) (Phase 3 flow).
> Load when a task hits a non-standard situation.

Tasks are first-class within an FS (the Implementation tasks section with
cohort ordering). They do **not** have their own node type. Task-level issues
are handled by existing facilities — Exploration for research, bug-fix for
adjacent bugs, FRS escalation for new scope. Four patterns cover the common
cases.

## Pattern 1 — Task needs research

A task requires exploration or option evaluation before it can be executed.

1. Pause the task.
2. Author an Exploration at workspace level (see
   [`../../_templates/EXPLORATION.md`](../../_templates/EXPLORATION.md)).
   If falsifiable, fill `hypothesis:` / `harness:` / `success_criteria:`
   (the shape is detected from `hypothesis:` presence); if
   alternative-evaluation, the body lays out options. Set `tag:` if it
   helps the index — `tag:` is free-form on Exploration.
3. Annotate the FS task: `Blocked on: docs/exploration/EXP-<slug>.md`.
4. Continue non-critical-path tasks, or pause the FS.
5. When the Exploration reaches `status: done`, update the task with
   the chosen direction and resume.

## Pattern 2 — Task encounters a bug

- **Bug in scope** (the task IS fixing this exact thing, or the bug
  blocks intended behavior): fix as part of the task. No separate artifact.
- **Bug adjacent to scope** (encountered while working on something
  else): raise a bug-fix Exploration per [`bug-fix.md`](../bug-fix.md); fix on
  a separate `fix/<slug>` branch; do not drive-by-fix inside the FS branch.

Drive-by refactors of code the FS doesn't require is already an anti-pattern
in [`../../PRINCIPLES.md`](../../PRINCIPLES.md). The same discipline applies to bugs.

## Pattern 3 — Task is too big

- **Same user-journey, deeper than expected:** split into T<N>a /
  T<N>b / T<N>c within the FS. The user-journey decomposition was
  right; task decomposition needs refinement.
- **Genuinely new scope discovered:** pause; raise an OQ; either
  expand the FS (if still one user-journey) or add a new FRS to the
  milestone covering the new scope; revalidate; continue.
- **New internal service / component surfaces:** see Pattern 4.

## Pattern 4 — Task reveals an internal service needing its own design

Discriminator: *would another FS later want to consume this service
directly?*

- **No** — it's an internal implementation detail of this feature.
  Tasks within the current FS. Any research is an Exploration; result
  feeds back to the tasks.
- **Yes** — it's a real deliverable. Pause; raise an OQ; author a new
  FRS (and likely FS) for the service under the same milestone (or a
  new milestone if scope is broader). The original FS declares
  `depends_on_specs: [FS-NNN-new-service]`. Phase 3 enforces merge
  order — the new service merges first.
