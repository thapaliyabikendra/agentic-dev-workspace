<!--
Exploration discipline:
- Routine edit: 1-file touch (just this file)
- Lifecycle event (status → adopted | rejected | merged | done):
    2-file touch (this file + docs/exploration/index.md)
- No log.md for the exploration surface — git history + the index
    status column are the audit trail.
- No bidirectional `related:` enforcement — working notes can be
    loosely linked.
- No `kind:` field. Free-form `tag:` for index grouping if useful.
- Shape is detected from frontmatter presence:
    - `hypothesis:` present → spike-shaped (outcome gating applies)
    - `affects_nodes:` present → bug-shaped (suggested body sections)
    - Neither → free-form note. No special workflow.
-->

---
id: EXP-<slug>            # slug, not a counter
title:                    # one-line label (required)
created: YYYY-MM-DD       # required
status: draft             # required: draft | done | stale | adopted | rejected | dormant

# --- everything below is OPTIONAL; fill what applies ---

# Free-form tag for index grouping. NOT a closed enum.
# Examples: proposition, spike, bug, evaluation, absorption, refactor-survey
tag:

# Cross-link fields (any subset)
related: []
motivated_by: []          # other EXPs / milestones / OQs that prompted this
validated_by: []          # other EXPs that empirically tested this
adopted_into: []          # milestones / FRSs / ADRs that consumed this
informed_adr: []          # ADRs whose authoring drew on this exploration

# Spike-shape fields. Presence of `hypothesis:` marks this as spike-shaped.
# When spike-shaped: the workflow gates any related ADR's
# `proposed → accepted` flip on `outcome:` being filled.
hypothesis:               # one-line falsifiable claim
harness:                  # what was spun up to test
success_criteria:         # measurable conditions
outcome:                  # confirmed | refuted | partial — filled after running

# Bug-shape fields. Presence of `affects_nodes:` marks this as bug-shaped.
# When bug-shaped: see body shape-hint examples for suggested sections.
severity:                 # critical | high | medium | low
affects_nodes: []         # canonical node IDs the bug touches
canonical_changed: false  # true if the fix required updating canonical
reproduction:             # one-line link or inline steps
fixed:                    # YYYY-MM-DD when status flips to done with severity set
---

# <title>

<!--
  Body is free-form. The four shape-hint blocks below are EXAMPLES, not
  required sections. Delete what doesn't apply; keep what helps; write
  whatever else fits.
-->

<!-- SHAPE HINT: alternatives weighed
## Alternatives considered
- **A:** ...
- **B:** ...
- **Recommendation:** ...
-->

<!-- SHAPE HINT: existing-surface survey
## Existing surface
| Node | Relevance |
|---|---|
| ... | ... |
-->

<!-- SHAPE HINT: spike findings (when hypothesis: is set)
## Findings
- Outcome: ...
- Evidence: ...
- ADR feedback (if any):
-->

<!-- SHAPE HINT: bug investigation (when affects_nodes: is set)
## Expected behavior
(cite canonical, e.g., FLW-007#happy)
## Actual behavior
## Root cause
## Fix
## Test added
-->
