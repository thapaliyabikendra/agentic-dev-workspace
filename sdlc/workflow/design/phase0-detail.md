---
name: design-phase0-detail
description: "Detail file of design.md Phase 0 — mid-phase milestone-split procedure, brownfield code-mining and prototype-seeding entry routes. Load when the milestone is brownfield, prototype-sourced, or needs a mid-Phase-0 split."
applies_when:
  stack: [agnostic]
---

# Phase 0 detail — split procedure + brownfield / prototype entry routes

> Detail file of [`design.md`](../design.md) (Phase 0/1/1.5 flow). Load when
> a mid-Phase-0 scope split surfaces, or when the milestone seed is existing
> code or a UI prototype.

## Mid-Phase-0 milestone split

**If a split need surfaces partway through Phase 0** (after some discovery
is drafted): narrow the current milestone's scope statement in
`milestone-scope.md` to the retained concern, then either (a) open a new
milestone via [`open-milestone.md`](../open-milestone.md) for the
out-of-scope concern and migrate any already-drafted discovery content
into its discovery folder, or (b) raise an `OQ-NNN` under
`docs/discovery/open-questions/` with
`origin: milestone-scoping, needed_by: roadmap` if the out-of-scope
concern is genuinely deferrable. Do not delete already-drafted
discovery — preserve it through migration or OQ attachment.

## Brownfield code-mining (optional entry route)

When the milestone scope starts from the existing application's source code
(a change request adding to or reshaping an existing implementation),
consult [`frs-code-extraction-rules.md`](../frs-code-extraction-rules.md)
for the signal-to-FRS mapping, `[inferred from code]` tagging discipline,
and the `Module.Area.Name` logical source-name convention that lands in
canonical node `source_ref` frontmatter. The rule book is optional
for new-feature milestones with no existing code.

## Prototype-seeding (optional entry route)

When the milestone scope starts from a UI prototype rather than source code
or written brief (stakeholders react to clickable screens before written
specs exist) — or when a brief already exists and a prototype is built to
validate it — consult
[`frs-prototype-extraction-rules.md`](../frs-prototype-extraction-rules.md)
for the screen-to-FRS signal mapping, `[inferred from prototype]`
tagging discipline, and the `Module.Area.Screen` stable identifier
convention that lands in canonical node `source_ref` frontmatter.
The prototype artifact itself lives at
`docs/prototypes/<slug>/PROTO-<slug>.md` as a dedicated **Prototype
disposition** (`PROTO-<slug>`) and is cited from the milestone SURVEY
via `prototype_ref:` — see
[`../../_templates/SURVEY.md`](../../_templates/SURVEY.md). The bidirectional
operation doctrine (both directions — prototype→milestone seeding and
milestone/CR→prototype validation) is
[`prototype-first.md`](../prototype-first.md). The **prototype-sourced**
peer rule book to brownfield code-mining above; route on input medium
(code-sourced is inherently brownfield; prototype-sourced is
posture-independent).
