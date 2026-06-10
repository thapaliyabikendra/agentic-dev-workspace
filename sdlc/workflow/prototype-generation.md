---
applies_when:
  stack: [ui]
---

# Prototype Generation Operation

> **Type:** Operation doctrine. The KB→prototype direction: given
> business-facing KB nodes (FLW / SCR / ACT — authored or drafted), generate
> or **incrementally update** a mock-mode prototype in the ui repo. Peer of
> [`prototype-first.md`](prototype-first.md), which is the prototype→KB
> direction (mining an existing prototype into FRSs); both converge on one
> identity (`PROTO-<slug>`) and one disposition home (`docs/prototypes/`).
> The BA persona drives this operation in plain language — the persona
> split is canonical at
> [`../KB-LAYOUT.md § Persona lens`](../KB-LAYOUT.md#persona-lens). The
> ui-repo conventions the generated code must obey are canonical at
> [`../_templates/UI-REPO-CONTRACT.md`](../_templates/UI-REPO-CONTRACT.md).

## When to Use

**Use when** business-facing KB content exists (or is being drafted from raw
BA requirements) and a clickable mock-mode prototype is needed — initial
generation, or a scoped update after a journey / screen changed.

**Do NOT use when** the input is an *existing* prototype artifact to be mined
into FRSs (that is [`prototype-first.md`](prototype-first.md)), or the change
has no UI surface (ordinary brief → FRS path), or the work is wiring real
APIs into an already-generated screen (that is the `/api-integration`
command — see § API integration handoff below).

## Anti-regression doctrine

The reason this operation exists: free-form "regenerate the app" prompting
decays a prototype — regressions, the same component diverging across pages,
contradictory data between screens, silent gaps. Four mechanics prevent it;
all four are mandatory, none is skippable for speed:

1. **Scoped change protocol.** One journey (or one screen) per generation
   pass. Blast radius is bounded by the screen's `nav_from:` / `nav_to:`
   adjacency; screens outside the scope are NEVER touched. If multiple
   journeys changed, run multiple passes and log each.
2. **Catalog-first components.** Before scaffolding any UI piece, read the
   ui repo's component catalog (`UI-REPO-CONTRACT.md § Component catalog`).
   An existing component with the same visual role is imported, never
   re-invented as a variant. New components get a catalog row in the same
   pass.
3. **Shared entity fixtures.** Mock data is defined once per business
   entity, never per screen — every screen showing the same entity derives
   its view from the same fixture (`UI-REPO-CONTRACT.md § Mock fixtures`).
   List and detail can never disagree.
4. **Overwrite guard.** Before regenerating an existing screen file, diff it
   (`git diff` / last-commit authorship). A file manually edited since the
   last generation pass is surfaced to the operator with a diff summary —
   never silently overwritten.

## Sub-flow A — Initial generation (KB → new prototype)

Input: one or more FLW IDs (or a milestone whose FLWs are authored), with
their SCR / ACT context. Pre-FRS drafts (`status: proposed`) are valid input
— see § Phase position below.

1. **Load the business surface.** Per FLW: Trigger, Scenarios, Journey
   walkthrough. Per SCR: Description, Layout / UI intent, Display states,
   `nav_from:` / `nav_to:`. ACT names + one-liners. PERM policy statements
   for role-gated affordances. Read per-type `index.md` first
   ([`retrieval-discipline.md`](retrieval-discipline.md)).
2. **Register the prototype.** `docs/prototypes/<slug>/PROTO-<slug>.md` from
   [`../_templates/PROTOTYPE.md`](../_templates/PROTOTYPE.md)
   (`status: draft`), catalog row in `docs/prototypes/index.md`.
   `motivated_by:` cites the seeding FLW IDs / `M-NN` (this direction always
   has a KB source — never empty, unlike the prototype-sourced direction).
   Populate `screens:` with stable `<Module>.<Area>.<Screen>` IDs — these
   are the file-identity spine until SCR-NNN allocation.
3. **Generate mock screens** in the ui repo per
   [`../_templates/UI-REPO-CONTRACT.md`](../_templates/UI-REPO-CONTRACT.md):
   scaffold-emitted screen + service interface + mock implementation +
   entity fixtures, `@implements` docblock carrying the stable screen ID
   (or SCR-NNN when already allocated), all four display states
   (empty / loading / error / unauthorized), screen-index entries. No ui
   repo yet → emit a static clickable artifact under
   `docs/prototypes/<slug>/raw/` instead and note it in `artifact:`.
4. **Record.** First row in the descriptor's Stakeholder iteration log;
   `artifact:` block filled.

## Sub-flow B — Incremental update (scoped regeneration)

Trigger: a FLW / SCR changed (BA-described change, post-gate FRS delta, or a
`prototype-drift` lint finding).

1. **Scope.** Identify exactly which screens the change touches (the changed
   SCR, plus `nav_from:` / `nav_to:` neighbors only when navigation itself
   changed). State the scope before generating.
2. **Apply the KB edit first** (via the BA's command / conversational
   drafting — node body + tiered touch per
   [`maintenance-discipline.md`](maintenance-discipline.md)). The KB is the
   source; the prototype is the build artifact. Never patch the prototype
   ahead of the node.
3. **Regenerate only the scoped screens**, overwrite guard active (doctrine
   point 4). Update `screens:` in the PROTO descriptor if the inventory
   changed.
4. **Verify.** Run the ui repo's trace gate (`kb:trace` per
   `UI-REPO-CONTRACT.md`) when present: 0 broken / 0 dangling. Log the pass
   in the Stakeholder iteration log.

Full regeneration (all screens) is allowed only on explicit operator
request, and runs as N scoped passes, not one bulk rewrite.

## Sub-flow C — Raw-requirements intake (BA entry path)

Trigger: the BA supplies raw requirements / journey notes that have no KB
nodes yet. This is the `/ba-intake` command's procedure.

1. **Identify journeys** — one per end-to-end behavior an actor completes.
2. **Draft nodes** (`status: proposed`), templates under
   [`../_templates/nodes/`](../_templates/nodes/):
   - FLW per journey: Trigger + happy / edge / fault Scenarios + Journey
     walkthrough — business language only, no node IDs in the Phase-1 body
     (R-NEW-8 discipline applies even to pre-FRS drafts).
   - SCR per described surface: Description, Layout / UI intent, Display
     states; `shows:` / `invokes:` / `observes:` stay empty (Phase 2).
   - ACT only when the actor is absent from the ACT index.
3. **Clarify conversationally** — one question per turn (CLAUDE.md HR-ONE-Q):
   journey boundaries, actor identity, missing edge / fault behavior.
4. **BA approves drafts** before any canonical ingest; then proceed to
   Sub-flow A.

**HARD-GATE (type discriminator):** entity / command / contract signals in
the raw notes are flagged for FRS authoring — never drafted as FLW / SCR.
Intake produces only the business-facing types in
[`../KB-LAYOUT.md § Persona lens`](../KB-LAYOUT.md#persona-lens).

**Not a Phase 1 substitute.** Intake seeds proposed nodes for fast visual
validation; the FRS authored via [`design.md`](design.md) Phase 1 remains
the canonical, testable contract, and the `new-component-bootstrap` /
ID-ceiling rules apply unchanged when drafts land in `docs/`.

## Prompt-output conventions

When a generation pass is delivered as a *prompt* to a downstream
generator (an external prototyping agent, or a dispatched code-writing
sub-agent), the prompt follows this shape — each element exists to
bound regression risk, the same risk the anti-regression doctrine
bounds on the KB side:

1. **Goal first.** The first line states the observable end-state the
   user should see — the generator can sanity-check its own result
   against it.
2. **Meta-rationale.** One paragraph explaining the structural choices
   (component decomposition, fixture strategy, scope boundary) — so
   the generator follows the structure instead of improvising around it.
3. **Negative constraints.** A `## Do not change` block naming
   **specific files**, not categories. This is the prompt-side anchor
   of the overwrite guard (doctrine point 4): the biggest regression
   sources are named, not implied. Narrow deltas explicitly ("do not
   add tests beyond updating the existing mock") rather than blanket
   prohibitions.
4. **Verification checklist.** A `## Verify (observable)` block listing
   end-states checkable by running the prototype — routes render, click
   navigates, state displays — not internal code states the generator
   cannot reliably introspect.

## Post-generation quality check (advisory)

After Sub-flow A or B, optionally run the
[`prototype-eval-rubric.md`](prototype-eval-rubric.md) pass — scored
dimensions, severity-tiered findings, dated report in
`docs/prototypes/<slug>/`. Advisory by design: the adoption flip's gate
remains the consuming FRS at Phase 1.5 (see § Phase position), and
structural drift remains [`lint.md § prototype-drift`](lint.md#prototype-drift)'s
job. The eval informs the BA iteration loop (step 4 of § The BA loop).

## Phase position & the two-pass identity

- **Pre-FRS (Phase 0/1):** generation may run from proposed drafts. File
  identity = stable `<Module>.<Area>.<Screen>` from the PROTO `screens:`
  list; `@implements` carries that stable ID; `SCR.code_ref:` stays `[]`.
- **Phase 2 back-patch:** when SCR-NNN nodes are allocated (ingest), the
  same pass rewrites `@implements` to SCR-NNN, populates `code_ref:`
  (ADR-035), and fills the screen-index SCR column. One mechanical pass,
  verified by `kb:trace`.
- **Adoption flip:** at Phase 1.5 exit the consuming FRS reaches `approved`
  → PROTO `draft → adopted`, `adopted_into:` cites the FRS (2-file touch),
  exactly as [`prototype-first.md`](prototype-first.md) step 5. **After
  adoption the generator reads SCR/FLW nodes, never the PROTO descriptor**
  — the descriptor becomes a historical disposition; the KB is the contract.
- **Post-adoption changes** route through
  [`change-request.md`](change-request.md) (CHG delta on the touched SCR),
  then re-enter at Sub-flow B.

## API integration handoff

When Phase 3 implementation begins for adopted screens:

1. `SCR.code_ref:` populated and `kb:trace` green (back-patch complete).
2. Phase 2 has authored the CON nodes the screen `invokes:`.
3. The developer runs `/api-integration` per page: real service
   implementation behind the same interface the mock fills, `@endpoint` /
   permission docblocks, mode flip per
   `UI-REPO-CONTRACT.md § Mock / API mode switch`.

Cross-repo wiring mechanics are canonical in the
[`/api-integration` command](../../.claude/commands/api-integration.md) and
the ui repo's own contract file — not restated here.

## The BA loop (operating summary)

| Step | BA does | Engine does |
|---|---|---|
| 1 | Reads `docs/reports/JOURNEYS.md` (front door) | Regenerates it on demand ([`derived-reports.md`](derived-reports.md)) |
| 2 | Describes a journey / change in plain language (`/ba-intake`, or just talks) | Drafts FLW / SCR / ACT (Sub-flow C), asks one question per turn |
| 3 | Approves drafts | Runs Sub-flow A / B — scoped, catalog-first, fixture-shared |
| 4 | Reviews the prototype in the browser, iterates | Logs each round in the PROTO descriptor; scoped regeneration only |
| 5 | Says "approve for development" | FRS authoring (`/author-frs`) → Phase 1.5 → PROTO `adopted` flip |
| 6 | Describes post-adoption changes | CR track → CHG → scoped regeneration → FRS impact flagged |

The BA never authors frontmatter, allocates IDs, or opens technical nodes;
reading any business-facing node body directly is always fine
(Persona lens: authorship is governed, visibility is not).

## Integration

- **Callers:** [`/generate-prototype`](../../.claude/commands/generate-prototype.md)
  (Sub-flows A / B), [`/ba-intake`](../../.claude/commands/ba-intake.md)
  (Sub-flow C); [`design.md` Phase 0](design.md#phase-0--milestone-scoping)
  may delegate here when a brief warrants generated (rather than
  hand-built) visual validation.
- **Peer:** [`prototype-first.md`](prototype-first.md) — prototype→KB
  direction; its extraction rule book
  ([`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md))
  is NOT consulted here (nothing is mined — the KB is already the source).
- **Reads:** FLW / SCR / ACT / PERM per-type indexes;
  [`../_templates/PROTOTYPE.md`](../_templates/PROTOTYPE.md);
  [`../_templates/UI-REPO-CONTRACT.md`](../_templates/UI-REPO-CONTRACT.md).
- **Persona doctrine:**
  [`../KB-LAYOUT.md § Persona lens`](../KB-LAYOUT.md#persona-lens);
  BA front door template
  [`../_templates/OVERVIEW-JOURNEYS.md`](../_templates/OVERVIEW-JOURNEYS.md).
- **Drift detection:** [`lint.md § prototype-drift`](lint.md#prototype-drift)
  — structural KB↔prototype drift class; resolution re-enters at Sub-flow B.
- **Quality check (advisory):**
  [`prototype-eval-rubric.md`](prototype-eval-rubric.md) — scored
  evaluation after Sub-flow A / B; never gates the adoption flip.
