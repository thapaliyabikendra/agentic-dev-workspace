---
id: TC-NNN
type: test-case
title: <Title> (<Category>)
status: drafted               # drafted | resolved | skipped
feature: <feature kebab-case, matches the FS folder slug>
use_case: <add | edit | delete | display | toggle | view | ...>
priority: <High | Medium | Low>
category: Functional          # test category — Functional | Edge | Fault
tags: [@smoke, @<feature>, @TC-NNN]
traces_to: []                 # [AC-NN, FLW-NNN#happy, FLW-NNN#edge-N, FLW-NNN#fault-N]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# TC-NNN: <Title> (<Category>)

**Scenario:** <Letter> — <Scenario description in one line>
**Traces to:** <AC-NN, FLW-NNN#happy | FLW-NNN#edge-N | FLW-NNN#fault-N, Matrix: <row name>>

> Test case file. Drafted at Phase 2 (Test plan ingest) and consumed at
> Phase 3 (Test suite codegen). One file per scenario; sequential
> numbering across the entire feature (not per use-case sub-folder).
>
> File location:
> `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/test-plans/<use-case>/TC-NNN-<slug>.md`
>
> See [`../workflow/test-plan-ingest.md`](../workflow/test-plan-ingest.md)
> for the section walkthrough and
> [`../workflow/coverage-matrix.md`](../workflow/coverage-matrix.md)
> for the Required Coverage Matrix.
> See [`../workflow/test-data-generation.md`](../workflow/test-data-generation.md)
> for the `## Test Data` rules.

---

## Steps

One atomic user action per row. 2–10 steps per TC; split if longer.
Selectors are `(discovered by explorer)` until the developer resolves
them in Phase 3 against the implemented UI.

| # | Step | Selector | Expected Result |
|---|------|----------|-----------------|
| 1 | Navigate to <path> | `n/a` | Page loads, <visible landmark> |
| 2 | Click "<label>" button | `(discovered by explorer)` | <what happens> |
| 3 | Enter "<value>" in <field> | `(discovered by explorer)` | <what appears> |
| 4 | Verify <element> | `(discovered by explorer)` | <expected state> |

---

## Preconditions

- <required data / role / environment / session state before the test runs>

## Postconditions

- <expected UI state, DB state, audit log entry, modal closed/open after all steps pass>

## Test Data

> Sub-sections below are conditionally included. See
> [`../workflow/test-data-generation.md` → Sub-section presence](../workflow/test-data-generation.md#sub-section-presence)
> for when to omit `### Pre-existing State`, `### Form Input`, or the
> whole `## Test Data` heading.

### Pre-existing State

- <prose description of database / user / role / permission state — e.g. "A Rule Template with Template Code 'TC-DUP-001' exists">

### Form Input

* <Field Name 1>: <value | templated value | `description → directive(args)`>
* <Field Name 2>: <value>
