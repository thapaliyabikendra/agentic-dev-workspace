---
id: FRS-NNN
title: <One-sentence user-journey, imperative voice>
status: draft                 # draft | reviewed | approved | implemented
milestone: M-NN               # filled at Phase 0 — milestone is authored first (blank for CR track)
cr:                           # filled at Phase CR-0 — CR-NNN for CR track (blank for milestone track; mutually exclusive with milestone:)
discovery: ../discovery/FRS-NNN-<slug>.md
touches_nodes: []             # canonical DDD node IDs this FRS modifies or extends; modifications captured by the FS's CHG and applied at Phase 3
produces_nodes: []            # new DDD node IDs this FRS introduces; written directly to canonical at Phase 2 with status: proposed; flipped to active at Phase 3 merge
adrs: []                      # ADR IDs consulted while drafting (carried from Discovery + dialog)
standards: []                 # STD IDs this FRS consumes (e.g., STD-005); narrowed at Phase 1.5 from sdlc/standards/index.md
ccc: []                       # CCC IDs this FRS cites by category (e.g., CCC-004 Auditing); deviations from these baselines must be filed as ADRs in `adrs:`
stack: []                     # subset of api | ui | test | full-stack | infra | agnostic — canonical enum in sdlc/BOUNDARY.md § Stack axis
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

- ACT-NNN — <role> (if canonical); or "new actor, will be introduced as
  ACT-NNN in canonical at Phase 2 with status: proposed"

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

## Behavior

Describe the user-journey behaviorally. Reference existing canonical nodes
where they apply (ENT-NNN, CMD-NNN, FLW-NNN). Detailed behavior belongs in
the canonical nodes themselves (existing nodes, or new nodes written
directly to canonical at Phase 2 with `status: proposed` for the IDs in
`produces_nodes`), not duplicated here.

## Business rules

Policy rules that govern the operation, distinct from acceptance criteria
(ACs are testable claims; BRs are the policy the ACs verify). Number
inline as `BR-NN`. Empty list allowed when the operation carries no
policy beyond the canonical CCCs already cited in `ccc:`.

- BR-01 — …
- BR-02 — …

## Edge cases

Valid-but-unusual paths that the happy-path Behavior section does not
cover. Number inline as `EC-NN`. Empty list allowed when no edge cases
apply (typical for narrow CRUD-shaped operations). Distinct from fault
paths — fault paths belong in the FLW node's `#fault` scenario.

- EC-01 — …
- EC-02 — …

## Notifications

Human-facing side effects the operation emits. One row per recipient
class. State explicit "None" when the operation emits no notifications
— do not omit the heading.

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

Observable, testable. Each must map to a Flow scenario (happy / edge / fault)
in the relevant FLW node — either an existing canonical FLW, or a new FLW
written to canonical at Phase 2 with `status: proposed`.

- [ ] …
- [ ] …

## Test plan view

A view onto the Flow nodes' scenarios — **never restate them here.** List
each Flow this FRS produces or touches, the IDs of the three scenarios
that cover it, and (after Phase 2 Test plan ingest) the TC IDs that
verify each scenario.

The TC ID columns are filled at Phase 2 by
[`../workflow/plan.md → Test plan ingest`](../workflow/plan.md#test-plan-ingest-after-fs-validation);
the spec files are generated at Phase 3 by
[`../workflow/test-suite-codegen.md`](../workflow/test-suite-codegen.md).
Both operations consume FLW scenario anchors via the TC's `Traces to:`
line — that is the source-of-truth link between this FRS, the FLW node
scenarios, and the TC files. FLW nodes remain the behavioral spec; TCs
are the executable interpretation.

| Flow | Happy | Edge | Fault | Happy TCs | Edge TCs | Fault TCs |
| ---- | ----- | ---- | ----- | --------- | -------- | --------- |
| FLW-NNN | FLW-NNN#happy | FLW-NNN#edge | FLW-NNN#fault |  |  |  |

**TC columns are filled at Phase 2, not Phase 1.** At Phase 1 authoring
time the TC columns are empty placeholders; the test plan ingest writes
them after the FS validation loop passes. Existing FRSs authored before
this template change are not retrofitted — the columns simply stay
empty on those.

**Coverage gate fires at Phase 2 exit, not Phase 1 exit.** At Phase 1
authoring time, FLW IDs for `produces_nodes` are *claims* — the node
doesn't exist yet; it will be written to canonical at Phase 2 Ingest with
`status: proposed`. The Phase 1.5 QA-hat check is forward-looking: "can
each scenario be expressed as a testable assertion?", not "is it written
down?" The actual existence check — that every cell points to a real
`FLW-NNN#happy`/`#edge`/`#fault` anchor — runs against the proposed
canonical FLW node at Phase 2 exit (when it has been ingested), and again
after Phase 3 merge flips it to `active`.

For `touches_nodes` references that point at existing canonical FLWs, the
anchors already exist — check them now. For `produces_nodes` claims, fill
the IDs intentionally; the canonical node (status: proposed) will have to
match at Phase 2.

## Brownfield impact

Drafting-time, author-noticed conflicts. Filled during Phase 1 as you write
the FRS.

- Modifies: ENT-NNN, FLW-NNN
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
|         | existence \| sanity \| adr-conflict \| standard-conflict \| ccc-deviation \| cross-frs | resolved \| deferred |  |

Each unresolved (`resolution: deferred`) finding cites the raised
`OQ-NNN` in its Rationale column. The OQ file under
`docs/discovery/open-questions/` carries the full body with
`origin: validation-gate, origin_ref: <this FRS>`. The finding text is
not duplicated into the OQ; reference by ID.

## Out of scope

- …
