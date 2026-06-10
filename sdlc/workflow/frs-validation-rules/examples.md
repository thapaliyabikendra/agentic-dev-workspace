---
name: frs-validation-examples
description: "Detail file of frs-validation-rules.md — the full Common-language-traps ❌/✅ pairs and the [inferred from prototype] propagation full text. Load when a language-trap or prototype-tag finding fires and the worked form is needed."
applies_when:
  stack: [agnostic]
---

# FRS validation — worked examples + prototype-propagation detail

> Detail file of [`frs-validation-rules.md`](../frs-validation-rules.md).
> Load when a finding fires and you need the worked ❌/✅ form, or when the
> FRS is prototype-sourced.

## Common language traps — full ❌/✅ pairs

**❌ "The system shall store the user record in a PostgreSQL table"** —
describes implementation.
**✅ "The system shall retain the registered user's details so they are
available for future interactions."**

**❌ "The API will return a 404 if the user is not found"** — technical
surface.
**✅ "If the requested record does not exist, the operation ends and the
actor is informed that no matching record was found."**

**❌ "Use Redis to cache session state for 30 minutes"** — technical NFR.
**✅ Reference the Session Management CCC (e.g., `CCC-011`) in the FRS's
`ccc:` frontmatter; state only the operation-specific deviation if any
(via an ADR back-linked with `related: [CCC-011]`).**

**❌ "The administrator uses drag-and-drop to set a complete new section
order"** — interaction mechanism (will rot with future UI changes).
**✅ "The administrator sets a complete new section ordering. The system
applies the new order to all subsequent verification sessions."**

**❌ "Double-click an item to edit it"** — interaction mechanism.
**✅ "The actor selects an item to edit it; the system presents the item
in editable form."**

**❌ "Updated content takes effect when the form is submitted. No content
length limits are enforced."** — non-rule (asserts the *absence* of a
constraint, not a constraint).
**✅ "Updated content takes effect for new customer applications only
after the save completes; in-flight customer applications continue with
the content version they originally loaded."** — a real policy rule a
stakeholder can sign off on.

**❌ FRS adds AC-03 "actor sees retry option when upstream returns 503"
but Phase-1-born CHG-007's `modifies[]` on FLW-001 says only "FLW-001
gains a fault path"** — the CHG body doesn't describe the AC's behavior
extension; reader can't audit the CHG-FRS alignment.
**✅ Either revise the CHG `modifies[]` entry to "FLW-001 gains a fault
path when the upstream service responds 503; the actor sees a retry
option" — matching the AC's specificity — or revise the FRS AC if the
CHG's vagueness is intentional.** Flag as `Major: chg-sanity — FRS adds
fault path in AC-03 but CHG-007's modifies[] does not describe FLW-001's
fault-path extension.` Resolution path: revise inline (FRS or CHG body,
1-file touch carve-out per R-NEW-7 extension) or raise an OQ with
`gate_effect: blocking` if the divergence is intentional.

## `[inferred from prototype]` propagation — full text

When a FRS is derived even partly from a UI prototype (the
prototype-sourced path — see
[`frs-prototype-extraction-rules.md`](../frs-prototype-extraction-rules.md)),
every business-level item that came from the prototype alone carries
the tag `[inferred from prototype — confirm with stakeholder]` until
corroborated by stakeholder prose, meeting notes, or explicit
stakeholder confirmation. The tag is the **peer** of `[inferred from
code]` — same discipline, different input medium. A prototype is a
strong signal of intended behavior but not a substitute for
stakeholder confirmation; the rule book in
[`frs-prototype-extraction-rules.md → Anti-Pattern: "The
Prototype-First FRS"`](../frs-prototype-extraction-rules.md#anti-pattern-the-prototype-first-frs)
explains the trap.

The same sections that carry `[inferred from code]` also carry
`[inferred from prototype]`:

- **Actors** — when an actor's existence comes from a role-gated
  screen or conditional UI in the prototype.
- **Preconditions** — when the precondition comes from a disabled
  control, role-gated screen, or branching navigation.
- **Business rules** — when a `BR-NN` policy claim comes from a
  validation hint, error state UI, modal confirmation copy, or
  inline constraint indicator.
- **Edge cases** — when an `EC-NN` summary comes from an empty
  state, error state, or branching UI surface. (Fault-path behavior
  lives in the Phase-1-born FLW's `#fault` Scenario, outside the
  FRS; the `[inferred from prototype]` tag is FRS-scoped.)
- **Acceptance criteria** — when the criterion's testable shape
  comes from a prototype interaction sequence rather than
  stakeholder language.

**The tagging rule is unconditional.** If an item in those sections
came from the prototype, it carries the tag, full stop. Do not omit
the tag because the prototype "is the stakeholder-approved artifact"
or because the draft "reads well as-is" — stakeholder approval of a
*prototype shape* is not stakeholder approval of every *business
rule* inferable from that shape. The resolution path is a Phase 1.5
Open Question; that is the only path to strip the tag.

The tag is stripped only after the corresponding Open Question is
resolved:

- **Confirm** → strip tag, retain item.
- **Revise** → strip tag, rewrite item.
- **Defer** → keep the tag in the FRS body; raise an `OQ-NNN` under
  `docs/discovery/open-questions/` with
  `origin: frs-authoring, origin_ref: FRS-NNN, gate_effect: blocking`
  (or `post-approval` if explicitly downgraded).

**Late-discovered tags.** When Phase 1 drafting surfaces a
prototype-inferred item that wasn't visible at the discovery stage
(e.g., a disabled-without-explanation control noticed only on a
second pass through the prototype), halt drafting for that FRS, run
a clarification pass (default `gate_effect: blocking` on the raised
OQ; the user may downgrade to `post-approval`), then resume.

**Mixed sources (prototype + code).** When an FRS is derived from
**both** a prototype and existing application source code (brownfield
project that started a redesign with a prototype before reshaping the
code), each tag applies to its own source: items derived from code
carry `[inferred from code]`, items derived from the prototype carry
`[inferred from prototype]`, and items derived from **both** carry
both tags (`[inferred from code, prototype — confirm with
stakeholder]`). The OQ-resolution paths are identical; the dual tag
just documents which input(s) the inference traces to.

| Violation | Severity |
|---|---|
| `[inferred from prototype]` item present in an approved FRS with no corresponding OQ | Major |
| `[inferred from prototype]` item stripped without confirmation in any OQ | Major |
