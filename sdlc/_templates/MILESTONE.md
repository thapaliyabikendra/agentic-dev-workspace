---
id: M-NN
title: <Milestone name>
kind: feature                 # feature | accumulator | refactor | absorption
extends: []                   # other milestone IDs this builds on (optional)
status: planning              # planning | in-progress | done
discovery: discovery/milestone-scope.md
frs: []                       # FRS-NNN IDs, filled iteratively in Phase 1
specs: []                     # FS-NNN IDs, filled in Phase 2
created: YYYY-MM-DD
target_quarter: ""             # YYYY-Qn, e.g. "2026-Q3" (optional; leave "" if not yet known)
---

# M-NN: <Title>

> Portal doc for this milestone folder. The milestone is the planning
> container — authored first (top-down) or retroactively (bottom-up) — and
> holds its discoveries, FRSs, and FSs alongside this file.
>
> File location:
> `docs/milestones/M-NN-<slug>/M-NN-<slug>.md`

## Milestone kind

Milestone kinds (set in `kind:` frontmatter):

- `feature` (default) — coherent feature delivery; validation gate enforces scope coherence.
- `accumulator` — container for small change requests; validation gate **skips** scope-coherence
  check (accumulator milestones are deliberately multi-domain). Close at 8–12 FRSs; open a successor.
- `refactor` — non-feature work driven by code quality / debt reduction.
- `absorption` — legacy doc absorption pass.

## Folder contents

```
M-NN-<slug>/
  M-NN-<slug>.md         # you are here
  id-claims.md           # per-milestone ID reservation ledger (lazy)
  discovery/
    milestone-scope.md   # milestone-level discovery (level: milestone)
    FRS-NNN-<slug>.md    # per-FRS discovery (level: frs), one per FRS
  frs/
    FRS-NNN-<slug>.md    # one per user-journey
  specs/
    FS-NNN-<slug>/
      FS-NNN.md
      nodes/changes/CHG-NNN-<slug>.md  # if FS modifies canonical nodes; milestone-scoped permanent home
      # (new DDD nodes the FS introduces live at docs/nodes/<type>/ directly, status: proposed at Phase 2)
```

## Scope

2–4 sentences. What delivery cluster does this milestone represent — shared
domain, shared workflow, or shared release?

## FRSs in this milestone

> **Deliberate enrichment mirror** — documented exception to
> [`../WORKFLOW.md` → Frontmatter vs body](../WORKFLOW.md#frontmatter-vs-body).
> The frontmatter `frs:` list carries the formal IDs; this body section
> adds one-line titles, groups deferred candidates that don't yet have
> formal IDs, and is the place for sequencing prose. Frontmatter IDs
> and body bullets must agree on formal-ID membership.

One per user-journey. Filled iteratively as Phase 1 progresses.

- FRS-NNN — <one-line title>
- FRS-NNN — <one-line title>
- …

## Feature Specs aggregating these FRSs

> **Deliberate enrichment mirror** — documented exception to
> [`../WORKFLOW.md` → Frontmatter vs body](../WORKFLOW.md#frontmatter-vs-body).
> The frontmatter `specs:` list carries the IDs; this body section adds
> the FRS-coverage grouping (which FRSs each FS aggregates) that
> frontmatter can't express.

Filled at Phase 2. A milestone can produce one FS or several.

- FS-NNN — covers FRS-NNN, FRS-NNN. <one-line>
- FS-NNN — …

## Sequencing notes

Any ordering constraints between the FRSs or FSs (e.g., "FRS-003 depends on
data schema introduced by FRS-001"; "FS-002 must merge before FS-003 starts
Phase 3 because of `depends_on_specs:`")? If none, write "None."

## Out of scope for this milestone

- …
