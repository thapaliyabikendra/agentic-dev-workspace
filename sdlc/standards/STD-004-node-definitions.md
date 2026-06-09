---
id: STD-004
title: Engine-level per-node-type contract guarantees
status: deferred
created: 2026-05-13
updated: 2026-05-19
supersedes: null
superseded_by: null
tags: [deferred, methodology, node-types, ndf-pilot-log]
scope: engine
applies_when:
  stack: [agnostic]
source: seed
related_adrs: []
deferred_until: "first project outside this workspace adopts the methodology and surfaces a contract drift"
operative_source: "../_templates/nodes/"
---

# STD-004: Engine-level per-node-type contract guarantees

> **Engine-level technical standard.** Applies to any project using this
> methodology. Defines what each canonical node type (ACT, ENT, CMD, QRY,
> FLW, STA, DEC, INT, MOD, SCR, CON, PERM, SVC, FA, EVT, CHG) is contractually obligated
> to carry — frontmatter fields, body sections, link shape.

## Scope

The minimum contract for each node type. What a generator can assume about
a node of a given type, regardless of which project authored it.

## Standards

**Deliberately deferred.** The operative per-node-type contracts live in the
per-type templates at [`../_templates/nodes/`](../_templates/nodes/) — each
template's frontmatter and section headings *are* the contract for now.
This standard is reserved for the prose codification — written when a
second project surfaces a real contract drift that the template-as-contract
model cannot resolve.

The deferral is **explicit, not accidental**: the `status: deferred` flag
in frontmatter, the `deferred_until:` trigger, and the `operative_source:`
pointer together signal that consulting `_templates/nodes/` is the correct
substitute, not a workaround. Lint checks should treat this STD as
intentionally unpopulated, not orphaned.

**NDF as per-component analog (per [ADR-039](../../docs/shared/adrs/ADR-039-ndf-fifth-governance-kind.md)).**
While STD-004 remains deferred for cross-project contracts, **NDF (Node
Definition Node)** is the operative per-component path that fires now: a
component coins an NDF in `docs/<component>/node-definitions/` to declare a
custom node-type contract; instances of that type validate against the NDF
at Phase 2 ingest via the **Phase 2 type-validity HARD-GATE**. NDF is
strictly narrower than STD-004 (component-scoped, not methodology-universal).

**Bidirectional escalation (NDF ↔ STD-004).** When a deployed NDF's
contract surfaces a generalization that should apply across projects, STD-004
absorbs it per this file's `## Revisit if` clause. The NDF remains as the
per-component instance; STD-004 holds the cross-project contract. Promotion
mechanics mirror DEC → ADR scope-creep: STD-004 is updated, the originating
NDF cites it via `related:`, and any future component reuses STD-004
directly rather than re-declaring per-NDF.

## Consequences

When populated, this standard becomes the reference any new node type added
via [`../workflow/evolving-the-workflow.md`](../workflow/evolving-the-workflow.md)
must conform to. Phase 1.5 will validate node frontmatter against the
codified contract.

## Project-specific deviations

A project that needs a non-standard frontmatter field on a node type files
an ADR back-linking here.

## Revisit if

A new node type lands and its contract surfaces a generalization the
existing types should also carry — at that point this standard is updated
to absorb the generalization.

### Candidate generalizations — FDE NDF pilot (logged 2026-05-19, not yet activating)

> **Project-pilot quarantine.** Everything in this section is
> observation data from one originating project's FDE component
> (project-specific NDF IDs, field names, domain references) — it is
> NOT engine contract. Nothing here binds any consumer until STD-004's
> `deferred_until:` trigger fires and a candidate is promoted into the
> standard's body proper, at which point this log section empties into
> the rules and the project-specific provenance moves to
> [`log.md`](log.md).

Sourced from Stage 7 cross-instance validation of FDE-NDF-001/002/003 +
their three pilot instances. Each candidate is a feature that would plausibly
recur across components if STD-004 were activated. Logged here per ADR-039
"bidirectional escalation"; activation still waits on the deferred-until
trigger.

**From FDE-NDF-001 (Algorithm):**

- **`## Numerical notes` body section.** Catastrophic-cancellation risk,
  edge-case behavior (antipodal points, divide-by-zero, NaN propagation),
  and domain-constant choice (atan2 vs asin) recur across every algorithm.
  Welford and Z-score would carry identical sub-bullets to Haversine's.
- **Conditional-required `min_sample_size:`.** Required when
  `algorithm_family: statistical`, optional otherwise. Cannot be expressed as
  a flat YAML enum; needs an STD-004 validation-gate rule keyed on
  `algorithm_family`.
- **`complexity:` (Big-O).** Optional in FDE-NDF-001 but a natural required
  field for any algorithm. Catches undocumented complexity regressions.

**From FDE-NDF-002 (Scenario):**

- **`regulatory_ref:` (bare-section ID list).** Every scenario across
  AML/fraud components carries regulator-section citations. The bare-ID
  convention (no `req-` prefix) is the absorption-worthy form.
- **`signal_emits:` + `signal_weight:` axis.** Every scenario emits a named
  signal with a default weight; the pair is the cross-component contract for
  fraud-scenario nodes.
- **Mandatory `## False-positive profile` body section.** Every scenario
  reasons about FP/FN tradeoffs; absent today in many component
  decision-records, but appears naturally in every scenario-shaped artifact.

**From FDE-NDF-003 (Store):**

- **`code_class:` (FQCN optional frontmatter).** Strong cross-NDF candidate
  for any node type that binds to a code symbol (ALG, STR, FA).
- **`(backend, ttl, eviction_policy, replication)` quartet.** Tight
  infrastructure axis that recurs across any platform with tiered storage.
- **`owned_by:` / `accessed_by:` bifurcation.** Lifecycle ownership vs.
  read/write access — a pattern likely to recur in SVC and INT nodes if
  the engine ever needs to encode access semantics.

**Log discipline.** New entries land here when a future NDF (FDE or other
component) confirms a pattern. Promotion of any candidate to STD-004's
operative `## Standards` section requires the deferred-until trigger to fire
first.
