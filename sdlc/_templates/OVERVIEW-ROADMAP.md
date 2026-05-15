---
generated_at: YYYY-MM-DD
source_commit: <git sha at regenerate time, or "filesystem-snapshot">
audience: planning
---

# Project Overview — Roadmap

> **Derived report. Do not edit by hand.** Regenerate by walking the
> "Pulls from" list below against the wiki. The wiki — milestones,
> FRSs, FSs, CHGs, OQs — is the source of truth. If a fact in this
> file is wrong, fix the source and regenerate; never patch the
> roadmap.
>
> See [`../workflow/derived-reports.md`](../workflow/derived-reports.md)
> and [`../workflow/regenerate-roadmap.md`](../workflow/regenerate-roadmap.md).
>
> File location when rendered: `docs/ROADMAP.md` (lazy —
> created on first regenerate). This is a **tracked planning artifact**,
> not a derived overview report — it lives at the docs root alongside
> `docs/home.md`, not under `reports/`.

## Pulls from

- `docs/milestones/M-*/M-*.md` — milestone status, kind, extends, FRS list, target_quarter.
- `docs/milestones/M-*/MILESTONE-STATE.md` — `progress_percent`, `next_action` (in-flight milestones only).
- `docs/milestones/M-*/frs/FRS-*.md` — FRS status + last-edited dates.
- `docs/milestones/M-*/specs/FS-*/FS-*.md` — FS `merged:` flag,
  `service_repos:`, `depends_on_specs:`.
- `docs/milestones/M-*/specs/FS-*/nodes/changes/CHG-*.md` — CHG status.
- `docs/discovery/open-questions/index.md` and individual OQ pages —
  open-question state + resolution paths.
- `docs/milestones/M-*/discovery/` — discovery and FRS-scope notes
  (for blocked-by-OQ detection).

Reference-never-copy applies: every row below links by ID, never
paraphrases the source page's body.

---

## Stuck

> **Surfaced first because slips compound.** Each class below is
> computed from frontmatter / log timestamps; see
> [`../workflow/regenerate-roadmap.md`](../workflow/regenerate-roadmap.md)
> for the detection rules. Empty classes are omitted at regeneration
> time — do not leave `_none yet_` filler.

### Stale FRSs (≥30 days in `draft` or `review`)

| FRS | Milestone | Status | Last edit | Age |
| --- | --------- | ------ | --------- | --- |
| _none yet_ |  |  |  |  |

### Stale OQs (≥60 days with no resolution path declared)

| OQ | Origin | Gate effect | Created | Age |
| -- | ------ | ----------- | ------- | --- |
| _none yet_ |  |  |  |  |

### Stalled milestones (≥90 days `in-progress` with no FS merged)

| Milestone | Status | Started | Age | FRSs / Specs merged |
| --------- | ------ | ------- | --- | ------------------- |
| _none yet_ |  |  |  |  |

### Stuck CHGs (≥14 days `approved`)

| CHG | Spec | Approved | Age | Target FS |
| --- | ---- | -------- | --- | --------- |
| _none yet_ |  |  |  |  |

### Blocked-by-OQ artifacts (FS with `gate_effect: blocking` OQs unresolved)

| FS | Blocking OQs | Earliest blocker created |
| -- | ------------ | ------------------------ |
| _none yet_ |  |  |

---

## Milestones in flight

Source: `docs/milestones/M-*/M-*.md` (status, kind, target_quarter) and
`docs/milestones/M-*/MILESTONE-STATE.md` (progress_percent, next_action).
One row per milestone with `status: planning | in-progress`. Done
milestones go to **Shipped** below.

| ID | Title | Kind | Status | Target | Progress | Next action | FRSs | Specs merged | Started |
| -- | ----- | ---- | ------ | ------ | -------- | ----------- | ---- | ------------ | ------- |
| _none yet_ |  |  |  |  |  |  |  |  |  |

---

## FRSs in flight

Source: each milestone's `frs/FRS-*.md`. One row per FRS not yet
`implemented`.

| FRS | Milestone | Status | Adrs declared | Touches nodes |
| --- | --------- | ------ | ------------- | ------------- |
| _none yet_ |  |  |  |  |

---

## Feature specs in flight

Source: `milestones/M-*/specs/FS-*/FS-*.md`. One row per FS with
`merged: false`.

| FS | Milestone | Status | Adrs declared | Depends on | Service repos |
| -- | --------- | ------ | ------------- | ---------- | ------------- |
| _none yet_ |  |  |  |  |  |

---

## Shipped

Done milestones, oldest first. One row per milestone with `status: done`.

| ID | Title | Done date | FRSs | Specs merged |
| -- | ----- | --------- | ---- | ------------ |
| _none yet_ |  |  |  |  |

---

## Open questions (cross-feature)

OQs without a resolved path. Source:
[`../discovery/open-questions/index.md`](../discovery/open-questions/index.md)
and the legacy frozen
[`../discovery/open-questions.md`](../discovery/open-questions.md).

| OQ | Origin | Gate effect | Status |
| -- | ------ | ----------- | ------ |
| _none yet_ |  |  |  |
