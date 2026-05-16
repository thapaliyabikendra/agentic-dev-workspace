# CLAUDE.md — Project memory

Every rule has one canonical home. If this file and a canonical doc
disagree, the canonical doc wins — flag the drift.

## Hard rules

**HARD-GATE:** do not begin a new phase until `## Hard rules` and the
relevant flow file are loaded. Applies across sessions.

**Retrieval discipline** (what to load at each phase entry):
[`sdlc/workflow/retrieval-discipline.md`](sdlc/workflow/retrieval-discipline.md).

1. DDD nodes in `docs/<component>/nodes/` are truth. Node ↔ spec
   conflict → node wins or reconcile both.
2. Four governance sources: STD / ADR / CCC / DEC.
   Discriminator: [`sdlc/workflow/authoring-adr.md`](sdlc/workflow/authoring-adr.md).
   STDs: `sdlc/standards/` (stack-conditional via `applies_when:`).
   CCCs: `docs/shared/ccc/` (NFR baselines; ADRs back-link for deviations).
   Component ADRs: `docs/<component>/adrs/`.
   Cross-component ADRs: `docs/shared/adrs/`.
   Node-local: inline or `docs/<component>/nodes/decisions/`.
3. Reference, never copy. Link by ID.
4. Existing nodes are authoritative — adapt the template, don't retrofit.
5. `/clear` at every flow boundary. Phases inside one flow share a session.
   QA-track flows count as independent boundaries (`test-plan-ingest` →
   `test-suite-codegen` → `qa-gate`; `/clear` between each and on entry
   to each).
6. Every artifact has an ID and links upstream + downstream. IDs:
   `ADR-NNN`, `FRS-NNN`, `M-NN`, `CR-NNN`, `FS-NNN`, `CHG-NNN`, `TC-NNN`,
   `OQ-NNN`, node IDs (all `-NNN`). Check per-type index and
   `id-claims.md` before incrementing. OQ scoping: [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md).
   CR-NNN: standalone change-request container (not a milestone).
   See [`sdlc/workflow/change-request.md`](sdlc/workflow/change-request.md).
7. Plans contain no syntax. Phase 2 names structures; Phase 3 writes
   them. Multi-stage / cross-cohort plans need a progress checklist;
   mark each stage `[x]` before advancing. Cohort definition + node-ingest
   / CHG rules: [`sdlc/workflow/plan.md`](sdlc/workflow/plan.md).
   Progress-checklist procedure: [`sdlc/WORKFLOW.md § Validation gates`](sdlc/WORKFLOW.md#validation-gates).
8. Tiered touch for canonical edits. All canonical artifacts use the
   2-file touch: node / ADR / CCC + per-type `index.md`. `related:`
   changes = base + N. Canonical `log.md` retired 2026-05-16 (covers
   nodes, ADRs, and CCCs) — surviving logs are research and standards.
   See [`sdlc/workflow/maintenance-discipline.md`](sdlc/workflow/maintenance-discipline.md) § Rule history.
9. Read the per-type `index.md` before globbing. Glob only when
   component/type is unknown. Path: `docs/<component>/nodes/<type>/index.md`.
10. One question per turn during FRS / FS drafting.
11. TaskCreate mirrors phase task lists; durable status lives in
    artifacts. One task = one outcome. Mark `in_progress` on start,
    `completed` immediately. Session-scoped only.
12. Never `git commit` (or any commit-equivalent — `git commit -am`,
    `gh pr create`) without explicit user authorization.
    Authorization for one commit does not carry forward to the next.
13. Output style: token-optimized.
    - Compact: no meta-commentary ("I think", "let me…"), no preamble,
      no sign-offs. Status updates between tool calls are one sentence.
    - Structured: tables, bullet lists, code fences, one-line descriptions.
    - Rule-dense: numbered rules or trigger-based anti-pattern tables.
    - Pointer-heavy: replace long explanations with file paths + short
      context notes.
    - Redundancy-free in project-authored content: never restate;
      cross-reference. **Exception:** framework HARD-GATE rules MAY be
      restated across canonical workflow files (CLAUDE.md, WORKFLOW.md,
      flow files, validation checklists) — defense-in-depth against a
      session loading only part of the rule set. Project-authored
      artifacts (FRSs, FSs, nodes, ADRs) hold to strict cross-reference.
    - Lead with the recommendation; rationale only when load-bearing.

## Project framing

`project_type: brownfield`. APP component (`docs/app/`) is a .NET / ABP
application (commands, entities, flows, integrations, states, decisions);
shared area (`docs/shared/`) holds the glossary, tech-stack, cross-component
ADRs, and `ccc/` NFR baselines. One human plays all roles — discipline
substitutes for handoff.

Greenfield variant (`project_type: greenfield`): omit `## Existing nodes
scanned` in discovery docs and skip Phase 0 legacy-absorption steps.

## Index

Framework (always present):
- Phases, flows, validation gates: [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md)
- Workflow file routing: [`sdlc/workflow/index.md`](sdlc/workflow/index.md)
- Folder map / multi-repo: [`sdlc/LAYOUT.md`](sdlc/LAYOUT.md)
- DDD KB layout & node-type table: [`sdlc/KB-LAYOUT.md`](sdlc/KB-LAYOUT.md)
- New component bootstrap (before Phase 2): [`sdlc/workflow/new-component-bootstrap.md`](sdlc/workflow/new-component-bootstrap.md)
- Subagent dispatch & completion markers: [`sdlc/workflow/agent-contracts.md`](sdlc/workflow/agent-contracts.md)
- Engine standards: [`sdlc/standards/index.md`](sdlc/standards/index.md)

Project (created lazily; framework requires the slot):
- Cross-type artifact status: `docs/home.md`
- Component descriptors: `docs/<component>/COMPONENT.md`
- Component ADRs: `docs/<component>/adrs/index.md`
- Cross-component ADRs: `docs/shared/adrs/index.md`
- CCC baselines: [`docs/shared/ccc/index.md`](docs/shared/ccc/index.md)
- Component nodes: `docs/<component>/nodes/<type>/index.md`

## Where to look

- `docs/app/` — APP component (entities, commands, flows, actors, ADRs)
- `docs/shared/` — glossary, CCC baselines, cross-component ADRs, tech-stack
- `docs/milestones/` — milestone portals, FRSs, FSs, CHG nodes, TC files
- `docs/discovery/` — open questions (per-OQ folder)
- `docs/home.md` — cross-component catalog and ID high-water marks

## Advisor gate

`advisor()` forwards full conversation; cost scales with context. Call when:
- Task is genuinely ambiguous and the wrong interpretation is costly.
- About to make a structural change in a shared governance file.
- Stuck after 2+ failed approaches.
- Before declaring a phase / milestone / operation complete.

## When in doubt

- Unclear requirement → stop and ask.
- Conflict with existing node or ADR → flag in FRS "Brownfield impact",
  do not silently rewrite.
- Cross-cutting Phase 2 decision → apply STD/ADR/CCC/DEC discriminator.
- Multiple valid interpretations → present, do not pick silently.

Named anti-pattern: see [`sdlc/PRINCIPLES.md`](sdlc/PRINCIPLES.md#anti-patterns-to-refuse) → "The Helpful Continuation".
