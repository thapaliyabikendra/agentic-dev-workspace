# CLAUDE.md — Project memory

Every rule has one canonical home. If this file and a canonical doc
disagree, the canonical doc wins — flag the drift.

## Hard rules

**HARD-GATE:** do not begin a new phase until `## Hard rules` and the
relevant flow file are loaded. Applies across sessions.

**HARD-GATE:** do not change a doctrinal rule in
[`sdlc/PRINCIPLES.md`](sdlc/PRINCIPLES.md) without atomically checking
that the procedural rule in `sdlc/WORKFLOW.md` or `sdlc/workflow/<op>.md`
does not contradict it. Doctrinal–procedural drift is silent corruption.

**HARD-GATE:** do not ingest a node into a component path that does not
yet have `docs/<component>/COMPONENT.md` with `id_prefix:` set —
[`sdlc/workflow/new-component-bootstrap.md`](sdlc/workflow/new-component-bootstrap.md)
runs first.

**HARD-GATE:** do not run Add / Change / Retire on the glossary or
`docs/shared/ccc/` baselines while a Phase 1.5 gate is **active** for any
FRS in the milestone — invalidates the gate snapshot.
[`sdlc/workflow/baseline-references.md`](sdlc/workflow/baseline-references.md)
is the rule book.

**Retrieval discipline** (what to load at each phase entry):
[`sdlc/workflow/retrieval-discipline.md`](sdlc/workflow/retrieval-discipline.md).

1. DDD nodes in `docs/<component>/nodes/` are truth; on node ↔ spec
   conflict, node wins or reconcile both.
2. Five governance sources — **STD** (`sdlc/standards/`),
   **ADR** (`docs/<component>/adrs/`, `docs/shared/adrs/`),
   **CCC** (`docs/shared/ccc/`, NFR baselines; ADRs back-link for
   deviations), **NDF** (`docs/<component>/node-definitions/`, ADR-039),
   **DEC** (inline or `docs/<component>/nodes/decisions/`).
   Discriminator:
   [`sdlc/workflow/authoring-adr.md`](sdlc/workflow/authoring-adr.md).
3. Reference, never copy. Link by ID.
4. Existing nodes are authoritative — adapt the template, don't retrofit.
5. `/clear` at every flow boundary; phases / stages inside one flow
   share a session. QA-track structure: `test-plan-ingest` is one flow;
   `test-suite-codegen` + `qa-gate` form one combined flow with two
   stages (codegen-stage + gate-stage). `/clear` boundaries: QA-track
   entry (into `test-plan-ingest`) and between `test-plan-ingest` ↔
   `test-suite-codegen`. The codegen-stage → gate-stage transition is
   intra-flow (no `/clear`); gate-stage inherits codegen-stage's
   selector-resolved + spec-emitted context. PRINCIPLES.md "Helpful
   Continuation" doctrine preserved — `/clear` fires at every *flow*
   boundary; stage transitions inside one flow do not. gate-stage
   verification independence is preserved by gate-side re-reads of
   FS/FRS/ADRs/STDs/CCCs (see [`sdlc/workflow/qa-gate.md`](sdlc/workflow/qa-gate.md)).
6. Every artifact has an ID and links upstream + downstream. Prefixes:
   `ADR-NNN`, `FRS-NNN`, `M-NN`, `CR-NNN`, `FS-NNN`, `CHG-NNN`,
   `TC-NNN`, `OQ-NNN`, node IDs (all `-NNN`). Ceiling source: per-type
   `index.md` (canonical) / milestone folder (CHG: `chg/`;
   TC: `specs/**/test-plans/**`) / FRS frontmatter (`produced_actor:`
   for ACT). `id-claims.md` is the modify-intent + released-claim ledger
   only post-2026-05-17 — `op: modify` / `op: released` rows only;
   pre-cutover `op: introduce` rows grandfathered (R-NEW-9 amended).
   OQ scoping: [`sdlc/WORKFLOW.md`](sdlc/WORKFLOW.md). CR-NNN container:
   [`sdlc/workflow/change-request.md`](sdlc/workflow/change-request.md).
7. Plans contain no syntax. Phase 1 births FLW (Trigger + Scenarios) +
   CHG (behavior-language `modifies[]` when `touches_nodes:` non-empty);
   Phase 2 ingests ACT/ENT/CMD/STA/CON/INT/DEC/PERM/QRY and enriches
   FLW + CHG (wiring + structural before/after + `adds[]` +
   `migration_steps[]`, listed in FS `consumes_chgs:`); Phase 3 writes
   code, applies CHG deltas, flips `proposed → active` / `approved →
   merged`. Multi-stage plans need a progress checklist; mark each
   stage `[x]` before advancing. Full procedure:
   [`sdlc/workflow/plan.md`](sdlc/workflow/plan.md). Progress-checklist
   procedure:
   [`sdlc/WORKFLOW.md § Validation gates`](sdlc/WORKFLOW.md#validation-gates).
8. Tiered touch for canonical edits: node / ADR / CCC + per-type
   `index.md` (base + N when `related:` changes). Canonical `log.md`
   retired 2026-05-16 (research + standards logs survive).
   [`sdlc/workflow/maintenance-discipline.md`](sdlc/workflow/maintenance-discipline.md)
   § Rule history.
9. Read the per-type `index.md` before globbing
   (`docs/<component>/nodes/<type>/index.md`). Glob only when component
   / type is unknown.
10. One question per turn during FRS / FS drafting. For FS drafting,
    pause at **section-group boundaries** (Coverage+New nodes /
    Change maps+Architecture / Data model+Interface contracts /
    Tasks+Dependencies+QA), not per section — 3–4 question-rounds
    total, one question per round. PRINCIPLES.md "one question per
    message" doctrine preserved (each turn still carries one question);
    the change is cadence, not multiplicity.
11. Never `git commit` (or any commit-equivalent — `git commit -am`,
    `gh pr create`) without explicit user authorization. Authorization
    for one commit does not carry forward to the next.
12. Output style: token-optimized — compact, structured, rule-dense,
    pointer-heavy, redundancy-free; lead with the recommendation.
    **Exception** to redundancy-free: framework HARD-GATE rules MAY be
    restated across canonical workflow files (CLAUDE.md, WORKFLOW.md,
    flow files, validation checklists) for defense-in-depth;
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

**Project KB** (lazy; framework requires the slot):
- `docs/<component>/COMPONENT.md` — descriptor + `id_prefix:`
- `docs/<component>/adrs/index.md` + `docs/shared/adrs/index.md` — ADRs
- `docs/<component>/nodes/<type>/index.md` — per-type canonical nodes
- [`docs/shared/ccc/index.md`](docs/shared/ccc/index.md) — CCC baselines

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
