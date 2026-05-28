---
applies_when:
  stack: [agnostic]
---

# FRS Prototype Extraction Rules

> **Type:** Workflow reference. Consulted at Phase 0 / Phase 1 when the
> milestone scope starts from a UI prototype (the greenfield-prototyping
> path). See [`design.md`](design.md) for phase mechanics; this file is
> the rule book it consults. Codifies the screen-to-FRS signal mapping,
> stable screen-identifier convention, prototype → business translation
> discipline, one-hop navigation traversal, and the `[inferred from
> prototype]` tagging rule that the Phase 1.5 validation gate enforces
> downstream.

## When to Use

**Use when:** the milestone scope explicitly cites a UI prototype as
input (greenfield path — stakeholders react to clickable screens before
written specs exist), an FRS candidate is being seeded from prototype
screens rather than from prose, or a mixed-source extraction
encounters a conflict between prose and prototype that needs a tagging
decision.

**Do NOT use when:** the FRS source is prose-only (skip the signal
table; the `[inferred from prototype]` tag does not apply), the FRS is
being extracted from existing application source code (route to
[`frs-code-extraction-rules.md`](frs-code-extraction-rules.md) — code
is the brownfield-path peer to this file), the artifact is already
past Phase 1 (the gate at Phase 1.5 enforces the tag — see
[`frs-validation-rules.md`](frs-validation-rules.md)), or the
extraction is happening at Phase 2 or later (Phase 2 ingests
pre-tagged FRS rows; it does not re-derive them from the prototype).

**Vs. sibling files:**
[`frs-code-extraction-rules.md`](frs-code-extraction-rules.md) is the
brownfield-path peer — code-as-existing-artifact vs.
prototype-as-existing-artifact. Same signal-to-FRS mapping shape; same
`[inferred from …]` tagging discipline; different input medium.
[`frs-validation-rules.md`](frs-validation-rules.md) classifies a
tagged item's severity at the Phase 1.5 gate; this file governs how
the tag gets attached in the first place.

How to mine a UI prototype for FRS candidates without leaking
interaction-mechanism detail (drag-and-drop, double-click, modal
geometry) into the FRS itself.

> **Tool-neutral signal table.** The signal categories below apply to
> any UI prototyping tool — wireframe, hi-fi mock, clickable
> prototype, or design-system frame. Parenthetical examples
> illustrate common UI patterns; adapt to whichever artifact format
> the milestone scoping phase consumes.

The principle: **the prototype reveals shape, prose reveals intent.**
Extract structure aggressively (which screens exist, which form fields
they carry, which state transitions they imply), but flag every
business rule, edge path, fault path, actor, or precondition you infer
from the prototype alone with
`[inferred from prototype — confirm with stakeholder]`. The Phase 1.5
validation gate enforces the tag — see
[`frs-validation-rules.md → [inferred from prototype] propagation`](frs-validation-rules.md#inferred-from-prototype-propagation-greenfield).

## Prototype artifact disposition

The prototype itself lives at `docs/exploration/EXP-<slug>.md` as an
**Exploration disposition** — Phase 0 input, not a canonical node and
not a Survey. Frontmatter shape per
[`../_templates/EXPLORATION.md`](../_templates/EXPLORATION.md):
`id: EXP-<slug>`, `tag: prototype` (not `kind:` — Exploration has no
`kind:` field), `status: draft` during Phase 0 authoring + stakeholder
iteration, flips to `adopted` when the consuming FRS reaches
`approved` at Phase 1.5 exit (Exploration `adopted_into:` cites the
FRS ID). The Exploration body cites the external tool URL or
local file path of the prototype artifact; the workflow does not
manage the artifact format itself, only the disposition slot.

The `docs/exploration/` directory is **lazy-created** on first
Exploration file (the prototype Exploration is just one of the
file kinds that may seed it — same posture as other lazy KB paths
in [`../../CLAUDE.md → Project KB`](../../CLAUDE.md#project-kb)).
The milestone SURVEY cites the prototype via:

- `prototype_ref: [EXP-<slug>]` — the typed slot for prototype
  artifacts (see [`../_templates/SURVEY.md`](../_templates/SURVEY.md)).
- `validated_by: [EXP-<slug>]` — optional; the same Exploration ID
  also fits the generic "this survey was validated by …" slot. Use
  `prototype_ref:` when the input medium is specifically a prototype;
  `validated_by:` is broader (covers e.g., user-research notes).

---

## Signal-to-FRS mapping

For each prototype, walk these signals top-to-bottom. A single
prototype may produce multiple FRS candidates (multiple user-journeys
— one per primary user-flow). Target columns refer to the project's
FRS template ([`../_templates/FRS.md`](../_templates/FRS.md)) and the
canonical DDD wiki at [`../nodes/`](../nodes/). Birth phases are
type-keyed: FLW is born at Phase 1 alongside its FRS (per R-NEW-1);
ACT-NNN is a Phase-1 forward-reference ID claim in the FRS
frontmatter (the ACT file is authored at Phase 2 per R-NEW-2a
retirement 2026-05-17); ENT, CMD, STA, CON, INT, DEC, PERM, QRY are
born at Phase 2; Phase 3 flips all proposed-state nodes to `active`.

| Signal in prototype | Lands in |
|---|---|
| Screen / page representing a primary user-flow (a single observable behavior the actor can complete end-to-end) | One FRS candidate (one user-journey). The Phase-1-born FLW carries the Trigger + Scenarios; the FRS body carries Use case + ACs + BRs + Brownfield impact (when applicable). |
| Form fields on a screen (input, dropdown, date-picker, file-upload, etc.) | Form fields go into a canonical Entity (ENT) node (existing, or Phase-2-born with `status: proposed` per the FRS's `produces_nodes:`), not into the FRS body directly. The FRS references the ENT ID inline. Field labels are already in business language — translation is trivial vs. code. |
| Submit button / primary CTA on a screen | Candidate operation. FRS Use case Trigger + FLW Trigger + Phase-1-born FLW's happy-path Scenario. |
| Secondary CTA / non-form action (e.g., "Cancel", "Save draft", "Resend") | Candidate operation when the action has a distinct postcondition (usually a separate FLW). If the action only changes UI state with no business effect, drop it — not an FRS-level concern. |
| Error state UI (inline error block, error screen, "something went wrong" surface) | Fault paths on the Phase-1-born FLW's `#fault` Scenario; tagged `[inferred from prototype]`. The error UI copy translates into a business-language fault outcome. |
| Empty state UI ("no items yet", "no results", "your inbox is empty") | Edge paths on the Phase-1-born FLW's `#edge` Scenario; tagged `[inferred from prototype]`. The empty-state copy hints at the precondition that triggers the branch. |
| Loading / pending / submitting / progress state | Trigger → postcondition path hint. Lands on the Phase-1-born FLW's Scenarios (business language) and gets enriched at Phase 2 with Sequence wiring. The pending state itself does not produce an FRS row — it's a UX cue for the journey shape. |
| Modal / confirmation dialog (e.g., "Are you sure you want to delete?") | If the modal carries a business rule (irreversible action, side effect warning), promote to a Business rule on the FRS — tagged `[inferred from prototype]`. If the modal carries a node-local rationale (e.g., the operation requires actor re-authentication), promote to a `DEC-inline-N` on the resulting CMD or FLW at Phase 2 (claim in `produces_nodes:` if a standalone DEC is warranted). |
| Role-gated screen (admin-only area, "you don't have access" screen, conditional UI based on role indicator in the prototype) | Actors + Preconditions in the FRS, with the actor ID resolving to an ACT-NNN — either an existing canonical ACT (cited by ID) or the new ACT this FRS introduces via `produced_actor:` (Phase-1 forward-reference ID claim; the ACT file births at Phase 2). Tagged `[inferred from prototype]`. |
| Navigation between screens (an arrow / hyperlink / "next" button that transitions to another screen, including back-navigation patterns) | FLW Sequence enrichment hint (Phase-2). The navigation order itself is not authored at Phase 1 — Sequence is a Phase-2 section; record the navigation as a Brownfield-impact note for Phase 2 ingest to consume. Cross-screen navigations that cross user-journey boundaries are a hint that two FRSs need splitting. |
| Toast / notification UI / banner ("Saved successfully", "Email sent") | The FRS Notifications table carries the recipient / trigger / channel / reason policy; the Phase-1-born FLW's Scenarios reference the actor outcome ("the actor is informed of the outcome"). A non-`In-app` channel (Email / SMS / Push / Webhook) shown on the prototype implies an `INT-NNN` boundary — declare it per [`frs-validation-rules.md → Rule: external-boundary-undeclared`](frs-validation-rules.md#rule-external-boundary-undeclared). |
| Validation hint inline next to a form field ("must be a valid email", "at least 8 characters", "max 50 chars") | Business rules in the FRS Business rules section or constraints on the canonical ENT (Phase-2-born), tagged `[inferred from prototype]`. |
| Filter / sort / search affordance on a list screen | Candidate QRY node (Phase-2-born) — read-side operation. Claim in `produces_nodes:` as `QRY-NNN`. Tagged `[inferred from prototype]`. |
| Disabled / greyed-out state on a control with no explanatory text | Precondition hint — tagged `[inferred from prototype]` and raised as an `OQ-NNN` (the prototype shows the constraint exists; only stakeholder confirmation reveals the policy). Disabled-without-explanation is a high-value OQ surface. |

**Output of extraction per candidate:** Use case title; source
location (Exploration ID + screen identifier — see below);
pre-populated FLW Scenarios (happy / edge / fault, business language,
each tagged `[inferred from prototype]`); inferred actor list
resolving to ACT-NNN (existing canonical or new via
`produced_actor:`); pre-populated `touches_nodes:` declaration when
existing canonical nodes match the domain (rare on a greenfield
prototype-seeded milestone; check
`docs/<component>/nodes/*/index.md` regardless); pre-populated
`produced_flw:` scalar (the FLW this FRS births at Phase 1 — real,
not claim) and `produced_actor:` scalar (when introducing a new
actor); pre-populated `produces_nodes:` **claim** for Phase-2-born
nodes the candidate will introduce (ENT / CMD / STA / CON / INT /
DEC / PERM / QRY only — claim language stays here because these IDs
are not yet allocated). **Tag every inferred business-level item
that came from the prototype — no exceptions.**

## Anti-Pattern: "The Prototype-First FRS"

Walking a prototype aggressively, producing a polished FRS draft from
it (Use case + Actors + Business rules + AC all populated), and then
**stripping or omitting the `[inferred from prototype — confirm with
stakeholder]` tag** on the populated items because the prototype "is
the stakeholder-approved artifact" or the draft "reads well as-is".
The cost: the Phase 1.5 gate has no signal to fire on (no tag → no
`OQ` trigger), the FRS enters Phase 2 with prototype-inferred
business rules masquerading as stakeholder-confirmed ones, and the
greenfield discovery loop (prototype → review → revise) is
short-circuited at extraction time. A prototype is a strong signal
of intended behavior but not a substitute for stakeholder
confirmation of business rules, edge handling, or precondition
policy. **Tagging is unconditional; if it came from the prototype
alone, the tag goes on, full stop.** The tag is stripped only after
the corresponding OQ resolves to Confirm or Revise — never at
extraction. Doctrinal anchor:
[`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
every artifact has an ID and links upstream + downstream; un-tagged
prototype-inferred items break the upstream link to stakeholder
intent.

---

## Stable screen identifiers

In addition to citing the Exploration ID, emit a **stable screen
identifier** for each prototype source — a refactor-resilient
identifier composed as `<Module>.<Area>.<Screen>`:

- `Onboarding.Checklist.Verify`
- `Admin.Settings.UpdateProfile`
- `Billing.Invoice.View`

The stable identifier is independent of the prototype tool's internal
screen ID, URL, or frame name — renaming, reorganizing, or migrating
the prototype between tools does not break traceability. Both the
Exploration ID and the stable identifier go into the canonical
node's `source_ref` frontmatter (the node is canonical from Phase 2
ingest onward):

```yaml
source_ref:
  - exploration: EXP-onboarding-prototype
    screen: Onboarding.Checklist.Verify
  - exploration: EXP-onboarding-prototype
    screen: Onboarding.Checklist.Submit
```

**How to derive a stable identifier:**

- `<Module>` — the user-flow module the screen participates in
  (typically the top-level navigation section or domain area:
  `Onboarding`, `Admin`, `Billing`).
- `<Area>` — functional grouping within the module (typically the
  intermediate navigation level or the screen's purpose category:
  `Checklist`, `Settings`, `Invoice`).
- `<Screen>` — the operation, list, or page name (verb-noun for
  action screens, noun-only for list / detail screens).

When the prototype's navigation hierarchy doesn't cleanly yield the
three components, use a best-effort PascalCase composition and
surface the choice in the FRS's Brownfield impact section so a
reviewer can sanity-check.

---

## Translation discipline (prototype → business language)

Field labels and screen copy are already a half-step closer to
business language than source code — but interaction-mechanism
detail still leaks easily. Strip it at extraction:

| Prototype surface | Drop in extraction output |
|---|---|
| Screen / frame names (`UserRegistrationPage`, `LoginScreen`, `AdminPanel`) | Operation name: "User Registration", "Login", "Admin Configuration" |
| Field labels (already business language: "First Name", "Date of Birth") | Keep as-is — no translation needed |
| UI element types (`<input type="text">`, `<select>`, `<button>`) | Drop element type; the FRS-level form is "free text", "single choice", "primary action" — or omit |
| Validation hints next to fields (`"must be a valid email"`, `"max 50 chars"`) | Promote to a Business rule or ENT constraint; tag `[inferred from prototype]` |
| Interaction-mechanism copy (`"Click here"`, `"Tap to continue"`, `"Drag to reorder"`, `"Double-click to edit"`) | Describe the outcome, not the gesture: "the actor proceeds", "the actor selects an item to edit". Interaction-mechanism leak fails the [`frs-validation-rules.md → Common language traps`](frs-validation-rules.md#common-language-traps) rule. |
| Modal / dialog UI copy (`"Are you sure?"`, `"This action cannot be undone"`) | Promote the constraint behind the modal to a Business rule (e.g., "the operation is irreversible") — tag `[inferred from prototype]`. The modal itself is interaction mechanism. |
| Error UI copy ("Something went wrong", "Invalid credentials", "Page not found") | Recast in business-language fault outcomes: "the operation is rejected with the corresponding rejection outcome", "the actor is informed that no matching record was found" |
| Toast / banner copy ("Saved successfully", "Email sent") | The FRS Notifications table row carries the policy; the toast wording itself does not land in the FRS body |
| Color / icon / spacing / layout cues (a red border, a warning triangle, a checkmark icon) | Drop — visual encoding of state is presentation-layer; the underlying state value lands on ENT / STA, not in the FRS body |
| Tool-internal IDs / component names (`Frame_3`, `Component/Button`, design-system slugs) | Drop entirely — these are the prototype tool's bookkeeping, not the operation's semantics |
| URL / route strings shown in the prototype (`/users/{id}/profile`) | Drop from FRS body. If the URL becomes a wire surface at Phase 2, it lands on a `CON-NNN` node — see [`frs-validation-rules.md → Rule: protocol-surface-leak`](frs-validation-rules.md#rule-protocol-surface-leak) |

If you cannot translate a piece of prototype surface into business
language (e.g., the screen shows a control whose purpose is genuinely
ambiguous), leave the question in the candidate's per-FRS discovery
and raise an `OQ-NNN`.

---

## One-hop navigation traversal

When a screen's primary CTA or navigation control transitions to
another screen **within the same prototype**, read the destination
screen and apply the signal table to it as well.

- **Cap depth at 1.** Do not recurse into screens reached from the
  destination screen — only the immediate one-hop.
- **Skip external links** (anything that navigates outside the
  prototype tool — links to live systems, third-party docs,
  marketing pages). The external destination is not part of the
  milestone's authored surface.
- **Skip visual-only transitions** when they're trivially the same
  screen in a different state (e.g., a hover state, a focus state, a
  tooltip surface). Read them only if they reveal a new business
  rule or precondition.

Every traversed screen contributes to the canonical node's
`source_ref` (each with the Exploration ID and stable screen
identifier). When a one-hop traversal crosses a user-journey boundary
(the destination screen clearly belongs to a different FRS), record
the boundary in the FRS's Brownfield impact section — it's a hint
that two FRSs need coordinating at Phase 2 (the second FRS will
carry the destination screen as its source).

---

## Mixed-source reconciliation

When both prototype and prose are provided (the typical case — a
prototype plus stakeholder narrative / meeting notes / scoping brief):

- **Prototype → structure**: screen inventory, form fields, fault /
  edge UI surfaces, actor inference from role-gating, navigation
  shape.
- **Prose → intent**: Use case, why-it-matters, policy rules that
  drive business behavior, actors named explicitly by stakeholder,
  edge cases the prototype skipped.
- **Conflicts** (e.g., prose says "only managers can submit" but
  the prototype shows the submit screen to all users, or the
  prototype has an error state for a condition prose never
  mentions): raise an `OQ-NNN` under
  `docs/discovery/open-questions/` with `origin: frs-authoring,
  origin_ref: FRS-NNN` (cited from the per-FRS discovery); **do
  NOT silently choose one source.** Both are stakeholder-adjacent
  artifacts — neither wins by default.

Prose-only or prototype-only inputs each have their own gaps. Mixed
sources usually produce the strongest FRS — but only when conflicts
are surfaced rather than smoothed over.

---

## Prototype-only caveat

When the prototype is the sole source (no stakeholder prose, no
meeting notes, no scoping brief beyond "build this"), be
**aggressive about surfacing open questions.** A prototype reveals
shape (what screens exist, what fields they take, what error states
are drawn) but rarely intent (why this gate exists, what policy
drives the precondition, what the stakeholder expects on the edge
paths the prototype only hints at).

Every business-level item inferred from the prototype alone is
tagged `[inferred from prototype — confirm with stakeholder]` and
raised as an `OQ-NNN` under `docs/discovery/open-questions/` with
`origin: frs-authoring, origin_ref: FRS-NNN`. The tag is stripped
only after stakeholder confirmation — see
[`frs-validation-rules.md → [inferred from prototype] propagation`](frs-validation-rules.md#inferred-from-prototype-propagation-greenfield).

High-value OQ surfaces specific to prototype-only inputs:

- **Disabled-without-explanation controls** — a greyed-out CTA with
  no inline reason is a hidden precondition.
- **Skipped edge paths** — the prototype shows the happy path and
  one fault path; what about empty state, partial input, concurrent
  edit, session timeout?
- **Role implications** — a screen reachable in the prototype with
  no role indicator may or may not be role-gated in the real
  operation.
- **Notification rules** — the prototype draws the toast but rarely
  the recipient policy (just the actor? actor + supervisor? audit
  log?).
- **Data-shape implications** — a multi-select dropdown with 5
  options in the prototype is silent on whether the list is fixed
  or admin-configurable.

---

## Revision history

| Version | Date | Source |
|---------|------|--------|
| 1.0 | 2026-05-28 | New file. Authored as the greenfield-prototyping peer to [`frs-code-extraction-rules.md`](frs-code-extraction-rules.md), addressing the gap in [`../BOUNDARY.md § Toolchain assumptions`](../BOUNDARY.md#toolchain-assumptions) (the `<your UI prototyping tool>` placeholder was the only mention of prototyping in the framework). Mirrors code-extraction's structure exactly — signal-to-FRS mapping, stable identifier convention, translation discipline, one-hop traversal, mixed-source reconciliation, prototype-only caveat — adapted to UI prototype signals. Prototype artifact disposition lands at `docs/exploration/<slug>/` (Exploration disposition, `tag: prototype`); SURVEY's `prototype_ref:` is the typed slot for citation. Tool-agnostic throughout (signals described as "screen" / "form field" / "modal" rather than naming any specific design tool). |

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Existing nodes are authoritative" and "Reference, never copy"
  govern the `touches_nodes` / `produces_nodes` claims this file
  pre-populates.
- **Required before:** [`../WORKFLOW.md → Legacy absorption`](../WORKFLOW.md#legacy-absorption)
  — "Surface conflicts, never absorb" is the doctrinal anchor of the
  mixed-source reconciliation rule, applied at extraction time
  rather than at absorption time.
- **Caller:** [`design.md → Phase 0`](design.md#phase-0--milestone-scoping)
  (Brownfield code-mining sub-block has a peer prototype-seeding
  sub-block) and [`design.md → Phase 1`](design.md#phase-1--frs-authoring)
  — fires this rule book when an FRS candidate is being derived
  from a prototype.
- **Adjacent (not callers but consulted):**
  [`frs-validation-rules.md`](frs-validation-rules.md) — enforces
  the `[inferred from prototype]` tag at the Phase 1.5 gate;
  [`frs-code-extraction-rules.md`](frs-code-extraction-rules.md) —
  the brownfield-path peer when the milestone scope cites existing
  application source code instead of (or alongside) a prototype.
- **Routes findings to:** OQ-NNN files under
  [`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/)
  with `origin: frs-authoring` when stakeholder confirmation is
  owed for a prototype-inferred item.
- **Sibling rule books:**
  [`frs-code-extraction-rules.md`](frs-code-extraction-rules.md),
  [`frs-validation-rules.md`](frs-validation-rules.md),
  [`coverage-matrix.md`](coverage-matrix.md),
  [`test-data-generation.md`](test-data-generation.md),
  [`lint.md`](lint.md).
