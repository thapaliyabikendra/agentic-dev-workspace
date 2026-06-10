---
name: ui-repo-contract
description: "Engine-prescribed ui-repo conventions: mock/API mode switch, @implements docblocks, shared entity fixtures, component catalog, screen index, kb:trace gate. Copy to ui/docs/PROTOTYPE-API-INTEGRATION.md at ui-repo bootstrap; the project copy is the runtime canonical."
---

# UI Repo Contract — engine-prescribed conventions

> **Template.** Copy to `ui/docs/PROTOTYPE-API-INTEGRATION.md` when
> bootstrapping the ui repo, then adapt the reference shapes to the
> project's UI stack (ADR-040 owns the stack choice). At runtime the
> **project copy wins**; reconcile divergence back into this template
> only when it proves cross-project useful. Consumed by
> [`../workflow/prototype-generation.md`](../workflow/prototype-generation.md)
> (generation side) and the `/api-integration` command (wiring side).
> Framework-agnostic rules below; the inline snippets are a React + TS
> reference shape — Angular projects swap the service locator for DI
> tokens; the **docblock contract is the uniformity anchor, not the
> injection mechanism**.

## Mock-mode conventions

1. **`@implements` docblock.** Every file realizing a KB screen opens with
   `/** @implements SCR-NNN — <screen title> */`. Pre-Phase-2 (no SCR-NNN
   allocated yet) the stable `<Module>.<Area>.<Screen>` ID from the PROTO
   descriptor stands in; the Phase-2 back-patch rewrites it
   ([`../workflow/prototype-generation.md § Phase position`](../workflow/prototype-generation.md#phase-position--the-two-pass-identity)).
2. **Service layer only.** Components never call `fetch`/HTTP clients
   directly — all data flows through a per-screen service interface, so
   mock and real implementations are swappable without touching the
   component.
3. **No mock/real branching in components.** The component asks the
   registry for its service and renders; which implementation answers is
   the registry's concern.
4. **All four display states.** Every screen explicitly renders
   `empty | loading | error | unauthorized`. Scaffold-enforced, never
   bolted on later.

## Mock / API mode switch

One registry (service locator or DI container), one env flag:

```ts
// src/services/registry.ts
const isMock = import.meta.env.VITE_MOCK_MODE === 'true';
export function getService<T>(screenId: string): T {
  return (isMock ? mockRegistry : realRegistry)[screenId] as T;
}
```

- Mock mode = prototype posture; API mode = integrated posture.
- Per-screen override (`VITE_MOCK_SCR_042=true`) is a permitted project
  extension (lets integrated screens coexist with still-mock ones during
  incremental `/api-integration`); record it as a project ADR if adopted.

## Service layer

Per screen: one interface, two implementations.

```ts
/** @implements SCR-042 — Invoice Export */
export interface IInvoiceExportService {
  getInvoices(filter: InvoiceFilter): Promise<Invoice[]>;
  exportInvoices(ids: string[], format: ExportFormat): Promise<ExportResult>;
}
```

- Interface methods derive from `SCR.invokes:` (CON nodes) once Phase 2
  has run; pre-FRS they derive from the FLW scenarios.
- Mock implementation reads shared entity fixtures (below). Real
  implementation is authored at `/api-integration` time, carries
  `@endpoint` docblocks per method, and registers beside the mock.

## Shared entity fixtures

Mock data is **per business entity, never per screen** — list and detail
screens derive views from the same records, so cross-screen data can
never contradict.

```ts
// src/__mocks__/Invoice.fixtures.ts
/** @entity-shape ENT-012 (version: 3) */
export const invoiceFixtures: Invoice[] = [ /* ... */ ];
```

- One fixture file per entity under `src/__mocks__/`; screens import and
  filter/slice — never inline mock data in a component or duplicate a
  fixture.
- The `@entity-shape ENT-NNN (version: N)` docblock pins the ENT node
  version; `kb:trace` flags a mismatch as `prototype-drift`
  ([`../workflow/lint.md § prototype-drift`](../workflow/lint.md#prototype-drift)).
  Pre-Phase-2 (no ENT yet) omit the docblock; the back-patch pass adds it.

## Component catalog

`ui/src/components/CATALOG.md` — the authoritative shared-component list:

| Component | Path | Appears in (SCR / screen IDs) | Props contract (one line) | Notes |
|---|---|---|---|---|

- The generator reads the catalog **before** scaffolding anything; a
  component with the same visual role is imported, never re-invented.
  New components get a row in the same pass.
- Developer-editable (hand-built components belong here too); every row
  must resolve to an existing file — `kb:trace` checks.

## Uniformity lint

Cross-module imports are blocked (ESLint `no-restricted-imports` or
equivalent): a file under `src/<module-A>/` may not import from
`src/<module-B>/` — shared pieces go through `src/components/` (the
catalog). This kills the "same component implemented differently in two
modules" failure mode mechanically. Engine standard behind this rule —
and the wider component-architecture discipline (single authority file,
state seam, scoped change, prohibitions):
[`../standards/STD-008-ui-component-architecture.md`](../standards/STD-008-ui-component-architecture.md);
this file does not restate it.

## Scaffold

New screens are born from the project scaffold (plop or equivalent), never
hand-assembled. One scaffold run emits: screen file (docblock + four
display states + registry lookup) · service interface · mock
implementation wired to entity fixtures · screen-index entry · catalog
row for any new component. Uniformity at birth is cheaper than lint
repair later.

## Screen index

```ts
// src/screens/index.ts
export const SCREEN_INDEX: Record<string, { path: string; scr?: string }> = {
  'Billing.Invoice.Export': { path: 'src/screens/billing/invoice/Export.tsx', scr: 'SCR-042' },
};
```

Keyed by stable `<Module>.<Area>.<Screen>` ID; the `scr` column fills at
the Phase-2 back-patch. This map is the machine-readable join surface
`kb:trace` walks.

## kb:trace

`bun run kb:trace` (or project equivalent) is the drift gate — run after
every generation pass and before declaring an `/api-integration` page
done:

1. Walk `SCREEN_INDEX`; every entry's `path` resolves to a file.
2. Every resolved file's `@implements` ID matches the entry (and the
   SCR-NNN node in `docs/<component>/nodes/screens/` once allocated).
3. Every `SCR.code_ref:` path resolves back to a file (ADR-035 join).
4. Every fixture's `@entity-shape` version matches its ENT node.
5. Report: **0 broken, 0 dangling** — anything else is `prototype-drift`.

## Contract-first inversion (BFF posture)

The prototype does more than render — it **proposes the API contract**,
and the backend honors that proposal. Method, path, DTO shape, portal,
and permission are design decisions largely deterministic at prototype
time; declaring them in the screen's docblock makes the proposal
machine-checkable, so *a forgotten contract slot fails the build
instead of shipping silently*.

Tag vocabulary (per data-bound screen file):

| Tag | Cardinality | Backing rule (what must resolve, or the gate fails) |
|---|---|---|
| `@implements SCR-NNN` / `@exploration EXP-<slug>` | exactly one | SCR node exists (or EXP registered per the exploration discipline) |
| `@portal <name>` | 0..1 | named audience surface exists in the route map |
| `@endpoint <VERB> <path> -> <DtoName>` | one per API path used | at `/api-integration` time: DTO defined + real caller present + backend handler present (CON node is the KB-side anchor) |
| `@permission <policy-string>` | one per gated action | entry in the permission catalog; string byte-identical to the backend's (PERM node is the source) |

- **Presence, not absence.** A file need not carry a tag; any tag it
  carries must resolve. The check (`kb:trace` / build gate) fires on
  declared-but-unresolved slots — that is what makes the declaration
  mean something.
- **The seam asymmetry.** The API seam is generation-transparent (mock
  mode makes it invisible to the generator). The **permission seam is
  NOT** — a permission encodes authorization intent, which action needs
  which policy, and that is not inferable from markup. No tool adds it;
  it is declared deliberately, per gated affordance.
- Pre-Phase-2 (no CON/PERM nodes yet) the `@endpoint` / `@permission`
  tags may be absent; the `/api-integration` pass adds them. The
  back-patch never *removes* a resolving tag.

## Extension protocol

Designated extension points (service registry, mock registry, fixture
factory, screen index) are documented with three elements: **what the
extension point is · the exact file/call to extend · what does NOT
need touching** ("the registry lookup means `<shell file>` does not
need touching when adding a screen service"). The negative clause is
the isolation contract — it stops cargo-cult edits to files the
extension was designed to leave alone.

Docblocks and KB node `code_ref:` notes cite **code-level symbols**
(constant names, function names, type names) alongside behavior —
`@implements SCR-042 — uses IInvoiceExportService` — symbol citations
make the doc↔code link machine-verifiable rather than prose-matched.

## Permission guards

Role-gated affordances wrap in the project's permission-guard component;
the permission string is byte-identical to the backend's (PERM node is
the source; the CON node carries it for the endpoint). Declared per
method as `@permission` docblocks at `/api-integration` time.

## Bootstrap checklist

- [ ] Copy this file to `ui/docs/PROTOTYPE-API-INTEGRATION.md`; adapt
      snippets to the stack (ADR-040).
- [ ] Copy [`UI-GUIDELINES.md`](UI-GUIDELINES.md) into the ui repo;
      fill the token catalog; wire its literal-value detection into the
      verify script.
- [ ] Register the ui repo in `docs/project.md § Components`.
- [ ] Implement the service registry + `VITE_MOCK_MODE` flag.
- [ ] Create `src/__mocks__/`, `src/screens/index.ts`,
      `src/components/CATALOG.md`.
- [ ] Wire the cross-module-import lint rule.
- [ ] Add the scaffold (plop or equivalent) emitting the § Scaffold set.
- [ ] Implement `kb:trace` and add it to the repo's verify script.
- [ ] First screen generated via
      [`/generate-prototype`](../../.claude/commands/generate-prototype.md)
      — confirm docblock, fixtures, index entry, catalog row, trace green.
