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

- **The DDD knowledge base in `docs/app/nodes/` is the source of truth for behavior.**
  If a node and a spec disagree, the node wins or both get reconciled before code is written.
- **Three sources of truth for governance: STD / ADR / DEC.** Engine-level → `sdlc/standards/`;
  component ADRs → `docs/<component>/adrs/` (APP: `docs/app/adrs/`);
  cross-component ADRs → `docs/shared/adrs/`;
  node-local → inline or `docs/<component>/nodes/decisions/`.
  Full discriminator: [`sdlc/workflow/authoring-adr.md`](sdlc/workflow/authoring-adr.md).
- **Reference, never copy.** Specs link to nodes and ADRs by ID.
- **Existing nodes are authoritative.** Adapt the template to existing files — do not retrofit.
- **Clear the session at every flow boundary.** Moving design → plan or plan → implementation
  requires `/clear` and reload of the next flow file only. Phases inside one flow can share a session.
- **Every artifact has an ID and links upstream + downstream.** IDs: `ADR-NNN`, `FRS-NNN`,
  `M-NN`, `FS-NNN`, `CHG-NNN`, `TC-NNN`, `OQ-NNN`, node IDs (all `-NNN`). Check per-type
  indexes and `id-claims.md` before incrementing. OQ scoping: [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md).
- **Plans contain no syntax; implementation design IS the plan.** Phase 2 names structures;
  Phase 3 writes them. Node-ingest + CHG rules: [`sdlc/workflow/plan.md`](sdlc/workflow/plan.md).
- **Canonical edits use tiered touch.** Routine = 2-file (artifact + index); lifecycle event
  (`created`, `status-change`, `superseded`, `deprecated`, `linked`) = 3-file (+ log);
  `related:` changes = (3 + N). Procedure: [`sdlc/workflow/maintenance-discipline.md`](sdlc/workflow/maintenance-discipline.md).
- **Read the per-type `index.md` before globbing.** `docs/<component>/nodes/<type>/index.md` lists
  every page with summary, tags, status, source. Glob only when the component or type is unknown.
  For APP nodes: `docs/app/nodes/<type>/index.md`.
- **One question per turn during FRS / FS drafting.**
- **TaskCreate mirrors phase task lists; durable status lives in artifacts.** One task = one
  observable outcome. Mark `in_progress` on start, `completed` immediately. Session-scoped only.
- **For multi-stage plans, open a progress checklist and track each stage.**
  Any plan that spans more than one phase or cohort must begin with a checkbox
  list of all stages; mark each stage `[x]` before advancing to the next.
  Procedure: [`sdlc/WORKFLOW.md § Validation gates`](sdlc/WORKFLOW.md#validation-gates).
- **Never git commit without explicit user authorization.** Do not run `git commit`
  (or any command that commits — e.g., `git commit -am`, `gh pr create`) unless the
  user explicitly says to commit, acknowledges a commit prompt, or a specific workflow
  file in `sdlc/workflow/` contains a directive authorizing commits at that step.
  Authorization for one commit does not carry forward to the next.

## Project framing

**`project_type: brownfield`** — existing system, existing DDD nodes,
legacy absorption in scope. Greenfield variant: omit `## Existing nodes
scanned` in discovery docs and skip Phase 0 legacy-absorption steps.

Brownfield planning workspace. Workflow scaffolding (templates, flow
files, indexes) is in place. The DDD knowledge base is organized into
one component plus a shared area:

- **APP component** ([`docs/app/`](docs/app/)) — .NET/ABP application: commands,
  entities, flows, integrations, states, decisions, and more. ADRs at
  [`docs/app/adrs/`](docs/app/adrs/).
- **Shared** ([`docs/shared/`](docs/shared/)) — glossary, cross-cutting-concerns,
  tech-stack, and any future cross-component ADRs.

Component descriptors: [`docs/app/COMPONENT.md`](docs/app/COMPONENT.md).
`docs/milestones/` holds planning artifacts for all milestones.

**One human plays all roles** — BA, BEA, Developer, QA — at different
moments. Discipline substitutes for handoff.

## Where to look

Filesystem is the source of truth — `docs/` holds artifacts, `sdlc/` holds governance.
Top-level entry points:

- [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md) — phases, flows, cross-cutting practices
- [`sdlc/workflow/index.md`](sdlc/workflow/index.md) — workflow file routing (read before drilling into a specific op)
- [`sdlc/LAYOUT.md`](sdlc/LAYOUT.md) — folder map and multi-repo strategy
- [`sdlc/KB-LAYOUT.md`](sdlc/KB-LAYOUT.md) — DDD KB folder structure and node-type table
- [`docs/home.md`](docs/home.md) — cross-type artifact status counts

Generator indexes (wholesale-read at phase entry — component-qualified; add a row here when running `new-component-bootstrap.md`):
- APP ADRs: [`docs/app/adrs/index.md`](docs/app/adrs/index.md)
- Shared ADRs: [`docs/shared/adrs/index.md`](docs/shared/adrs/index.md)
- Engine standards: [`sdlc/standards/index.md`](sdlc/standards/index.md)
- APP nodes: `docs/app/nodes/<type>/index.md`

## When to Use (inline subagent dispatch)

Subagent dispatch rules, dispatch shapes, quality tests, and the completion-marker contract:
[`sdlc/workflow/agent-contracts.md`](sdlc/workflow/agent-contracts.md).

## Advisor call gate

The `advisor()` tool forwards the full conversation context to a second model.
Cost is proportional to context size.

**Call advisor when:**
- The task is genuinely ambiguous: multiple valid interpretations exist
  and picking the wrong one carries real downstream cost.
- About to commit to a structural change in a shared governance file
  (`CLAUDE.md`, `WORKFLOW.md`, any `index.md`) where a wrong move
  causes workspace-wide drift.
- Stuck after 2+ failed tool approaches with no clear next step.
- Before declaring a phase, milestone, or operation complete.

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

*Named anti-pattern: see [`PRINCIPLES.md → "The Helpful Continuation"`](sdlc/PRINCIPLES.md#anti-patterns-to-refuse).*
