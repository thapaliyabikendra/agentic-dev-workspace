---
id: STD-NNN
title: <Engine-level rule, imperative voice, one sentence>
status: proposed              # proposed | accepted | deferred | deprecated | superseded
created: YYYY-MM-DD
updated: YYYY-MM-DD
supersedes: null              # STD-NNN if this replaces a prior standard
superseded_by: null           # STD-NNN if this has been replaced
tags: []                      # free-form
scope: engine                 # always `engine` for files under sdlc/standards/
applies_when:                 # conditional applicability — engine-wide default is `agnostic`
  stack: [agnostic]           # subset of: api | ui | test | full-stack | infra | agnostic
  # framework: [abp-net]      # optional; add when the standard is framework-conditional (enum in BOUNDARY.md § Framework axis)
source: seed | harvested-from-ADR-NNN | proposal
related_adrs: []              # docs/adrs/ ADRs that codify project-specific deviations from this standard, or ADRs harvested-from
# deferred_until: "<trigger condition>"   # optional; required when status: proposed or status: deferred — names the event that flips the standard to `accepted`
# operative_source: "<path>"              # optional; companion to `deferred_until:` — names the path (template, NDF, or other standard) that fills the gap until this standard graduates
---

# STD-NNN: <Title>

> **Engine-level technical standard.** Applies to any project using this
> methodology. Project-specific deviations are ADRs in `docs/adrs/` that
> back-link here; node-local atomic decisions are DECs (inline under a
> host node's `## Decisions` heading, or standalone under
> `docs/nodes/decisions/`). See
> [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) for the
> Standard / ADR / DEC discriminator.

## Scope

What this standard governs. One short paragraph. Name the boundary the
standard assumes — when the boundary moves, the Revisit-if section names
the trigger.

## Standards

The rules themselves. One short bullet per rule. No prose explanation
unless the rule is non-obvious.

- …
- …

## Consequences

What downstream artifacts must conform to. What this standard forbids.
What the Phase 1.5 validation gate flags as a `standard-conflict` finding.

- …

## Project-specific deviations

ADRs that codify deviations from this standard. Empty if none.

- ADR-NNN — <one-line summary of the deviation and why this project
  needs it>

## Revisit if

The condition under which this standard should be reconsidered. Names the
boundary the rule assumes — when that boundary moves, the rule is suspect.

- …
