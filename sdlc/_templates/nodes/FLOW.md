---
id: FLW-NNN
type: flow
title: <Flow name>
status: proposed              # proposed | active | superseded | deprecated
mode: sync                    # sync | async
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # commands sequenced, states transitioned, actors
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# FLW-NNN: <Title>

## Trigger

What starts this flow?

- Actor: ACT-NNN
- Initiating command: CMD-NNN

## Sequence

Ordered steps. Each step references a command or a decision.

1. CMD-NNN — <one line>
2. DEC-NNN — <decision point, branches below>
3. CMD-NNN — <one line>

## Branches and gates

Logic conditions that affect the sequence above.

- If <condition> → step N proceeds to …
- Else → …

## Compensating actions

> Required when `mode: async`. Omit when `mode: sync`.

How is partial work undone if a downstream step fails after the
initiating command has already committed?

- Step N failure → …
- Rollback mechanism: …

## Postconditions

What is true after the happy path completes — independent of the
scenario narrative. Downstream flows that chain off this one read this
section to know what they can assume on entry. Edge / fault terminal
states live inside the Scenarios section, not here.

- Primary aggregate state: <e.g., ENT-NNN in STA-NNN.Approved>
- Side effects committed: <events emitted, integrations called>
- Downstream flows now enabled: FLW-NNN

## Scenarios

These are the QA source of truth and the test-plan spine. Each slot must be
filled. Feature Specs and FRSs link to these by anchor (e.g.,
`FLW-NNN#happy`) — never copy.

**Shape:** Given / When / Then. The shape is locked so test-suite generation
can extract scenarios mechanically. Each `Given` / `When` / `Then` is one or
more bullets; keep bullets short and verifiable.

### Happy path {#happy}

- **Given**
  - <starting state, persona, preconditions>
- **When**
  - <actor action(s)>
- **Then**
  - <observable outcome(s)>

### Edge case {#edge}

For each non-happy branch, the `Given / When / Then` should disclose three
things: the **trigger condition** that diverts from happy (in `Given`), the
**divergence point** — which numbered step in the Sequence above this branch
forks at (in `When`) — and the **terminal state** the flow lands in (in
`Then`). If a scenario has two divergence points, it's two scenarios.

- **Given**
  - <starting state including the edge trigger condition>
- **When**
  - <actor action(s); name the Sequence step number this diverts from>
- **Then**
  - <observable outcome(s); the terminal state the flow lands in>

### Fault path {#fault}

- **Given**
  - <starting state>
- **When**
  - <action that triggers the failure; name the Sequence step number>
- **Then**
  - <expected system response: error surface, state rollback, recovery; the
    terminal state>



## Decisions

> **Inline DEC** — single-node atomic rationale lives here. Promote to a
> standalone DEC under `docs/nodes/decisions/` when **any** of these
> trigger: scope spans ≥2 nodes; lifecycle (`status` / `superseded_by`) is
> needed; rationale grows past ~5 sentences with explicit Alternatives /
> Revisit-if blocks; external nodes need to cite by ID. See
> [`../../workflow/authoring-adr.md`](../../workflow/authoring-adr.md).
>
> Omit this section if the node has no node-local decisions worth recording.

### DEC-inline-1 — <slug>

**Decision:** <one or two sentences>
**Why:** <one or two sentences>
**Related:** <node IDs this rationale touches beyond the host, if any>

<!-- Add additional inline DECs as needed; promote to standalone when triggers fire. -->

## Brownfield notes

Existing handler / controller / orchestrator this flow corresponds to:
