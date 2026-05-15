---
milestone_id: M-NN-<slug>
produced_by: discuss
status: active
created: YYYY-MM-DD
---

# Discussion Log — M-NN-<slug>

Pre-planning decision capture produced by [`sdlc/workflow/discuss.md`](../workflow/discuss.md).
Decisions locked here bind Phase 2 FS authoring. To override a locked decision,
raise an `OQ-NNN` with `origin: discuss-override` before deviating.

## Gray areas identified

| FRS | Finding / Ambiguity | Impact classification |
| --- | ------------------- | --------------------- |
| FRS-NNN | <one-line description> | high-impact-on-FS-architecture \| resolvable-during-plan |

## Locked decisions

Each entry is binding for Phase 2. Numbered sequentially — CONTEXT.md files
cite by entry number.

1. **FRS/FS reference:** FRS-NNN / anticipated FS-NNN
   **Decision:** <chosen path>
   **Rationale:** <why this path; what it optimizes for and what it gives up>
   **Constraints locked:** <what Phase 2 must not contradict; e.g., "must not use inline schema definition — see INT node approach">

## Deferred to Phase 2

Items where classification is `resolvable-during-plan` — no lock needed; Phase 2
FS authoring can decide incrementally.

- **FRS-NNN — <item>:** <brief note on why it's safe to defer and what Phase 2 should watch for>

## Override log

Filled when a locked decision above is contradicted in plan.md. Each override
must cite the OQ-NNN raised before deviating.

| Entry # | Override description | OQ-NNN raised | Date |
| ------- | -------------------- | ------------- | ---- |
