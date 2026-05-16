---
title: Move FLW + ACT authoring into Phase 1 (journey-of-record), enrich at Phase 2
status: done                    # proposed | approved | in-progress | done | abandoned
kind: workflow-evolution
created: 2026-05-16
revised: 2026-05-17
owner: bikendra.thapaliya@amniltech.com
scope: sdlc engine + project templates (FLW + ACT only — CHG cutover split to follow-on plan)
related:
  - sdlc/_templates/FRS.md
  - sdlc/_templates/nodes/FLOW.md
  - sdlc/_templates/nodes/ACTOR.md
  - sdlc/WORKFLOW.md
  - sdlc/PRINCIPLES.md
  - CLAUDE.md (hard rule #7)
  - sdlc/workflow/design.md
  - sdlc/workflow/plan.md
  - sdlc/workflow/frs-validation-rules.md
  - sdlc/workflow/in-flight-nodes.md
  - sdlc/workflow/maintenance-discipline.md
  - sdlc/workflow/agent-contracts.md
  - sdlc/workflow/new-component-bootstrap.md
---

# Plan — FLW + ACT as Phase 1 journey-of-record, enriched at Phase 2

## Context

Current model: FRS at Phase 1 makes forward **claims** about FLW and ACT IDs
that don't exist yet; both nodes are written at Phase 2 ingest. This produces
two structural inconsistencies:

1. FRS template line 25-27 says "FRS describes exactly one user-journey",
   but line 62 says "detailed behavior belongs in canonical nodes" — and
   those nodes don't exist at Phase 1. The same applies to the Actors
   section (FRS.md line 38), which references `ACT-NNN` IDs that may not
   exist yet.
2. Phase 1.5 validation gate cannot verify AC→scenario coverage against
   real anchors (the FLW isn't written yet), and cannot verify the Actor
   reference resolves to a real node.

Resolution: **FLW and ACT nodes are born at Phase 1** in canonical with
`status: proposed`. FLW carries journey content only (Trigger + Scenarios);
ACT carries identity content only (Description + Goals + business
Preconditions + Flows initiated). Phase 2 enriches the same files with DDD
wiring — FLW gets `related:` ENT/CMD refs + Sequence + Branches + Compensating
actions + structural Postconditions + Decisions; ACT gets Commands they
trigger + Queries they issue + PERM-NNN refs in Preconditions. Phase 3 flips
both `proposed → active` and writes code.

This is a workflow change to the Query/Ingest split: Phase 1 becomes
**Ingest (journey + identity)** in addition to Query (validate against
canonical); Phase 2 remains Ingest (structural decomposition + FS).

## Scope — what landed here, what split out

**In scope (this plan):** FLW + ACT cutover to Phase 1 birth.

**Split to follow-on plan:** CHG-at-Phase-1 cutover (CHG node born by FRS,
consumed by FS via `consumes_chgs:`, repathed to milestone-scoped). The case
is structurally identical to FLW/ACT (forward-claim disease cured by Phase-1
birth) but bundling adds ~6 file rows and a CHG mechanics rewrite — execution
risk grows non-linearly. CHG mechanics in this plan stay as-is (FS-emitted at
Phase 2 per old model). Carryforward to follow-on plan: original OQs ν–σ +
R-NEW-11..17 + rows 2a / 3a / CHG content + `target_fs:` retirement + chg-sanity
Pass 1 + CHG path migration. Pre-resolved decisions transfer with no
re-litigation.

## Revision history

- **2026-05-16:** original draft.
- **2026-05-17 morning:** second-round review surfaced 4 blockers + 5 majors
  → resolved as OQs η–μ + R-NEW-7..10; later widened with CHG-NNN-at-Phase-1
  amendment (OQs ν–σ + R-NEW-11..17).
- **2026-05-17 afternoon:** third-round review surfaced 5 blockers + 4 majors.
  Resolved:
  - **B1** — ACTOR.md section order: R-NEW-2a budget table re-ordered to
    match canonical (Description → Goals → Preconditions → Commands → Queries
    → Flows initiated). No template re-ordering.
  - **B2** — Row 9 phantom targets: `Validation findings` table and "How
    findings appear" section don't exist in `frs-validation-rules.md`. Row 9
    scope corrected.
  - **B3** — R-NEW-7 1-file body-edit carve-out: explicitly authored as a
    new doctrinal rule in `maintenance-discipline.md` (was an unflagged
    carve-out). Scope tightened.
  - **B5** — FRS-003 / FLOW.md template ordering: FLW-003 created at Phase 2
    with audit marker `created_under: pre-2026-05-17`. Per option (c) —
    document divergence in row 1 + grandfather section.
  - **M2** — `shares_nodes:` field retired. Sharing routes through prose
    references only. `touches_nodes:` stays modify-only by author judgment.
    OQ ε and OQ κ resolutions revised. R-NEW-9 removed.
  - **M3** — `agent-contracts.md` and `new-component-bootstrap.md` added to
    file-by-file scope (new rows 15, 16).
  - **M4** — Retroactive `touches_nodes:` at Phase 2 → loop back to Phase 1.5.
    New R-NEW-10. Per option (a) — purity over pragmatism.
  - **Split decision** — CHG-at-Phase-1 cutover deferred to follow-on plan
    (per § Scope above).

## Cutover summary

| Phase | Artifacts born | Artifacts enriched | Status flips |
|---|---|---|---|
| **Phase 1** (Design — Query + Ingest) | FRS, FLW (Trigger + Scenarios, business language), ACT (Description + Goals + business Preconditions + Flows initiated; only when FRS introduces a new role) | — | FLW / ACT land in canonical at birth with `status: proposed` |
| **Phase 1.5** (Validation gate) | OQ-NNN files for deferred findings | — | FRS `draft → approved` on PASS / PASS_WITH_MAJORS |
| **Phase 2** (Plan — Ingest) | FS, ENT, CMD, STA, CON, INT, DEC, PERM, QRY (new nodes with `status: proposed`); CHG (FS-emitted per old model, unchanged here) | FLW (adds `related:`, Sequence, Branches, Compensating, structural Postconditions, Decisions); ACT (adds `related:`, Commands they trigger, Queries they issue, PERM-NNN refs) | — |
| **Phase 3** (Implementation — Merge + Code) | code; test specs (via QA track flows) | canonical nodes | FLW / ACT / ENT / CMD / STA / … `proposed → active` |

FRS frontmatter field roles:

| Field | Scope | Phase 1 lifecycle effect |
|---|---|---|
| `produced_flw:` (scalar) | the one new FLW this FRS introduces; blank when reusing | FLW file created in canonical |
| `produced_actor:` (scalar) | the one new ACT this FRS introduces; blank when reusing | ACT file created in canonical |
| `produces_nodes:` (list) | all other new node IDs (ENT / CMD / STA / CON / INT / DEC / PERM / QRY) | — (Phase 2 births these) |
| `touches_nodes:` (list) | canonical FLW / ACT / etc. this FRS modifies | — (CHG mechanics unchanged here; FS-emitted at Phase 2 per old model) |

Read-only references to existing canonical FLW / ACT live in **prose only**
(ACs, BRs, Brownfield notes). No frontmatter declaration. `touches_nodes:`
stays modify-only by author judgment.

## Decision summary

| Aspect | Decision |
|---|---|
| FLW birth | Phase 1, in canonical, `status: proposed`, Trigger + Scenarios only |
| FLW enrichment | Phase 2, same file, add `related:` + Sequence + Branches + Compensating actions + structural Postconditions + Decisions; status unchanged |
| FLW activation | Phase 3, status `proposed → active` |
| ACT birth | Phase 1, in canonical, `status: proposed`, Description + Goals + business Preconditions + Flows initiated; only when FRS introduces a new actor |
| ACT enrichment | Phase 2, same file, add Commands triggered + Queries issued + PERM-NNN refs in Preconditions; status unchanged |
| ACT activation | Phase 3, status `proposed → active` |
| FRS-FLW cardinality | strict 1:1 production; `touches_nodes:` for modify-intent (existing canonical); sharing via prose |
| FRS-ACT cardinality | 0..1 new actor per FRS (most reuse); `touches_nodes:` for modify-intent; sharing via prose |
| FRS Behavior section | Dropped; FRS = intent, FLW = behavior |
| `produces_nodes` split | scalar `produced_flw: FLW-NNN` (real at Phase 1) + scalar `produced_actor: ACT-NNN` (real at Phase 1, blank when reusing) + list `produces_nodes:` (claimed Phase 1, real Phase 2 — ENT/CMD/STA/CON/INT/DEC/PERM/QRY) |
| FRS Test plan view | Dropped; TC traceability lives on TC file's `Traces to:` line — regenerable via grep |
| Phase 1.5 gate | Adds FLW coverage check (3 scenarios, no wiring) + ACT existence check (when `produced_actor:` set); AC→scenario verified against real anchors; existence scan widened to match FLW scenario signatures |
| Phase 1.5 round-trip | In-place body edit on canonical FLW / ACT during FRS revision; 1-file touch (status unchanged, no `index.md` re-sync) per **new** carve-out R-NEW-7. Full FRS abandonment uses existing `proposed → deprecated` per `in-flight-nodes.md` |
| `status: proposed` discriminator | Body-shape rule per θ: empty `related: []` ⇒ Phase-1-bare; populated ⇒ Phase-2-wired (or active). One-off exemption for FRS-003's FLW-003 via `created_under:` audit marker per B5 |
| ACT `related:` at Phase 1 | Empty per ι; Phase-1 ACT cites FLW in body-only ("Flows they initiate"). Both ACT→FLW and FLW→ACT frontmatter `related:` cites land at Phase 2 |
| Sharing existing FLW / ACT | Prose references only (no frontmatter field). FRS body (AC / BR / Brownfield) names the canonical FLW / ACT inline; lint does not enforce |
| `produces_nodes:` scope | All other new node IDs — ENT, CMD, STA, CON, INT, DEC, PERM, QRY (every type except FLW and ACT) |
| id-claims schema | `FS` column renamed to `Source`, accepts FRS-NNN (Phase 1 FLW / ACT) or FS-NNN (Phase 2 ENT / CMD / STA / …). Lazy-create timing shifts from "first FS claim" to "first FRS or FS claim". Per ι |
| design.md mode declaration | Revised from "Mode: Validation (Query). This flow does not write DDD nodes." to "Mode: mixed — Query (FRS validates against canonical) + Ingest (FLW + ACT born to canonical with `status: proposed`)." Per λ |
| plan.md mode boundary framing | "File-disjoint mode boundaries: design.md Queries / plan.md Ingests" becomes "Phase 1 Ingests journey + identity; Phase 2 Ingests structure + wiring; Phase 3 Merges + Codes." HARD-GATE gains parallel note for Phase 1 FLW / ACT structures. Per λ |
| test-plan-ingest.md HARD-GATE wording | "Every new FLW node introduced by this FS" → "Every FLW node referenced by this FS's FRS scope (whether FRS-introduced at Phase 1 or pre-existing)". Per μ |
| Retroactive `touches_nodes:` at Phase 2 | Loop back to Phase 1.5 — FRS revision adds missing entry; Phase 1.5 reruns Pass 1; Phase 2 resumes only after loop-back clears. Per τ / R-NEW-10. (Pragmatic retro-allowance rejected — preserves Phase 1.5 as the single source of truth for FRS claims) |

## Open decisions — resolved

| OQ | Pick | Rationale |
|---|---|---|
| α — FRS Behavior section | **α1: Drop** | Cleanest split. FRS = intent (use case + ACs + BRs + brownfield); FLW = journey behavior. Removes duplication risk. |
| β — `produces_nodes` split | **β2: Split, with `produced_flw:` as scalar** | Surfaces the timing distinction structurally — FLW ID real at Phase 1, ENT/CMD IDs claimed until Phase 2. Scalar enforces R-NEW-1's strict 1:1. |
| γ — FRS Test plan view | **γ3: Drop the table entirely** | Section was a restatement under the old model. TC's own `Traces to:` line carries the trace; reverse-index is a grep when needed. |
| δ — Phase 1.5 FLW coverage check | **δ1: Add to Phase 1.5** | Aligns validation timing with the model — FLW exists at Phase 1. Catches issues before the `/clear`. |
| ε — Cross-FRS FLW sharing | **ε4 (revised post-M2): 1:1 production default; sharing via prose references only** | Original ε2 picked "sharing via `touches_nodes`" but that overloaded the field with modify-and-share semantics; OQ κ then introduced `shares_nodes:` to disambiguate. M2 retires `shares_nodes:` as fuzzy/redundant — sharing now lives in prose only (FRS AC / BR / Brownfield body names the canonical FLW / ACT inline). `touches_nodes:` stays modify-only by author judgment. No frontmatter field for share. Matches FRS template's "exactly one user-journey" rule. Audit hook: text grep. |
| ζ — ACT cardinality + field shape | **ζ1: 0..1 new ACT per FRS, scalar `produced_actor:`** | Most FRSs reuse existing actors. Scalar enforces "at most one new actor per FRS — split if two new roles needed", parallel to `produced_flw:`. Blank value (`produced_actor:` with nothing after the colon) means "reuses existing ACT via `touches_nodes`". Matches the `cr:` / `milestone:` blank-value convention in FRS.md. Phase 1.5 existence check treats blank as "no ACT to verify"; non-blank requires the ACT file to exist. |
| η — Phase 1.5 FAIL handling for Phase-1-born FLW / ACT | **η1: In-place body edit on canonical; full abandonment via existing `proposed → deprecated`** | FRS revision during Phase 1.5 round-trip edits the canonical FLW / ACT body in place — 1-file touch (status unchanged) per R-NEW-7 (new carve-out per B3). Status-change events (Phase 3 activation, abandonment) keep the 2-file touch. Full FRS abandonment uses existing `in-flight-nodes.md § Abandonment` (`proposed → deprecated`). FRS split-and-replace = retire the original FLW / ACT as deprecated and allocate new IDs for the splits. No new lifecycle vocabulary. |
| θ — `status: proposed` discriminator | **θ3: Body-shape inference, no new frontmatter field** | The R-NEW-2 / R-NEW-2a section budgets make `related:` the natural discriminator (empty at Phase 1, populated at Phase 2). No new vocabulary. Reduces churn on existing canonical readers. **One-off exemption:** FRS-003's FLW-003 (grandfathered) carries `created_under: pre-2026-05-17` per B5 — readers skip the discriminator when this marker is present. |
| ι — Bidirectional `related:` asymmetry at Phase 1 | **ι1: Defer all `related:` cites to Phase 2; body-only cites at Phase 1** | R-NEW-2a's original "`related:` partial (FLW only)" violated (2+N) bidirectional discipline. Resolution: both FLW and ACT carry empty `related: []` at Phase 1. Phase-1 cross-cites stay in body — FLW Trigger says "Actor: ACT-NNN"; ACT "Flows they initiate" lists "FLW-NNN — …". Phase 2 enrichment fires both `related: [...]` populations simultaneously. Makes θ's body-shape discriminator uniform across FLW and ACT. |
| κ — `touches_nodes:` semantic shift in ε2 | **κ4 (revised post-M2): retire `shares_nodes:`; `touches_nodes:` stays modify-only by author judgment; FRS.md template doc note** | Original κ2 introduced `shares_nodes:`. M2 retires it: the field's use case ("AC cites FLW-001#happy") was structurally questionable (ACs should be business-language and self-contained), and an optional + fuzzy + prose-redundant frontmatter field invites mis-use. Final rule: sharing is prose-only; `touches_nodes:` is modify-only by author judgment (the existing FS-emitted CHG mechanism captures the modify-intent audit trail). Doc note in FRS.md template warns: if you're tempted to list a node in `touches_nodes:` for read-only purposes, drop it and reference inline in the FRS body. |
| λ — Mode-taxonomy ripple | **λ1: Revise design.md mode declaration + plan.md mode-boundary framing + HARD-GATE** | design.md frontmatter says "Mode: Validation (Query). This flow does not write DDD nodes" (false post-cutover); plan.md frames the flows as "design.md Queries / plan.md Ingests" (Phase 1 now also Ingests); plan.md HARD-GATE says "Phase 2 names structures; Phase 3 writes them" (Phase 1 now also names FLW + ACT structures). All three need parallel revision. |
| μ — test-plan-ingest.md scope | **μ2: Wording revision, not no-op** | HARD-GATE at `test-plan-ingest.md:14-17` says "Every new FLW node introduced by this FS" — under new model FLW is FRS-introduced at Phase 1, FS-enriched at Phase 2. Reword to "every FLW node referenced by this FS's FRS scope … is Phase-2-wired (per θ discriminator)." Entry contract from `plan.md` (FS validation passed) already implies Phase-2-wired, so the gate is doctrinal rather than gate-novel — but wording must match the new model. |
| τ — Retroactive `touches_nodes:` at Phase 2 | **τ1: Loop back to Phase 1.5** | When Phase 2 enrichment surfaces that the FRS modifies a canonical node not declared at Phase 1, the FRS's `touches_nodes:` is incomplete — a claim change. Two options: (a) Loop back to Phase 1.5 (FRS revision adds entry, Phase 1.5 reruns Pass 1 on new entry, Phase 2 resumes after clear); (b) Allow Phase-2 retro-declaration with audit marker. Option (a) wins: Phase 1.5 is the single source of truth for FRS claim validation; allowing retro-declaration weakens the gate and silently routes around it. Cost: a Phase-2 author who discovers an undeclared modify-intent triggers a small loop-back. Mitigation: the Phase-2 author is encouraged (in plan.md § 4) to do canonical-state reconnaissance at the start of enrichment before declaring "no new `touches_nodes:`." |

## New rules

- **R-NEW-1** — At Phase 1, exactly one FLW is born per FRS that introduces a new
  user-journey, and at most one ACT is born per FRS that introduces a new actor
  role. Existing canonical FLWs and ACTs the FRS modifies are referenced via
  `touches_nodes:` (FS-emitted CHG, Phase 3 apply — unchanged here). Existing
  canonical FLWs and ACTs the FRS references read-only are named inline in the
  FRS body (AC / BR / Brownfield) — no frontmatter declaration. Multi-FLW
  *production* FRSs are not permitted — split into separate FRSs. Multi-ACT
  *production* FRSs are not permitted — split when introducing two new roles.
  Multi-FLW *touch* (modify-intent) is unrestricted.
- **R-NEW-2** — A Phase-1-born FLW MUST contain **Trigger** (actor action only —
  no `Initiating command: CMD-NNN` line) and three **Scenarios** (happy / edge /
  fault, Given/When/Then). It MUST NOT contain `related:` ENT/CMD/STA refs,
  Sequence, Branches and gates, Compensating actions, structural Postconditions
  (ENT/STA/downstream FLW refs), or inline Decisions. Phase-1 FLW section budget:

  | FLOW.md section | Phase 1 | Phase 2 | Notes |
  |---|---|---|---|
  | Trigger | ✅ required | — | Actor action only; drop the `Initiating command: CMD-NNN` line at Phase 1 |
  | Scenarios (happy/edge/fault) | ✅ required | — | Given/When/Then in business language; no ENT/CMD/STA IDs |
  | Brownfield notes | ✅ optional | — | Author observation only |
  | Sequence | — | ✅ required | Lists CMD-NNN / DEC-NNN — structure-naming, Phase 2 |
  | Branches and gates | — | ✅ required | References Sequence step numbers |
  | Compensating actions | — | ✅ required (when `mode: async`) | Requires named CMDs |
  | Postconditions | — | ✅ required | References ENT/STA/downstream FLW |
  | Decisions (inline DEC) | — | ✅ optional | Node-shaped behavior decisions |
  | `related:` frontmatter | — | ✅ filled | CMD/STA/ACT IDs |

  Authoring Phase-1 Scenarios uses business terms ("a registered user with
  verified email"), not node IDs ("an ENT-001 in STA-002.Verified state"). This
  is the discipline shift Phase 1 enforces.
- **R-NEW-2a** — A Phase-1-born ACT MUST contain **Description** (who in domain
  terms), **Goals** (author intent), **Preconditions to act** at business level
  ("must be authenticated"), and **Flows they initiate** (FLW-NNN IDs — real
  because FLW is also Phase 1). It MUST NOT contain **Commands they trigger**
  (CMD-NNN), **Queries they issue** (QRY-NNN), or PERM-NNN refs in Preconditions.
  Phase-1 ACT section budget (canonical template order — Description first,
  Flows initiated last, matching `sdlc/_templates/nodes/ACTOR.md`):

  | ACTOR.md section | Phase 1 | Phase 2 | Notes |
  |---|---|---|---|
  | Description | ✅ required | — | Who in domain terms |
  | Goals | ✅ required | — | Author intent — what they want to accomplish |
  | Preconditions to act | ✅ required (business-level) | enriched | Phase 1: "must be authenticated"; Phase 2: PERM-NNN refs added |
  | Commands they trigger | — | ✅ required | CMD-NNN |
  | Queries they issue | — | ✅ optional | QRY-NNN |
  | Flows they initiate | ✅ required | — | FLW-NNN — real because FLW is also Phase 1 |
  | `related:` frontmatter | — | ✅ filled | All cites deferred to Phase 2 per ι; Phase-1 ACT body cites FLW in "Flows they initiate" only |

  Authoring Phase-1 ACT uses business-language preconditions ("must have
  completed onboarding"), not PERM-NNN IDs. The permission ID layer is Phase 2.
  No template re-ordering — section order matches canonical.
- **R-NEW-3** — Phase 1.5 coverage gate verifies every AC maps to a scenario
  anchor on a real FLW. No more forward claims.
- **R-NEW-4** — Phase 2 enrichment of an FLW or ACT does not change its status.
  Status flip is Phase 3's job alone, applied uniformly to both node types.
- **R-NEW-5** — Phase 1 ingest of an FLW or ACT triggers the standard 2-file
  touch: node file + `nodes/<type>/index.md`. No new tier. When a single FRS
  births both FLW and ACT, that is two independent 2-file touches.
- **R-NEW-6** — Pass 1 `existence` scan widens at Phase 1.5 to match FLW
  scenario signatures (not just FRS title / actor / command domain). Cross-FRS
  near-duplicate FLWs must be caught at Phase 1.5, not at Phase 2. ACT existence
  is checked at Phase 1.5 against `produced_actor:` (when set) and the FRS's
  Actors section — duplicate actor introductions across FRSs are caught here.
  No `shares_nodes:` field exists (retired per M2) — read-only references in
  FRS prose are NOT existence-checked at Phase 1.5 (text grep is the audit
  hook; author is responsible for citation accuracy).
- **R-NEW-7** — **NEW DOCTRINAL CARVE-OUT** (per B3) to the universal 2-file
  touch rule in `maintenance-discipline.md`. Tightly scoped:

  **Trigger:** Phase 1.5 round-trip on a Phase-1-born FLW or ACT, where the
  revision is body-only and `status:` stays `proposed`.

  **Action:** 1-file touch — edit the canonical node body only. The per-type
  `index.md` is NOT re-synced (Status column unchanged; Title / Description
  columns are frontmatter-sourced, also unchanged). The node's `updated:`
  frontmatter timestamp DOES fire.

  **Scope restrictions — not generalizable:**

  - Only Phase-1-born nodes (FLW / ACT). Not Phase-2-born nodes (ENT / CMD /
    STA / …).
  - Only during Phase 1.5 round-trip. Not during free-form edits.
  - Only when `status:` does not change. Any status flip → 2-file touch as
    usual.
  - Body edits that change frontmatter fields driving index columns → 2-file
    touch as usual.

  **Precedent risk:** future requests "I'm just editing the body, can I use
  1-file touch?" must NOT cite R-NEW-7. The carve-out is scoped to Phase 1.5
  round-trip on Phase-1-born FLW/ACT only. Generalizing the carve-out to all
  canonical body edits is a separate doctrinal question (deferred — body-edit
  vs. index-relevance audit not done).

  **Other status-change events keep the existing 2-file touch:** Phase 3
  activation `proposed → active`, full FRS abandonment `proposed → deprecated`.
  Full FRS abandonment during Phase 1 / 1.5 routes to `in-flight-nodes.md §
  Abandonment` (no new procedure); the abandonment deprecates the FRS's
  Phase-1-born FLW and ACT (if any) together. FRS split-and-replace retires
  originals as `deprecated` and allocates fresh IDs. IDs are never reused.

- **R-NEW-8** — `status: proposed` post-cutover is disambiguated by **body shape**,
  not a new frontmatter field (per θ). Readers infer:

  | `related:` frontmatter | Phase state | Reader interpretation |
  |---|---|---|
  | `related: []` (empty) | Phase-1-bare | FLW / ACT born at Phase 1; awaiting Phase 2 enrichment. Body carries Trigger + Scenarios (FLW) or Description + Goals + business Preconditions + Flows initiated (ACT) only |
  | `related: [...]` populated | Phase-2-wired | FLW / ACT enriched at Phase 2; awaiting Phase 3 merge. Body carries full template content |
  | `status: active` | merged | Phase 3 completed; no longer in-flight |

  **One-off exemption (B5):** nodes with frontmatter `created_under:
  pre-2026-05-17` are exempt from the body-shape discriminator — they were
  born straight to Phase-2-wired body shape under grandfather (FRS-003's
  FLW-003 is the only known instance). Downstream readers (test-plan-ingest,
  retrieval discipline, lint) check `created_under:` before applying the
  discriminator.

  Phase-1 cross-cites stay in body (FLW Trigger.Actor / ACT Flows-initiated).
  Downstream consumers read frontmatter and skip Phase-1-bare nodes when
  their op needs Phase-2-wired anchors.

- **R-NEW-9** — `id-claims.md` schema update (per ι):

  - **Column rename:** `FS` → `Source`. The column accepts either an FRS-NNN
    (Phase 1 FLW / ACT allocation) or an FS-NNN (Phase 2 ENT / CMD / STA /
    CON / INT / DEC / PERM / QRY / TC allocation).
  - **Lazy-create timing:** today the file is lazy-created at first FS claim;
    post-cutover it is lazy-created at the first FRS or FS claim — i.e., the
    moment Phase 1 first allocates an FLW or ACT, the file is created.
  - **Scope unchanged:** milestone-scoped (`docs/milestones/M-NN-<slug>/id-claims.md`)
    and CR-scoped (`docs/change-requests/CR-NNN-<slug>/id-claims.md`).
  - **Grandfathered entries:** pre-cutover rows are valid as-is — `FS-007`
    is a valid `Source` value. **Header rename uses next-touch eventual
    consistency:** a milestone's `id-claims.md` keeps its old `FS` header
    until the next claim allocation against that file, at which point the
    header is renamed in the same edit. Closed milestones with no further
    allocations keep the old header indefinitely; in-flight milestones
    converge to `Source` on next use.

- **R-NEW-10** — **NEW** (per M4 / OQ τ). When Phase 2 enrichment surfaces that
  the FRS modifies a canonical node not declared in the FRS's Phase-1
  `touches_nodes:`, this is a claim change — **the FRS revision routes back to
  Phase 1.5**:

  1. Phase 2 author halts enrichment.
  2. FRS is revised to add the missing `touches_nodes:` entry.
  3. Phase 1.5 reruns Pass 1 (existence + sanity) on the new entry. No full
     Phase 1.5 re-gate — only the deltas.
  4. Phase 2 resumes only after Phase 1.5 clears the delta.

  Phase-2 retro-declaration with audit marker (the rejected alternative)
  would let Phase 2 silently widen the FRS's claim surface, undermining
  Phase 1.5 as the gatekeeper for FRS claims. Mitigation: `plan.md § 4` adds
  a Phase-2-entry checklist item: "canonical-state reconnaissance complete;
  every modify-intent the FS requires is already in the FRS's
  `touches_nodes:`." Catches the omission early; minimizes loop-back churn.

## Revised rules

- **CLAUDE.md hard rule #7** — current text says "Plans contain no syntax. Phase 2
  names structures; Phase 3 writes them." Revise to scope the structure-naming
  claim to Phase-2 node types and acknowledge FLW + ACT are Phase 1 ingests.
  New shape (no syntax): "Phase 1 ingests FLW (user-journey, Trigger +
  Scenarios only) and ACT (identity, Description + Goals + business
  preconditions + flows initiated). Phase 2 names ENT/CMD/STA structures,
  enriches FLW + ACT with wiring, and emits FS. Phase 3 writes code and flips
  proposed→active."
- **PRINCIPLES.md lines 112-113** — same doctrinal restatement of "Plans contain
  no syntax / Phase 2 names structures" lives here. Revise in lockstep with
  CLAUDE.md hard rule #7 — scope to Phase-2 node types, acknowledge FLW + ACT
  Phase 1 ingest.
- **WORKFLOW.md Overview** — revise lines 28-29 ("FRS flow Queries, FS flow
  Ingests") to acknowledge FLW + ACT are Phase 1 ingests.
- **WORKFLOW.md Process Flow graph** — Phase 1 box emits FLW + ACT deliverables
  alongside the FRS deliverable.
- **`/clear` semantics** (WORKFLOW.md, retrieval-discipline.md) — unchanged in
  placement (Phase 1.5 → 2 still mandatory). New emphasis: Phase 2 reload pulls
  the canonical FLW and ACT from disk, not from Phase 1 session memory.
- **design.md Phase 1 exit QA-hat** (`design.md:439-446`) — current text walks
  FLWs "you intend to write at Phase 2." Replace with: "AC→scenario coverage
  check against the just-authored FLW. Each scenario independently testable as
  a runner assertion." The Phase 1.5 gate re-runs the same check as Pass 1
  validation; the Phase 1 exit one is author self-review (intentional
  defense-in-depth per CLAUDE.md hard rule #13 framework exception).
- **design.md Phase 1 user-review handoff** — surface the FRS path, the produced
  FLW path, and (when `produced_actor:` is set) the produced ACT path at the
  Phase 1 handoff (today surfaces only the FRS).
- **design.md frontmatter / top-of-file mode declaration** (`design.md:6-10`) —
  current text says "Mode: Validation (Query). This flow does not write DDD
  nodes. It Queries the canonical wiki…" Revise to "Mode: mixed — Query
  (FRS validates against canonical) + Ingest (FLW + ACT born to canonical
  with `status: proposed`)." Remove the doctrinal "no DDD nodes written
  here" sentence. Per λ.
- **plan.md mode-boundary framing** (`plan.md:42-44`) — revise to "Phase 1
  Ingests journey + identity (FLW + ACT); Phase 2 Ingests structure + wiring
  (enriches FLW + ACT; creates ENT / CMD / STA / …); Phase 3 Merges + Codes."
  Per λ.
- **plan.md HARD-GATE** (`plan.md:17-23`) — current text says "Phase 2 names
  structures; Phase 3 writes them." Add a parallel sentence acknowledging
  Phase 1 also names FLW + ACT structures. New shape: "Phase 1 names FLW
  (Trigger + Scenarios) and ACT (Description + Goals + business Preconditions
  + Flows initiated). Phase 2 names ENT / CMD / STA / … structures and
  enriches FLW + ACT with wiring. Phase 3 writes them." Per λ.
- **plan.md § 2 ID-claim protocol** (`plan.md:240-273`) — column rename
  `FS` → `Source`; lazy-create timing shifts from "first FS claim" to
  "first FRS or FS claim"; example rows refreshed to show an FRS-source
  row (FLW / ACT allocation) alongside FS-source rows. Per R-NEW-9.
- **plan.md § 4 CHG node emission** (`plan.md:376-426`) — **UNCHANGED here**.
  CHG emission stays FS-emitted at Phase 2 per old model (CHG-at-Phase-1
  cutover split to follow-on plan).
- **plan.md § 6 FS validation** — add canonical-state reconnaissance check at
  Phase-2-entry: every modify-intent the FS requires must already be in the
  FRS's `touches_nodes:`. If a new one surfaces during enrichment, R-NEW-10
  loop-back fires. Per τ.

## File-by-file change list (execution order)

| # | File | Change |
|---|---|---|
| 1 | `sdlc/_templates/nodes/FLOW.md` | Phase-keyed restructure per R-NEW-2's section budget table. Add authoring notes at each section marking Phase 1 vs Phase 2 (vs Phase 3 for status flip). Phase 1 author MUST NOT write `related:` ENT/CMD/STA refs, Sequence, Branches, Compensating actions, structural Postconditions, or Decisions. Rewrite Trigger to drop the `Initiating command: CMD-NNN` line at Phase 1; restore it at Phase 2. **Add audit marker note:** the template documents the `created_under:` frontmatter field as a one-off grandfather marker for pre-cutover FLWs (FRS-003's FLW-003); not used for FLWs born after the cutover date. Per B5. **Land this before row 3 — FRS.md references "scenarios on the FLW" and the FLW must be settled first.** |
| 2 | `sdlc/_templates/nodes/ACTOR.md` | Phase-keyed restructure per R-NEW-2a's section budget table. **Preserves canonical section order — no template re-ordering** (Description → Goals → Preconditions to act → Commands they trigger → Queries they issue → Flows they initiate). Add authoring notes at each section marking Phase 1 vs Phase 2. Phase 1 author MUST NOT write CMD-NNN refs in "Commands they trigger", QRY-NNN refs in "Queries they issue", or PERM-NNN refs in Preconditions. Note that "Flows they initiate" lists real FLW-NNN IDs at Phase 1 (FLW is also Phase 1 born). Per B1. **Land this before row 3 — FRS.md references the Actor by ID and the ACT must be settled first.** |
| 3 | `sdlc/_templates/FRS.md` | Drop Behavior section. Drop Test plan view section entirely. Replace `produces_nodes:` list with scalar `produced_flw: FLW-NNN` + scalar `produced_actor: ACT-NNN` (blank when reusing) + list `produces_nodes:` covering **all other new node IDs (ENT, CMD, STA, CON, INT, DEC, PERM, QRY)**. **Do NOT add `shares_nodes:`** (retired per M2). Add a doc note at `touches_nodes:` warning: "modify-intent only — if you're tempted to list a node here for read-only reference, drop it and name the node inline in the FRS body (AC / BR / Brownfield notes)." Update frontmatter comments to clarify field semantics (`produces_nodes:` = Phase-2-born new nodes; `produced_flw:` / `produced_actor:` = Phase-1-born new nodes; `touches_nodes:` = modify-intent only). Remove "claims" guidance at lines ~141-154. Rewrite the Actors section line ~38-39: ACT-NNN references resolve to a real node born at Phase 1 when new — no more "will be introduced at Phase 2" claim language. Reference FLW for scenario anchors in ACs. |
| 4 | `CLAUDE.md` | Revise hard rule #7 per "Revised rules" above (FLW + ACT Phase 1; Phase-2 node types). |
| 5 | `sdlc/PRINCIPLES.md` | Revise lines 112-113 (doctrinal "Plans contain no syntax / Phase 2 names structures" restatement) in lockstep with hard rule #7. |
| 6 | `sdlc/WORKFLOW.md` | Revise Overview (lines 28-29). Update Process Flow graph: Phase 1 emits FRS + FLW + ACT (when new role) deliverables. Update phase-flow table descriptions if needed. |
| 7 | `sdlc/workflow/design.md` | Phase 1 procedure now authors FRS + FLW + ACT (the latter only when introducing a new role). **Revise the mode declaration (`design.md:6-10`)** from "Mode: Validation (Query). This flow does not write DDD nodes" to "Mode: mixed — Query (FRS validates against canonical) + Ingest (FLW + ACT born to canonical with `status: proposed`)" per λ. Replace forward-looking Phase 1 exit QA-hat language with "AC→scenario coverage on just-authored FLW." Note explicitly that this Phase-1-exit self-check duplicates the Phase 1.5 Pass 1 FLW coverage check — the redundancy is intentional defense-in-depth (CLAUDE.md hard rule #13 framework exception). Phase 1.5 gate gains FLW coverage check and ACT existence check (Pass 1, per row 9). Update Phase 1 user-review handoff to surface FRS, FLW, and ACT paths. Update minimal-read-set table to load FLOW.md + ACTOR.md templates at Phase 1 entry. **STD / CCC narrow-load posture stays Phase 1.5 + Phase 2** — Phase 1 FLW / ACT authoring uses business language only and does not narrow-load STDs or CCCs; document this explicitly in design.md's Phase 1 section. |
| 8 | `sdlc/workflow/plan.md` | Phase 2 procedure: enrich existing canonical FLW with wiring (`related:` + Sequence + Branches + Compensating + structural Postconditions + Decisions); enrich existing canonical ACT with wiring (`related:` + Commands they trigger + Queries they issue + PERM-NNN refs in Preconditions); still creates ENT/CMD/STA/CON/INT/DEC/PERM/QRY. Remove any "create FLW" or "create ACT" steps. **Revise the file-disjoint mode-boundary framing (`plan.md:42-44`)** per λ. **Revise the HARD-GATE (`plan.md:17-23`)** per λ to acknowledge Phase 1 also names FLW + ACT structures. **Revise § 2 ID-claim protocol (`plan.md:240-273`) per R-NEW-9:** rename `FS` column to `Source`; shift lazy-create timing; refresh example rows. **§ 4 CHG emission UNCHANGED here** (split to follow-on plan). **Add to § 6 FS validation per R-NEW-10:** Phase-2-entry checklist item — canonical-state reconnaissance complete; every modify-intent the FS requires is in the FRS's `touches_nodes:`. **Add HARD-GATE-flavored note:** Phase 2 reloads canonical FLW + ACT from disk, not from Phase 1 session memory. **Add new procedural section "§ 4a Retroactive `touches_nodes:` loop-back" per R-NEW-10:** four-step procedure (halt → revise FRS → Phase 1.5 delta re-run → resume Phase 2). |
| 9 | `sdlc/workflow/frs-validation-rules.md` | **Scoped per B2 — `Validation findings` table and "How findings appear" section do NOT exist in this file** (the table lives in FRS.md template + design.md Pass 1; the named section doesn't exist). Three changes only: (a) Move FLW coverage rule from Phase 2 exit to Phase 1.5. (b) Widen Pass 1 `existence` check to match FLW scenario signatures per R-NEW-6. (c) Add ACT existence check at Phase 1.5: when `produced_actor:` is set, the ACT file must exist; when the Actors section cites an existing ACT-NNN, that ID must resolve in canonical. No `shares_nodes:` check (field retired per M2). |
| 10 | `sdlc/workflow/in-flight-nodes.md` | **Add new FLW lifecycle section** (currently no named section): born Phase 1 proposed → enriched Phase 2 (still proposed) → Phase 3 active. **Add new ACT lifecycle section** (identical shape): born Phase 1 when new, enriched Phase 2, activated Phase 3. ENT/CMD/STA/CON/INT/DEC/PERM/QRY unchanged. **Add new sub-section "Phase-1-bare vs. Phase-2-wired discriminator" per R-NEW-8** documenting the body-shape inference rule and the `created_under:` one-off exemption. **Add new sub-section "Phase 1.5 round-trip handling" per R-NEW-7** documenting the 1-file body-edit carve-out, its tight scope, and the precedent risk. (CHG mechanics rewrite split to follow-on plan.) |
| 11 | `sdlc/workflow/retrieval-discipline.md` | **Currently does NOT load templates at Phase 1 entry — only per-type node indexes.** Add FLOW.md + ACTOR.md templates to Phase 1 entry minimal-read-set (new authoring slots). Phase 2 entry reloads canonical FLW and ACT for enrichment (currently only loads indexes; templates already loaded earlier or available on-demand). STD / CCC narrow-load posture stays Phase 1.5+. |
| 12 | `sdlc/workflow/maintenance-discipline.md` | **Author the new doctrinal carve-out R-NEW-7** per B3 — currently the 2-file touch is universal; this row adds a tightly-scoped exception. New section title: "Phase 1.5 round-trip body-edit exception." Document trigger (Phase 1.5 round-trip, Phase-1-born FLW/ACT, body-only edit, status unchanged), action (1-file touch, no index re-sync, `updated:` fires), scope restrictions (not generalizable — not for Phase-2-born nodes, not for free-form edits, not for status flips, not for frontmatter changes affecting index columns), and precedent risk note (future "I'm just editing the body" requests must NOT cite R-NEW-7). Also note Phase 1 FLW + ACT births each use the standard 2-file touch (independent touches when one FRS births both). |
| 13 | `sdlc/workflow/change-request.md` | Phase CR-1 (delegates to `design.md § Phase 1 — FRS Authoring`) and Phase CR-1.5 (delegates to `design.md § Pass 1 — per-FRS gate`) inherit changes from rows 7 and 9 automatically. CR-track `id-claims.md` (`docs/change-requests/CR-NNN-<slug>/id-claims.md`) inherits the `FS` → `Source` column rename from R-NEW-9. **CR Container Structure tree unchanged here** — CHG-path repath split to follow-on plan; pre-cutover `specs/FS-NNN/nodes/changes/` subtree stays in the example. |
| 14 | `sdlc/workflow/test-plan-ingest.md` | **Wording revision** per μ. HARD-GATE at `test-plan-ingest.md:14-17` (and line 81) says "every new FLW node introduced by this FS" — under the new model FLW is FRS-introduced at Phase 1, then enriched by the FS at Phase 2. Reword to "every FLW node referenced by this FS's FRS scope (whether FRS-introduced at Phase 1 or pre-existing) has all three scenarios filled AND is Phase-2-wired (`related:` populated, Sequence filled — per R-NEW-8 discriminator)." The entry-contract guarantee from `plan.md` (FS validation passed) already implies Phase-2-wired so the additional check is doctrinal rather than gate-novel. Also grep for residual "new FLW node introduced by this FS" / "new ENT node introduced by this FS" — reconcile FLW; ENT phrasing stays (ENT still FS-introduced). |
| 15 | `sdlc/workflow/agent-contracts.md` | **NEW per M3.** Phase 1 now authors 4 artifacts (FRS + FLW + ACT — no CHG in this plan) instead of 1. Audit existing subagent contracts: any contract scoped to "FRS authoring only" needs scope expansion. Specifically, sequential authoring (FRS → FLW → ACT) within one Phase 1 session is the default; one-shot subagent dispatch handling all three is acceptable but not required. Update contract templates accordingly. Verify no contract assumes FLW / ACT born at Phase 2. |
| 16 | `sdlc/workflow/new-component-bootstrap.md` | **NEW per M3.** Verify the bootstrap sequence interaction with Phase-1 canonical FLW / ACT births. Today: bootstrap fires before Phase 2 (per CLAUDE.md index). Question: does bootstrap need to fire before Phase 1 now that Phase 1 writes canonical? If a new component's first FRS births FLW-001 and ACT-001 at Phase 1, the component skeleton (`docs/<component>/nodes/<type>/index.md`) must exist before the 2-file touch fires. Verify and document. Likely outcome: bootstrap timing moves from "before Phase 2" to "before first Phase 1 ingest in a new component." |
| 17 | Sweep | grep `sdlc/` for: "claim" (in FLW-ID or ACT-ID context), "produces_nodes", "forward-looking", "Phase 2 ingest" (when referring to FLW or ACT), "FLW IDs", "ACT IDs", "will be introduced as ACT-NNN at Phase 2". Reconcile stragglers. `frs-code-extraction-rules.md` lines 77-79 will surface — reconcile there (Phase-1-ingested FLW and ACT are real; ENT/CMD/STA claims stay). **Do NOT sweep for `shares_nodes:`** (field never landed). **Do NOT sweep for CHG mechanics changes** (split to follow-on). |

## Migration / grandfather strategy

- **Existing FRSs authored under old model** — grandfather. They retain old-style
  Behavior section + Test plan view with forward FLW and ACT claims. Do not
  retrofit. When next touched (FRS modification or related milestone work),
  migrate then.
- **In-flight milestones at the time of cutover** — finish their current phase
  under whichever model that phase started. Switch model at next phase entry,
  not mid-phase.
- **Named in-flight collision: FRS-003-user-login (M-01-user-auth).** At the
  time of this plan's drafting, FRS-003 is `status: approved` (Phase 1.5
  cleared) awaiting Phase 2. It completes Phase 2 under the **old model** —
  its FLW (FLW-003) is created at Phase 2 with `status: proposed` per
  pre-cutover rules. FRS-003 references ACT-001 (Visitor, already canonical
  via FRS-001), so no new ACT birth is implicated. FS-001 and FS-002 (already
  through or in Phase 2) likewise unchanged.

  **Template-snapshot collision and resolution (per B5 option c):** row 1
  (FLOW.md phase-keyed restructure) lands first. FRS-003's Phase 2 author
  encounters the new template, which assumes "Phase 1 wrote bare body; Phase 2
  enriches." FRS-003's FLW-003 has no Phase-1-bare body (grandfathered).
  Resolution: FLW-003 is created at Phase 2 with the new template's
  Phase-2-wired body shape directly (Trigger + Scenarios + Sequence + Branches
  + Compensating + structural Postconditions + Decisions, all in one shot).
  FLW-003 carries audit marker frontmatter `created_under: pre-2026-05-17`
  signalling "born under old model; exempt from R-NEW-8's body-shape
  discriminator." Downstream readers (test-plan-ingest, lint) check the
  marker before applying the discriminator. The marker is one-off — used only
  for FRS-003's FLW-003 — and is NOT a permanent template feature. Plan row 1
  documents the marker as an exemption clause; the marker entry retires when
  FLW-003 transitions to `status: active` at Phase 3.

- **Cutover marker** — date this plan's `status: done` is the cutover. New FRSs
  authored after that date use the new template.

## Risks

- **Phase 1 scope creep.** FRS authoring (lightweight) gains FLW authoring
  (Trigger + 3 Scenarios) and, when a new role is introduced, ACT authoring
  (Description + Goals + business preconditions + flows initiated). Mitigation:
  R-NEW-2's and R-NEW-2a's section budgets are strict — Phase-1 FLW is two
  sections + 3 scenario bodies; Phase-1 ACT is four short sections. ACT birth
  is 0..1 per FRS (most reuse existing actors).
- **Behavior-language discipline.** Phase-1 FLW Scenarios must use business
  terms ("a registered user with verified email"), not node IDs ("an ENT-001
  in STA-002.Verified state") — because the IDs don't exist yet. Phase-1 ACT
  Preconditions must use business-language constraints ("must be
  authenticated"), not PERM-NNN IDs. Authors used to the Phase-2 idiom will
  reach for IDs. Mitigation: FLOW.md + ACTOR.md authoring notes at the
  affected sections explicitly warn; Phase 1.5 Pass 1 catches violations
  (`sanity` type finding).
- **Canonical write at Phase 1** — parallel Phase 1 sessions could touch
  `nodes/flows/index.md` or `nodes/actors/index.md` simultaneously.
  Mitigation: serialize Phase 1 per milestone (already de-facto).
- **`/clear` enforcement sharpens.** Phase 2 reload must not pull Phase 1
  deliberations. The Informed Skip anti-pattern gets restated: "trust the FLW
  and ACT files; drop the session memory."
- **Backwards compat with old FRSs.** Coverage gates and validation may apply
  different rules per FRS age. Mitigation: gate by FRS `created:` date
  relative to this plan's `status: done` date. FRS-003 is named explicitly
  (above). `template_version:` frontmatter deferred until the date-based
  heuristic produces ambiguity.
- **Plan execution drift.** Sixteen-plus rows, sequenced. If interrupted
  mid-execution, the codebase is inconsistent. Mitigation: execute in
  dependency order (FLOW.md + ACTOR.md templates → FRS.md template →
  doctrinal docs → flow files → rule books → bootstrap + agent-contracts →
  sweep); commit after each major chunk.
- **Phase 1.5 round-trip cost.** Today a Phase 1.5 FAIL just sends the FRS
  back to revise (one file edit). Post-cutover, a revision may need to ripple
  to the canonical FLW (Scenarios revised per AC change) and the canonical
  ACT (Goals / Preconditions revised). Worst case 3× edit cost per round-trip.
  Mitigation: R-NEW-7's 1-file-touch carve-out keeps the discipline cost
  bounded — only canonical-body edits, no index re-sync churn. Phase 1.5
  PASS_WITH_MAJORS may also drag FLW / ACT revisions; surface this in the
  gate-verdict procedure.
- **R-NEW-7 precedent risk** (new per B3). The 1-file body-edit carve-out
  is the framework's first exception to the universal 2-file touch rule. If
  cited loosely, it generalizes into "any body edit is 1-file." Mitigation:
  R-NEW-7's scope restrictions are documented in `maintenance-discipline.md`
  with an explicit "not generalizable" clause. Generalization to all
  canonical body edits is a separate doctrinal decision; deferred.
- **`status: proposed` discriminator drift** (per θ). The body-shape rule
  (`related: []` ⇒ Phase-1-bare; populated ⇒ Phase-2-wired) is implicit — a
  malformed Phase-2 enrichment that forgets to populate `related:` looks
  like a Phase-1-bare node to downstream readers. Mitigation: Phase 2 exit
  validation (plan.md § 6) gains a check "every enriched FLW / ACT carries
  non-empty `related:`"; the FS validation loop catches the omission before
  Phase 3.
- **Per-type `index.md` crowding.** Phase-1-bare and Phase-2-wired nodes
  coexist in the same per-type `index.md` (both rows show Status =
  `proposed`). Readers scanning the index for "FLWs ready to test-plan" get
  hits on Phase-1-bare nodes. Mitigation: the existing entry contract
  (test-plan-ingest fires after FS validation pass; that validation
  guarantees Phase-2-wired) already gates this — the index does not need a
  sub-status column. Minor risk; documented for completeness.
- **FRS-003 `created_under:` marker leakage** (per B5). The one-off audit
  marker exists for FLW-003 only. Risk: future authors copy the marker into
  new FLWs, creating spurious exemptions. Mitigation: row 1 FLOW.md template
  documents the marker as a grandfather-only field, not part of the standard
  schema. Phase 1.5 Pass 1 `sanity` gains a check: any FLW with
  `created_under:` set whose date is AFTER the cutover date is a Major
  finding (illegitimate marker use).
- **Retroactive `touches_nodes:` loop-back churn** (per M4 / R-NEW-10).
  Phase 2 enrichment that discovers an undeclared modify-intent halts and
  loops back to Phase 1.5. If the gap is wide (many undeclared modifies),
  the loop-back becomes a Phase 1.5 re-run rather than a delta. Mitigation:
  plan.md § 6's Phase-2-entry reconnaissance checklist catches gaps before
  Phase 2 work commits; R-NEW-10's "delta re-run only" scoping keeps
  small-gap cost bounded.
- **Sharing-via-prose audit gap** (per M2). With `shares_nodes:` retired,
  read-only references to existing canonical FLW / ACT live in FRS prose
  only. No frontmatter audit hook — readers grep. Risk: an FRS reads from
  FLW-001 in a way that becomes load-bearing, but no structural signal
  exists for downstream impact analysis. Mitigation: deemed acceptable per
  M2 option (b) — author judgment + grep are sufficient; reverting to a
  frontmatter field is a future plan if the gap proves painful in practice.

## Progress checklist

Each line is one durable outcome. Mark `[x]` only after the file is saved and
self-consistent. Mark this plan `status: done` after the final sweep.

- [x] 1. `sdlc/_templates/nodes/FLOW.md` updated (phase-keyed section budget per R-NEW-2; Trigger drops `Initiating command:` line at Phase 1; `related: []` at Phase 1; **`created_under:` audit marker documented as grandfather-only field** per B5)
- [x] 2. `sdlc/_templates/nodes/ACTOR.md` updated (phase-keyed section budget per R-NEW-2a; **preserves canonical section order** per B1; Phase 1 sections — Description + Goals + business Preconditions + Flows initiated — gated by authoring notes; Phase 2 sections — Commands they trigger + Queries they issue — gated by authoring notes; `related: []` at Phase 1 per ι)
- [x] 3. `sdlc/_templates/FRS.md` updated (Behavior dropped, Test plan view dropped, scalar `produced_flw:` added, scalar `produced_actor:` added, `produces_nodes:` covers ENT/CMD/STA/CON/INT/DEC/PERM/QRY, **`shares_nodes:` NOT added** per M2, **`touches_nodes:` doc note added — modify-intent only; share via prose**, Actors-section claim language removed)
- [x] 4. `CLAUDE.md` hard rule #7 revised
- [x] 5. `sdlc/PRINCIPLES.md` lines 112-113 revised in lockstep with hard rule #7
- [x] 6. `sdlc/WORKFLOW.md` Overview + Process Flow graph updated (Phase 1 emits FRS + FLW + ACT)
- [x] 7. `sdlc/workflow/design.md` Phase 1 + 1.5 procedures updated (FRS + FLW + ACT authoring, **mode declaration revised per λ**, exit QA-hat rewritten with intentional-redundancy note, handoff updated, minimal-read-set table loads FLOW.md + ACTOR.md, STD/CCC retrieval posture stays Phase 1.5+ explicit)
- [x] 8. `sdlc/workflow/plan.md` Phase 2 procedure updated (FLW + ACT enrichment, not creation; canonical-reload note; **mode-boundary framing revised per λ**; **HARD-GATE revised per λ**; **§ 2 ID-claim protocol revised per R-NEW-9**; **§ 4 CHG emission UNCHANGED here** — split to follow-on; **§ 4a Retroactive `touches_nodes:` loop-back added per R-NEW-10**; **§ 6 FS validation: canonical-state reconnaissance checklist added**)
- [x] 9. `sdlc/workflow/frs-validation-rules.md` updated (**three changes only per B2**: FLW coverage moved to Phase 1.5, existence-scan widened to FLW scenario signatures, ACT existence check added; no `shares_nodes:` check; no `chg-sanity` check — both split out)
- [x] 10. `sdlc/workflow/in-flight-nodes.md` FLW + ACT lifecycle sections added; **Phase-1-bare vs. Phase-2-wired discriminator sub-section added per R-NEW-8** (incl. `created_under:` exemption); **Phase 1.5 round-trip handling sub-section added per R-NEW-7**; CHG mechanics unchanged here (split to follow-on)
- [x] 11. `sdlc/workflow/retrieval-discipline.md` Phase 1/2 entry loads updated (**FLOW.md + ACTOR.md templates added to Phase 1 entry minimal-read-set** — currently absent; STD/CCC narrow-load posture stays Phase 1.5+)
- [x] 12. `sdlc/workflow/maintenance-discipline.md` **new doctrinal carve-out R-NEW-7 authored** per B3 (Phase 1.5 round-trip body-edit exception, tight scope, precedent-risk note); Phase 1 FLW + ACT 2-file-touch noted
- [x] 13. `sdlc/workflow/change-request.md` updated (CR-1 + CR-1.5 delegation inherits FRS/FLW/ACT changes; CR-track `id-claims.md` column rename inherited per R-NEW-9; **CR Container Structure tree UNCHANGED here** — CHG-path repath split to follow-on)
- [x] 14. `sdlc/workflow/test-plan-ingest.md` HARD-GATE rewritten per μ (FLW is FRS-introduced, FS-enriched); ENT phrasing unchanged
- [x] 15. **NEW per M3:** `sdlc/workflow/agent-contracts.md` audited and updated for FRS + FLW + ACT one-session authoring (verify no contract assumes FLW / ACT at Phase 2)
- [x] 16. **NEW per M3:** `sdlc/workflow/new-component-bootstrap.md` verified — bootstrap timing decision documented (likely moves from "before Phase 2" to "before first Phase 1 ingest in a new component")
- [x] 17. Sweep across `sdlc/` for stale "claim"/"forward-looking"/"FLW IDs"/"ACT IDs" language; reconcile `frs-code-extraction-rules.md` lines 77-79; **no `shares_nodes:` sweep needed**; **no CHG mechanics sweep needed** (split to follow-on)
- [x] 18. Plan `status: done`, commit

## Follow-on work

**Plan: CHG-at-Phase-1 cutover** (separate plan, landed after this one
stabilizes). Pre-resolved decisions transfer with no re-litigation:

- Original OQs ν, ξ, ο, π, ρ, σ (CHG birth + path + granularity + content split
  + Phase 1.5 chg-sanity + draft discriminator).
- Original R-NEW-11..17 (CHG mechanics).
- B4 (CHANGE.md `target_fs:` field retirement, route audit through `source_ref:`
  + reverse-glob of `consumes_chgs:`).
- M1 (chg-sanity Pass 1 ordering across sibling FRSs — process in birth order;
  re-run on sibling FLW/ACT body changes).
- File rows: CHANGE.md template (phase-keyed section budget), FS.md template
  (`consumes_chgs:` field + body section), FRS.md template (`chg-sanity` in
  Validation findings Type enum + `touches_nodes:` Phase-1-birth driver note),
  plan.md § 4 rewrite (emission → consumption + enrichment), design.md Pass 1
  (chg-sanity check) + Pass 2 (cross-FRS CHG-conflict check),
  frs-validation-rules.md (chg-sanity), in-flight-nodes.md (CHG mechanics
  rewrite + FS-CHG consumption + draft discriminator), change-request.md (CR
  Container Structure repath, new `chg/` subtree).
- Sweep for "FS emits CHG" / "FS-emitted CHG" / `specs/FS-NNN/nodes/changes/`
  references.

Rationale for split: bundling both cutovers grew the original plan from ~9
file rows to ~15+ rows + a CHG mechanics rewrite. Execution risk (mid-flight
interrupt leaving the codebase inconsistent) grows non-linearly. Splitting
preserves the through-line — Phase-1 birth as the cure for forward-claim
disease — while bounding execution risk per plan.

## Out of scope

- ENT / CMD / STA / INT / CON lifecycle — unchanged (Phase 2 birth, Phase 3 activate).
- CHG-NNN mechanics — **unchanged here** (CHG-at-Phase-1 cutover deferred to follow-on plan).
- Test suite codegen (`test-suite-codegen.md`) — unchanged; FLW anchors are now
  real earlier, but the codegen step itself is the same.
- QA Gate (`qa-gate.md`) — unchanged.
- Milestone close procedure — unchanged.
- Backwards-port of existing FRSs — explicitly grandfathered (see Migration above).
- Standards / CCC / ADR authoring — unchanged.
- **Multi-FLW FRSs** — under the new model, FRSs that legitimately span two
  flows must split into two FRSs. Matches FRS template's "exactly one
  user-journey" rule (R-NEW-1). Not a regression to mitigate; a constraint
  to surface.
- **Multi-ACT FRSs** — under the new model, FRSs that legitimately introduce
  two new actor roles must split into two FRSs. The `produced_actor:` scalar
  enforces 0..1. Sharing an existing actor with another FRS is via prose
  references. Not a regression to mitigate; a constraint to surface.
- **`template_version:` frontmatter** — deferred. The `created:` date relative
  to this plan's `status: done` is the cutover signal. Revisit only if the
  date-based heuristic produces ambiguity at a future gate.
- **R-NEW-7 carve-out generalization** — the carve-out applies only to Phase
  1.5 round-trip on Phase-1-born FLW/ACT. Generalizing the 1-file body-edit
  rule to all canonical body edits is a separate doctrinal question;
  deferred.

## Execution note

When you're ready, say "execute the plan" (or pick a specific row from the
checklist). Each row is one outcome; I'll mark it `[x]` here as it completes,
and pause for review at natural breakpoints (after row 6, after row 10, after
row 16). No file edits until you give the word.
