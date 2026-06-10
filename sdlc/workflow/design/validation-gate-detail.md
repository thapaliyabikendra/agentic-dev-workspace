---
name: design-validation-gate-detail
description: "Detail file of design.md Phase 1.5 — subagent dispatch shape + outcome routing, Pass 1's eight checks (full text), round-trip rules, Pass 2 cross-FRS sweep (full text). Load at Phase 1.5 gate execution."
applies_when:
  stack: [agnostic]
---

# Phase 1.5 detail — validation gate execution

> Detail file of [`design.md`](../design.md) (Phase 0/1/1.5 flow). Load at
> Phase 1.5 gate execution, alongside
> [`frs-validation-rules.md`](../frs-validation-rules.md). The core file's
> Phase 1.5 exit checklist is the binding gate.

## Subagent dispatch shape + outcome routing

The Phase 1.5 specialist passes run in **two ordered stages** — the
parallel dispatch shape applies *inside* each stage, not across them:

**Stage A (per-FRS, parallel within one FRS):** Pass 1's eight checks
(existence + sanity + adr-conflict + standard-conflict + ccc-deviation +
flw-coverage + phase-1-bare-body-shape + chg-sanity) and the
baseline-snapshot capture per
[`frs-validation-rules.md`](../frs-validation-rules.md) fire as parallel
inline `Agent(subagent_type=Explore, ...)` dispatches in a single message —
they are file-disjoint over one FRS (each check reads the FRS plus the
Phase-1-born FLW / CHG, but each writes to a disjoint finding row).
Run Stage A after each FRS is authored. **`chg-sanity` (check #8) fires
only when the FRS declares non-empty `touches_nodes:` — pure-addition
FRSs skip the chg-sanity dispatch.** **Sibling-FRS ordering for
chg-sanity:** Pass 1 processes sibling FRSs in birth order (per the
FRS frontmatter `created:` timestamp; tie-break by FRS-NNN ascending);
chg-sanity re-runs only on the affected CHG when any cited sibling FLW
body changes during the round-trip (per υ / M1).

**Stage B (milestone cross-FRS, after all FRSs cleared Stage A):**
Pass 2's cross-FRS sweep dispatches once, after every FRS in the
milestone has cleared Stage A. Running Pass 2 against an unvalidated
FRS produces findings against a moving target. Skip Stage B when the
milestone has < 2 FRSs (see Pass 2 below).

Each dispatch returns the 3-block contract
(`## Findings / ## Risks / ## Open questions`). Contract canonical home:
[`agent-contracts.md → Contract Layer 1`](../agent-contracts.md#contract-layer-1--subagent-dispatch-return-shape)
— do not restate the contract here.

**Parent-side routing on dispatch return** (orchestrator decides next
step based on the 3-block return, using these outcome handles):

- **DONE** → 0 Findings, or only Minor — proceed to the cross-FRS sweep
  / exit checklist.
- **DONE_WITH_CONCERNS** → ≥ 1 Major Finding — resolve **before**
  proceeding to the next pass. Revise the FRS, then re-dispatch the
  affected pass only.
- **NEEDS_CONTEXT** → empty return or self-reported "could not
  determine" — re-dispatch with explicit added context (named files,
  named ADR IDs, narrower scope). Do NOT retry blindly.
- **BLOCKED** → ≥ 1 Blocker Finding, or task-shape mismatch (a judgment
  call disguised as a mechanical check) — escalate: either split the
  task into smaller mechanical units, re-dispatch to a stronger model,
  or raise an `OQ-NNN` under `docs/discovery/open-questions/` with
  `origin: validation-gate, gate_effect: blocking` and resolve before
  the milestone moves.

## Pass 1 — the eight checks (full text)

For each FRS, run these eight checks and write findings to the FRS's
"Validation findings" section. Checks 1, 2, 6, 7 also read the Phase-1-born
FLW — the FLW file exists at this gate per R-NEW-1. Check 8 reads the
Phase-1-born CHG when `touches_nodes:` is non-empty (the CHG file exists
at this gate per R-CHG-1); pure-addition FRSs skip check 8. **ACT-NNN is
not Phase-1-born** (R-NEW-2a retired 2026-05-17). When `produced_actor:`
is set, Pass 1 checks the ID is claimed in the FRS frontmatter
`produced_actor:` field (R-NEW-9 amended 2026-05-17) but does NOT read an
ACT body — there is none at this stage.

1. **Existence scan** (widened per R-NEW-6 to match FLW scenario signatures).
   Search the canonical wiki (including `status: proposed` in-flight nodes
   from any FS not yet at Phase 3) for nodes that match (a) the FRS's
   user-journey signature — title, actor ID, command domain — and (b) the
   Phase-1-born FLW's Scenario signatures (happy-path Given/When/Then
   phrasing — duplicate-flow detection at this gate, not Phase 2). If a
   near-duplicate exists, record a finding with `type: existence` and a
   non-blank `rationale:` for the resolution. When the match is a
   `proposed` sibling-FS node, the `rationale:` notes the in-flight flavor
   ("matches proposed ENT-005 introduced by FS-A — confirm distinctness or
   coordinate"). Read-only references to canonical FLW / ACT in FRS prose
   are NOT existence-checked here (text grep is the audit hook; author is
   responsible for citation accuracy — per M2). **Cross-FRS duplicate-actor
   detection at this gate is explicitly dropped (R-NEW-2a retired
   2026-05-17)** — when two sibling FRSs independently introduce the same
   actor role, the conflict surfaces at Phase 2 FS authoring when both FSs
   claim the same actor name. Possible resolutions:
   - the FRS is genuinely a change request → flip to `kind: change-request`
     in the per-FRS discovery, declare the conflicting canonical IDs in
     `touches_nodes`, and the FRS births a Phase-1 CHG node (per R-CHG-1)
     that the consuming FS will list in `consumes_chgs:` at Phase 2;
   - the FRS is duplicative → drop it (and retire the Phase-1-born FLW
     via `proposed → deprecated` per
     [`in-flight-nodes.md → Abandonment`](../in-flight-nodes.md); the
     claimed ACT-NNN ID is released — append an `op: released` row to
     the milestone's `id-claims.md` with Source = this FRS, since the
     FRS itself is being retired and the frontmatter no longer carries
     the claim);
   - the FRS is adjacent-but-distinct → narrow the title and the use case to
     remove the ambiguity (and revise the FLW Scenarios in place — 1-file
     body-edit per R-NEW-7).
2. **Business-logic sanity** (FRS + Phase-1-born FLW).
   Walk the FRS's preconditions and postconditions and the FLW Scenarios.
   Do they form a coherent state transition? Any impossible precondition,
   unreachable postcondition, contradiction between acceptance criteria, or
   FLW Scenario that violates the Phase-1 business-language discipline
   (uses ENT/CMD/STA/PERM-NNN IDs in scenario bodies — the IDs don't exist
   yet, this is a forward-claim leak) is a finding with `type: sanity`.
   Also catches: a `created_under:` marker on a FLW with `created:` after
   the cutover date (illegitimate marker use per B5 risk — Major finding).
3. **ADR conflict scan.** Re-read each ADR in the FRS's `adrs:`
   frontmatter. Does any `accepted` ADR constrain something the FRS
   proposes? Each conflict is a finding with `type: adr-conflict`. The
   resolution either updates the ADR (via the supersession procedure) or
   reshapes the FRS to honor the ADR.
4. **STD conformance scan.** Scan [`../../standards/index.md`](../../standards/index.md);
   narrow-load each STD whose `applies_when.stack:` intersects this FRS's
   declared `stack:` plus every STD already in the FRS's `standards:`. Does
   any `accepted` STD rule constrain something the FRS proposes? Each
   conflict is a finding with `type: standard-conflict`. The resolution is
   to either reshape the FRS to honor the STD or file a project-scoped ADR
   that codifies the deviation (which back-links to the STD via
   `related_adrs:`).
5. **CCC deviation scan.** Re-read each CCC in the FRS's `ccc:` frontmatter
   plus any CCC whose category the FRS implicitly touches (auth, audit,
   retention, ...). For each CCC the FRS reads, walk the Baseline section
   and verify the FRS does not override the default in body prose. A silent
   override is a finding with `type: ccc-deviation`. The resolution is to
   either remove the override from the FRS body, or file an ADR (carrying
   `related: [CCC-NNN]`) that captures the operation-specific deviation —
   and add the ADR ID to the FRS's `adrs:` and the "Brownfield impact" list.
6. **FLW coverage check** (per R-NEW-3). Walk each acceptance criterion in
   the FRS and verify it maps to a scenario anchor on a real FLW — either
   the Phase-1-born FLW declared in `produced_flw:` or an existing
   canonical FLW listed in `touches_nodes:`. Each scenario (happy / edge /
   fault) is independently expressible as a test-runner assertion. Any
   unmapped AC or unrealizable scenario is a finding with `type: sanity`
   (`coverage` flavor in the Rationale). This was the previous Phase 2
   exit check, moved earlier — FLWs now exist at Phase 1 per R-NEW-2.
7. **Phase-1-bare body-shape sanity** (per R-NEW-2 / R-NEW-8 — narrowed
   to FLW + CHG only; R-NEW-2a retired 2026-05-17). Verify the Phase-1-born
   FLW carries `related: []` (empty) and contains only Trigger + Scenarios
   + optional Brownfield notes — no Sequence, Branches, Compensating
   actions, structural Postconditions, or Decisions. **Verify the
   Phase-1-born CHG (when `touches_nodes:` is non-empty) carries empty
   `adds[]` and `migration_steps[]` and that `modifies[]` entries carry no
   structural before/after** — Phase-2-wired content in a Phase-1-bare CHG
   is a forward-claim leak. Any forward-claim leak (Phase-2 content under
   a Phase-1-bare body) is a `type: sanity` finding. The
   `created_under: pre-2026-05-17` audit marker exempts a FLW from this
   check (grandfather only — FLW-003). ACT body-shape is no longer checked
   at this gate — there is no Phase-1 ACT body.
8. **chg-sanity** (per R-CHG-5). For each CHG born by this FRS (one per
   FRS when `touches_nodes:` is non-empty), verify the `modifies[]`
   behavior delta coherently follows from (a) the FRS's ACs / BRs /
   Postconditions and (b) the target FLW / ACT / etc.'s current canonical
   state. Findings:

   | Severity | Trigger |
   |---|---|
   | **Major** | FRS-CHG mismatch (FRS implies behavior change X but CHG doesn't describe X; or CHG describes a modification the FRS doesn't justify). |
   | **Minor** | Behavior delta is vague / under-specified but the Phase 2 enrichment path is clear. |
   | **Blocker** | (rare) CHG `modifies[]` references a canonical node ID that doesn't exist — subsumed by check 1 (existence). |

   Severity prefix in Rationale: `"Major: chg-sanity — …"`.

   **Sibling-FRS ordering (per υ / M1):** Pass 1 processes sibling FRSs
   in birth order (per FRS frontmatter `created:` timestamp; tie-break
   by FRS-NNN ascending). If a CHG's target FLW /
   ACT is Phase-1-bare and born by a sibling FRS, the check validates
   against the current Phase-1-bare body. If that sibling's body changes
   mid-round-trip, chg-sanity re-runs on the affected CHG only (not full
   Pass 1).

   **Target node may itself be Phase-1-bare.** Structural-language
   validations (does the CHG correctly reference the target's Sequence
   step number? does it touch the right CMD-NNN?) are not in scope here
   — they land at Phase 2 FS-validation. Pass 1 authors must NOT reach
   for Phase-2-wired structural detail when the target node is
   Phase-1-bare.

   Resolution paths parallel `sanity`: resolve inline (revise FRS or
   CHG) or raise an OQ with `gate_effect: blocking | post-approval`.
   The 1-file body-edit carve-out (R-NEW-7) extends to CHG body edits
   during Phase 1.5 round-trip when `status:` stays `draft` — see
   [`maintenance-discipline.md`](../maintenance-discipline.md).

## Round-trip rules (FAIL / PASS_WITH_MAJORS)

When the gate sends the FRS back to revise (Blocker or unresolved Major),
the revision often ripples to the canonical FLW (Scenarios revised per AC
change) and/or the milestone-scoped CHG (`modifies[]` delta revised to
follow the updated FRS). Both are **in-place body edits** with `status:`
unchanged — 1-file touch per R-NEW-7 (narrowed to FLW only; canonical node
body + `updated:` timestamp; `nodes/<type>/index.md` Status column
unchanged, no index re-sync) and the parallel carve-out for CHG body edits
during Phase 1.5 round-trip when `status:` stays `draft` (see
[`maintenance-discipline.md`](../maintenance-discipline.md)). Any
status-change event (Phase 3 activation `proposed → active`, full FRS
abandonment `proposed → deprecated`, CHG `draft → approved`) keeps the
standard 2-file touch. Full FRS abandonment during Phase 1 / 1.5 routes to
[`in-flight-nodes.md → Abandonment`](../in-flight-nodes.md) and deprecates
the Phase-1-born FLW and CHG (if any) together; any `produced_actor:`
ID claim is released — append an `op: released` row to the milestone's
`id-claims.md` since the FRS itself is being retired (no ACT file
exists yet to deprecate). FRS split-and-replace retires the originals
as `deprecated` and allocates fresh IDs for the splits (IDs are never
reused).

## Pass 2 — milestone cross-FRS sweep (full text)

**Skip Pass 2 when the milestone has fewer than 2 FRSs.** A single-FRS
milestone has no cross-FRS conflicts to detect; the sweep is a no-op. Still
append an empty "Cross-FRS conflicts" section to `discovery/milestone-scope.md`
noting "N/A — single FRS milestone" for audit trail.

With every FRS in the milestone validated individually, scan for cross-FRS
conflicts that any single-FRS gate cannot catch.

1. **Duplicate-CMD detection.** Are two FRSs' `produces_nodes` claiming the
   same command name or behavioral signature? Either the intent is shared
   (merge the FRSs' command production into one) or the allocation is wrong
   (rename / split).
2. **Overlapping ENT definitions.** Two FRSs each introducing an entity that
   represents the same domain concept → merge or differentiate before
   Phase 2 writes them to canonical.
3. **Contradictory invariants.** FRS-A states an invariant that FRS-B's
   acceptance criteria implicitly violate → explicit resolution required.
4. **CHG-conflict** (per R-CHG-6). When two sibling FRSs in the same
   milestone both birth CHGs at Phase 1, sweep for:

   | Conflict | Severity | Resolution |
   |---|---|---|
   | Two sibling CHGs target the same canonical FLW / ACT node | **Major** | Surface for FS-time merge decision (per R-CHG-3's CHG-merging procedure) or for explicit split-into-different-FSs routing. Both are valid; the sweep refuses silent absorption. |
   | Two sibling CHGs' `modifies[]` deltas contradict each other | **Blocker** | Resolve via FRS-level re-scoping; the milestone cannot move with two contradictory modify-intents on the same canonical node. |
   | Two sibling CHGs' `invariants_after[]` contradict each other | **Blocker** | Same as above — invariant contradictions are uniformly Blocker (echoes Pass 2's existing Contradictory-invariants check). |

   Severity prefix in Rationale: `"Major: chg-conflict — …"` or
   `"Blocker: chg-conflict — …"`. CR track is single-FRS only — Pass 2
   doesn't run, so this check doesn't apply on CR track.

Output: append to `discovery/milestone-scope.md` under a new
"Cross-FRS conflicts" section, with cross-FRS finding rows. Each row also
appends a corresponding `cross-frs` finding to the FRSs involved.
