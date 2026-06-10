---
name: design-pre-frs-artifacts
description: "Detail file of design.md — Survey vs Exploration vs OQ vs ADR/DEC artifact discrimination, shape detection, cross-linking. Load when choosing a pre-FRS artifact type."
applies_when:
  stack: [agnostic]
---

# Pre-FRS artifact types

> Detail file of [`design.md`](../design.md) (Phase 0/1/1.5 flow). Load when
> choosing a Survey vs Exploration vs OQ artifact.

Two artifact families serve pre-commitment thinking. They live by
different disciplines.

**Survey** — `docs/milestones/M-NN/discovery/`, template
[`../../_templates/SURVEY.md`](../../_templates/SURVEY.md). Procedural artifact
consumed by Phase 0 milestone scoping and Phase 1 FRS authoring (and
the absorption workflow). Closed `kind:` enum (`new-feature` |
`change-request` | `absorb-legacy-doc`), mandatory sections per kind,
2-file touch. Use Surveys when the workflow expects them — i.e., as
inputs to Phase 0 / Phase 1 / absorption.

**Exploration** — `docs/exploration/`, template
[`../../_templates/EXPLORATION.md`](../../_templates/EXPLORATION.md). Free-form
working knowledge. Minimal mandatory frontmatter (id, title, status,
created), optional everything else, 1-file routine touch, no log.md.
Use Explorations any time you're thinking on paper outside the
milestone path: propositions, spikes, bug investigations, option
weighing, anything.

Related surfaces:

- **OQ-NNN** (`docs/discovery/open-questions/`) — first-class artifacts for
  answerable open questions. Use when the question needs a resolver artifact
  (DEC / ADR / FRS) before work can continue. Discovery-surface touch: 1-file
  for routine edits, 2-file (artifact + `open-questions/index.md` if one
  exists) for terminal lifecycle events (`resolved`, `rejected`, `escalated`).
  No `log.md` — see
  [`maintenance-discipline.md → Discovery surface discipline`](../maintenance-discipline.md#discovery-surface-discipline).
  See [`../../_templates/OPEN-QUESTION.md`](../../_templates/OPEN-QUESTION.md).
- **ADR / DEC** — commitments. Promote to ADR when cross-cutting; DEC when
  node-local. See [`authoring-adr.md`](../authoring-adr.md).

## Shape detection (Exploration only)

Exploration has no `kind:` field. The artifact's shape is detected
from frontmatter presence, not declared:

- `hypothesis:` present → spike-shaped. The workflow gates any related
  ADR's `proposed → accepted` flip on `outcome:` being filled.
- `affects_nodes:` present → bug-shaped. The template offers suggested
  body sections; none are mandatory.
- Neither present → free-form note. No special workflow.

## Cross-linking

Exploration → commitment:

- The consumer (milestone / FRS / ADR) declares
  `from_exploration: [EXP-<slug>]` in its frontmatter.
- The Exploration declares `adopted_into: [<consumer-id>]`.

Surveys do not need this cross-linking — they're consumed by the
procedure that authored them; the consumption is implicit in the
milestone path.

## When in doubt

If you're not sure whether a note is a Survey or an Exploration: it's
an Exploration. Surveys exist only when Phase 0 / Phase 1 / absorption
explicitly call for one.
