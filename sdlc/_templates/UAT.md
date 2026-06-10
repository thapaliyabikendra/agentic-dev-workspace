---
milestone_id: M-NN-<slug>
status: draft                # draft | passed | failed | partial
produced_by: verify
created: YYYY-MM-DD
---

# UAT — M-NN-<slug>

## Summary

_One paragraph: overall result; N of M criteria confirmed-passing. State
which FRSs were covered, whether any criteria are failed or deferred, and
the next action if the milestone is not fully passed._

## Acceptance criteria status

| FRS | Criterion | Result | Confidence | Gap entry ref |
|-----|-----------|--------|------------|--------------|
| FRS-NNN | AC-01: _text_ | confirmed / failed / not-verified | code-verified / kb-inferred | — or §Gaps-N |
| FRS-NNN | AC-02: _text_ | confirmed / failed / not-verified | code-verified / kb-inferred | — or §Gaps-N |

_Every acceptance criterion from every FRS in the milestone must appear in
this table. Do not omit. Add rows as needed._

## Gaps

_One sub-section per gap. Delete this section if status is `passed`._

### Gap 1

**Criterion:** FRS-NNN AC-NN — _criterion text_
**Result:** failed | not-yet-verified
**Failure description:** _What was actually observed vs. what the criterion
requires. Be specific._
**Routing decision:** bug-fix | new-frs | deferred
- If `bug-fix`: link to the Exploration or branch created.
- If `new-frs`: record `oq: OQ-NNN` raised for the missing design.
- If `deferred`: see `## Deferred items`.

## Deferred items

_Criteria deferred to a later milestone. Delete this section if none._

| FRS | Criterion | Reason deferred | Target milestone |
|-----|-----------|-----------------|-----------------|
| FRS-NNN | AC-NN | _reason_ | M-NN-<target-slug> |

## Sign-off

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Verifier role | BA / QA / Developer (solo — same person wears all hats) |
| Outcome | passed / failed / partial |
