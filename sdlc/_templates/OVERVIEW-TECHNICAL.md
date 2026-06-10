---
generated_at: YYYY-MM-DD
source_commit: <git sha at regenerate time, or "filesystem-snapshot">
audience: technical
---

# Project Overview — Technical

> **Derived report. Do not edit by hand.** Regenerate by walking the
> "Pulls from" list below against the wiki. The wiki — ADRs, nodes,
> discoveries — is the source of truth. If a fact in this file is
> wrong, fix the source and regenerate; never patch the overview.
>
> See [`../workflow/derived-reports.md`](../workflow/derived-reports.md).
>
> File location when rendered: `docs/reports/TECHNICAL.md` (lazy —
> created on first regenerate).

## Pulls from

- `docs/adrs/index.md` — all accepted ADRs. Narrow-load individual ADR
  pages only when section grouping requires more than the index row.
- `docs/nodes/modules/index.md` — module map (MOD rows).
- `docs/nodes/integrations/index.md` — external integrations (INT rows).
- `docs/nodes/contracts/index.md` — contract surface (CON rows). Cited
  as "API surface" when the project is HTTP-dominant.
- `docs/nodes/permissions/index.md` — authorization rules (PERM rows).
- `docs/nodes/flows/index.md` — flow titles (FLW rows). Scenarios are
  not pulled into the overview; readers click through.
- `docs/discovery/open-questions/index.md` — operator judgement filter
  (per-OQ folder layout; the pre-cutover flat `open-questions.md` is
  grandfathered where it still exists). Same caveat as the business
  template: no audience tag today; pick rows the regenerating operator
  considers technical.

Reference-never-copy applies: every row below links by ID, never
paraphrases the source page's body. ID citations may use wiki-link form
(`[[ADR-001|ABP symbol policy]]`) per
[`../KB-LAYOUT.md § Wiki-link syntax`](../KB-LAYOUT.md#wiki-link-syntax-docs-only).

---

## How to use this report (Backend Architect)

Start with **Architecture commitments** — the accepted ADRs grouped by
tag are the binding constraints on any new design. **Module map** shows
bounded-context boundaries; **Integration surface** and **Contract
surface** show external dependencies and the wire API; **Authorization**
is the PERM matrix. **Flows (top-level)** is the behavioral narrative —
open a FLW page for Trigger, Scenarios, Sequence, and Branches. Pair
this report with `docs/shared/ccc/index.md` (NFR baselines) and
`docs/shared/tech-stack.md` (operational state) — neither is pulled in
here. Dated snapshot (`generated_at:` above); per-type indexes are the
live truth.

---

## Architecture commitments

Accepted ADRs, grouped by tag. Source: [`../adrs/index.md`](../adrs/index.md).

| ADR | Title | Status | Tag | Constrains (one line) |
| --- | ----- | ------ | --- | --------------------- |
| _none yet_ |  |  |  |  |

---

## Module map

Source: [`../nodes/modules/index.md`](../nodes/modules/index.md) (lazy
file; the table is empty until the first MOD node lands).

| MOD | Title | Owner actor | Upstream | Downstream |
| --- | ----- | ----------- | -------- | ---------- |
| _none yet_ |  |  |  |  |

---

## Integration surface

Source: [`../nodes/integrations/index.md`](../nodes/integrations/index.md).

| INT | Title | Direction | Protocol | Status |
| --- | ----- | --------- | -------- | ------ |
| _none yet_ |  |  |  |  |

---

## Contract surface

Source: [`../nodes/contracts/index.md`](../nodes/contracts/index.md).

| CON | Protocol | Title / route | Owner service | Status |
| --- | -------- | ------------- | ------------- | ------ |
| _none yet_ |  |  |  |  |

---

## Authorization

Source: [`../nodes/permissions/index.md`](../nodes/permissions/index.md).

| PERM | Subject | Action | Resource | Status |
| ---- | ------- | ------ | -------- | ------ |
| _none yet_ |  |  |  |  |

---

## Flows (top-level)

Source: [`../nodes/flows/index.md`](../nodes/flows/index.md). One row
per flow — the happy / edge / fault scenarios live on the flow page.

| FLW | Title | Module | Status |
| --- | ----- | ------ | ------ |
| _none yet_ |  |  |  |

---

## Open technical questions

Operator-filtered rows from
[`../discovery/open-questions/index.md`](../discovery/open-questions/index.md)
(and, for pre-cut-over entries, the legacy
[`../discovery/open-questions.md`](../discovery/open-questions.md)) —
those the regenerating operator judged technical.

| Entry | Status | Notes |
| ----- | ------ | ----- |
| _none yet_ |  |  |
