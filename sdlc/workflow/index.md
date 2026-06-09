---
name: workflow-index
description: "Single-read routing table for sdlc/workflow/. Read this file first; find your category; drill into exactly one file."
applies_when:
  stack: [agnostic]
---

# Workflow Index

> Read this file first. Find your category, pick the file, drill in.
> One read here → one targeted read. Do not glob the folder.

> **Cross-cutting rules survive `/clear`.**
> [`CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) auto-loads in every
> session, so the advisor() call gate, multi-stage progress-checklist rule,
> and `/clear`-at-flow-boundary rule (including the QA-track per-flow `/clear`)
> are always in force. Flow files below assume those rules; they do not
> re-state them.

---

## Flow files — load at phase entry / `/clear` boundary

| File | One-line summary | When to load |
|------|-----------------|--------------|
| [design.md](design.md) | Design flow — generates milestone container, discoveries, FRSs, runs Phase 1.5 validation gate | Phase 0, 1, 1.5 entry |
| [plan.md](plan.md) | Plan flow — authors Feature Spec, ingests proposed nodes, emits CHG nodes, runs FS validation loop (also known as the `authoring-fs` operation) | Phase 2 entry (after `/clear`) |
| [implementation.md](implementation.md) | Merge + Code — applies CHG deltas, flips node statuses, writes production code | Phase 3 entry (after `/clear`) |
| [bug-fix.md](bug-fix.md) | Lightweight defect track — direct fix path or escalation to full FRS | When a defect surfaces |
| [change-request.md](change-request.md) | CR track — standalone change request; CR portal + single FRS + per-FRS gate (Pass 1 only) + FS + CHG + implementation; no milestone grouping | When a standalone change request doesn't warrant milestone grouping |

---

## QA track flow files — load at QA-track flow entry / `/clear` boundary

The QA track is **trigger-independent** — two flows that consume dev-track outputs on their own cadence (the second flow runs as one session with two stages: codegen-stage + gate-stage). `/clear` boundaries: QA-track entry (into `test-plan-ingest`) and between `test-plan-ingest` ↔ `test-suite-codegen` (entry to the codegen+gate combined flow). `test-suite-codegen` → `qa-gate` is a **stage transition inside one flow** — no `/clear` — per CLAUDE.md Rule 5.

| File | One-line summary | Entry contract |
|------|-----------------|----------------|
| [test-plan-ingest.md](test-plan-ingest.md) | First QA flow — ingests TC files for every FRS use case; sets `test_plan_path` frontmatter (FRS test-plan-view table retired 2026-05-17) | FS validation passed (after `plan.md` exit) |
| [test-suite-codegen.md](test-suite-codegen.md) | Codegen-stage of the combined codegen+gate flow. Generates Playwright test spec files from TC markdown, one spec per use-case sub-folder | TC selectors resolved against real DOM; Stage 2 Code complete (after `implementation.md` exit) |
| [qa-gate.md](qa-gate.md) | Gate-stage of the combined codegen+gate flow — QA verification checklist, ADR-conformance check, code-quality gates, FS status flip to `implemented`. **Shares session with `test-suite-codegen.md`; gate-side verification re-reads FS/FRS/ADRs as if fresh — session-share is for token economy, not skipping checks.** | `test-suite-codegen.md` generation report emitted |

---

## Operation files — load when a flow explicitly calls for one

| File | One-line summary | When to load |
|------|-----------------|--------------|
| [authoring-adr.md](authoring-adr.md) | Land an ADR — pick artifact type, file it, wire cross-references, run supersession path | Phase 0/1/2 or standalone when an architectural commitment needs recording |
| [maintenance-discipline.md](maintenance-discipline.md) | Routing gate for canonical edits — 16-row routing table to sub-op files ([`node-edit.md`](node-edit.md), [`bidirectional-link.md`](bidirectional-link.md), [`phase-15-roundtrip.md`](phase-15-roundtrip.md), [`adr-edit.md`](adr-edit.md), [`ccc-edit.md`](ccc-edit.md), [`ndf-edit.md`](ndf-edit.md), [`dec-promotion.md`](dec-promotion.md), [`cross-type-supersession.md`](cross-type-supersession.md), [`tech-stack-touch.md`](tech-stack-touch.md), [`cross-ref-guard.md`](cross-ref-guard.md), [`operation-vocabulary.md`](operation-vocabulary.md), [`discovery-surface.md`](discovery-surface.md), [`lazy-creation.md`](lazy-creation.md), [`node-versioning.md`](node-versioning.md), [`rule-history.md`](rule-history.md), [`anti-pattern-lightweight.md`](anti-pattern-lightweight.md)). 2-file touch (node, ADR, CCC uniformly); (base+N) for related edges; canonical `log.md` retired 2026-05-16. | Any canonical-node, ADR, CCC, or NDF edit — load the gate first, then the matching sub-op |
| [discuss.md](discuss.md) | Pre-plan discussion — captures architectural decisions after Phase 1.5 gate closure; outputs durable files that survive `/clear` | After Phase 1.5 exit, before `/clear` + `plan.md` |
| [planning-conventions.md](planning-conventions.md) | Multi-phase default + sub-agent dispatch table + 7-principle Karpathy gate for forward-looking plan files (e.g. `.claude/plans/*.md`) | When authoring or reviewing a plan (in plan mode or otherwise) |
| [in-flight-nodes.md](in-flight-nodes.md) | CHG mechanics, cross-FS dependencies, abandonment procedure for `status: proposed` nodes | Phase 2/3 when authoring or merging an FS that touches canonical nodes |
| [research.md](research.md) | Resolves `blocking-frs` OQs before FRS body sections can be authored | Phase 1 (internal) when ≥1 OQ classified `blocking-frs` |
| [baseline-references.md](baseline-references.md) | Lifecycle ops for `docs/shared/glossary.md` and `docs/shared/ccc/` (Add / Change / Retire / Drift detection) | Between Phase 1.5 gates when a baseline term needs updating |
| [absorb-concept.md](absorb-concept.md) | Promotes a concept surfaced during report synthesis to a canonical KB node via RESEARCH staging | When report synthesis surfaces a concept with no canonical node |
| [legacy-absorption.md](legacy-absorption.md) | Ingests a legacy doc from `docs-backup/` into canonical wiki — classifies, routes to nodes/ADRs/glossary, never copies verbatim | Maintenance activity when a legacy artifact needs promotion |
| [lint.md](lint.md) | Debt-scan — detects orphan-node, stale-proposed, baseline-not-cited, stale-version-ref, index-entry-missing | On demand (before milestone close, after long absence, periodic) |
| [review.md](review.md) | Review pass — QA gates, author self-review, ADR-conformance checks; files findings under `design-fit` or `execution-debt` | Phase 3 QA completion; author self-review at Phase 2 close |
| [verify.md](verify.md) | Post-implementation UAT — walks FRS acceptance criteria in aggregate, routes gaps, produces durable `UAT.md` record | After Phase 3 QA has passed for every FS in the milestone, before milestone close |
| [prototype-first.md](prototype-first.md) | Bidirectional prototype-first operation — build a clickable UI prototype then drive FRS authoring + reimplementation; supports prototype→milestone seeding AND milestone/CR→prototype validation | When prototype-first flow is active (either direction) |

---

## Rule books — wholesale-read at specific gates only

| File | One-line summary | When to load |
|------|-----------------|--------------|
| [retrieval-discipline.md](retrieval-discipline.md) | What to load at each phase entry — the primary token lever | Load when entering any phase or when a retrieval decision is in doubt |
| [frs-validation-rules.md](frs-validation-rules.md) | Phase 1.5 gate — severity tiers (Blocker/Major/Minor), bundling detection, NFR rubric, OQ gate-effect taxonomy | Phase 1.5 (Validation Gate) |
| [fs-qa-verification.md](fs-qa-verification.md) | QA-hat sweep checklist run before flipping an FS from `approved` to `implemented` — referenced from the FS template's `## QA verification` section; does NOT replace the qa-gate conformance scans | Phase 3 (before FS `implemented` flip) |
| [grandfather-registry.md](grandfather-registry.md) | All active grandfather clauses in one pointer-style table — cutover date, who is exempt, canonical statement, retirement trigger | Any phase, on encountering a mixed-vintage artifact; whenever a new grandfather clause is added |
| [frs-code-extraction-rules.md](frs-code-extraction-rules.md) | Mining existing source code for FRS candidates — signal-to-FRS mapping, code-to-business translation, `[inferred from code]` discipline | Phase 0/1 (brownfield path); code-sourced is inherently brownfield; prototype-sourced is posture-independent. |
| [frs-prototype-extraction-rules.md](frs-prototype-extraction-rules.md) | Mining a UI prototype for FRS candidates — screen-to-FRS signal mapping, prototype-to-business translation, `[inferred from prototype]` discipline | Phase 0/1 (prototype-sourced path — peer to code-extraction) |
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
| [new-component-bootstrap.md](new-component-bootstrap.md) | Declare a new component — `id_prefix`, `COMPONENT.md`, per-type index seeding, workspace-level registration | Before Phase 2 ingest when an incoming FS introduces a new component |
| [abp-project-bootstrap.md](abp-project-bootstrap.md) | Bootstrap an ABP api/ solution — scaffold via `abp new`, then apply baseline hardening + opt-in feature packs to HttpApi.Host and AuthServer | Standalone — operator-invoked when bringing up a new ABP api project |
| [derived-reports.md](derived-reports.md) | Regenerate audience-facing reports under `docs/reports/` — stable names, templates, regeneration prompts | On demand ("regenerate the `<kind>` overview") |
| [evolving-the-workflow.md](evolving-the-workflow.md) | Extend the workflow — add a node type, refine a doc template, or define a new derived-report type | When an in-flight FRS/FS surfaces an artifact shape no existing type covers |
| [vcs-migration.md](vcs-migration.md) | Filesystem-to-issue-tracker mapping table and platform adoption guidance (GitLab/GitHub/ADO/Jira) | Only when planning or executing a VCS platform migration |
