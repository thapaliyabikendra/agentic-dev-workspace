# REVIEW-EFFICIENCY.md — Token-Economy & KB-Usage Review Tracker

> Status: COMPLETE (2026-06-10, single session) · all 7 workstreams landed; final gate `engine-lint --strict` 0 errors / 0 warns (182 files)
> Started: 2026-06-10
> Scope: token economy (core/detail flow-file layering, gradual content load),
> CLAUDE.md/PRINCIPLES.md compaction, redundancy dedupe, command segregation
> (5 new slash commands), wiki-link support (docs/ only, dual lint), persona
> KB entry points (BA + backend architect). Quality-preserving: no content
> deleted in the split — only relocated behind load triggers.
> Deliverable: [`REVIEW-EFFICIENCY-REPORT.md`](REVIEW-EFFICIENCY-REPORT.md)
> Plan file: `~/.claude/plans/review-the-slc-consider-buzzing-crab.md`
> Constraint: NO git commits without explicit per-commit user authorization
> (CLAUDE.md Rule 11). **All edits uncommitted until authorized.**
> Baseline lint (pre-edit): 159 files, 0 errors, 0 warns.

---

## Progress checklist

- [x] WS-A1 — plan.md core/detail split: 973 → 495 lines; `plan/` ×6 detail files (anti-pattern, process-flow, new-node-ingest, chg-consumption, fs-authoring, common-mistakes). 1 inbound anchor repointed (implementation.md → plan/fs-authoring.md#implementation-task-cohort-ordering). Lint clean.
- [x] WS-A2 — design.md core/detail split: 1012 → 465 lines; `design/` ×5 (pre-frs-artifacts, phase0-detail, phase1-authoring, validation-gate-detail, anti-patterns). Lint clean.
- [x] WS-A3 — implementation.md core/detail split: 731 → 474 lines; `implementation/` ×4 (node-sync, task-patterns, multi-repo, stage2-dispatch). 1 inbound anchor repointed (agent-contracts.md → implementation/node-sync.md). Lint clean.
- [x] WS-A4 — frs-validation-rules.md split: 816 → 434 lines; `frs-validation-rules/` ×3 (examples, additional-rules-full, revision-history — third file added beyond plan for the token-dense revision table). retrieval-discipline.md: detail-file executor rule + Phase 1.5 row update + routing-prose trim; workflow/index.md: detail-file convention preamble. Lint clean.
- [x] WS-B — CLAUDE.md: `## Project KB` list → 4-line paragraph (only sanctioned change; HARD-GATEs + rules 1–12 deliberately verbatim). PRINCIPLES.md: Phase-2-syntax ✅ block (13 lines of phase-birth procedure) → 4-line why + pointers to CLAUDE.md Rule 7 / plan.md HARD-GATE; canonical-edit ✅ block → 3-line why + CHG-mechanics pointers. Doctrine names + `#anti-patterns-to-refuse` anchor intact.
- [x] WS-C — dedupe: plan.md/design.md/implementation.md Integration prerequisite lists → shared "same as all dev-track flows" one-liner (done inside WS-A rewrites); retrieval-discipline.md routing-compliance prose 8 → 4 lines. E-012 ndf-edit.md verbatim gate copy → **refuted**: explicitly declared a CLAUDE.md Rule-12 defense-in-depth restatement with identical-wording contract; plan.md names it as a restatement site. No change.
- [x] WS-D — wiki-link convention shipped: KB-LAYOUT.md `§ Wiki-link syntax (docs/ only)` (canonical home — forms, prefixes, structural-glob resolution, related:-vs-body-citation division); bidirectional-link.md + maintenance-discipline.md scoping notes (`[[ID]]` never triggers the (2+N) touch); lint.md `wiki-link-unresolvable` manual debt class; engine-lint.mjs CW1 check behind `--check-wiki-links` (off by default; **functionally verified** against a temp docs/ fixture — caught unresolvable ID, invalid form, missing anchor; passed bare/aliased/anchored good forms); template notes: INDEX.md conventions bullet, HOME.md maintenance note, OVERVIEW-* example forms, FRS.md/FS.md authoring notes, 16 node templates × 1-line pointer (plain-text path, not relative link — instantiation re-bases paths)
- [x] WS-E — 5 new slash commands shipped per the established skeleton (frontmatter, ENTRY HARD-GATE, canonical-flow pointer, Produces, On-completion, rule-11 rider): `/discuss` (session-internal, NOT a session starter — requires Phase 1.5 exited in current session), `/research` (Phase-1-internal gate; standalone no-OQ research explicitly out of scope → Exploration), `/review` (two-heading classification mandatory; not Phase 1.5, not /kb-lint), `/absorb-concept` (RESEARCH staging first, index-check entry gate), `/evolve-workflow` (three-diamond discriminator restated). workflow/index.md rows annotated with command names ×5; README.md inventory rewritten grouped-by-track (was stale — missing the 12 REVIEW-CMDS skeletons too). Lint clean (182 files)
- [x] WS-F — persona entry points: HOME.md `## Navigation by persona` table (BA: ROADMAP → BUSINESS.md → milestones/OQs/glossary; Architect: TECHNICAL.md → ADR indexes → CCC/tech-stack/MOD-INT-CON-FLW indexes); OVERVIEW-BUSINESS.md + OVERVIEW-TECHNICAL.md `## How to use this report` preambles; derived-reports.md persona-alignment regeneration contract. Rejected by design (E-009/E-010): standalone docs/PERSONAS.md, per-index audience tags
- [x] WS-G — [`REVIEW-EFFICIENCY-REPORT.md`](REVIEW-EFFICIENCY-REPORT.md) authored (token table, per-workstream record, Rec-E1..E4, honesty ledger); `engine-lint --strict` → 0 errors / 0 warns / 182 files; section-loss grep audit 17/17 moved headings present; CW1 fixture test passed (3 bad forms caught, 3 good forms passed)

---

## Findings Ledger

Status enum: `candidate` | `verified` | `refuted` | `reported` | `fixed` | `deferred` | `rejected-by-design`
Severity: HIGH / MED / LOW · Effort: LOW (<30m) / MED (30–120m) / HIGH (>2h)
Category: token-cost | drift | gap | structure | strength

| ID | Sev | Effort | Category | File refs | Status | Notes |
|----|-----|--------|----------|-----------|--------|-------|
| E-001 | HIGH | HIGH | token-cost | sdlc/workflow/{design,plan,implementation,frs-validation-rules}.md | verified | Four flow files wholesale-read at phase entry cost ~56k tokens/dev-track run (15k/14.5k/10k/16k). Fix: core/detail layering (WS-A), target ~20k |
| E-002 | LOW | LOW | token-cost | CLAUDE.md | verified | Auto-loaded every session (~2.7k tokens) but already near-optimal; only `## Project KB` paragraph compressible. HARD-GATEs + rules 1–12 deliberately unchanged (always-on safety net) |
| E-003 | MED | LOW | token-cost | sdlc/PRINCIPLES.md | verified | 4–5 anti-pattern ✅ blocks carry procedural detail duplicating flow files; compress to headline + pointer (222 → ~185 lines). Named anchors preserved |
| E-004 | LOW | LOW | drift | sdlc/workflow/retrieval-discipline.md ≈32–38 | verified | "Retained context drifts" prose restates WORKFLOW.md § The Informed Skip — convert to pointer (not Rule-12 sanctioned: prose, not HARD-GATE) |
| E-005 | LOW | LOW | drift | plan.md / implementation.md § Integration | verified | Identical dev-track prerequisite lists restated; compress to shared one-liner |
| E-006 | MED | MED | gap | .claude/commands/ | verified | 5 independently invokable operations lack commands: discuss, research, review, absorb-concept, evolving-the-workflow. Sub-procedures/rule books correctly excluded |
| E-007 | MED | MED | gap | docs/ linking convention | verified | No wiki-link support; docs/ empty = cheapest moment to set `[[ID]]` convention. Scope: docs/ only; engine keeps GFM (rendering + lint investment preserved) |
| E-008 | MED | LOW | gap | sdlc/_templates/{HOME,OVERVIEW-*}.md | verified | No persona entry points — BA and backend architect have no "start here" path. Fix: nav table + report preambles (lean; no new artifact class) |
| E-009 | — | — | structure | docs/PERSONAS.md (proposed) | rejected-by-design | Standalone persona file = drift surface vs the reports it describes; inline guidance in HOME/OVERVIEW templates instead |
| E-010 | — | — | structure | per-index `audience:` tags (proposed) | rejected-by-design | Retroactive cost on every index row > value for a 2-persona model; OVERVIEW-BUSINESS/TECHNICAL are the scoped views |
| E-011 | — | — | structure | engine-wide `[[wiki]]` conversion (proposed) | rejected-by-design | ~1,600 link conversions, breaks GitHub/GitLab rendering of engine docs, full engine-lint C1/C2 rewrite; user selected KB-only dual support |
| E-012 | LOW | LOW | drift | sdlc/workflow/ndf-edit.md ≈47–59 | refuted | Verbatim copy is **declared** Rule-12 defense-in-depth ("the restatements below carry the identical wording"); plan.md's canonical-home note names ndf-edit.md as a restatement site. Sanctioned, not drift |
| E-013 | — | — | strength | sdlc/tools/engine-lint.mjs | verified | C5 direct-children-only + C1/C2 template exemption + `[[...]]` invisible to LINK_RE make the detail-subfolder and wiki-link designs lint-safe with zero check rewrites (CW1 is additive, opt-in) |

---

Ledger disposition: E-001..E-008 → **fixed** (per the workstream checklist
lines above); E-009/E-010/E-011 → rejected-by-design (recorded);
E-012 → refuted; E-013 → strength (it held — zero lint-check rewrites
were needed beyond the additive CW1).

## Session log

- 2026-06-10 — Tracker created. Baseline `node sdlc/tools/engine-lint.mjs`: 159 files, 0 errors, 0 warns (4 notices, all expected).
- 2026-06-10 — All workstreams executed in order A→B/C→D→E→F→G; lint run after every workstream (2 transient anchor errors caught and repointed during WS-A; otherwise clean throughout). Final: 182 files, `--strict` clean. 23 new files (18 detail + 5 commands), 2 review artifacts, ~20 edited. **Nothing committed** — per-commit authorization pending (Rule 11).
