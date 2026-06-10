---
applies_when:
  stack: [agnostic]
---

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

> **Core/detail layout.** This is the core rule book — wholesale-read at
> Phase 1.5. Worked examples, the seven Additional-Sanity-Rules full
> texts, and the revision history live in
> [`frs-validation-rules/`](frs-validation-rules/) detail files, loaded
> per the [Detail files](#detail-files-load-on-demand) table. Every
> severity classification in this file is binding as written.

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
match the FRS template's `Validation findings` Type enum, plus **five
sanity-sub-flavors** (`flw-coverage`, `phase-1-bare-body-shape`,
`protocol-surface-leak`, `external-boundary-undeclared`,
`state-promotion-deferred`) — these record under `type: sanity` with the
sub-flavor named in the Rationale prefix (e.g.,
`"Blocker: phase-1-bare-body-shape — …"`). Introduction dates and
rationale: [`## Revision history`](#revision-history) below.
The eight checks fan out as parallel Pass 1 dispatches; the
Pass 2 cross-FRS sweep produces `cross-frs` rows including the
**CHG-conflict** sub-flavor (per R-CHG-6, see
[`design.md → Pass 2`](design.md#pass-2--milestone-cross-frs-sweep-runs-once-after-all-frss-in-the-milestone-are-per-frs-gated)).
**The cross-FRS sweep is skipped when the milestone has fewer than 2
FRSs** — append "N/A — single FRS milestone" to
`discovery/milestone-scope.md` for audit trail.

This file expands those checks with **severity classification**,
**bundling detection**, the **NFR rubric**, the **`[inferred from code]`
propagation rule** for brownfield code-mining, the **OQ gate-effect
taxonomy** linking findings to OQ-NNN files under
[`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/),
and the **audit reproducibility set** captured per finding.

The rules apply on top of the project's FRS template
([`../_templates/FRS.md`](../_templates/FRS.md)), the canonical DDD wiki,
and the baselines at [`docs/shared/glossary.md`](../../docs/shared/glossary.md) and
[`docs/shared/ccc/index.md`](../../docs/shared/ccc/index.md) (the per-CCC
baseline pages).

## Detail files (load on demand)

| When | Load |
|---|---|
| A language-trap finding fires and the worked ❌/✅ form is needed; or the FRS is prototype-sourced | [`frs-validation-rules/examples.md`](frs-validation-rules/examples.md) |
| A named sanity sub-flavor fires (ac-single-outcome / deferred-finding-raises-oq / nfr-baseline-trace / within-frs-rule-restatement / protocol-surface-leak / external-boundary-undeclared / state-promotion-deferred) | [`frs-validation-rules/additional-rules-full.md`](frs-validation-rules/additional-rules-full.md) |
| Auditing a rule's origin or a grandfather date | [`## Revision history`](#revision-history) (this file) |

---

## Severity classification

Every Validation finding is one of:

| Severity | Meaning | Examples |
|---|---|---|
| **Blocker** | Hard rule violated; FRS cannot enter Phase 2. | Missing FRS section; technical detail in FLW Scenarios (uses ENT/CMD/STA/PERM-NNN IDs in Phase-1-bare body — `phase-1-bare-body-shape` violation per R-NEW-2); bundled operations (two user-journeys in one FRS); AC that cannot be expressed as a test runner assertion or has no scenario anchor on a real FLW (`flw-coverage` per R-NEW-3); Phase-1-born FLW with no Scenarios filled (Trigger or Scenarios section empty under R-NEW-2); `produced_actor:` set but ACT-NNN ID dangling (per R-NEW-9 amended 2026-05-17, the FRS frontmatter `produced_actor:` field IS the claim — this Blocker fires when the field is set to a value already claimed by a sibling FRS's `produced_actor:` glob or already present in canonical `nodes/actors/index.md`); **`touches_nodes:` non-empty but no Phase-1-born CHG file exists at `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md`** (per R-CHG-1); **CHG `modifies[]` carries structural before/after at Phase 1** (Phase-2-wired content under a Phase-1-bare CHG — `phase-1-bare-body-shape` violation per R-CHG-4 / R-CHG-7); missing or dangling `produced_flw:` / `produced_actor:` / `produces_nodes:` / `touches_nodes:` / `adrs:` declarations that clearly apply; FRS-ID collision; duplicate FLW Scenario signature against canonical (existence scan widened per R-NEW-6); FRS contradicts an `accepted` ADR without an ADR-supersession path; FRS violates an `accepted` STD whose `applies_when.stack:` intersects the FRS's `stack:` without filing a deviation ADR (`type: standard-conflict`); FRS uses a stack-narrow STD whose `applies_when.stack:` intersects the FRS's `stack:` without declaring it in `standards:` (`type: standard-conflict`); FRS silently overrides a CCC baseline declared in `ccc:` without a back-linked deviation ADR (`type: ccc-deviation`); FRS authored on or after 2026-05-22 omits `framework:` in frontmatter or declares it with an out-of-enum value — canonical enum at [`../BOUNDARY.md § Framework axis`](../BOUNDARY.md#framework-axis-frontmatter-enum) (`type: frontmatter-presence`; pre-2026-05-22 FRSs grandfathered, but the next substantive edit MUST backfill both `stack:` and `framework:`). |
| **Major** | Domain / NFR / traceability problem; FRS is usable but must be revised before Phase 2 kickoff. | Cross-module actor in scope; NFR stated in engineer language; FRS restates baseline content instead of citing it (`baseline-not-cited`); `[inferred from code]` or `[inferred from prototype]` item present with no Open Question; glossary term used but not in `glossary.md`; deviation from a CCC baseline with no ADR back-link; FRS cites a CCC by content (restating the baseline prose) instead of by ID; **FRS-CHG mismatch** — FRS implies behavior change X but the Phase-1-born CHG's `modifies[]` doesn't describe X, or the CHG describes a modification the FRS doesn't justify (`type: chg-sanity` per R-CHG-5); **illegitimate `created_under: pre-2026-05-17` marker** on a FLW whose `created:` date is after the cutover (B5 grandfather-only marker — `type: sanity`, revise-before-Phase-2); **external boundary undeclared** — FRS implies an outbound external boundary (non-`In-app` Notifications channel, or a named outbound framework abstraction like `IEmailSender` / `IHttpClientFactory` / vendor SDK) but neither declares an `INT-NNN` in `produces_nodes:` / `touches_nodes:` nor cites one inline in body prose (`external-boundary-undeclared`). |
| **Minor** | Style / clarity issue; does not invalidate the FRS. | Ambiguous phrasing; inconsistent terminology; AC restating a Business rule verbatim (per `R-WITHIN-FRS-RULE-RESTATEMENT`); OQ missing a tag; non-rule trap ("no limit applies" — describes absence of a constraint rather than a constraint); **vague-but-resolvable CHG `modifies[]` delta** — Phase 2 enrichment path is clear (`type: chg-sanity` per R-CHG-5); **state-promotion-deferred** — FRS describes a lifecycle transition that crosses the inline-on-entity threshold (see [KB-LAYOUT discriminator](../KB-LAYOUT.md#node-type-discriminators)) without declaring `STA-NNN` in `produces_nodes:` or carrying a citable inline-DEC justifying continued inline modeling. |

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

→ Full ❌/✅ pairs: [`frs-validation-rules/examples.md`](frs-validation-rules/examples.md).
Trap categories: implementation detail ("PostgreSQL table"), technical
surface ("returns 404"), technical NFR ("Redis cache"), interaction
mechanism ("drag-and-drop", "double-click"), non-rule ("no limit
applies"), and CHG-FRS divergence (chg-sanity).

**Rule of thumb for interaction mechanisms.** If a business stakeholder
reading the FRS five years from now (when drag-and-drop may have been
replaced by touch, voice, or some new modality) would see the description
and think "we shipped that wrong, the new UI doesn't drag-and-drop", the
FRS is over-specifying. Describe the *outcome the actor achieves*, not
the *gesture they perform*.

**Rule of thumb for non-rules.** A rule must constrain behaviour. If the
body reads as `not enforced`, `no limit applies`, `no constraint`,
`accepts any value`, or otherwise asserts the *absence* of a rule, flag
as a Minor finding and either rewrite to a positive form or replace with
a different inferred rule that genuinely constrains the operation.

**Rule of thumb for chg-sanity.** The Phase-1-bare CHG body uses business
language only — but it must coherently describe the behavior delta the
FRS implies. If a reader of the FRS's ACs / BRs / Postconditions plus the
target canonical node's current body can't write a one-sentence summary
of the CHG's `modifies[]` entry that matches what's there, the delta is
either vague (Minor: chg-sanity — Phase 2 enrichment path is clear) or
mismatched (Major: chg-sanity — FRS-CHG divergence). The
**sibling-FRS birth-order rule** applies per υ / M1: when this CHG
targets a Phase-1-bare FLW born by a sibling FRS, validate against
the current Phase-1-bare body; re-run chg-sanity only on the affected
CHG if that sibling's body changes mid-round-trip. (ACT is not in scope
— ACT births at Phase 2, not Phase 1; R-NEW-2a retired 2026-05-17.)

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

## `[inferred from prototype]` propagation

→ Full text: [`frs-validation-rules/examples.md`](frs-validation-rules/examples.md)
(load when the FRS is prototype-sourced).

**Summary:** the exact **peer** of `[inferred from code]` — same tagged
sections (Actors / Preconditions / Business rules / Edge cases / ACs),
same unconditional tagging rule, same OQ-only strip path
(Confirm / Revise / Defer), same late-discovered-tag halt, same two
Major violations (untagged item in an approved FRS; tag stripped without
OQ confirmation). Signal sources differ (role-gated screens, disabled
controls, validation-hint UI, empty/error states, interaction sequences).
Mixed code+prototype sources carry the dual tag
`[inferred from code, prototype — confirm with stakeholder]`.

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

→ Full text (triggers, exemptions, doctrinal anchors, violation tables):
[`frs-validation-rules/additional-rules-full.md`](frs-validation-rules/additional-rules-full.md).

**Grandfather clause (summary).** These rules apply **prospectively** to
FRSs whose Phase 1.5 gate first runs after the rule's introduction date;
the grandfather is one-shot (a re-triggered gate applies them from the
re-run forward). Introduction dates: `ac-single-outcome` /
`deferred-finding-raises-oq` / `nfr-baseline-trace` 2026-05-16; the other
four 2026-05-17.

### Rule: ac-single-outcome

`sanity` · **Major** · An AC bullet bridges two distinct observable
outcomes with "OR" / "either…or" / "and/or". Resolution: split, pin to
one outcome, or carry as a `gate_effect: blocking` OQ.
Rationale prefix: `"Major: ac-single-outcome — …"`.

### Rule: deferred-finding-raises-oq

(matches underlying type) · **Major** · A finding row carries
`resolution: deferred` without citing an `OQ-NNN` in Rationale.
Resolution: resolve inline, or raise the OQ now and cite the ID.
Rationale prefix: `"Major: deferred-finding-raises-oq — …"`.

### Rule: nfr-baseline-trace

`ccc-deviation` · **Minor** · A valid operation-specific NFR claim lacks
its CCC-NNN citation (distinct from `baseline-not-cited`, which is
restated baseline content and Major). Resolution: cite the CCC by ID or
file the deviation ADR and cite both.
Rationale prefix: `"Minor: nfr-baseline-trace — …"`.

### Rule: R-WITHIN-FRS-RULE-RESTATEMENT

`sanity` · **Minor** · The same constraint appears verbatim in two or
more of Use case / Edge cases / Business rules / Acceptance criteria.
Resolution: state once as `BR-NN`, cite from the others (role-specific
paraphrase with added testable specificity is a Pass).
Rationale prefix: `"Minor: within-frs-rule-restatement — …"`.

### Rule: protocol-surface-leak

`sanity` · **Major** · Protocol-wire surface (HTTP status codes,
verb+path beyond the single sanctioned Trigger-line occurrence,
query-string syntax, fenced JSON/XML response shapes, OAuth2 literals,
error-code string literals) appears inline in operation-specifying FRS
sections. Resolution: relocate to a `CON-NNN` node and recast the FRS in
business outcomes; `CON-NNN` citations are the cure, ABP public-API
symbol names stay ADR-001-governed.
Rationale prefix: `"Major: protocol-surface-leak — …"`.

### Rule: external-boundary-undeclared

`sanity` · **Major** · An outbound external boundary is implied (non-
`In-app` Notifications channel, or a named outbound abstraction such as
`IEmailSender` / named `IHttpClientFactory` client / vendor SDK) but no
`INT-NNN` is declared in `produces_nodes:` / `touches_nodes:` or cited
inline. Resolution: author/extend the `INT-NNN` or cite the existing
one; CCC citation does NOT exempt; distributed events route to
`EVT-NNN` + linked `CON-NNN` instead.
Rationale prefix: `"Major: external-boundary-undeclared — …"`.

### Rule: state-promotion-deferred

`sanity` · **Minor** · A lifecycle transition crosses the
inline-on-entity threshold
([KB-LAYOUT discriminator](../KB-LAYOUT.md#node-type-discriminators))
without `STA-NNN` declared or a citable inline-DEC justifying continued
inline modeling. Resolution: promote (declare `STA-NNN`) or defer (add
the inline DEC citing the uncrossed criterion). Field mutations and
framework-managed state never trigger.
Rationale prefix: `"Minor: state-promotion-deferred — …"`.

---

## How findings appear in the FRS

The FRS template's `Validation findings` section carries one row per
finding:

| Finding | Type | Resolution | Rationale |

`type` is one of `existence`, `sanity`, `adr-conflict`, `standard-conflict`,
`ccc-deviation`, `chg-sanity`, or `cross-frs` per the template. Severity
(Blocker / Major / Minor) and the audit reproducibility set go in the
Rationale prefix. The full map of which sub-flavor records under which
type:
[`frs-validation-rules/additional-rules-full.md → Expanded findings-table sub-flavor map`](frs-validation-rules/additional-rules-full.md#expanded-findings-table-sub-flavor-map).

**`type: existence` scope** (widened per R-NEW-6). The existence scan
(`design.md → Phase 1.5 → Pass 1`) searches the canonical wiki and matches
against every canonical node regardless of status — `proposed` (a Phase-1-born
FLW just landed by this FRS or by an in-flight sibling FRS / FS), `active`,
`superseded`, or `deprecated`. The scan matches two signatures per FRS:
(a) FRS title / actor ID / command domain; (b) **FLW Scenario signatures**
— happy-path Given/When/Then phrasing, to catch duplicate Phase-1-born
FLWs across FRSs that the title-only check would miss. **Cross-FRS
duplicate-actor detection is no longer in scope** (R-NEW-2a retired
2026-05-17 — the ACT file doesn't exist at this gate; the conflict
surfaces at Phase 2 FS validation via the `nodes/actors/index.md` ceiling
plus the cross-FRS `produced_actor:` glob). Read-only
references to canonical FLW / ACT in FRS prose are NOT existence-checked
(text grep is the audit hook — per M2). A match against a `proposed` node is still a finding; the
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

> Load only when auditing a rule's origin or a grandfather date.

| Version | Date | Source |
|---------|------|--------|
| 1.0 | 2026-05-11 | Absorbed from the shared FRS validation rules reference (v3.1) during workflow absorption, distilled to the project's FRS template and Phase 1.5 gate. Issue-tracker label automation, harness orchestrator dispatch, the 14-item Self-Review mnemonic legend, and per-section schema enforcement (Section-N references) were dropped — the project is filesystem-based with a different FRS template shape. Severity, bundling detection, NFR rubric, `[inferred from code]` propagation, OQ tag taxonomy, and audit reproducibility set retained. |
| 1.1 | 2026-05-17 | Added `protocol-surface-leak` sanity sub-flavor (Major) — formalizes the "Common language traps" guidance for HTTP routes / status codes / payload shapes / OAuth2 literals / error-code string literals as an enforced finding. CON-NNN reference is the sanctioned cure; ABP public-API symbol names remain covered by ADR-001. Triggered by retroactive cleanup of FRS-001/002/003 (M-01 user-auth) on the same date. |
| 1.2 | 2026-05-17 | Added `external-boundary-undeclared` sanity sub-flavor (Major) — formalizes that an outbound external boundary signalled by a non-`In-app` Notifications channel or a named outbound framework abstraction (`IAccountEmailer`, `IEmailSender`, `ISmsSender`, `IPushNotificationService`, named `IHttpClientFactory` clients, vendor SDK adapters) requires an `INT-NNN` node — declared in `produces_nodes:` / `touches_nodes:` or cited inline in body prose. INT-NNN reference is the sanctioned cure (parallel to CON-NNN for `protocol-surface-leak`); CCC citation does NOT exempt (CCC is policy layer, INT is boundary layer). Distributed-event publishing to external Kafka / RabbitMQ is out of this rule's scope (routes to EVT-NNN + linked CON-NNN per KB-LAYOUT). Triggered by FRS-001 M-01 audit identifying email-dispatch boundary as undeclared; companion edits in `frs-code-extraction-rules.md` (Translation discipline table) and `_templates/FRS.md` (Notifications heading prompt). |
| 1.3 | 2026-05-17 | Added `state-promotion-deferred` sanity sub-flavor (Minor) — formalizes the STA vs. inline-on-entity discriminator newly introduced in [`KB-LAYOUT.md → Node-type discriminators`](../KB-LAYOUT.md#node-type-discriminators). Fires when an FRS describes a lifecycle transition that crosses any of the six threshold criteria (≥3 states, ≥2 transitions, named non-CMD guard, consumed domain event on transition, terminal-state semantics, illegal-transition enforcement) without declaring `STA-NNN` in `produces_nodes:` or carrying a citable inline-DEC justifying continued inline modeling. STA-NNN reference is the cure; defer path requires an inline DEC on the entity (or a paragraph in FRS Brownfield impact). Minor severity reflects that this is a modeling judgement — Phase 2 can still ingest the FRS — and matches the precedent set by `nfr-baseline-trace`. Triggered by the M-01 user-auth feedback session questioning why `ENT-001.EmailConfirmed` was modeled inline rather than as STA-001; the framework had no objective trigger for "formal state machine" beyond the ENTITY template's `(if applicable)` hedge. Companion edits in `_templates/nodes/ENTITY.md` (Lifecycle section's State machine line now cites the KB-LAYOUT discriminator). No retroactive M-01 trigger: `EmailConfirmed` (single boolean, single transition, no consumed event, no terminal handling) stays below all six criteria and remains inline. |
| 1.4 | 2026-05-22 | Promoted "FRS uses a stack-narrow STD without declaring it in `standards:`" (`type: standard-conflict`) from Major to Blocker. The Major classification let undeclared stack-applicable STDs propagate FRS → FS, where the live FSs' `standards:` slot shipped `[]` and the QA gate's STD-conformance dispatch never fired against rules that materially applied — the failure mode that left STD-002 (.NET / ABP coding conventions: `ErrorOr<T>` returns, FluentValidation, aggregate encapsulation) invisible to FS-001 / FS-002 / FS-003. Promotion forces FRS authors to enumerate the stack-applicable STD set at Phase 1.5, closing the upstream half of the gap. Applies prospectively — pre-2026-05-22 FRSs that already cleared Phase 1.5 are grandfathered. Defense-in-depth companion edit: [`qa-gate.md`](qa-gate.md) gains a fourth code-pattern conformance dispatch (parallel to ADR / STD / CCC) that scans project-baseline patterns even when `standards:` is empty. |
| 1.5 | 2026-05-28 | Added `[inferred from prototype]` propagation rule as peer to `[inferred from code]`, completing the input-medium symmetry: brownfield code-mining and greenfield prototype-seeding now share Phase 1.5 tag-enforcement discipline. Same Major severity on the two violations (untagged prototype-inferred item; tag stripped without OQ confirmation). Dual-tag form `[inferred from code, prototype]` covered for mixed-source extractions. Companion to new file [`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md) (v1.0 same date), which governs how the tag is attached at extraction time. Severity table's Major row also widened to name both tags. |

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
  [`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md)
  — produces the `[inferred from prototype]` items this gate then
  classifies (prototype-sourced peer);
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
  [`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md),
  [`lint.md`](lint.md),
  [`coverage-matrix.md`](coverage-matrix.md),
  [`test-data-generation.md`](test-data-generation.md).
