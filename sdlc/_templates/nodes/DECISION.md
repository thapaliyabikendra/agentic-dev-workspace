---
id: DEC-NNN
type: decision
title: <Decision title>
status: proposed              # proposed | active | superseded | deprecated
supersedes: null              # DEC-NNN if this replaces a prior decision
superseded_by: null           # DEC-NNN if this has been replaced
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # nodes affected by this decision; may include ADR-NNN if this DEC is a node-specific application of a workspace ADR
standards: []                 # STD IDs this DEC's host node consumes (echoes the FS's `standards:` set narrowed to what this DEC's behavior depends on)
ccc: []                       # CCC IDs this DEC's host node cites (echoes the FS's `ccc:` set narrowed to this DEC's scope)
stack: []                     # subset of api | ui | test | full-stack | infra | agnostic — canonical enum in ../../BOUNDARY.md § Stack axis
resolves: []                  # OQ-NNN IDs this DEC closes; reciprocal — each OQ's `resolved_by:` cites this DEC
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# DEC-NNN: <Title>

> Body cross-references may use wiki links - `[[ID]]` / `[[ID|label]]` (convention: `sdlc/KB-LAYOUT.md` § Wiki-link syntax; docs/ only).

> **Title discloses the decision, not the topic.** "Use string-stored enums
> for workflow state fields" — not "Event strategy" or "Enum handling". The
> index row should read as a one-sentence summary of what was decided.
>
> **Body length ≤60 lines (excl. frontmatter).** DECs are node-local — keep
> them shorter than ADRs. If the rationale overflows, the decision is
> probably ADR-scoped; re-run the discriminator in
> [`../../workflow/authoring-adr.md`](../../workflow/authoring-adr.md).

## Context

What situation forced this decision? **One short paragraph.**

## Decision

What was decided. **One sentence if possible.**

## Rationale

Why this option, not the alternatives. **≤3 lines.**

## Alternatives considered

**≤2 entries, ≤1 line each.**

- <alternative> — why rejected:
- <alternative> — …

## Consequences

What this decision now requires or constrains downstream. **≤3 bullets.**

- …

## Revisit if

The condition under which this DEC should be reconsidered. When that
boundary moves, the decision is suspect. **≤2 bullets.**

- …

## Affected nodes

- ENT-NNN, CMD-NNN, FLW-NNN, INT-NNN

---

> Index row carries `title` (≤120 chars). Schema: [`../../workflow/retrieval-discipline.md § Index row schemas`](../../workflow/retrieval-discipline.md#index-row-schemas).
