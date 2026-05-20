---
applies_when:
  stack: [agnostic]
---

# Lint

> Periodic debt-scan operation. **Lint detects drift; it does not
> regenerate artifacts.** Codifies the closed set of debt classes
> (`orphan-node`, `stale-proposed`, `baseline-not-cited`,
> `stale-version-ref`, `index-entry-missing`) plus the routing rule:
> resolution-worthy drift becomes an `OQ-NNN`; missing-index repairs
> fire a direct tiered touch. Sibling to
> [`derived-reports.md`](derived-reports.md) (regeneration) and
> [`review.md`](review.md) (qualitative pass over scoped subset).

## When to Use

**Use when:** preparing to close a milestone (clean the slate before
flipping the milestone status), picking up a stale workspace after a
long absence, periodic discipline (e.g., monthly cadence), or when
something feels off and a structured check beats freeform suspicion.

**Do NOT use when:** the work is a Phase 1.5 validation gate (use
[`design.md → Phase 1.5`](design.md#phase-15--validation-gate) +
[`frs-validation-rules.md`](frs-validation-rules.md) — different rule
shape), a per-artifact lifecycle event (use
[`maintenance-discipline.md`](maintenance-discipline.md) directly), a
qualitative review against a scoped subset (use
[`review.md`](review.md) — design-fit vs execution-debt routing), or
report regeneration (use [`derived-reports.md`](derived-reports.md) /
[`regenerate-roadmap.md`](regenerate-roadmap.md)). Lint is not
required at phase boundaries; the Phase 1.5 gate and the tiered touch
remain the primary discipline.

**Vs. sibling files:** [`derived-reports.md`](derived-reports.md)
*regenerates* curated views (build artifacts); this file *detects*
drift (resolution-worthy findings). [`review.md`](review.md) is
qualitative and shape-classified (design-fit / execution-debt); this
file is mechanical with predetermined detection rules per class.

Periodic debt scan of the workspace. **Lint detects drift; it does not
regenerate artifacts.** Distinct from
[`derived-reports.md`](derived-reports.md) (which rebuilds
`docs/home.md` and `reports/*` from source) — lint walks the
canonical content and flags violations of the discipline rules in
[`../../CLAUDE.md`](../../CLAUDE.md),
[`../WORKFLOW.md`](../WORKFLOW.md),
[`../PRINCIPLES.md`](../PRINCIPLES.md), and
[`maintenance-discipline.md`](maintenance-discipline.md).

Lint is a **named workflow operation, not a slash command and not an
automated scanner.** Invoked by reading this file and walking through
each debt class against the current workspace. Findings route into
existing artifact machinery — OQ-NNN for resolution-worthy drift,
direct tiered touch for missing-index repairs. No new artifact type
is introduced.

> **OQ `origin:` fit.** Lint findings currently route to OQ-NNN with
> `origin: workflow-evolution` (for orphan / stale-proposed) or
> `origin: validation-gate` (for baseline-not-cited). The
> `workflow-evolution` value is a forced fit — its template-defined
> meaning is "workflow-rule clarification," not "lint found drift in an
> artifact." A reader of such an OQ may expect a workflow-rule change as
> the resolution and find a node deprecation instead. A future
> [`OPEN-QUESTION.md`](../_templates/OPEN-QUESTION.md) template revision
> should consider adding `maintenance` (or `lint`) as an explicit
> `origin:` value. Out of scope for the initial coining of this
> operation.

## When to run

On demand. Suggested triggers:

- Before a milestone close — clean the slate before flipping the
  milestone status.
- Picking up a stale workspace after a long absence — surface drift that
  accumulated while nothing was being authored.
- When something feels off — a structured check beats freeform suspicion.
- As a periodic discipline — e.g., monthly. Optional, not phase-gated.

Lint is not required at phase boundaries. The Phase 1.5 gate and the
tiered touch in [`maintenance-discipline.md`](maintenance-discipline.md)
remain the primary discipline.

## Anti-Pattern: "The Lint Gate"

Treating a lint pass as a phase-blocking gate — refusing to proceed
to Phase 2 (or to close a milestone, or to merge a CHG) until lint
returns clean. The temptation: lint surfaces real drift, and a clean
scan feels like a definitive "ready" signal. The cost: lint findings
are debt classes whose resolution is **routed through OQ-NNN files
that themselves take time to resolve** (orphan deprecations,
stale-proposed mergers, baseline-not-cited investigations). Treating
the scan as a gate either blocks legitimate work indefinitely while
OQs queue, or pressures the operator into rushing OQ resolutions and
silently rewriting findings. **Lint is detection, not gating.** The
phase gates that exist (Phase 1.5 validation gate, the tiered touch's
post-op grep, the CHG approval) are the actual stop signals; lint
surfaces drift that operates *between* those gates and routes it to
the canonical machinery for non-urgent resolution. Doctrinal anchor:
[`../PRINCIPLES.md`](../PRINCIPLES.md) — gates that close the loop
are explicit; ad-hoc gates that masquerade as the same authority
produce confusion about what is actually blocking.

## Procedure

For each debt class below:

1. Read the **detection rule** and the **scan procedure**.
2. Walk the relevant indexes / folders using the procedure.
3. For each violation found, take the documented **action**.

When all four classes are walked, emit a one-line summary report to the
session (or to the user) listing findings as
`<debt-class> | <artifact-id> | <one-line detail>`. The report itself is
not persisted — the OQ-NNN entries and `index.md` row updates it
produces are the durable record.

## Debt classes — initial set

Four classes seed the operation. New classes are added when a pattern of
drift becomes evident; each addition goes through
[`evolving-the-workflow.md`](evolving-the-workflow.md) and lands here
with detection rule, scan procedure, and action.

### `orphan-node`

**Detection.** A canonical node under `docs/<component>/nodes/<type>/<ID>-<slug>.md`
with `status: active` that no FRS, FS, ADR, or other node references in
its `nodes:` / `linked_*` / `related:` frontmatter or in any wikilink in
its body.

**Scan procedure.** Read each per-type `docs/<component>/nodes/<type>/index.md`. For
each row with Status = `active`, grep the workspace for the node ID
(`grep -r "ENT-027" docs/ sdlc/`). Zero hits outside the node's own
file and its per-type index/log = orphan. ADR index counts as a
reference site; legacy `docs-backup/` does not.

**Action.** Open an OQ-NNN with `origin: workflow-evolution`,
`needed_by: indefinite` (or scoped to the relevant milestone if a
candidate consumer is imminent). The question shape:
"Is `<NODE-ID>` genuinely unused and should be deprecated, or does a
missing link in `<consumer-artifact>` need to be added?" Three-file
touch is the resolution path if the answer is "deprecate"; otherwise
the answer adds back-links via `related:` / `linked_*` updates per
[`maintenance-discipline.md → Bidirectional-link enforcement`](maintenance-discipline.md#bidirectional-link-enforcement).

### `stale-proposed`

**Detection.** A canonical node with `status: proposed` whose row in
the per-type `index.md` has not been updated (by git mtime) in more
than **14 days**. The `proposed` status is intended as a transient
state between Phase 2 ingest and Phase 3 merge — nodes that linger
there are FS-stalls, abandonments without cleanup, or forgotten work.

**Scan procedure.** Read each per-type `index.md`'s "Proposed" section
(per [`maintenance-discipline.md → Lazy creation`](maintenance-discipline.md#lazy-creation)).
For each entry, check the git modification time of the node file itself
(`git log -1 --format="%ci" -- docs/<component>/nodes/<type>/<NODE-ID>-*.md`).
If the latest commit is more than 14 days old, flag.

**Action.** Open an OQ-NNN with `origin: workflow-evolution`. The
question shape: "Should `<NODE-ID>` be merged via Phase 3 / CHG, or has
the originating FS stalled / been abandoned?" Resolution closes via
either Phase 3 merge (flip to `active`) or FS abandonment per
[`maintenance-discipline.md → FS abandonment`](maintenance-discipline.md)
(flip to `deprecated`).

### `baseline-not-cited`

**Detection.** An FRS, FS, or Discovery doc in `status: draft | review
| approved` with an empty `adrs:` frontmatter, **and**
[`docs/<component>/adrs/index.md`](../../docs/<component>/adrs/index.md) is non-empty. Empty
`adrs:` is legitimate only when the ADR index is itself empty or
genuinely no ADR applies — the combination of empty `adrs:` +
non-empty index + non-terminal status is what flags.

This is already a Phase 1.5 gate finding (`baseline-not-cited`). Lint
catches instances that slipped through (e.g., artifact authored before
the gate fired, or the artifact bypassed the gate).

**Scan procedure.** Grep frontmatter of `docs/milestones/M-NN-*/frs/` and
`docs/milestones/M-NN-*/specs/FS-NNN-*/` for
`adrs: []` or files missing the field entirely
(`grep -rL "^adrs:" docs/milestones/` for missing field). Cross-check the
ADR index for non-emptiness.

**Action.** Open an OQ-NNN with `origin: validation-gate` and
`gate_effect: blocking`. The question shape: "Why does
`<ARTIFACT-ID>` carry empty `adrs:` when the ADR index has N active
entries — was the gate bypassed, or is no ADR genuinely applicable?"
If genuinely none applies, the resolution adds a body note to that
effect plus an explicit empty `adrs:` (documenting the deliberate
absence); otherwise the resolution adds the citing ADR IDs.

### `stale-version-ref`

**Detection.** An FRS, FS, ADR, or canonical node body declares a
pinned cross-reference `<TYPE>-NNN@v<M>` (e.g., `ENT-007@v3`) while the
target node's frontmatter `version:` is now greater than `M`. The
citing artifact was true at the pinned version; the target has since
moved on.

**Scan procedure.** Grep the workspace for the pinned-reference
pattern: `grep -roE '[A-Z]+-[0-9]+@v[0-9]+' docs/ sdlc/`. For each
hit, open the target node and compare its current `version:` against
the cited `@vM`. A target version greater than the cited version is a
violation.

**Action.** Open an OQ-NNN with `origin: workflow-evolution`. The
question shape: "`<ARTIFACT>` cites `<TARGET>@v<M>` but the target is
now at `v<N>` — is the citing artifact still valid against
`<TARGET>@v<N>`, or has the new version invalidated the assumption?"
Resolution paths:

- **Compatible.** Update the citation to the current version (or drop
  the pin entirely if pinning isn't needed).
- **Incompatible.** Surface a brownfield-impact note in the citing
  artifact; if the artifact is an FRS, that means a Phase 1.5
  validation finding; if an FS, a CHG; if an ADR, a supersession.

The class waits for a real pinned reference to exist before it fires;
unversioned cross-refs (`ENT-007` without `@v<M>`) are not in scope.

**Pre-commit / pre-merge advisory.**
[`../../scripts/check-version-bump.sh`](../../scripts/check-version-bump.sh)
scans staged or ranged canonical-node edits and reports
`BUMP_MISSING:` for any node whose body / cross-reference frontmatter
changed but whose `version:` integer did not move. The script is
advisory — it does not block commits; it is a soft second pair of
eyes for the bump rule.

### `index-entry-missing`

**Detection.** A node file in `docs/<component>/nodes/<type>/` (or an ADR file in
`docs/<component>/adrs/`) without a corresponding row in the folder's `index.md`.

**Scan procedure.** For each `docs/<component>/nodes/<type>/` folder, list files
(`ls docs/<component>/nodes/<type>/*.md`) and diff against the **row IDs** in
`<type>/index.md`. A row ID is the artifact ID in the row's first
column / link target, **not** every node ID cited inside a row's
summary or tags column. The folder's expected prefix (e.g., `ENT-` for
`entities/`, `FLW-` for `flows/`) is the filter — cross-type citations
in row bodies are intentional and not violations. Repeat for
`docs/<component>/adrs/`. Any file with no row, or any row pointing at a missing
file, is a violation.

**Action.** This is a tiered touch violation per
[`maintenance-discipline.md`](maintenance-discipline.md). Direct fix —
no OQ-NNN needed:

1. Add the missing row to the per-type `index.md` (or remove the
   dangling row if the file is genuinely gone — in which case verify
   against git history that the deletion was intentional).
2. Add a body note in the `index.md` row or update the row's summary
   to record "recovered from index-entry-missing lint pass" plus a date.
3. The fix itself is a 2-file node touch (node + `index.md`); no further action.

If multiple violations of this class accumulate, that's a signal that
the tiered touch discipline is eroding — consider raising as a
methodology concern via
[`evolving-the-workflow.md`](evolving-the-workflow.md) rather than
just patching each case.

## Output format

When a lint pass completes, summarize as:

```
Lint pass — <YYYY-MM-DD>

orphan-node       | ENT-027    | No references found in docs/ or sdlc/. Candidate consumer: none identified.
stale-proposed    | FLW-201    | Latest log entry 2026-04-20 (23 days). FS-005 owner.
baseline-not-cited| FRS-007    | adrs: [] but docs/<component>/adrs/index.md has 29 active entries.
index-entry-missing | docs/<component>/nodes/queries/QRY-014-*.md | File present, no index row.

OQs opened: OQ-021 (orphan-node), OQ-022 (stale-proposed), OQ-023 (baseline-not-cited).
Direct fixes: QRY-014 index row + log entry added (commit pending).
```

The report does not persist. The OQs and the index/log entries it
produces are the durable record.

## Extending the debt class list

New debt classes land here when a pattern of drift becomes evident and
the manual fix is repetitive enough to warrant codification. Each new
class is a workflow extension and goes through the discriminators in
[`evolving-the-workflow.md`](evolving-the-workflow.md).

**Candidate future classes** surveyed but not seeded (each waits for
either a concrete violation pattern or a methodology pass that needs
them):

- **`deprecated-citation`** — a node with `status: deprecated` still
  referenced in another active node's body or frontmatter. Folds in the
  compiler-style deprecation-propagation discipline as a passive scan
  rather than an automatic CNF emit.
- **`late-conflict`** — a Phase 2 node-write contradicts an ADR /
  standard / baseline that Phase 1.5 missed. Belt-and-braces for
  Active-Defense-at-Phase-2; only worth adding if late-conflicts
  actually occur.
- **`stale-chg`** — a CHG-NNN at `status: approved` whose owning FS has
  not reached Phase 3 merge after N days. Needs a real CHG corpus first.
- **`bundling-violation`** — an FRS with > 2 distinct actors, > 4
  trigger events, or disjoint state machines. Would adopt numeric
  tripwires that are not yet codified in
  [`frs-validation-rules.md`](frs-validation-rules.md) (its current
  bundling detection is qualitative). Activates if/when the qualitative
  test there proves insufficient and the tripwires land.

Adding a class lands directly in this file once approved via the discriminator
process in [`evolving-the-workflow.md`](evolving-the-workflow.md).

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Tiered touch for canonical edits" anchors the `index-entry-missing`
  routing path (direct tiered touch, no OQ).
- **Required before:** [`../PRINCIPLES.md`](../PRINCIPLES.md) — gating
  vocabulary anchor for the Anti-Pattern above.
- **Required before:** [`maintenance-discipline.md`](maintenance-discipline.md)
  — canonical home for the tiered-touch rule fired by
  `index-entry-missing` findings, and for the bidirectional-link
  enforcement that orphan-node resolutions route to.
- **Routes findings to:** OQ-NNN files under
  [`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/)
  for orphan / stale-proposed / baseline-not-cited / stale-version-ref;
  direct tiered touch (via
  [`maintenance-discipline.md`](maintenance-discipline.md)) for
  `index-entry-missing`.
- **Adjacent (not callers but consulted):**
  [`evolving-the-workflow.md`](evolving-the-workflow.md) — required
  discriminator before adding a new debt class;
  [`frs-validation-rules.md`](frs-validation-rules.md) — the
  `baseline-not-cited` lint class shares its detection with the Phase
  1.5 gate finding of the same name (lint catches gate-bypassed
  cases);
  [`regenerate-roadmap.md`](regenerate-roadmap.md) — its `stale-proposed`
  stuck class mirrors this file's `stale-proposed` lint class with a
  different time window.
- **Sibling rule books:**
  [`derived-reports.md`](derived-reports.md),
  [`regenerate-roadmap.md`](regenerate-roadmap.md),
  [`review.md`](review.md),
  [`maintenance-discipline.md`](maintenance-discipline.md).
