---
name: cross-ref-guard
description: "Cross-reference guard at edit time — citation atomicity rule preventing dangling references; plus the periodic dangling-reference audit fired at milestone close."
applies_when:
  stack: [agnostic]
---

# Cross-reference guard at edit time

Framework files (`sdlc/workflow/*.md`, `sdlc/standards/*.md`, `CLAUDE.md`,
`docs/*/COMPONENT.md`) frequently cite canonical artifacts by ID
(`ADR-NNN`, `STD-NNN`, `CCC-NNN`, node IDs) or by tag (`task-ordering`,
`code-quality`, `convention`). Every such citation is a load-bearing
pointer — a Phase 3 session that reads the citing file expects to follow
the pointer to a real artifact.

**Rule — citation atomicity.** When an edit adds an ID or tag citation
to a framework / canonical file, the target either:

1. Already exists at its declared path (`docs/<component>/adrs/ADR-NNN-<slug>.md`
   for ADR-NNN; `sdlc/standards/STD-NNN-<slug>.md` for STD-NNN; etc.), OR
2. Is authored in the **same atomic operation** (same commit, same
   plan execution) as the citation, with its index row landing alongside.

A citation that points at neither is a dangling reference and is
prohibited. Same "atomic operation" principle as
[`bidirectional-link.md`](bidirectional-link.md) —
if you can land the citation without the target, the operation isn't
atomic enough.

For **tag** citations (`tagged-as: task-ordering`, "the
`code-quality` ADR"), atomicity means: at least one artifact in the
relevant index (`docs/<component>/adrs/index.md`,
`sdlc/standards/index.md`) carries the cited tag at the moment the
citing edit lands. If the citing file describes a slot the project has
not yet filled, the citation reads as a slot description ("look up the
ADR tagged X if your project has one") rather than as a load-bearing
reference ("the ADR tagged X"). The two forms must not be conflated —
a slot description does not promise a target; a load-bearing reference
does.

**Pre-edit check.** Before committing an edit that adds a new
citation, dereference it: open the target file by its declared path,
or grep the relevant index for the tag. Mismatch = halt the edit;
either author the target first, or downgrade the citation to a slot
description.

## Periodic dangling-reference audit

The pre-edit check above catches new drift. Existing drift requires a
periodic scan. The audit is fired on milestone close — see
[`close-milestone.md § C-6`](close-milestone.md#c-6--dangling-cross-reference-audit)
for the trigger.

> **Automation note (2026-06-10).** Steps 1–2 below (ID resolution,
> link + anchor verification incl. the normalization rules) are
> mechanized for engine surfaces by
> [`../tools/engine-lint.mjs`](../tools/engine-lint.mjs) — run
> `node sdlc/tools/engine-lint.mjs` at milestone close instead of
> hand-walking them. Step 3 (tag citations) and project-ID classes
> under `docs/` remain manual while no project-side tooling exists.

**Audit recipe** (one-shot, ≤ 5 min):

1. Collect citation patterns from framework files:

   ```
   grep -rEn '\b(ADR|STD|CCC|FRS|FS|CHG|TC|OQ)-[0-9]{3,4}\b' sdlc/ docs/*/COMPONENT.md
   grep -rEn '(tagged|tag:)\s+(`?)(task-ordering|code-quality|convention|naming-conventions|error-handling)\b' sdlc/ docs/*/COMPONENT.md
   grep -rEn '\[STD-[0-9]{3} § Rule [0-9.]+\]' sdlc/standards/by-layer/
   ```

2. For each cited **ID**, verify the file exists at its declared path
   (per the type's slot in [`KB-LAYOUT.md`](../KB-LAYOUT.md) or
   [`LAYOUT.md`](../LAYOUT.md)). Misses are dangling.

   **Pointer-file sub-check** (`sdlc/standards/by-layer/*.md`): rule
   citations there are anchor-bearing —
   `[STD-NNN § Rule X.Y](../STD-NNN-…md#anchor)`. Verify both (a) the
   target STD file exists, and (b) the `#anchor` fragment resolves to a
   real heading in the target STD under GitHub-flavored auto-anchor
   rules. Generation steps (apply in order to each heading's text):

   1. Strip any trailing HTML comment from the heading (e.g.,
      `<!-- layers: Domain -->` — common on STD-002 / 005 / 006
      headings) before normalizing.
   2. Lowercase the remainder.
   3. Strip punctuation: `.`, `,`, `?`, `!`, `(`, `)`, `'`, `` ` ``, `:`,
      em-dash `—`, en-dash `–`. (Corrected 2026-06-10: `:` is *stripped*,
      not converted to `-` — GitHub drops it; `STD-001: Engine-level…` →
      `std-001-engine-level…`, single hyphen.)
   4. Replace whitespace with `-`.

   Gotcha: an em-dash surrounded by spaces (e.g., `boundary — never`)
   collapses to a doubled `--` in the anchor — the dash itself strips,
   then the two surrounding spaces each become `-`. Anchor mismatches —
   not file misses — were the failure mode caught by the 2026-05-22
   hygiene pass (`errororstd` typo silently propagated into two broken
   anchor links in `by-layer/application.md` and `by-layer/contracts.md`;
   see [`../standards/log.md`](../standards/log.md) entry of that date).

3. For each cited **tag**, grep the matching index for the tag value;
   if zero matches AND the citation reads as load-bearing (not as a
   slot description), it is dangling.

4. For each dangling reference: either author the target now (if the
   citing file's intent requires it), or downgrade the citation to a
   slot description in the same edit that closes the milestone.

The audit takes one terminal session; the cost is bounded by the count
of citations across `sdlc/` and `docs/*/COMPONENT.md` (≤ ~200 in a
mature project). Skipping the audit at milestone close is how
dangling references survive multiple commits and silently under-arm the
next Phase 3.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Caller:** [`close-milestone.md § C-6`](close-milestone.md#c-6--dangling-cross-reference-audit)
(milestone-close trigger).
**Related:** [`bidirectional-link.md`](bidirectional-link.md) (same atomicity
principle for `related:` edges).
