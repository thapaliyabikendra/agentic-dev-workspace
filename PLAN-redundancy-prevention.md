---
title: Prevent cross-artifact and within-template redundancy in the SDLC framework
status: done                    # proposed | approved | in-progress | done | abandoned
kind: workflow-evolution
created: 2026-05-17
revised: 2026-05-17
owner: bikendra.thapaliya@amniltech.com
scope: sdlc engine — templates, validation rules, principles; project artifacts under docs/milestones/ remain unchanged by this plan (separate cleanup follows)
depends_on: []
related:
  - sdlc/_templates/FS.md
  - sdlc/_templates/FRS.md
  - sdlc/_templates/MILESTONE.md
  - sdlc/_templates/MILESTONE-STATE.md
  - sdlc/_templates/SURVEY.md
  - sdlc/_templates/CROSS-CUTTING-CONCERNS.md
  - sdlc/workflow/frs-validation-rules.md
  - sdlc/workflow/plan.md
  - sdlc/PRINCIPLES.md
  - CLAUDE.md (hard rule #3 — "Reference, never copy")
---

# Plan — Prevent SDLC-framework redundancy

## Context

The `docs/milestones/M-01-user-auth/` audit (turn-1 of this session)
surfaced eight redundancy patterns. Five are framework-borne (the
template / validation-gate / principles surface that generated them is
in the framework, not in the M-01 instance). The doctrine — "Reference,
never copy" — already lives at `CLAUDE.md` hard rule #3 and
`PRINCIPLES.md:151` ("Restating another node's field table…"). The
failure is at the **enforcement** layer: there is no validation-gate
check, template self-discipline, or audit tool that operationalises the
doctrine across siblings and across mirrored artifacts. This plan adds
that operational layer.

## Findings recap (from turn 1)

| # | Pattern | Origin surface |
| - | ------- | -------------- |
| F-1 | QA-verification checklist duplicated across FS instances (FS-001 ↔ FS-002, ~10 bullets each) | `sdlc/_templates/FS.md` lines 188-217 — embeds checklist inline rather than linking |
| F-2 | "Deviation → ADR with `related: [CCC-NNN]`" pattern restated in 7+ FRS / FS / discovery artifacts | No CCC-side canonical home for the deviation-policy rule; every consumer re-states it |
| F-3 | ~~Three near-identical "ABP method = implementation language" validation findings across FRS-001/002/003~~ **Withdrawn 2026-05-17 (advisor review):** each row records a distinct gate firing with its own audit-reproducibility set (`glossary_version` / `baseline_version` / `commit`). The "Same rationale as FRS-XXX" form is already the compressed audit trail; per-FRS rows are by design (`frs-validation-rules.md:308-329`). | — (no framework change needed) |
| F-4 | Milestone portal "Out of scope" mirrors milestone-scope discovery's "Deferred" | `sdlc/_templates/MILESTONE.md` line 90-92 carries a body section that overlaps the survey by design |
| F-5 | Sequencing claim restated in milestone portal + FS-001 + FS-002 | `sdlc/_templates/FS.md` Dependencies section restates rather than references the milestone portal |
| F-6 | `MILESTONE-STATE` carries the same handoff in 4 places (frontmatter `next_action`, `session_notes`, last history row, "Session continuity") | `sdlc/_templates/MILESTONE-STATE.md` template embeds the redundancy by design |
| F-7 | Within-FRS rule restatement (Behavior + BR + AC saying the same thing) | `sdlc/_templates/FRS.md` section comments do not assign section-role discipline |
| F-8 | Discovery doc retains content the adopting FRS body has since resolved (FRS-001 cross-refs swapped in body, untouched in survey) | `sdlc/_templates/SURVEY.md` does not declare what `status: adopted` freezes |

## Root-cause classification

Five distinct root causes underlie the eight findings:

- **RC-1 — Template-embedded boilerplate.** The framework template
  ships content that re-emerges identically on every instantiation.
  Covers F-1 and F-6.
- **RC-2 — Missing canonical home for category-level policy.** The CCC
  body does not name a "Deviation policy" section, so every consumer
  FRS / FS / survey restates the "deviation → ADR with `related:
  [CCC-NNN]`" rule. Covers F-2. (F-3 withdrawn — not a redundancy.)
- **RC-3 — Adjacent-artifact mirroring without rationale.** Two
  artifacts in the same scope (milestone portal ↔ milestone survey;
  milestone portal ↔ FS Dependencies) hold the same prose without
  the "deliberate enrichment mirror" annotation the framework already
  uses elsewhere. Covers F-4 and F-5.
- **RC-4 — Within-FRS section-role conflation.** Behavior / Business
  rules / Acceptance criteria sections each restate the same constraint
  because the template does not assign each section a distinct
  narrative role. Covers F-7.
- **RC-5 — Discovery-to-FRS lifecycle ambiguity.** Once a discovery
  doc is `status: adopted`, the framework does not specify whether it
  is (a) frozen-historic (FRS body is current truth) or (b)
  still-canonical for its scope (must be kept in sync). Covers F-8.

## Mitigations

### M-1 — Lift template-embedded boilerplate to referenced files

**Targets RC-1.**

- `sdlc/_templates/FS.md` — replace the inline `## QA verification` body
  (current lines 184-217) with a one-line reference to a new shared
  checklist file at **`sdlc/workflow/fs-qa-verification.md`** (OQ-PR-02
  resolved 2026-05-17 → Option A: rule-book sibling to
  `frs-validation-rules.md`, `coverage-matrix.md`). The FS instance
  carries only the link and the per-instance `[ ]` checkboxes that vary
  by case (e.g., the CHG-vs-pure-addition row).
- `sdlc/_templates/MILESTONE-STATE.md` — narrow scope (advisor
  correction 2026-05-17): only `next_action` (frontmatter) and the
  "Next session should start with" line in the "Session continuity"
  body section duplicate. Collapse those two to one surface
  (recommended: keep frontmatter `next_action`, drop the "Next
  session should start with" line). **Retain** `session_notes`
  (frontmatter) — it carries per-session deliberation that has no other
  home (see the M-01 instance's "Deliberate calls: …" note as evidence).
  **Retain** `Phase history` table — append-only audit trail, distinct
  role from handoff.

### M-2 — File category-level policy in the CCC body

**Targets RC-2.**

- `sdlc/_templates/CROSS-CUTTING-CONCERNS.md` — add a section role
  named (provisionally) "Deviation policy" that every CCC instance
  must fill: a one-line statement of how consumers signal a deviation
  (ADR with `related: [CCC-NNN]`). Once filled at the CCC body, no
  consumer FRS / FS / survey should re-state the policy.
- **No new validation rule needed** (advisor correction 2026-05-17).
  The existing `Major: baseline-not-cited` rule in
  `frs-validation-rules.md:168-169, 386-398` already fires when an FRS
  body restates baseline category content instead of citing it. Once
  the CCC template carries the "Deviation policy" section, consumer
  restatements of that policy become detectable under the existing
  rule. A renamed `R-CCC-DEVIATION-RESTATEMENT` would have been a
  duplicate gate.
- The originally-proposed `R-CROSS-SIBLING-FINDING-ECHO` is dropped
  (F-3 was not a redundancy; see Findings recap).

### M-3 — Mirror-or-link rule for adjacent artifacts

**Targets RC-3.**

- `sdlc/_templates/MILESTONE.md` — the "Out of scope for this
  milestone" body section is a verbatim mirror of the milestone
  survey's "Deferred" section. Pick one of:
  - **Option A (link):** replace the milestone-portal body section
    with a one-line link to the survey's "Deferred" subsection.
  - **Option B (sanctioned mirror):** annotate with the existing
    "Deliberate enrichment mirror" pattern that the same template uses
    for `frs:` and `specs:` lists (lines 58-63, 72-77) — declares the
    mirror is intentional and names the synchronization obligation.
  - Recommendation: Option A; the survey is the natural canonical
    home for "what we explicitly deferred" since that is the survey's
    role. The portal's job is the FRS-aggregation surface, not the
    scope-negation surface.
- `sdlc/_templates/FS.md` — `## Dependencies and constraints`
  "Brownfield constraints" / "Sibling-FS dependencies" lines should
  cite the milestone portal's `## Sequencing notes` rather than
  re-state. Frontmatter `depends_on_specs:` remains the machine-
  readable surface.

### M-4 — Assign section-role discipline in FRS template

**Targets RC-4.**

- `sdlc/_templates/FRS.md` — tighten the section comments to assign
  each of Behavior / Business rules / Acceptance criteria a distinct
  role and forbid restatement:
  - **Behavior** owns the narrative flow (what happens, in what order).
    May reference BR / AC by ID; must not restate them.
  - **Business rules** are declarative policy claims (BR-NN), each
    stated once. Behavior may cite `BR-NN` inline; AC verifies BR-NN
    is observable.
  - **Acceptance criteria** are testable claims, each mapped to one
    Flow scenario. AC may cite `BR-NN` it verifies; it must not
    restate the BR text verbatim.
- `sdlc/workflow/frs-validation-rules.md` — add one new rule under
  "Additional sanity rules" (OQ-PR-04 resolved 2026-05-17 → Option B:
  add at Minor severity):
  - `R-WITHIN-FRS-RULE-RESTATEMENT` (Minor / `sanity`): the same
    constraint appears as prose in two or more of Behavior / Business
    rules / Acceptance criteria. Resolution: state once in the
    declarative section (BR-NN); reference from the others.

  Same shape as the existing `ac-single-outcome`,
  `deferred-finding-raises-oq`, and `nfr-baseline-trace` rules
  (`frs-validation-rules.md:340+`). Grandfather clause applies — new
  rule fires prospectively only.

### M-5 — Clarify discovery-to-FRS lifecycle (Option A — frozen-historic)

**Targets RC-5.** OQ-PR-05 resolved 2026-05-17: **Option A locked.**

- `sdlc/_templates/SURVEY.md` — declare frozen-historic semantics:
  once `status: adopted`, the survey is read-only. Current truth lives
  in the adopting FRS body. Drift between survey and FRS body is **not**
  a finding — the survey is intentionally a Phase-0 snapshot. The FRS
  body's `Validation findings` table is the only place corrections are
  recorded.
- Template edits:
  - The existing lifecycle block (`SURVEY.md:26-44`) gets a one-line
    addition under `adopted`: "frozen at adoption; current truth in
    the adopting FRS named in `adopted_into:`. Post-adoption edits
    require `status: stale` first."
  - On `adopted` flip, prepend a header banner to the survey body:
    `> Adopted into FRS-NNN on YYYY-MM-DD. Current truth lives there;
    this file is the Phase-0 snapshot.` (Author decision 2026-05-17:
    banner included — kills the reader-confusion failure mode at one
    template-edit cost.)
- **No new validation rule.** F-8 (FRS-001 cross-refs swapped in body,
  preserved in discovery) stops being a redundancy finding under
  Option A — it is the correctly-preserved record that the survey
  originally had it wrong and the FRS fixed it.
- **Verified clear of legacy-absorption** (2026-05-17): the Signal-to-
  target map in `sdlc/workflow/legacy-absorption.md:161-169` does not
  consume surveys. Option A has no absorption-flow side effect.

## File-change map

| File | RC | Change kind | Notes |
| ---- | -- | ----------- | ----- |
| `sdlc/_templates/FS.md` | RC-1, RC-3 | Body replacement | QA checklist → link; Dependencies → cite portal |
| `sdlc/_templates/MILESTONE-STATE.md` | RC-1 | Body shrink | Collapse handoff to one surface |
| `sdlc/_templates/MILESTONE.md` | RC-3 | Body shrink | Out-of-scope → link to survey |
| `sdlc/_templates/CROSS-CUTTING-CONCERNS.md` | RC-2 | New section role | Deviation policy as named section |
| `sdlc/_templates/FRS.md` | RC-4 | Comment tightening | Section-role discipline |
| `sdlc/_templates/SURVEY.md` | RC-5 | Frontmatter comment | `status: adopted` semantics |
| `sdlc/workflow/frs-validation-rules.md` | RC-4 | New rule | One row under "Additional sanity rules": `R-WITHIN-FRS-RULE-RESTATEMENT` (Minor / sanity) |
| `sdlc/workflow/fs-qa-verification.md` | RC-1 | **New file** | Shared QA-gate checklist transcluded by FS template (lifted from current FS template lines 184-217) |
| `sdlc/workflow/plan.md` | — | none | Originally listed for the dropped `R-CCC-DEVIATION-RESTATEMENT`; removed |
| `sdlc/PRINCIPLES.md` | (cross-cut) | Anti-pattern annotation | Optional: add one bullet naming "Defensive Re-statement" as a sub-pattern under the existing line 151 anti-pattern |
| `CLAUDE.md` | none | — | Hard rule #3 already says it; no edit needed |

## Migration impact on existing M-01 artifacts

Existing M-01 instances pre-date these rules. Two options for the
existing redundancies:

- **Leave in place.** Apply the rules to new FRSs / FSs only
  (grandfather clause, identical pattern to the 2026-05-16 sanity
  rules — see `frs-validation-rules.md:340-343`). No M-01 rework.
- **One-shot cleanup pass.** Apply the rules to M-01 retroactively
  in a single CHG-style pass; document the audit reproducibility set
  for each removed line.

Recommendation: **grandfather**. The framework precedent already
exists; the M-01 redundancies are small enough that re-authoring is
not worth the churn relative to leaving them as a historic record of
the framework's pre-mitigation state.

**Decision 2026-05-17 — grandfather locked.** M-01 instances pre-date
the mitigations landed by this plan; their existing redundancies stand
as a historic record. The new rules / template tightenings apply
prospectively to FRSs / FSs / surveys / CCCs / milestone portals
authored after 2026-05-17. The `R-WITHIN-FRS-RULE-RESTATEMENT` rule
carries its own grandfather clause under `## Additional sanity rules`
in `frs-validation-rules.md` (rule-introduction-date pattern, same
shape as the 2026-05-16 rules).

## Out of scope for this plan

- Implementing the new validation rules in tooling. The validation
  gate is human-run today (`frs-validation-rules.md` is the rule
  book); the new rules are added to the rule book in plain prose,
  same as the existing ones.
- Authoring the shared `fs-qa-verification.md` checklist file. M-1's
  recommendation names the file; the body content is a Phase-3
  drafting step under this plan, not this plan's deliverable.
- Auditing other components (`docs/app/`, `docs/shared/`) for
  redundancy. This plan is scoped to the framework surface that
  caused the `docs/milestones/` redundancies; a separate sweep can
  target node-level redundancy if found.
- Tooling that automatically detects cross-sibling finding echo (a
  grep-style audit script). The rules are stated in prose; an audit
  script is a later enhancement.

## Progress checklist

Per CLAUDE.md rule #7 (multi-stage plan), mark each stage `[x]` before
advancing.

- [x] **S-1** Confirm the five root-cause classifications with the
  framework owner. (RC-5 decision: **Option A + banner** locked
  2026-05-17. RC-1..RC-4 confirmed by user's execute-plan command 2026-05-17.)
- [x] **S-2** Land M-1 (FS template QA-checklist lift + MILESTONE-STATE
  collapse). Single-template touches, low blast radius.
- [x] **S-3** Land M-2 (CCC template "Deviation policy" section role).
  Touches the CCC template — propagates to every existing CCC, which
  must each have the section back-filled. No new validation rule (the
  existing `Major: baseline-not-cited` rule covers consumer
  restatements once the CCC body becomes the canonical home).
- [x] **S-4** Land M-3 (milestone portal + FS template Dependencies
  link-or-mirror discipline).
- [x] **S-5** Land M-4 (FRS template section-role comments + one new
  validation rule).
- [x] **S-6** Land M-5 (survey lifecycle clarification).
- [x] **S-7** Sweep the per-type `index.md` files affected (CCC, FS
  template, MILESTONE-STATE template if it carries an index row), and
  back-fill the `log.md` for the standards/CCC group as the
  maintenance-discipline file requires. **Outcomes 2026-05-17:**
  CCC `index.md` updated as part of S-3's 2-file touch (13 rows
  bumped to `2026-05-17`). Templates carry no `index.md`. Canonical
  `log.md` retired 2026-05-16 (per
  `sdlc/workflow/maintenance-discipline.md:633-665`) — nothing to
  back-fill. Standards `log.md` exists but no STD was touched.
  Workflow `index.md` updated to register the new
  `fs-qa-verification.md` under Rule books.
- [x] **S-8** Decide migration: grandfather (recommended) vs. one-shot
  M-01 cleanup pass. Record the decision in this plan's
  `## Migration impact` section. **Decision 2026-05-17: grandfather**
  (see `## Migration impact` for the rationale).

## Open questions

- **OQ-PR-01** — ~~Resolved 2026-05-17~~. Same question as OQ-PR-05
  from a different angle; both answered by the Option A + banner
  decision. See M-5.
- **OQ-PR-02** — ~~Resolved 2026-05-17~~. Decision: **Option A** —
  shared checklist file lives at `sdlc/workflow/fs-qa-verification.md`,
  matching the rule-book convention used by `frs-validation-rules.md`
  and `coverage-matrix.md`. No `_fragments/` subfolder invented.
- **OQ-PR-03** — ~~Withdrawn 2026-05-17~~. The
  `R-CROSS-SIBLING-FINDING-ECHO` rule was dropped after advisor review;
  the "near-identical" definition question goes with it.
- **OQ-PR-04** — ~~Resolved 2026-05-17~~. Decision: **Option B** —
  add `R-WITHIN-FRS-RULE-RESTATEMENT` at Minor severity. Rationale:
  M-01 evidence shows 3/3 FRSs violated under the existing template
  (password policy ×4 in FRS-001; already-confirmed ×4 in FRS-002;
  enumeration ×4 in FRS-003), so tightened comments alone are
  insufficient. Minor severity preserves PASS verdict; cost is one row
  in the rule book.
- **OQ-PR-05** — ~~Resolved 2026-05-17~~. Verified that
  `legacy-absorption.md` does not consume surveys (Signal-to-target map
  at lines 161-169 lists only `docs-backup/` artifact kinds). Option A
  carries no absorption-flow risk. Decision: **Option A + frozen-
  banner** locked. See M-5.
