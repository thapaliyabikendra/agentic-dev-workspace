# CLAUDE.md — Project memory

Every rule has one canonical home. If this file and a canonical doc
disagree, the canonical doc wins — flag the drift.

## Hard rules

<!-- 2026-06-10: numbered rules converted to stable named IDs (HG-* gates,
HR-* rules); legacy "Rule N" = list order below. Scoped gates and
phase-scoped detail collapsed to pointers — full wording lives only in the
named canonical file. -->

**HG-LOAD:** do not begin a new phase until `## Hard rules` and the
relevant flow file are loaded. Applies across sessions.

**HG-DRIFT:** do not change a doctrinal rule in
[`sdlc/PRINCIPLES.md`](sdlc/PRINCIPLES.md) without atomically checking
that the procedural rule in `sdlc/WORKFLOW.md` or `sdlc/workflow/<op>.md`
does not contradict it. Doctrinal–procedural drift is silent corruption.

Scoped HARD-GATEs — trigger → canonical rule book:

- **HG-COMP-BOOT** — node ingest into a component path without
  `COMPONENT.md` + `id_prefix:` →
  [`sdlc/workflow/new-component-bootstrap.md`](sdlc/workflow/new-component-bootstrap.md)
  runs first.
- **HG-BASE-FREEZE** — glossary / `docs/shared/ccc/` Add / Change / Retire
  while a Phase 1.5 gate is active →
  [`sdlc/workflow/baseline-references.md`](sdlc/workflow/baseline-references.md).
- **HG-FRONT** — `framework:` (symmetric with `stack:`) mandatory in every
  FRS / FS frontmatter; Phase 1.5 Blocker →
  [`sdlc/BOUNDARY.md § Framework axis`](sdlc/BOUNDARY.md#framework-axis-frontmatter-enum)
  + [`sdlc/workflow/frs-validation-rules.md`](sdlc/workflow/frs-validation-rules.md);
  grandfathering:
  [`sdlc/workflow/grandfather-registry.md`](sdlc/workflow/grandfather-registry.md).

**Retrieval discipline** (what to load at each phase entry):
[`sdlc/workflow/retrieval-discipline.md`](sdlc/workflow/retrieval-discipline.md).

- **HR-TRUTH** — DDD nodes in `docs/<component>/nodes/` are truth; on
  node ↔ spec conflict, node wins or reconcile both.
- **HR-GOV** — five governance sources: **STD** (`sdlc/standards/`),
  **ADR** (`docs/<component>/adrs/`, `docs/shared/adrs/`),
  **CCC** (`docs/shared/ccc/`, NFR baselines; ADRs back-link for
  deviations), **NDF** (`docs/<component>/node-definitions/`,
  [`sdlc/standards/STD-007`](sdlc/standards/STD-007-ndf-governance.md)),
  **DEC** (inline or `docs/<component>/nodes/decisions/`).
  Discriminator:
  [`sdlc/workflow/authoring-adr.md`](sdlc/workflow/authoring-adr.md).
- **HR-REF** — reference, never copy. Link by ID.
- **HR-NODE-AUTH** — existing nodes are authoritative — adapt the
  template, don't retrofit. Detail:
  [`sdlc/workflow/plan/new-node-ingest.md`](sdlc/workflow/plan/new-node-ingest.md).
- **HR-CLEAR** — `/clear` at every flow boundary; phases / stages inside
  one flow share a session. QA-track flow/stage map (which boundaries are
  flow-level):
  [`sdlc/workflow/retrieval-discipline.md § QA-track retrieval`](sdlc/workflow/retrieval-discipline.md#qa-track-retrieval).
- **HR-ID** — every artifact has an ID and links upstream + downstream.
  Prefixes: `ADR-NNN`, `FRS-NNN`, `M-NN`, `CR-NNN`, `FS-NNN`, `CHG-NNN`,
  `TC-NNN`, `OQ-NNN`, node IDs (all `-NNN`). Ceiling sources + the
  `id-claims.md` ledger semantics:
  [`sdlc/workflow/plan.md § 2 ID-claim protocol`](sdlc/workflow/plan.md#2-id-claim-protocol).
  OQ scoping: [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md). CR-NNN container:
  [`sdlc/workflow/change-request.md`](sdlc/workflow/change-request.md).
- **HR-PLAN** — plans contain no syntax: Phase 1 names journeys, Phase 2
  names structures, Phase 3 writes them. Multi-stage plans need a
  progress checklist; mark each stage `[x]` before advancing.
  Phase-birth schedule + full procedure:
  [`sdlc/workflow/plan.md`](sdlc/workflow/plan.md). Progress-checklist
  procedure:
  [`sdlc/WORKFLOW.md § Validation gates`](sdlc/WORKFLOW.md#validation-gates).
  Plan structure conventions:
  [`sdlc/workflow/planning-conventions.md`](sdlc/workflow/planning-conventions.md).
- **HR-TIERED** — tiered touch for canonical edits (artifact + per-type
  `index.md`; base + N when `related:` changes; canonical `log.md`
  retired 2026-05-16) →
  [`sdlc/workflow/maintenance-discipline.md`](sdlc/workflow/maintenance-discipline.md).
- **HR-INDEX** — read the per-type `index.md` before globbing
  (`docs/<component>/nodes/<type>/index.md`). Glob only when component
  / type is unknown.
- **HR-ONE-Q** — one question per turn during FRS / FS drafting. FS
  section-group cadence:
  [`sdlc/workflow/plan/fs-authoring.md`](sdlc/workflow/plan/fs-authoring.md).
- **HR-COMMIT** — never `git commit` (or any commit-equivalent —
  `git commit -am`, `gh pr create`) without explicit user authorization.
  Authorization for one commit does not carry forward to the next.
- **HR-STYLE** — output style: token-optimized — compact, structured,
  rule-dense, pointer-heavy, redundancy-free; lead with the
  recommendation. **Exception** to redundancy-free: framework HARD-GATE
  rules MAY be restated across canonical workflow files (CLAUDE.md,
  WORKFLOW.md, flow files, validation checklists) for defense-in-depth;
  project-authored artifacts (FRSs, FSs, nodes, ADRs) hold to strict
  cross-reference.

## Project framing

`project_type: brownfield`. APP component (`docs/app/`) is a .NET / ABP
application (commands, entities, flows, integrations, states, decisions);
shared area (`docs/shared/`) holds the glossary, tech-stack, cross-component
ADRs, and `ccc/` NFR baselines. One human plays all roles — discipline
substitutes for handoff.

Greenfield variant (`project_type: greenfield`): omit `## Existing nodes
scanned` in discovery docs and skip Phase 0 legacy-absorption steps.

## Index

**Framework:**
- Phases / flows / gates: [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md)
- Workflow file routing: [`sdlc/workflow/index.md`](sdlc/workflow/index.md)
- Folder map / multi-repo: [`sdlc/LAYOUT.md`](sdlc/LAYOUT.md)
- KB layout + node-type table: [`sdlc/KB-LAYOUT.md`](sdlc/KB-LAYOUT.md)
- New component bootstrap (before Phase 2):
  [`sdlc/workflow/new-component-bootstrap.md`](sdlc/workflow/new-component-bootstrap.md)
- Subagent dispatch / completion markers:
  [`sdlc/workflow/agent-contracts.md`](sdlc/workflow/agent-contracts.md)
- TaskCreate discipline (session task tracker):
  [`sdlc/workflow/agent-contracts.md § TaskCreate discipline`](sdlc/workflow/agent-contracts.md#taskcreate-discipline)
- Engine standards: [`sdlc/standards/index.md`](sdlc/standards/index.md)

### Project KB

Lazy-created slots: `docs/<component>/COMPONENT.md` (descriptor + `id_prefix:`),
per-type `nodes/<type>/index.md`, `adrs/index.md` (+ `docs/shared/adrs/`),
[`docs/shared/ccc/index.md`](docs/shared/ccc/index.md). Bootstrap:
[`sdlc/workflow/new-component-bootstrap.md`](sdlc/workflow/new-component-bootstrap.md).

## Where to look

- `docs/app/` — APP component (entities, commands, flows, actors, ADRs)
- `docs/shared/` — glossary, CCC baselines, cross-component ADRs, tech-stack
- `docs/milestones/` — milestone portals, FRSs, FSs, CHG nodes, TC files
- `docs/discovery/` — open questions (per-OQ folder)
- `docs/prototypes/` — UI prototype dispositions (`PROTO-<slug>`); catalog + descriptors, Phase-0/1 input artifacts
- `docs/home.md` — cross-component catalog and ID high-water marks
- `docs/reports/` — wiki-derived views (lazy): aggregate snapshots
  (`BUSINESS.md`, `TECHNICAL.md`) and multi-instance category
  outputs (`release-notes/`, `articles/`, `api/`, `overviews/` — each
  with a per-category `index.md`). Procedure:
  [`sdlc/workflow/derived-reports.md`](sdlc/workflow/derived-reports.md).

## Advisor gate

`advisor()` forwards full conversation; cost scales with context. Call when:
- Task is genuinely ambiguous and the wrong interpretation is costly.
- About to make a structural change in a shared governance file.
- Stuck after 2+ failed approaches.
- Before declaring a phase / milestone / operation complete.

## Session handover

**Trigger:** user types
"create a handover prompt so that I can continue in next session"
(close paraphrases accepted — "handover prompt please", etc.).

Emit a single fenced code block — paste-ready, no prose before or
after. The block contains five fields:

1. **Task** — one sentence: what we're working on.
2. **Progress** — bullets: what's done this session (files created
   or edited, decisions reached, commands run that matter).
3. **Next step** — the exact first action for the new session.
4. **Re-load first** — ordered list of files to read at the start
   of the new session.
5. **Open threads** — unresolved questions, blocked work,
   disagreements; empty bullet if none.

Output ONLY the code block — the user copies it into a new Claude
Code session as the first prompt.

## When in doubt

- Unclear requirement → stop and ask.
- Conflict with existing node or ADR → flag in FRS "Brownfield impact",
  do not silently rewrite.
- Cross-cutting Phase 2 decision → apply STD/ADR/CCC/DEC discriminator.
- Multiple valid interpretations → present, do not pick silently.

Named anti-pattern: see [`sdlc/PRINCIPLES.md`](sdlc/PRINCIPLES.md#anti-patterns-to-refuse) → "The Helpful Continuation".
