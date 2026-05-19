---
name: kb-layout
description: "Canonical DDD wiki folder structure, node-type table, ID-prefix list, lazy-creation rules, and external research tree. Load when you need to know where a node type lives, what prefix it uses, or how the canonical wiki is organized."
---

# KB-LAYOUT — Knowledge Base Layout

DDD content lives in **component-qualified canonical wikis** at
`docs/<component>/nodes/`. New nodes land there at Phase 2 with
`status: proposed`; Phase 3 flips them to `active`. The only
milestone-scoped DDD artifact is the CHG-NNN change-map, born at Phase 1
per FRS (when `touches_nodes:` is non-empty) at
`milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` (CR track:
`docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md`) — documents
modify-intent against existing canonical nodes and stays permanently in
the milestone folder (never promoted). Pre-cutover CHGs at
`milestones/M-NN-<slug>/specs/FS-NNN-<slug>/nodes/changes/` are
grandfathered.

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

This is the **engine-default 15-type catalog**. Per-component custom node
types are declared via NDF (Node Definition Node) per
[`ADR-039`](../docs/shared/adrs/ADR-039-ndf-fifth-governance-kind.md) and
live under `docs/<component>/node-definitions/` (per-component) or
`docs/shared/node-definitions/` (cross-component promotion). See
`## Node definitions (per-component custom types)` below.

Each node-type folder gets only an `index.md` companion (no `log.md`) — per the
2026-05-16 rule change in
[`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md).
All canonical `log.md` companions (nodes, ADRs, CCCs) were retired on
2026-05-16; chronological audit is git history. Research
(`docs/research/log.md`) and standards (`sdlc/standards/log.md`) logs are
retained.

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

**STA vs. inline-on-entity**: model lifecycle as a standalone STA node
when the state machine has structure worth enforcing; keep it inline on
the entity (Fields row + Invariants + Lifecycle subsection) when it is a
single flag with one transition and nothing else to enforce.

**Mint STA when ANY of:**

- The entity has ≥3 named states.
- ≥2 transitions exist (forward + inverse, branching forks, or compensating reversals).
- A transition has a named guard beyond the triggering CMD's preconditions.
- A transition raises a domain event consumed by another node.
- A terminal state needs explicit `read-only` / `soft-delete` / `archival` semantics.
- Illegal transitions need to be explicitly rejected (not merely "not triggered").

**Keep inline when ALL of:**

- ≤2 states (typically a boolean flag).
- Exactly 1 transition (one CMD flips it; no inverse in scope).
- No named guards beyond the triggering CMD's preconditions.
- No domain event raised on transition.
- No terminal state with non-trivial handling.

**Boundary cases — worked examples:**

| Entity / lifecycle | Classification | Why |
|---|---|---|
| `UserAccount.EmailConfirmed: false → true` (one CMD flips it, no inverse, no domain event consumed, no terminal semantics) | **Inline** | Single boolean, single transition. STA file would be a 1-row Transitions table with empty Illegal / Terminal sections — ceremonial. |
| `Order: draft → submitted → fulfilled → cancelled`, where `cancelled` blocks further writes | **STA** | 4 states; ≥3 transitions; terminal-state semantics on `cancelled` (`read-only`); illegal transitions like `fulfilled → draft` must be rejected. |
| `Subscription: active ↔ paused` (forward + inverse via separate CMDs) | **STA** | The inverse transition takes it past 1 transition; STA's Transitions table is needed to enumerate both directions explicitly (the entity's `Lifecycle` subsection cannot model two reciprocal CMDs without ambiguity about which is the "Modified by" entry). |
| `Document.Archived: false → true` raising `DocumentArchived` consumed by a retention purger | **STA** | Single transition crosses the threshold because the raised domain event has a consumer — the `Event raised` column on STA's Transitions table is load-bearing. |
| `Account.LockedOut: false → true` set by a failed-login counter, auto-cleared by a timeout | **STA** | The inverse transition fires by a non-CMD trigger (timeout / background job); the guard ("timeout elapsed") is not a CMD precondition. |

**Rule of thumb**: count states, transitions, guards, and consumed
events. If the STA file would be a single-row Transitions table with
empty Illegal / Terminal sections, keep inline. The first 3rd state,
second transition, named non-CMD guard, or consumed domain event flips
the call.

**Promotion path**: when an inline lifecycle crosses the threshold in a
later milestone (e.g., M-NN adds account-lockout to an entity that
previously had only `EmailConfirmed`), the FRS introducing the
threshold-crossing state declares `STA-NNN` in `produces_nodes:`,
Phase 2 ingest authors the STA node, and the entity's inline `Lifecycle`
subsection flips `State machine: none` to `State machine: STA-NNN`.
Phase 1.5 enforcement: [`workflow/frs-validation-rules.md → Rule:
state-promotion-deferred`](workflow/frs-validation-rules.md#rule-state-promotion-deferred).

**CON** is the unified contract surface — HTTP routes, event topics, queues,
gRPC methods — discriminated by `protocol:` frontmatter; superseded the
prior EP (endpoint) prefix on 2026-05-14.

**EVT** is the async-event catalog — distributed events published to Kafka
topics or RabbitMQ exchanges; in-process framework-local events are NOT EVT
nodes (they stay in CMD's "Domain events raised" subsection). Every EVT node
requires a `linked_contract: CON-NNN` pointing at its transport surface.

ID prefixes are intentionally short — they appear in every cross-reference.

**Counter scope.** Each (component, type) pair owns an independent counter:
`docs/<component>/nodes/<type>/index.md` is the authoritative ID ceiling.
Single-component projects use the unqualified form (`ACT-NNN`, `CMD-NNN`, …).
Multi-component projects introduce the `{COMPONENT-PREFIX}-` qualifier
lazily — only when a cross-component collision would otherwise occur.
Milestone-scoped [`id-claims.md`](workflow/plan.md#2-id-claim-protocol)
captures `op: modify` (cross-FS modify-intent on existing canonical) and
`op: released` (abandoned ACT-NNN claims) rows only — R-NEW-9 amended
2026-05-17, no `op: introduce` rows written. It is not the ceiling
source for any ID type.

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
  log.md                          # append-only chronological record (retained)
  RESEARCH-NNN-<slug>.md          # individual pages, narrow-loaded
```

Research is one of the two surviving `log.md` surfaces (the other is
`sdlc/standards/log.md`). Lazy-create the folder + `index.md` + `log.md`
pair on first `RESEARCH-NNN` instance, per
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
  CCC-NNN-<slug>.md             # individual pages, narrow-loaded
```

No `ccc/log.md` — chronological audit is git history (canonical `log.md`
retired 2026-05-16).

CCC entries are *cited references*: FRSs and ADRs link by ID rather than
restating content. Lifecycle: `proposed → accepted → superseded |
deprecated`. Per-CCC page template:
[`_templates/CROSS-CUTTING-CONCERNS.md`](_templates/CROSS-CUTTING-CONCERNS.md)
(one file per concern; the retired v0.1 flat doc is not a template).
ADRs that override a CCC default carry `related: [CCC-NNN]`.

## Node definitions (per-component custom types)

`docs/<component>/node-definitions/` is a parallel canonical tree for
**per-component custom node-type declarations** — Algorithm nodes,
Scenario nodes, Store nodes, etc. — for shapes the engine-default 15-type
catalog does not carry naturally. NDF (Node Definition Node) is the fifth
governance kind alongside STD / ADR / CCC / DEC, per
[`ADR-039`](../docs/shared/adrs/ADR-039-ndf-fifth-governance-kind.md).

```
docs/<component>/node-definitions/   # per-component NDF tree (lazy)
  index.md                           # Karpathy-style content catalog
  {PREFIX}-NDF-NNN-<slug>.md         # NDF instances; instances of the
                                     # declared type live under
                                     # docs/<component>/nodes/<folder>/
                                     # per the NDF's `folder:` field

docs/shared/node-definitions/         # cross-component promotions (lazy)
  index.md
  NDF-NNN-<slug>.md                  # unprefixed after promotion ADR
```

No `node-definitions/log.md` — chronological audit is git history (canonical
`log.md` retired 2026-05-16). Lazy-create the folder + `index.md` on first
NDF instance, per
[`workflow/maintenance-discipline.md → Lazy creation`](workflow/maintenance-discipline.md#lazy-creation).
NDF template: [`_templates/NDF.md`](_templates/NDF.md) (top-level — NDF
*declares* types but is not itself a node-type instance).

Each NDF declares the contract (frontmatter, body sections, allowed
`related:` types, lifecycle) for its declared type. Phase 2 ingest validates
new nodes against the contract per the **Phase 2 type-validity HARD-GATE**
(§A.2 in `docs/exploration/EXP-NDF-engine-diffs.md`).

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
