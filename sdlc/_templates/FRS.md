---
id: FRS-NNN
title: <One-sentence user-journey, imperative voice>
status: draft                 # draft | reviewed | approved | implemented
milestone: M-NN               # filled at Phase 0 — milestone is authored first (blank for CR track)
cr:                           # filled at Phase CR-0 — CR-NNN for CR track (blank for milestone track; mutually exclusive with milestone:)
discovery: ../discovery/FRS-NNN-<slug>.md  # path to per-FRS Survey, OR the literal value `inline` when the survey is absorbed into this FRS's Brownfield impact section. Use `inline` for narrow FRSs (typically pure-addition new-feature or single-node change-request) where a separate survey file would be < 1 screen. See workflow/design.md § Phase 1.
produced_flw:                 # FLW-NNN — the one new FLW this FRS introduces. Born to canonical at Phase 1 with status: proposed (R-NEW-1). Strict 1:1 — multi-FLW production FRSs are not permitted (split into separate FRSs). Blank when no new FLW is introduced (rare — usually means a touches_nodes:-only FRS modifying existing canonical).
produced_actor:               # ACT-NNN — the one new ACT this FRS introduces, when it introduces a new actor role. Forward reference at Phase 1: this `produced_actor:` field IS the authoritative claim (R-NEW-9 amended 2026-05-17 — no `id-claims.md` introduce row written). Cross-FRS collision detection globs every FRS in the milestone's `frs/` for `produced_actor:` plus canonical `nodes/actors/index.md`. The canonical ACT file is authored at Phase 2 (plan.md § 3). Strict 0..1 — most FRSs reuse existing actors. Blank when reusing. (R-NEW-2a retired 2026-05-17 — Phase-1-bare ACT body shape no longer applies because ACT is born at Phase 2.)
produces_nodes: []            # new DDD node IDs this FRS introduces *other than* FLW and ACT — covers ENT, CMD, STA, CON, INT, DEC, PERM, QRY plus any NDF-declared custom-type abbreviation registered in the target component's `node_definitions:` (per ADR-039). Claimed at Phase 1, written to canonical at Phase 2 with status: proposed, flipped to active at Phase 3 merge. Phase 2 type-validity HARD-GATE rejects unknown type abbreviations.
touches_nodes: []             # MODIFY-INTENT ONLY. Canonical DDD node IDs (engine-default or NDF-declared) this FRS modifies or extends; modifications captured by the FRS's Phase-1-born CHG (R-CHG-1: non-empty `touches_nodes:` ⇒ one CHG-NNN allocated at Phase 1 alongside the FRS, parallel to `produced_flw:` / `produced_actor:`; allocated by globbing the milestone's `chg/` folder for the next free `CHG-NNN-<slug>.md` filename — R-NEW-9 amended 2026-05-17, the CHG file is the claim, no id-claims.md introduce row written) and applied at Phase 3. Do NOT list a node here for read-only reference — if you want to cite an existing canonical FLW or ACT, name it inline in the FRS body (AC / BR / Brownfield notes). The field is modify-only by author judgment (M2).
adrs: []                      # ADR IDs consulted while drafting (carried from Discovery + dialog)
standards: []                 # STD IDs this FRS consumes (e.g., STD-005); narrowed at Phase 1.5 from sdlc/standards/index.md
ccc: []                       # CCC IDs this FRS cites by category (e.g., CCC-004 Auditing); deviations from these baselines must be filed as ADRs in `adrs:`
stack: []                     # subset of api | ui | test | full-stack | infra | agnostic — canonical enum in sdlc/BOUNDARY.md § Stack axis
framework: []                 # MANDATORY since 2026-05-22 — subset of abp-net | agnostic — canonical enum in sdlc/BOUNDARY.md § Framework axis. Use [agnostic] for framework-independent specs. Phase 1.5 fails on missing (grandfathered for pre-2026-05-22 FRSs).
related_frs: []
from_cr: []                   # CR-NNN IDs — when this FRS was escalated from a CR track; blank otherwise
resolves: []                  # OQ-NNN IDs this FRS closes (most often the OQs the FRS itself surfaced earlier, or pre-existing OQs the FRS finally answers); reciprocal — each OQ's `resolved_by:` cites this FRS
created: YYYY-MM-DD
---

# FRS-NNN: <Title>

## Use case

One paragraph. What does the actor want to accomplish, and why? This FRS
must describe **exactly one user-journey** — one externally observable
behavior the actor can complete end-to-end. CRUD-level decomposition is too
fine; "the whole onboarding experience" is too coarse.

**Trigger:** one sentence — the external event or action that initiates
this operation (e.g., "actor submits the registration form", "scheduled
job fires at 02:00 UTC", "upstream system posts to webhook X"). Never
omitted. Lives as a bold-label line immediately after the use-case
paragraph — not a separate H2 (avoids restating the use case in a
duplicate heading).

## Actors

- ACT-NNN — <role>. ID resolves to either (a) an existing canonical ACT
  this FRS reuses (cite by ID; list in `touches_nodes:` only if this FRS
  modifies it), or (b) the new ACT this FRS introduces — declared in
  `produced_actor:` and authored at Phase 2 with `status: proposed`. The
  ACT-NNN ID is real at the moment this FRS is authored (the
  `produced_actor:` field on this FRS's frontmatter IS the claim per
  R-NEW-9 amended 2026-05-17 — no `id-claims.md` introduce row); the
  file itself materializes at Phase 2 alongside ENT / CMD / STA / etc.
  (R-NEW-2a retired 2026-05-17.)

## Preconditions

- …

## Postconditions

What state is true after the operation completes. Three lines (the third
may be omitted when not applicable):

- **Success:** one line — the durable state change on the happy path.
- **Failure:** one line — what state holds when the operation refuses (no
  partial writes, refusal recorded, etc.).
- **Reversibility:** one line — whether the success state is reversible
  by a later operation in scope, and via which command. Omit when the
  operation is one-shot and reversibility is not in scope.

## Business rules

**Section role — declarative policy claims, each stated once.** This
section is the canonical home for every policy claim the operation
honors. Number inline as `BR-NN`. The journey behavior (in the
Phase-1-born FLW's Scenarios) MAY cite `BR-NN` inline; AC MAY cite
`BR-NN` it verifies — neither MAY restate the BR text. Empty list
allowed when the operation carries no policy beyond the canonical CCCs
already cited in `ccc:`.

A constraint that appears as prose in two or more of Use case / Edge
cases / Business rules / Acceptance criteria is a within-FRS
restatement (see
[`../workflow/frs-validation-rules.md → R-WITHIN-FRS-RULE-RESTATEMENT`](../workflow/frs-validation-rules.md#rule-r-within-frs-rule-restatement)) —
state once here; reference from the others.

- BR-01 — …
- BR-02 — …

## Edge cases

Valid-but-unusual paths that the Phase-1-born FLW's `#happy` Scenario
does not cover but that the FRS author wants to surface at the spec
level (typically because the path has policy implications visible in
acceptance criteria). Number inline as `EC-NN`. Empty list allowed when
no edge cases apply (typical for narrow CRUD-shaped operations).
Distinct from fault paths — fault paths belong in the FLW node's
`#fault` Scenario. The FLW node's `#edge` Scenario is the canonical
home for edge-path behavior; this section is a spec-level summary.

- EC-01 — …
- EC-02 — …

## Notifications

Human-facing side effects the operation emits. One row per recipient
class. State explicit "None" when the operation emits no notifications
— do not omit the heading.

Any non-`In-app` channel (`Email`, `SMS`, `Push`, `Webhook`) implies an
outbound external boundary — declare an `INT-NNN` node in
`produces_nodes:` (new boundary) or cite an existing canonical `INT-NNN`
inline in Behavior / Brownfield notes (consumer-of-existing-INT). The
Phase 1.5 gate enforces this via
[`../workflow/frs-validation-rules.md → Rule: external-boundary-undeclared`](../workflow/frs-validation-rules.md#rule-external-boundary-undeclared).

| Recipient | Trigger | Channel | Reason |
| --------- | ------- | ------- | ------ |
| <role> | <success / failure / state-transition> | <email / sms / in-app / webhook> | <one-line policy justification> |

## Auditability

One-line declaration of the audit obligation for this operation. Heading
is mandatory; body is one of:

- "Cross-cutting concerns apply" — the operation inherits the audit
  baseline from the CCCs in `ccc:` (typically `CCC-004` Auditing) with
  no operation-specific addition.
- One sentence naming an operation-specific audit field or retention
  override, with the CCC ID and (if deviating) the ADR ID back-linked.

## Acceptance criteria

**Section role — testable claims, one per Flow scenario.** Each AC is
observable and testable, and must map to a Flow scenario
(happy / edge / fault) on a real FLW node — either an existing
canonical FLW (cited by ID; listed in `touches_nodes:` only when this
FRS modifies it), or the new FLW declared in `produced_flw:` and born
to canonical at Phase 1 with `status: proposed`. The Phase 1.5
coverage gate verifies every AC maps to a scenario anchor on a real
FLW (R-NEW-3). AC MAY cite the `BR-NN` it verifies; AC MUST NOT
restate the BR text verbatim — verification ≠ duplication.

- [ ] …
- [ ] …

## Brownfield impact

Drafting-time, author-noticed conflicts. Filled during Phase 1 as you write
the FRS.

**When `discovery: inline`**, this section also absorbs the per-FRS Survey
content: list surveyed canonical nodes under "Surveyed surface" below
(replaces the Survey's Existing-nodes-scanned + Relevant-existing-modules
tables); ADRs flow into `adrs:` frontmatter as usual; constraints flow into
the relevant `ccc:` frontmatter + Postconditions; Open questions sub-bullet
below captures OQs raised. No separate survey file is created.

- Modifies: ENT-NNN, FLW-NNN
- Surveyed surface (only when `discovery: inline`): one-line-per-node list
  of canonical nodes scanned and why they're relevant. Mirrors the Survey
  template's Existing-nodes-scanned + Relevant-existing-modules content.
  Omit this sub-bullet when `discovery: <path>` (the external survey carries
  the content).
- Conflicts with existing nodes (must resolve before approval): cite
  the raised `OQ-NNN` for each (`origin: frs-authoring,
  origin_ref: this FRS`). Do not restate the conflict here; the OQ
  file carries the full body.
- Conflicts with existing ADRs (must resolve before approval): cite the
  raised `OQ-NNN` for each. Each conflict either updates the ADR (via
  the supersession procedure) or the FRS is reshaped to honor the ADR.
  Silent absorption is not an option.
- Counterexamples in existing code (existing implementations that contradict
  the assumed pattern). Address them — explain why they're outliers, or
  weaken the assumption. Do not absorb silently.
- New ADRs produced by this FRS (if the dialog surfaced an architectural
  choice): ADR-NNN (`frs_origin: this FRS`).
- Open Questions raised by this FRS: list `OQ-NNN` IDs. The OQ files live
  under `docs/discovery/open-questions/` (template:
  [`../_templates/OPEN-QUESTION.md`](OPEN-QUESTION.md)). Each carries
  `origin: frs-authoring` and `origin_ref: <this FRS ID>`.
- Deviations from a CCC baseline (auth, audit, retention, observability,
  multi-tenancy, exception handling, validation, localization, caching,
  background jobs, distributed events, session, soft-delete, ...): if this
  FRS deviates from any CCC declared in the `ccc:` frontmatter, file the
  deviation as an ADR (which carries `related: [CCC-NNN]`) and list the ADR
  ID here. The CCC baseline stays put; the ADR captures the override. Do
  not absorb deviations as paragraphs in the FRS body. The full CCC roster
  lives at [`docs/shared/ccc/index.md`](../../../shared/ccc/index.md).

## Validation findings

Filled at Phase 1.5 (Validation Gate). Empty table is allowed if every
check fired clean. See [`../workflow/design.md → Phase 1.5`](../workflow/design.md#phase-15--validation-gate)
for the per-FRS and cross-FRS checks that populate this section.

| Finding | Type | Resolution | Rationale |
| ------- | ---- | ---------- | --------- |
|         | existence \| sanity \| adr-conflict \| standard-conflict \| ccc-deviation \| chg-sanity \| cross-frs | resolved \| deferred |  |

Each unresolved (`resolution: deferred`) finding cites the raised
`OQ-NNN` in its Rationale column. The OQ file under
`docs/discovery/open-questions/` carries the full body with
`origin: validation-gate, origin_ref: <this FRS>`. The finding text is
not duplicated into the OQ; reference by ID.

## Out of scope

- …
