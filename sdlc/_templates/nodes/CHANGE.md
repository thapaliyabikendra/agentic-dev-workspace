---
id: CHG-NNN
type: change
title: <Change-map title — FRS-NNN delta, or per-touchpoint slug>
status: draft                 # draft | approved | merged | deprecated
# source_ref: list of originating FRS IDs. Phase 1 birth: single FRS-NNN
# (the FRS whose touches_nodes: drove this CHG into existence). FS-time
# merge (R-CHG-3 sibling-CHG fold) accumulates additional FRS IDs here.
source_ref: []                # [{frs: FRS-NNN, op: modify}] · brownfield: [{absorption: <path>, op: modify}]
# adds[] — Phase-2-wired only. Mirrors new canonical node IDs introduced by
# the FS that consumes this CHG. Phase 1 author leaves empty.
adds: []                      # new canonical node IDs introduced by the consuming FS (Phase 2 enrichment)
# modifies[] — Phase 1 carries the behavior-language delta (business
# language only; e.g. "FLW-001 gains a fault path when X" — no ENT/CMD/STA
# IDs in the before/after at Phase 1). Phase 2 FS enrichment adds the
# structural before/after on each entry.
modifies: []                  # Phase 1: [{node: ENT-NNN, behavior_delta: "<business-language delta>"}]; Phase 2: each entry enriched with {before: "<structural>", after: "<structural>"}
removes: []                   # canonical node IDs retired — Phase 1 when FRS explicitly retires; Phase 2 for FS-emergent retirements
supersedes: []                # canonical node IDs superseded; successors live in adds[] (Phase 2-filled)
invariants_before: []         # cross-node invariants before the merge — Phase 1 for milestone-level; Phase 2 for node-local
invariants_after: []          # cross-node invariants after the merge — same posture as invariants_before
migration_steps: []           # Phase-2-wired only. Ordered migration / backfill steps required at merge. Phase 1 author leaves empty.
related: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# CHG-NNN: <Title>

> **Lifecycle + mechanics:** see
> [`../../workflow/in-flight-nodes.md → CHG mechanics`](../../workflow/in-flight-nodes.md#chg-mechanics)
> (Phase-1 birth, Phase-2 enrichment, Phase-3 merge;
> `draft → approved → merged`; `target_fs:` retired per R-CHG-3).
> **FS consumption procedure:** see
> [`../../workflow/plan.md`](../../workflow/plan.md)
> (`consumes_chgs:` reverse-glob, sibling-CHG fold, splitting heuristics).
>
> **File location** (permanent milestone-scoped home — never promoted to
> canonical):
> - Milestone track: `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md`
> - CR track: `docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md`

## Scope

One or two sentences. What is this change in service of — which FRS births
it (Phase 1), and which canonical area does it touch? The consuming FS is
identified later by reverse-glob of `consumes_chgs:` — do not pre-name it
at Phase 1 birth.

## Modifications

Mirrors `modifies:`. **Phase 1 author writes the behavior-language delta
only** — business-language descriptions of what the canonical node's
behavior changes to. Do NOT reach for structural detail (field names,
method signatures, Sequence step numbers, ENT/CMD/STA IDs in
before/after columns) — those are not yet defined. The same discipline
that governs Phase-1 FLW Scenarios and Phase-1 ACT Preconditions applies
here.

**Phase 1 (behavior-language) example:**

| Node | Behavior delta |
| ---- | -------------- |
| FLW-001 | Adds a fault path when the upstream service responds 503; the actor sees a retry option. |
| ACT-001 | Preconditions add a permission requirement before initiating the flow. |

**Phase 2 FS enrichment** adds the structural before/after to each row:

| Node | Behavior delta | Before (structural) | After (structural) |
| ---- | -------------- | ------------------- | ------------------ |
| FLW-001 | <Phase-1 text, unchanged> | Sequence steps 1–4 | Sequence steps 1–4 plus new step 5 invoking CMD-007 in fault branch |
| ACT-001 | <Phase-1 text, unchanged> | Preconditions: business-language only | Preconditions add PERM-009 ref |

## Additions

Mirrors `adds:`. **Phase 2 FS enrichment** lists new canonical nodes the
consuming FS introduces. Each must already exist at
`docs/<component>/nodes/<type>/<ID>-<slug>.md` with `status: proposed`
(written by Phase 2 ingest before this CHG's `adds[]` is populated).
Phase 3 merge flips them to `status: active` alongside applying this
CHG's `modifies[]` / `removes[]` / `supersedes[]`.

**Phase 1 author leaves this section empty** — no new nodes exist yet.

- ACT-NNN — <one line>
- ENT-NNN — …

## Removals

Mirrors `removes:`. Canonical nodes retired with no successor. Phase 1
when the FRS explicitly retires a node; Phase 2 for FS-emergent
retirements.

- ENT-NNN — <one-line reason>

## Supersessions

Mirrors `supersedes:`. Old node → new node (the successor must appear in
`adds:`, which is Phase-2-filled). Phase 1 may list supersessions when the
FRS explicitly declares them; the successor side lands at Phase 2.

- ENT-NNN-old → ENT-NNN-new

## Invariant delta

Cross-node invariants the merge changes. Phase 1 carries milestone-level
invariants (cross-FRS, cross-node); Phase 2 enriches with node-local
invariants surfaced during structural authoring.

- Before: …
- After: …

## Migration steps

**Phase 2 FS enrichment** — ordered steps required at Phase 3 merge to
keep data and code consistent with the new canonical shape. Phase 1
author leaves this section empty (no structural detail yet).

1. …
2. …

## Brownfield notes

Existing schemas / migrations / fixtures affected by this change map.
Optional at both phases.
