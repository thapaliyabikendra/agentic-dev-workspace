---
name: test-plan-ingest
description: "Use after the generate-feat-spec FS validation loop passes (zero Blockers, zero Majors). Ingests TC files for every FRS use case, sets the FS test_plan_path frontmatter, and fills the FRS test-plan-view table. Runs as the first flow of the QA track — independent of plan.md's session."
applies_when:
  stack: [agnostic]
---

# Test Plan Ingest

Test plan ingest is the second part of Phase 2. It drafts TC files for every use case in
the FS's FRS set, traced to FLW scenario anchors and FRS acceptance criteria, and updates
the FS and FRS frontmatter to record the test plan. It is the first flow of the **QA track** — runs as an independent session after `plan.md` exits its validation loop (zero Blockers, zero Majors). Load FS + FRS + FLW + ENT context fresh; do not rely on residual `plan.md` session state.

<HARD-GATE>
Do NOT begin until:
1. The FS validation loop in [`plan.md`](plan.md) has passed (zero Blockers, zero Majors).
2. Every FLW node referenced by this FS's FRS scope (whether FRS-introduced at Phase 1
   via the FRS's `produced_flw:` scalar or pre-existing canonical) has all three scenarios
   (happy / edge / fault) filled AND is Phase-2-wired (`related:` populated, Sequence
   filled — per R-NEW-8 discriminator; the `created_under: pre-2026-05-17` audit marker
   exempts a grandfather FLW from the body-shape discriminator). The entry contract from
   `plan.md` (FS validation passed) already implies Phase-2-wired; this gate restates it
   for defense-in-depth.
3. Every new ENT node introduced by this FS carries field-level constraints (required,
   max length, format, uniqueness, FK, cascade, enum/lookup, multi-tenancy, concurrency).
</HARD-GATE>

---

## Traceability chain

The test artifacts form a three-link chain from behavioral spec to
executable code:

```
FLW-NNN#happy / #edge / #fault   (behavioral spec, canonical wiki)
        ↓ Traces to:
TC-NNN-<slug>.md                 (test case, FS-staged at Phase 2)
        ↓ generate-test-suite
<use-case>.<ext>                  (test spec, tests/ folder at Phase 3)
```

- **FLW nodes are the behavioral source of truth.** Scenarios live as
  named anchors (`#happy`, `#edge-N`, `#fault-N`) inside the canonical
  FLW node body and are referenced — never restated — by TCs via their
  `**Traces to:**` line. (The FRS Test plan view table is retired per
  2026-05-17 cutover; reverse trace is regenerable via `grep` on TC
  `Traces to:` lines.)
- **TC files are the executable interpretation.** Drafted at Phase 2
  under each FS's `test-plans/<use-case>/` folder. Each TC's
  `**Traces to:**` line carries both FRS-side IDs (`AC-NN`, `Matrix:
  <row>`) AND FLW-side scenario anchors (`FLW-NNN#happy`,
  `FLW-NNN#edge-N`, `FLW-NNN#fault-N`). The dual trace makes coverage
  auditable from both directions.
- **Test specs are disposable artifacts.** Generated from TC files at
  Phase 3 ([`test-suite-codegen.md`](test-suite-codegen.md)) and landed in
  `tests/{test_dir}/<feature>/` on the FS's implementation branch.
  Hand edits to spec files are lost on regeneration — fix the TC,
  regenerate.

**TC files do not participate in the tiered touch.** They stay
milestone-scoped (no canonical promotion at Phase 3 merge); no
`docs/test-plans/index.md` or `log.md` exists. The FS's `## Test plan`
section IS the TC index for that FS.

**Two workflow references support this chain:**

- [`test-data-generation.md`](test-data-generation.md) — recipe for the
  `## Test Data` section in every TC; directive vocabulary that crosses
  the Phase 2 → Phase 3 boundary (`violatesMaxLength(N)`, `duplicate(value)`,
  `{timestamp}`, `{uuid}`).
- [`test-runner-cookbook.md`](test-runner-cookbook.md) — recipe for Phase 3
  codegen; action-inference table, selector resolution, value substitution,
  full spec file template, mandatory `createdRecords + afterEach` cleanup
  pattern.

These two refs are wholesale-read during their respective operations
(this file reads `test-data-generation.md`; Phase 3 Test suite codegen reads
both). They are peers of [`frs-validation-rules.md`](frs-validation-rules.md)
and [`frs-code-extraction-rules.md`](frs-code-extraction-rules.md).

---

## Overview

**Operation:** `generate-test-plan`
**Mode:** **Ingest** — first flow of the QA track. Runs in its own session after `plan.md` exit; no shared session with `plan.md`.

**Inputs:**
- Every FRS in the FS's `frs:` list.
- Every FLW node referenced by this FS — both the FRS-introduced FLW at Phase 1 (declared
  in each FRS's `produced_flw:` scalar, at `docs/<component>/nodes/flows/FLW-NNN-<slug>.md`
  with `status: proposed`, Phase-2-wired by the time this flow runs) and any existing
  canonical FLW listed in the FRSs' `touches_nodes:`.
- Every new ENT node introduced by this FS (data-model fact sheet source; Phase-2-born).
- The Coverage Matrix ([`coverage-matrix.md`](coverage-matrix.md)).
- [`test-data-generation.md`](test-data-generation.md) — rule book for the
  `## Test Data` section in each TC file.

**Outputs:**
- TC files at
  `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/test-plans/<use-case>/TC-NNN-<slug>.md`
  drafted from [`../_templates/TC.md`](../_templates/TC.md).
- The FS's `test_plan_path:` frontmatter set to `test-plans/`.
- The FS's `## Test plan` section populated, grouped by use-case sub-folder.
- TC files themselves at the milestone path serve as the TC ID ledger
  (R-NEW-9 amended 2026-05-17 — no `id-claims.md` introduce rows for TC).
- (Retired) The FRS's `## Test plan view` table is no longer populated — the
  table was dropped 2026-05-17. TC coverage trace lives on each TC's
  `**Traces to:**` line; reverse-index is a `grep` against TC files.

**TC files stay milestone-scoped.** No promotion to canonical at Phase 3 merge. No
per-type `index.md` / `log.md` pair. The FS's `## Test plan` section is the sole index.

---

## When to Use

**Use when:** the FS validation loop in `plan.md` has passed (zero Blockers, zero Majors)
and all FLW nodes have their three scenarios filled.

**Do NOT use when:** the FS validation loop has not yet passed, FLW nodes are missing
scenarios, or ENT nodes are missing field-level constraints — complete those prerequisites
first, then return here.

**Vs. plan.md:** `plan.md` authors the FS and ingests canonical nodes. This file ingests
the test plan for that FS. It is the first flow of the QA track — runs in its own session
after `plan.md` exits its validation loop; no shared session with `plan.md`.

---

## Checklist

Scan-level gate before diving into The Process. All seven must hold before the user-review
handoff.

1. Every FRS acceptance criterion in the FS's `frs:` list traces to at least one TC via
   the TC's `**Traces to:**` line.
2. Every canonical FLW scenario (happy / edge / fault) traces to at least one TC.
3. Every applicable Coverage Matrix row is covered or explicitly marked N/A.
4. Every TC has `**Traces to:**` with both FRS-side AC-IDs and FLW-side scenario anchors.
5. Every TC has a `## Test Data` section per `test-data-generation.md` — including
   verification self-checks.
6. Every TC has `Preconditions` and `Postconditions`.
7. Each emitted TC has a unique TC-NNN filename across the milestone's
   `specs/**/test-plans/**` glob (R-NEW-9 amended 2026-05-17 — TC files
   themselves are the ledger; no `id-claims.md` introduce row); the FS's
   `test_plan_path:` frontmatter is set to `test-plans/`.

---

## The Process

### 1. TC ID and naming setup

- **TC IDs are globally unique** across the milestone. Increment from the highest TC ID
  across the milestone's `specs/**/test-plans/**/TC-*.md` glob (R-NEW-9 amended
  2026-05-17 — TC files are the ID ledger; no `id-claims.md` introduce row written).
  Filename: `TC-NNN-<slug>.md`. Header line: `# TC-NNN: <Title> (<Category>)`.
- The TC's `**Tags:**` line carries `@smoke @<feature> @TC-NNN` — the feature tag is the
  kebab-case FS slug, used by the test runner for feature-tag filtering at run time.
- TC IDs are **sequential across the entire feature** (across all use-case sub-folders),
  not per sub-folder. Pass-0 (section-walkthrough) TCs come first; Pass-2
  (matrix-driven) TCs follow.
- (R-NEW-9 amended 2026-05-17 — TC IDs are NOT recorded in
  `id-claims.md`. The TC file at its milestone path IS the claim.)

**Use-case sub-folder vocabulary.** Sub-folders carry kebab-case verbs:
`display`, `view`, `preview`, `add`, `edit`, `delete`, `toggle`, `reorder`, `search`,
`export`, `bulk`, `workflow`, `auth`, `navigation`. Only create sub-folders for verbs
this FS actually exercises — empty folders are a smell.

**Verify:** every TC ID is unique across sibling TC files in the milestone
(`specs/**/test-plans/**/TC-*.md` glob). Filenames match `TC-NNN-<slug>.md`.

**On failure:** if a TC ID collides with a sibling FS, increment past the collision.
Rename the TC file with the new ID.

---

### 2. Data-model fact sheet

Build the fact sheet from the scoped Entity nodes in this FS
(`docs/<component>/nodes/entities/ENT-NNN-<slug>.md`). For each entity, record:

- **Required fields** — declared in `Invariants` or `Properties`, or via
  `[Required]` / `NOT NULL`.
- **Length caps** — `[StringLength(N)]`, `varchar(N)`.
- **Uniqueness constraints** — declared unique indexes or stated invariants.
- **Format constraints** — typed properties (email, URL, decimal, date), regex validators.
- **Foreign-key relationships** — navigation properties declared in the node.
- **Authorization rules** — declared via `Permissions` references (PERM-NNN nodes),
  `[Authorize]` patterns, or stated in the FRS.
- **Cascade / dependency rules** — `OnDelete(...)` stated in the node.
- **Numeric ranges** — `[Range(min, max)]` or stated bounds.
- **Multi-tenancy markers** — a tenant-scope interface or attribute declared in the node,
  or stated as a tenant-scoped invariant.
- **Concurrency markers** — the optimistic-concurrency token declared in the persistence
  ADR. Skip only when the node explicitly disables it.
- **State machine / workflow** — references to STA-NNN nodes.
- **Cross-field rules** — comparison rules, conditional required, sum/total constraints.

Record genuinely-absent facts explicitly (e.g. "no length cap on Notes field") so the
Coverage Matrix knows to skip the corresponding row.

**Verify:** every ENT node in scope has a complete row in the fact sheet. Absent facts
are noted, not omitted silently.

**On failure:** if an ENT node is missing a constraint, check the FRS. If the FRS
specifies it, add it to the ENT node (it's Phase 2 proposed — still editable). If the
FRS is silent, raise it as a Minor finding.

---

### 3. Section walkthrough (FRS → TCs)

Walk each FRS section in the FS in the order your project's FRS template defines. For
each section:

**1. Scope section** — context only; no TCs.

**2. FLW Scenarios + FRS Business rules + FRS Edge cases** — journey
behavior lives on the Phase-1-born FLW (Trigger + happy / edge / fault
Scenarios); the FRS Business rules and Edge cases sections carry the
policy-level summary. Walk every observable condition across both:

- **Happy path TC** — one per primary success flow. Tag `@smoke`. Priority High. Traces
  to the AC-IDs from the Acceptance criteria section that map to the flow + the scoped
  `FLW-NNN#happy` anchor.
- **Alternative-path TCs** — one per alternative behavior surfaced in the FLW's `#edge`
  Scenario or the FRS Edge cases section. Traces to relevant AC-IDs and the
  `FLW-NNN#edge-N` anchor.
- **Exception TCs** — one per failure / error condition the FLW's `#fault` Scenario
  names. Traces to the AC-ID asserting the observable failure outcome and the
  `FLW-NNN#fault-N` anchor.
- **Negative-property TCs** — for SHALL-NOT / read-only / "no input fields" / "no
  submission controls" statements surfaced in the FRS Business rules section, emit a
  dedicated **Guard TC** that explicitly asserts absence. Negative properties are NEVER
  covered by the happy-path TC.

**3. Acceptance criteria section** — every AC-ID must trace to at least one TC. Pure
restatements of flow steps are typically already covered by the happy-path TC — note the
trace, do not duplicate.

**4. Preconditions section** — feeds the Preconditions section of every TC; not its own
TC source. The current user's role, tenant, and required pre-existing data come from here.

**5. Out-of-scope section** — items here are NOT test targets. If an out-of-scope item
could plausibly appear as a defect (e.g. an annotation tool that should NOT exist in a
read-only modal), emit at most one low-priority **Guard TC** asserting its absence —
label it `(Guard)`.

**6. Scoped FLW nodes** — the `#happy`, `#edge-N`, `#fault-N` anchors are the canonical
scenario IDs the TC's `Traces to:` line must reference. If a scenario in the FLW node
has no TC by the end of the walkthrough, emit a TC for it OR record the gap as a Blocker.

**7. Cross-FRS scope notes** — when the FRS references a CCC baseline
(declared in the FRS's `ccc:` frontmatter) that drives test surface
(auth, session, retention, audit, localization), check the Coverage
Matrix for matching rows.

**Open Questions.** OQs are first-class artifacts under `docs/discovery/open-questions/`
as `OQ-NNN-<slug>.md` files — not inline in the FRS or FS body. If a TC depends on an
unresolved OQ, prefix the TC title with `PENDING — OQ-NNN —` (the real OQ ID) and cite
the OQ in `## Postconditions`. The resolving artifact's `resolves: [OQ-NNN]` makes the
link reciprocal.

**Verify:** every FRS section has been walked. Every AC-ID traces to at least one TC.
Every FLW scenario anchor (`#happy`, `#edge-N`, `#fault-N`) has at least one TC.

**On failure:** if a FLW scenario has no TC, emit one. If an AC-ID has no TC, trace it
or emit a Guard TC. Record unresolvable gaps as Blocker findings.

---

### 4. Coverage Matrix check

Consult [`coverage-matrix.md`](coverage-matrix.md) for the test-type checklist by
use-case category (Display / Create / Update / Delete / etc.). The matrix is guidance,
not a mandatory floor — see that file's preamble.

Cross-check the emitted TC set against the applicable matrix rows. For each row:
- **Covered** — TC exists and traces to the row.
- **N/A** — the fact sheet explicitly records the absence of the relevant constraint.
- **Gap** — a test type applies but no TC covers it; emit the TC or record as a Minor.

**Verify:** every applicable Coverage Matrix row is either covered or explicitly marked
N/A in the data-model fact sheet.

---

### 5. Steps, Test Data, and Traces to

**Steps** — table format from [`../_templates/TC.md`](../_templates/TC.md):
`#`, `Step`, `Selector`, `Expected Result`.

- One atomic user action per step. 2–10 steps per TC; split if longer.
- Selectors: `n/a` for navigation/page-level steps; `(discovered by explorer)` for
  element steps; **never invent** a concrete selector at Phase 2.
- Verify Test Data per the verification rules in
  [`test-data-generation.md → Verification rules`](test-data-generation.md#verification-rules-ingest-self-checks)
  before emitting the file.

**Selector posture.** Every TC's `Selector` column is **`(discovered by explorer)`** at
Phase 2. The workflow drives test plan ingest from the FRS and scoped nodes — not from
existing UI code. Concrete selectors land at Phase 3 (Test suite codegen) when the
developer runs an explorer pass against the implemented UI.

The honest-failure model applies: a `(discovered by explorer)` placeholder that survives
into Phase 3 will be flagged and skipped by codegen. The fix is to resolve the selector
against the real DOM, update the TC, and regenerate — not to invent a `data-testid` that
looks plausible.

**Test Data** — populate `## Test Data` per [`test-data-generation.md`](test-data-generation.md).
`### Pre-existing State` is omitted when no DB state is needed; `### Form Input` is
omitted when no fill/select/toggle steps exist.

**Traces to** — the TC header's `**Traces to:**` line MUST include both:

- **FRS-side IDs** — `AC-NN` from the FRS Acceptance criteria section; `Matrix: <row
  name>` for matrix-driven TCs.
- **FLW-side scenario anchors** — `FLW-NNN#happy`, `FLW-NNN#edge-N`,
  `FLW-NNN#fault-N` for the canonical FLW scenario this TC exercises.

The dual trace makes coverage auditable from both directions: from the FRS (does every
AC have a TC?) and from the FLW (does every scenario have a TC?).

**Verify:** every TC has a populated `Traces to:` line with both FRS-side IDs and FLW
anchors. No TC has all-`(discovered by explorer)` selectors AND all-empty Form Input —
these are unimplementable.

**On failure:** if a TC is missing a FLW anchor, find the relevant FLW node scenario and
add the anchor. If a TC has no Form Input and no navigation steps, it needs rework or
removal.

---

### 6. Exit checklist

- [ ] Every FRS acceptance criterion in the FS's `frs:` list traces to at least one TC.
- [ ] Every canonical FLW scenario (happy / edge / fault) traces to at least one TC.
- [ ] Every applicable Coverage Matrix row is covered or explicitly marked N/A.
- [ ] Every TC has a resolved `**Traces to:**` line (no empty traces).
- [ ] Every TC has a populated `## Test Data` section per `test-data-generation.md` —
      including the verification self-checks.
- [ ] Every TC has `Preconditions` and `Postconditions` (even if Preconditions is just
      "User is logged in").
- [ ] No TC exceeds 10 steps.
- [ ] No TC has all-`(discovered by explorer)` selectors AND all-empty Form Input.
- [ ] Each emitted TC has a unique TC-NNN filename across the milestone's
      `specs/**/test-plans/**/TC-*.md` glob (R-NEW-9 amended 2026-05-17 —
      the TC file is the claim; no `id-claims.md` introduce row).
- [ ] The FS's `test_plan_path:` frontmatter is set to `test-plans/`.
- [ ] The FS's `## Test plan` section lists every emitted TC, grouped by use-case
      sub-folder.
- [ ] (Retired) FRS Test plan view table — not applicable for FRSs authored
      against the post-2026-05-17 template. Skip this row; the trace lives on
      each TC's `**Traces to:**` line.

Once this checklist passes, run the user-review handoff before the context reset for
Phase 3.

---

## Common Mistakes

**❌ Inventing concrete selectors at Phase 2** — selectors require the real DOM, which
doesn't exist yet.
**✅ Always write `(discovered by explorer)`** — resolve against the real DOM at Phase 3.

**❌ Covering a SHALL-NOT or read-only assertion inside the happy-path TC** — absence
cannot be verified as a side-effect of a success flow.
**✅ Emit a dedicated Guard TC** that explicitly asserts the absence of the prohibited
element or behavior.

**❌ Numbering TCs per sub-folder** (restarting at TC-001 for each folder) — breaks
global ID uniqueness across the milestone's TC-file glob.
**✅ TC IDs are globally sequential** across the entire feature, regardless of sub-folder.

**❌ Leaving `test_plan_path:` blank after TC files are emitted** — the FS's Integration
section becomes non-navigable for Phase 3.
**✅ Fill `test_plan_path: test-plans/`** before handing off to the user.

**❌ Emitting a TC for an out-of-scope item without marking it as a Guard** — creates
test coverage for something the FRS explicitly excludes.
**✅ Out-of-scope items get at most one Guard TC** labeled `(Guard)` asserting absence;
most out-of-scope items get no TC at all.

---

## Red Flags

**Never:**
- Invent concrete selectors — `(discovered by explorer)` is the only valid placeholder
  at Phase 2
- Cover a SHALL-NOT or "no input fields" property in a happy-path TC — emit a Guard TC
- Emit TCs before the FS validation loop passes (plan.md exit gate)
- Create empty use-case sub-folders
- Leave `test_plan_path:` blank after TC files are written
- Re-use a TC ID from a sibling FS or milestone

---

## Integration

- **Required before:** [`plan.md`](plan.md) (`generate-feat-spec`) — the FS validation
  loop must pass (zero Blockers, zero Majors) before this operation begins.
- **Track:** First flow of the QA track. Runs in its own session; a `/clear` separates it from `plan.md`.
- **Rule books wholesale-read during this flow:**
  [`coverage-matrix.md`](coverage-matrix.md) (test-type checklist by use-case category),
  [`test-data-generation.md`](test-data-generation.md) (`## Test Data` section rules and
  verification self-checks).
- **Required after:** user-review handoff. The dev track continues at `implementation.md` (Phase 3 Merge + Code) in a fresh session. The QA track's next flow (`test-suite-codegen.md`) runs after implementation is complete, in its own QA-track session.
- **Sibling flow files:** [`plan.md`](plan.md), [`design.md`](design.md),
  [`implementation.md`](implementation.md), [`test-suite-codegen.md`](test-suite-codegen.md),
  [`qa-gate.md`](qa-gate.md).
