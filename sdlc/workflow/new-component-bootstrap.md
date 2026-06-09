---
applies_when:
  stack: [agnostic]
---

# New Standalone Component Bootstrap

> Procedure for declaring a new standalone deployable component in the
> workspace — choosing an `id_prefix`, creating `COMPONENT.md`,
> lazy-seeding the per-type `index.md` on first node,
> and registering the component in the three workspace-level indexes
> (`LAYOUT.md`, `CLAUDE.md ## Where to look`, `docs/home.md`).

> **HARD-GATE:** Do NOT ingest a node into a component path that does
> not yet have `docs/<component-slug>/COMPONENT.md` with `id_prefix:`
> set. Coining IDs (`<PREFIX>-<TYPE>-001`) without a declared prefix
> produces collisions with future components and leaves the per-type
> `index.md` orphaned. **Bootstrap runs before — never alongside — the
> first node ingest for the component.** Post-2026-05-17, the "first
> node ingest" trigger fires at **Phase 1** when a new component's
> introducing FRS allocates FLW-NNN per R-NEW-1 — not at Phase 2 as
> before. If an FRS introduces a new component via `produced_flw:`,
> bootstrap fires before the Phase-1 FLW file is written. (ACT-NNN ID
> claims via `produced_actor:` do NOT trigger Phase-1 bootstrap — ACT
> births at Phase 2; in an ACT-only-into-new-component case, bootstrap
> defers to Phase 2 alongside the ACT file authoring. R-NEW-2a retired
> 2026-05-17.) (Cross-cutting rule:
> [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
> "Every artifact has an ID and links upstream + downstream"; ID
> protocol requires the component declaration first.)

## When to Use

**Use when:** an incoming FRS / FS / absorption introduces nodes
belonging to a component that does not yet have a `COMPONENT.md`
file. Run this bootstrap in the same session as the work that
motivates it; finish bootstrap before the first node ingest.

**Trigger timing per phase** (post-2026-05-17):

- **Phase 1 (FRS authoring)** — if the FRS introduces a new component
  via its `produced_flw:` (FLW-NNN prefixed with the new component's
  `id_prefix:`), bootstrap fires before the FLW file is written. This
  is the new earliest trigger; under the pre-cutover model bootstrap
  fired only at Phase 2. (ACT-NNN ID claims via `produced_actor:` do
  NOT trigger Phase-1 bootstrap because the ACT file is not written
  at Phase 1 — R-NEW-2a retired 2026-05-17. Pure ACT-into-new-component
  cases route through the Phase 2 trigger below.)
- **Phase 2 (FS authoring)** — bootstrap fires if the FS introduces a
  new component via `produces_nodes:` (ACT / ENT / CMD / STA / … — or
  any NDF-declared custom-type abbreviation registered on the new
  component's `node_definitions:`) or via a Phase-2-born ACT (per the
  FRS's `produced_actor:`) and the component has not yet been
  bootstrapped at Phase 1 (i.e., the FRS this FS implements did not
  introduce a FLW into the new component, but Phase 2 does introduce a
  Phase-2-born node — including ACT or any NDF-declared node).
  Rare — most new components are introduced by an FRS that births at
  least one FLW.
- **Absorption** — bootstrap fires when a legacy doc absorption brings
  in nodes for a previously-undeclared component.

**Do NOT use when:** the new artifacts belong to an existing
component (just use that component's existing `id_prefix:` — IDs
claim themselves via per-type `index.md` / milestone folder globs
per R-NEW-9 amended 2026-05-17), or when extending the workflow
itself with a new node type for an existing component (load
[`evolving-the-workflow.md`](evolving-the-workflow.md) instead).

**Vs. sibling files:** [`evolving-the-workflow.md`](evolving-the-workflow.md)
coins new *types*; this file coins new *components* (which carry the
existing type set). [`legacy-absorption.md`](legacy-absorption.md)
may trigger a component bootstrap when an absorption introduces nodes
for an undeclared component.

When adding a new standalone deployable component to the workspace:

> **When this fires:** Before the first canonical node ingest into a new
> component path — Phase 1 (FRS authoring, when `produced_flw:` carries
> the new component's prefix), Phase 2 (FS authoring, when
> `produces_nodes:` introduces Phase-2-born nodes — including a
> Phase-2-born ACT per `produced_actor:` — into the new component), or
> absorption (legacy doc bringing nodes in).
> Run this bootstrap in the same session as the work that motivates it;
> do not ingest nodes for an undeclared component at any phase.

---

## Step 1 — Declare the component

1. Choose a unique 2–4 char uppercase prefix (check `id_prefix:` in all existing
   `docs/*/COMPONENT.md` files — no duplicates allowed across the workspace).
2. Create `docs/<component-slug>/COMPONENT.md` from
   [`sdlc/_templates/COMPONENT.md`](../_templates/COMPONENT.md).
   Set: `id_prefix`, `title`, `type: standalone`, `depends_on`,
   `node_definitions:` (list of `{PREFIX}-NDF-NNN` IDs the component will
   author for custom node types — empty list `[]` is the default; populated
   only when the component coins NDFs per
   [`STD-007`](../standards/STD-007-ndf-governance.md)
   and the NDF shape-coverage HARD-GATE in
   [`evolving-the-workflow.md`](evolving-the-workflow.md)).

## Step 2 — Create the initial node folders (lazy)

Only create type folders you need immediately:

```
docs/<component-slug>/nodes/<type>/
```

Each type folder gets `index.md` from
[`sdlc/_templates/INDEX.md`](../_templates/INDEX.md).

## Step 3 — Register the component globally

- Add a row to the **Component inventory table** in `sdlc/LAYOUT.md`.
- Add the component path to the `## Where to look` section in `CLAUDE.md`.
- Update `docs/home.md` with a component entry in the Module Inventory section
  (create the section if it does not yet exist).

## Step 4 — Coin first nodes

All new nodes use prefixed IDs: `{PREFIX}-{TYPE}-001`, `{PREFIX}-{TYPE}-002`, etc.

IDs are globally unique — check `docs/home.md` ID high-water marks and
the per-(component, type) `index.md` ceiling before minting (R-NEW-9
amended 2026-05-17 — `id-claims.md` is no longer the introduce ceiling).

Start numbering from 001 within each type per component — `<NEW>-CON-001` is
independent of `APP-CON-001` (though in practice the `app` component uses
unqualified IDs like `CON-001`).

## Step 5 — Declare depends_on

If this component's nodes reference nodes in other components by ID (e.g., a
`<NEW>-FLW-001` flow references `CON-010` from the `app` component), declare
those components in `COMPONENT.md` `depends_on: [app]`.

---

## Anti-Pattern: "The Implicit Component"

Beginning to ingest nodes with a new `id_prefix:` — typing `<NEW>-CON-001`,
`<NEW>-FLW-001` into Phase 2 deliverables — without first creating
`docs/<component-slug>/COMPONENT.md`. The temptation: the component is
"obvious from context", the FRS already names it, and stopping to
file the descriptor feels like ceremony. The cost: the `id_prefix:`
isn't reserved against duplicates, the per-type `index.md` doesn't
exist when the first node lands, the registration in `LAYOUT.md` /
`CLAUDE.md` / `docs/home.md` is missing, and the component drifts
in as a parallel naming convention rather than a declared structure.
**Components are declared before they are used.** If the FRS names a
new component, bootstrap is the first operation of the session —
before ID claims, before ingest. Doctrinal anchor:
[`../PRINCIPLES.md`](../PRINCIPLES.md) — *Inventing structure as you
go.*

---

## Component bootstrap checklist

- [ ] `docs/<component-slug>/COMPONENT.md` created with `id_prefix:` set
- [ ] `docs/<component-slug>/COMPONENT.md` `node_definitions:` populated
      (list of NDF IDs the component will author, or `[]` if none)
- [ ] At least one `nodes/<type>/` folder created (only types needed immediately)
- [ ] `index.md` created in each type folder
- [ ] Component inventory table in `sdlc/LAYOUT.md` updated
- [ ] `CLAUDE.md` `## Where to look` updated
- [ ] `docs/home.md` Module Inventory updated

---

## Shared component bootstrap (one-time)

The `shared/` component is the workspace-level home for:
- Cross-component ADRs (ADRs constraining interfaces between ≥2 components)
- `glossary.md`, `ccc/` (CCC tree, entry at `docs/shared/ccc/index.md`), `tech-stack.md`
- `overview/` derived reports

`shared/` does not have a `nodes/` sub-tree or an `id_prefix`. Its `adrs/`
folder starts empty and receives ADRs only when a decision spans ≥2 components
(use the ADR discriminator in `workflow/authoring-adr.md`).

Bootstrap `shared/` exactly once, before or alongside the first standalone
component that also needs cross-component ADRs.

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Every artifact has an ID and links upstream + downstream" is the
  doctrinal anchor of this flow's HARD-GATE; ID-prefix uniqueness is
  the workspace contract.
- **Required before:** [`../LAYOUT.md`](../LAYOUT.md) — Component
  inventory table (this bootstrap registers a row there).
- **Required before:** [`../BOUNDARY.md`](../BOUNDARY.md) —
  engine-vs-project axis (the new component is project-level; the
  bootstrap procedure is engine-level).
- **Rule books wholesale-read during this op:**
  [`maintenance-discipline.md`](maintenance-discipline.md) — lazy
  creation of the per-type `index.md` on first node
  (`created` op).
- **Callers (this file is wholesale-read by):**
  [`design.md`](design.md) (Phase 1 FRS introduces a new component via
  `produced_flw:` — runs FIRST, before any Phase-1 FLW ingest;
  post-2026-05-17 earliest trigger per R-NEW-1; `produced_actor:`
  alone does not trigger Phase-1 bootstrap because ACT births at
  Phase 2),
  [`plan.md`](plan.md) (Phase 2 FS introduces a new component — runs
  FIRST, before any Phase-2 node ingest; fallback when the FRS did not
  trigger bootstrap),
  [`legacy-absorption.md`](legacy-absorption.md) (an absorption pass
  brings in nodes for a previously-undeclared component).
- **Routes to:** [`../_templates/COMPONENT.md`](../_templates/COMPONENT.md)
  for the descriptor template;
  [`maintenance-discipline.md`](maintenance-discipline.md) for the
  first-node touch.
- **Sibling rule books:**
  [`authoring-adr.md`](authoring-adr.md),
  [`evolving-the-workflow.md`](evolving-the-workflow.md),
  [`maintenance-discipline.md`](maintenance-discipline.md),
  [`legacy-absorption.md`](legacy-absorption.md).
