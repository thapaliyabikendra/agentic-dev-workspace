---
id: STD-004
title: Engine-level per-node-type contract guarantees
status: deferred
created: 2026-05-13
updated: 2026-05-16
supersedes: null
superseded_by: null
tags: [deferred, methodology, node-types]
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
