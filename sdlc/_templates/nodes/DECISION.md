---
id: DEC-NNN
type: decision
title: <Decision title>
status: proposed              # proposed | active | superseded | deprecated
supersedes: null              # DEC-NNN if this replaces a prior decision
superseded_by: null           # DEC-NNN if this has been replaced
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # nodes affected by this decision; may include ADR-NNN if this DEC is a node-specific application of a workspace ADR
resolves: []                  # OQ-NNN IDs this DEC closes; reciprocal — each OQ's `resolved_by:` cites this DEC
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# DEC-NNN: <Title>

> **Title discloses the decision, not the topic.** "Use string-stored enums
> for workflow state fields" — not "Event strategy" or "Enum handling". The
> index row should read as a one-sentence summary of what was decided.

## Context

What situation forced this decision?

## Decision

What was decided. One sentence if possible.

## Rationale

Why this option, not the alternatives.

## Alternatives considered

- <alternative> — why rejected:
- <alternative> — …

## Consequences

What this decision now requires or constrains downstream.

- …

## Revisit if

The condition under which this DEC should be reconsidered. When that
boundary moves, the decision is suspect.

- …

## Affected nodes

- ENT-NNN, CMD-NNN, FLW-NNN, INT-NNN
