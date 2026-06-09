---
id: STA-NNN
type: state
title: <Entity name> state machine
status: proposed              # proposed | active | superseded | deprecated
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
entity: ENT-NNN
related: []                   # [ENT-NNN, CMD-NNN, FLW-NNN, ...] — bidirectional per workflow/bidirectional-link.md
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# STA-NNN: <Title>

## States

| State | Description | Role |
| ----- | ----------- | ---- |
|       |             | `initial` \| `normal` \| `terminal` |

## Transitions

| From | To | Trigger (CMD) | Guard | Event raised |
| ---- | -- | ------------- | ----- | ------------ |

The `Event raised` column must match what the triggering CMD declares under
its own `## Domain events raised`. Mirroring it here keeps the three-way
reconciliation (STA ↔ CMD ↔ ENT) mechanical.

## Illegal transitions

Combinations explicitly disallowed. These are the invariants the state machine enforces.

- …

## Terminal handling

For each state with `Role: terminal`, name what happens to the entity once
it lands there. Pick exactly one mode per terminal state. A terminal state
that accepts further modifications is a defect — the state machine is
either lying about being terminal, or the entity needs an explicit "frozen
after terminal" rule.

| Terminal state | Mode | Notes |
| -------------- | ---- | ----- |
|  | `read-only` \| `soft-delete` \| `archival` | <e.g., visible to admin only, purged at T+N days> |

## Brownfield notes

Existing status field / enum / column this maps to:
