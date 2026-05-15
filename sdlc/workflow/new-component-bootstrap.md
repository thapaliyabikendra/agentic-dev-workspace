# New Standalone Component Bootstrap

> Procedure for declaring a new standalone deployable component in the
> workspace — choosing an `id_prefix`, creating `COMPONENT.md`,
> lazy-seeding the per-type `index.md` + `log.md` pair on first node,
> and registering the component in the three workspace-level indexes
> (`LAYOUT.md`, `CLAUDE.md ## Where to look`, `docs/home.md`).

> **HARD-GATE:** Do NOT ingest a node into a component path that does
> not yet have `docs/<component-slug>/COMPONENT.md` with `id_prefix:`
> set. Coining IDs (`<PREFIX>-<TYPE>-001`) without a declared prefix
> produces collisions with future components and leaves the index/log
> pair orphaned. **Bootstrap runs before — never alongside — the
> first node ingest for the component.** (Cross-cutting rule:
> [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
> "Every artifact has an ID and links upstream + downstream"; ID
> protocol requires the component declaration first.)

## When to Use

**Use when:** an incoming FS / FRS / absorption introduces nodes
belonging to a component that does not yet have a `COMPONENT.md`
file. Run this bootstrap in the same session as the work that
motivates it; finish bootstrap before the first node ingest.

**Do NOT use when:** the new artifacts belong to an existing
component (just use that component's existing `id_prefix:` and
register IDs in the milestone's `id-claims.md`), or when extending
the workflow itself with a new node type for an existing component
(load [`evolving-the-workflow.md`](evolving-the-workflow.md) instead).

**Vs. sibling files:** [`evolving-the-workflow.md`](evolving-the-workflow.md)
coins new *types*; this file coins new *components* (which carry the
existing type set). [`legacy-absorption.md`](legacy-absorption.md)
may trigger a component bootstrap when an absorption introduces nodes
for an undeclared component.

When adding a new standalone deployable component to the workspace:

> **When this fires:** Before Phase 2 ingest whenever the incoming FS introduces
> nodes belonging to a new component that does not yet have a `COMPONENT.md`. Run
> this bootstrap in the same session as Phase 2 ingest; do not ingest nodes for
> an undeclared component.

---

## Step 1 — Declare the component

1. Choose a unique 2–4 char uppercase prefix (check `id_prefix:` in all existing
   `docs/*/COMPONENT.md` files — no duplicates allowed across the workspace).
2. Create `docs/<component-slug>/COMPONENT.md` from
   [`sdlc/_templates/COMPONENT.md`](../  _templates/COMPONENT.md).
   Set: `id_prefix`, `title`, `type: standalone`, `depends_on`.

## Step 2 — Create the initial node folders (lazy)

Only create type folders you need immediately:

```
docs/<component-slug>/nodes/<type>/
```

Each type folder gets `index.md` and `log.md` from
[`sdlc/_templates/INDEX.md`](../_templates/INDEX.md) and
[`sdlc/_templates/LOG.md`](../_templates/LOG.md).

## Step 3 — Register the component globally

- Add a row to the **Component inventory table** in `sdlc/LAYOUT.md`.
- Add the component path to the `## Where to look` section in `CLAUDE.md`.
- Update `docs/home.md` with a component entry in the Module Inventory section
  (create the section if it does not yet exist).

## Step 4 — Coin first nodes

All new nodes use prefixed IDs: `{PREFIX}-{TYPE}-001`, `{PREFIX}-{TYPE}-002`, etc.

IDs are globally unique — check `docs/home.md` ID high-water marks and
`docs/milestones/M-NN/id-claims.md` before minting.

Start numbering from 001 within each type per component — `FDE-CON-001` is
independent of `APP-CON-001` (though in practice the `app` component uses
unqualified IDs like `CON-001`).

## Step 5 — Declare depends_on

If this component's nodes reference nodes in other components by ID (e.g., a
`FDE-FLW-001` flow references `CON-010` from the `app` component), declare
those components in `COMPONENT.md` `depends_on: [app]`.

---

## Anti-Pattern: "The Implicit Component"

Beginning to ingest nodes with a new `id_prefix:` — typing `FDE-CON-001`,
`FDE-FLW-001` into Phase 2 deliverables — without first creating
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
- [ ] At least one `nodes/<type>/` folder created (only types needed immediately)
- [ ] `index.md` and `log.md` created in each type folder
- [ ] Component inventory table in `sdlc/LAYOUT.md` updated
- [ ] `CLAUDE.md` `## Where to look` updated
- [ ] `docs/home.md` Module Inventory updated

---

## Shared component bootstrap (one-time)

The `shared/` component is the workspace-level home for:
- Cross-component ADRs (ADRs constraining interfaces between ≥2 components)
- `glossary.md`, `cross-cutting-concerns.md`, `tech-stack.md`
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
  creation of the per-type `index.md` + `log.md` on first node
  (`created` op).
- **Callers (this file is wholesale-read by):**
  [`plan.md`](plan.md) (Phase 2 FS introduces a new component — runs
  FIRST, before any node ingest),
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
