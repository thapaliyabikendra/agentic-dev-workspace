# FRS Validation Rules

> **Type:** Workflow reference. Consulted at Phase 1.5 (Validation Gate).
> See [`design.md → Phase 1.5`](design.md#phase-15--validation-gate) for
> the gate mechanics; this file is the rule book it consults. Codifies
> severity tiers (Blocker / Major / Minor), bundling detection, the NFR
> rubric, `[inferred from code]` propagation, OQ gate-effect tagging,
> and the audit reproducibility set captured per finding.

> **HARD-GATE:** Severity is **non-negotiable** once the rules below
> classify a finding. Do NOT downgrade a Blocker to a Major (or a Major
> to a Minor) to "let the FRS through" — the verdict ladder (`PASS` /
> `PASS_WITH_MAJORS` / `FAIL`) is keyed off severity, and a silent
> downgrade rewrites the gate outcome. If a Blocker resolution truly is
> out of scope for this milestone, the FAIL stands and the question
> moves to an `OQ-NNN` with `gate_effect: blocking` — the FRS does not
> enter Phase 2 with a Blocker on file. (Cross-cutting rules:
> [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) — "Every
> artifact has an ID and links upstream + downstream";
> [`../PRINCIPLES.md`](../PRINCIPLES.md) — *Don't soften a gate to make
> a phase pass.*)

## When to Use

**Use when:** running the Phase 1.5 validation gate against a freshly
drafted FRS (or a re-validation of one revised since the previous gate
pass), surfacing a candidate finding while drafting and need to
classify its severity, or auditing a previously-approved FRS for
hidden Majors that an earlier gate missed.

**Do NOT use when:** the artifact under review is an FS (use
[`plan.md → FS validation`](plan.md) — different ingest checks), a
discovery surface (OQ / EXP / RESEARCH — those go to the open-question
index directly), or a canonical node ([`maintenance-discipline.md`](maintenance-discipline.md)
governs node-side touch). Also not the place for cross-FRS conflicts —
the cross-FRS sweep mechanics live in
[`design.md → Phase 1.5`](design.md#phase-15--validation-gate).

**Vs. sibling files:** [`frs-code-extraction-rules.md`](frs-code-extraction-rules.md)
governs how code-derived items become FRS rows in the first place
(tagging discipline); this file governs how the gate classifies those
items at validation time. [`design.md`](design.md) is the caller that
fires the gate; this file is the rule book it loads.

The project's Phase 1.5 gate runs three per-FRS checks
(`existence`, `sanity`, `adr-conflict`) plus a cross-FRS sweep. **The
cross-FRS sweep is skipped when the milestone has fewer than 2 FRSs** — a
single-FRS milestone has no cross-FRS conflicts to detect; append "N/A —
single FRS milestone" to `discovery/milestone-scope.md` for audit trail.
This file
expands those checks with **severity classification**, **bundling
detection**, the **NFR rubric**, the **`[inferred from code]` propagation
rule** for brownfield code-mining, the **OQ gate-effect taxonomy** that
links Validation findings to OQ-NNN files under
[`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/),
and the **audit reproducibility set** captured per finding.

The rules apply on top of the project's FRS template
([`../_templates/FRS.md`](../_templates/FRS.md)), the canonical DDD wiki,
and the baselines at [`../glossary.md`](../glossary.md) and
[`../cross-cutting-concerns.md`](../cross-cutting-concerns.md).

---

## Severity classification

Every Validation finding is one of:

| Severity | Meaning | Examples |
|---|---|---|
| **Blocker** | Hard rule violated; FRS cannot enter Phase 2. | Missing FRS section; technical detail in Behavior; bundled operations (two user-journeys in one FRS); AC that cannot be expressed as a test runner assertion; missing or dangling `touches_nodes` / `produces_nodes` / `adrs:` declarations that clearly apply; FRS-ID collision; FRS contradicts an `accepted` ADR without an ADR-supersession path. |
| **Major** | Domain / NFR / traceability problem; FRS is usable but must be revised before Phase 2 kickoff. | Cross-module actor in scope; NFR stated in engineer language; FRS restates baseline content instead of citing it (`baseline-not-cited`); `[inferred from code]` item present with no Open Question; glossary term used but not in `glossary.md`; deviation from a baseline category with no ADR back-link. |
| **Minor** | Style / clarity issue; does not invalidate the FRS. | Ambiguous phrasing; inconsistent terminology; AC restating a Behavior step verbatim; OQ missing a tag; non-rule trap ("no limit applies" — describes absence of a constraint rather than a constraint). |

**Gate verdicts:**

- **PASS** — zero Blockers AND zero Majors. Minors only (or clean).
- **PASS_WITH_MAJORS** — zero Blockers, ≥1 Major. FRS exits Phase 1.5 but
  must be revised before Phase 2 kickoff.
- **FAIL** — ≥1 Blocker. FRS cannot proceed to Phase 2.

## Anti-Pattern: "The Charitable Gate"

Reading a Blocker finding, deciding the FRS is "basically fine", and
reclassifying it down — to Major (so the FRS exits Phase 1.5 under
`PASS_WITH_MAJORS`) or to Minor (so it doesn't gate at all). The
temptation: the rules look mechanical, the human author can see the
intent, and a downgrade saves a round-trip. The cost: the FRS enters
Phase 2 carrying an unresolved hard-rule violation; Phase 2 builds on
the broken premise; Phase 3 surfaces the conflict as execution-debt
discovered late. **Severity is what the rules below classify, not what
charity warrants.** If a Blocker resolution truly is out of scope for
this milestone, the FAIL stands and the question moves to an `OQ-NNN`
with `gate_effect: blocking` — never silently rewritten as Major.
Doctrinal anchor: [`../PRINCIPLES.md`](../PRINCIPLES.md) — *Don't
soften a gate to make a phase pass.*

Blockers must be resolved before Phase 2. Majors are resolved or raised
as `OQ-NNN` files under
[`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/)
with `origin: validation-gate` and `gate_effect: blocking | post-approval`
(see [OQ gate-effect taxonomy](#oq-gate-effect-taxonomy) below). Minors
are optional.

Severity is the gate's triage signal — it does not have its own column in
the FRS template's `Validation findings` table. When a finding is
non-trivial, prefix the Rationale text with the severity:
`"Blocker: missing touches_nodes for ENT-001 that this FRS clearly extends."`

---

## Bundling detection

A FRS describes exactly **one** user-journey / business operation. A
bundled FRS — two operations stuffed into one spec — is a Blocker, because
a stakeholder cannot coherently approve or reject the whole as a unit.

Detect bundling by any of these signals in the FRS Behavior section:

- **Multiple distinct user actions with different state transitions.**
  Example: "verify each item" → entries persisted, *and* "submit
  checklist" → checklist locked. Those are two operations.
- **Two operations with different actors.** Different actor = different
  operation. (One maker action and one checker action — preparer and
  approver — belong in two FRSs.)
- **Two operations with different triggers.** A scheduled event and a
  user-submitted request initiating the "same" flow is two flows.
- **Postconditions that read as two unrelated end-states.** "The request
  is recorded" *and* "the supervisor is notified and the audit log is
  closed" is two operations.
- **Branched flow that, on closer reading, represents an entirely separate
  operation** rather than a step within one operation.

**Test:** *"Could a stakeholder reasonably approve one of these operations
and reject the other?"* If yes — split the FRS.

A bundling finding is recorded as a Validation finding with
`type: sanity` and the Rationale prefixed `Blocker: bundling — ...`.

---

## NFR rubric

An NFR-shaped statement is valid in an FRS only if it (a) describes an
**experience or obligation the business owes the user** — not a technical
target — AND (b) is not already covered by
[`../cross-cutting-concerns.md`](../cross-cutting-concerns.md).

| ✅ Business language and operation-specific | ❌ Technical in disguise, or restates the baseline |
|---|---|
| "Effective Date precision: revisions apply at one calendar day granularity in the operating timezone." | "API must respond in <200ms under 1000 RPS." |
| "The actor's request must not be lost if they navigate away mid-submission." | "Use Redis-backed session persistence." |
| "Revisions in this operation are retained for 10 years per regulation X" (extends baseline retention — file as ADR) | "All operations complete within 5 seconds" (baseline default — duplicates) |
| "This operation must remain available outside the platform's standard service window because regulators may submit out-of-hours." | "99.95% uptime SLA, measured per calendar month" (baseline default) |

**Rule of thumb:** an NFR claim belongs in an FRS only if a non-technical
stakeholder could meaningfully sign off on it AND the baseline doesn't
already say it. If the claim reads like an engineer ticket or restates a
baseline category, it does not belong in the FRS — it belongs either in
the baseline (via Op 1 / Op 2 in
[`baseline-references.md`](baseline-references.md))
or in an ADR (if it is operation-specific and deviates from the baseline).

A baseline-restating NFR is a Major finding with Rationale prefixed
`Major: baseline-not-cited — ...`.

---

## Common language traps

**❌ "The system shall store the user record in a PostgreSQL table"** —
describes implementation.
**✅ "The system shall retain the registered user's details so they are
available for future interactions."**

**❌ "The API will return a 404 if the user is not found"** — technical
surface.
**✅ "If the requested record does not exist, the operation ends and the
actor is informed that no matching record was found."**

**❌ "Use Redis to cache session state for 30 minutes"** — technical NFR.
**✅ Reference the Session Management category in
`cross-cutting-concerns.md`; state only the operation-specific deviation
if any.**

**❌ "The administrator uses drag-and-drop to set a complete new section
order"** — interaction mechanism (will rot with future UI changes).
**✅ "The administrator sets a complete new section ordering. The system
applies the new order to all subsequent verification sessions."**

**❌ "Double-click an item to edit it"** — interaction mechanism.
**✅ "The actor selects an item to edit it; the system presents the item
in editable form."**

**Rule of thumb for interaction mechanisms.** If a business stakeholder
reading the FRS five years from now (when drag-and-drop may have been
replaced by touch, voice, or some new modality) would see the description
and think "we shipped that wrong, the new UI doesn't drag-and-drop", the
FRS is over-specifying. Describe the *outcome the actor achieves*, not
the *gesture they perform*.

**❌ "Updated content takes effect when the form is submitted. No content
length limits are enforced."** — non-rule (asserts the *absence* of a
constraint, not a constraint).
**✅ "Updated content takes effect for new customer applications only
after the save completes; in-flight customer applications continue with
the content version they originally loaded."** — a real policy rule a
stakeholder can sign off on.

**Rule of thumb for non-rules.** A rule must constrain behaviour. If the
body reads as `not enforced`, `no limit applies`, `no constraint`,
`accepts any value`, or otherwise asserts the *absence* of a rule, flag
as a Minor finding and either rewrite to a positive form or replace with
a different inferred rule that genuinely constrains the operation.

---

## `[inferred from code]` propagation (brownfield)

When a FRS is derived even partly from the existing application's source
code (the brownfield path — see
[`frs-code-extraction-rules.md`](frs-code-extraction-rules.md)), every
business-level item that came from code alone carries the tag
`[inferred from code — confirm with stakeholder]` until corroborated by
prose, meeting notes, or explicit stakeholder confirmation.

Sections that carry the tag:

- **Actors** — when an actor's existence comes from a role / permission
  check in code.
- **Preconditions** — when the precondition comes from a guard clause.
- **Behavior** — when a business rule, edge path, or fault path comes
  from a validator, `try/catch`, `setError`, or branching condition.
- **Acceptance criteria** — when the criterion's testable shape comes
  from a code assertion rather than stakeholder language.

**The tagging rule is unconditional.** If an item in those sections came
from code, it carries the tag, full stop. Do not omit the tag because
prose "might confirm it" — the resolution is a Phase 1.5 Open Question;
that is the only path to strip the tag.

The tag is stripped only after the corresponding Open Question is
resolved:

- **Confirm** → strip tag, retain item.
- **Revise** → strip tag, rewrite item.
- **Defer** → keep the tag in the FRS body; raise an `OQ-NNN` under
  `docs/discovery/open-questions/` with
  `origin: frs-authoring, origin_ref: FRS-NNN, gate_effect: blocking`
  (or `post-approval` if explicitly downgraded).

**Late-discovered tags.** When Phase 1 drafting surfaces a code-inferred
item that wasn't visible at the discovery stage, halt drafting for that
FRS, run a clarification pass (default `gate_effect: blocking` on the
raised OQ; the user may downgrade to `post-approval`), then resume.

| Violation | Severity |
|---|---|
| `[inferred from code]` item present in an approved FRS with no corresponding OQ | Major |
| `[inferred from code]` item stripped without confirmation in any OQ | Major |

---

## OQ gate-effect taxonomy

Unresolved Validation findings (and other ambiguities surfaced during
drafting) become OQ-NNN files under
[`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/)
with `origin: validation-gate` (or `frs-authoring` for drafting-time
finds). Gate-attached OQs carry a `gate_effect:`:

| `gate_effect` | OQ `status` | Gate behavior |
|---|---|---|
| `blocking` | `open` | Must resolve before the FRS can leave Phase 1.5. Cannot enter Phase 2 until cleared. |
| `post-approval` | `open` | May resolve after Phase 1.5 but before Phase 2 kickoff. FRS exits Phase 1.5; question reviewed at Phase 2 entry. |
| — | `deferred` | Out of scope for this FRS; reassigned to a future milestone. FRS exits Phase 1.5. |

Status `deferred` replaces the prior `[deferred]` tag — deferral is a
lifecycle state, not a gate-effect.

| Violation | Severity |
|---|---|
| Validation-gate OQ with `status: open` and no `gate_effect` set | Minor (default to `blocking` if intent unclear; surface for re-tagging). |
| OQ with `status: deferred` and no target milestone or rationale in `needed_by:` | Minor. |

---

## Audit reproducibility set

When a Validation finding fires, the gate also captures (in the FRS's
`Validation findings` Rationale, or in the raised `OQ-NNN`'s body for
deferred findings):

- `glossary_version` — from the Revision History of
  [`../glossary.md`](../glossary.md) at gate entry.
- `baseline_version` — from the Revision History of
  [`../cross-cutting-concerns.md`](../cross-cutting-concerns.md) at gate
  entry.
- `adrs_consulted` — the FRS's `adrs:` frontmatter list at gate entry.
- `commit` — the git SHA at gate entry (optional but recommended).

The reproducibility set makes findings auditable later — a reviewer can
reconstruct which baseline content the finding was generated against,
even after the baselines have evolved. The version stamps are how the
breaking / non-breaking classification on baseline edits stays
meaningful: a finding cited against `baseline_version: 1.0` is
interpretable independently of subsequent edits.

---

## How findings appear in the FRS

The FRS template's `Validation findings` section carries one row per
finding:

| Finding | Type | Resolution | Rationale |

`type` is one of `existence`, `sanity`, `adr-conflict`, or `cross-frs`
per the template. This file expands what `sanity` covers — bundling
(see above), NFR rubric failure, `baseline-not-cited` (FRS restates a
baseline category instead of citing it), and `inferred-from-code` items
present without a corresponding Open Question all land as `type: sanity`.
Severity (Blocker / Major / Minor) and the audit reproducibility set go
in the Rationale prefix.

**`type: existence` scope.** The existence scan (`design.md → Phase 1.5
→ Pass 1`) searches the canonical wiki and matches against every
canonical node regardless of status — `proposed` (an in-flight sibling FS
introduced it, but it has not yet merged), `active`, `superseded`, or
`deprecated`. A match against a `proposed` node is still a finding; the
`rationale:` carries the in-flight flavor ("matches proposed ENT-005
introduced by FS-A — confirm distinctness or coordinate"). Severity is
the same Blocker/Major/Minor triage as for matches against `active`
nodes; the in-flight context affects the resolution path (coordinate
with sibling FS), not the severity.

Example Rationale:
`"Major: baseline-not-cited — Behavior restates retention default in para 3 (baseline_version: 1.0). Replace with category-5 forward reference."`

When `resolution: deferred`, a matching `OQ-NNN` file exists under
[`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/)
with `origin: validation-gate`, `origin_ref: FRS-NNN`, the appropriate
`gate_effect:`, and a back-link to this FRS in `nodes:` / body.

---

## Revision history

| Version | Date | Source |
|---------|------|--------|
| 1.0 | 2026-05-11 | Absorbed from the shared FRS validation rules reference (v3.1) during workflow absorption, distilled to the project's FRS template and Phase 1.5 gate. Issue-tracker label automation, harness orchestrator dispatch, the 14-item Self-Review mnemonic legend, and per-section schema enforcement (Section-N references) were dropped — the project is filesystem-based with a different FRS template shape. Severity, bundling detection, NFR rubric, `[inferred from code]` propagation, OQ tag taxonomy, and audit reproducibility set retained. |

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Every artifact has an ID and links upstream + downstream"; the
  audit reproducibility set is how the findings stay traceable across
  baseline edits.
- **Required before:** [`../PRINCIPLES.md`](../PRINCIPLES.md) — *Don't
  soften a gate to make a phase pass* is the doctrinal anchor of this
  flow's HARD-GATE.
- **Required before:** [`../BOUNDARY.md`](../BOUNDARY.md) — status
  vocabularies and the engine-vs-project axis (severity tiers are
  engine-level; per-FRS gate-effect tagging is project-level).
- **Caller:** [`design.md → Phase 1.5`](design.md#phase-15--validation-gate)
  — the gate mechanics live there; this file is the rule book it
  loads.
- **Adjacent (not callers but consulted):**
  [`frs-code-extraction-rules.md`](frs-code-extraction-rules.md) —
  produces the `[inferred from code]` items this gate then classifies;
  [`baseline-references.md`](baseline-references.md) — the
  `baseline-not-cited` Major finding routes a fix here when the
  resolution is a baseline edit;
  [`authoring-adr.md`](authoring-adr.md) — when the resolution to an
  `adr-conflict` Blocker is an ADR supersession.
- **Routes findings to:** OQ-NNN files under
  [`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/)
  for deferred / blocking questions; severity stays on the finding row
  in the FRS's `Validation findings` table.
- **Sibling rule books:**
  [`frs-code-extraction-rules.md`](frs-code-extraction-rules.md),
  [`lint.md`](lint.md),
  [`coverage-matrix.md`](coverage-matrix.md),
  [`test-data-generation.md`](test-data-generation.md).
