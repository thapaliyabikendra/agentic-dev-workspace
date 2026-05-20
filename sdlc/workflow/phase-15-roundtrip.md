---
name: phase-15-roundtrip
description: "Phase 1.5 round-trip body-edit exception — the framework's only carve-out to the universal 2-file touch rule. Tightly scoped to Phase-1-born FLW or CHG body-only revisions where status: stays unchanged."
applies_when:
  stack: [agnostic]
---

# Phase 1.5 round-trip body-edit exception

A doctrinal carve-out (per R-NEW-7 / B3, 2026-05-17; extended to CHG per
R-CHG-1..7) to the universal 2-file touch rule. Tightly scoped. **The
framework's first exception to the universal 2-file rule.**

**Trigger.** A Phase 1.5 round-trip on a Phase-1-born FLW or CHG,
where the revision is body-only and the artifact's `status:` stays
unchanged (FLW: `proposed`; CHG: `draft`). (R-NEW-7 narrowed to FLW
only 2026-05-17 — ACT no longer participates because ACT births at
Phase 2, not Phase 1; see [`rule-history.md`](rule-history.md).)

**Action.** 1-file touch — edit the artifact body only. The per-type
`index.md` is NOT re-synced (Status column unchanged; Title / Description
columns are frontmatter-sourced, also unchanged). The artifact's
`updated:` frontmatter timestamp DOES fire — it carries the revision
date. For CHG specifically: CHG has no per-type `index.md` today (see
[CHG `index.md` gap](#chg-indexmd-gap) below); the touch is naturally
1-file regardless of carve-out, but the carve-out logic still applies
for status-stability discipline.

**Scope restrictions — not generalizable. ALL four must hold:**

- **Only Phase-1-born artifacts (FLW / CHG).** Not Phase-2-born canonical
  nodes (ACT / ENT / CMD / STA / CON / INT / DEC / PERM / QRY).
- **Only during Phase 1.5 round-trip.** Not during free-form edits, not
  during Phase 2 enrichment, not during bug fixes.
- **Only when `status:` does not change.** Any status flip
  (FLW `proposed → active` or `proposed → deprecated`; CHG
  `draft → approved`, `draft → deprecated`) → 2-file touch as usual.
- **Only when body edits do not change frontmatter fields driving index
  columns** (title, summary, tags). Such edits → 2-file touch as usual.

**Precedent risk.** Future requests "I'm just editing the body, can I use
1-file touch?" MUST NOT cite R-NEW-7 or its R-CHG extension. The carve-out
is scoped to Phase 1.5 round-trip on Phase-1-born FLW or CHG only;
each extension is type-named (FLW per R-NEW-7, CHG per R-CHG-1..7) — not
generalized as "any in-flight body edit." Generalizing the carve-out to
all canonical body edits is a separate doctrinal question (deferred —
body-edit vs. index-relevance audit not done). The carve-out exists
because:

- Phase 1.5 round-trip is the FRS revision loop; an FAIL / PASS_WITH_MAJORS
  verdict often ripples to the canonical FLW (Scenarios revised) and/or
  the milestone-scoped CHG (`modifies[]` behavior delta revised). Worst
  case 3× edit cost per round-trip otherwise. (Pre-2026-05-17 the ripple
  also reached a Phase-1-born ACT; R-NEW-2a retirement moved ACT birth
  to Phase 2, so Phase 1.5 round-trip no longer touches an ACT body.)
- The Phase-1-bare body shape (per R-NEW-8 / R-CHG-7) means the index
  row (where one exists) is carrying minimal information — Status
  `proposed` / `draft`, Title (frontmatter), one-line description
  (frontmatter). Body content (FLW Scenarios prose, CHG `modifies[]`
  behavior delta) is not in the index, so a body revision does not
  invalidate any index column.

**Other status-change events keep the existing 2-file touch (or 1-file
where no index exists):** Phase 3 activation `proposed → active` (FLW /
ACT — both flip at Phase 3 regardless of birth phase) / CHG `approved →
merged`, FS-validation exit CHG `draft → approved`, full FRS abandonment
FLW `proposed → deprecated` / CHG `draft → deprecated` (the FRS's
`produced_actor:` ACT-NNN ID claim is released — append an
`op: released` row to the milestone's `id-claims.md` since the FRS
itself is being retired; no ACT file exists on disk to deprecate),
sibling-CHG fold `draft → deprecated` (R-CHG-3). See
[`in-flight-nodes.md → Abandonment`](in-flight-nodes.md) for the
abandonment procedure.

## CHG `index.md` gap

Today the milestone-scoped `chg/` directory has **no per-type `index.md`**
companion — CHG births at Phase 1 fire a 1-file touch on the CHG file
alone (no index to re-sync). When the gap proves painful (e.g., a
milestone accumulates enough CHGs that scanning becomes expensive), a
future plan can introduce `milestones/M-NN-<slug>/chg/index.md` (and the
parallel CR-track path); the 2-file touch would then become standard for
CHG births. Until that plan lands, the 1-file touch is the procedurally
correct shape for CHG births and Phase 1.5 round-trip body edits.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Caller:** [`node-edit.md`](node-edit.md) — first-rule cross-reference.
**Related:** [`in-flight-nodes.md`](in-flight-nodes.md) (CHG / FLW lifecycle),
[`rule-history.md`](rule-history.md) (R-NEW-7 narrowing 2026-05-17).
