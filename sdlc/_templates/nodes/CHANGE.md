---
id: CHG-NNN
type: change
title: <Change-map title — FS-NNN delta, or per-touchpoint slug>
status: draft                 # draft | approved | merged
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: modify}] · brownfield: [{absorption: <path>, op: modify}]
target_fs: FS-NNN             # the spec that emits this change map
adds: []                      # new canonical node IDs introduced by the FS
modifies: []                  # [{node: ENT-NNN, before: "<summary>", after: "<summary>"}]
removes: []                   # canonical node IDs retired
supersedes: []                # canonical node IDs superseded; successors live in adds[]
invariants_before: []         # cross-node invariants the system held before the merge
invariants_after: []          # cross-node invariants the system holds after the merge
migration_steps: []           # ordered migration / backfill steps required at merge
related: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# CHG-NNN: <Title>

## Scope

One or two sentences. What is this change in service of — which FRSs?
Which canonical area?

## Additions

Mirrors `adds:`. New canonical nodes this FS introduces. Each must already
exist at `docs/nodes/<type>/<ID>-<slug>.md` with `status: proposed`
(written by Phase 2 ingest before this CHG was authored). Phase 3 merge
flips them to `status: active` alongside applying this CHG's
`modifies[]` / `removes[]` / `supersedes[]`.

- ACT-NNN — <one line>
- ENT-NNN — …

## Modifications

Mirrors `modifies:`. One row per canonical node touched, with the
before/after delta in plain prose.

| Node | Before | After |
| ---- | ------ | ----- |
| ENT-NNN | <invariant or field as it stood> | <invariant or field after merge> |
| FLW-NNN | <sequence as it stood> | <sequence after merge> |

## Removals

Mirrors `removes:`. Canonical nodes retired with no successor.

- ENT-NNN — <one-line reason>

## Supersessions

Mirrors `supersedes:`. Old node → new node (the successor must appear in
`adds:`).

- ENT-NNN-old → ENT-NNN-new

## Invariant delta

Cross-node invariants the merge changes.

- Before: …
- After: …

## Migration steps

Ordered steps required at Phase 3 merge to keep data and code consistent
with the new canonical shape.

1. …
2. …

## Brownfield notes

Existing schemas / migrations / fixtures affected by this change map:
