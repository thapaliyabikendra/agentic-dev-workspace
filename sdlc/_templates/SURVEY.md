---
scope: <short-name>           # e.g., user-management, billing-export, flink-smurfing-impossible-travel
level: milestone              # milestone | frs | workspace
kind: new-feature             # new-feature | change-request | absorb-legacy-doc
created: YYYY-MM-DD
status: draft                 # draft | done | stale | adopted | rejected | dormant

# Survey-shape (required when kind: new-feature | change-request):
adrs: []                      # ADR IDs consulted (empty allowed when index is empty or genuinely nothing applies)
source_ref: []                # workspace-level absorption only: [{absorption: <path>, op: absorb}]

# Cross-link fields (optional):
motivated_by: []
validated_by: []
adopted_into: []
related: []
---

# Survey: <Scope>

> A **Survey** is a procedural artifact consumed by Phase 0 milestone
> scoping, Phase 1 FRS authoring, or the absorption workflow. It is
> **not** a free-form working note — for that, use Exploration
> (`docs/exploration/`, [`EXPLORATION.md`](EXPLORATION.md)).
>
> Lightweight map of the existing system surface that upcoming requirements
> will touch. One page or less. Anchors the milestone (when `level: milestone`)
> or a single FRS (when `level: frs`) — does not document the whole system.
>
> **File location and naming.**
> - `level: milestone` → `docs/milestones/M-NN-<slug>/discovery/milestone-scope.md`
> - `level: frs` → `docs/milestones/M-NN-<slug>/discovery/FRS-NNN-<slug>.md`
> - `level: workspace, kind: absorb-legacy-doc` → `docs/discovery/absorption-plan-<source-slug>.md`
>
> **Scope width.** When `level: milestone`, the scope spans the whole
> delivery cluster. When `level: frs`, scope narrows to a single user-journey.
> When `level: workspace`, scope is absorption of a legacy document.
>
> **Kind-by-kind shapes** (mandatory sections per kind — see body below):
> - `new-feature` / `change-request` — survey-shaped: nodes scanned + ADRs scanned
> - `absorb-legacy-doc` — absorption-shaped: signal-to-target map
>
> **Back claims of consistency with occurrence counts** (e.g., "used in 12
> places, 0 counterexamples"). Hand-wavy assertions decay; counts re-run.

## Existing nodes scanned

**Brownfield projects:** mandatory when `kind: change-request`; may be
left empty when `kind: new-feature`. Scans the **canonical** wiki at
`docs/nodes/**`. The scan is the only place in the workflow where
wholesale reading of `docs/nodes/` is allowed (see
[`../workflow/retrieval-discipline.md`](../workflow/retrieval-discipline.md)).

**Greenfield projects (`project_type: greenfield` in `CLAUDE.md`):**
omit this section entirely — there are no existing nodes to scan.

| Node ID | Why relevant |
| ------- | ------------ |
| ENT-NNN | <one line — what about this node intersects the request> |
| FLW-NNN | … |

## Relevant ADRs scanned

**Always-on**, for both `new-feature` and `change-request`. Read
[`../adrs/index.md`](../adrs/index.md) — the one-line summaries are the
wholesale-read target. List every ADR whose tags or components intersect
the request; that list flows into the FRS's `adrs:` frontmatter.

If the ADR index is empty (no ADRs authored yet) or genuinely nothing
intersects, write "none — index scanned, no intersection" rather than
leaving this section blank. The QA hat needs to see the scan happened.

| ADR ID | Why relevant |
| ------ | ------------ |
| ADR-NNN | <one line — what about this ADR constrains the request> |

## Relevant existing modules / services / tables

- `<module-or-path>` — what it currently does, in one line.
- `<module-or-path>` — …

## Current behavior to be modified or replaced

- …
- …

## Constraints the agent must respect

- Legacy data shapes:
- Public APIs / contracts:
- Auth / session / permissions:
- Performance / SLA:
- Other:

## Open questions

Each unanswered question is raised as an `OQ-NNN` under
`docs/discovery/open-questions/` with `origin: survey,
origin_ref: <this survey ID>, needed_by: <phase | M-NN | artifact-id>`.
Cite the OQ IDs here; the question text and resolution path live in the
OQ file. Template: [`OPEN-QUESTION.md`](OPEN-QUESTION.md).

- OQ-NNN — one-line cue (optional)
- OQ-NNN — …

## Deferred (explicitly out of scope for this survey)

- …

## Cross-FRS conflicts

Only present when `level: milestone`. Filled at Phase 1.5 by the milestone
sweep — leave empty at Phase 0. Each row also appears as a `cross-frs`
finding in the FRSs involved.

| Conflict | FRSs involved | Resolution | Rationale |
| -------- | ------------- | ---------- | --------- |
|          |               | resolved \| deferred |  |
