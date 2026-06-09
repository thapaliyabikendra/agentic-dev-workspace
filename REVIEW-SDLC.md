# REVIEW-SDLC.md — Framework Review Tracker

> Status: COMPLETE (2026-06-10, single session)
> Started: 2026-06-10
> Scope: review + full remediation (low- AND medium-effort fixes; HIGH-effort items → recommendations only)
> Deliverable: [`REVIEW-SDLC-REPORT.md`](REVIEW-SDLC-REPORT.md) — 8 prioritized recommendations + 31 applied fixes
> Plan file: `~/.claude/plans/review-the-agentic-sdlc-noble-sphinx.md`
> Constraint: NO git commits without explicit per-commit user authorization (CLAUDE.md Rule 11). **All edits uncommitted.**
>
> Ledger disposition: every row below is terminal — rows whose Notes
> say "Quick fix" / "Phase 4" / "fix:" were APPLIED (see Phase 3 + 4
> checklist lines for the per-fix record + audit); rows marked
> "→ report" / "deferred" are carried as Rec-01..Rec-08 in the report;
> `refuted` rows are dead. Phase 6 independent audit: 6/6 checks PASS.

---

## Progress checklist

- [x] Phase 0 — Tracker created
- [x] Phase 1 — Adversarial verification of candidate findings (agents A–F, 2 rounds)
- [x] Phase 2 — Deep-dive unexamined areas (agents G–I)
- [x] Phase 3 — Quick fixes ALL APPLIED 2026-06-10: F-001/019 (BOUNDARY ×3 sites) · F-002 (log annotation) · F-003 (PRINCIPLES NDF mention, WORKFLOW-gate-consistent) · F-008 (model-agnostic trailer) · F-009 (precondition note) · F-021 (README: commands list, QA/CR tracks, HARD-GATE summary; note — /clear was already present at README:60, finding was overstated) · F-T01 (EVT proposed) · F-T02 (STA related:) · F-T03 (OVERVIEW ×2 pulls-from; body sections were already correctly labeled legacy) · F-015 rider (plan.md:33) · F-Q02 (docs/ literal) · F-Q03 (root config path) · F-Q04 (index retired-table note) · F-Q06 (TC.md → test-plan-ingest + coverage-matrix; also dropped retired Traces-to mention) · F-Q07 (futureDate not-in-base-vocab) · F-Q09 (sync note between token tables) · F-S01 (Log\w+ regex) · F-S02 (boundary-anchored short tokens; longer tokens substring — \b would false-negative PasswordHash) · F-S03 (R4 row in application.md) · F-S04 (R5/R6 rows in infrastructure.md) · F-G01 (graph edge → "same session (no /clear)"). Post-batch scan clean
- [x] Phase 4 — Medium remediation ALL APPLIED 2026-06-10: 4.1 F-005 (fs-qa-verification: conformance-scan row + does-not-replace note; qa-gate: Vs-sibling block naming the bypass) · 4.2 F-006/007 (implementation.md ×3 → engine-default + task-ordering-ADR override; evolving-the-workflow + KB-LAYOUT EXP cites → historical-reference framing; by-layer/index.md ADR-009 ×2 aligned; NOTE: ADR-039 cited from 20+ engine sites — too pervasive for this pass, escalated to report rec) · 4.3 F-011/012 (in-flight-nodes.md Integration: explicit canonical-home declaration for ACT lifecycle + CHG mechanics with on-conflict-this-file-wins) · 4.4 F-020 (NEW sdlc/workflow/grandfather-registry.md, 9 clauses pointer-style incl. EP→CON 05-14 + prototypes 06-05; index.md rule-books row; rule-history.md cross-link) · 4.5 F-T04 (EXPLORATION.md index path → docs/discovery/exploration/index.md per discovery-surface.md) · 4.6 F-T05 (BOUNDARY.md CHG enum was the incomplete side — added deprecated off-ramp per in-flight-nodes.md R-CHG-3; template was right) · 4.7 F-G02..06 (WORKFLOW-GRAPH rewritten: CR/bug-fix/prototype tracks, NDF + framework: in node labels, discuss.md note, last_updated: field, on-disagreement-fix-this-graph note) · 4.8 F-S05 (by-layer/index.md framework-guard block) · 4.9 F-S06 (STD-004 project-pilot quarantine callout) · 4.10 F-Q08 ({tcNumber} = digits-only canonical; both tables fixed)
- [x] Phase 5 — REVIEW-SDLC-REPORT.md authored (exec summary, refuted-findings honesty ledger, Rec-01..Rec-08, strengths, applied-fixes summary)
- [x] Phase 6 — Independent audit agent: 6/6 PASS (links resolve, no stale leftovers, NDF HARD-GATE 3-copy agreement, templates intact, graph dot-syntax + /clear placement agree with index.md, CHG enum backed by in-flight-nodes.md). Auditor notes: WORKFLOW.md ADR-039 cites intentionally left for Rec-01; report intentionally has no applies_when (not a workflow file)

---

## Findings Ledger

Status enum: `candidate` | `verified` | `refuted` | `reported` | `fixed` | `deferred`
Severity: HIGH / MED / LOW · Effort: LOW (<30m) / MED (30–120m) / HIGH (>2h)
Category: drift | complexity | gap | automation | strength

| ID | Sev | Effort | Category | File refs | Status | Notes |
|----|-----|--------|----------|-----------|--------|-------|
| F-001 | HIGH | LOW | drift | sdlc/BOUNDARY.md ≈72,149,405 | verified | "twelve node types" — catalog is 16 (`_templates/nodes/` = 16 files) |
| F-002 | HIGH | LOW | drift | sdlc/standards/log.md ≈47 | verified | "Four governance sources" — five since NDF 2026-05-19. Fix = dated annotation (append-only log) |
| F-003 | LOW | LOW | drift | sdlc/PRINCIPLES.md:145 | verified | WEAKENED: existing "Coining a new node type" anti-pattern + pointer chain to evolving-the-workflow.md:14–27 gives doctrinal cover; NDF not named explicitly. Fix = minimal additive mention, no new anti-pattern. HARD-GATE copies: WORKFLOW.md:165–176, evolving-the-workflow.md:14–27 (canonical), ndf-edit.md:33–45 |
| F-004 | MED | MED | drift | sdlc/standards/STD-002:513,685–689 | verified | WEAKENED: by-layer/domain.md:31 surfaces R5 regardless of stack (layer-driven dispatch). Gap only for index-level applies_when filtering. Migration note exists; STD-001 trigger open-ended. → deferred/report. Risk: on migration, domain.md pointer must follow |
| F-005 | MED | MED | drift | sdlc/workflow/qa-gate.md:51–100 + fs-qa-verification.md | verified | 4 conformance scans (ADR/STD/CCC/code-pattern) in qa-gate only; fs-qa-verification (linked from FS.md:176) omits them; NEITHER file cross-links the other. Sub-claim refuted: both say approved→merged. Fix: bidirectional cross-refs, qa-gate canonical for scans |
| F-006 | HIGH | MED | drift | sdlc/workflow/implementation.md ≈413,430,441 | verified | Hardcodes docs/app/adrs/ADR-009 — project artifact as engine authority |
| F-007 | HIGH | MED | drift | sdlc/workflow/evolving-the-workflow.md ≈26 | verified | Cites docs/exploration/EXP-NDF-engine-diffs.md in HARD-GATE callout |
| F-008 | MED | LOW | drift | .claude/commands/commit-staged.md | verified | Hardcoded "Claude Opus 4.8 (1M context)" Co-Author trailer |
| F-009 | HIGH | LOW | drift | .claude/commands/api-integration.md | verified | Routes to ui/docs/PROTOTYPE-API-INTEGRATION.md — cross-repo dep unacknowledged |
| F-010 | MED | HIGH | complexity | sdlc/workflow/plan.md:763–871 | verified | Corrected: 22 items (not 30), all Blocker-tier confirmed (plan.md:777–779), audit/write interleaving confirmed, no ordering despite logical deps. → report rec (add partial ordering) |
| F-011 | MED | MED | complexity | ACT lifecycle — 16 files | verified | Worse than claimed: 16 files (in-flight-nodes.md:65–95 closest to canonical; plan.md, design.md, rule-history.md, frs-validation-rules.md, retrieval-discipline.md, phase-15-roundtrip.md, agent-contracts.md, new-component-bootstrap.md, node-edit.md, 4 templates, WORKFLOW.md, PRINCIPLES.md, CLAUDE.md). No end-to-end statement anywhere. Fix: declare canonical home + normative pointers (light touch) |
| F-012 | MED | MED | complexity | CHG lifecycle — 20 files | verified | Worse than claimed: 20 files. in-flight-nodes.md:292 self-declares canonical + has full lifecycle table. Grandfathered-path note alone appears in 10+ files. Fix: pointer normalization only; keep operational restatements |
| F-013 | LOW | MED | complexity | /clear rule — 14 sites | verified | WEAKENED: 14 sites but nearly all cite CLAUDE.md R5 (Rule-12 sanctioned). Exception rationale NOT CLAUDE-only (refuted); only the gate-independence reasoning is CLAUDE-unique. Consolidation NOT advised → report note only |
| F-014 | LOW | HIGH | complexity | sdlc/workflow/bidirectional-link.md:3–48 | verified | WEAKENED: per-op atomicity (8 files/node correct) ≠ bulk-ingest atomicity; batching discipline exists (absorb-codebase.md:86–117). Real gap: "atomic operation" scope (commit vs turn) undefined → report rec |
| F-015 | LOW | LOW | complexity | .claude/commands/{absorb-codebase,execute-plan,plan}.md | verified | WEAKENED: no current drift; 12/15 commands carry "canonical wins" disclaimer. One elision: plan.md:33 omits anti-batching rider (agent-contracts.md:237). Dated stamps REJECTED (maintenance overhead > benefit). Fix: add rider to plan.md:33 only |
| F-016 | LOW | — | complexity | design.md § Minimal read set | refuted | design.md already has consolidated per-task load table ("Actual Phase 1.5 execution" row); guaranteed count = 6 files, not 9+. Residual: design.md table ↔ retrieval-discipline.md row use different framing — silent-divergence risk → report note. Phase 4.6 DROPPED |
| F-017 | HIGH | HIGH | gap | sdlc/workflow/ | verified | Genuine gaps: deployment, security review, dep upgrades, perf, incident response, component sunset. Partial coverage: hotfix (bug-fix.md), multi-agent (in-flight-nodes/agent-contracts), data migration (CHG migration_steps[]), retrospective (close-milestone/review.md). → report recs via evolving-the-workflow.md |
| F-018 | HIGH | HIGH | automation | repo-wide | verified | Zero tooling (no CI/scripts/linters); cross-ref-guard.md + lint.md are manual-only |
| F-019 | LOW | LOW | drift | sdlc/BOUNDARY.md ≈149 | verified | Lists superseded ENDPOINT template; CONTRACT since 2026-05-14 |
| F-020 | MED | MED | complexity | 7 clauses / 4 cutover dates | verified | Census complete: log.md retirement (05-16), CHG path + consumes_chgs + FLW created_under + id-claims op:introduce (05-17), framework: mandatory (05-22), STD-005 naming (05-28). No aggregator: rule-history.md covers 3/7, standards/log.md 5/7. Fix: pointer-style registry (clause → canonical home + retirement trigger), no rule-text duplication |
| F-021 | LOW | LOW | drift | README.md | verified | No /clear discipline, slash-command inventory, HARD-GATE summary |
| F-T01 | HIGH | LOW | drift | sdlc/_templates/nodes/EVENT.md:5 | verified | Default `status: active` — should be `proposed` (BOUNDARY.md:312); EVT born from template bypasses Phase 3 proposed→active flip. Quick fix |
| F-T02 | HIGH | LOW | drift | sdlc/_templates/nodes/STATE.md | verified | Frontmatter missing `related:` field (only node template without it) — breaks bidirectional-link contract for STA↔ENT/CMD triad. Quick fix |
| F-T03 | MED | LOW | drift | sdlc/_templates/OVERVIEW-BUSINESS.md:31, OVERVIEW-TECHNICAL.md:30,106 | verified | Cite legacy flat docs/discovery/open-questions.md as co-equal source alongside current per-OQ folder/index path. Quick fix: mark grandfathered or drop |
| F-T04 | LOW | MED | drift | sdlc/_templates/EXPLORATION.md:5 | verified | 2-file touch instruction targets docs/exploration/index.md — no workflow file establishes that index; possibly dangling. Verify vs discovery-surface.md at fix time |
| F-T05 | LOW | LOW | drift | sdlc/_templates/nodes/CHANGE.md:5 | verified | Status enum shows `draft \| approved \| merged \| deprecated`; BOUNDARY.md:315 enum lacks `deprecated` BUT in-flight-nodes.md lifecycle table reportedly includes deprecated (abandonment). Reconcile which side is right (Phase 4) |
| — | — | — | strength | templates (clean areas) | verified | FRS/FS carry stack:+framework: HARD-GATE fields; all 16 node templates present; zero stale ENDPOINT/EP refs; no op:introduce leakage; LOG.md correctly retirement-annotated; CROSS-CUTTING-CONCERNS.md correctly per-CCC |
| F-Q01 | LOW | — | drift | test-runner-cookbook.md:3 | refuted | Agent claimed `stack: [test]` undefined — REFUTED by main thread: BOUNDARY.md:342 lists `test` in enum, :354 uses `[test]` as example. Residual report note: framework enum (abp-net/agnostic) cannot express Playwright binding |
| F-Q02 | MED | LOW | drift | test-runner-cookbook.md:256 | verified | `{docs_repo}` token in spec `// Source:` template — never defined anywhere; agents will emit it literally. Quick fix: use `docs/` |
| F-Q03 | MED | LOW | drift | test-runner-cookbook.md:354–356 vs test-suite-codegen.md:36 | verified | Config path `tests/playwright.config.ts` vs `playwright.config.ts` — contradictory. Quick fix: align to codegen flow's root path |
| F-Q04 | MED | LOW | drift | sdlc/workflow/index.md:40 | verified | Index says test-plan-ingest "fills FRS test-plan-view table" — retired 2026-05-17 (test-plan-ingest.md:110). Quick fix |
| F-Q05 | MED | — | complexity | test-data-generation.md:269 | verified | afterEach-vs-beforeEach hedge → non-deterministic codegen. Needs fixture-pattern decision → report rec |
| F-Q06 | MED | LOW | drift | sdlc/_templates/TC.md:28 | verified | Dead anchor plan.md#test-plan-ingest-after-fs-validation (valid: #6-fs-validation-loop). Quick fix |
| F-Q07 | MED | LOW | drift | test-data-generation.md:207 vs 64–69 | verified | `{futureDate(N)}` directive absent from token vocabulary table. Quick fix: add with NOT-YET-SUPPORTED note or remove |
| F-Q08 | LOW | MED | drift | test-runner-cookbook.md:173 vs TC.md | verified | Baked TC number `TC001` vs ID format `TC-001` — needs canonical-form decision across 3 files → Phase 4/report |
| F-Q09 | LOW | LOW | complexity | test-data-generation.md:64–69 + test-runner-cookbook.md:171–176 | verified | Placeholder vocab in 2 files, cookbook extends without cross-ref note → add cross-ref |
| F-S01 | HIGH | LOW | drift | sdlc/standards/STD-006:103 | verified | Merge-gate grep `_logger.Log*\(\$"` is glob-not-regex (matches "Logggg(" never "LogInformation(") — gate silently passes all violations. Fix: `_logger\.Log\w+\(\$"` |
| F-S02 | HIGH | LOW | drift | sdlc/standards/STD-006:138–139 | verified | PII scan regex: bare `token` matches totalCount/tokenizer → noise or disablement. Fix: word boundaries |
| F-S03 | HIGH | LOW | gap | sdlc/standards/by-layer/application.md | verified | STD-002 R4 (IQueryable repo discipline) scans Application/ per R4§4.6 but absent from application.md pointer — Application subagent never loads it. Fix: add row |
| F-S04 | MED | LOW | gap | sdlc/standards/by-layer/infrastructure.md | verified | STD-006 R5+R6 apply to infra code (jobs, adapters) but absent from infrastructure.md pointer. Fix: add rows |
| F-S05 | MED | MED | drift | sdlc/standards/by-layer/index.md | verified | by-layer dispatch drops STD-005's framework:[abp-net] qualifier — vanilla ASP.NET project would load ABP rules unguarded. Fix: conditional note in by-layer/index.md |
| F-S06 | MED | MED | drift | sdlc/standards/STD-004:80–127 | verified | "FDE NDF pilot" project content (FDE-NDF-001..003, domain fields, ADR-039) embedded in engine standard; only quarantine = tag + deferred status → Phase 4/report |
| F-S07 | LOW | — | automation | STD-005:630–635, STD-002 R5.6 | verified | Merge-gate logic requires AST/scope analysis, not expressible as grep → report (automation theme) |
| F-G01 | HIGH | LOW | drift | sdlc/WORKFLOW-GRAPH.md:64 | verified | Graph edge labels codegen→gate boundary `/clear` — contradicts CLAUDE.md R5, WORKFLOW.md, index.md, both flow files AND its own footnote (:74–75). Quick fix: remove label |
| F-G02 | HIGH | MED | gap | sdlc/WORKFLOW-GRAPH.md | verified | CR track + bug-fix track entirely absent from graph (WORKFLOW.md names 3 tracks). Phase 4: graph refresh |
| F-G03 | HIGH | MED | gap | sdlc/WORKFLOW-GRAPH.md | verified | Prototype track (PROTO disposition, prototype-first.md, 2 commands) absent. Phase 4: graph refresh |
| F-G04 | MED | LOW | drift | sdlc/WORKFLOW-GRAPH.md:28–31 | verified | NDF custom-type ingest (ADR-039, 05-19) missing from Phase 2 box. Phase 4: graph refresh |
| F-G05 | MED | LOW | drift | sdlc/WORKFLOW-GRAPH.md:1–4 | verified | No last_updated marker; framework: HARD-GATE absent from gate nodes. Phase 4: graph refresh + add marker |
| F-G06 | LOW | LOW | gap | sdlc/WORKFLOW-GRAPH.md | verified | discuss.md pre-plan op absent from graph. Fold into graph refresh |
| F-G07 | LOW | — | complexity | WORKFLOW-GRAPH.md routing | verified | Referenced only from WORKFLOW.md:102,440 — low traffic = high staleness risk (exactly what F-G01 shows) → report rec: add to lint.md staleness scan |

### Strengths to preserve (report Theme 5 — fixes must not damage these)

- Single-canonical-home + "When to Use / vs sibling" triads on every file
- Index-first (Karpathy) retrieval pattern across all artifact classes
- Centralized status vocabularies (BOUNDARY.md)
- Consistent named grandfathering pattern
- Defense-in-depth HARD-GATE restatement policy (CLAUDE.md Rule 12)
- Discriminator tables with worked examples (KB-LAYOUT.md)

---

## Session Log

### Session 1 — 2026-06-10 (review completed end-to-end)
**Completed:** All 7 phases. 13 subagents total (3 explore + 1 plan + 6 verify + 3 deep-dive + 1 audit). 40 ledger findings (21 original + 19 from deep-dives); 5 refuted/downgraded by adversarial verification; 31 fixed across 24 files + 2 new files (grandfather-registry.md, this tracker + report); 8 recommendations in REVIEW-SDLC-REPORT.md.
**Next step (user):** review `git diff`, then authorize commit(s) if desired — suggested batches: (1) engine fixes under sdlc/, (2) command + README fixes, (3) review tracker + report. Then pick up Rec-01 (ADR-039 promotion) or Rec-02 (lint runner) as the next work item.
**Re-load first (future session):** REVIEW-SDLC-REPORT.md → this file → sdlc/workflow/grandfather-registry.md.
**Open threads:** WORKFLOW.md still cites ADR-039 directly ×3 (intentional — Rec-01 scope); STD-001 graduation trigger open-ended (Rec-05); afterEach/beforeEach fixture decision pending first QA-track run (Rec-08).

---

## Handoff Notes

(Populated at session end if work continues in a new session. Re-load order: this file → plan file → files named in active-phase ledger rows.)
