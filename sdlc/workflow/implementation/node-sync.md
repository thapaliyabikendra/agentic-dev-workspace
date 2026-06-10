---
name: implementation-node-sync
description: "Detail file of implementation.md — node content updates and status transitions during Stage 2 Code. Load when a canonical node or ADR needs an edit or lifecycle flip during implementation."
applies_when:
  stack: [agnostic]
---

# Stage 2 detail — canonical sync during implementation

> Detail file of [`implementation.md`](../implementation.md) (Phase 3 flow).
> Load when a canonical node or ADR requires an edit or status flip during
> Stage 2. The core file's "No silent canonical edits" discipline applies.

## Node content updates (during implementation)

The "Keep canonical nodes in sync" discipline produces content
edits on canonical nodes — implementation reveals a node was missing an
invariant, had a wrong transition, or stated a wrong contract, and the
canonical node gets edited to match reality. These follow the 2-file
node touch under
[`maintenance-discipline.md`](../maintenance-discipline.md).

- [ ] For every canonical node whose content is edited during
      implementation:
      - [ ] Per-type `index.md` row re-synced if the one-line summary,
            tags, or source changed. (No re-sync needed for purely internal
            edits that don't change those fields — the node file edit
            alone is the 1-file-of-2 in that case; the index row simply
            doesn't need updating.)
- [ ] Conversely: no silent canonical edits. If you can't write a git
      commit message that names the reason for the edit, the edit isn't
      ready — either the FS should have declared it, or you're drifting
      outside the slice.

## Status transitions (during implementation)

Implementation routinely flips canonical node and ADR lifecycle states — a
node moves `active → superseded` when its replacement lands; an ADR moves
`accepted → deprecated` (or `superseded`) when an implementation deviation
forces it. Each side fires its own touch per
[`maintenance-discipline.md`](../maintenance-discipline.md).
No silent flips.

- [ ] For every canonical node whose status changes during implementation
      (2-file node touch):
      - [ ] Frontmatter `status:` updated on the node file.
      - [ ] Per-type `index.md` row's Status column re-synced; if status
            is terminal (`superseded` / `deprecated`), row moved to the
            Superseded/deprecated section.
- [ ] For every ADR whose status changes during implementation
      (2-file ADR touch):
      - [ ] ADR frontmatter `status:` updated on the file.
      - [ ] `adrs/index.md` row's Status column re-synced (moved to the
            Superseded/deprecated section if applicable).
      - [ ] If superseding: successor ADR authored via the full procedure
            in [`authoring-adr.md → Steps`](../authoring-adr.md#steps-all-triggers).
