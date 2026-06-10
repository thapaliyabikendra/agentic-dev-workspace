---
milestone_id: M-NN-<slug>
fs_id: FS-NNN
run_date: YYYY-MM-DD
tester_role: QA / BA / Developer (solo — same person wears all hats)
status: draft                # draft | pass | pass-with-defects | fail
produced_by: qa-gate
---

# E2E Run Report — FS-NNN — YYYY-MM-DD

_Durable record of a QA-gate execution: what was checked, what was
actually observed, what broke. The QA Verification Checklist in
[`../workflow/qa-gate.md`](../workflow/qa-gate.md) is the live gate
procedure; this report is the record of that execution. Never edit a
historical run-report — append a dated note when a defect closes, or
emit a new dated report._

## Scope

- **Entity / feature under test:** _what behavior surface this run covers_
- **Test records seeded:** _table or list of seeded IDs / references and the stage each was placed at_
- **Roles exercised:** _actor roles walked during the run_
- **Environment:** _runner, base URL / build, mock vs integrated mode_

## Results summary

| # | Stage / scenario | Result | Defects |
|---|------------------|--------|---------|
| T01 | _stage name_ | ✅ / ❌ | — or DEF-001 |

## Detailed stage results

_One sub-section per stage/scenario. The **Actual** column carries the
exact value observed (`disabled: true`, `field absent`), never a
paraphrase — exact values make the log machine-comparable across runs._

### T01 — _stage name_

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| _what was checked_ | _expected value/state_ | _exact observed value_ | ✅ / ❌ |

**Verdict:** _one line._

## Defects

_One sub-section per defect. The **Test to verify** field is the
reproduction steps + acceptance criterion in one — a developer can fix
and re-verify without reading a separate spec. Closure routes via
[`../workflow/bug-fix.md`](../workflow/bug-fix.md)._

### DEF-001 — _short title_

- **Severity:** critical | high | medium | low
- **Affects:** _test IDs / stages_
- **Route:** _URL or screen ID_
- **Symptom:** _user-observable behavior_
- **Expected:** _what the spec (FS / FRS / TC) requires, by ID_
- **Impact:** _consequence class — broken journey, data integrity, compliance, cosmetic_
- **Root cause:** _if traced; cite file:line_
- **Suggested fix:** _concrete_
- **Test to verify:** _seed X at stage Y, open Z, verify A/B/C_

## Domain rule verification

_Documented invariants observed at the right stages. Documented
intentional behaviours are correct, not defects._

| Rule (by node/spec ID) | Verified at | Result |
|------------------------|-------------|--------|
| _rule one-liner + [[ID]]_ | T0N | ✅ / ❌ |

## Coverage map

_State machine in ASCII, each state annotated with the test IDs that
exercised it and any attached defect. A state with no test ID is a
visible coverage hole — leave it unannotated rather than omitting it._

```
state_a ──────────── T01
    │
    ▼
state_b ──────────── T02  (DEF-001)
    │
    ▼
state_c ────────────       ← uncovered
```

## Recommendations — implementation status

_The closure table: the report is closed-loop only when every row
carries a terminal status. Update by appending; do not rewrite rows._

| # | Recommendation | Status | Result |
|---|----------------|--------|--------|
| 1 | _action_ | open / implemented / rejected (reason) | _observed outcome_ |

## Notes

- Cite evidence (file, line, route) for every claim; a finding without
  a reference is not a valid finding.
- Trend-track: note deltas against the previous run-report for this FS,
  if one exists.
