---
id: ADR-NNN
title: <Decision in imperative voice, one sentence>
status: proposed              # proposed | accepted | deprecated | superseded
created: YYYY-MM-DD
updated: YYYY-MM-DD
supersedes: null              # ADR-NNN if this replaces a prior decision
superseded_by: null           # ADR-NNN if this has been replaced
tags: []                      # free-form; drives index filtering (e.g. testing, layering, security)
components: []                # major component slugs (auth, billing, ui-shell, ...)
stack: [agnostic]             # subset of api | ui | test | full-stack | infra | agnostic — canonical enum in sdlc/BOUNDARY.md § Stack axis
affected_nodes: []            # cross-refs to DDD nodes if relevant (ENT-NNN, FLW-NNN, ...)
frs_origin: null              # FRS-NNN if this emerged from an FRS dialog
fs_origin: null               # FS-NNN if this was promoted from an FS architecture decision
related_adrs: []              # other ADRs that share context or constrain together
resolves: []                  # OQ-NNN, DEC-NNN, or FRS-NNN IDs this ADR closes; reciprocal — each OQ's `resolved_by:` cites this ADR
---

# ADR-NNN: <Title>

> Workspace-level architectural commitment. Constrains how we'd design future
> nodes we haven't met yet. Reference, never copy: FRS / FS / Discovery link
> this ADR by ID rather than restating it.
>
> If the decision shapes one specific node's behavior, it belongs in a DEC node
> under `docs/nodes/decisions/` — not here.
>
> **Body length ≤80 lines (excl. frontmatter).** Caps per section below.
> If the rationale overflows, deeper context belongs in a research doc or FS,
> not the ADR. See [`../workflow/retrieval-discipline.md § ADRs`](../workflow/retrieval-discipline.md#adrs).

## Context

What situation forced this decision? What constraints or pressures made it
necessary? **Two short paragraphs.** Cite sources where relevant.

## Decision

What was decided. **One sentence if possible.** Imperative voice.

## Rationale

Why this option, not the alternatives. What does it optimize for, and what
does it cost? **≤5 lines.**

## Alternatives considered

Real trade-offs only. If you can't write a real trade-off for an alternative,
drop it — see [`../PRINCIPLES.md`](../PRINCIPLES.md). **≤3 entries, ≤1 line each.**

- **<alternative>** — optimizes for …, trades off …. Rejected because …
- **<alternative>** — …

## Consequences

What this decision now requires or constrains downstream. What future work
must conform to it. What it forbids. **≤5 bullets.**

- …
- …

## Revisit if

The condition under which this ADR should be reconsidered. Names the boundary
the decision assumes — when that boundary moves, the decision is suspect.
**≤3 bullets.**

- …

## Related ADRs

**≤5 entries.**

- ADR-NNN — <one-line link explaining the relationship>

---

> Index row carries `title` (≤120 chars). Schema: [`../workflow/retrieval-discipline.md § Index row schemas`](../workflow/retrieval-discipline.md#index-row-schemas).
