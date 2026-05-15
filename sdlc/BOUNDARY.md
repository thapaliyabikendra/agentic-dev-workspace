# BOUNDARY.md — Engine vs. Project Map

This file classifies every governance topic on the engine-vs-project
axis (engine-prescribed / engine-recommended / project-time). It is the
**canonical home for status vocabularies** (DDD node / ADR / DEC / CHG /
Standard) and for the engine-vs-project axis itself — other files cite
this file's `## Engine-vs-project axis (governance topic classification)`
table by link rather than restating.

## When to Use

**Use when:** classifying a new governance topic on the engine-vs-project
axis, looking up a status vocabulary (DDD node / ADR / DEC / CHG /
Standard), proposing a change to the team-agnostic vs. team-specific
boundary, or onboarding a new project on the engine (also see
[`SETUP.md`](SETUP.md)).

**Do NOT use when:** drafting a phase artifact (load the relevant
`workflow/*.md`), looking up a per-op procedure (load the matching
`workflow/<op>.md`), or resolving a doctrinal dispute (load
[`PRINCIPLES.md`](PRINCIPLES.md)).

**Vs. sibling files:** [`WORKFLOW.md`](WORKFLOW.md) carries the phase
pipeline and cross-cutting practices; [`LAYOUT.md`](LAYOUT.md) carries
the folder map; this file carries the **classification** that decides
where a rule belongs.

> Defines what belongs in the `sdlc/` engine (reusable across projects)
> and what belongs in `docs/` (project-owned knowledge base). Consulted
> when onboarding a new project — see [`SETUP.md`](SETUP.md).

**Status — Phase A complete (2026-05-11).** The team-agnostic /
project-specific boundary has been *enforced* in this repo: workflow
scaffolding (`WORKFLOW.md`, `workflow/`, `_templates/`) no longer
restates project-specific content; project content (the live ADRs,
milestones, nodes, and the seeded baseline files) lives alongside it
but is now cleanly delimited. **Phase B** — the repo split into
`claude-sdlc/` + per-project overlay — remains deferred.

Read this with the actual files open — the lists below cite paths to keep
the audit grounded.

---

## Team-agnostic (candidates for the reusable bundle)

These describe the workflow shape itself. Other teams could adopt them
without modification.

### Phase model and operations

- The five-phase pipeline (0 / 1 / 1.5 / 2 / 3) — see
  [`WORKFLOW.md`](WORKFLOW.md).
- The Ingest/Query operation alignment: `generate-frs` validates (Query),
  `generate-feat-spec` ingests new DDD nodes directly into canonical
  `docs/<component>/nodes/<type>/` with `status: proposed` and emits a milestone-
  scoped CHG when existing nodes are touched (Ingest), `implement-feat`
  applies CHG deltas to canonical and flips proposed → active, then
  writes code.
- The milestone-as-container layout —
  `docs/milestones/M-NN-<slug>/{discovery,frs,specs,id-claims.md}` —
  with FSs and their CHG nodes (under `specs/FS-NNN/nodes/changes/`)
  living inside.
- Validation gates and context-reset rule between Phase 1.5→2 and 2→3.
- Author self-review + user-review handoff at phase exits.

### DDD knowledge base structure

- The twelve node types and their `-NNN` ID convention:
  - Original seven — Actor / Entity / Command / Flow / State / Decision /
    Integration.
  - Five additions — Module (MOD), Screen (SCR), Endpoint (EP), Permission
    (PERM), Change-map (CHG). MOD subsumes both "module" and "feature
    area"; CHG is emitted only when an FS modifies canonical nodes and
    lives permanently in the milestone folder (never canonical).
- Frontmatter contract: structured `source_ref:
  [{frs, fs, op: introduce | modify}]`, `touches_nodes`, `produces_nodes`,
  `new_nodes`, `changes`, `depends_on_specs`, `merged`, `merge_sha`,
  `frs`, `milestone`, `related`, `adrs`, `level` (on discoveries).
- **One canonical tree** at `docs/<component>/nodes/<type>/` with a `status` field
  on every node: `proposed` (Phase 2 ingest — written by an unmerged FS)
  / `active` (Phase 3 merge has flipped, or brownfield-absorbed straight)
  / `superseded` / `deprecated`. The only milestone-scoped DDD artifact is
  the CHG-NNN node at
  `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/nodes/changes/CHG-NNN-<slug>.md`
  — documents modify-intent against existing canonical nodes; never
  promoted to canonical.
- Per-milestone ID-claim ledger (`id-claims.md`) preventing sibling-FS ID
  collisions on new IDs and detecting cross-FS modify-intent collisions
  on existing IDs.
- Reference-never-copy principle.
- Brownfield-conflict surfacing rule, plus the Phase 1.5 Validation Gate
  (per-FRS existence/sanity/ADR-conflict checks + milestone cross-FRS
  sweep). Phase 1.5 existence-scan includes `proposed` in-flight nodes
  from sibling FSs.
- **Per-type `index.md` + `log.md` pair convention.** Each canonical
  node-type folder owns a Karpathy-style content catalog and an
  append-only chronological event record. **Three-file (or 3+N) touch
  is event-driven** — fires at the lifecycle event itself: Phase 2
  ingest for a new node's `created` event; Phase 3 merge for the
  `proposed → active` `status-change` event and for CHG-applied
  `updated` / `superseded` / `status-change` events on canonical
  targets. Procedure documented in
  [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md).

### ADR Wiki

- The `ADR-NNN` ID convention.
- The unified ADR template at [`_templates/ADR.md`](_templates/ADR.md) —
  Context / Decision / Rationale / Alternatives / Consequences body,
  borrowed from the DEC node template.
- The Karpathy-style index at [`adrs/index.md`](../docs/<component>/adrs/index.md) — the one
  file generators wholesale-read; individual ADR pages stay narrow-load.
- The companion append-only [`adrs/log.md`](../docs/<component>/adrs/log.md) — chronological
  event record paired with the index. Same pattern used for every node-type
  folder.
- The three-trigger authoring procedure (standalone / from FRS / from FS)
  documented in [`workflow/authoring-adr.md`](workflow/authoring-adr.md).
- The three-way Standard / ADR / DEC discriminator (lives in
  [`workflow/authoring-adr.md`](workflow/authoring-adr.md)): *Standard if
  it applies to any project using the engine; ADR if it's a project-specific
  cross-cutting commitment; DEC if it shapes one specific node's behavior.*
  Inline-vs-standalone DEC sub-rule: inline by default, promote to standalone
  when scope spans ≥2 nodes or lifecycle / external citation is needed.
- The supersession lifecycle (`proposed → accepted → deprecated | superseded`)
  with bidirectional `supersedes` / `superseded_by` linking.

### Standards Wiki

- The `STD-NNN` ID convention for engine-level technical standards.
- The unified standards template at
  [`_templates/STANDARD.md`](_templates/STANDARD.md) — Scope / Standards /
  Consequences / Project-specific deviations / Revisit-if body.
- The Karpathy-style index at [`standards/index.md`](standards/index.md) —
  generators wholesale-read this alongside `adrs/index.md`; individual
  standard pages stay narrow-load.
- The companion append-only [`standards/log.md`](standards/log.md).
- Standards are engine-owned (live under `sdlc/`), unlike ADRs which are
  project-owned (live under `docs/`). Standards override no project content;
  project-specific deviations from a standard land as ADRs back-linking to
  the standard.

### Templates

- All files under [`_templates/`](_templates/) — FRS, FS, Discovery,
  Milestone, ADR, the twelve node templates (ACTOR, ENTITY, COMMAND, FLOW,
  STATE, DECISION, INTEGRATION, MODULE, SCREEN, ENDPOINT, PERMISSION,
  CHANGE), and the index/log pair ([`INDEX.md`](_templates/INDEX.md),
  [`LOG.md`](_templates/LOG.md)). The *structure* is team-agnostic; any
  project-specific examples inside (none today) would be the
  project-specific layer.

### Cross-cutting practices

- Validation gates, context resets, retrieval discipline, traceability,
  brownfield muscle, OQ-NNN open questions as a first-class artifact
  type with per-OQ files + index + log.
- **Maintenance discipline** — the tiered touch rule (routine = 2-file, lifecycle
  event = 3-file: page + per-type index + per-type log; master README is
  derived and regenerated on demand).
  See [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md).
- **Derived stakeholder overviews.** The two-template pattern
  (BUSINESS / TECHNICAL), the wiki-as-source rule, and the
  regenerate-on-demand discipline. The *shape* is team-agnostic —
  Karpathy-index-first read, link-by-ID summaries, never-patch-derived,
  no `index.md` / `log.md` pair on the overview folder. The specific
  "Pulls from" lists in
  [`_templates/OVERVIEW-BUSINESS.md`](_templates/OVERVIEW-BUSINESS.md)
  and [`_templates/OVERVIEW-TECHNICAL.md`](_templates/OVERVIEW-TECHNICAL.md)
  reference this workspace's node types and will need editing if
  another team adopts a different node set. See
  [`workflow/derived-reports.md`](workflow/derived-reports.md).

### Principles and anti-patterns

- [`PRINCIPLES.md`](PRINCIPLES.md) — definitions and anti-pattern list.
  All entries here are team-agnostic.

---

## Project-specific (stays with this team)

These are assumptions, vocabulary, or tooling choices that other teams may
not share.

### Domain context

- Trade Finance vocabulary (the implicit domain in this workspace; surfaces
  in any FRS, node, or spec that lands).
- Specific business invariants once they exist in `docs/<component>/nodes/` (none yet).

### Toolchain assumptions

- **Lovable UI prototype as Phase 0 input.** Other teams without Lovable
  will need a different prototyping entry — wireframe-driven discovery is
  the noted alternative.
- **GitLab migration target.** [`WORKFLOW.md`](WORKFLOW.md#migration-to-gitlab-later)
  has a GitLab mapping table; teams on other forges (GitHub, Azure DevOps,
  Bitbucket) would need an adapted mapping.
- **Playwright as the test runner** — the project's working assumption;
  this migrates to a (future) testing-convention ADR once authored.
  Another team's runner swap then becomes editing one ADR rather than
  threading the choice through workflow files. **Phase A note
  (2026-05-11):** `workflow/action-to-playwright.md` now carries a
  status header labelling it as the project-owned test-runner
  cookbook; flow files reference it generically.
- **ABP / .NET task-ordering cohorts** — `[Phase A — Resolved
  2026-05-11]` Cohort table extracted from `workflow/plan.md` into
  [`adrs/ADR-009`](../docs/<component>/adrs/ADR-009-implementation-task-cohort-ordering.md).
  Flow files now reference the cohort-ordering ADR by index lookup.
- **ABP-specific code-quality gates** — `[Phase A — Resolved
  2026-05-11]` The twelve gates previously inlined in
  `workflow/implementation.md` Stage 3 are now referenced by index
  lookup against [`adrs/ADR-008`](../docs/<component>/adrs/ADR-008-code-quality-gates.md);
  the verbatim gate list lives only in the ADR.
- **Cross-cutting concerns template** — `[Phase A — Resolved
  2026-05-11]` `docs/cross-cutting-concerns.md` was being treated as
  both template and project seed. Template extracted to
  [`_templates/CROSS-CUTTING-CONCERNS.md`](_templates/CROSS-CUTTING-CONCERNS.md)
  with `[bracketed slot]` placeholders for the five project-specific
  values (retention years, timezone ×2, audit-read role, primary
  language); live file is now an explicit seed.
- **Glossary template** — `[Phase A — Resolved 2026-05-11]` Same
  treatment as cross-cutting-concerns. Template extracted to
  [`_templates/GLOSSARY.md`](_templates/GLOSSARY.md); live
  `docs/glossary.md` is the project seed.

### Role / capacity assumptions

- "One human plays all roles — BA, BEA, Developer, QA." Teams with
  dedicated QA or BA roles will reassign hats, not eliminate them.
- Manager builds the Lovable prototype. In other teams this may be a
  product owner, BA, or designer.

### ADR content

- Individual ADRs in `docs/<component>/adrs/` are project-specific by definition once
  authored. The template, index pattern, and authoring procedure (above,
  under Team-agnostic → ADR Wiki) carry over; the decisions inside each
  ADR do not.

---

## Engine-vs-project axis (governance topic classification)

> Added 2026-05-13 alongside the `sdlc/standards/` adoption. Classifies
> each governance topic so future "where should this live?" calls have a
> doctrinal answer.

> **Canonical home.** This section is the canonical home for the
> **status vocabularies** below (DDD node / ADR / DEC / CHG / Standard).
> [`workflow/authoring-adr.md`](workflow/authoring-adr.md),
> [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md),
> [`workflow/plan.md`](workflow/plan.md), and
> [`workflow/implementation.md`](workflow/implementation.md) cite this
> table by link rather than restating the vocabularies. If a transition
> looks ambiguous in another file, defer to this table and flag the drift.

Each governance topic carries one of three classifications:

- **engine-prescribed** — one right answer for all projects. The engine
  bakes the rule in; projects cannot opt out without forking the methodology.
- **engine-recommended** — engine ships a default with a discriminator that
  lets projects justify deviation. Projects override deliberately, not silently.
- **project-time** — engine takes no position; the project decides per its
  own constraints.

Topic-by-topic classification:

| Topic | Classification | Notes |
|-------|----------------|-------|
| `sdlc/standards/` location and shape | **engine-prescribed** | Engine-level rules live at `sdlc/standards/`; no project alternative path. |
| `docs/cross-cutting-concerns.md` presence | **engine-prescribed** | Every project carries one; it is the NFR baseline. |
| `docs/tech-stack.md` presence and shape | **engine-prescribed** | Every project carries one (added 2026-05-13). Eight-section structure (versions / layout / commands / environments / infra deps / runtime state / progress / cadence) is engine-prescribed; field contents are project-time. Read posture: Phase 3 wholesale-read; no `index.md` / `log.md` pair; no Phase 1.5 snapshot. |
| `docs/<component>/adrs/` location and shape | **engine-prescribed** | Karpathy index + append-only log + per-ADR file. |
| `docs/<component>/nodes/decisions/` (standalone DECs) location | **engine-prescribed** | Standalone DECs always live here. |
| Inline DEC `## Decisions` heading on node templates | **engine-prescribed** | Every node-type template carries the heading; inline placement is the default. |
| Inline-vs-standalone DEC choice for a specific decision | **engine-recommended** | Discriminator in `workflow/authoring-adr.md` defaults to inline; project applies it. |
| Standard-vs-ADR boundary on existing content | **project-time** | Existing project ADRs that turn out to be engine-level migrate opportunistically; no bulk lift. |
| Three-file (or 3+N) touch on lifecycle events | **engine-prescribed** | Event-driven — fires at the lifecycle event itself: Phase 2 ingest `created`, Phase 3 merge `status-change` (`proposed → active`) and CHG-applied `updated`/`superseded`/`status-change`. Light-touch fallback is a project-time election only after several weeks of friction. |
| DDD node status vocabulary | **engine-prescribed** | `proposed → active → superseded \| deprecated`. FS-generated nodes pass through `proposed` (Phase 2 → Phase 3 merge flip); brownfield-absorbed nodes start at `active` directly (Phase-3-equivalent in discipline). |
| ADR status vocabulary | **engine-prescribed** | `proposed → accepted → deprecated \| superseded`. |
| DEC status vocabulary | **engine-prescribed** | `proposed → active → superseded \| deprecated`. Parity with other DDD nodes — standalone DECs go canonical at Phase 2 with `proposed`; flip to `active` at Phase 3 merge. Inline DECs have no independent status (they ride the host node's lifecycle). |
| CHG status vocabulary | **engine-prescribed** | `draft → approved → merged`. CHG nodes are milestone-scoped (never canonical); status transitions edit the file in place at its milestone path. |
| Standard status vocabulary | **engine-prescribed** | Same as ADR. |
| Phase 1.5 gate snapshots (CCC + ADR index + standards index) | **engine-prescribed** | All three baselines snapshot at gate entry; `_version` fields captured. |
| Test runner choice | **project-time** | Currently Playwright; lives in a project-owned cookbook. |
| Stack / framework choice | **project-time** | Decision captured as project ADRs (e.g., ADR-002 ABP); current operational state captured in `docs/tech-stack.md`. |
| Brownfield-vs-greenfield posture | **project-time** | Set in CLAUDE.md `project_type:`. |
| Component structure (`docs/<component-slug>/`) | **engine-recommended** | Engine defines the `COMPONENT.md` format and folder convention (see [`LAYOUT.md § Component structure`](LAYOUT.md#component-structure-docs)). Projects may omit components (keeping the flat `docs/<component>/nodes/` structure) when they have only one deployable component. Projects must not reuse component-slug names across projects within the same workspace. Bootstrap procedure: [`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md). |
| Standalone component ID prefix | **engine-recommended** | When the component layer is adopted, each standalone component must declare a globally unique 2–4 char uppercase `id_prefix` in `COMPONENT.md`. Brownfield-imported legacy components are exempt. The engine defines the format; the project chooses the prefix values. |

When a new governance topic arises, classify it explicitly using this axis
before adding it to any rule book.

---

## Boundary cases (decide during extraction)

- The twelve node types — are all twelve universal, or are some
  (e.g., Integration, Endpoint) domain-driven? In particular: Endpoint
  duplicates Command for thin 1:1 REST wiring; Permission is only useful
  when authorization is non-trivial. Decide when at least one team outside
  this project adopts the bundle.
- Phase 0 Discovery template — the "Existing nodes scanned" section
  assumes brownfield; greenfield teams may want a separate variant rather
  than treating it as optional.
- Cross-FS modify-intent collision discipline — id-claims `op: modify`
  rows surface when two sibling FSs both intend to modify the same
  canonical node. Solo cadence rarely sees this; teams with many
  concurrent FSs per milestone will exercise the rule more. Boundary
  call when a second team pilots the bundle.
- The QA-hat-is-one-human pattern is team-agnostic in shape but only
  applies to small teams. Larger teams adapt by assigning the hat to a
  named role.

---

## Phase A — Done (in-place genericization, 2026-05-11)

The workflow scaffolding layer is now genuinely project-agnostic. Concrete
changes:

- **`workflow/plan.md`** — Implementation-task cohort section replaced
  with a generic pointer to the project's cohort-ordering ADR (this
  project: ADR-009). Coverage matrix rows that named `ConcurrencyStamp`
  and `IMultiTenant` rewritten in framework-neutral terms.
- **`workflow/implementation.md`** — Stage 2 "Convention ADRs to
  consult" rewritten as an `adrs/index.md` lookup (any ADR tagged
  `convention`). Build command genericized (was `dotnet build`); the
  command's project home is now `docs/tech-stack.md § Operational
  commands` (added 2026-05-13 — the Phase A genericization moved the
  command out of the flow file but left no concrete project home until
  `docs/tech-stack.md` landed). Stage 3 "Code-quality gates" section
  replaced with a single pointer to the project's code-quality ADR
  (this project: ADR-008); the verbatim twelve-gate list no longer
  lives in the flow file.
- **`_templates/FS.md`** — Implementation-tasks cohort hint
  genericized to point at `workflow/plan.md` and the project's
  cohort-ordering ADR rather than naming ABP and ADR-002..ADR-008.
- **`workflow/frs-code-extraction-rules.md`** — React/TypeScript
  signal table now labelled explicitly as a worked example; logical
  name examples replaced with generic
  `Admin.Settings.*` / `Onboarding.Checklist.*` placeholders. Heading
  and intro reference "the existing application's source code"
  generically.
- **`workflow/frs-validation-rules.md`** — "Branch Maker / Branch
  Checker" bundling example rewritten as "maker action / checker
  action"; "Bank Admin" language-trap example rewritten as
  "administrator"; React/TS reference genericized.
- **`workflow/design.md`** — Brownfield code-mining pointer
  genericized.
- **`workflow/action-to-playwright.md`** — header reclassifies the
  file as the project-owned test-runner cookbook; flow files reference
  it generically.
- **`adrs/ADR-009`** — new convention ADR. Holds the four-cohort
  task-ordering table that previously lived in `workflow/plan.md`.
- **`_templates/CROSS-CUTTING-CONCERNS.md`** — new template, holds the
  category structure with `[bracketed slot]` placeholders for the
  five project-specific values (retention years, timezone ×2,
  audit-read role, primary language).
- **`_templates/GLOSSARY.md`** — new template, mirror of the live
  glossary's structure with seeding instructions.

Verification: a grep across `WORKFLOW.md`, `workflow/`, `_templates/`,
and `CLAUDE.md` for the project-specific terms listed in
[`docs/project.md § Phase A Boundary Verification`](../docs/project.md#phase-a-boundary-verification)
shows every remaining match inside one of three controlled holes: a
labelled worked example (the React / TypeScript section of
`frs-code-extraction-rules.md`), a labelled `> **This project:**`
callout (`plan.md` and `implementation.md` point at ADR-009 and
ADR-008 by ID), or an illustrative slot-value example in
`_templates/CROSS-CUTTING-CONCERNS.md` (shown as fill-in examples).
No project term appears as unflagged scaffolding prose.

---

## Phase B — Deferred (repo split, next-quarter scope)

- **Repo split.** Extract the team-agnostic items (`WORKFLOW.md`,
  `workflow/`, `_templates/`, the maintenance and authoring procedures
  in `WORKFLOW.md`) into a `claude-sdlc/` (or similarly named) bundle.
  Project-specific content (`adrs/`, `milestones/`, `nodes/`,
  `cross-cutting-concerns.md`, `glossary.md`, the project CLAUDE.md
  layer) stays here.
- **Skill bundle layering.** The team-agnostic bundle is the base;
  per-team knowledge skills layer project context on top. Decide
  layering mechanism (git submodule / subtree / packaged kit / Claude
  skill) when the split happens.
- **Shared integration designs repo.** A separate location for
  cross-cutting integration artifacts (LDAP, SMTP, SSO, concurrent
  login) that any team can reference and adapt.
- **Testing-convention ADR.** Author the ADR that names the project's
  test runner. After it exists, `action-to-playwright.md` is one of
  several possible cookbooks the ADR can point at.
- **Pilot with one other team.** Confirm the boundary that Phase A
  enforced survives a second user before declaring the bundle
  reusable. This is the empirical test for the four boundary cases
  above.

---

## Integration

- **Required before:** [`CLAUDE.md ## Hard rules`](../CLAUDE.md#hard-rules)
  — hard rules bind every classification this file makes.
- **Sibling references:**
  - [`WORKFLOW.md`](WORKFLOW.md) — the phase pipeline whose practices
    this file classifies (engine-prescribed cross-cutting practices vs.
    project-time choices).
  - [`PRINCIPLES.md`](PRINCIPLES.md) — doctrinal *why*; classification
    decisions in the table below assume those principles bind.
  - [`LAYOUT.md`](LAYOUT.md) — the folder map; engine-prescribed
    locations referenced here come from there.
- **Cited by:**
  - [`workflow/authoring-adr.md`](workflow/authoring-adr.md) — the
    Standard / ADR / DEC discriminator consumes the engine-vs-project
    axis below.
  - [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md) —
    consumes the status vocabularies from the table below.
  - [`workflow/plan.md`](workflow/plan.md) and
    [`workflow/implementation.md`](workflow/implementation.md) —
    consume the DDD node / CHG status transitions from the table below.
- **Required after (when onboarding a new project):**
  [`SETUP.md`](SETUP.md) — applies the classifications here to scaffold
  a project on the engine.
