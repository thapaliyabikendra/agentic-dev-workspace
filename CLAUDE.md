# CLAUDE.md — Project Memory

This file is the entry point to project memory — auto-loaded into every
Claude session. It states which rules bind every action regardless of
phase, and points to the canonical home for each procedural detail.

> **Every rule has one canonical home.** CLAUDE.md lists pointers and
> the rules that bind every Claude action regardless of phase. Procedural
> details live in [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md); anti-patterns
> and the "why" live in [`sdlc/PRINCIPLES.md`](sdlc/PRINCIPLES.md). When this file
> and a canonical doc disagree, the canonical doc wins — flag the drift.

> **HARD-GATE:** Do NOT begin a new phase until `## Hard rules` below and
> the relevant flow file have been loaded into this session. Applies
> regardless of perceived context from a prior session.

## Hard rules

- **The DDD knowledge base in `docs/app/nodes/` and `docs/fraud-detection-engine/nodes/` is the source of truth for behavior.**
  If a node and a spec disagree, the node wins or both get reconciled before code is written.
- **Three sources of truth for governance: STD / ADR / DEC.** Engine-level → `sdlc/standards/`;
  component ADRs → `docs/<component>/adrs/` (APP: `docs/app/adrs/`; FDE: `docs/fraud-detection-engine/adrs/`);
  cross-component ADRs → `docs/shared/adrs/`;
  node-local → inline or `docs/<component>/nodes/decisions/`.
  Full discriminator: [`sdlc/workflow/authoring-adr.md`](sdlc/workflow/authoring-adr.md).
- **Reference, never copy.** Specs link to nodes and ADRs by ID; restating lets the two drift silently.
- **Existing nodes are authoritative.** Adapt the template to existing files — do not retrofit.
- **Clear the session at every flow boundary.** Moving design → plan or plan → implementation
  requires `/clear` and reload of the next flow file only. Phases inside one flow can share a session.
- **Every artifact has an ID and links upstream + downstream.** IDs: `ADR-NNN`, `FRS-NNN`,
  `M-NN`, `FS-NNN`, `CHG-NNN`, `TC-NNN`, `OQ-NNN`, node IDs (all `-NNN`). Check per-type
  indexes and `id-claims.md` before incrementing. OQ scoping: [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md).
- **Plans contain no syntax; implementation design IS the plan.** Phase 2 names structures;
  Phase 3 writes them. Method bodies, brace bodies, SQL, YAML in Phase 2 = over the line.
  Node-ingest + CHG rules: [`sdlc/workflow/plan.md`](sdlc/workflow/plan.md).
- **Canonical edits use tiered touch.** Routine = 2-file (artifact + index); lifecycle event
  (`created`, `status-change`, `superseded`, `deprecated`, `linked`) = 3-file (+ log);
  `related:` changes = (3 + N). Procedure: [`sdlc/workflow/maintenance-discipline.md`](sdlc/workflow/maintenance-discipline.md).
- **Read the per-type `index.md` before globbing.** `docs/<component>/nodes/<type>/index.md` lists
  every page with summary, tags, status, source. Glob only when the component or type is unknown.
  For APP nodes: `docs/app/nodes/<type>/index.md`. For FDE nodes: `docs/fraud-detection-engine/nodes/<type>/index.md`.
- **One question per turn during FRS / FS drafting.**
- **TaskCreate mirrors phase task lists; durable status lives in artifacts.** One task = one
  observable outcome. Mark `in_progress` on start, `completed` immediately. Session-scoped only.

## Project framing

**`project_type: brownfield`** — existing system, existing DDD nodes,
legacy absorption in scope. Greenfield variant: omit `## Existing nodes
scanned` in discovery docs and skip Phase 0 legacy-absorption steps.

Brownfield planning workspace. Workflow scaffolding (templates, flow
files, indexes) is in place. The DDD knowledge base is organized into
two components:

- **APP component** ([`docs/app/`](docs/app/)) — .NET/ABP application: commands,
  entities, flows, integrations, states, decisions, and more. ADRs at
  [`docs/app/adrs/`](docs/app/adrs/) (ADR-001..031).
- **FDE component** ([`docs/fraud-detection-engine/`](docs/fraud-detection-engine/)) —
  Kafka/Flink/Druid streaming pipeline. ADRs at
  [`docs/fraud-detection-engine/adrs/`](docs/fraud-detection-engine/adrs/) (ADR-032..037).
- **Shared** ([`docs/shared/`](docs/shared/)) — glossary, cross-cutting-concerns,
  tech-stack, overview reports, and any future cross-component ADRs.

Component descriptors: [`docs/app/COMPONENT.md`](docs/app/COMPONENT.md),
[`docs/fraud-detection-engine/COMPONENT.md`](docs/fraud-detection-engine/COMPONENT.md).
`docs/milestones/` holds planning artifacts for all milestones (currently
M-01 Unified Watchlist and M-02 Fraud Detection Engine).
Application code does not yet exist. See
[`docs/home.md`](docs/home.md) for current artifact counts.

**One human plays all roles** — BA, BEA, Developer, QA — at different
moments. Discipline substitutes for handoff.

## Where to look

Filesystem is the source of truth — `docs/` holds artifacts, `sdlc/`
holds governance. Entry: [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md)
(phases, flows, KB layout). Folder map: [`sdlc/LAYOUT.md`](sdlc/LAYOUT.md).
Engine vs. project boundary: [`sdlc/BOUNDARY.md`](sdlc/BOUNDARY.md).
Principles + anti-patterns: [`sdlc/PRINCIPLES.md`](sdlc/PRINCIPLES.md).
Cross-type status: [`docs/home.md`](docs/home.md). Operation refs
(rule books, maintenance ops, flow files): [`sdlc/workflow/`](sdlc/workflow/).
Templates: [`sdlc/_templates/`](sdlc/_templates/).
Component bootstrap: [`sdlc/workflow/new-component-bootstrap.md`](sdlc/workflow/new-component-bootstrap.md).
Generators wholesale-read per-type indexes (component-qualified — check all relevant components):
- APP ADRs: [`docs/app/adrs/index.md`](docs/app/adrs/index.md)
- FDE ADRs: [`docs/fraud-detection-engine/adrs/index.md`](docs/fraud-detection-engine/adrs/index.md)
- Shared ADRs: [`docs/shared/adrs/index.md`](docs/shared/adrs/index.md)
- Engine standards: [`sdlc/standards/index.md`](sdlc/standards/index.md)
- APP nodes: `docs/app/nodes/<type>/index.md`
- FDE nodes: `docs/fraud-detection-engine/nodes/<type>/index.md`

Multi-repo directory layout, repo registry template, commit rule, and verification checklist: [`sdlc/LAYOUT.md § Multi-Repo Strategy`](sdlc/LAYOUT.md#multi-repo-strategy).

## When to Use (inline subagent dispatch)

Reach for `Agent` (inline subagent dispatch) when work would otherwise
flood the main session with output the human doesn't need. Four shapes:

- **Forked** — one `Agent(subagent_type=Explore, ...)`; read-heavy
  self-contained task (codebase scan, doc dig).
- **Dispatcher** — ≥ 2 `Agent(...)` in one message (parallel); main
  session synthesizes. Right for the Phase 1.5 gate and the Phase 3
  ADR-conformance check.
- **Background** — `Agent(..., run_in_background=true)`; output is a
  write, not a sync reply.
- **Multi-phase** — sequential `Agent(...)` calls; each phase's
  summary feeds the next dispatch.

Don't dispatch for trivial work, for tasks needing user clarification
mid-run, or when the deliverable IS the prose (FRS / FS / OQ authoring
— main session).

Dispatch quality tests (apply before any dispatch):

- **Isolability**: can you write the success criterion before dispatching? If not, keep it in the main session.
- **One concern**: each subagent gets one verb on one scoped set of files. Two verbs = two dispatches.
- **Tool floor**: default to read-only (Read / Grep / Glob). Promote to Edit / Write only when the task explicitly demands a mutation.
- **Parallelism rule**: fan out N subagents in parallel when their work is file-disjoint and order-independent. Serialize when subagents share files or when one output feeds another's input. Gate checks (Phase 1.5 + Phase 3) are the canonical parallel instances.

Full contract: [`sdlc/WORKFLOW.md → Inline dispatch shape for gates`](sdlc/WORKFLOW.md#inline-dispatch-shape-for-gates).

## When in doubt

- Unclear requirement → stop and ask.
- New requirement appears to conflict with an existing node → flag the
  conflict in the FRS's "Brownfield impact" section. Do not silently
  rewrite the node.
- New requirement appears to conflict with an existing ADR → flag the
  conflict in the FRS's "Brownfield impact" section. Do not silently
  rewrite the ADR.
- A Phase 2 architecture decision feels cross-cutting → apply the
  ADR-vs-DEC discriminator. Don't inline a commitment that future
  features will need to consult.
- Multiple valid interpretations → present them, do not pick silently.

*Anti-pattern: "The Helpful Continuation".* Treating remembered context
from a previous session as a substitute for loading the current flow
file. The `/clear` boundary exists precisely because retained context
drifts silently across phases. When in doubt, reload — context that
survives a phase boundary is a bug, not a feature.
