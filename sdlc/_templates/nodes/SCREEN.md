---
id: SCR-NNN
type: screen
title: <Screen / view / major-component name>
status: proposed              # proposed | active | superseded | deprecated
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
actor: ACT-NNN                # which actor sees this screen
shows: []                     # ENT-NNN IDs displayed
invokes: []                   # CON-NNN IDs triggered from this screen (HTTP contracts)
observes: []                  # STA-NNN IDs whose value affects display
nav_from: []                  # SCR-NNN IDs that link to this screen
nav_to: []                    # SCR-NNN IDs this screen links to
module: MOD-NNN               # the bounded context this screen lives in
code_ref: []                  # screen-level realizing file(s) (ADR-035). [{path: ui/src/..., role: primary | panel | variant}]
                              # primary = the page that is this screen; panel = sub-surface on a host page; variant = an alternate (portal/on-behalf) realization.
                              # Machine-queryable join key for kb:trace; paths only, never spec text. [] when no realizing file exists yet.
related: []
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# SCR-NNN: <Title>

> Scope: what the actor sees and can do. Omit framework, routing, and
> styling detail.

## Description

One or two sentences. Where does the actor arrive here from, and what is
the screen for?

## Layout / UI intent

Conceptual, not pixel-precise. What information is foregrounded? What
actions are reachable? Group by region if useful (header / primary / aside
/ footer), but keep it about purpose, not styling.

- …

## Display states

What the screen renders when it isn't in the happy steady state. Every
screen has these four implicit states; naming them here keeps fault paths
out of code-only territory. Omit a row only if the state is genuinely
unreachable (e.g., a public read-only screen with no auth has no
`unauthorized` state).

| State | Trigger | What the actor sees |
| ----- | ------- | ------------------- |
| `empty` | Query returns no rows | <e.g., empty-state copy + primary action to create> |
| `loading` | Query in flight | <skeleton / spinner / progressive reveal> |
| `error` | Invoked contract failed | <error surface; retry affordance if applicable> |
| `unauthorized` | Actor lacks required PERM | <403 surface / redirect / hidden> |

## Displayed entities

Mirrors `shows:`. One row per entity surfaced on the screen.

| Entity | Fields shown | Notes |
| ------ | ------------ | ----- |
| ENT-NNN | … | … |

## Invoked contracts

> `invokes:` must reference CON nodes only (typically `protocol: http`
> for web UIs). A SCR referencing a FLW, CMD, or QRY directly is a
> modelling violation.

| Contract | Action surface | Visible / enabled when |
| -------- | -------------- | ---------------------- |
| CON-NNN | <button / menu item / form submit> | PERM-NNN holds, or <state condition> |

## Observed states

Mirrors `observes:`. State values that affect what the screen renders or
which actions are enabled.

- STA-NNN — <how the state affects the screen>

## Navigation

- Nav from: SCR-NNN — <trigger>
- Nav to: SCR-NNN — <trigger>

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

Existing route / page / component file this screen maps to. Narrative context
(which tab, what it replaces, counterexamples) lives here; the bare realizing
file path(s) are mirrored into the queryable `code_ref:` frontmatter slot
(ADR-035) so `kb:trace` can reconcile the screen↔code edge.
