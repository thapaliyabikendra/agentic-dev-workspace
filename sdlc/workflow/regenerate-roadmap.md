---
applies_when:
  stack: [agnostic]
---

# Regenerate Roadmap

> **Maintenance operation.** Regenerates the tracked planning artifact
> [`docs/ROADMAP.md`](../../docs/ROADMAP.md)
> from the planning artifacts under `docs/milestones/`, plus OQ index.
> Codifies the closed set of five Stuck classes (Stale FRSs, Stale
> OQs, Stalled milestones, Stuck CHGs, Blocked-by-OQ artifacts) with
> their detection rules and per-row data shapes.
>
> Sibling of [`derived-reports.md`](derived-reports.md) (which covers
> BUSINESS and TECHNICAL overviews) and
> [`lint.md`](lint.md) (which detects drift). On-demand only — not
> phase-gated.
>
> Triggered by: "regenerate the roadmap overview." Source plan:
> `sdlc-framework-refinement-v3.md` Δ10.

## When to Use

> **Boundary note.** `docs/ROADMAP.md` is **project state** — it tracks
> milestones in-flight, FRS/FS status, and the five Stuck classes. It is
> NOT an audience overview report. For BUSINESS/TECHNICAL overviews, use
> [`derived-reports.md`](derived-reports.md) instead.

**Use when:** preparing for a stakeholder review where milestone
state matters, suspecting a milestone or FRS has gone silently
stuck and want the surfacing surface, a periodic discipline trigger
fires (e.g., before milestone close or quarterly), or
[`docs/exploration/EXP-deferred-work-assessment-*.md`](../../docs/exploration/)
flags a stuck-signal class as recurring.

**Do NOT use when:** the report needing regen is BUSINESS.md or
TECHNICAL.md (use [`derived-reports.md`](derived-reports.md) —
generic procedure for those audience overviews), the work is
detecting drift in canonical content (use [`lint.md`](lint.md) —
debt classes operate on nodes / FRSs / FSs; the Stuck classes here
operate on milestone-state), or a new "stuck" class is being added
(go through [`evolving-the-workflow.md`](evolving-the-workflow.md);
ad-hoc additions are explicitly out of scope per the Anti-goals
section).

**Vs. sibling files:** [`derived-reports.md`](derived-reports.md) is
the generic regeneration rule book for BUSINESS / TECHNICAL / future
audience overviews — it does NOT cover the five Stuck classes;
this file does. [`lint.md`](lint.md) detects drift in canonical
content (orphan nodes, stale-proposed, etc.); this file surfaces
drift in milestone-state (stalled milestones, stuck CHGs, etc.). The
two overlap on `stale-proposed` (lint, 14 days) ≈ stuck CHGs (here,
14 days) but operate on different artifact types.

## When to run

- Before a stakeholder review where milestone state matters.
- When you suspect a milestone or FRS has been silently stuck and want
  the audit surface.
- As a periodic discipline (e.g., before milestone close, or quarterly).
- Out-of-cycle if the assessment in
  [`../../docs/exploration/EXP-deferred-work-assessment-*.md`](../../docs/exploration/EXP-deferred-work-assessment-2026-05-14.md)
  flags a stuck-signal class as a recurring problem.

Not required at phase boundaries; the milestone closeout and the
Phase 3 user-review handoff already cover scheduled review points.

## Procedure

1. **Copy template.** Copy `sdlc/_templates/OVERVIEW-ROADMAP.md` to
   `docs/ROADMAP.md` (overwrite if exists — regenerated planning artifact).
2. **Walk the `Pulls from` list** declared in the template's header.
   Read the Karpathy-style indexes first — milestone files,
   `docs/discovery/open-questions/index.md` — then narrow-load
   individual artifacts only where the section being filled requires
   their detail.
3. **Compute the Stuck classes first** (see Detection rules below). If
   a class is empty, omit its sub-section from the rendered file —
   `_none yet_` placeholders are not preserved at regeneration.
4. **Fill the in-flight / shipped tables** by walking milestones in
   ID order. For each in-flight milestone, also read its
   `MILESTONE-STATE.md` to populate `progress_percent` (→ **Progress**
   column) and `next_action` (→ **Next action** column). If
   `MILESTONE-STATE.md` is absent, leave those columns blank.
   Shipped milestones (`status: done`) do not need `MILESTONE-STATE.md`
   — read only the portal doc for the Shipped table.
5. **Update `generated_at:` and `source_commit:`** at the top of the
   rendered file. `source_commit:` records the workspace HEAD sha at
   regen time; if working with uncommitted edits, write
   `filesystem-snapshot`.
6. **Commit the regenerated ROADMAP.md** alongside the work that
   motivated the regen.

No tiered touch, no `index.md` / `log.md` pair — `docs/ROADMAP.md` is
a regenerated planning artifact, not a canonical DDD node.

## Detection rules — Stuck classes

The five classes are the closed set from
[`sdlc-framework-refinement-v3.md` Δ10]. New classes need a methodology
extension via [`evolving-the-workflow.md`](evolving-the-workflow.md);
they are not added ad-hoc.

### Stale FRSs

**Rule.** An FRS with `status: draft` or `status: review` whose most
recent edit is ≥30 days old. "Edit" means file mtime or — if more
reliable in your environment — the most recent commit touching the
file.

**Action.** List in the Stale FRSs table. Each row carries: FRS ID,
milestone, status, last-edit date, age in days.

### Stale OQs

**Rule.** An OQ-NNN file under `docs/discovery/open-questions/`
without a `resolution_path:` declared in its frontmatter and whose
`created:` is ≥60 days old.

**Action.** List in the Stale OQs table. Each row: OQ ID, origin,
gate_effect, created date, age in days.

### Stalled milestones

**Rule.** A milestone with `status: in-progress` for ≥90 days where no
FS in its `specs/` has `merged: true`. The "started" date is the
milestone file's `created:`. Active milestones with ≥1 merged FS are
considered making progress, regardless of age.

**Action.** List in the Stalled milestones table. Each row: milestone
ID, status, started date, age, FRSs and merged-spec counts.

### Stuck CHGs

**Rule.** A CHG node with `status: approved` whose most recent edit is
≥14 days old. Mirrors the `stale-proposed` lint class but for the CHG
post-approval, pre-merge window.

**Action.** List in the Stuck CHGs table. Each row: CHG ID, source FS,
approved date, age, target FS.

### Blocked-by-OQ artifacts

**Rule.** A feature spec whose body's `## Open blockers` section cites
one or more OQ-NNN entries that themselves carry no `resolution_path:`
in frontmatter. The blocker is *itself* unresolvable until the OQ
moves.

**Action.** List in the Blocked-by-OQ table. Each row: FS ID, list of
blocking OQ IDs, earliest blocker `created:` date.

## Automation

A regeneration helper lives at
[`../scripts/regenerate-roadmap.sh`](../scripts/regenerate-roadmap.sh) —
it can compute the five stuck classes from frontmatter timestamps and
emit a draft ROADMAP.md. The script is **advisory**: review its output
before committing. Manual judgement still applies for the in-flight /
shipped tables when narrative summaries beat raw frontmatter dumps.

## Anti-goals

- **Do not auto-run the regeneration on every commit.** On-demand
  only — noise from per-commit regens defeats the surfacing value.
- **Do not add new "stuck" classes beyond the five.** Expansion goes
  through `evolving-the-workflow.md`. If you find a real recurring
  drift pattern that doesn't fit, write an Exploration first.
- **Do not hand-edit `docs/ROADMAP.md`.** It is derived. Fix
  the source data and regenerate.
- **Do not promote the roadmap into a tiered-touch surface.** No
  `index.md` / `log.md` pair, no participation in
  `maintenance-discipline.md`. Regenerated planning artifact only.

## Anti-Pattern: "The Partial Roadmap"

Running a regeneration pass that walks only a subset of the five
Stuck classes — typically because the operator's attention was
drawn to one class (e.g., Stalled milestones) by a recent friction
event and the regen is rushed to produce that section's data — and
treating the result as a complete ROADMAP.md. The cost: the
partial report ships to a stakeholder review as if it were
authoritative; classes the operator skipped (Stale OQs, Blocked-by-OQ
artifacts) continue to surface drift the report claims to cover;
the next legitimate regen reveals "new" stale entries that were
actually stale at the previous regen too. **The five classes are a
closed set, walked exhaustively per regen — partial walks produce
misleading reports.** If a class is empty after a full walk, its
sub-section is omitted from the rendered file (per Procedure step 3);
that is different from skipping the walk. Doctrinal anchor:
[`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
"Reference, never copy"; a derived report that under-covers its
declared source set has silently fabricated its scope.

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Reference, never copy" is the doctrinal anchor; ROADMAP.md cites
  milestone / FRS / OQ / CHG IDs and never paraphrases their bodies.
- **Required before:** [`derived-reports.md`](derived-reports.md) —
  generic regen rule book this file specialises; the "no `index.md` /
  `log.md` pair" rule for `docs/reports/` is canonical there.
- **Required before:** [`retrieval-discipline.md`](retrieval-discipline.md)
  — Karpathy-index-first reading order applies during the
  `Pulls from` walk.
- **Reads:** `docs/milestones/M-NN-*/M-NN-<slug>.md` files;
  `docs/milestones/M-NN-*/MILESTONE-STATE.md` (in-flight milestones —
  `progress_percent`, `next_action`);
  `docs/discovery/open-questions/index.md`; FS frontmatter for
  `merged:`; CHG frontmatter for `status:`; OQ frontmatter for
  `resolution_path:`.
- **Routes findings to:** ROADMAP.md (build artifact); for stuck
  classes that warrant action,
  [`evolving-the-workflow.md`](evolving-the-workflow.md) (if a class
  pattern is recurring enough to warrant methodology extension) or
  the relevant per-artifact procedure (FS abandonment via
  [`maintenance-discipline.md`](maintenance-discipline.md); CHG
  re-evaluation via [`plan.md`](plan.md)).
- **Adjacent (not callers but consulted):**
  [`lint.md`](lint.md) — `stale-proposed` lint class overlaps with
  stuck CHGs detection here (different artifact, same 14-day
  threshold); [`derived-reports.md`](derived-reports.md) — generic
  regen rule book.
- **Sibling rule books:**
  [`derived-reports.md`](derived-reports.md),
  [`lint.md`](lint.md),
  [`maintenance-discipline.md`](maintenance-discipline.md).
