---
name: workflow
description: "Phase-pipeline index and cross-cutting practices hub. You MUST load this when entering or transitioning between phases, evaluating a cross-cutting practice, or deciding which flow file to load next."
---

# WORKFLOW.md — Development Workflow

Phase-pipeline index and cross-cutting practices hub. Names the phases, the
three tracks (dev / CR / QA), the operations they fire, and the workspace-wide
retrieval / context-reset / maintenance discipline every flow inherits.
Per-phase procedure lives in [`workflow/`](workflow/); doctrinal *why* lives in
[`PRINCIPLES.md`](PRINCIPLES.md).

<HARD-GATE>
Do NOT begin Phase 2 (Ingest), Phase 3 (Merge + Code), or the QA-track flows `test-plan-ingest.md` / `test-suite-codegen.md` without a `/clear` and a reload of
the next flow file only. `qa-gate.md` is the exception — it shares session with `test-suite-codegen.md` and inherits codegen context (no `/clear` between them per CLAUDE.md Rule 5). Context that survives a *flow boundary* is a bug, not a feature.
Detail at [## Anti-Pattern: "The Informed Skip"](#anti-pattern-the-informed-skip).
(Cross-cutting rules: see [CLAUDE.md ## Hard rules](../CLAUDE.md#hard-rules).)
</HARD-GATE>

---

## Overview

Workflow aligns operations to Karpathy's Ingest/Query pattern with phase-keyed
node births. **FRS flow** (mixed-mode): Queries canonical to validate, Ingests
a Phase-1-born FLW (Trigger + Scenarios) and — when `touches_nodes:` is
non-empty — a Phase-1-born CHG (behavior-language `modifies[]`; one per FRS;
milestone-scoped permanent home). **FS flow**: Ingests structure + wiring —
new ACT (ID claimed at Phase 1 via the FRS's `produced_actor:`; file authored
at Phase 2) + ENT / CMD / STA / CON / INT / DEC / PERM / QRY + any NDF-declared
custom-type nodes per [`STD-007`](standards/STD-007-ndf-governance.md);
enriches the Phase-1-born FLW in place (`related:` wiring + Sequence + Branches
+ Compensating + Postconditions); declares `consumes_chgs:` and enriches each
CHG structurally (before/after on `modifies[]`, `adds[]`, `migration_steps[]`).
**Implementation** applies CHG deltas and flips canonical nodes
`proposed → active` / CHGs `approved → merged`. **CR track**
([`workflow/change-request.md`](workflow/change-request.md)) is a lightweight
single-FRS alternative producing a CR-scoped container. **QA track** runs as
three flows (`test-plan-ingest` → `test-suite-codegen` → `qa-gate`).
`/clear` boundaries: QA-track entry and between `test-plan-ingest` ↔
`test-suite-codegen`; `test-suite-codegen` ↔ `qa-gate` is session-shared
per CLAUDE.md Rule 5.

Three principles run through every phase:

1. **DDD nodes in `docs/<component>/nodes/` are the source of truth for behavior.**
   FRSs declare intent; nodes describe behavior; specs reference nodes; code
   implements. Node ↔ spec conflict → node wins or reconcile both. Proposed
   nodes from in-flight FSs carry `status: proposed`.
2. **ADRs are the source of truth for cross-cutting architectural commitments.**
   Component ADRs at `docs/<component>/adrs/`; cross-component at `docs/shared/adrs/`.
   FRSs and FSs declare `adrs:` consulted.
3. **Reference, never copy.** Specs link to nodes / ADRs by ID. Restating their
   content inline lets the source of truth drift silently.

Templates live in [`_templates/`](_templates/); node templates at
[`_templates/nodes/`](_templates/nodes/).

---

## Anti-Pattern: "The Informed Skip"

Convincing yourself the context reset isn't needed because the current session
has "good context" — usually the validated FRS set is still in view, and a
`/clear` feels wasteful. The reset exists precisely because retained context
drifts silently across phases: Phase 2 needs the FRS as input but not the
validation deliberations; Phase 3 needs the FS as input but not the Phase 2
alternatives. The "good context" you preserve becomes Phase 2's silent
broadening of `touches_nodes` or Phase 3's silent canonical edit. **The rule
is non-skippable, every time.** Detail in
[`CLAUDE.md ## Hard rules`](../CLAUDE.md#hard-rules).

---

## When to Use

**Use when:** entering or transitioning between phases, evaluating a
cross-cutting practice that spans flows, deciding which flow file to load
next, or proposing a new rule that may need to live here vs. in a per-op file.

**Do NOT use when:** drafting a specific phase artifact — consult
[`workflow/index.md`](workflow/index.md) for the right flow / op file.

**Vs. sibling files:** [`CLAUDE.md`](../CLAUDE.md) carries always-on hard
rules; [`PRINCIPLES.md`](PRINCIPLES.md) carries doctrinal *why*; this file
carries phase pipeline + cross-cutting practices.

### Router vs. reader discipline

`WORKFLOW.md` is an **index**, not content. When you need to know which flow
file to load next, read only `## Phase flows` (the tables). The other sections
are on-demand POINTERs — load the canonical op file they point to, not this
section as a substitute.

- Phase entry → read `## Phase flows` table only → load the named flow file.
- Cross-cutting question → follow the POINTER to the canonical op file.
- Full WORKFLOW.md read: warranted only when proposing a new rule that may
  live here vs. in a per-op file.

Process Flow diagram (cross-phase dot graph): on-demand only at
[`WORKFLOW-GRAPH.md`](WORKFLOW-GRAPH.md) — not auto-loaded.

---

## Phase flows

### Dev track flows

| Flow                | File                                                                       | Operation             | Mode                  | Phases covered              |
| ------------------- | -------------------------------------------------------------------------- | --------------------- | --------------------- | --------------------------- |
| Design              | [`workflow/design.md`](workflow/design.md)                                 | `generate-frs`        | Mixed (Query + Ingest) | 0, 1, 1.5                  |
| Pre-plan            | [`workflow/discuss.md`](workflow/discuss.md)                               | `pre-plan-discuss`    | Optional              | Between 1.5 and 2           |
| Plan                | [`workflow/plan.md`](workflow/plan.md)                                     | `generate-feat-spec`  | Ingest                | 2                           |
| Implementation      | [`workflow/implementation.md`](workflow/implementation.md)                 | `implement-feat`      | Merge + Code          | 3                           |

### CR track flow

| Flow                | File                                                                             | Operation          | Mode                   | Phases covered                          |
| ------------------- | -------------------------------------------------------------------------------- | ------------------ | ---------------------- | --------------------------------------- |
| Change Request      | [`workflow/change-request.md`](workflow/change-request.md)                       | `change-request`   | Multi-mode (CR-scoped) | CR-0, CR-1, CR-1.5, CR-2, CR-3          |

CR track is the milestone-free path for isolated change requests. It delegates to `plan.md` (Phase CR-2) and `implementation.md` (Phase CR-3). Escalation criteria are in `change-request.md § Escalation procedure`.

### QA track flows

| Flow                | File                                                                              | Operation             | Mode                    | Entry contract                                                                          |
| ------------------- | --------------------------------------------------------------------------------- | --------------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| Test plan ingest    | [`workflow/test-plan-ingest.md`](workflow/test-plan-ingest.md)                    | `generate-test-plan`  | Ingest (test plan)      | FS validation passed (after `plan.md` exit)                                             |
| Test suite codegen  | [`workflow/test-suite-codegen.md`](workflow/test-suite-codegen.md)                | `generate-test-suite` | Codegen (test suite)    | TC files with resolved selectors; Stage 2 Code complete (after `implementation.md` exit) |
| QA Gate             | [`workflow/qa-gate.md`](workflow/qa-gate.md)                                      | `qa-gate`             | QA + status flip        | Test suite generation report emitted (after `test-suite-codegen.md` exit)               |

Each flow file owns its phase / flow detail, validation checklists, and exit
criteria. **Dev track** flows respect the `/clear` boundaries at Phase 1.5→2
and Phase 2→3. **QA track** `/clear` boundaries: on QA-track entry
(`test-plan-ingest`) and between `test-plan-ingest` ↔ `test-suite-codegen`.
`test-suite-codegen` ↔ `qa-gate` is session-shared (one combined flow, two
stages) — no `/clear` between them. See [CLAUDE.md Rule 5](../CLAUDE.md#hard-rules)
and [`workflow/qa-gate.md`](workflow/qa-gate.md).

**Maintenance operations** sit alongside phase flows but are not tied to
phases: `authoring-adr` ([`workflow/authoring-adr.md`](workflow/authoring-adr.md)),
`absorb-legacy-doc` ([`workflow/legacy-absorption.md`](workflow/legacy-absorption.md)),
`absorb-concept` ([`workflow/absorb-concept.md`](workflow/absorb-concept.md)).
All share the tiered touch discipline from
[`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md).

---

## Validation gates

Each phase ends with a checklist before the next begins. These prevent
compounding error. Phase-specific checklists live in the matching flow file:
Phase 1.5 in [`design.md`](workflow/design.md) +
[`frs-validation-rules.md`](workflow/frs-validation-rules.md); Phase 2 FS
validation in [`plan.md § 6`](workflow/plan.md#6-fs-validation-loop); Phase 3
QA gate in [`qa-gate.md`](workflow/qa-gate.md). Multi-stage plans need a
progress checklist; mark each stage `[x]` before advancing.

**Engine-extension HARD-GATEs (per [STD-007](standards/STD-007-ndf-governance.md)).**
Two top-of-tree HARD-GATEs land here as defense-in-depth summaries; canonical
homes are `workflow/evolving-the-workflow.md` (shape-coverage) and
`workflow/plan.md` (type-validity).

> **HARD-GATE — NDF shape-coverage walk required.** Do NOT coin a new Node
> Definition Node (NDF) until the 60% shape-coverage walk has been run
> against (a) the engine-default 16-type catalog in
> [`KB-LAYOUT.md`](KB-LAYOUT.md) and (b) every existing NDF in the target
> component's `node_definitions:` plus every NDF promoted to
> `docs/shared/node-definitions/`. If any existing type covers ≥60% of the
> new shape, **extend that type** — do not coin. Record the walk in the
> NDF's `shape_coverage_walk:` frontmatter and the prose narrative in
> `## Shape-coverage walk`. (NDF spec:
> [`STD-007`](standards/STD-007-ndf-governance.md);
> engine-evolution 60% gate:
> [`workflow/evolving-the-workflow.md`](workflow/evolving-the-workflow.md).)

> **HARD-GATE — Phase 2 type-validity check.** Do NOT ingest a
> Phase-2-born canonical node whose type abbreviation is in **neither** (a)
> the 15 Phase-2-born canonical types in KB-LAYOUT.md's 16-type catalog
> (ACT / ENT / CMD / QRY / FLW / STA / DEC / INT / MOD / SCR / CON / PERM /
> SVC / FA / EVT — CHG is Phase-1-born and milestone-scoped) **nor** (b) the
> target component's `node_definitions:` frontmatter on its `COMPONENT.md`
> (NDF-declared per
> [`STD-007`](standards/STD-007-ndf-governance.md)). A
> node whose type-abbreviation is unknown to both surfaces is rejected at
> Phase 2 FS validation as a **Blocker**. Pre-existing canonical nodes that
> predate NDF introduction (2026-05-19) carry no `declared_via:` pointer and
> are grandfathered (per STD-007 R8).

---

## The Process (cross-cutting POINTERs)

The cross-cutting practices below have their canonical homes in dedicated
op / rule-book files. The subsections here exist only to preserve anchors
referenced by other files; load the canonical file for actual procedure.

### Reference, never copy

> Specs and node bodies link by ID; they do not paraphrase. See
> [Overview → three principles](#overview) above and [`PRINCIPLES.md`](PRINCIPLES.md).

### Frontmatter vs body

> YAML frontmatter carries machine-readable fields only (IDs, statuses, dates,
> enum values, ID lists). The body carries rationale, behavior, scenarios, and
> prose. Narrative in frontmatter, or a metadata table restating frontmatter
> in the body, is silent drift waiting to happen. See [`PRINCIPLES.md`](PRINCIPLES.md).

### Retrieval discipline

> What to load at each phase entry — milestone `touches_nodes:` / `produces_nodes:`
> + one transitive hop; `adrs/index.md` wholesale; `glossary.md` + `ccc/index.md`
> at Phase 1.5 gate entry; `tech-stack.md` at Phase 3 entry.
> Full procedure: [`workflow/retrieval-discipline.md`](workflow/retrieval-discipline.md).

### Context resets

> Start a fresh conversation between Phase 1.5 → 2 and Phase 2 → 3, and on
> entry to each QA-track flow. Detail at
> [## Anti-Pattern: "The Informed Skip"](#anti-pattern-the-informed-skip).

### Traceability

> Filename ID on every artifact; frontmatter links (`source_ref`,
> `touches_nodes`, `produces_nodes`, `related`, `adrs`, etc.);
> [`docs/home.md`](../docs/home.md) is the cross-type quick-scan; per-type
> [`index.md`](adrs/index.md) carries one row per page (the file generators
> wholesale-read). Surviving `log.md` companions: `docs/research/log.md` and
> `sdlc/standards/log.md` only. Canonical lifecycle events (nodes, ADRs, CCCs)
> audit via index Status column + git history.

### Maintenance discipline

> All canonical edits (node, ADR, CCC): **2-file touch** (artifact + per-type
> `index.md`). Status changes are recorded by re-syncing `index.md` Status.
> Canonical `log.md` retired 2026-05-16.
> Canonical home: [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md).

### Maintaining baseline references (glossary, CCC)

> Project-owned NFR baselines (`docs/shared/glossary.md`, `docs/shared/ccc/` tree).
> Lifecycle ops run between Phase 1.5 gates.
> Full procedures: [`workflow/baseline-references.md`](workflow/baseline-references.md).

### In-flight nodes (`status: proposed`)

> New nodes from in-flight FSs carry `status: proposed`. Phase-1-born FLW +
> CHG; Phase-2-born ACT / ENT / CMD / STA / CON / INT / DEC / PERM / QRY.
> Cross-FS reads via `depends_on_specs:`; Phase 3 enforces merge order.
> Full CHG mechanics, cross-FS dependencies, abandonment procedure:
> [`workflow/in-flight-nodes.md`](workflow/in-flight-nodes.md).

### Brownfield muscle

> When a new requirement appears to break an existing invariant or ADR,
> surface the conflict in the FRS ("Brownfield impact" at Phase 1, or
> "Validation finding" at Phase 1.5) — do not absorb silently in Phase 2/3.
> Cross-node / cross-ADR conflicts found outside an active FRS become OQ-NNN
> files under [`discovery/open-questions/`](../docs/discovery/open-questions/) with
> `origin: legacy-absorption` or `origin: workflow-evolution`. Discovery
> surface discipline: [`workflow/maintenance-discipline.md → Discovery surface discipline`](workflow/maintenance-discipline.md#discovery-surface-discipline).

### Pre-FRS exploration

> Survey vs. Exploration discriminator, shape detection, cross-linking.
> Full procedure: [`workflow/design.md → Pre-FRS artifact types`](workflow/design.md#pre-frs-artifact-types).
> When the input medium is a UI prototype, see [`workflow/prototype-first.md`](workflow/prototype-first.md) for the bidirectional prototype-first operation (prototype→milestone seeding or milestone/CR→prototype validation).

### Bugs

> Bugs use a lightweight track — not a phase. Direct fix or escalate to FRS.
> Full procedure: [`workflow/bug-fix.md`](workflow/bug-fix.md).

### Inline dispatch shape for gates

> Subagent dispatcher preamble, 3-block return contract (≤400 words), mutation
> verification, orchestrator outcome routing.
> Canonical home: [`workflow/agent-contracts.md → Contract Layer 1`](workflow/agent-contracts.md#contract-layer-1--subagent-dispatch-return-shape).

### Execution invocation

> Standard invocation phrase: "execute the plan. use subagents where feasible
> and needed to not pollute the main agent context. `<plan-file-path>`"
> Orchestrator contract: main agent routes + verifies only; file I/O and writes
> dispatched to sub-agents; results summarized ≤400 words before returning to
> orchestrator turn.
> Canonical home: [`workflow/planning-conventions.md § Execution invocation`](workflow/planning-conventions.md#execution-invocation).

### Author self-review

> Four-point checklist (placeholder scan, consistency, scope, ambiguity).
> Inlined at Phase 1 exit ([`workflow/design.md`](workflow/design.md#checklist--phase-1-exit-before-phase-15))
> and Phase 2 exit ([`workflow/plan.md`](workflow/plan.md#6-fs-validation-loop)).

### User-review handoff

> At the end of Phase 1, Phase 2, and Phase 3, pause and surface the artifact:
> *"Phase N output at `<path>`. Review before we move on."* Do not
> `/clear`, do not trigger the next phase, do not mark something `implemented`
> without doing this pass.

### Test artifacts traceability

> FLW→TC→spec chain, TC-file discipline, rule-book timing.
> Full procedure: [`workflow/test-plan-ingest.md → Traceability chain`](workflow/test-plan-ingest.md#traceability-chain).

### Derived reports

> Two output shapes under `docs/reports/`: **aggregate snapshots** —
> singletons (`BUSINESS.md`, `TECHNICAL.md`) — and **multi-instance
> category outputs** — per-instance publications under
> `docs/reports/{release-notes,articles,api,overviews}/`, each with a
> per-category Karpathy `index.md`. All are wiki-derived views; the
> wiki is the source of truth, reports are build artifacts.
> Regenerate on demand; never patch directly. KB absorption when
> synthesis surfaces a concept with no canonical node:
> [`workflow/absorb-concept.md`](workflow/absorb-concept.md).
> Regeneration procedure:
> [`workflow/derived-reports.md`](workflow/derived-reports.md).

### Node content ownership

> Type-hierarchy ownership when two node types share a surface (most commonly
> CON `protocol: events` ↔ INT, or journey-level FLW ↔ per-rule FLW). Canonical
> home: [`KB-LAYOUT.md → Node content ownership`](KB-LAYOUT.md#node-content-ownership).

---

## Change-request routing

When a change request arrives, the milestone choice follows this matrix:

| Situation | Milestone choice |
|---|---|
| Existing milestone in flight AND change is within its scope | **Existing** — add FRS under it |
| Existing milestone in flight AND change extends scope materially | **New milestone**, declare `extends: [M-NN]` |
| Existing milestone shipped AND change refines what it built | **New milestone**, declare `extends: [M-NN]` |
| Change is standalone, isolated, single user-journey AND no related in-flight work | **CR track** ([`workflow/change-request.md`](workflow/change-request.md)) — milestone-free; CR-scoped FRS + FS + CHG |
| Change is small AND no in-flight milestone fits AND several similar small CRs accumulate | **Accumulator milestone** — `kind: accumulator` |
| Change is genuinely new large scope | **New milestone** |
| Change is small AND code-level only (parameter tweak, copy edit, UI nudge) | **Bug-fix path** ([`workflow/bug-fix.md`](workflow/bug-fix.md)) — it's a code change, not a requirements change |

Milestone kinds (`feature` / `accumulator` / `refactor` / `absorption`) and
milestone-side `extends:` frontmatter live in
[`workflow/open-milestone.md`](workflow/open-milestone.md). FRS-side
`escalated_from:` (FRSs born from bug escalation) lives in
[`workflow/bug-fix.md`](workflow/bug-fix.md). CR escalation procedure +
`from_cr:` wiring live in [`workflow/change-request.md`](workflow/change-request.md);
the `from_cr:` field is defined in [`_templates/FRS.md`](_templates/FRS.md).

---

## Knowledge base layout

> DDD content lives at `docs/<component>/nodes/`; CHGs at
> `milestones/M-NN-<slug>/chg/` (or `docs/change-requests/CR-NNN-<slug>/chg/`).
> Full type-folder tree, lazy-creation, discriminators:
> [`KB-LAYOUT.md`](KB-LAYOUT.md). Component bootstrap before Phase 2:
> [`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md).

---

## Authoring an ADR

> ADRs capture workspace-level architectural commitments. Discriminator: ADR
> if it constrains future nodes; DEC if it shapes one specific node.
> Triggers, authoring steps, lifecycle: [`workflow/authoring-adr.md`](workflow/authoring-adr.md).

---

## Legacy absorption

> Operation `absorb-legacy-doc` — ingests a legacy document from `docs-backup/`
> into canonical wiki. Surface conflicts, never absorb. ID collisions resolve
> upward — legacy lands at next free canonical ID.
> Full procedure: [`workflow/legacy-absorption.md`](workflow/legacy-absorption.md).

---

## Evolving the workflow

> Extend before invent: new node types, doc templates, derived-report types.
> Land the extension in the methodology *before* the artifact that motivates it.
> Three forms + per-form procedure: [`workflow/evolving-the-workflow.md`](workflow/evolving-the-workflow.md).

---

## Migration to a VCS / issue-tracking platform

> Filesystem-to-issue-tracker mapping table, deprecated paths, platform
> adoption guidance.
> Full procedure: [`workflow/vcs-migration.md`](workflow/vcs-migration.md).

---

## Integration

**Required before:** [`CLAUDE.md ## Hard rules`](../CLAUDE.md#hard-rules),
[`PRINCIPLES.md`](PRINCIPLES.md) — hard rules bind every action; doctrinal
*why* sits behind every cross-cutting practice cited here.

**Routes to (per phase):**
- Phase 0 / 1 / 1.5 → [`workflow/design.md`](workflow/design.md)
- Phase 2 → [`workflow/plan.md`](workflow/plan.md)
- Phase 3 → [`workflow/implementation.md`](workflow/implementation.md)
- QA track → [`workflow/test-plan-ingest.md`](workflow/test-plan-ingest.md) →
  [`workflow/test-suite-codegen.md`](workflow/test-suite-codegen.md) →
  [`workflow/qa-gate.md`](workflow/qa-gate.md) (`test-plan-ingest` and
  `test-suite-codegen` are independent sessions; `qa-gate` shares
  session with `test-suite-codegen`)
- Bug fix → [`workflow/bug-fix.md`](workflow/bug-fix.md)
- CR track → [`workflow/change-request.md`](workflow/change-request.md)

**Maintenance ops:** [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md),
[`workflow/authoring-adr.md`](workflow/authoring-adr.md),
[`workflow/legacy-absorption.md`](workflow/legacy-absorption.md),
[`workflow/baseline-references.md`](workflow/baseline-references.md),
[`workflow/derived-reports.md`](workflow/derived-reports.md),
[`workflow/evolving-the-workflow.md`](workflow/evolving-the-workflow.md),
[`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md),
[`workflow/abp-project-bootstrap.md`](workflow/abp-project-bootstrap.md),
[`workflow/phase-state.md`](workflow/phase-state.md),
[`workflow/discuss.md`](workflow/discuss.md) (conditional),
[`workflow/verify.md`](workflow/verify.md) (optional at milestone close).

**Rule books wholesale-read at gates / ingests:**
[`workflow/frs-validation-rules.md`](workflow/frs-validation-rules.md),
[`workflow/frs-code-extraction-rules.md`](workflow/frs-code-extraction-rules.md),
[`workflow/frs-prototype-extraction-rules.md`](workflow/frs-prototype-extraction-rules.md),
[`workflow/coverage-matrix.md`](workflow/coverage-matrix.md),
[`workflow/test-data-generation.md`](workflow/test-data-generation.md),
[`workflow/test-runner-cookbook.md`](workflow/test-runner-cookbook.md),
[`workflow/review.md`](workflow/review.md),
[`workflow/lint.md`](workflow/lint.md),
[`workflow/regenerate-roadmap.md`](workflow/regenerate-roadmap.md).

**Sibling reference:** [`BOUNDARY.md`](BOUNDARY.md) — engine-vs-project
classification; [`LAYOUT.md`](LAYOUT.md) — folder map;
[`WORKFLOW-GRAPH.md`](WORKFLOW-GRAPH.md) — cross-phase dot graph (on-demand).
