# Agentic Dev Workspace

A governed SDLC planning workspace for software projects. The workspace houses the DDD knowledge base, workflow engine, and all planning artifacts (FRS, Feature Specs, ADRs, milestones, test plans). Application code lives in separate component repos once implementation begins.

## What this workspace is

A **governed planning monorepo** applying structured SDLC discipline — phase boundaries, artifact IDs, and traceability — across the full requirements-to-implementation pipeline. One human (or a small team) wears BA / BEA / Developer / QA hats at different moments; discipline substitutes for handoff.

> **Project configuration:** See `docs/project.md` for the project identity, components, tech stack, and milestone list. Seed it from `sdlc/_templates/PROJECT.md` when starting a new project.

## System overview

| Component | Stack | Purpose |
|---|---|---|
| `<component-slug>` | `<tech stack>` | `<purpose>` |

### Milestones

- **M-01 — `<milestone name>`**: `<scope summary>`

> Fill in the table and milestone list from `docs/project.md` once seeded.

## Folder structure

```
/
  CLAUDE.md                    ← project memory; loaded every session
  README.md                    ← this file
  /.claude/commands            ← slash commands (one per operation; thin wrappers over sdlc/workflow/ flows)
  /sdlc                        ← workflow engine (project-agnostic scaffolding)
    WORKFLOW.md                ← phase pipeline index + cross-cutting practices
    PRINCIPLES.md              ← doctrinal "why" behind every rule
    LAYOUT.md                  ← canonical filesystem map
    BOUNDARY.md                ← engine-vs-project scope boundary
    SETUP.md                   ← onboarding guide
    /workflow                  ← per-flow instruction files + rule books
    /standards                 ← engine-level standards (DDD, API, conventions, nodes)
    /_templates                ← artifact templates (ADR, FRS, FS, TC, …)
  /docs                        ← project knowledge base (created lazily)
    home.md                    ← artifact counts + cross-type status index
    project.md                 ← project configuration manifest
    /<component-slug>          ← per-component DDD nodes + ADRs
    /shared                    ← glossary, cross-cutting concerns, tech stack
    /milestones                ← milestone planning artifacts
```

> `docs/` subfolders are created lazily — only the first artifact of each kind triggers folder creation.

## Workflow phases

The pipeline has five phases across three flows:

| Phase | Name | Flow file |
|---|---|---|
| 0 | Milestone Scoping | `sdlc/workflow/design.md` |
| 1 | FRS Authoring | `sdlc/workflow/design.md` |
| 1.5 | Validation Gate | `sdlc/workflow/design.md` |
| 2 | FS + Node Ingest | `sdlc/workflow/plan.md` |
| 3 | Merge + Code + QA | `sdlc/workflow/implementation.md` |

Two further tracks run alongside the dev track: the **QA track** (`test-plan-ingest.md` → combined `test-suite-codegen.md` + `qa-gate.md`) and the **CR track** (`change-request.md`, milestone-free). Routing for all flows: [`sdlc/workflow/index.md`](sdlc/workflow/index.md).

**Hard gates** (full list in [`CLAUDE.md § Hard rules`](CLAUDE.md)): run `/clear` and reload the next flow file at every *flow* boundary — context that survives a boundary is a bug, not a feature; every FRS / FS must declare `stack:` **and** `framework:` frontmatter (mandatory since 2026-05-22); never commit without explicit per-commit authorization.

**Slash commands**: `.claude/commands/` carries one command per operation. Dev track: `/open-milestone`, `/author-frs`, `/discuss`, `/author-fs`, `/implement-milestone`, `/verify-milestone`, `/close-milestone`, `/resume-milestone`. QA track: `/test-plan`, `/test-suite`. CR / defect: `/change-request`, `/bug-fix`. Maintenance & governance: `/author-adr`, `/research`, `/review`, `/kb-lint`, `/regen-roadmap`, `/derived-report`, `/absorb-concept`, `/absorb-docs`, `/absorb-codebase`, `/new-component`, `/evolve-workflow`. Prototyping & integration: `/create-prototype`, `/review-prototype-merge`, `/api-integration`, `/bootstrap-abp`. Generic tooling: `/plan`, `/execute-plan`, `/review-staged`, `/commit-staged`, `/handoff`. Commands are thin wrappers — if a command and its canonical flow file diverge, the flow file wins.

## Key entry points

| Need | File |
|---|---|
| Start a session | [`CLAUDE.md`](CLAUDE.md) — hard rules and pointers |
| Understand the phase pipeline | [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md) |
| Find a specific artifact | [`docs/home.md`](docs/home.md) — cross-type status index |
| Understand folder layout | [`sdlc/LAYOUT.md`](sdlc/LAYOUT.md) |
| Author or look up an ADR | `docs/<component>/adrs/index.md` |
| Onboard onto the engine | [`sdlc/SETUP.md`](sdlc/SETUP.md) |

## Artifact ID scheme

Every artifact carries a stable ID. Check the relevant `index.md` (canonical types) or the relevant milestone folder glob (CHG: `chg/`; TC: `specs/**/test-plans/**`; ACT Phase-1 claims: cross-FRS `produced_actor:`) before incrementing. `id-claims.md` is the modify-intent + released-claim ledger only (R-NEW-9 amended 2026-05-17).

| Prefix | Type |
|---|---|
| `ADR-NNN` | Architecture Decision Record |
| `FRS-NNN` | Functional Requirements Spec |
| `FS-NNN` | Feature Spec |
| `M-NN` | Milestone |
| `CHG-NNN` | Change node (DDD delta) |
| `TC-NNN` | Test Case |
| `OQ-NNN` | Open Question |

## Status

Application code does not yet exist. The workspace is in the governance-and-planning stage — workflow scaffolding is in place; `docs/` will populate as milestones are drafted.
