# SDLC Framework Review — Feedback Report

> Reviewed: 2026-06-10 · Scope: full engine (`sdlc/` 128 files, `.claude/commands/` 15, root docs) · Method: 3 exploration agents → adversarial verification (6 agents, every finding re-checked against files before assertion) → 3 deep-dive agents → remediation.
> Findings ledger with file:line evidence: [`REVIEW-SDLC.md`](REVIEW-SDLC.md). **31 of 40 findings fixed in this pass**; the rest are recommendations below.
> All edits are uncommitted (CLAUDE.md Rule 11). *(Historical — see Disposition.)*
>
> **Disposition (2026-06-10, post-review sessions).** All review edits committed
> (`81783fe` engine fixes + grandfather-registry, `3bef751` commands + README,
> `451c82e` this tracker + report). Recommendations executed:
> **Rec-01 DONE** (`1af5253` — STD-007 NDF governance, all ADR-039 cites re-pointed) ·
> **Rec-02 DONE** (`7d71fab` — `sdlc/tools/engine-lint.mjs`, 8 defects caught + fixed) ·
> **Rec-03 / 05 / 06 / 07 DONE** (`ec67570` — plan.md §6 ordered; STD-001 graduation
> trigger made binding, re-scope option rejected; bidirectional-link atomicity scope;
> R5.6/R16 tagged manual-or-AST) ·
> **Rec-04 deferred by design** (route each flow file through `evolving-the-workflow.md`
> on first real need) · **Rec-08 blocked** until the QA track first runs.
> Nothing pushed to a remote.

## Executive summary

1. **The framework is structurally sound and unusually well-designed for LLM operation** — single-canonical-home discipline, index-first retrieval, and worked-example discriminators are genuine strengths worth protecting. Several "obvious" complexity complaints (Phase 1.5 load burden, /clear duplication, NDF doctrine gap) turned out on adversarial re-check to be already solved by the framework's own architecture.
2. **Its real failure mode is drift under its own change velocity.** 4 cutover dates and 9 grandfather clauses landed in one month with zero automated enforcement; the artifacts most damaged were exactly the low-traffic ones (WORKFLOW-GRAPH.md depicted the *opposite* of the QA-track session rule; BOUNDARY.md was 4 node-types and one supersession behind; two node templates carried defects that would have silently corrupted every future EVT/STA node).
3. **The engine is not yet deployable outside its originating project.** Project artifacts (ADR-009, ADR-039, EXP-NDF, FDE pilot data) were cited as procedural authority inside engine files. This pass parameterized ADR-009/EXP citations; ADR-039 (20+ sites) needs a deliberate promotion decision — Rec-01.
4. **Highest-leverage next investment is a mechanical lint pass, not more prose.** The defect classes found (dead anchors, stale one-liners, enum mismatches, missing frontmatter fields, broken merge-gate regexes) are all machine-checkable; `lint.md` and `cross-ref-guard.md` already specify the checks but nothing runs them — Rec-02.
5. **Lifecycle coverage has six genuine gaps** (deployment, security review, dependency upgrades, performance, incident response, component sunset) — all routable through the framework's own `evolving-the-workflow.md` mechanism when needed — Rec-04.

## Severity × effort (verified findings, condensed)

| Theme | Fixed this pass | Remaining (→ recommendation) |
|---|---|---|
| Correctness / drift | 19 (BOUNDARY counts ×3, gov-source count, EVT birth-status, STA `related:`, graph /clear edge, STD-006 gate regexes ×2, dead anchors/paths ×5, stale index rows ×2, OVERVIEW legacy paths, CHG enum, token contradictions ×2) | ADR-039 engine-purity (Rec-01) |
| Complexity / token economy | 6 (QA-gate sync, canonical-home declarations, grandfather registry, by-layer framework guard, command rider, token-table sync note) | plan.md §6 ordering (Rec-03); bidirectional-link atomicity scope (Rec-06) |
| Gaps | 4 (graph: CR/bug-fix/prototype tracks, NDF; by-layer rows ×3) | 6 missing flow files (Rec-04); STD-001 graduation (Rec-05) |
| Automation | 0 | lint runner (Rec-02); AST-level gates (Rec-07) |

## Refuted / weakened findings (review honesty ledger)

Adversarial verification killed or downgraded 5 of the original 21 claims — worth recording so they aren't re-reported by a future review:

- **"Phase 1.5 needs 9+ file loads, no consolidated checklist" — refuted.** `design.md § Minimal read set per task type` is exactly that checklist; guaranteed load is 6 files. Residual risk: that table and `retrieval-discipline.md`'s Phase 1.5 row use different framings and could silently diverge — keep them paired on edit.
- **"`stack: [test]` is undefined" — refuted.** It's in the BOUNDARY.md:342 enum. Residual: the `framework:` enum (`abp-net`/`agnostic`) cannot express a Playwright binding for the QA cookbook — extend the enum when a second test framework appears.
- **"/clear rule scattered with drift" — downgraded.** 14 sites, but nearly all cite CLAUDE.md Rule 5 and are Rule-12-sanctioned defense-in-depth. Consolidation would *reduce* safety. No action.
- **"No NDF anti-pattern in PRINCIPLES.md" — downgraded.** The "Coining a new node type" anti-pattern + pointer chain already carried the doctrine; a one-line NDF mention was added for explicitness, no new anti-pattern needed.
- **"Command mirrors have drifted" — not yet.** Zero current divergence found across the 3 mirroring commands; one elision fixed. Dated mirror-stamps were considered and **rejected** (12 commands × every canonical edit = guaranteed overhead exceeding the latent risk).

## Recommendations (prioritized)

**Rec-01 — Promote ADR-039's NDF spec into the engine.** `HIGH / MED`
ADR-039 (project-owned, `docs/shared/adrs/`) is cited as binding authority from 20+ engine sites (WORKFLOW.md, plan.md, ndf-edit.md, templates, …). A fresh deployment has no ADR-039, leaving the NDF governance kind specified nowhere. Move the normative content into the engine — STD-004 is the natural host (already `status: deferred` with an NDF-analog paragraph) or a new `sdlc/NDF-SPEC.md`; engine files cite that; the originating project's ADR-039 becomes the adoption record. Landing: `evolving-the-workflow.md` (refine-existing path) + `rule-history.md` entry. *Files:* the 20+ cite sites (mechanical re-point after the host decision).

**Rec-02 — Build the lint runner.** `HIGH / MED`
Everything needed is already specified in prose: `cross-ref-guard.md` (dangling refs), `lint.md` (5 debt classes), BOUNDARY.md (enums, frontmatter contracts), `grandfather-registry.md` (new — registry-vs-engine sync). A single script (Node/PowerShell, no deps) checking: relative links resolve, anchors exist, frontmatter carries required fields per artifact type, status values ∈ enum, every workflow file appears in `index.md`, `last_updated:` staleness on low-traffic files (WORKFLOW-GRAPH.md class). This review found ~12 defects that this script would have caught at introduction time. Landing: ADR (project) or SETUP.md step; run manually or pre-commit — CI optional.

**Rec-03 — Add partial ordering + a "writes vs checks" split to `plan.md` §6.** `MED / LOW`
22 Blocker checkboxes with no sequence, interleaving audit checks with write operations (verified). Group into "writes first" / "then verifications," note the 3–4 real dependencies (e.g., CHG structural deltas before id-claims rows). Reduces the silent-skip failure mode without changing any rule. Landing: direct edit, `rule-history.md` note.

**Rec-04 — Coin flow files for the six genuine lifecycle gaps, on first need.** `MED / HIGH`
Genuinely absent (verified against all 40 index routes): deployment/release, security review, dependency upgrades, performance work, incident response, component sunset. Partially covered (no new file needed yet): hotfix (`bug-fix.md`), data migration (CHG `migration_steps[]`), retrospective (`close-milestone.md` + `review.md`), multi-agent concurrency (`in-flight-nodes.md` + `agent-contracts.md`). Don't pre-author all six — that violates the framework's own lazy-creation doctrine; route each through `evolving-the-workflow.md` when the first real instance arrives. Deployment is likely first (the ABP bootstrap pack already touches appsettings/infra).

**Rec-05 — Set a concrete STD-001 graduation trigger.** `MED / LOW`
STD-002 R5 (aggregate-root encapsulation, DDD-universal) lives in a `stack:[api]` standard; the `by-layer/domain.md` pointer mitigates for cohort-dispatched projects but index-level `applies_when` filtering misses it. STD-001's `deferred_until` is open-ended, making STD-002's migration note a standing false promise. Either graduate STD-001 at the next domain-layer FRS (current trigger) **with a named owner row in the milestone**, or re-scope R5's `applies_when` to `[agnostic]` now. On migration: update `by-layer/domain.md`'s R5 pointer in the same change.

**Rec-06 — Define "atomic operation" scope in `bidirectional-link.md`.** `LOW / LOW`
The (2+N) touch rule is per-node-create (8 files for 3 `related:` targets — math verified), but the file never says whether "atomic" means one commit or one turn, and bulk Phase 2 ingests amplify the ambiguity. One paragraph: each node's (2+N) set is one atomic unit; a bulk ingest is N sequential units; the post-op grep gate fires per unit.

**Rec-07 — Mark AST-dependent merge-gate scans as such.** `LOW / LOW`
STD-005 R16 and STD-002 R5.6 describe scans grep cannot express (block-scope analysis, multi-line declarations). Tag them "requires manual review or AST tooling" so Phase 3 agents don't fabricate a passing grep. (STD-006's two broken regexes were already fixed this pass.)

**Rec-08 — Decide the `afterEach`-vs-`beforeEach` fixture pattern.** `LOW / LOW`
`test-data-generation.md:269` hedges on where Pre-existing State TODOs land, producing non-deterministic codegen. One decision, one line. Blocked on the project's first real fixture; fine to defer until the QA track first runs.

## Strengths to preserve (do not "fix" these)

- **Single-canonical-home + "When to Use / vs sibling" triads** on every file — the routing problem LLMs usually have is mostly solved here.
- **Index-first (Karpathy) retrieval** applied uniformly; `retrieval-discipline.md` as an explicit token lever.
- **Defense-in-depth HARD-GATE restatement** (Rule 12) — looks like duplication, is actually the reason single missed loads don't bypass gates. The /clear "scatter" is this pattern working.
- **Discriminator tables with worked examples** (KB-LAYOUT.md) — materially better than abstract rules for agent compliance.
- **Named, dated grandfathering** — now aggregated in `workflow/grandfather-registry.md`; keep appending there.
- **Self-evolution mechanism** (`evolving-the-workflow.md` + `rule-history.md`) — every recommendation above lands through it; that's the sign of a framework that can absorb its own review.

## Applied fixes (commit-ready summary)

31 fixes across 24 files, two new files. Quick reference (full per-fix notes in [`REVIEW-SDLC.md`](REVIEW-SDLC.md) Phase 3/Phase 4 checklist lines):

- **New:** `sdlc/workflow/grandfather-registry.md` (9-clause pointer registry); `REVIEW-SDLC.md` / this report.
- **Core docs:** BOUNDARY.md (16-type counts ×3, ENDPOINT→CONTRACT, CHG `deprecated` off-ramp); PRINCIPLES.md (NDF mention); KB-LAYOUT.md (EXP cite → historical); WORKFLOW-GRAPH.md (rewritten: wrong /clear edge fixed, CR/bug-fix/prototype tracks added, NDF + `framework:` labels, `last_updated:`); README.md (commands, tracks, HARD-GATE summary).
- **Workflow:** implementation.md (ADR-009 ×3 → engine-default + override), evolving-the-workflow.md (canonical HARD-GATE wording owned by engine), in-flight-nodes.md (explicit canonical-home declarations), fs-qa-verification.md + qa-gate.md (bidirectional gate-bypass closure), index.md (stale row, registry row), rule-history.md (registry pointer), test-runner-cookbook.md (`{docs_repo}`, config path, `{tcNumber}`), test-data-generation.md (`{futureDate}`, token sync note, `{tcNumber}`).
- **Standards:** STD-006 (two merge-gate regexes corrected), STD-004 (pilot quarantine), by-layer/index.md (framework guard, ADR-009 ×2), by-layer/application.md (+R4), by-layer/infrastructure.md (+R5/R6), standards/log.md (dated correction note).
- **Templates:** nodes/EVENT.md (`status: proposed`), nodes/STATE.md (`related:`), TC.md (re-pointed links), EXPLORATION.md (discovery path), OVERVIEW-BUSINESS/-TECHNICAL.md (OQ index paths).
- **Commands:** commit-staged.md (model-agnostic trailer), api-integration.md (existence precondition), plan.md (anti-batching rider).

## Deferred / out of scope

Repo split into distributable engine + project overlay (BOUNDARY.md "Phase B") — prerequisite for Rec-01's full value, deferred by design. Multi-developer concurrency model — single-operator assumption is load-bearing throughout; revisit only if the team grows. `docs/` KB does not exist yet; nothing in this review touches project artifacts.
