# LAYOUT.md — Workspace layout

This file is the **canonical folder map** for the workspace — where every
artifact type lives, which folders are lazy, and what the component-vs-shared
split looks like under `docs/`. Consulted whenever a new file's destination
is in question or a new component is being scaffolded.

## When to Use

**Use when:** scaffolding a new component, moving an artifact between
folders, deciding where a new artifact type lives, or auditing the
filesystem before a maintenance op fires.

**Do NOT use when:** drafting a per-phase artifact (load the relevant
`workflow/*.md`), classifying a rule on the engine-vs-project axis (load
[`BOUNDARY.md`](BOUNDARY.md)), or resolving an ID-collision conflict
(load [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md)).

**Vs. sibling files:** [`WORKFLOW.md`](WORKFLOW.md) describes the
*pipeline*; this file describes the *filesystem*; [`BOUNDARY.md`](BOUNDARY.md)
describes the *classification*. Same workspace, three different cross-sections.

---

Target filesystem structure for the planning workspace. Workflow
scaffolding (`WORKFLOW.md`, `PRINCIPLES.md`, `LAYOUT.md`, `BOUNDARY.md`,
`SETUP.md`, `workflow/`, `_templates/`) lives under `/sdlc/`; project
knowledge (`home.md`, `discovery/`, `milestones/`, plus one folder per
component declared in `docs/project.md § Components`) lives under `/docs/`.
Most subfolders under `docs/` are created lazily as the first artifact
of each kind lands. Component structure replaces the prior flat `docs/nodes/`
and `docs/adrs/` trees — see `## Component structure (docs/)` below.

Companion to [`WORKFLOW.md`](WORKFLOW.md) (which carries the phase
flows, cross-cutting practices, and the single-tree DDD discipline with
`status: proposed`/`active` in-flight signalling) and
[`../docs/home.md`](../docs/home.md) (the derived index of every
artifact). When in doubt about where a new file goes, check here first.

```
/                          ← workspace root
  CLAUDE.md                ← session-loaded project memory
  /sdlc                    workflow engine — team-agnostic scaffolding
    WORKFLOW.md            ← workflow index + cross-cutting practices
    PRINCIPLES.md          ← core principles + anti-patterns
    LAYOUT.md              ← this file
    BOUNDARY.md            ← engine vs. project boundary map
    SETUP.md               ← onboarding a new project on the engine
    /workflow              per-flow instructions + operation rule books
      design.md            ← phases 0, 1, 1.5 (generate-frs, Validation/Query)
      plan.md              ← phase 2 (generate-feat-spec, Ingest)
      implementation.md    ← phase 3 (implement-feat, Merge + Code)
                           plus rule books (frs-validation-rules.md,
                           frs-code-extraction-rules.md,
                           frs-prototype-extraction-rules.md,
                           test-data-generation.md,
                           test-runner-cookbook.md) and maintenance-op
                           references (maintenance-discipline.md,
                           baseline-references.md, authoring-adr.md,
                           derived-reports.md, legacy-absorption.md,
                           evolving-the-workflow.md, coverage-matrix.md, bug-fix.md,
                           change-request.md)
    /_templates            scaffolding for new artifacts and nodes
                           includes INDEX.md and LOG.md for per-type pairs;
                           16 node templates (ACTOR, ENTITY, COMMAND, QUERY,
                           FLOW, STATE, DECISION, INTEGRATION + MODULE,
                           SCREEN, CONTRACT, PERMISSION, CHANGE, SERVICE,
                           FUNCTIONAL-AREA, EVENT — SERVICE/FUNCTIONAL-AREA opt-in
                           for multi-service topologies; CONTRACT supersedes
                           the prior ENDPOINT template 2026-05-14);
                           plus OVERVIEW-BUSINESS.md and
                           OVERVIEW-TECHNICAL.md for aggregate-snapshot
                           reports, and PUBLICATION.md for the
                           multi-instance category outputs under
                           docs/reports/{release-notes,articles,api,overviews}/
  /docs                    project knowledge base
    home.md              ← index of ADRs / FRSs / milestones / specs / nodes
    ROADMAP.md           ← tracked planning artifact: milestones in flight,
                           FRSs / FSs in flight, shipped, five stuck-signal classes.
                           Regenerated on demand via regenerate-roadmap.md.
                           Lazy — created on first regenerate.
    (No /docs/glossary.md.)  ← project-owned domain vocabulary lives under
                                /shared/glossary.md
    (No /docs/cross-cutting-concerns.md.) ← NFR baselines live as per-CCC
                                pages under /shared/ccc/ (flat doc retired 2026-05-16)
    (No top-level /adrs/.) ← ADRs live under /<component>/adrs/ per
                              ## Component structure (docs/) below.
    /discovery
      open-questions.md    ← frozen legacy log (pre-2026-05-13 OQs)
      /open-questions      ← per-OQ folder (new OQs land here)
        index.md           ← OQ catalog (Karpathy-style)
        OQ-NNN-*.md        ← individual OQ files
    /change-requests       CR-as-container — standalone change requests (no milestone grouping)
      /CR-NNN-<slug>
        CR-NNN-<slug>.md   ← CR portal doc (template: sdlc/_templates/CR-PORTAL.md)
        id-claims.md       ← per-CR modify-intent + released-claim ledger (lazy; R-NEW-9 amended 2026-05-17)
        /frs
          FRS-NNN-<slug>.md  ← single FRS per CR
        /specs
          /FS-NNN-<slug>
            FS-NNN.md
            /nodes
              /changes           ← CHG-NNN nodes, permanent CR home (never promoted)
                CHG-NNN-<slug>.md
            /test-plans          ← TC files (lazy; created by QA-track flow)
              /<use-case>
                TC-NNN-<slug>.md
    /milestones            milestone-as-container — everything for one milestone
      /M-NN-<slug>
        M-NN-<slug>.md     ← milestone portal doc
        id-claims.md       ← per-milestone modify-intent + released-claim ledger (lazy; R-NEW-9 amended 2026-05-17)
        MILESTONE-STATE.md ← phase tracker (lazy; template: sdlc/_templates/MILESTONE-STATE.md)
        UAT.md             ← post-Phase-3 UAT record (lazy; created by verify.md)
        /discovery
          milestone-scope.md   ← milestone-level (level: milestone)
          FRS-NNN-*.md         ← per-FRS (level: frs), one per FRS
          DISCUSSION-LOG.md    ← pre-planning decision capture (lazy; created by discuss.md)
        /frs
          FRS-NNN-<slug>.md    ← one per user-journey
        /specs
          /FS-NNN-<slug>
            FS-NNN.md
            FS-NNN-CONTEXT.md  ← per-FS agent briefing doc (lazy; created by discuss.md)
            /nodes
              /changes           ← CHG-NNN nodes, permanent milestone home
                CHG-NNN-<slug>.md ← never promoted to canonical
            /test-plans          ← TC files drafted at Phase 2 Test plan ingest
              /<use-case>        ← display | add | edit | delete | toggle | view | ...
                TC-NNN-<slug>.md ← stays milestone-scoped, not promoted
    /nodes                 CANONICAL DDD wiki — see KB-LAYOUT.md for type-folder tree
    /research              external / competitive research (lazy)
                           RESEARCH-NNN-*.md + index.md + log.md;
                           cited by future ADRs and FRSs by ID.
                           Not DDD content — parallel canonical tree
                           to /nodes. Template:
                           sdlc/_templates/RESEARCH.md
    /compliance            project-owned compliance artifacts (lazy)
    /requirements          project-owned upstream requirements (lazy)
  /tests                   Test suite (lazy — bootstrapped by first FS
                           to reach Phase 3 test-suite-codegen.md). Runner
                           config at the root; test specs generated by
                           test-suite-codegen.md from the FS-staged TC files.
                           See workflow/test-runner-cookbook.md for
                           file-naming and layout conventions.
  /reports               wiki-derived views — generated on demand,
                           never hand-edited, no tiered touch (lazy).
                           Two shapes: aggregate snapshots (singleton
                           files, no index pair) and multi-instance
                           category outputs (slug-named publications
                           with a per-category Karpathy index.md, no
                           log.md). Discriminator: singleton vs.
                           multi-instance.
    BUSINESS.md          ← aggregate snapshot — stakeholder business overview
    TECHNICAL.md         ← aggregate snapshot — engineering/architecture overview
                           Note: docs/ROADMAP.md is project state
                           (milestones in-flight, stuck signals) —
                           it stays under /docs, NOT here.
    /release-notes       ← multi-instance category (lazy)
      index.md           ← Karpathy catalog over <release-slug>.md files
      <release-slug>.md  ← one per release
    /articles            ← multi-instance category (lazy)
      index.md
      <topic-slug>.md
    /api                 ← multi-instance category (lazy)
      index.md
      <version-slug>.md
    /overviews           ← multi-instance category (lazy)
      index.md
      <component-or-feature-slug>.md
                           Template: sdlc/_templates/PUBLICATION.md
                           Regeneration: sdlc/workflow/derived-reports.md
```

> **Note on CHGs.** Pre-cutover CHG paths under
> `/milestones/.../specs/FS-NNN-<slug>/nodes/changes/` are grandfathered.
> Current canonical home is `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md`
> (CR track: `change-requests/CR-NNN-<slug>/chg/`). See
> [`KB-LAYOUT.md`](KB-LAYOUT.md) — authoritative.

## Component structure (docs/)

A **component** is a named grouping of KB artifacts corresponding to one independently
deployable unit. Every project declares its components in `docs/<component-slug>/COMPONENT.md`.

Component types:
- **standalone** — a single deployable unit; owns its own `adrs/` + `nodes/` sub-tree
- **shared** — cross-component concerns (glossary, cross-cutting, tech-stack);
  `shared/adrs/` holds only ADRs that span ≥2 components

Projects with a single deployable component may omit the component layer and keep the
flat `docs/nodes/` structure (engine-recommended — see [`BOUNDARY.md`](BOUNDARY.md)).

**Component structure docs/ folder map:**

```
docs/
  home.md                    ← derived project catalog (cross-component)
  milestones/                  ← project-level planning
  discovery/                   ← project-level open questions
  shared/                      ← shared component
    COMPONENT.md
    adrs/                      ← only ADRs spanning ≥2 components; starts empty
    glossary.md
    ccc/                       ← per-CCC NFR baseline files (replaces flat cross-cutting-concerns.md)
      index.md                 ← Karpathy catalog (no log.md — retired 2026-05-16)
      CCC-NNN-*.md             ← individual CCC pages
    tech-stack.md
  <component-slug>/            ← standalone component
    COMPONENT.md               ← declares id_prefix
    adrs/                      ← ADRs whose decisions constrain only this component
    nodes/
      <type>/
        index.md               ← per-type index (component-scoped)
        {PREFIX}-{TYPE}-{NNN}-<slug>.md  ← canonical node files (prefixed IDs)
```

**COMPONENT.md frontmatter:**

```yaml
id: <COMPONENT_SLUG>
title: <Human title>
type: standalone | shared
id_prefix: <PREFIX>          # 2-4 uppercase chars; required for standalone
description: <one line>
depends_on: []               # other component slugs this component references
created: YYYY-MM-DD
```

**ADR discriminator (component vs shared):**
- Component ADR: decision constrains nodes within ONE component only
- Shared ADR: decision constrains interfaces or conventions visible to ≥2 components

Node ID uniqueness is global. `docs/home.md` is the cross-component ID
high-water-mark reference (regenerated on demand from all component indexes).

**Standalone component ID prefix convention.** Every standalone component declares
a 2–4 character uppercase prefix code in its `COMPONENT.md` (`id_prefix: <NEW>`).
All canonical DDD nodes created within that component are named `{PREFIX}-{TYPE}-{NNN}`
starting at 001. The prefix is global — no two components in the same workspace share
a prefix. The `shared/` component and any brownfield-imported legacy component (e.g.,
`app`) are exempt: they retain their original type-only IDs for backward compatibility,
**and may retain a legacy COMPONENT.md body structure** (descriptive sections like
`## Stack` / `## Homes` instead of the canonical `## Role / ## Node inventory /
## Depends on / ## ADRs`). Body-structure migration is optional, not required.
New components created from scratch must always use the prefixed IDs **and** the
canonical body structure from [`_templates/COMPONENT.md`](_templates/COMPONENT.md).

Template: [`_templates/COMPONENT.md`](_templates/COMPONENT.md).
Bootstrap procedure: [`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md).

**Component inventory (this project):** see [`docs/project.md § Components`](../docs/project.md#components).
The table there carries component slugs, types, ID prefixes, titles, and ADR ranges —
the single source of truth for anything downstream that needs to reference concrete component paths.

---

## Multi-Repo Strategy

Projects that separate planning, API, and UI into independent git repositories
follow this layout. Each subdirectory is its own `.git` root with its own remote.
`project.md` lives only in `docs/` (the planning workspace's knowledge base).

### Directory layout

```
<workspace-root>/               ← planning workspace (this repo)
<workspace-root>/docs/          ← docs/wiki repo
<workspace-root>/api/           ← API repo (.NET/ABP or equivalent)
<workspace-root>/ui/            ← frontend repo
```

Each subdirectory has its own `.git`, remote, and CI pipeline.

### Repo registry

The authoritative registry lives in `docs/project.md § Repo layout`. The table
there maps concern → local path → remote URL. Template row:

| Concern | Local path | Remote |
|---|---|---|
| Planning / DDD knowledge base | `<workspace-root>/` | `github.com/<org>/<workspace-repo>` |
| Docs / Wiki | `<workspace-root>/docs/` | `github.com/<org>/<docs-repo>` |
| API | `<workspace-root>/api/` | `github.com/<org>/<api-repo>` |
| UI | `<workspace-root>/ui/` | `github.com/<org>/<ui-repo>` |

Add or remove rows to match the project's actual repo count.

### Commit rule

> Confirm the working directory is the **target repo** before every commit.
> Never commit child-repo changes from within the workspace root.

Each child directory has its own `.git`; git will not traverse upward past a
`.git` boundary, but accidental `git add` from the wrong directory can stage
unintended files. Verify with `git status` before staging.

**Anti-pattern — accidental submodule creation:** Running `git add docs/` (or
any child-repo path) from within `<workspace-root>/` does **not** stage the
files inside `docs/`; it stages a gitlink entry (mode `160000`) that turns
`docs/` into a git submodule pointer. This project does **not** use submodules.
If this happens:

```
# Undo the submodule commit (creates a revert commit)
git revert HEAD --no-edit

# Then commit inside the correct repo
git -C docs/ add -A
git -C docs/ commit -m "<message>"
```

Always use `git -C <child-path>` or open a terminal rooted in the child repo.

### Verification checklist

Run once after initial repository setup:

- [ ] `git status` in each repo is clean after the initial commit
- [ ] `git remote -v` shows a distinct URL per repo
- [ ] A test commit in a child repo does **not** appear in
      `<workspace-root>/` git log
- [ ] Sessions opened in each subdirectory load **only** that repo's
      `CLAUDE.md` (if present); `project.md` is only in `docs/`

---

## Deprecated layout

Top-level `docs/frs/`, `docs/specs/`, and per-feature
`docs/discovery/<scope>.md` no longer exist — everything moves under
`docs/milestones/M-NN-<slug>/`. At the root discovery path two artifacts
remain: `docs/discovery/open-questions.md` (frozen pre-2026-05-13 legacy
log) and `docs/discovery/open-questions/` (per-OQ folder, authoritative
for new OQ-NNN files).

---

## Integration

- **Required before:** [`CLAUDE.md ## Hard rules`](../CLAUDE.md#hard-rules)
  — the hard rules govern where artifacts land and which lifecycle
  events fire when they do.
- **Sibling references:**
  - [`WORKFLOW.md`](WORKFLOW.md) — the phase pipeline; this file's
    folder destinations are where phase outputs land.
  - [`BOUNDARY.md`](BOUNDARY.md) — engine-vs-project axis; component
    structure decisions cite the `Component structure` classification
    there.
- **Routes to (when scaffolding a new component):**
  [`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md)
  — the procedure that creates a component folder per the
  `## Component structure (docs/)` map above.
- **Cited by:**
  - [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md)
    — per-type `index.md` paths under
    `docs/<component>/nodes/<type>/` come from here.
  - [`workflow/plan.md`](workflow/plan.md) — Phase 2 node ingest
    target paths under `docs/<component>/nodes/<type>/`.
  - [`workflow/implementation.md`](workflow/implementation.md) —
    Phase 3 reads canonical from these paths.
