---
id: ACT-NNN
type: actor
title: <Actor name>
status: proposed              # proposed | active | superseded | deprecated
kind: human                   # human | system | background-job — bare system without a named trigger is a smell
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # Phase 2: commands triggered, queries issued, flows initiated, permissions
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# ACT-NNN: <Title>

> Body cross-references may use wiki links - `[[ID]]` / `[[ID|label]]` (convention: `sdlc/KB-LAYOUT.md` § Wiki-link syntax; docs/ only).

> **Phase-keyed authoring.** ACT is born at **Phase 2** (alongside ENT / CMD /
> STA / etc.) when the FRS declares `produced_actor: ACT-NNN` in its
> frontmatter. The ACT-NNN ID is claimed at Phase 1 via the FRS's
> `produced_actor:` frontmatter field itself (R-NEW-9 amended 2026-05-17
> — the FRS field IS the claim; no `id-claims.md` introduce row), but
> the ACT file does NOT exist on disk until Phase 2. All sections below
> are authored at birth — there is no Phase-1-bare ACT body shape.
> Status `proposed` at Phase 2 birth; Phase 3 flips `proposed → active`.
> (R-NEW-2a retired 2026-05-17 — Phase-1-bare ACT body shape no longer
> applies because the ACT was relocated to Phase 2 birth.)

## Description

> Who is this actor, in domain terms? Business language anchored by
> structural refs allowed (e.g., "Authenticated user with the
> `Order.Manage` permission claim, identifiable by `userId`").

## Goals

> What they want to accomplish via this system. Reference the FRS by ID
> when the goal traces to a specific user-journey.

- …

## Preconditions to act

> Authentication state, permission claims (PERM-NNN refs allowed at
> Phase 2 birth), and other constraints that must hold before this actor
> can fire any flow.

- Authentication state:
- Permissions:                <!-- PERM-NNN refs from this FS's produces_nodes: or existing canonical -->
- Other:

## Commands they trigger

> CMD-NNN IDs from this FS's `produces_nodes:` or existing canonical
> commands the actor invokes.

- CMD-NNN — <one line>
- CMD-NNN — …

## Queries they issue

> Optional. QRY-NNN IDs.

- QRY-NNN — <one line>

## Flows they initiate

> FLW-NNN IDs — real because FLW is Phase-1-born and the file exists in
> canonical by the time this ACT is authored. One row per flow this
> actor starts.

- FLW-NNN — <one line>
