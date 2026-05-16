# Maintenance discipline

> Canonical home for the **tiered-touch** rule that fires on every
> lifecycle event in the DDD wiki, the ADR store, and the CCC store.
> Tells you which files to touch, in what order, and what log entry to append.

> **HARD-GATE:** Do NOT consider an edit closed until **every required file
> has been touched in the same atomic operation** — the artifact, the
> per-type `index.md`, the `adrs/log.md` or `ccc/log.md` entry (ADR and CCC
> lifecycle events respectively), and every reciprocal `related:` target
> (`(base + N)` expansion). If any one is missing, the event is half-fired
> and the canonical store is silently inconsistent. (Cross-cutting rule:
> [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
> "Canonical edits use tiered touch".)

## When to Use

**Use when:** any canonical-node, ADR, or CCC file (`docs/<component>/nodes/<type>/`,
`docs/<component>/adrs/`, `docs/shared/adrs/`, `docs/shared/ccc/`) is about to change —
content edit, frontmatter edit, status flip, supersession, link
addition, or initial creation. Load before the edit; the touch fires
as part of the edit, not after.

**Do NOT use when:** the artifact is a milestone-scoped CHG node, an
FRS, an FS, a TC, a discovery surface (OQ / EXP / RESEARCH), or one of
the project-owned baselines (`docs/shared/glossary.md`,
`docs/shared/tech-stack.md`). Those live under different cadences — see
the relevant rule book ([`baseline-references.md`](baseline-references.md)
for glossary; [`../WORKFLOW.md`](../WORKFLOW.md) for the discovery surface;
[`plan.md`](plan.md) for CHG and FS). Note: `docs/shared/cross-cutting-concerns.md`
is retired; individual CCC-NNN artifacts under `docs/shared/ccc/` are
first-class and **do** fall under this rule.

**Vs. sibling files:** [`authoring-adr.md`](authoring-adr.md) /
[`legacy-absorption.md`](legacy-absorption.md) /
[`evolving-the-workflow.md`](evolving-the-workflow.md) /
[`new-component-bootstrap.md`](new-component-bootstrap.md) are the
**callers** that fire the touch as part of their own procedures; this
file is the **rule book** they consult for the file-set and log
format. Every reference to "the 3-file touch" in any other file points
here.

## Process Flow

```dot
digraph maintenance_touch {
    rankdir=TB;
    node [fontname="Helvetica"];

    event     [shape=oval,    label="Canonical edit pending\n(node, ADR, or CCC)"];
    type      [shape=diamond, label="Node, ADR, or CCC?"];
    nodebox   [shape=box,     label="2-file node touch:\nnode + per-type index.md\n(no log entry;\nstatus flips recorded\nin index row)"];
    tier      [shape=diamond, label="ADR or CCC: lifecycle event?\n(created / status-change /\nsuperseded / deprecated /\nlinked / renamed)"];
    routine   [shape=box,     label="2-file ADR/CCC touch:\nartifact + index.md\n(no log entry)"];
    lifecyc   [shape=box,     label="3-file ADR/CCC touch:\nartifact + index.md +\nlog.md\n(append op entry)"];
    related   [shape=diamond, label="related: edges\nadded / removed?"];
    plusN     [shape=box,     label="(base + N) expansion:\nfor each target ID,\nfire its own base touch\n(2-file node / 3-file ADR or CCC)"];
    gate      [shape=diamond, label="Post-op grep:\nback-links present\non every target?"];
    incomp    [shape=box,     label="Incomplete — fix in\nsame operation"];

    done      [shape=doublecircle, label="Edit closed\n(atomic, audited)"];

    event -> type;
    type -> nodebox  [label="node"];
    type -> tier     [label="ADR or CCC"];
    tier -> routine  [label="no — routine edit"];
    tier -> lifecyc  [label="yes"];
    nodebox -> related;
    routine -> related;
    lifecyc -> related;
    related -> plusN [label="yes"];
    related -> done  [label="no"];
    plusN -> gate;
    gate -> done     [label="all back-links present"];
    gate -> incomp   [label="missing"];
    incomp -> plusN  [label="repair"];
}
```

The three diamonds are sequential: the **type diamond** picks node-vs-ADR/CCC
(nodes are always 2-file, ADRs and CCCs split routine/lifecycle); the **tier
diamond** (ADR and CCC) classifies the edit and decides whether to fire
the log; the **related-edge diamond** classifies the cross-reference
delta (whether N reciprocal touches are owed). A single edit can be
"routine" *and* still owe the `(base + N)` expansion if `related:`
changed.

## Anti-Pattern: "The Lightweight Shortcut"

Firing the artifact edit but skipping the `index.md` re-sync, the ADR
or CCC `log.md` `created`/`status-change`/`linked` entry, or the reciprocal
`related:` back-link on a target — because the edit is small, the
operation already feels long, or "the next session will catch it".
The cost: the index goes stale; cross-type retrieval (`Read the per-type
index.md before globbing`, from
[`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)) returns
the wrong view of canonical; future readers consume the index summary
and write derivative artifacts against the wrong shape. **Half-fired
events are how the corpus drifts silently.** The lightweight option for
nodes is the **2-file touch** (artifact + per-type `index.md`); for
ADRs and CCCs, routine edits are 2-file but lifecycle events are **3-file**
(artifact + index.md + log.md) and skipping the log entry is the
shortcut to avoid. Doctrinal anchor: [`../PRINCIPLES.md`](../PRINCIPLES.md)
— *Silent node or ADR edits* and *If it can drift, the operation isn't
atomic enough.*

---

Canonical edits use a **type-split touch**:

- **Canonical node edit** — **2-file touch**: node artifact + per-type
  `index.md`. Applies to every node edit, whether routine (content,
  frontmatter) or lifecycle (`created`, `status-change`, `superseded`,
  `deprecated`, `linked`, `renamed`). Status flips and supersession are
  recorded by re-syncing the index row's Status column. No node log
  entry fires (see *Rule history* below).
- **Routine ADR edit** — **2-file touch**: ADR artifact + `adrs/index.md`.
  Triggers: content edits that don't cross a lifecycle threshold;
  frontmatter field updates that don't affect cross-references. No log
  entry fires.
- **ADR lifecycle event** — **3-file touch**: ADR artifact + `adrs/index.md` +
  `adrs/log.md`. Triggers (closed set — see Operation vocabulary):
  `created`, `status-change`, `superseded`, `deprecated`, `linked`,
  `renamed`.
- **Routine CCC edit** — **2-file touch**: CCC artifact + `ccc/index.md` row
  re-sync. Triggers: baseline text refinement, stack-specific notes update,
  or any frontmatter change that doesn't cross a lifecycle threshold. No log
  entry fires.
- **CCC lifecycle event** — **3-file touch**: CCC artifact + `ccc/index.md`
  row re-sync + `ccc/log.md` append. Triggers (closed set — see Operation
  vocabulary): `created`, `status-change`, `superseded`, `deprecated`,
  `linked`.
- **(base + N) touch** — when `related:` or other bidirectional edges change,
  the touch escalates to include N reciprocal back-link updates (see
  Bidirectional-link enforcement). Each target fires its own base touch
  (2-file if the target is a node, 3-file if the target is an ADR or CCC
  lifecycle event). The N expansion is orthogonal to the type/tier classification.

The indexes are a source of truth only as long as nothing slips past them.
Routine node and ADR edits keep the index current; ADR lifecycle events also
append a log entry for chronological audit. Node lifecycle events are
captured by the index Status column and git history.

**The touch is event-driven** — it fires at each edit, not at a fixed phase
boundary. Concretely:

- **Phase 2 ingest of a new node** — new row in the per-type `index.md`
  with Status = `proposed`. The new node is written directly to
  `docs/<component>/nodes/<type>/<ID>-<slug>.md` with `status: proposed`;
  the 2-file node touch fires immediately. ADR `created` events still
  fire the 3-file ADR lifecycle touch (`adrs/log.md` entry).
- **Phase 3 merge of an FS** — for each new node listed in the FS's
  `new_nodes:`, the canonical node's frontmatter flips
  `proposed → active` and the index row's Status column re-syncs. For
  each CHG `modifies[]` entry, the delta is applied to the canonical
  target and the index row re-syncs if summary/tags/status/source
  changed. For each CHG `removes[]` / `supersedes[]` entry, the canonical
  target's Status column flips (`superseded` or `deprecated`) and the
  index row moves to the Superseded/deprecated section.
- **Brownfield absorption** — absorbed nodes go straight to
  `status: active`; the `proposed` stage applies only to FS-generated
  nodes. See [`legacy-absorption.md`](legacy-absorption.md).
- **FS abandonment** — each `proposed` new node in the abandoned FS flips
  to `deprecated`; the index row moves to Superseded/deprecated. Files are
  never deleted; IDs are not reused.

CHG nodes are milestone-scoped — they live permanently at
`milestones/M-NN-<slug>/specs/FS-NNN-<slug>/nodes/changes/CHG-NNN-<slug>.md`
and never participate in the canonical tiered touch. There is no
canonical `docs/<component>/nodes/changes/` subtree. The CHG's own status lifecycle
(`draft → approved → merged`) is in-place edits to its frontmatter at
the milestone path.

The master catalog [`docs/home.md`](../home.md) is **derived**, not
hand-maintained per event. Its node-type and ADR tables regenerate on
demand from the per-type indexes (`docs/<component>/nodes/<type>/index.md` and
`docs/<component>/adrs/index.md`) — same treatment as the derived
reports at `reports/` (see
[`derived-reports.md`](derived-reports.md) for the parallel procedure).
The Planning Artifacts section in `home.md` (milestones, FRSs, feature
specs, discovery) stays hand-maintained until per-type indexes exist for
those artifacts.

## Files to touch on a canonical node edit

Every canonical node edit — content change, frontmatter update, status flip,
supersession, or initial creation — fires the **2-file node touch**. When the
edit involves `related:` declarations, it becomes a **(2 + N) touch** — see
*Bidirectional-link enforcement* below. A separate optional touch on
[`../../docs/shared/tech-stack.md`](../../docs/shared/tech-stack.md) fires at the same Phase 3
merge whenever stack versions, application layout, operational commands,
environments, runtime state, or milestone progress moved — see *Tech-stack
touch at merge* below. The tech-stack touch is **not** triggered by individual
node lifecycle events; it tracks project-level operational state, not
behavioral content.

1. **The node file itself** — `docs/<component>/nodes/<type>/<ID>-<slug>.md`
   (e.g., `docs/<component>/nodes/flows/<ID>-<slug>.md` or
   `docs/<component>/nodes/contracts/<PREFIX>-CON-NNN-<slug>.md` — see
   `docs/project.md § Components` for component slugs and prefixes).
2. **The per-type index** — `docs/<component>/nodes/<type>/index.md`. Add or update one
   row (ID, one-line summary, tags, source, status). Status flips
   (`proposed → active`, `active → superseded`, `active → deprecated`) are
   recorded by re-syncing the row's Status column and, for terminal
   transitions, moving the row to the Superseded/deprecated section.
   Create the file from [`_templates/INDEX.md`](../_templates/INDEX.md) if
   this is the first node of the type.
3. **Each `related:` target** — for every node ID declared in the page's
   `related:` frontmatter, update the target node's `related:` to carry the
   reciprocal back-link. See *Bidirectional-link enforcement* below.

Node lifecycle events (`created`, `status-change`, `superseded`,
`deprecated`, `linked`, `renamed`) do **not** fire a separate log entry —
the index row's Status column and git history are the audit trail. See
*Rule history* below for the rationale and date this dropped from the
3-file touch.

## Bidirectional-link enforcement

`related:` declarations are bidirectional contracts. When a node's
`related:` lists targets `[X, Y, Z]`, the targets MUST carry the reciprocal
back-link in **the same atomic operation**. The base touch on A
(2-file for nodes, 3-file for ADRs) becomes `(base + N)` where N is the
number of `related:` targets.

**Concrete steps when `related:` changes on node A:**

1. For each ID added to A's `related:`: open the target node file, add A
   to its `related:` if absent. If the target is a legacy-schema node
   without a `related:` field, add the field.
2. For each ID removed from A's `related:`: open the target node, remove A
   from its `related:`.
3. Each touched target fires its own base touch — a node target fires its
   2-file touch (target file + target's per-type `index.md`); an ADR target
   fires its 3-file lifecycle touch (target ADR + adrs/index.md +
   adrs/log.md with `linked` or `updated` op); a CCC target fires its
   3-file lifecycle touch (target CCC + ccc/index.md + ccc/log.md with
   `linked` op).
4. **Post-op gate**: grep the target files for the back-reference; if
   missing, the operation is incomplete.

**Inline DECs and `related:` — exception**: an inline DEC's effective
`related:` is implicit (the host node, plus any node IDs cited in the
inline block's body). Cited node IDs do not require reciprocal back-links;
the host node carries the citation as natural prose. If reciprocal linking
becomes desirable, promote inline → standalone (the scope expansion is the
trigger).

**Why this rule exists**: silent half-linkage produced the legacy slug
residue and missing ENT-side back-links surfaced in the 2026-05-13 DEC
audit. See `sdlc/PRINCIPLES.md` — *If it can drift, the operation isn't
atomic enough.*

## Tech-stack touch at merge

[`../../docs/shared/tech-stack.md`](../../docs/shared/tech-stack.md) is the project's
operational baseline (versions, layout, operational commands,
environments, runtime state, milestone progress). It is **not** a
canonical node and does **not** participate in the per-type tiered touch —
its update cadence is coarser and
project-level.

At Phase 3 merge, ask:

1. Did this merge change any pinned stack version? (new dependency,
   version bump, removed component)
2. Did this merge add / remove / rename projects in the application
   layout?
3. Did this merge change build / run / test / migrate commands?
4. Did this merge introduce a new environment or change an endpoint?
5. Did this merge land a new database migration (business or workflow
   schema)?
6. Did this merge change the milestone's `FS merged` count or status?
7. Did this merge create a new release tag or change `Current branch`?

If **any** answer is yes, update the affected section of
`docs/shared/tech-stack.md` in the same merge. No log entry, no per-type
index re-sync — the file is its own source of truth and carries no
companion `log.md`. If every answer is no, no touch is required;
silence is correct.

Decisions about the stack (a new component adopted, an existing
component replaced, an environment topology rethought) still author an
ADR — `docs/shared/tech-stack.md` is updated **after** the ADR lands and
points to it from the affected row.

## Promoting an inline DEC to standalone

When an inline DEC trips a standalone-trigger (see
[`authoring-adr.md → Inline vs standalone DEC`](authoring-adr.md#inline-vs-standalone-dec-sub-discriminator)),
the promotion procedure:

1. **Allocate** the next free `DEC-NNN` ID from
   `docs/<component>/nodes/decisions/index.md` (e.g.,
   `docs/app/nodes/decisions/index.md`).
2. **Create** the standalone file `docs/<component>/nodes/decisions/DEC-NNN-<slug>.md`
   from [`../_templates/nodes/DECISION.md`](../_templates/nodes/DECISION.md).
   Move the inline body content into the new file's body sections. Populate
   `related:` with every node ID the decision shapes.
3. **Fire the 2-file touch** on the standalone DEC: file +
   decisions/index.md (new row, Status = `proposed` or `active` per the
   promoting context). DEC is a canonical node; no log entry fires.
4. **Replace the inline section** in the host node with a one-line link:
   `> See [DEC-NNN — <title>](../decisions/DEC-NNN-<slug>.md).` The host
   node's own 2-file touch fires (its index.md row's summary may re-sync if
   the inline removal changes the host's one-line description).
5. **Fire bidirectional-link enforcement** for the new standalone DEC's
   `related:` — every target node carries a back-link to the new DEC.

Same operation, same commit. Inline → standalone is not a multi-step
spread.

## Files to touch on an ADR lifecycle event

1. **The ADR file itself** — `docs/<component>/adrs/ADR-NNN-<slug>.md`
   (e.g., `docs/<component>/adrs/ADR-001-<slug>.md` — see `docs/project.md § Components`
   for each component's ADR range).
2. **The ADR index** — `docs/<component>/adrs/index.md`. Add the row to
   Active, or move it to Superseded/deprecated. Use the ADR discriminator in
   [`authoring-adr.md`](authoring-adr.md) to determine whether the ADR belongs
   to a specific component or `docs/shared/adrs/`.
3. **The ADR log** — `docs/<component>/adrs/log.md`. Append one entry.

## Files to touch on a CCC lifecycle event

1. **The CCC file itself** — `docs/shared/ccc/CCC-NNN-<slug>.md`.
2. **The CCC index** — `docs/shared/ccc/index.md`. Add the row (schema:
   `| ID | Status | Title | Stack | Tags | Source | Updated |`) or update
   the existing row; move to the Superseded/deprecated section on terminal
   transitions. CCCs are always under `docs/shared/ccc/` — there is no
   component-scoped CCC path.
3. **The CCC log** — `docs/shared/ccc/log.md`. Append one entry using the
   same format as the ADR log (see *Log entry format* below). Op ∈
   `created | linked | status-change | superseded | deprecated`.

**Routine CCC edit (no lifecycle event):** touch only files 1 and 2 above
(2-file touch). No log entry fires.

**Lazy-creation note:** `docs/shared/ccc/index.md` and `docs/shared/ccc/log.md`
already exist (seeded with CCC-001..013). The lazy-create-on-first-node
rule does not apply — both files are live. New CCCs extend the existing
catalog directly.

## Log entry format

Single-line, always:

```
## [YYYY-MM-DD] <op> | <node-id> — <one-line note>
```

Examples:

```
## [2026-05-13] created | ENT-042 — order line aggregate per FRS-018
## [2026-05-15] superseded | ENT-005 — folded into ENT-042 via CHG-009
## [2026-06-02] updated | FLW-007 — added fault scenario per bug-fix
```

Parseable via `grep "^## \[" log.md | tail -5`.

**This format applies prospectively.** Existing multi-line log entries in the
corpus are not retroactively rewritten — they describe what happened on a given
date and remain authoritative as written.

## Operation vocabulary (closed set)

Active operations (fire log entries today):

- `created` — new page landed.
- `updated` — significant content edit. Routine typos skipped.
- `status-change` — `proposed → accepted`, `active → superseded`, etc. Body
  notes old and new status.
- `superseded` — superseded by another ID. Body names the superseder.
- `deprecated` — no longer authoritative, no successor.
- `linked` — a new FRS or FS started consuming the page (back-link landed
  via `adrs:` or `source_ref`).
- `renamed` — fires when an ID prefix or core identity changes
  (precedent: EP → CON, 2026-05-14). Body names the old and new IDs;
  the page itself moves to the new prefix/folder.

Reserved operations (named in the vocabulary but not yet fired — deferred per §6
of the MVS execution plan):

- `merged-into` — fires when CHG `merges[]` op lands (deferred).
- `derived-genesis` — fires when CHG `derives[]` op lands (deferred).

## Discovery surface discipline

The discovery surface (`docs/discovery/`) is working notes, not canonical
wiki. Lighter discipline applies:

- **Routine edit** — **1-file touch** (the discovery artifact only). No index update,
  no log entry.
- **Terminal lifecycle event** (`adopted`, `rejected`, `merged`, `done`, `fixed`,
  `escalated`) — **2-file touch** (artifact + `docs/discovery/<type>/index.md` if one
  exists). No log.md for the discovery surface — git history + the index's status column
  are the audit trail.
- No bidirectional `related:` enforcement on discovery artifacts — loose linking is fine
  for working notes.

## Cross-type supersession (ADR ↔ DEC)

When a DEC is promoted to an ADR (or, rarely, an ADR is demoted to a
DEC) because the original classification was wrong from the start, the
supersession spans two type folders. Each side fires its own touch:

- The ADR side: **3-file lifecycle touch** — ADR file +
  `docs/<component>/adrs/index.md` + `docs/<component>/adrs/log.md`.
  Use `created` for the new ADR (body of the log entry names the
  superseded DEC).
- The DEC side: **2-file touch** — DEC file +
  `docs/<component>/nodes/decisions/index.md` (move row from Active to
  Superseded/deprecated, Status column flips to `superseded`). DEC is a
  canonical node; node lifecycle events do not fire a log entry. The
  ADR log entry (above) and git history are the cross-type audit trail.

Frontmatter wiring is the same as same-type supersession: the new
artifact's `supersedes:` holds the old ID; the old artifact's
`superseded_by:` holds the new ID. The fields accept either prefix.
See [`authoring-adr.md → Cross-type supersession`](authoring-adr.md#cross-type-supersession-adr-supersedes-dec-or-vice-versa)
for the editorial procedure. Precedent: ADR-029 supersedes DEC-009
(2026-05-13).

## Node versioning — `version: N`

All canonical DDD node templates (ACT, ENT, CMD, QRY, FLW, STA, DEC, INT,
MOD, SCR, CON, PERM, SVC, FA) carry a `version: N` integer in
frontmatter, starting at `1` on creation. The field tracks revision
activity orthogonal to status — its job is to make stale cross-references
auditable.

**Bump rule (mechanical, not a judgment call).**

- **Bump** on any **content edit that changes the node's semantic
  content for a consumer**: body invariant/field/scenario changes;
  frontmatter field changes that affect cross-references (`related:`,
  `invokes:`, `contains:`, `consumed_by_services:`, etc.); changes to
  a node's discriminator fields (`kind:`, `protocol:`).
- **Do not bump** on:
  - `status:` flips (`proposed → active`, `active → superseded`,
    `active → deprecated`). Status is orthogonal to revision.
  - Pure typo / pure formatting / whitespace edits that don't change
    semantics.
  - Date-only field updates (`updated:`).
  - Log-entry append.
- Bumps land **in the same edit** that makes the substantive change —
  not in a separate touch pass.
- `updated:` (date) and `version:` (revision count) are kept; they
  answer different questions ("when" vs "how many revisions").

**Cross-reference syntax (optional, opt-in).** Stability-sensitive
references can pin to a version:

```
ref: ENT-007@v3            # in inline prose
related: [ENT-007@v3]      # in frontmatter when pinning matters
```

Unversioned cross-refs (`ENT-007`) continue to mean "current head of
that node" — the default. Pinning is for cases like "the FRS depended
on ENT-007 as of v3 — if it's moved on, surface that," and gets the
stale-version lint pass below.

**Lint surface and pre-commit advisory.** See [`lint.md → stale-version-ref`](lint.md#stale-version-ref) for how stale pinned cross-references are detected and the pre-commit advisory script.

**ADRs / FRSs / FSs do not carry `version:`.** ADRs have their own
lifecycle (`proposed → accepted → deprecated | superseded`); FRSs and
FSs are planning artifacts whose revisions live in git history and in
the `status:` field. The version field is specifically for the
canonical DDD wiki where stable cross-references matter most.

Source: `sdlc-framework-refinement-v3.md` Δ6 + Δ12 (open-item
discriminator: "would the edit change the node's semantic content for
a consumer?" — codified here).

## Append-only, oldest first

Never edit or reorder existing log entries — they describe what happened on a
given date. New entries go at the **bottom** of the file. One commit covering
several lifecycle changes produces several entries, one per change.

## Lazy creation

`docs/<component>/nodes/<type>/` folders do not exist until the first node of the type
lands. When that happens, the same commit that creates the node also creates
`<type>/index.md` from [`../_templates/INDEX.md`](../_templates/INDEX.md). No per-type
`log.md` is created (see *Rule history* below). After that, `index.md` grows with every
subsequent event in the type.

ADR folders (`docs/<component>/adrs/`, `docs/shared/adrs/`) lazy-create both
`index.md` and `log.md` on first ADR — ADR lifecycle events still fire a
3-file touch.

The CCC folder (`docs/shared/ccc/`) is already live with both `index.md` and
`log.md` populated. Lazy-creation does not apply — every new CCC-NNN file
is added to the existing catalog via the 3-file lifecycle touch.

## Rule history — CCC tiered-touch added (2026-05-16)

CCCs promoted from a single baseline file (`docs/shared/cross-cutting-concerns.md`,
now retired) to first-class CCC-NNN artifacts under `docs/shared/ccc/`. The
tiered-touch rule now covers CCCs with the same two-tier split as ADRs: routine
edits are 2-file (CCC + `ccc/index.md`); lifecycle events are 3-file (CCC +
`ccc/index.md` + `ccc/log.md`). The exclusion of `cross-cutting-concerns.md`
from the When to Use gate was removed and replaced with a note that individual
CCC-NNN artifacts are first-class and in scope.

## Rule history — per-type node `log.md` dropped (2026-05-16)

The earlier rule required per-type node `log.md` for every node lifecycle event
(3-file touch). On 2026-05-16 the fallback below was invoked explicitly: per-type
node logs were dropped; `adrs/log.md` and `docs/research/log.md` are retained.

**Rationale:**

- One-human-all-roles. The audit-for-others case is weak; audit-for-future-self
  is covered by git history + the per-type `index.md` Status column.
- `id-claims.md` already records `created` events from the planning side
  (`milestones/M-NN-<slug>/id-claims.md`).
- Zero nodes existed at the time of decision; no migration cost.
- Lifecycle vocabulary (`created`, `status-change`, `superseded`,
  `deprecated`, `linked`, `renamed`) survives as descriptive language and
  in ADR log entries; for nodes it is observable in the per-type `index.md`
  Status column and in git history.

If even the surviving 2-file node touch proves too heavy, the next fallback
would be to drop the per-type `index.md` re-sync on routine content edits
(retaining it only for status flips and `related:` changes) — make that
call explicitly; don't let it erode by drift.

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Canonical edits use tiered touch" is the doctrinal anchor; this
  file is its procedural detail.
- **Required before:** [`../PRINCIPLES.md`](../PRINCIPLES.md) —
  "Silent node or ADR edits" and "If it can drift, the operation isn't
  atomic enough" are the named anti-patterns this rule book prevents.
- **Required before:** [`../BOUNDARY.md ## Engine-vs-project axis`](../BOUNDARY.md#engine-vs-project-axis)
  — canonical home for the four status vocabularies (node / ADR / FRS
  / OQ) that the `status-change` op references.
- **Callers (this file is wholesale-read by):**
  [`plan.md`](plan.md) (2-file node touch on every new node's ingest;
  `(2 + N)` when `related:` lands),
  [`implementation.md`](implementation.md) (`status-change`
  `proposed → active` on every new node at FS merge — recorded in the
  index row's Status column; `updated` / `superseded` / `deprecated` for
  every CHG `modifies[]` / `removes[]` / `supersedes[]` entry — same),
  [`bug-fix.md`](bug-fix.md) (canonical FLW edit fires its 2-file node
  touch),
  [`legacy-absorption.md`](legacy-absorption.md) (2-file node touch on
  every promoted node, 3-file ADR touch on every promoted ADR; absorbed
  nodes go directly to `status: active`),
  [`authoring-adr.md`](authoring-adr.md) (`created` / `linked` /
  `superseded` / `status-change` on every ADR lifecycle event — 3-file
  ADR touch),
  [`new-component-bootstrap.md`](new-component-bootstrap.md) (lazy
  per-type `index.md` creation on first node; lazy `adrs/index.md` +
  `adrs/log.md` creation on first ADR).
- **Sibling rule books:**
  [`legacy-absorption.md`](legacy-absorption.md),
  [`authoring-adr.md`](authoring-adr.md),
  [`evolving-the-workflow.md`](evolving-the-workflow.md),
  [`new-component-bootstrap.md`](new-component-bootstrap.md),
  [`baseline-references.md`](baseline-references.md).
