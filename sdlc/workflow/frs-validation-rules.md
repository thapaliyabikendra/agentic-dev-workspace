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

The project's Phase 1.5 gate runs eight per-FRS checks plus a cross-FRS
sweep. Type taxonomy: **six first-class types** (`existence`, `sanity`,
`adr-conflict`, `standard-conflict`, `ccc-deviation`, `chg-sanity`) that
match the FRS template's `Validation findings` Type enum, plus **two
sanity-sub-flavors** (`flw-coverage`, `phase-1-bare-body-shape`) added
on 2026-05-17 — these record under `type: sanity` with the sub-flavor
named in the Rationale prefix (e.g., `"Blocker: phase-1-bare-body-shape — …"`).
`chg-sanity` was added on cutover with the CHG-Phase-1-birth rule
(R-CHG-1..7). The eight checks fan out as parallel Pass 1 dispatches; the
Pass 2 cross-FRS sweep produces `cross-frs` rows and now also catches
**CHG-conflict** sub-flavor (sibling FRSs with conflicting Phase-1-born
CHGs — per R-CHG-6, see [`design.md → Pass 2`](design.md#pass-2--milestone-cross-frs-sweep-runs-once-after-all-frss-in-the-milestone-are-per-frs-gated)).
The two original sub-flavors (per R-NEW-3 / R-NEW-2 / R-NEW-2a) verify
against real anchors rather than forward-claimed IDs — FLW + ACT now
born at Phase 1 per R-NEW-1; the chg-sanity check verifies against the
Phase-1-born CHG body (per R-CHG-1). **The cross-FRS sweep is skipped
when the milestone has fewer than 2 FRSs** — a single-FRS milestone has
no cross-FRS conflicts to detect; append "N/A — single FRS milestone"
to `discovery/milestone-scope.md` for audit trail.
This file
expands those checks with **severity classification**, **bundling
detection**, the **NFR rubric**, the **`[inferred from code]` propagation
rule** for brownfield code-mining, the **OQ gate-effect taxonomy** that
links Validation findings to OQ-NNN files under
[`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/),
and the **audit reproducibility set** captured per finding.

The rules apply on top of the project's FRS template
([`../_templates/FRS.md`](../_templates/FRS.md)), the canonical DDD wiki,
and the baselines at [`docs/shared/glossary.md`](../../docs/shared/glossary.md) and
[`docs/shared/ccc/index.md`](../../docs/shared/ccc/index.md) (the per-CCC
baseline pages).

---

## Severity classification

Every Validation finding is one of:

| Severity | Meaning | Examples |
|---|---|---|
| **Blocker** | Hard rule violated; FRS cannot enter Phase 2. | Missing FRS section; technical detail in FLW Scenarios (uses ENT/CMD/STA/PERM-NNN IDs in Phase-1-bare body — `phase-1-bare-body-shape` violation per R-NEW-2 / R-NEW-2a); bundled operations (two user-journeys in one FRS); AC that cannot be expressed as a test runner assertion or has no scenario anchor on a real FLW (`flw-coverage` per R-NEW-3); Phase-1-born FLW with no Scenarios filled (Trigger or Scenarios section empty under R-NEW-2); `produced_actor:` set but ACT file does not exist at `docs/<component>/nodes/actors/`; **`touches_nodes:` non-empty but no Phase-1-born CHG file exists at `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md`** (per R-CHG-1); **CHG `modifies[]` carries structural before/after at Phase 1** (Phase-2-wired content under a Phase-1-bare CHG — `phase-1-bare-body-shape` violation per R-CHG-4 / R-CHG-7); missing or dangling `produced_flw:` / `produced_actor:` / `produces_nodes:` / `touches_nodes:` / `adrs:` declarations that clearly apply; FRS-ID collision; duplicate FLW Scenario signature against canonical (existence scan widened per R-NEW-6); FRS contradicts an `accepted` ADR without an ADR-supersession path; FRS violates an `accepted` STD whose `applies_when.stack:` intersects the FRS's `stack:` without filing a deviation ADR (`type: standard-conflict`); FRS silently overrides a CCC baseline declared in `ccc:` without a back-linked deviation ADR (`type: ccc-deviation`). |
| **Major** | Domain / NFR / traceability problem; FRS is usable but must be revised before Phase 2 kickoff. | Cross-module actor in scope; NFR stated in engineer language; FRS restates baseline content instead of citing it (`baseline-not-cited`); `[inferred from code]` item present with no Open Question; glossary term used but not in `glossary.md`; deviation from a CCC baseline with no ADR back-link; FRS uses a stack-narrow STD (`applies_when.stack:` intersects `stack:`) without declaring it in `standards:`; FRS cites a CCC by content (restating the baseline prose) instead of by ID; **FRS-CHG mismatch** — FRS implies behavior change X but the Phase-1-born CHG's `modifies[]` doesn't describe X, or the CHG describes a modification the FRS doesn't justify (`type: chg-sanity` per R-CHG-5); **illegitimate `created_under: pre-2026-05-17` marker** on a FLW whose `created:` date is after the cutover (B5 grandfather-only marker — `type: sanity`, revise-before-Phase-2). |
| **Minor** | Style / clarity issue; does not invalidate the FRS. | Ambiguous phrasing; inconsistent terminology; AC restating a Business rule verbatim (per `R-WITHIN-FRS-RULE-RESTATEMENT`); OQ missing a tag; non-rule trap ("no limit applies" — describes absence of a constraint rather than a constraint); **vague-but-resolvable CHG `modifies[]` delta** — Phase 2 enrichment path is clear (`type: chg-sanity` per R-CHG-5). |

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

Detect bundling by any of these signals in the FRS Use case + the
Phase-1-born FLW Scenarios (FLW carries journey behavior post-2026-05-17;
the FRS Behavior section is retired):

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
target — AND (b) is not already covered by a CCC under
[`docs/shared/ccc/`](../../docs/shared/ccc/index.md). If the FRS deviates
from a CCC, the deviation lands as an ADR (with `related: [CCC-NNN]`) — not
as inline FRS prose.

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

**Rule of thumb for chg-sanity.** The Phase-1-bare CHG body uses business
language only — but it must coherently describe the behavior delta the
FRS implies. If a reader of the FRS's ACs / BRs / Postconditions plus the
target canonical node's current body can't write a one-sentence summary
of the CHG's `modifies[]` entry that matches what's there, the delta is
either vague (Minor: chg-sanity — Phase 2 enrichment path is clear) or
mismatched (Major: chg-sanity — FRS-CHG divergence). The
**sibling-FRS birth-order rule** applies per υ / M1: when this CHG
targets a Phase-1-bare FLW / ACT born by a sibling FRS, validate against
the current Phase-1-bare body; re-run chg-sanity only on the affected
CHG if that sibling's body changes mid-round-trip.

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
- **Business rules** — when a `BR-NN` policy claim comes from a
  validator, `try/catch`, `setError`, or branching condition.
- **Edge cases** — when an `EC-NN` summary at FRS level comes from a
  branching condition or guard clause in code. (Fault-path behavior
  lives in the Phase-1-born FLW's `#fault` Scenario, outside the FRS;
  the `[inferred from code]` tag is FRS-scoped.)
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

### Vocabulary contrast (gate_effect vs. Survey-tier)

The OQ template carries `gate_effect:` **only** when `origin ∈ {validation-gate,
fs-authoring}` (per [`../_templates/OPEN-QUESTION.md`](../_templates/OPEN-QUESTION.md)).
Survey OQs (`origin: frs-authoring`) instead use the 4-tier classification in
[`research.md → Step R-1`](research.md#step-r-1--oq-classification-in-per-frs-survey)
— `blocking-frs` / `blocking-fs` / `blocking-impl` / `non-blocking` — which is
**procedural, not a stored field**: it routes to `status:` + `needed_by:` per
the action column there. The two vocabularies never coexist on one OQ; they
apply to different `origin:` values.

| OQ origin | Vocabulary | Where stored |
|---|---|---|
| `frs-authoring` (Survey) | 4-tier (blocking-frs/fs/impl/non-blocking) | Routed to `status:` + `needed_by:` per [`research.md`](research.md#step-r-1--oq-classification-in-per-frs-survey); not a stored field |
| `validation-gate`, `fs-authoring` | `gate_effect:` (blocking / post-approval) | Stored in OQ frontmatter |

---

## Audit reproducibility set

When a Validation finding fires, the gate also captures (in the FRS's
`Validation findings` Rationale, or in the raised `OQ-NNN`'s body for
deferred findings):

- `glossary_version` — from the Revision History of
  [`docs/shared/glossary.md`](../../docs/shared/glossary.md) at gate entry.
- `baseline_version` — set of CCC IDs and their `updated:` dates from
  the FRS's `ccc:` frontmatter, as read from
  [`docs/shared/ccc/`](../../docs/shared/ccc/index.md) at gate entry.
- `adrs_consulted` — the FRS's `adrs:` frontmatter list at gate entry.
- `commit` — the git SHA at gate entry (optional but recommended).

The reproducibility set makes findings auditable later — a reviewer can
reconstruct which baseline content the finding was generated against,
even after the baselines have evolved. The per-CCC `updated:` stamps are
how the breaking / non-breaking classification on baseline edits stays
meaningful: a finding cited against
`baseline_version: { CCC-005: 2026-05-16 }` is interpretable
independently of subsequent edits to CCC-005.

---

## Additional sanity rules

Four rules tighten the Phase 1.5 gate's reach into AC discipline,
deferred-finding bookkeeping, NFR baseline traceability, and
within-FRS rule restatement. The first three were introduced
2026-05-16; `R-WITHIN-FRS-RULE-RESTATEMENT` was added 2026-05-17.

**Grandfather clause.** Rules in this section apply **prospectively** to
FRSs whose Phase 1.5 gate first runs after the rule's introduction date.
FRSs whose gate already ran on or before the rule's introduction date
are not retroactively re-classified — their existing `Validation
findings` rows stand. A revision of a grandfathered FRS that
re-triggers the gate is subject to these rules from the re-run
forward; the grandfather is one-shot. Per-rule introduction dates:

- `ac-single-outcome`, `deferred-finding-raises-oq`,
  `nfr-baseline-trace` — 2026-05-16.
- `R-WITHIN-FRS-RULE-RESTATEMENT` — 2026-05-17.
- `protocol-surface-leak` — 2026-05-17.

### Rule: ac-single-outcome

| Trigger | An acceptance-criteria bullet contains "OR" / "either…or" / "and/or" between two distinct observable outcomes (different HTTP status codes, redirect-vs-error, success-vs-fail). |
| ------- | --- |
| Type | `sanity` |
| Severity | **Major** |
| Resolution | Split the AC into two rows (one per outcome), pin to one outcome (revise the other to a separate criterion), or carry the ambiguity as an OQ with `gate_effect: blocking` until the stakeholder picks. |
| Rationale prefix | `"Major: ac-single-outcome — …"` |

An AC must be a single testable claim. Test runners assert one expected
shape per assertion; an OR-bridged AC forces the test author to pick
silently, defeating the trace from FRS → FLW scenario → TC. The
"the platform default does whichever" intuition — see FRS-002's original
"400 or redirect" row — is exactly the trap: the FRS reader cannot tell
whether `200` is a defect or a tolerated path.

### Rule: deferred-finding-raises-oq

| Trigger | A Validation findings row carries `resolution: deferred` and the Rationale column does not cite an `OQ-NNN`. |
| ------- | --- |
| Type | (matches the underlying finding type) |
| Severity | **Major** |
| Resolution | Either resolve the finding inline (revise the FRS / file the ADR / drop the line) and flip to `resolved`, or raise the OQ now and cite the ID in Rationale. Deferral without an OQ is a half-fired touch. |
| Rationale prefix | `"Major: deferred-finding-raises-oq — …"` |

The `Pre-resolved Gate` anti-pattern (see [`design.md`](design.md#anti-pattern-the-pre-resolved-gate))
catches resolutions claimed without artifact change. This rule catches
the dual failure: a deferral claimed without the OQ that carries the
deferred question forward. Without the OQ, the deferred finding has
nowhere to live after the FRS is closed — it falls off the surface and
silently expires.

### Rule: nfr-baseline-trace

| Trigger | An NFR-shaped sentence appears in any FRS body section (Business rules, Postconditions, Auditability, Acceptance criteria) without a CCC-NNN citation in the immediate surrounding clause **or** an explicit "deviates from CCC-NNN via ADR-NNN" annotation. |
| ------- | --- |
| Type | `ccc-deviation` |
| Severity | **Minor** |
| Resolution | Cite the relevant CCC by ID, or replace the NFR claim with a CCC reference, or file the operation-specific override as an ADR back-linked via `related: [CCC-NNN]` and cite both IDs in the FRS. |
| Rationale prefix | `"Minor: nfr-baseline-trace — …"` |

Distinct from the existing `Major: baseline-not-cited` rule
(see [NFR rubric](#nfr-rubric)). `baseline-not-cited` fires when the
FRS restates a baseline's content as if it were operation-specific;
`nfr-baseline-trace` fires when the FRS makes a valid operation-specific
NFR claim but omits the baseline citation. The Minor severity reflects
the gap (traceability, not duplication); the Major reflects the
violation (duplication of authority).

| Violation example | Classification |
|---|---|
| Body says "retention is 10 years" and no CCC-012 cited | Minor: nfr-baseline-trace (cite CCC-012 or file ADR) |
| Body says "the audit log retains operation attempts for 7 years" verbatim from CCC-004 | Major: baseline-not-cited (delete; rely on `ccc:` frontmatter) |
| Body says "this operation extends CCC-012's retention from 7 to 25 years per ADR-014" | Pass (cited + deviation annotated) |

### Rule: R-WITHIN-FRS-RULE-RESTATEMENT

| Trigger | The same constraint appears as prose in **two or more** of: the FRS's narrative sections (Use case paragraph, Edge cases) **and** Business rules **and** Acceptance criteria. Distinct from baseline restatement (`baseline-not-cited`) — this rule catches duplication **within** the FRS body across section roles, not duplication across the FRS and a baseline. |
| ------- | --- |
| Type | `sanity` |
| Severity | **Minor** |
| Resolution | State the constraint once in the declarative section (`BR-NN` in Business rules), then reference `BR-NN` from the others. Use case and AC may cite the BR ID; they must not restate the BR text verbatim. If the restatement is genuinely a paraphrase that serves a distinct section role (e.g., AC making the BR testable in a specific Flow scenario), keep both — the rule fires on verbatim restatement, not on legitimate role-specific phrasing. |
| Rationale prefix | `"Minor: within-frs-rule-restatement — …"` |

Companion to the section-role discipline declared in the FRS template
([`../_templates/FRS.md`](../_templates/FRS.md) → Business rules and
Acceptance criteria headings). Section roles assigned 2026-05-17:

- **Business rules** — declarative policy claims, each stated once.
- **Acceptance criteria** — testable claims; cite `BR-NN`, never
  restate.
- **Use case / Edge cases** — narrative framing for the operation;
  cite `BR-NN` rather than restate.

The rule applies prospectively (grandfather clause below) and is Minor
because the section-role tightening is new — pre-2026-05-17 FRSs may
carry historical restatements that the template did not previously
forbid.

| Violation example | Classification |
|---|---|
| BR-03 says "passwords must be ≥ 12 characters"; AC says "the system rejects passwords shorter than 12 characters"; Use case paragraph also says "users must choose a password of at least 12 characters" | Minor: within-frs-rule-restatement (state once in BR-03; cite from Use case + AC) |
| BR-03 says "passwords must be ≥ 12 characters"; AC-01 says "AC-01 — actor submits a 10-character password → system rejects with the message defined in BR-03" | Pass (AC cites BR-03 and adds testable specificity — legitimate role-specific phrasing) |

### Rule: protocol-surface-leak

| Trigger | Protocol-wire surface appears inline in the FRS body's **operation-specifying** sections (Behavior, Postconditions, Business rules, Edge cases, Acceptance criteria). Detected patterns include: HTTP status-code tokens (`HTTP\s+\d{3}` — "HTTP 200", "HTTP 400"), HTTP verb-with-path tokens (`(GET\|POST\|PUT\|PATCH\|DELETE)\s+/\S+`), query-string syntax (`\?\w+=`), fenced JSON / XML response shapes (a ``` fence whose body contains `{` or `<`), OAuth2 / OpenIddict protocol literals (`grant_type=password`, `error:\s*["'][\w_]+["']`), and error-code string identifiers (`IdentityErrors\.\w+`, `ERR_\w+`, `EmailNotConfirmed`-style ABP error strings). **Scope explicitly excludes** the Validation findings table (which is a meta-audit log of past leaks — legitimate to name the leaked surface there) and the Out of scope section when the literal is a *deferred-feature identifier* rather than specifying this FRS's behavior (e.g., "Token refresh (`grant_type=refresh_token`) → future milestone" is a Pass; "Out of scope: HTTP 400 fault paths" is a leak). |
| ------- | --- |
| Type | `sanity` |
| Severity | **Major** |
| Resolution | Author or extend a `CON-NNN` node carrying the protocol surface (route, request / response schema, status codes, error-code map). Recast the FRS body in terms of business outcomes ("registration is rejected as a duplicate-email outcome"; "the actor is redirected to the login page"). Reference `CON-NNN` from the FRS where wire-level detail is needed; integration tests verify the wire mapping. |
| Rationale prefix | `"Major: protocol-surface-leak — …"` |

**Exemptions.**

- **Trigger-line surface identifier.** A single HTTP verb-with-path token MAY
  appear once in the Use case Trigger line as a compact surface identifier
  (e.g., "the browser issues a GET against `/api/account/confirm-email`").
  The Trigger is the one sanctioned home; further occurrences trigger the
  rule.
- **CON-NNN reference is the cure.** Inline references to a `CON-NNN` node
  in adjacent prose (e.g., "wire surface canonical in CON-002") are not a
  leak — they are how the rule is satisfied. The rule fires on inline
  protocol-surface *tokens*, not on `CON-NNN` *citations*.
- **ABP public-API symbol names** (ABP classes, methods, interfaces,
  configuration option keys, entity property names) remain governed by
  ADR-001 and do not trigger this rule. Routes, status codes, payload
  shapes, and error-code string literals do, even when they appear next
  to an ADR-001-covered symbol.

**Doctrinal anchor.** Formalizes the "Common language traps" guidance
(see [§ Common language traps](#common-language-traps) — the second
trap, "The API will return a 404 if the user is not found", is now
enforced rather than aspirational) and the
[`frs-code-extraction-rules.md → Translation discipline`](frs-code-extraction-rules.md#translation-discipline-code--business-language)
table's "drop entirely" entries for endpoint paths, status codes, and
payload shapes.

| Violation example | Classification |
|---|---|
| FRS AC: "Submitting a duplicate email → HTTP 400, error code `IdentityErrors.DuplicateEmail`" | Major: protocol-surface-leak (status code + error-code literal; relocate to CON-NNN, recast AC as "registration is rejected as a duplicate-email outcome — see CON-NNN") |
| FRS Behavior: fenced ```json block with `access_token` / `refresh_token` fields | Major: protocol-surface-leak (response-shape JSON in FRS body; move to CON-NNN response shape table) |
| FRS Trigger: "POSTs to `/api/account/register`" + FRS Behavior: "the actor calls `POST /api/account/register` with…" | Major: protocol-surface-leak (verb+path appears twice; Trigger may keep it once, Behavior must drop) |
| FRS Trigger: "the browser issues a GET against `/api/account/confirm-email`" + FRS Behavior: "wire surface canonical in CON-002" | Pass (Trigger is the sanctioned single-occurrence; Behavior cites CON by ID) |
| FRS Behavior: "CMD-002 invokes `UserManager.ConfirmEmailAsync` and flips `IdentityUser.EmailConfirmed` to true; wire surface canonical in CON-002" | Pass (ABP method + property names covered by ADR-001; CON-002 cited for wire) |

---

## How findings appear in the FRS

The FRS template's `Validation findings` section carries one row per
finding:

| Finding | Type | Resolution | Rationale |

`type` is one of `existence`, `sanity`, `adr-conflict`, `standard-conflict`,
`ccc-deviation`, `chg-sanity`, or `cross-frs` per the template.
`standard-conflict` and `ccc-deviation` are first-class types (one per
Pass 1 check 4 and 5 respectively — see
[`design.md → Pass 1`](design.md#pass-1--per-frs-gate-runs-after-each-frs-is-authored));
`chg-sanity` is a first-class type (Pass 1 check 8 — fires only when the
FRS declares non-empty `touches_nodes:`, per R-CHG-5); `cross-frs` is the
Pass 2 type (now includes the **CHG-conflict** sub-flavor per R-CHG-6 —
sibling-FRS-born CHGs targeting the same canonical node, contradicting
deltas, or contradicting invariants). `sanity` itself expands to cover
bundling (see above), NFR rubric failure, `baseline-not-cited` (FRS
restates a baseline category instead of citing it), `inferred-from-code`
items present without a corresponding Open Question, `flw-coverage` (an
AC that does not map to a scenario anchor on a real FLW — per R-NEW-3,
[`design.md → Pass 1 check 6`](design.md#pass-1--per-frs-gate-runs-after-each-frs-is-authored)),
`phase-1-bare-body-shape` (a Phase-1-born FLW, ACT, or CHG whose
body shape violates R-NEW-2 / R-NEW-2a / R-CHG-4 — forward node IDs in
scenarios, Sequence populated at Phase 1, PERM-NNN refs in ACT
Preconditions, structural before/after on CHG `modifies[]` at Phase 1,
`adds[]` or `migration_steps[]` filled at Phase 1, illegitimate
`created_under:` marker — per
[`design.md → Pass 1 check 7`](design.md#pass-1--per-frs-gate-runs-after-each-frs-is-authored)),
`within-frs-rule-restatement` (a constraint appears as prose in
two or more of Use case / Edge cases / Business rules / Acceptance
criteria — per the FRS template's section-role discipline; see
[Rule: R-WITHIN-FRS-RULE-RESTATEMENT](#rule-r-within-frs-rule-restatement)),
and `protocol-surface-leak` (HTTP routes beyond the Use case Trigger,
HTTP status codes, payload shapes, OAuth2 / OpenIddict protocol literals,
or error-code string literals appear inline in the FRS body instead of
being relocated to a `CON-NNN` node — per
[Rule: protocol-surface-leak](#rule-protocol-surface-leak)).
Severity (Blocker / Major / Minor) and the audit reproducibility set go in
the Rationale prefix.

**`type: existence` scope** (widened per R-NEW-6). The existence scan
(`design.md → Phase 1.5 → Pass 1`) searches the canonical wiki and matches
against every canonical node regardless of status — `proposed` (a Phase-1-born
FLW or ACT just landed by this FRS or by an in-flight sibling FRS / FS),
`active`, `superseded`, or `deprecated`. The scan now matches three
signatures per FRS: (a) FRS title / actor ID / command domain; (b) **FLW
Scenario signatures** — happy-path Given/When/Then phrasing, to catch
duplicate Phase-1-born FLWs across FRSs that the title-only check would
miss; (c) **ACT identity** — when `produced_actor:` is set, scan canonical
ACT index for duplicate actor-role introductions across FRSs and verify
the ACT file exists at the expected path. Read-only references to canonical
FLW / ACT in FRS prose are NOT existence-checked (text grep is the audit
hook — per M2). A match against a `proposed` node is still a finding; the
`rationale:` carries the in-flight flavor ("matches proposed FLW-005
introduced by FRS-007 at Phase 1 — confirm distinctness or coordinate").
Severity is the same Blocker/Major/Minor triage as for matches against
`active` nodes; the in-flight context affects the resolution path
(coordinate with sibling FRS / FS), not the severity.

Example Rationale:
`"Major: baseline-not-cited — Auditability restates retention default in para 3 (baseline_version: { CCC-012: 2026-05-16 }). Replace with CCC-012 reference in the FRS's ccc: frontmatter."`

When `resolution: deferred`, a matching `OQ-NNN` file exists under
[`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/)
with `origin: validation-gate`, `origin_ref: FRS-NNN`, the appropriate
`gate_effect:`, and a back-link to this FRS in `nodes:` / body.

---

## Revision history

| Version | Date | Source |
|---------|------|--------|
| 1.0 | 2026-05-11 | Absorbed from the shared FRS validation rules reference (v3.1) during workflow absorption, distilled to the project's FRS template and Phase 1.5 gate. Issue-tracker label automation, harness orchestrator dispatch, the 14-item Self-Review mnemonic legend, and per-section schema enforcement (Section-N references) were dropped — the project is filesystem-based with a different FRS template shape. Severity, bundling detection, NFR rubric, `[inferred from code]` propagation, OQ tag taxonomy, and audit reproducibility set retained. |
| 1.1 | 2026-05-17 | Added `protocol-surface-leak` sanity sub-flavor (Major) — formalizes the "Common language traps" guidance for HTTP routes / status codes / payload shapes / OAuth2 literals / error-code string literals as an enforced finding. CON-NNN reference is the sanctioned cure; ABP public-API symbol names remain covered by ADR-001. Triggered by retroactive cleanup of FRS-001/002/003 (M-01 user-auth) on the same date. |

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
