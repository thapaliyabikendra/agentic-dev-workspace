# REVIEW-EFFICIENCY-REPORT.md — Token-Economy & KB-Usage Review

> Review date: 2026-06-10 · Tracker: [`REVIEW-EFFICIENCY.md`](REVIEW-EFFICIENCY.md)
> Scope: token economy (core/detail flow-file layering), CLAUDE.md /
> PRINCIPLES.md compaction, redundancy dedupe, command segregation,
> wiki-link support (docs/ only), persona KB entry points.
> Verification: `engine-lint --strict` 0 errors / 0 warns (182 files);
> CW1 functionally tested against a fixture; section-loss grep audit
> 17/17 headings present. **All edits uncommitted** (CLAUDE.md Rule 11).

## Executive summary

The framework's prose quality was already high (REVIEW-SDLC fixed drift);
its cost problem was **load shape**: four flow files wholesale-read at
phase entry carried examples, edge-case procedures, and worked tables
that fire on perhaps 1 in 5 entries. This review restructured them into
**core files (binding gates + critical-path procedure, read at entry)
plus 18 detail files (loaded only when their trigger fires)** — no
content was deleted, only relocated behind explicit load triggers. The
same pass shipped the cheapest-possible-moment changes for the empty
project KB: a wiki-link convention with dual lint support, persona entry
points for the Business Analyst and Backend Architect, and slash
commands for the 5 remaining independently invokable operations.

## Token accounting — flow-file reads per dev-track run

| Phase entry | Before | Core after | Saving | Detail files (load on trigger only) |
|---|---|---|---|---|
| Phase 0/1 (design.md) | ~15.0k tok / 1012 ln | ~7.8k / 465 | −48% | 5 files ~8.9k (phase1-authoring + validation-gate-detail dominate; each fires in exactly one sub-phase) |
| Phase 1.5 (frs-validation-rules.md) | ~16.0k / 816 | ~7.8k / 434 | −51% | 3 files ~9.1k (examples / 7-rules-full / revision-history — load per firing finding) |
| Phase 2 (plan.md) | ~14.5k / 973 | ~8.9k / 495 | −38% | 6 files ~6.9k (chg-consumption only when `touches_nodes:` non-empty; fs-authoring only while drafting prose) |
| Phase 3 (implementation.md) | ~10.0k / 731 | ~7.8k / 474 | −22% | 4 files ~2.8k (multi-repo never loads on a monolith) |
| **Dev-track entry total** | **~55.5k** | **~32.3k** | **−42%** | ~27.7k available, never all at once |

Why −42% rather than the plan's estimated −65%: the binding gates stayed
in core **by design** — plan.md keeps the full §2 ID-claim protocol and
§6 validation loop (the Phase-2 close gate), frs-validation-rules keeps
the complete severity table, design/implementation keep every exit
checklist. Compressing gates to pointers would have traded correctness
surface for tokens; the review declined that trade. The detail files are
additionally amortized: a returning section-routed reader (per the
strengthened executor contract) now reads far less than even the core.

## What shipped (by workstream)

1. **A — core/detail layering.** 18 detail files under same-name
   subfolders (`plan/`, `design/`, `implementation/`,
   `frs-validation-rules/`), each with `applies_when.stack: [agnostic]`
   frontmatter (C4 recurses) and a parent-pointer header. Core files
   keep stub headings (anchor-stable), 2–3-line summaries, and a
   `## Detail files` trigger table. Wiring: retrieval-discipline.md
   executor-contract rule + Phase 1.5 row; workflow/index.md convention
   preamble. Two inbound anchors repointed; lint caught both.
2. **B — CLAUDE.md / PRINCIPLES.md.** CLAUDE.md verdict: already
   near-optimal; only the `## Project KB` list was tightened — the 5
   HARD-GATEs and rules 1–12 are the always-on safety net and stay
   verbatim. PRINCIPLES.md: two anti-pattern ✅ blocks that had grown
   into procedural dumps were compressed to *why* + pointer (the
   phase-birth schedule lives in CLAUDE.md Rule 7 / plan.md, not in
   doctrine).
3. **C — dedupe.** Integration prerequisite lists collapsed to a shared
   one-liner across the three dev-track flows; routing-compliance prose
   halved. E-012 (suspected third verbatim HARD-GATE copy in
   ndf-edit.md) **refuted** — it is a declared Rule-12 defense-in-depth
   restatement.
4. **D — wiki links (docs/ only, dual lint).** Canonical spec in
   KB-LAYOUT.md § Wiki-link syntax: `[[ID]]` / `[[ID|label]]` /
   `[[ID#anchor]]`, structural-glob resolution, display-only semantics
   (never triggers the `(2+N)` `related:` touch — scoping notes in
   bidirectional-link.md + maintenance-discipline.md). Manual debt class
   `wiki-link-unresolvable` in lint.md; mechanical CW1 check in
   engine-lint.mjs behind `--check-wiki-links` (off by default;
   fixture-verified: catches unresolvable IDs, invalid forms, missing
   anchors). 22 templates annotated (1-line pointers in node templates —
   plain-text paths, since instantiation re-bases relative links).
   Engine files keep GFM links: rendering + C1/C2 investment preserved.
5. **E — command segregation.** 5 new thin-wrapper commands: `/discuss`,
   `/research`, `/review`, `/absorb-concept`, `/evolve-workflow` —
   completing coverage of every independently invokable operation.
   Sub-procedures and rule books deliberately remain command-less.
   workflow/index.md rows annotated; README inventory rewritten grouped
   by track (it was stale — pre-dating even the REVIEW-CMDS batch).
6. **F — persona KB.** HOME.md `## Navigation by persona` (BA: ROADMAP →
   BUSINESS.md → milestones/OQs/glossary; Architect: TECHNICAL.md → ADR
   indexes → CCC/tech-stack/structural indexes); `## How to use this
   report` preambles on both OVERVIEW templates; derived-reports.md
   regeneration contract preserving them. Rejected by design: a
   standalone `docs/PERSONAS.md` (drift surface) and per-index audience
   tags (cost > value at 2 personas).

## Recommendations (forward)

- **Rec-E1 (LOW effort).** When `docs/` is first seeded, add
  `--check-wiki-links` to the `/kb-lint` suggested cadence line — the
  flag is documented but cadence adoption is a one-line nudge.
- **Rec-E2 (LOW).** First QA-track run: measure whether
  `test-plan-ingest.md` (417 ln) and `qa-gate.md` (262 ln) warrant the
  same core/detail split. They were below this pass's size threshold;
  real-run data should decide.
- **Rec-E3 (MED, deferred).** A future `engine-lint` C8 could verify
  each core file's `## Detail files` table covers every file actually
  present in its subfolder (orphan-detail detection). Deferred until a
  detail file is ever orphaned — no evidence of the failure mode yet.
- **Rec-E4 (LOW).** PRINCIPLES.md "Practices to keep" bullets still mix
  doctrine with procedural pointers; a future doctrine-only pass could
  trim ~300 more tokens. Declined now — the file is load-on-demand and
  the remaining mixing is mild.

## Honesty ledger

- The −65% plan estimate was not met (−42%); the gap is deliberate
  gate-preservation, documented above, not slippage.
- The 16 node-template notes are 1-line pointers, not the planned 3–5
  line notes — strict cross-reference doctrine argued against 16 copies
  of the same convention text.
- `/research` shipped Phase-1-internal only; the plan-stage idea of a
  dual standalone mode was dropped because the flow file's HARD-GATE
  (Survey + blocking-frs OQ) doesn't support it and commands must not
  diverge from their flow files. Standalone research routes to
  Exploration authoring.
- A third frs-validation-rules detail file (revision-history.md) was
  added beyond plan — the revision table was the file's densest
  dead-weight at gate time.
