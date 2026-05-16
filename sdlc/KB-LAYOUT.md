---
name: kb-layout
description: "Canonical DDD wiki folder structure, node-type table, ID-prefix list, lazy-creation rules, and external research tree. Load when you need to know where a node type lives, what prefix it uses, or how the canonical wiki is organized."
---

# KB-LAYOUT — Knowledge Base Layout

DDD content lives in **component-qualified canonical wikis** at
`docs/<component>/nodes/`. New nodes land there at Phase 2 with
`status: proposed`; Phase 3 flips them to `active`. The only
milestone-scoped DDD artifact is the CHG-NNN change-map at
`milestones/M-NN-<slug>/specs/FS-NNN-<slug>/nodes/changes/CHG-NNN-<slug>.md`,
which documents modify-intent against existing canonical nodes and
stays permanently in the milestone folder (never promoted).

When a new component is introduced, run
[`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md)
**before** Phase 2 ingest to declare the component and create its type folders.

## Node type folder tree

```
docs/<component>/nodes/             # canonical wiki (one per component)
  actors/             ACT-NNN-*.md  (or {PREFIX}-ACT-NNN-*.md for prefixed components)
  entities/           ENT-NNN-*.md
  commands/           CMD-NNN-*.md  # write operations (state changes)
  queries/            QRY-NNN-*.md  # read operations (lazy)
  flows/              FLW-NNN-*.md
  states/             STA-NNN-*.md
  decisions/          DEC-NNN-*.md
  integrations/       INT-NNN-*.md
  modules/            MOD-NNN-*.md  # bounded context (engineering-facing)
  screens/            SCR-NNN-*.md  # conceptual UI surface
  contracts/          CON-NNN-*.md  # inter-component surface — HTTP / events / queue / gRPC
                                    # (discriminated by frontmatter protocol:)
  permissions/        PERM-NNN-*.md # first-class authorization rules
  services/           SVC-NNN-*.md  # deployable unit (lazy; multi-service projects only)
  functional-areas/   FA-NNN-*.md   # cross-MOD product slice (lazy)
  events/             EVT-NNN-*.md  # async/distributed events — Kafka + RabbitMQ (lazy)
```

The lazy folders (`queries/`, `modules/`, `screens/`, `contracts/`,
`permissions/`, `services/`, `functional-areas/`, `events/`) are created **lazily
on first Phase 2 ingest of that type.**

Each node-type folder gets only an `index.md` companion (no `log.md`) — per the
2026-05-16 rule change in
[`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md).
Per-type node logging was dropped; ADR and research `log.md` files are retained.

## Node-type discriminators

**MOD** is the bounded-context node (engineering-facing); cross-MOD product
slices are **FA** nodes; deployable units realizing a MOD are **SVC** nodes.

**CMD vs QRY**: a command changes state and has postconditions / domain events;
a query reads state and produces a projection with no side effects. Read
operations belong in QRY — never shoehorn them into CMD.

**Boundary cases — worked examples:**

| Operation | Classification | Why |
|---|---|---|
| `CancelOrder` reads the order to validate state, then writes the cancellation | **CMD** | The persistent side-effect (state change + domain event) is the deliverable. The read is internal scaffolding for the write — model it inline in the CMD's "Preconditions" section, not as a separate QRY. |
| `GetActiveOrders` reads and increments a "last-accessed" telemetry counter | **QRY** | Telemetry/cache writes are non-domain side effects. Note them in the QRY's "Side effects" sub-section if non-trivial; they do NOT promote the operation to CMD. |
| `SnapshotInventory` reads inventory + writes a snapshot row to a history table | **CMD** | The snapshot row is a domain-meaningful write (new persistent record). Even though the user perceives it as "read," the write is the load-bearing effect. |
| `RecalculateBalance` reads transactions, computes a balance, returns it without persisting | **QRY** | Computation does not promote to CMD. If the computed value is later persisted by a separate operation, that operation is the CMD. |
| `ListUsers` with paging cursor stored server-side per session | **QRY** | Session-scoped cursor state is not domain state. If the cursor is persisted to a domain table (e.g., "saved searches"), the save operation is a separate CMD. |

**Rule of thumb**: if the operation's reason-for-existing is a domain
write, it is a CMD — even if a read is the first step. If the
reason-for-existing is to return a projection, it is a QRY — even if a
cache or telemetry write happens alongside. The user-visible deliverable
decides, not the implementation steps.

**CON** is the unified contract surface — HTTP routes, event topics, queues,
gRPC methods — discriminated by `protocol:` frontmatter; superseded the
prior EP (endpoint) prefix on 2026-05-14.

**EVT** is the async-event catalog — distributed events published to Kafka
topics or RabbitMQ exchanges; in-process framework-local events are NOT EVT
nodes (they stay in CMD's "Domain events raised" subsection). Every EVT node
requires a `linked_contract: CON-NNN` pointing at its transport surface.

ID prefixes are intentionally short — they appear in every cross-reference.

There is no canonical `docs/<component>/nodes/changes/` folder — CHG-NNN nodes
live permanently under the milestone's FS folder. See
[`workflow/in-flight-nodes.md`](workflow/in-flight-nodes.md)
for how new nodes and CHGs interact across Phase 2 and Phase 3.

If your existing nodes use different filenames, prefixes, or folder structure,
**keep your existing convention.** The templates are scaffolding for new nodes;
they should not retrofit existing ones.

## External research (parallel to nodes)

`docs/research/` is a parallel canonical tree for **external / competitive
research** — vendor docs, industry papers, competitor wikis, domain
whitepapers — that inform future ADRs and FRSs. It is not DDD content
and does not live under `docs/<component>/nodes/`.

```
docs/research/                    # canonical research tree (lazy)
  index.md                        # Karpathy-style content catalog
  log.md                          # append-only chronological record
  RESEARCH-NNN-<slug>.md          # individual pages, narrow-loaded
```

Lazy-create the folder + `index.md` + `log.md` pair on first
`RESEARCH-NNN` instance, per
[`workflow/maintenance-discipline.md → Lazy creation`](workflow/maintenance-discipline.md).
RESEARCH entries are *cited references*: ADRs and FRSs link by ID
rather than restating content. Lifecycle: `raw` → `synthesized` →
`superseded`. Template:
[`_templates/RESEARCH.md`](_templates/RESEARCH.md).

## Cross-cutting concerns (parallel to nodes)

`docs/shared/ccc/` is a parallel canonical tree for **project-wide NFR
baseline defaults** — auth, audit, retention, observability, multi-tenancy,
soft-delete, exception handling, validation, localization, caching,
background jobs, distributed events, session management. It is not DDD
content and does not live under `docs/<component>/nodes/`.

```
docs/shared/ccc/                # canonical CCC tree
  index.md                      # Karpathy-style content catalog
  log.md                        # append-only chronological record
  CCC-NNN-<slug>.md             # individual pages, narrow-loaded
```

CCC entries are *cited references*: FRSs and ADRs link by ID rather than
restating content. Lifecycle: `proposed → accepted → superseded |
deprecated`. Per-CCC page template:
[`_templates/CROSS-CUTTING-CONCERNS.md`](_templates/CROSS-CUTTING-CONCERNS.md)
(one file per concern; the retired v0.1 flat doc is not a template).
ADRs that override a CCC default carry `related: [CCC-NNN]`.

---

## Integration

**Canonical home of:** the component wiki folder structure, node-type table,
ID-prefix list, lazy-creation rules, and external research tree.

**Parent:** [`WORKFLOW.md → Knowledge base layout`](WORKFLOW.md#knowledge-base-layout) —
WORKFLOW.md carries the always-loaded summary; this file is the full reference.

**Edit target:** when coining a new node type, append the new type's folder
row here (see [`workflow/evolving-the-workflow.md`](workflow/evolving-the-workflow.md)
for the full procedure).

**Sibling:** [`LAYOUT.md`](LAYOUT.md) — physical workspace folder map;
[`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md) —
procedure for registering a new component.
