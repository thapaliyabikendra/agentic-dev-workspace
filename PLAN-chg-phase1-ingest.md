---
title: Move CHG authoring into Phase 1 (per-FRS birth), consume at Phase 2 via FS `consumes_chgs:`
status: done                    # proposed | approved | in-progress | done | abandoned
kind: workflow-evolution
created: 2026-05-17
revised: 2026-05-17
owner: bikendra.thapaliya@amniltech.com
scope: sdlc engine + project templates (CHG only — companion to FLW/ACT plan)
depends_on:
  - PLAN-flw-phase1-ingest.md   # must be status: done before this plan starts
related:
  - sdlc/_templates/nodes/CHANGE.md
  - sdlc/_templates/FS.md
  - sdlc/_templates/FRS.md
  - sdlc/WORKFLOW.md
  - sdlc/PRINCIPLES.md
  - CLAUDE.md (hard rule #7)
  - sdlc/workflow/design.md
  - sdlc/workflow/plan.md
  - sdlc/workflow/frs-validation-rules.md
  - sdlc/workflow/in-flight-nodes.md
  - sdlc/workflow/change-request.md
  - sdlc/workflow/maintenance-discipline.md
  - sdlc/workflow/retrieval-discipline.md
  - sdlc/workflow/agent-contracts.md
---

# Plan — CHG as Phase 1 per-FRS birth, consumed at Phase 2 via FS

## Context

Current model: FRS at Phase 1 declares modify-intent via `touches_nodes:`;
the FS at Phase 2 emits the CHG node describing the delta. This produces a
forward-claim disease structurally identical to the FLW/ACT case (cured by
predecessor plan):

1. FRS declares `touches_nodes: [FLW-001, ACT-005]` at Phase 1, but the CHG
   file describing the intended delta doesn't exist yet.
2. Phase 1.5 cannot validate the modify intent — there's no CHG body to
   sanity-check against the FRS's ACs and the target node's canonical state.
3. The Phase-2 FS author authors both the FS structure AND the CHG delta in
   one session, conflating two distinct concerns (structure naming vs. delta
   description).

Resolution: **CHG-NNN is born at Phase 1 per FRS** when `touches_nodes:` is
non-empty. CHG carries behavior-language `modifies[]` only (one delta-intent
container per FRS). Phase 2 FS author **consumes** per-FRS-born CHGs via a
new FS frontmatter field `consumes_chgs: [CHG-NNN, …]` and enriches each
consumed CHG with structural before/after, `adds[]`, and `migration_steps[]`.
Phase 3 merges deltas and flips `approved → merged`.

The CHG file relocates from FS-scoped (`milestones/.../specs/FS-NNN/nodes/changes/`)
to a permanent milestone-scoped home (`milestones/.../chg/`) so the FS-CHG
coupling is by frontmatter reference, not filesystem nesting.

## Prerequisites

This plan executes **after** `PLAN-flw-phase1-ingest.md` lands (`status: done`).
Several files revised by both plans converge cleanly:

| File | FLW/ACT plan state | This plan adds |
|---|---|---|
| `CLAUDE.md` hard rule #7 | "Phase 1 ingests FLW + ACT" | "+ CHG (when `touches_nodes:` non-empty)" |
| `PRINCIPLES.md` lines 112-113 | Same parallel restatement | Same |
| `WORKFLOW.md` Process Flow graph | Phase 1 emits FRS + FLW + ACT | + CHG (conditional) |
| `plan.md` HARD-GATE | "Phase 1 names FLW + ACT" | "+ CHG behavior delta" |
| `plan.md` § 2 ID-claim | `FS` → `Source` rename | CHG row added (Source = FRS-NNN) |
| `plan.md` § 4 | UNCHANGED (CHG emission stays old) | **Full rewrite** (emission → consumption + enrichment) |
| `design.md` mode declaration | "FLW + ACT born to canonical" | "+ CHG (conditional)" |
| `design.md` Pass 1 | FLW coverage + ACT existence | + chg-sanity |
| `design.md` Pass 2 | Duplicate-CMD / Overlapping ENT / Contradictory invariants | + CHG-conflict |
| `frs-validation-rules.md` | FLW coverage at Phase 1.5 + ACT existence | + chg-sanity Pass 1 |
| `in-flight-nodes.md` | FLW + ACT lifecycle + discriminator + round-trip | + CHG mechanics rewrite + FS-CHG consumption + CHG draft discriminator |
| `retrieval-discipline.md` | Phase 1 loads FLOW.md + ACTOR.md | + CHANGE.md |
| `maintenance-discipline.md` | R-NEW-7 carve-out for FLW/ACT body edits | Extend to CHG body edits in Phase 1.5 round-trip |
| `change-request.md` | CR Container Structure unchanged | CR Container Structure repath (`chg/` subtree added; old `specs/FS-NNN/nodes/changes/` removed from example) |
| `agent-contracts.md` | FRS + FLW + ACT one-session authoring | + CHG when touches_nodes non-empty |

This plan does not touch FLW/ACT lifecycle or FRS template's
`produced_flw:` / `produced_actor:` / `produces_nodes:` semantics — those
landed in the predecessor.

## Cutover summary

| Phase | CHG action | Status flip |
|---|---|---|
| **Phase 1** (Design — Query + Ingest) | CHG-NNN born per FRS when `touches_nodes:` non-empty; allocated via `id-claims.md` (Source = FRS-NNN); body carries behavior-language `modifies[]` + optional milestone-level `invariants_before/after` + optional `removes[]` / `supersedes[]` | `status: draft` |
| **Phase 1.5** (Validation gate) | Pass 1 `chg-sanity` check: each CHG's behavior delta coherently follows from FRS ACs + target node's canonical state. Pass 2 cross-FRS CHG-conflict check (sibling CHGs targeting same canonical node / contradicting deltas / contradicting invariants) | unchanged |
| **Phase 2** (Plan — Ingest) | FS author declares `consumes_chgs: [CHG-NNN, …]` in FS frontmatter; enriches each consumed CHG with structural before/after on `modifies[]`, `adds[]` (mirroring new node ingest), `migration_steps[]` | `draft` → `approved` at FS-validation exit |
| **Phase 3** (Implementation) | Merge applies CHG deltas to canonical nodes | `approved` → `merged` |

## Decision summary

| Aspect | Decision |
|---|---|
| CHG birth | Phase 1, per FRS, when `touches_nodes:` non-empty. One CHG per FRS at Phase 1 (parallel to `produced_flw:` / `produced_actor:` scalar shape) |
| CHG path | Permanent milestone-scoped home: `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` (or `docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md` for CR track). Old FS-scoped path retired for new CHGs; pre-cutover CHGs grandfathered |
| `target_fs:` field | **Retired** (per B4 from FLW/ACT review). FS-CHG coupling moves from filesystem nesting + `target_fs:` field → `consumes_chgs:` frontmatter on FS + `source_ref:` (FRS list) on CHG. Audit hook: reverse-glob of FS `consumes_chgs:` |
| FS consumes CHGs | FS frontmatter gains `consumes_chgs: [CHG-NNN, …]` listing the CHGs this FS owns. One CHG ⇒ at most one FS (one-to-many from FS side). FS aggregates per-FRS-born CHGs at Phase 2; merging two sibling CHGs into one is allowed (deprecate the unused ID, do NOT reuse) |
| CHG content split | Phase-1-bare: behavior-level `modifies[]` (business-language deltas) + milestone-level `invariants_before/after` + explicit retirements in `removes[]` / `supersedes[]`. Phase-2-wired (FS enrichment): structural before/after on `modifies[]`, `adds[]` mirroring new node ingest, `migration_steps[]` |
| Phase 1.5 CHG validation | Pass 1 gains `type: chg-sanity` finding type: does each CHG's behavior delta coherently follow from the FRS's ACs and from the target node's canonical state? Major when delta and FRS contradict; Minor when delta vague but resolvable at Phase 2 |
| Phase 1.5 cross-FRS CHG-conflict | Pass 2 sweep gains CHG-conflict check: sibling CHGs targeting same canonical FLW/ACT (Major); contradictory `modifies[]` deltas on same target (Blocker); contradictory `invariants_after[]` (Blocker) |
| `chg-sanity` ordering across sibling FRSs | Process sibling FRSs in birth order (per `id-claims.md` sequence); chg-sanity re-runs if any cited sibling FLW/ACT body changes during the round-trip. Per M1 |
| CHG `status: draft` discriminator | Body-shape rule parallel to R-NEW-8 (predecessor plan): not yet listed in any FS's `consumes_chgs:` ⇒ Phase-1-bare; listed AND structural sections populated ⇒ Phase-2-wired. No new frontmatter field |
| R-NEW-7 carve-out extension | The 1-file body-edit-on-`status: proposed`-or-`draft` carve-out (predecessor plan's new doctrinal exception) extends to CHG body edits during Phase 1.5 round-trip. Same tight scope rules apply |

## Open decisions — resolved

| OQ | Pick | Rationale |
|---|---|---|
| ν — CHG-at-Phase-1 plan scope | **ν2 (revised from ν1): standalone follow-on plan** | Predecessor plan picked ν1 ("bundle into FLW/ACT plan") but third-round review flipped to standalone follow-on to bound execution risk. Symmetry argument (same forward-claim cure) holds; splitting preserves the through-line while making each plan's execution bounded |
| ξ — CHG path under Phase-1 birth | **ξ1: Permanent milestone-scoped home** | Two options: (1) permanent milestone-scoped home (`milestones/.../chg/`); (2) Phase-1 staging + relocate at Phase 2. Option 1 wins: file moves are a discipline cost; the FS-scoped-only path is an accident of the old "FS owns CHG" model — under per-FRS birth, the FS no longer owns; it consumes. FS frontmatter `consumes_chgs:` maintains the FS↔CHG link without filesystem coupling |
| ο — CHG granularity at Phase 1 | **ο3: Per-FRS birth + FS-level assignment at Phase 2 (hybrid)** | Pure options considered: per-FRS birth vs. per-FS default. Hybrid wins: CHG born at Phase 1 per FRS (so Phase 1.5 can validate the behavior delta against a real artifact), but ownership is FS-assigned at Phase 2 via the FS's new `consumes_chgs:` frontmatter. An FS may consume one or many per-FRS-born CHGs; merging two sibling CHGs into one is allowed at FS-authoring time (deprecate the unused ID, do NOT reuse). Splitting heuristics re-apply at the FS-consumption decision |
| π — CHG content split | **π1: Behavior delta at Phase 1; structural delta + adds[] + migration at Phase 2** | The same Phase-1-bare / Phase-2-wired split that governs FLW and ACT extends to CHG: Phase-1 CHG uses business-language deltas ("FLW-001 gains a fault path when X"); Phase 2 FS enrichment adds structural before/after (field/method/route names), `adds[]` mirroring new node ingest, `migration_steps[]` |
| ρ — Phase-1.5 CHG validation | **ρ1: Add new `chg-sanity` Pass 1 finding type** | Phase 1.5 Pass 1 gains a sixth check: for each CHG born by this FRS, does the `modifies[]` behavior delta coherently follow from (a) the FRS's ACs and (b) the target FLW/ACT/etc.'s current canonical state? Mismatch examples: FRS adds a new fault path in ACs but the CHG's `modifies[]` doesn't describe it; or CHG describes a modification the FRS doesn't justify. Severity: Major (FRS-CHG mismatch); Minor (delta vague but resolvable at Phase 2) |
| σ — CHG `status: draft` discriminator | **σ1: Body-shape rule parallel to R-NEW-8** | `status: draft` post-cutover overlaps two states: Phase-1-bare (born by FRS, awaiting FS consumption + enrichment) and Phase-2-wired (FS-enriched, awaiting FS-validation exit). Body-shape rule: CHG ID not yet listed in any FS's `consumes_chgs:` ⇒ Phase-1-bare; listed AND structural sections (`migration_steps:`, `adds:`) populated ⇒ Phase-2-wired. No new frontmatter field |
| τ — `target_fs:` field retirement | **τ1: Retire; route audit through `source_ref:` + `consumes_chgs:` reverse-glob** | Per B4 from FLW/ACT review. Current CHANGE.md template has `target_fs:` frontmatter encoding "FS owns CHG" — false post-cutover. Retire the field; `source_ref:` (FRS list, already exists) captures origination; FS-CHG ownership is captured by `consumes_chgs:` on the FS side. Reverse-glob audit (grep every FS for CHG-NNN in `consumes_chgs:`) replaces direct field lookup. Pre-cutover CHGs with `target_fs:` are grandfathered (no CHG files currently exist, so migration debt is zero) |
| υ — `chg-sanity` Pass 1 ordering across sibling FRSs | **υ1: Process in birth order; re-run on sibling FLW/ACT body changes** | Per M1 from FLW/ACT review. When FRS-N's CHG modifies a canonical FLW/ACT born by sibling FRS-M earlier in the same milestone, validation order matters — if FRS-M is still mid-Phase-1.5, its body may change under FRS-N's feet. Rule: Pass 1 processes sibling FRSs in birth order (`id-claims.md` sequence); chg-sanity re-runs on any cited sibling FLW/ACT body change during the round-trip. Tie-breaker: birth order is deterministic; re-run is bounded (only affected CHG, not full Pass 1) |

## New rules

- **R-CHG-1** — CHG-NNN birth shifts from Phase 2 (FS-emitted) to **Phase 1
  (FRS-emitted)** when the FRS declares non-empty `touches_nodes:`. One CHG
  per FRS at Phase 1 — parallel to `produced_flw:` / `produced_actor:` scalar
  shape (one modify-intent container per FRS). FRSs with empty `touches_nodes:`
  do NOT birth a CHG (pure additions are audited by `source_ref` + `id-claims.md`
  + git history, per the existing rule). The CHG is allocated via `id-claims.md`
  per the predecessor plan's `Source` column (Source = FRS-NNN for
  Phase-1-born CHGs).

- **R-CHG-2** — CHG-NNN path relocates to a **permanent milestone-scoped home**:

  | Track | Old path (pre-cutover, grandfathered) | New path (cutover and after) |
  |---|---|---|
  | Milestone | `milestones/M-NN-<slug>/specs/FS-NNN-<slug>/nodes/changes/CHG-NNN-<slug>.md` | `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` |
  | CR | `docs/change-requests/CR-NNN-<slug>/specs/FS-NNN-<slug>/nodes/changes/CHG-NNN-<slug>.md` | `docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md` |

  Pre-cutover CHGs stay at the old path (grandfathered). No CHG files currently
  exist in the codebase (verified) — migration debt is zero at cutover time.

- **R-CHG-3** — FS-CHG ownership is expressed via the FS's new
  **`consumes_chgs: [CHG-NNN, …]`** frontmatter field — one-way reference list
  (parallel to `depends_on_specs:` precedent). Cardinality: one CHG belongs
  to at most one FS (one-to-many from FS side). Default at Phase 2 FS authoring:
  the FS consumes all CHGs born by its constituent FRSs. Two adjustments
  allowed:

  - **Subset consumption** — an FS may consume only a subset of its FRSs'
    CHGs when the splitting heuristics fire (different bounded contexts,
    different risk profiles, different reviewers). The unconsumed CHGs route
    to a sibling FS in the same milestone (each CHG must end up consumed
    by exactly one FS before the milestone closes).
  - **CHG merging** — at FS-authoring time, two sibling CHGs (born by sibling
    FRSs in the same milestone) may be merged into one when they target the
    same bounded context with matching risk and reviewer profile. Procedure:
    retain one CHG ID, fold the other's `modifies[]` / invariant deltas into
    it, flip the unused ID to `status: deprecated` (do NOT reuse). The
    retained CHG's `source_ref:` accumulates both originating FRS IDs.

  At Phase 3 merge, the merger globs every `consumes_chgs:` across the
  milestone's FSs to verify every milestone-scoped CHG is consumed exactly
  once before applying deltas.

- **R-CHG-4** — Phase-1-bare CHG content budget (parallel to the predecessor
  plan's R-NEW-2 / R-NEW-2a section budgets):

  | CHANGE.md section / field | Phase 1 | Phase 2 (FS enrichment) | Notes |
  |---|---|---|---|
  | `modifies[]` behavior delta | ✅ required (business language) | enriched (structural before/after) | Phase 1: "FLW-001 gains a fault path when X" / "ACT-001's Preconditions add a permission requirement"; Phase 2: actual field / method / route changes. Discipline shift identical to FLW Scenarios — no ENT-NNN / CMD-NNN / STA-NNN IDs at Phase 1 |
  | `invariants_before[]` / `invariants_after[]` | ✅ optional (milestone-level) | enriched | Phase 1 for milestone-spanning invariants; Phase 2 for node-local |
  | `removes[]` / `supersedes[]` | ✅ optional (explicit retirement intent) | enriched | Phase 1 when the FRS explicitly retires; Phase 2 for FS-emergent retirements |
  | `adds[]` | — | ✅ filled | Mirrors Phase 2 new node ingest (ENT / CMD / STA / CON / INT / DEC / PERM / QRY). Empty at Phase 1 because no new nodes yet |
  | `migration_steps[]` | — | ✅ filled | Data / schema migration — structural; Phase 2 |
  | `source_ref:` | ✅ required (originating FRS) | accumulates additional FRSs when CHGs merge per R-CHG-3 | List of FRS IDs |
  | `target_fs:` | **RETIRED** per τ — replaced by reverse-glob of FS `consumes_chgs:` | — | Pre-cutover CHGs with this field are grandfathered (none currently exist) |
  | `status:` | `draft` (Phase 1 birth) | `draft` until FS-validation exit, then `draft → approved` | Phase 3 flips `approved → merged` |

  Phase-1-bare CHG `modifies[]` entries use **business-language deltas** —
  the same discipline that governs Phase-1 FLW Scenarios and Phase-1 ACT
  Preconditions.

- **R-CHG-5** — Phase 1.5 Pass 1 gains a sixth check: **`type: chg-sanity`**.
  For each CHG born by this FRS (one per FRS when `touches_nodes:` non-empty),
  verify the CHG's `modifies[]` behavior delta coherently follows from (a)
  the FRS's ACs / BRs / Postconditions and (b) the target FLW / ACT / etc.'s
  current canonical state. Findings:

  | Severity | Trigger |
  |---|---|
  | **Major** | FRS-CHG mismatch (FRS implies behavior change X but CHG doesn't describe X; or CHG describes a modification the FRS doesn't justify) |
  | **Minor** | Behavior delta is vague / under-specified but the Phase 2 enrichment path is clear |
  | Blocker | (rare) CHG `modifies[]` references a canonical node ID that doesn't exist (subsumed by `type: existence` check) |

  Adds `chg-sanity` to the FRS.md `Validation findings` table's `Type` enum
  AND to `design.md`'s Pass 1 block. **Note (per B2 from FLW/ACT review):
  `frs-validation-rules.md` has no `Validation findings` table and no
  "How findings appear" section** — the canonical landing spots are FRS.md
  template + design.md Pass 1. Resolution paths parallel `sanity`: resolve
  inline (revise FRS or CHG) or raise an OQ with `gate_effect: blocking |
  post-approval`.

  **Sibling-FRS ordering (per υ / M1):** Pass 1 processes sibling FRSs in
  birth order (per `id-claims.md` sequence). If a CHG's target FLW / ACT is
  Phase-1-bare and born by a sibling FRS, the check validates against the
  current Phase-1-bare body. If that sibling's body changes mid-round-trip,
  chg-sanity re-runs on the affected CHG only (not full Pass 1).

  **Target node may itself be Phase-1-bare.** Structural-language
  validations (does the CHG correctly reference the target's Sequence step
  number? does it touch the right CMD-NNN?) are not in scope here — they
  land at Phase 2 FS-validation. Pass 1 authors must NOT reach for
  Phase-2-wired structural detail when the target node is Phase-1-bare.

- **R-CHG-6** — Phase 1.5 Pass 2 cross-FRS sweep gains a **CHG-conflict
  check**. When two sibling FRSs in the same milestone both birth CHGs at
  Phase 1, the sweep detects:

  | Conflict | Type | Severity | Resolution |
  |---|---|---|---|
  | Two sibling CHGs target the same canonical FLW / ACT node | `cross-frs` | Major | Surface for FS-time merge decision (per R-CHG-3's "CHG merging" procedure) or for explicit split-into-different-FSs routing. Both are valid; the sweep just refuses silent absorption |
  | Two sibling CHGs' `modifies[]` deltas contradict each other | `cross-frs` | Blocker | Resolve via FRS-level re-scoping; the milestone cannot move with two contradictory modify-intents on the same canonical node |
  | Two sibling CHGs' `invariants_after[]` contradict each other | `cross-frs` | Blocker | Same as above — invariant contradictions are uniformly Blocker (echoes Pass 2's existing "Contradictory invariants" check) |

  Adds CHG-conflict detection to the existing cross-FRS sweep checks
  (Duplicate-CMD detection, Overlapping ENT definitions, Contradictory
  invariants — `design.md § Pass 2`). Skip when the milestone has < 2 FRSs.
  CR track is single-FRS only — Pass 2 doesn't run, so this check doesn't
  apply on CR track.

- **R-CHG-7** — CHG `status: draft` post-cutover is overloaded (parallel
  to predecessor plan's R-NEW-8 for `status: proposed` on FLW / ACT).
  Body-shape rule:

  | Discriminator | CHG phase state | Reader interpretation |
  |---|---|---|
  | CHG ID not yet listed in any FS's `consumes_chgs:` | Phase-1-bare | Born by FRS at Phase 1; awaiting FS consumption + enrichment. Body carries business-language `modifies[]` only; no `adds[]`, no `migration_steps[]` |
  | Listed in an FS's `consumes_chgs:` AND structural sections (`migration_steps[]`, structural `modifies[]` before/after) populated | Phase-2-wired | FS-enriched; awaiting FS-validation exit (which flips to `approved`) and Phase 3 merge |
  | `status: approved` | FS-validation passed | Awaiting Phase 3 merge |
  | `status: merged` | Phase 3 complete | No longer in-flight |
  | `status: deprecated` | retired (R-CHG-3 merge collapsed it, or full abandonment) | IDs never reused |

  No new frontmatter field; readers infer from `consumes_chgs:` lookup + body
  structural-section presence. Phase 1.5 sees only Phase-1-bare CHGs; Phase 2
  FS validation sees Phase-2-wired CHGs.

## Revised rules

- **CLAUDE.md hard rule #7** — predecessor plan revised this to acknowledge
  FLW + ACT Phase 1 ingest. This plan further revises to add CHG: "Phase 1
  ingests FLW (user-journey, Trigger + Scenarios only), ACT (identity,
  Description + Goals + business preconditions + flows initiated), and CHG
  (when `touches_nodes:` non-empty; behavior-language `modifies[]` only).
  Phase 2 names ENT/CMD/STA structures, enriches FLW + ACT + CHG with
  wiring, and emits FS. Phase 3 writes code, applies CHG deltas, and flips
  proposed→active / draft→approved→merged."

- **PRINCIPLES.md lines 112-113** — same parallel revision in lockstep with
  hard rule #7.

- **WORKFLOW.md Process Flow graph** — Phase 1 box gains conditional CHG
  deliverable (when `touches_nodes:` non-empty).

- **plan.md HARD-GATE** — predecessor revised to "Phase 1 names FLW + ACT;
  Phase 2 names ENT/CMD/STA + enriches FLW + ACT; Phase 3 writes them."
  This plan extends: "Phase 1 names FLW + ACT + CHG (behavior delta when
  `touches_nodes:` non-empty); Phase 2 names ENT/CMD/STA + enriches FLW +
  ACT + CHG (structural delta + adds[] + migration); Phase 3 writes them
  and applies CHG deltas."

- **plan.md mode-boundary framing** — predecessor revised to "Phase 1 Ingests
  journey + identity (FLW + ACT); Phase 2 Ingests structure + wiring
  (enriches FLW + ACT; creates ENT / CMD / STA / …); Phase 3 Merges + Codes."
  Extend: "Phase 1 Ingests journey + identity + modify-intent (FLW + ACT +
  CHG conditional); Phase 2 Ingests structure + wiring (enriches FLW + ACT
  + CHG; creates ENT / CMD / STA / …); Phase 3 Merges + Codes."

- **plan.md § 2 ID-claim protocol** — predecessor added the `Source` column
  rename. This plan adds a CHG row example (Source = FRS-NNN for Phase-1-born
  CHGs; `Op = introduce`). The IDs the CHG's `modifies[]` cites are NOT
  separately listed in `id-claims.md` (the CHG itself is the audit trail
  for those modifications).

- **plan.md § 4 CHG node emission** — **FULL REWRITE.** Predecessor plan
  left this section unchanged. This plan retitles to "CHG node consumption
  + enrichment" and replaces emission semantics with consumption:

  1. Phase 1 FRS authoring (covered in `design.md`) births the per-FRS CHG
     at `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` with behavior-level
     `modifies[]`, `status: draft`, `source_ref: [FRS-NNN]`.
  2. Phase 2 FS authoring declares `consumes_chgs: [CHG-NNN, …]` in
     frontmatter, listing the per-FRS-born CHGs this FS owns. Default:
     consume every CHG born by the FS's constituent FRSs.
  3. Phase 2 FS authoring enriches each consumed CHG with structural before/after
     on `modifies[]`, `adds[]` (mirroring new node ingest), `migration_steps[]`.
     The 2-file touch on enrichment fires the CHG file's `updated:` timestamp.
  4. Phase 2 FS validation exit flips each consumed CHG's `status: draft →
     approved`.
  5. Phase 3 merge applies the CHG deltas and flips `approved → merged`.

  The granularity table at `plan.md:406-415` is retained but reframed — the
  splitting heuristics (same bounded context / risk / reviewer) now apply
  at the FS-consumption decision, not at FRS-birth time. CHG-merge procedure
  per R-CHG-3's "CHG merging" sub-bullet documented here.

- **plan.md § 6 FS validation** — predecessor added a canonical-state
  reconnaissance checklist (R-NEW-10 retroactive-touches_nodes loop-back).
  This plan adds `consumes_chgs:` cardinality check: every CHG-NNN in the
  milestone appears in exactly one FS's `consumes_chgs:`. Double-consumption
  is a Blocker.

- **design.md Pass 1** — predecessor added FLW coverage check + ACT
  existence check. This plan adds `chg-sanity` check (R-CHG-5).

- **design.md Pass 2** — existing cross-FRS sweep (Duplicate-CMD,
  Overlapping ENT, Contradictory invariants) gains CHG-conflict check
  (R-CHG-6).

- **design.md mode declaration** — predecessor revised to "Mode: mixed —
  Query (FRS validates against canonical) + Ingest (FLW + ACT born to
  canonical with `status: proposed`)." Extend: "+ CHG born to canonical
  with `status: draft` when FRS declares `touches_nodes:` non-empty."

- **design.md Phase 1 handoff** — predecessor surfaces FRS + FLW + ACT
  paths at the Phase 1 review handoff. Extend: surface CHG path too (when
  `touches_nodes:` non-empty).

- **frs-validation-rules.md** — predecessor moved FLW coverage to Phase 1.5
  + widened existence-scan + added ACT existence check. This plan adds
  `type: chg-sanity` Pass 1 finding type, severity classification examples,
  and a Common language traps worked example. **Per B2: the
  `Validation findings` table itself is in FRS.md template (predecessor's
  row 3 covers it) + design.md Pass 1, not in this file — no edit to a
  nonexistent table.**

- **CHANGE.md template** — full phase-keyed restructure per R-CHG-4 section
  budget. Retire `target_fs:` field (replaced by `source_ref:` + FS
  `consumes_chgs:` reverse-glob). Drop any "FS emits this CHG" language;
  replace with "FRS births this CHG at Phase 1; FS consumes + enriches at
  Phase 2."

- **FS template** — add new frontmatter field `consumes_chgs: []` (list
  of CHG-NNN IDs this FS owns and enriches). Document field comment:
  "Filled at Phase 2 from the constituent FRSs' Phase-1-born CHGs; default
  = all of them; subset / merge per R-CHG-3." Add a corresponding FS body
  section "Consumed CHGs" (or fold into the existing "Change maps" section
  per Explore verification — section already exists) where the FS lists
  each consumed CHG with a one-line description of its FS-side enrichment.

- **FRS template** — predecessor revised this extensively. This plan adds:
  (a) `chg-sanity` to the `Validation findings` table's `Type` enum
  comment; (b) `touches_nodes:` field comment notes the field now drives
  Phase-1 CHG birth (non-empty ⇒ CHG-NNN allocated alongside FLW / ACT in
  `id-claims.md`).

- **in-flight-nodes.md § CHG mechanics** — full sub-section rewrite. New
  lifecycle: born Phase 1 `draft` (FRS-emitted; behavior delta only) →
  enriched Phase 2 (still `draft`; structural delta + `adds[]` +
  `migration_steps[]` added) → `draft → approved` at FS-validation exit →
  `approved → merged` at Phase 3 merge. New sub-sections "FS-CHG
  consumption" (per R-CHG-3 cardinality + merge procedure) and "CHG
  `status: draft` discriminator" (per R-CHG-7 body-shape rule).

- **change-request.md CR-track CHG path** — CHG path moves identically for
  CR track. CR Container Structure (`change-request.md:57-75`) updated:
  new `chg/` subtree (sibling to `frs/` and `specs/`); old
  `specs/FS-NNN/nodes/changes/` subtree removed from the example tree.
  Phase CR-1 procedure births the per-FRS CHG (delegated through
  `design.md § Phase 1`). Phase CR-2 procedure consumes the CHG
  (delegated through `plan.md § 4`).

- **maintenance-discipline.md** — predecessor authored R-NEW-7 carve-out
  for FLW/ACT body edits during Phase 1.5 round-trip. Extend the carve-out
  to cover **CHG** body edits during Phase 1.5 round-trip when the CHG's
  `status:` stays `draft`. Same tight scope rules apply (Phase 1.5
  round-trip only; Phase-1-born CHG only; status unchanged only; not
  generalizable). Also note Phase 1 CHG birth uses the standard 2-file
  touch (independent from FLW/ACT births).

- **retrieval-discipline.md** — predecessor added FLOW.md + ACTOR.md to
  Phase 1 entry minimal-read-set. This plan adds CHANGE.md (Phase 1 author
  needs the template when `touches_nodes:` non-empty).

- **agent-contracts.md** — predecessor added FRS + FLW + ACT one-session
  authoring. Extend: subagent contracts for FRS authoring may now also
  birth a CHG when `touches_nodes:` is non-empty. Update contract scope
  expectations.

## File-by-file change list (execution order)

| # | File | Change |
|---|---|---|
| 1 | `sdlc/_templates/nodes/CHANGE.md` | Phase-keyed restructure per R-CHG-4's section budget. Retire `target_fs:` frontmatter field (replaced by `source_ref:` + FS `consumes_chgs:` reverse-glob). Phase 1 author writes business-language `modifies[]` + optional milestone-level `invariants_before/after` + optional `removes[]` / `supersedes[]`. Phase 1 author MUST NOT write `adds[]`, `migration_steps[]`, or structural before/after on `modifies[]`. Drop any "FS emits this CHG" language; replace with "FRS births at Phase 1; FS consumes + enriches at Phase 2." Add authoring notes at each section marking Phase 1 vs Phase 2. **Land before rows 2-3 — FRS.md row 3 references the CHG via the birth-on-touches_nodes mechanic; FS.md row 2 consumes it.** |
| 2 | `sdlc/_templates/FS.md` | Add new frontmatter field `consumes_chgs: []` per R-CHG-3 (list of CHG-NNN IDs this FS owns and enriches; filled at Phase 2; default = all CHGs born by the FS's constituent FRSs). Document field comment: cardinality (one CHG ⇒ at most one FS), subset / merge rules. Fold "Consumed CHGs" into the existing "Change maps" body section (per Explore verification — section exists). **Land after row 1 — CHG template must be settled first.** |
| 3 | `sdlc/_templates/FRS.md` | Two additions only (predecessor plan covered the rest): (a) add `chg-sanity` to the `Validation findings` table's `Type` enum comment per R-CHG-5; (b) add a comment at `touches_nodes:` noting the field now drives Phase-1 CHG birth (non-empty ⇒ CHG-NNN allocated alongside FLW / ACT in `id-claims.md`) per R-CHG-1. |
| 4 | `CLAUDE.md` | Revise hard rule #7 to extend predecessor's FLW + ACT acknowledgment to include CHG per "Revised rules" above. |
| 5 | `sdlc/PRINCIPLES.md` | Revise lines 112-113 in lockstep with hard rule #7 (CHG added to Phase 1 ingest list). |
| 6 | `sdlc/WORKFLOW.md` | Update Process Flow graph: Phase 1 box gains conditional CHG deliverable (when `touches_nodes:` non-empty). Update phase-flow table descriptions if needed. |
| 7 | `sdlc/workflow/design.md` | Phase 1 procedure now births CHG when `touches_nodes:` non-empty (in addition to FRS + FLW + ACT from predecessor). **Mode declaration revised** to add "+ CHG (conditional)". **Pass 1 gains `chg-sanity` check per R-CHG-5** with sibling-FRS birth-order processing per υ / M1. **Pass 2 gains CHG-conflict check per R-CHG-6** (sibling CHGs targeting same node / contradictory deltas / contradictory invariants). Phase 1 handoff surfaces CHG path. Minimal-read-set table adds CHANGE.md. |
| 8 | `sdlc/workflow/plan.md` | **§ 4 FULL REWRITE** per R-CHG-1..3 — retitle "CHG node emission" → "CHG node consumption + enrichment"; five-step procedure documented (FRS births → FS consumes → FS enriches → FS validation flips draft→approved → Phase 3 merges). Granularity table retained but reframed (heuristics apply at FS-consumption, not FRS-birth). CHG-merge procedure per R-CHG-3 documented. **§ 2 ID-claim protocol:** add CHG row example (Source = FRS-NNN; Op = introduce). **§ 6 FS validation:** add `consumes_chgs:` cardinality check per R-CHG-3 (every milestone-scoped CHG consumed by exactly one FS). **HARD-GATE + mode-boundary framing revised** per "Revised rules" above. |
| 9 | `sdlc/workflow/frs-validation-rules.md` | Add `type: chg-sanity` Pass 1 check per R-CHG-5. Add to Severity classification table examples. Add worked example in Common language traps (`"Major: chg-sanity — FRS adds fault path in AC-03 but CHG-007's modifies[] does not describe FLW-001's fault-path extension."`). **Per B2: the `Validation findings` table itself is NOT in this file — its `Type` enum lives in FRS.md template (row 3) + design.md Pass 1 (row 7) — do not attempt to edit a nonexistent table here.** Document sibling-FRS birth-order rule per υ. |
| 10 | `sdlc/workflow/in-flight-nodes.md` | **§ CHG mechanics full rewrite** per R-CHG-1..4: new lifecycle = born Phase 1 `draft` (FRS-emitted; behavior delta only) → enriched Phase 2 (still `draft`; structural delta + `adds[]` + `migration_steps[]` added) → `draft → approved` at FS-validation exit → `approved → merged` at Phase 3. **New sub-section "FS-CHG consumption"** per R-CHG-3 documenting `consumes_chgs:` cardinality (one CHG per FS), subset consumption, and the CHG-merge procedure (sibling CHG fold; deprecate unused ID; no reuse). **New sub-section "CHG `status: draft` discriminator"** per R-CHG-7 (body-shape rule: not yet listed in any FS's `consumes_chgs:` ⇒ Phase-1-bare; listed + structural sections populated ⇒ Phase-2-wired). |
| 11 | `sdlc/workflow/retrieval-discipline.md` | Add CHANGE.md to Phase 1 entry minimal-read-set (when author detects `touches_nodes:` non-empty). Document as conditional load — pure-addition FRSs don't need CHANGE.md. |
| 12 | `sdlc/workflow/maintenance-discipline.md` | Extend predecessor's R-NEW-7 carve-out to cover CHG body edits during Phase 1.5 round-trip when `status:` stays `draft`. Same tight scope rules apply. Document in the existing "Phase 1.5 round-trip body-edit exception" section. Note Phase 1 CHG birth uses the standard 2-file touch (CHG file + `nodes/<type>/index.md` if one exists; if not, note the gap explicitly — CHG today has no per-type `index.md`). |
| 13 | `sdlc/workflow/change-request.md` | **CR Container Structure tree updated** per R-CHG-2: new `chg/` subtree (sibling to `frs/` and `specs/`); old `specs/FS-NNN/nodes/changes/` subtree removed from example tree. Phase CR-1 procedure births per-FRS CHG via delegation to `design.md § Phase 1`. Phase CR-2 procedure consumes CHG via delegation to `plan.md § 4` rewrite. Pre-cutover layout retained as a frozen "pre-2026-05-17 layout" reference in a callout (so future readers can identify legacy CHGs). |
| 14 | `sdlc/workflow/agent-contracts.md` | Extend predecessor's FRS + FLW + ACT one-session authoring contract to include conditional CHG (when `touches_nodes:` non-empty). Update subagent contract expectations: FRS-authoring subagent may emit CHG as a fourth artifact in the same session. |
| 15 | Sweep | grep `sdlc/` for: "FS emits CHG", "FS-emitted CHG", "FS-emits the CHG", "the FS emits a CHG node", `specs/FS-NNN/nodes/changes/`, `target_fs:` (in CHANGE.md context). Reconcile all to "FRS births at Phase 1; FS consumes at Phase 2 via `consumes_chgs:`." Also grep for any references to the old FS-scoped CHG path; reconcile to the new milestone-scoped `chg/` path. |
| 16 | Plan close | Mark this plan `status: done`; commit |

## Migration / grandfather strategy

- **No CHG files currently exist in the codebase** (verified via Explore at
  PLAN-flw-phase1-ingest.md drafting time). Migration debt at cutover is
  zero — no file moves, no `target_fs:` retrofits needed.

- **In-flight FRSs / FSs at the time of this plan's cutover:**

  - **FS-001 (`changes: []`) and FS-002 (`changes: []`)** — pure additions,
    no CHG emitted. Unaffected by this plan.
  - **FRS-003 (`status: approved`, Phase 1.5-cleared under old model,
    awaiting Phase 2)** — grandfathered. If FRS-003 declares non-empty
    `touches_nodes:`, FS-003 emits the CHG at Phase 2 under the **old model**
    (FS-scoped path, `target_fs:` field present). Phase 2 is the
    grandfather boundary: the FS author writes the CHG once, then the next
    milestone uses the new model. The grandfather CHG is the only legacy
    artifact this plan needs to accommodate; row 13's frozen "pre-2026-05-17
    layout" reference covers reader interpretation.
  - **Any other in-flight FRS at the time this plan starts** — finishes
    its current phase under whichever model that phase started. Switch
    model at next phase entry, not mid-phase.

- **Cutover marker** — date this plan's `status: done` is the cutover. New
  FRSs authored after that date use the new CHG mechanics.

- **No reverse-port of pre-cutover CHGs** — explicitly grandfathered; any
  legacy CHG at the old FS-scoped path stays there until naturally retired
  (status: merged → archived).

## Risks

- **Phase 1 scope creep (CHG layer).** Predecessor plan added FLW + ACT
  authoring to Phase 1. This plan adds conditional CHG authoring on top.
  Worst-case Phase 1 session: FRS + FLW + ACT + CHG (4 artifacts in 4
  language registers: intent / journey / identity / behavior-delta).
  Mitigation: R-CHG-4's Phase-1 budget is tight (behavior `modifies[]` + 0-2
  optional fields); CHG births only when `touches_nodes:` non-empty (most
  pure-addition FRSs skip it).

- **Phase-1 CHG behavior-language discipline.** Phase-1-bare CHG `modifies[]`
  entries must use business-language deltas ("FLW-001 gains a fault path
  when X"), not structural IDs ("FLW-001's Sequence gains step 4 invoking
  CMD-007"). Authors used to the Phase-2 idiom will reach for structural
  language. Mitigation: CHANGE.md authoring notes at `modifies[]` explicitly
  warn; Phase 1.5 Pass 1 `chg-sanity` catches violations.

- **CHG ID double-allocation across sibling FRSs.** Two sibling FRSs in the
  same milestone, both with non-empty `touches_nodes:`, allocate CHG-NNN and
  CHG-NNN+1 independently at Phase 1. If both end up targeting the same
  canonical FLW with overlapping or contradictory deltas, the conflict
  surfaces at Phase 1.5 Pass 2 (per R-CHG-6) rather than at Phase 2
  FS-consumption — earlier and structurally appropriate.

- **`chg-sanity` Pass 1 ordering complexity.** Per υ / M1, Pass 1 processes
  sibling FRSs in birth order; chg-sanity re-runs on cited sibling FLW/ACT
  body changes. Risk: if many siblings have overlapping modify-intents,
  re-runs cascade. Mitigation: re-runs are scoped to affected CHGs only
  (not full Pass 1); birth-order processing is deterministic; loops bounded
  by milestone FRS count.

- **FS `consumes_chgs:` cardinality enforcement.** R-CHG-3 says one CHG
  belongs to at most one FS. If two sibling FSs both list CHG-NNN in
  `consumes_chgs:`, the milestone has a double-consumption bug. Mitigation:
  Phase 2 FS validation (plan.md § 6) check + Phase 3 merge preflight
  (globs every `consumes_chgs:` across the milestone; aborts merge if
  double-consumption detected). Per "Revised rules" above.

- **CHG path migration during cutover.** Pre-cutover CHGs (none currently
  exist) would live at the old FS-scoped path; new CHGs at the milestone-scoped
  path. Workflow files that reference the old path (plan.md § 4, in-flight-nodes.md
  § CHG mechanics, change-request.md CR Container Structure) need careful
  reconciliation — row 15 sweep covers this. Risk: a workflow file
  referencing the old path silently misleads a future Phase-2 author.
  Mitigation: row 15's expanded sweep checklist; row 13's pre-cutover
  layout reference retained as a frozen callout.

- **`target_fs:` retirement signal.** No CHG files exist that need
  retrofitting, so retirement is template-level only. Risk: if a future
  legacy CHG surfaces (e.g., archaeological recovery of an in-flight branch),
  its `target_fs:` reference is ambiguous. Mitigation: row 1's authoring
  notes document the retirement reason; row 13's pre-cutover layout
  callout flags `target_fs:` as legacy.

- **R-NEW-7 carve-out extension scope creep.** Predecessor plan introduced
  the 1-file body-edit carve-out tightly scoped to FLW/ACT. This plan
  extends to CHG. Each extension is fine in isolation, but successive
  extensions risk normalizing the carve-out as a general "in-flight body
  edit" rule. Mitigation: row 12 re-states the precedent-risk clause; each
  extension is type-named (FLW/ACT in predecessor; CHG here) — not
  generalized as "any in-flight node body."

- **Plan execution drift.** Sixteen rows, sequenced. If interrupted
  mid-execution, the codebase is inconsistent. Mitigation: execute in
  dependency order (CHANGE.md template → FS.md template → FRS.md update →
  doctrinal docs → flow files → rule books → bootstrap + agent-contracts →
  sweep); commit after each major chunk.

- **Predecessor-plan dependency.** This plan depends on PLAN-flw-phase1-ingest.md
  being `status: done`. If executed before the predecessor lands, many
  "Revised rules" entries (CLAUDE.md hard rule #7, plan.md HARD-GATE,
  design.md mode declaration, etc.) target text that hasn't been revised
  to its predecessor-plan-era form yet — edits will diverge. Mitigation:
  this plan's frontmatter `depends_on:` is the gate; do not start row 1
  until predecessor's row 18 is complete and committed.

## Progress checklist

Each line is one durable outcome. Mark `[x]` only after the file is saved
and self-consistent. Mark this plan `status: done` after the final sweep.

- [x] 1. `sdlc/_templates/nodes/CHANGE.md` updated (phase-keyed section budget per R-CHG-4; Phase 1 carries business-language `modifies[]` + optional invariant deltas + optional retirements; Phase 2 enriches with structural before/after + `adds[]` + `migration_steps[]`; **`target_fs:` field retired** per τ; "FS emits CHG" language removed in favor of "FRS births at Phase 1; FS consumes + enriches at Phase 2")
- [x] 2. `sdlc/_templates/FS.md` updated (new frontmatter field `consumes_chgs: []` added per R-CHG-3; "Consumed CHGs" folded into existing "Change maps" body section). **Discretionary extra: legacy `changes: []` field also retired (commented out) — out of plan scope but consistent with FS-emission retirement.**
- [x] 3. `sdlc/_templates/FRS.md` updated (two additions: `chg-sanity` added to `Validation findings` Type enum per R-CHG-5; `touches_nodes:` comment notes Phase-1 CHG-birth driver per R-CHG-1)
- [x] 4. `CLAUDE.md` hard rule #7 revised (CHG added to Phase 1 ingest scope)
- [x] 5. `sdlc/PRINCIPLES.md` lines 112-113 revised in lockstep. **Discretionary extra: anti-pattern at line 161 (canonical-node-edit rule) also updated — old CHG path corrected to new milestone-scoped path.**
- [x] 6. `sdlc/WORKFLOW.md` Process Flow graph updated (Phase 1 emits CHG conditional on `touches_nodes:` non-empty); Overview prose + In-flight nodes summary + Knowledge base layout reference also reconciled.
- [x] 7. `sdlc/workflow/design.md` Phase 1 + 1.5 procedures updated (CHG birth when `touches_nodes:` non-empty per R-CHG-1; mode declaration extended; Phase 1 handoff surfaces CHG path; minimal-read-set adds CHANGE.md; **Pass 1 gains `chg-sanity` check #8 per R-CHG-5 with sibling-FRS birth-order processing per υ/M1**; **Pass 2 gains CHG-conflict check per R-CHG-6**). Note: chg-sanity is check #8 not #6 — predecessor plan added flw-coverage #6 and phase-1-bare-body-shape #7.
- [x] 8. `sdlc/workflow/plan.md` updated (**§ 4 full rewrite per R-CHG-1..3** — emission → consumption + enrichment, five-step procedure; granularity table retained but reframed at FS-consumption time; **§ 2 ID-claim:** CHG row example added; **§ 6 FS validation:** `consumes_chgs:` cardinality check per R-CHG-3; HARD-GATE + mode-boundary framing extended; authoring sequence step 3 reframed from "emit CHG" to "declare consumes_chgs + enrich"; description + Overview + section-routing anchor renamed)
- [x] 9. `sdlc/workflow/frs-validation-rules.md` updated (`type: chg-sanity` first-class type added per R-CHG-5; Pass 1 check count 7→8; severity classification examples expanded for chg-sanity Major/Minor + Phase-1-bare-body-shape CHG Blocker; Type-enum paragraph extended; Common language traps worked example added with sibling-FRS birth-order rule)
- [x] 10. `sdlc/workflow/in-flight-nodes.md` **§ CHG mechanics full rewrite per R-CHG-1..4** (Phase 1 birth → Phase 2 enrich → Phase 2 close approve → Phase 3 merge); **§ FS-CHG consumption sub-section added per R-CHG-3** (cardinality, subset, merge); **§ CHG `status: draft` discriminator sub-section added per R-CHG-7** (body-shape rule); Abandonment section extended to include CHG.
- [x] 11. `sdlc/workflow/retrieval-discipline.md` CHANGE.md added to Phase 1 entry minimal-read-set (conditional on `touches_nodes:` non-empty); four-artifact authoring scope documented.
- [x] 12. `sdlc/workflow/maintenance-discipline.md` R-NEW-7 carve-out extended to cover CHG body edits during Phase 1.5 round-trip; Phase 1 CHG 1-file touch noted (CHG has no per-type `index.md` today); CHG `index.md` gap documented; stale CHG-path reference in event-driven list fixed.
- [x] 13. `sdlc/workflow/change-request.md` updated (CR Container Structure tree: new `chg/` subtree sibling to `frs/` and `specs/`; old `specs/FS-NNN/nodes/changes/` removed from example; pre-cutover layout retained as frozen "Pre-2026-05-17 layout" callout); CR-1 procedure births per-FRS CHG via delegation; CR-2 path mapping updated; FLW+ACT+CHG triple noted.
- [x] 14. `sdlc/workflow/agent-contracts.md` extended (Phase 1.5 Pass 1 check count 7→8 with chg-sanity; Phase 1 authoring section retitled FRS+FLW+ACT+CHG; one-shot dispatch acceptable but not required).
- [x] 15. Sweep across `sdlc/` for stale CHG mechanics — reconciled in: `KB-LAYOUT.md` (CHG path), `BOUNDARY.md` (3 locations: container layout / twelve-types description / frontmatter contract / canonical-tree note), `vcs-migration.md` (2 locations: migration table + nodes-discoveries paragraph), `implementation.md` (5 locations: context-load steps 1+3, Stage 1 cardinality preflight, CHG status-flip path, prerequisites), `qa-gate.md` (status-flip line), `design.md` (existence-resolution prose), `MILESTONE.md` template (tree layout), `OVERVIEW-ROADMAP.md` (glob pattern), `regenerate-roadmap.sh` (Stuck CHG glob).
- [x] 16. Plan `status: done`. Ready for commit (CLAUDE.md hard rule #12 — awaiting explicit authorization).

## Out of scope

- FLW / ACT lifecycle — covered by predecessor plan (PLAN-flw-phase1-ingest.md).
- ENT / CMD / STA / INT / CON / DEC / PERM / QRY lifecycle — unchanged
  (Phase 2 birth, Phase 3 activate).
- Test suite codegen (`test-suite-codegen.md`) — unchanged.
- QA Gate (`qa-gate.md`) — unchanged.
- Milestone close procedure — unchanged.
- Backwards-port of pre-cutover CHGs — explicitly grandfathered (no CHGs
  currently exist; future legacy CHGs accommodated via row 13 callout).
- Standards / CCC / ADR authoring — unchanged.
- **Multi-CHG-per-FRS** — not permitted. One CHG per FRS at Phase 1 (parallel
  to `produced_flw:` / `produced_actor:` scalar shape). If an FRS legitimately
  needs two separate modify-intent containers (different bounded contexts,
  different reviewers), split the FRS. The FS-time CHG-merge procedure
  (R-CHG-3) handles the inverse case (two FRSs' CHGs targeting same context
  fold into one).
- **R-NEW-7 carve-out generalization** — still deferred per predecessor plan's
  out-of-scope. This plan extends the carve-out to CHG by type, not by
  generalization.
- **CHG per-type `index.md` introduction** — CHG today has no per-type
  `index.md`. This plan documents the gap (row 12) but does not introduce
  one. Future plan if the gap proves painful.

## Execution note

When you're ready and the predecessor plan is `status: done`, say "execute
the CHG plan" (or pick a specific row from the checklist). Each row is one
outcome; I'll mark it `[x]` here as it completes, and pause for review at
natural breakpoints (after row 6, after row 10, after row 15). No file
edits until you give the word.
