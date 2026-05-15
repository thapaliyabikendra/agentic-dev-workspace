---
name: workflow-index
description: "Single-read routing table for sdlc/workflow/. Read this file first; find your category; drill into exactly one file."
---

# Workflow Index

> Read this file first. Find your category, pick the file, drill in.
> One read here → one targeted read. Do not glob the folder.

---

## Flow files — load at phase entry / `/clear` boundary

| File | One-line summary | When to load |
|------|-----------------|--------------|
| [design.md](design.md) | Design flow — generates milestone container, discoveries, FRSs, runs Phase 1.5 validation gate | Phase 0, 1, 1.5 entry |
| [plan.md](plan.md) | Plan flow — authors Feature Spec, ingests proposed nodes, emits CHG nodes, runs FS validation loop | Phase 2 entry (after `/clear`) |
| [implementation.md](implementation.md) | Merge + Code — applies CHG deltas, flips node statuses, writes production code | Phase 3 entry (after `/clear`) |
| [bug-fix.md](bug-fix.md) | Lightweight defect track — direct fix path or escalation to full FRS | When a defect surfaces |

---

## Operation files — load when a flow explicitly calls for one

| File | One-line summary | When to load |
|------|-----------------|--------------|
| [authoring-adr.md](authoring-adr.md) | Land an ADR — pick artifact type, file it, wire cross-references, run supersession path | Phase 0/1/2 or standalone when an architectural commitment needs recording |
| [maintenance-discipline.md](maintenance-discipline.md) | Tiered-touch rule for every lifecycle event on a canonical node or ADR (2-file routine, 3-file lifecycle, 3+N related) | Any canonical-node or ADR edit |
| [discuss.md](discuss.md) | Pre-plan discussion — captures architectural decisions after Phase 1.5 gate closure; outputs durable files that survive `/clear` | After Phase 1.5 exit, before `/clear` + `plan.md` |
| [in-flight-nodes.md](in-flight-nodes.md) | CHG mechanics, cross-FS dependencies, abandonment procedure for `status: proposed` nodes | Phase 2/3 when authoring or merging an FS that touches canonical nodes |
| [research.md](research.md) | Resolves `blocking-frs` OQs before FRS body sections can be authored | Phase 1 (internal) when ≥1 OQ classified `blocking-frs` |
| [baseline-references.md](baseline-references.md) | Lifecycle ops for `docs/glossary.md` and `docs/cross-cutting-concerns.md` (Add / Change / Retire / Drift detection) | Between Phase 1.5 gates when a baseline term needs updating |
| [absorb-concept.md](absorb-concept.md) | Promotes a concept surfaced during report synthesis to a canonical KB node via RESEARCH staging | When report synthesis surfaces a concept with no canonical node |
| [legacy-absorption.md](legacy-absorption.md) | Ingests a legacy doc from `docs-backup/` into canonical wiki — classifies, routes to nodes/ADRs/glossary, never copies verbatim | Maintenance activity when a legacy artifact needs promotion |
| [lint.md](lint.md) | Debt-scan — detects orphan-node, stale-proposed, baseline-not-cited, stale-version-ref, index-entry-missing | On demand (before milestone close, after long absence, periodic) |
| [review.md](review.md) | Review pass — QA gates, author self-review, ADR-conformance checks; files findings under `design-fit` or `execution-debt` | Phase 3 QA completion; author self-review at Phase 2 close |
| [test-plan-ingest.md](test-plan-ingest.md) | Ingests TC files for every FRS use case; sets `test_plan_path` frontmatter; fills FRS test-plan-view table | Phase 2 (same session as `plan.md`, after FS validation loop passes) |
| [test-suite-codegen.md](test-suite-codegen.md) | Generates Playwright test spec files from TC markdown, one spec per use-case sub-folder | Phase 3 (same session, after Stage 2 Code is complete) |
| [qa-gate.md](qa-gate.md) | QA verification checklist, ADR-conformance check, code-quality gates, FS status flip to `implemented` | Phase 3 (same session, after test suite codegen) |
| [verify.md](verify.md) | Post-implementation UAT — walks FRS acceptance criteria in aggregate, routes gaps, produces durable `UAT.md` record | After Phase 3 QA has passed for every FS in the milestone, before milestone close |

---

## Rule books — wholesale-read at specific gates only

| File | One-line summary | When to load |
|------|-----------------|--------------|
| [retrieval-discipline.md](retrieval-discipline.md) | What to load at each phase entry — the primary token lever | Load when entering any phase or when a retrieval decision is in doubt |
| [frs-validation-rules.md](frs-validation-rules.md) | Phase 1.5 gate — severity tiers (Blocker/Major/Minor), bundling detection, NFR rubric, OQ gate-effect taxonomy | Phase 1.5 (Validation Gate) |
| [frs-code-extraction-rules.md](frs-code-extraction-rules.md) | Mining existing source code for FRS candidates — signal-to-FRS mapping, code-to-business translation, `[inferred from code]` discipline | Phase 0/1 (brownfield path) |
| [coverage-matrix.md](coverage-matrix.md) | TC completeness reference table — per-use-case tables for identifying which TCs apply | Phase 2 test-plan ingest |
| [test-data-generation.md](test-data-generation.md) | Rule book for `## Test Data` sections — placeholder tokens, directive vocabulary, per-field-type generation rules | Phase 2 (TC authoring) and Phase 3 (test suite codegen) |
| [test-runner-cookbook.md](test-runner-cookbook.md) | Converts Phase 2 TC step text into executable Playwright TypeScript — action inference table, selector resolution, spec-file template | Phase 3 (test suite codegen) |
| [agent-contracts.md](agent-contracts.md) | Subagent dispatch return shape (Layer 1) and operation completion markers (Layer 2) | When dispatching subagents or checking completion marker strings |

---

## Utility ops — one-shot milestone lifecycle operations

| File | One-line summary | When to load |
|------|-----------------|--------------|
| [open-milestone.md](open-milestone.md) | Open a new milestone — ID allocation, folder creation, portal doc and state-file initialization, roadmap surfacing | Before entering Phase 0 |
| [close-milestone.md](close-milestone.md) | Close a milestone — pre-condition verification, status flip, state-file finalization, `home.md` update, roadmap regen | After `verify.md` emits `## VERIFICATION PASSED` |
| [phase-state.md](phase-state.md) | Load and update `MILESTONE-STATE.md` — tracks active phase and session continuity across sessions | Entering a new phase, closing a session, or opening a session on an in-flight milestone |
| [regenerate-roadmap.md](regenerate-roadmap.md) | Regenerates `docs/ROADMAP.md` from planning artifacts including five Stuck-class signals | On demand (before stakeholder review, periodic, or when artifacts appear stuck) |
| [new-component-bootstrap.md](new-component-bootstrap.md) | Declare a new component — `id_prefix`, `COMPONENT.md`, per-type index + log seeding, workspace-level registration | Before Phase 2 ingest when an incoming FS introduces a new component |
| [derived-reports.md](derived-reports.md) | Regenerate audience-facing reports under `reports/` — stable names, templates, regeneration prompts | On demand ("regenerate the `<kind>` overview") |
| [evolving-the-workflow.md](evolving-the-workflow.md) | Extend the workflow — add a node type, refine a doc template, or define a new derived-report type | When an in-flight FRS/FS surfaces an artifact shape no existing type covers |
| [vcs-migration.md](vcs-migration.md) | Filesystem-to-issue-tracker mapping table and platform adoption guidance (GitLab/GitHub/ADO/Jira) | Only when planning or executing a VCS platform migration |
