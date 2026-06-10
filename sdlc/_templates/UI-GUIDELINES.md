---
name: ui-guidelines
description: "Engine-prescribed design-system skeleton: semantic token catalog, semantic-over-literal rule with co-located detection, role-differentiated sign-off, self-distributing reference incantation. Copy to the ui repo (e.g. ui/UI_GUIDELINES.md) at bootstrap; the project copy is the runtime canonical."
---

# UI Guidelines — engine-prescribed skeleton

> **Template.** Copy to the ui repo at bootstrap (e.g.
> `ui/UI_GUIDELINES.md`), then fill the token catalog from the project's
> design system. At runtime the **project copy wins**; reconcile a
> divergence back into this template only when it proves cross-project
> useful. Consumed by
> [`../workflow/prototype-generation.md`](../workflow/prototype-generation.md)
> (generation passes follow it) and
> [`../workflow/prototype-eval-rubric.md`](../workflow/prototype-eval-rubric.md)
> (dimension 5 scores against it).
>
> **Reference in all generation prompts with:** *"Follow the conventions
> defined in UI_GUIDELINES.md."* — this one line is the document's
> integration mechanism; it makes the spec self-distributing to every
> generation session without restating its content.

## The one rule

> **Semantic over literal.** Components consume named semantic tokens
> (color, spacing, typography, elevation) — never hard-coded literal
> values.

**Detection (co-located so enforcement is scriptable):** search
component sources for literal-value signatures — hex codes (`#`),
`rgb(`/`rgba(`, `hsl(`, raw pixel values where a spacing token exists.
A hit is a finding unless the project copy documents the exception
inline. The rule and its check live together — a rule whose detection
method is unstated decays into opinion.

## Token catalog

_One section per token class. Each section is a decision table: token
name → semantic meaning → usage rule. Fill from the project design
system; keep names semantic (`surface-warning`), not literal
(`yellow-200`)._

### §01 Color
### §02 Typography
### §03 Spacing & layout
### §04 Elevation & borders
### §05 Iconography
### §06 Interaction states
### §07 Data display (tables, lists, empty states)
### §08 Forms & validation
### §09 Feedback (toasts, dialogs, banners)
### §10 Motion
### §11 Accessibility baselines

## Audience-boundary rule

Data classified for one audience must never render on another
audience's surface (e.g. internal references, internal stages, internal
notes on an external-facing screen). This is a **data-classification
boundary, not a styling preference** — violations are CRITICAL findings
per [`../workflow/prototype-eval-rubric.md § Severity tiers`](../workflow/prototype-eval-rubric.md#severity-tiers).
The project copy names the concrete classified field classes.

## Sign-off checklist

_Role-differentiated: each checklist row links its section anchor and
names its owner role. Foundation tokens are verified by every reviewing
role; governance and pattern rules are owned by the named owner. Adapt
roles to the project._

| Item | Section | Owner role | Reviewer role(s) | ✓ |
|------|---------|-----------|------------------|---|
| Color tokens applied | §01 | _owner_ | _all_ | |
| Audience boundary clean | above | _owner_ | _all_ | |

## Bootstrap checklist

- [ ] Copy this file into the ui repo; fill §01–§11 from the design
      system.
- [ ] Name the concrete audience-boundary field classes.
- [ ] Wire the literal-value detection into the repo's lint/verify
      script.
- [ ] Add the reference incantation to the generation-prompt template.
