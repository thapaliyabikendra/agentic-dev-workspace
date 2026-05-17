---
id: FLW-NNN
type: flow
title: <Flow name>
status: proposed              # proposed | active | superseded | deprecated
mode: sync                    # sync | async
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # Phase 1: empty []. Phase 2: commands sequenced, states transitioned, actors
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
# created_under: pre-2026-05-17    # GRANDFATHER-ONLY. One-off audit marker for FLWs born under the pre-cutover (pre-2026-05-17) model — exempts the node from R-NEW-8's body-shape discriminator. NOT for FLWs born after the cutover; Phase 1.5 Pass 1 flags illegitimate use as a Major finding. Currently used only by FLW-003 (per B5). Retires when FLW-003 flips to status: active at Phase 3.
---

# FLW-NNN: <Title>

> **Phase-keyed authoring.** FLW is born at Phase 1 (alongside its FRS) with
> the Phase 1 sections filled and `related: []` empty; Phase 2 enriches the
> same file with wiring (`related:` populated, Sequence, Branches,
> Compensating actions, structural Postconditions, Decisions). Status stays
> `proposed` across both phases; Phase 3 flips `proposed → active`.
>
> **Body-shape discriminator (R-NEW-8):** `related: []` ⇒ Phase-1-bare;
> `related: [...]` populated ⇒ Phase-2-wired. The `created_under:` marker
> (above) is the only exemption.

## Trigger

> **Phase 1 — required.** Actor action only — business language.
> **Phase 2 — enriched.** Restore the `Initiating command:` line below.

What starts this flow?

- Actor: ACT-NNN          <!-- ACT-NNN ID is real (recorded in id-claims.md); the canonical ACT file may not exist on disk yet — ACT births at Phase 2 (R-NEW-2a retired 2026-05-17). The Trigger names the ID regardless. -->
<!-- Phase 2: uncomment and fill once CMD-NNN is allocated. -->
<!-- - Initiating command: CMD-NNN -->

## Scenarios

> **Phase 1 — required.** Each slot must be filled in business language —
> "a registered user with verified email", not "an ENT-001 in STA-002.Verified
> state". Node IDs (ENT/CMD/STA) do NOT exist at Phase 1 — using them
> here is a sanity violation Phase 1.5 catches.
> **Phase 2 — unchanged.** Scenarios are the QA source of truth and the
> test-plan spine. Feature Specs and FRSs link to these by anchor
> (`FLW-NNN#happy`) — never copy.

**Shape:** Given / When / Then. The shape is locked so test-suite generation
can extract scenarios mechanically. Each `Given` / `When` / `Then` is one or
more bullets; keep bullets short and verifiable.

### Happy path {#happy}

- **Given**
  - <starting state, persona, preconditions — business language>
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

At Phase 1, the "Sequence step number" reference in `When` is a forward
reference (Sequence is Phase-2). Author by behavior — "when the system
detects the duplicate" — and Phase 2 enrichment lands the step number.

- **Given**
  - <starting state including the edge trigger condition>
- **When**
  - <actor action(s); Phase 2 adds the Sequence step number>
- **Then**
  - <observable outcome(s); the terminal state the flow lands in>

### Fault path {#fault}

- **Given**
  - <starting state>
- **When**
  - <action that triggers the failure; Phase 2 adds the Sequence step number>
- **Then**
  - <expected system response: error surface, state rollback, recovery; the
    terminal state>

## Brownfield notes

> **Phase 1 — optional.** Author observation about existing
> handler / controller / orchestrator this flow corresponds to. No node ID
> references required.

Existing handler / controller / orchestrator this flow corresponds to:

---

> **Sections below are Phase 2 enrichment.** Do NOT author them at Phase 1.
> Phase 1.5 Pass 1 sanity check flags any of these sections containing
> content under a Phase-1-bare node (`related: []`, no `created_under:`
> marker).

## Sequence

> **Phase 2 — required.** Ordered steps. Each step references a command or a
> decision. References real Phase-2-born CMD-NNN / DEC-NNN IDs.

1. CMD-NNN — <one line>
2. DEC-NNN — <decision point, branches below>
3. CMD-NNN — <one line>

## Branches and gates

> **Phase 2 — required.** Logic conditions that affect the sequence above;
> references Sequence step numbers.

- If <condition> → step N proceeds to …
- Else → …

## Compensating actions

> **Phase 2 — required when `mode: async`. Omit when `mode: sync`.** Requires
> named CMDs (Phase-2-born).

How is partial work undone if a downstream step fails after the
initiating command has already committed?

- Step N failure → …
- Rollback mechanism: …

## Postconditions

> **Phase 2 — required.** Structural postconditions — what is true after the
> happy path completes, expressed against ENT/STA/downstream FLW IDs.
> Downstream flows that chain off this one read this section to know what
> they can assume on entry. Edge / fault terminal states live inside the
> Scenarios section, not here.

- Primary aggregate state: <e.g., ENT-NNN in STA-NNN.Approved>
- Side effects committed: <events emitted, integrations called>
- Downstream flows now enabled: FLW-NNN

## Decisions

> **Phase 2 — optional.** Inline DEC — single-node atomic rationale lives
> here. Promote to a standalone DEC under `docs/<component>/nodes/decisions/`
> when **any** of these trigger: scope spans ≥2 nodes; lifecycle
> (`status` / `superseded_by`) is needed; rationale grows past ~5 sentences
> with explicit Alternatives / Revisit-if blocks; external nodes need to
> cite by ID. See [`../../workflow/authoring-adr.md`](../../workflow/authoring-adr.md).
>
> Omit this section if the node has no node-local decisions worth recording.

### DEC-inline-1 — <slug>

**Decision:** <one or two sentences>
**Why:** <one or two sentences>
**Related:** <node IDs this rationale touches beyond the host, if any>

<!-- Add additional inline DECs as needed; promote to standalone when triggers fire. -->
