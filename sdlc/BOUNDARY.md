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
  `docs/<component>/nodes/<type>/` with `status: proposed` and consumes
  the per-FRS CHGs (born at Phase 1 per R-CHG-1 when `touches_nodes:` is
  non-empty) via FS `consumes_chgs:` — enriching each structurally
  (Ingest), `implement-feat` applies CHG deltas to canonical and flips
  proposed → active and consumed CHGs approved → merged, then writes
  code.
- The milestone-as-container layout —
  `docs/milestones/M-NN-<slug>/{discovery,frs,chg,specs,id-claims.md}` —
  with the per-FRS CHG nodes under `chg/` (sibling to `specs/`), born at
  Phase 1 by their owning FRS and consumed at Phase 2 by the FS via
  `consumes_chgs:`.
- Validation gates and context-reset rule: four named `/clear` boundaries — two in the dev track (Phase 1.5→2, Phase 2→3), and two in the QA track (from `plan.md` to `test-plan-ingest.md`, and from `implementation.md` to `test-suite-codegen.md`). `test-suite-codegen.md` ↔ `qa-gate.md` is **session-shared** (back-to-back; gate inherits codegen context) per CLAUDE.md Rule 5.
- Author self-review + user-review handoff at phase exits.

### DDD knowledge base structure

- The twelve node types and their `-NNN` ID convention:
  - Original seven — Actor / Entity / Command / Flow / State / Decision /
    Integration.
  - Five additions — Module (MOD), Screen (SCR), Endpoint (EP), Permission
    (PERM), Change-map (CHG). MOD subsumes both "module" and "feature
    area"; CHG is born at Phase 1 by the FRS when `touches_nodes:` is
    non-empty (R-CHG-1) and lives permanently in the milestone-scoped
    `chg/` folder (never canonical).
- Frontmatter contract: structured `source_ref:
  [{frs, fs, op: introduce | modify}]`, `touches_nodes`, `produces_nodes`,
  `new_nodes`, `consumes_chgs` (replaces `changes:` post-2026-05-17 cutover;
  pre-cutover FSs are grandfathered), `depends_on_specs`, `merged`,
  `merge_sha`, `frs`, `milestone`, `related`, `adrs`, `level` (on
  discoveries).
- **One canonical tree** at `docs/<component>/nodes/<type>/` with a `status` field
  on every node: `proposed` (Phase 2 ingest — written by an unmerged FS;
  also Phase 1 FLW — written by the FRS; ACT joins the Phase-2 ingest
  set per R-NEW-2a retirement 2026-05-17) / `active` (Phase 3 merge
  has flipped, or brownfield-absorbed straight) / `superseded` /
  `deprecated`. The only milestone-scoped DDD artifact is the CHG-NNN
  node at `docs/milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` (CR track:
  `docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md`) — documents
  modify-intent against existing canonical nodes; born at Phase 1 by the
  FRS (R-CHG-1); never promoted to canonical. Pre-cutover CHGs at
  `specs/FS-NNN-<slug>/nodes/changes/` are grandfathered.
- Per-milestone ID-claim ledger (`id-claims.md`) tracking cross-FS
  modify-intent collisions on existing IDs and released ACT-NNN claims
  from FRS abandonment. New-ID ceilings live in per-type `index.md` /
  milestone folder globs / FRS frontmatter, not here (R-NEW-9 amended
  2026-05-17).
- Reference-never-copy principle.
- Brownfield-conflict surfacing rule, plus the Phase 1.5 Validation Gate
  (per-FRS existence/sanity/ADR-conflict checks + milestone cross-FRS
  sweep). Phase 1.5 existence-scan includes `proposed` in-flight nodes
  from sibling FSs.
- **Per-type `index.md` convention for canonical artifacts.** Each canonical node-type folder, the ADR folders, and `docs/shared/ccc/` own a Karpathy-style content catalog (`index.md`). **All canonical edits fire the 2-file touch (artifact + per-type `index.md`);** chronological audit is git history of the artifact and its index row. Procedure documented in
  [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md).

### ADR Wiki

- The `ADR-NNN` ID convention.
- The unified ADR template at [`_templates/ADR.md`](_templates/ADR.md) —
  Context / Decision / Rationale / Alternatives / Consequences body,
  borrowed from the DEC node template.
- The Karpathy-style index at [`adrs/index.md`](../docs/<component>/adrs/index.md) — the one
  file generators wholesale-read; individual ADR pages stay narrow-load.
  Chronological audit is git history; no companion `log.md` (retired
  2026-05-16).
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
- **Maintenance discipline** — the tiered touch rule (all canonical artifacts — node, ADR, CCC — fire the 2-file touch: artifact + per-type `index.md`; master README is derived and regenerated on demand).
  See [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md).
- **Derived stakeholder overviews and publications.** Two output
  shapes share one discipline: **aggregate snapshots** (the
  BUSINESS / TECHNICAL singletons) and **multi-instance category
  outputs** (per-instance publications under
  `docs/reports/{release-notes,articles,api,overviews}/`). Common shape
  is team-agnostic — Karpathy-index-first read, link-by-ID
  summaries, never-patch-derived, wiki-as-source, regenerate-on-demand.
  Index-pair rule splits on the singleton-vs-multi-instance axis:
  aggregate snapshots get **no** `index.md` / `log.md` pair (the
  file *is* its own view); multi-instance category folders get a
  per-category Karpathy `index.md` over their instances (still no
  `log.md` — git history covers chronology, consistent with the
  2026-05-16 retirement). Per-category `index.md` files under
  `docs/reports/` are Karpathy catalogs over derived views, not
  canonical-touch triggers (tiered touch still applies to
  canonical content only). The specific "Pulls from" lists in
  [`_templates/OVERVIEW-BUSINESS.md`](_templates/OVERVIEW-BUSINESS.md),
  [`_templates/OVERVIEW-TECHNICAL.md`](_templates/OVERVIEW-TECHNICAL.md),
  and [`_templates/PUBLICATION.md`](_templates/PUBLICATION.md)
  reference this workspace's node types and will need editing if
  another team adopts a different node set. Karpathy-catalog
  indexes for the multi-instance categories live at
  `docs/reports/release-notes/index.md`,
  `docs/reports/articles/index.md`,
  `docs/reports/api/index.md`, and
  `docs/reports/overviews/index.md`. See
  [`workflow/derived-reports.md`](workflow/derived-reports.md).

### Principles and anti-patterns

- [`PRINCIPLES.md`](PRINCIPLES.md) — definitions and anti-pattern list.
  All entries here are team-agnostic.

---

## Project-specific (illustrative — fill in with your project's choices)

These are the categories of assumption, vocabulary, or tooling choice that
vary across projects. Replace each `<placeholder>` with your project's
actual choice when adopting the engine.

### Domain context

- `<your domain>` vocabulary (the implicit domain in this workspace; surfaces
  in any FRS, node, or spec that lands).
- Specific business invariants once they exist in `docs/<component>/nodes/`.

### Toolchain assumptions

- **`<your UI prototyping tool>` as Phase 0 input.** Wireframe-driven
  discovery is one alternative; adapt to whichever input format the
  milestone scoping phase consumes.
- **`<your VCS/CI platform>` as migration target.** [`WORKFLOW.md`](WORKFLOW.md)
  has a platform-mapping table; adapt it to your forge (GitLab, GitHub,
  Azure DevOps, Bitbucket, etc.).
- **`<your test runner>` as the test runner** — formalize the choice in a
  testing-convention ADR once authored; then `workflow/test-runner-cookbook.md`
  becomes the implementation of that ADR's choice. Another team's runner
  swap becomes editing one ADR and replacing the cookbook.
- **`<your framework>`'s task-ordering cohorts** — extract the cohort table
  into a convention ADR (tag it `task-ordering`). Flow files reference the
  ADR by index lookup; the verbatim cohort table lives only in the ADR.
- **`<your framework>`-specific code-quality gates** — extract the gate list
  into a convention ADR (tag it `code-quality`). Flow files reference the
  ADR by index lookup; the verbatim gate list lives only in the ADR.
- **Cross-cutting concerns template** — `[Phase A — Resolved
  2026-05-11]` Template extracted to
  [`_templates/CROSS-CUTTING-CONCERNS.md`](_templates/CROSS-CUTTING-CONCERNS.md)
  with `[bracketed slot]` placeholders for project-specific values; the
  live `docs/shared/cross-cutting-concerns.md` is the project seed.
- **Glossary template** — `[Phase A — Resolved 2026-05-11]` Template
  extracted to [`_templates/GLOSSARY.md`](_templates/GLOSSARY.md); the
  live `docs/shared/glossary.md` is the project seed.

### Role / capacity assumptions

- "One human plays all roles — BA, BEA, Developer, QA." Teams with
  dedicated QA or BA roles will reassign hats, not eliminate them.
- The Phase 0 prototyper role is team-assigned (product owner, BA,
  designer, or manager — depends on who owns the prototype).

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
| `docs/shared/ccc/` location and shape | **engine-prescribed** | Karpathy index + append-only log + per-CCC file (`CCC-NNN-<slug>.md`). Every project carries this tree; it is the NFR baseline store. Replaces the flat `docs/shared/cross-cutting-concerns.md` (retired 2026-05-16). |
| `docs/shared/tech-stack.md` presence and shape | **engine-prescribed** | Every project carries one (added 2026-05-13). Eight-section structure (versions / layout / commands / environments / infra deps / runtime state / progress / cadence) is engine-prescribed; field contents are project-time. Read posture: Phase 3 wholesale-read; no per-type `index.md` (not a node-type folder); no Phase 1.5 snapshot. |
| `docs/<component>/adrs/` location and shape | **engine-prescribed** | Karpathy index + append-only log + per-ADR file. |
| `docs/<component>/nodes/decisions/` (standalone DECs) location | **engine-prescribed** | Standalone DECs always live here. |
| Inline DEC `## Decisions` heading on node templates | **engine-prescribed** | Every node-type template carries the heading; inline placement is the default. |
| Inline-vs-standalone DEC choice for a specific decision | **engine-recommended** | Discriminator in `workflow/authoring-adr.md` defaults to inline; project applies it. |
| Standard-vs-ADR boundary on existing content | **project-time** | Existing project ADRs that turn out to be engine-level migrate opportunistically; no bulk lift. |
| Tiered touch on edits and lifecycle events | **engine-prescribed** | All canonical edits (node, ADR, CCC): 2-file (artifact + per-type `index.md`). Event-driven — fires at the lifecycle event itself: Phase 2 ingest `created`, Phase 3 merge `status-change` (`proposed → active`) and CHG-applied `updated`/`superseded`/`status-change`. Chronological audit is git history; no per-canonical-type `log.md` (retired 2026-05-16). |
| DDD node status vocabulary | **engine-prescribed** | `proposed → active → superseded \| deprecated`. FS-generated nodes pass through `proposed` (Phase 2 → Phase 3 merge flip); brownfield-absorbed nodes start at `active` directly (Phase-3-equivalent in discipline). |
| ADR status vocabulary | **engine-prescribed** | `proposed → accepted → deprecated \| superseded`. |
| DEC status vocabulary | **engine-prescribed** | `proposed → active → superseded \| deprecated`. Parity with other DDD nodes — standalone DECs go canonical at Phase 2 with `proposed`; flip to `active` at Phase 3 merge. Inline DECs have no independent status (they ride the host node's lifecycle). |
| CHG status vocabulary | **engine-prescribed** | `draft → approved → merged`. CHG nodes are milestone-scoped (never canonical); status transitions edit the file in place at its milestone path. |
| Standard status vocabulary | **engine-prescribed** | Same as ADR. |
| Phase 1.5 gate snapshots (CCC index + ADR index + standards index) | **engine-prescribed** | All three indexes snapshot at gate entry. CCC snapshot is now the per-CCC index (`docs/shared/ccc/index.md`) rather than the retired flat baseline doc — individual CCC pages narrow-load on the consuming artifact's `ccc:` declaration. `_version` fields captured. |
| Test runner choice | **project-time** | Captured in a project-owned test-runner cookbook (`workflow/test-runner-cookbook.md` by convention); formalized in a testing-convention ADR once authored. |
| Stack / framework choice | **project-time** | Decision captured as project ADRs; current operational state captured in `docs/shared/tech-stack.md`. |
| Brownfield-vs-greenfield posture | **project-time** | Set in CLAUDE.md `project_type:`. |
| Component structure (`docs/<component-slug>/`) | **engine-recommended** | Engine defines the `COMPONENT.md` format and folder convention (see [`LAYOUT.md § Component structure`](LAYOUT.md#component-structure-docs)). Projects may omit components (keeping the flat `docs/<component>/nodes/` structure) when they have only one deployable component. Projects must not reuse component-slug names across projects within the same workspace. Bootstrap procedure: [`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md). |
| Standalone component ID prefix | **engine-recommended** | When the component layer is adopted, each standalone component must declare a globally unique 2–4 char uppercase `id_prefix` in `COMPONENT.md`. Brownfield-imported legacy components are exempt. The engine defines the format; the project chooses the prefix values. |

When a new governance topic arises, classify it explicitly using this axis
before adding it to any rule book.

---

## Stack axis (frontmatter enum)

> Added 2026-05-16. Declares which stack a governance / spec artifact
> binds on. Engine-prescribed; the enum vocabulary is canonical here and
> referenced by templates and indexes elsewhere.

Every STD / ADR / FRS / FS / DEC / CCC carries a `stack:` (or, for STDs
and workflow flow files, `applies_when.stack:`) frontmatter field whose
value is a non-empty subset of:

- **`api`** — backend HTTP / service-layer rules.
- **`ui`** — frontend / view-layer rules.
- **`test`** — testing infrastructure / harness rules.
- **`full-stack`** — rules that bind across api + ui (or beyond).
- **`infra`** — deployment, observability, CI/CD, runtime infrastructure.
- **`agnostic`** — rules that bind regardless of stack (e.g., engine-universal DDD constraints).

Multi-value lists are allowed (an ADR may bind both `api` and `ui`).
Engine-universal rules default to `[agnostic]`. The Phase 2/3 retrieval
filters by intersection between the consuming artifact's `stack:` and the
governance artifact's stack declaration.

Workflow flow files in [`workflow/`](workflow/) carry `applies_when:` in
the same shape as STDs — `[agnostic]` for engine-universal procedures,
stack-conditional values (e.g. `[api]`, `[test]`) when the procedure
binds to a specific stack, plus `applies_when.framework:` when the
procedure is framework-conditional (e.g. the `abp-bootstrap/*` set).
Generalization performed 2026-05-21 per `sdlc-framework-plan-v2.md` T4.1.

---

## Framework axis (frontmatter enum)

> Added 2026-05-16. Orthogonal to the stack axis: declares which
> application framework a governance / spec artifact binds on. Used
> primarily on STDs whose rules apply only under a specific framework
> (e.g., ABP coding conventions). Engine-prescribed enum.
>
> **Mandatory presence on consumers, 2026-05-22.** Promoted from
> optional-on-consumer to mandatory-on-consumer in parallel with
> `stack:`; previously a consumer could omit `framework:` and silently
> miss framework-conditional STDs at intersection time. See
> [CLAUDE.md § Hard rules](../CLAUDE.md#hard-rules) HARD-GATE.
> Pre-2026-05-22 FRSs / FSs are grandfathered; the next substantive edit
> backfills both `stack:` and `framework:`.

A STD whose applicability is framework-conditional carries
`applies_when.framework:` in addition to `applies_when.stack:`. Every
**consuming** FRS / FS declares `framework:` (non-empty subset of the
enum below — `[agnostic]` when framework-independent) and intersects on
**both** axes: a STD binds only when the consumer's `stack:` intersects
`applies_when.stack:` *and* the consumer's `framework:` intersects
`applies_when.framework:`. Symmetric with `stack:`; the prior optional
"(if any)" carve-out is retired.

Current enum:

- **`abp-net`** — ABP Framework on .NET (project default for the APP
  component).
- **`agnostic`** — framework-independent; rules bind regardless of
  framework choice. The fallback value on FRSs / FSs whose work is
  stack-bound but not framework-bound (e.g., infra / streaming specs
  targeting the FDE component until an FDE-specific framework token is
  added to the enum).

Add entries here when a new framework becomes a project target. STDs
that omit `applies_when.framework:` bind regardless of framework (treat
as `[agnostic]`). Consumers no longer have that option — omission is a
Phase 1.5 Blocker per
[`workflow/frs-validation-rules.md`](workflow/frs-validation-rules.md).

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

## Change history

**Phase A — Done (2026-05-11):** In-place genericization complete. Engine scaffolding contains no project-specific content. See git history for details.

**Phase B — Deferred (next-quarter scope):** Repo split (`claude-sdlc/` + per-project overlay), skill bundle layering, shared integration designs repo, testing-convention ADR, and one-team pilot remain pending.

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
