---
generated_at: YYYY-MM-DD
source_commit: <git sha at regenerate time, or "filesystem-snapshot">
audience: business
---

# Project Overview — Business

> **Derived report. Do not edit by hand.** Regenerate by walking the
> "Pulls from" list below against the wiki. The wiki — milestones,
> FRSs, ADRs, nodes, discoveries — is the source of truth. If a fact in
> this file is wrong, fix the source and regenerate; never patch the
> overview.
>
> See [`../workflow/derived-reports.md`](../workflow/derived-reports.md).
>
> File location when rendered: `docs/reports/BUSINESS.md` (lazy —
> created on first regenerate).

## Pulls from

- `docs/milestones/M-*/M-*.md` — milestone portal docs (titles, scope,
  status).
- `docs/milestones/M-*/discovery/milestone-scope.md` — scoping rationale
  for the Mission and Roadmap sections.
- `docs/milestones/M-*/frs/*.md` — FRS titles + statuses; FRS count per
  milestone for the Current-state table.
- `docs/adrs/index.md` — filter to rows tagged business / product /
  scope for the Key business decisions section. Narrow-load individual
  ADR pages only when one-line tags don't disambiguate.
- `docs/discovery/open-questions/index.md` — operator judgement filter
  (per-OQ folder layout; the pre-cutover flat `open-questions.md` is
  grandfathered where it still exists). No audience tag today; pick rows
  the regenerating operator considers business-relevant.

Reference-never-copy applies: every row below links by ID, never
paraphrases the source page's body. ID citations may use wiki-link form
(`[[ADR-005|Why we ship monthly]]`) per
[`../KB-LAYOUT.md § Wiki-link syntax`](../KB-LAYOUT.md#wiki-link-syntax-docs-only).

---

## How to use this report (Business Analyst)

Read **Mission** first — the problem space in one paragraph. Then scan
**Current state** for milestone/FRS status and **Roadmap** for sequence
and target dates. **Key business decisions** lists the ADRs that
constrain product scope — click through by ID for the full record.
**Open questions** carries the unresolved items that may affect
planning; raise new ones via `docs/discovery/open-questions/`. This
report is a dated snapshot (`generated_at:` above) — when in doubt,
the milestone portals and per-type indexes are the live truth.

---

## Mission

_One-paragraph problem space. Source: earliest milestone-scope discovery._

`_no content yet — wiki is empty_`

---

## Current state

| Milestone | Title | Status | FRSs | Notes |
| --------- | ----- | ------ | ---- | ----- |
| _none yet_ |  |  |  |  |

---

## Roadmap

_Ordered list of milestones, with FRS counts and target dates if known.
Past, current, next._

- _none yet_

---

## Key business decisions

Filtered from [`../adrs/index.md`](../adrs/index.md) — ADRs whose tags
include business / product / scope.

| ADR | Title | Status | Why it matters (one line) |
| --- | ----- | ------ | ------------------------- |
| _none yet_ |  |  |  |

---

## Open questions

Operator-filtered rows from
[`../discovery/open-questions/index.md`](../discovery/open-questions/index.md)
(and, for pre-cut-over entries, the legacy
[`../discovery/open-questions.md`](../discovery/open-questions.md)) —
those the regenerating operator judged business-relevant.

| Entry | Status | Notes |
| ----- | ------ | ----- |
| _none yet_ |  |  |
