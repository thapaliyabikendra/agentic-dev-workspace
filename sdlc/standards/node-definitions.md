---
id: STD-004
title: Engine-level per-node-type contract guarantees
status: proposed
created: 2026-05-13
updated: 2026-05-13
supersedes: null
superseded_by: null
tags: [placeholder, methodology, node-types]
scope: engine
applies_when:
  stack: [agnostic]
source: seed
related_adrs: []
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

**Placeholder — currently empty.** The de-facto contracts currently live in
the per-type templates at [`../_templates/nodes/`](../_templates/nodes/) —
each template's frontmatter and section headings *are* the contract. This
standard codifies them in prose so contracts can be cited, audited, and
versioned independent of the template files.

Populate when the first node-type contract is codified (likely when the
first project outside this workspace adopts the methodology and surfaces a
contract drift). Until then, the templates are the operative source.

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
