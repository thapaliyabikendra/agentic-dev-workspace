---
name: design-phase1-authoring
description: "Detail file of design.md Phase 1 — full FRS+FLW+CHG authoring procedure: entry paths A/B/C, the six steps, FRS declaration contract, ACT claim mechanics, dialog discipline. Load when authoring FRSs."
applies_when:
  stack: [agnostic]
---

# Phase 1 detail — FRS authoring procedure

> Detail file of [`design.md`](../design.md) (Phase 0/1/1.5 flow). Load when
> authoring FRSs for the first time in a session. The core file's HARD-GATE
> and Phase 1 exit checklist are the binding gates.

## ACT-NNN claim mechanics

**ACT-NNN is NOT born at Phase 1.** When the FRS introduces a new actor role
(`produced_actor:` is set), the ACT-NNN ID is **claimed** via the FRS
frontmatter `produced_actor: ACT-NNN` field (R-NEW-9 amended 2026-05-17 —
the FRS frontmatter IS the authoritative claim; no `id-claims.md` introduce
row is written). The canonical ACT file is authored at Phase 2 alongside
ENT / CMD / STA / etc. — see [`plan.md § 3`](../plan.md#3-new-node-canonical-ingest--phase-1-born-flw-enrichment).
The FRS body cites `produced_actor: ACT-NNN` as a forward reference (real ID,
no file yet) — parallel to the way `produces_nodes:` entries are claimed.
**Cross-FRS ACT-NNN collision detection at allocation:** glob every FRS in
the milestone's `frs/` folder for `produced_actor:` and pick the next free
ID above both that ceiling and the canonical `nodes/actors/index.md` ceiling.
R-NEW-2a retired 2026-05-17 — Phase-1-bare ACT body shape no longer applies
because there is no Phase-1 ACT body. Cross-FRS duplicate-actor detection at
Phase 1.5 is explicitly dropped (accepted trade-off — surfaces at Phase 2 FS
authoring when both FSs claim the same actor name in `produces_nodes:` /
`produced_actor:`).

## Templates and load posture

**Templates loaded at Phase 1 entry:** [`../../_templates/FRS.md`](../../_templates/FRS.md),
[`../../_templates/nodes/FLOW.md`](../../_templates/nodes/FLOW.md), and
[`../../_templates/nodes/CHANGE.md`](../../_templates/nodes/CHANGE.md) (the last
when any FRS in this session declares non-empty `touches_nodes:` — pure-
addition FRSs do not load CHANGE.md). The FLOW and CHANGE templates carry
phase-keyed authoring notes — Phase 1 authors only the Phase-1 sections; the
Phase-2 sections (Sequence, Branches, Compensating actions, structural
Postconditions, Decisions on FLW; structural before/after on `modifies[]`,
`adds[]`, `migration_steps[]` on CHG) are gated by inline notes and stay
unauthored at Phase 1. ACTOR.md is loaded at Phase 2 (plan.md), not here.

**STD / CCC narrow-load posture stays Phase 1.5+.** Phase 1 FRS + FLW
authoring uses business language only; STDs and CCCs are not narrow-loaded
here. The Phase 1.5 Pass 1 STD-conformance and CCC-deviation scans are where
the index narrow-loads fire.

## The six steps (per user-journey)

1. Choose entry path:
   - **Path A (default, external survey):** Author the per-FRS discovery at
     `docs/milestones/M-NN-<slug>/discovery/FRS-NNN-<slug>.md` using
     [`../../_templates/SURVEY.md`](../../_templates/SURVEY.md) with
     `level: frs`. Survey scopes discovery; OQs surface during this step.
     Set `discovery: ../discovery/FRS-NNN-<slug>.md` on the FRS frontmatter.
   - **Path B (scope known, external survey):** Create an FRS skeleton at
     `docs/milestones/M-NN-<slug>/frs/FRS-NNN-<slug>.md` (frontmatter +
     scope paragraph + `produces_nodes` + `touches_nodes` only), then
     author the per-FRS Survey bounded by the skeleton's declared nodes.
     Use Path B only when `touches_nodes` and `produces_nodes` can be
     filled completely from the canonical node indexes
     (`docs/<component>/nodes/<type>/index.md`) **before** any discovery
     dialog — i.e., every node ID is already known and confirmed against
     the index. If any node scope is still being negotiated with the
     user, use Path A.
   - **Path C (inline survey for simple FRSs):** Set `discovery: inline`
     in the FRS frontmatter. No separate file at `discovery/FRS-NNN-<slug>.md`
     is created. The survey's node-scan content (Existing-nodes-scanned +
     Relevant-existing-modules) is absorbed into the FRS's "Brownfield
     impact → Surveyed surface" sub-bullet; ADRs flow into `adrs:`
     frontmatter as usual; OQs still surface to
     `docs/discovery/open-questions/` (the OQ files are workflow-level,
     not survey-level). **Use Path C when** the FRS is narrow — typically
     pure-addition new-feature, or single-node change-request — and a
     separate survey file would be less than one screen of content. **Do
     NOT use Path C when** `kind: absorb-legacy-doc` applies (absorption
     surveys are workspace-level and always external) or when the survey
     would carry ≥ 1 OQ with `gate_effect: blocking` (the OQ file flow
     handles those independently, but the survey's narrative scope is
     needed for resolution).
2. Classify OQs from the Survey using the 4-tier table in
   [`research.md`](../research.md) (load when ≥1 OQ requires tier-classification;
   skip entirely when no Survey OQs exist). If any OQ is `blocking-frs`, invoke
   the `research-gate` operation in [`research.md`](../research.md) before
   authoring the FRS body. If no OQ is `blocking-frs`, proceed directly
   to step 3.
3. Author the complete FRS at
   `docs/milestones/M-NN-<slug>/frs/FRS-NNN-<slug>.md` using
   [`../../_templates/FRS.md`](../../_templates/FRS.md) (Path A), or complete
   the FRS body sections on the existing skeleton (Path B). If the
   user-journey directly answers a pre-existing `OQ-NNN`, populate the
   `resolves:` frontmatter at draft time — don't defer it to the exit
   checklist.
4. **Author the Phase-1-born FLW** at `docs/<component>/nodes/flows/FLW-NNN-<slug>.md`
   using [`../../_templates/nodes/FLOW.md`](../../_templates/nodes/FLOW.md). Phase-1
   body shape: Trigger (Actor: ACT-NNN — no `Initiating command:` line) +
   Scenarios (happy / edge / fault, Given/When/Then, business language only —
   no ENT/CMD/STA IDs) + Brownfield notes (optional). `related: []`. Status
   `proposed`. Per R-NEW-2. 2-file touch: FLW file + `nodes/flows/index.md`.
   Allocate the FLW-NNN ID from `docs/<component>/nodes/flows/index.md` —
   the per-type canonical index is the FLW ID ceiling (R-NEW-9 amended
   2026-05-17 — no `id-claims.md` introduce row written; the index row
   created by the 2-file touch IS the claim).
5. **Author the Phase-1-born CHG** at `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md`
   (CR track: `docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md`)
   using [`../../_templates/nodes/CHANGE.md`](../../_templates/nodes/CHANGE.md) —
   **only when the FRS declares non-empty `touches_nodes:`** (R-CHG-1). One
   CHG per FRS (parallel to `produced_flw:` / `produced_actor:` scalar
   shape). Phase-1 body shape: behavior-language `modifies[]` entries
   (business language only — no ENT/CMD/STA/PERM-NNN IDs in before/after,
   no Sequence step numbers, no structural detail; same discipline as
   FLW Scenarios and ACT Preconditions); optional milestone-level
   `invariants_before` / `invariants_after`; optional `removes[]` /
   `supersedes[]` when the FRS explicitly retires. `adds[]`,
   `migration_steps[]`, and structural before/after on `modifies[]` stay
   empty at Phase 1 — they fire at Phase 2 FS enrichment. Status `draft`.
   `source_ref: [{frs: FRS-NNN, op: modify}]`. Per R-CHG-1..4. Allocate
   the CHG-NNN ID by globbing the milestone's `chg/` folder for the next
   free `CHG-NNN-<slug>.md` filename (R-NEW-9 amended 2026-05-17 — the
   CHG file itself is the claim; no `id-claims.md` introduce row is
   written). 1-file touch on the CHG file (CHG has no per-type
   `index.md` today per row-12 gap note). When the FRS's
   `touches_nodes:` is empty (pure-addition FRS), skip this step.

   **ACT-NNN ID claim (when `produced_actor:` is set).** Even though the
   ACT file is authored at Phase 2, the ACT-NNN ID is claimed at Phase 1
   via the FRS frontmatter `produced_actor: ACT-NNN` field — R-NEW-9
   amended 2026-05-17, the FRS frontmatter IS the authoritative claim;
   no `id-claims.md` introduce row is written. This reserves the ID
   against sibling FRSs: cross-FRS collision detection globs every FRS
   in the milestone's `frs/` for `produced_actor:` plus the canonical
   `nodes/actors/index.md` ceiling. When `produced_actor:` is blank
   (FRS reuses an existing ACT), no claim is made; cite the existing
   ACT-NNN in the FRS Actors section by ID.
6. Append the FRS ID to the milestone portal's `frs:` frontmatter and to its
   "FRSs in this milestone" section.

## FRS declaration contract

Each FRS must:

- Cover one user-journey, independently testable.
- Reference its per-FRS discovery note.
- Declare `produced_flw:` — the FLW-NNN this FRS introduces (scalar; real
  because the FLW is authored alongside the FRS at Phase 1). Blank only when
  no new FLW is introduced (rare; usually a `touches_nodes:`-only FRS).
- Declare `produced_actor:` — the ACT-NNN this FRS introduces when it
  introduces a new actor role (scalar; forward reference because the ACT
  file is authored at Phase 2, but the ID is claimed at Phase 1 in the
  FRS frontmatter itself — R-NEW-9 amended 2026-05-17). Blank when
  reusing an existing actor.
- Declare `produces_nodes:` — new node IDs this FRS intends to introduce
  at Phase 2 Ingest (ENT / CMD / STA / CON / INT / DEC / PERM / QRY only;
  FLW and ACT are covered by `produced_flw:` / `produced_actor:`).
- Declare `touches_nodes:` — existing canonical nodes this FRS modifies
  (modify-intent only; read-only references to existing FLW / ACT go in
  the FRS body prose, not here).
- Declare `adrs:` — the ADR IDs consulted while drafting. Carries forward
  from the discovery's "Relevant ADRs scanned" plus any ADR that surfaces
  during the dialog.
- Declare `standards:` — the STD IDs whose rules the FRS consumes. Scan
  [`../../standards/index.md`](../../standards/index.md) at draft time;
  narrow-load each STD whose `applies_when.stack:` intersects this FRS's
  declared `stack:`. Engine-universal rules (those tagged `agnostic`) apply
  by default — list them when the FRS's behavior depends on a specific
  rule.
- Declare `ccc:` — the CCC-NNN IDs from
  [`../../../docs/shared/ccc/index.md`](../../../docs/shared/ccc/index.md) whose
  baselines this FRS cites or relies on. Each CCC is cited by category
  reference; do not restate the baseline in the FRS body. Operation-specific
  deviations from a CCC are filed as ADRs (which carry
  `related: [CCC-NNN]`) and listed in the FRS's "Brownfield impact" section.

The FRS describes the use case behaviorally but does **not** duplicate node
or ADR content. If existing canonical nodes already define an Actor or
Command involved, link the ID and move on. Same rule for ADRs — reference,
never restate.

If the Phase 1 dialog surfaces a previously implicit architectural choice
(stack, layering, tooling, cross-cutting policy), promote it to an ADR rather
than absorbing it inline. See
[`authoring-adr.md → From an FRS`](../authoring-adr.md#three-triggers).

## Dialog discipline (while drafting)

When clarifying requirements or drafting the FRS, treat the conversation as
load-bearing — the assumptions that surface here don't have to be unwound
later.

- **One question per message.** Multiple questions per turn produce shallow
  answers and lose threads. Hold the next question until the current one is
  resolved.
- **Prefer multiple-choice when the option space is bounded.** Open-ended
  questions are for genuinely open spaces, not for "did you mean A or B".
- **Focus on purpose, constraints, success criteria.** Skip implementation
  detail — that belongs in Phase 2.
- **Draft section by section.** Walk the FRS template in order — Use case →
  Actors → Preconditions → Postconditions → Business rules → Edge cases →
  Acceptance criteria → Brownfield impact — and pause for confirmation
  between sections. If something stops making sense, go back; don't paper
  over. The Behavior section is retired (R-NEW-1): journey behavior lives
  on the Phase-1-born FLW (Trigger + Scenarios), not in the FRS body.
- **Author FLW and CHG after the FRS body, before exit.** Once the FRS
  is drafted, walk the FLW template (Trigger + 3 Scenarios in business
  language), then — when `touches_nodes:` is non-empty — the CHANGE
  template (behavior-language `modifies[]` + optional milestone-level
  invariant deltas + optional `removes[]` / `supersedes[]`). Each Scenario
  must map back to at least one Acceptance criterion. Each CHG's
  `modifies[]` delta must coherently follow from the FRS's ACs / BRs /
  Postconditions and the target canonical node's state. Phase 1.5 Pass 1
  verifies AC→scenario coverage (R-NEW-3) and chg-sanity (R-CHG-5). (The
  ACT is authored at Phase 2, not here — see [`plan.md § 3`](../plan.md#3-new-node-canonical-ingest--phase-1-born-flw-enrichment).)
