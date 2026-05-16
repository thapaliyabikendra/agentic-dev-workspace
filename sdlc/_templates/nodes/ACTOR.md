---
id: ACT-NNN
type: actor
title: <Actor name>
status: proposed              # proposed | active | superseded | deprecated
kind: human                   # human | system | background-job — bare system without a named trigger is a smell
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
related: []                   # Phase 1: empty []. Phase 2: commands triggered, queries issued, flows initiated, permissions
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# ACT-NNN: <Title>

> **Phase-keyed authoring.** ACT is born at Phase 1 (alongside its FRS, when
> the FRS introduces a new actor role) with the Phase 1 sections filled and
> `related: []` empty; Phase 2 enriches the same file with wiring
> (`related:` populated, Commands they trigger, Queries they issue, PERM-NNN
> refs in Preconditions). Status stays `proposed` across both phases;
> Phase 3 flips `proposed → active`. Per R-NEW-2a.
>
> **Body-shape discriminator (R-NEW-8):** `related: []` ⇒ Phase-1-bare;
> `related: [...]` populated ⇒ Phase-2-wired.

## Description

> **Phase 1 — required.** Who is this actor, in domain terms? Business
> language, no node IDs.

## Goals

> **Phase 1 — required.** Author intent — what they want to accomplish.

- …

## Preconditions to act

> **Phase 1 — required at business level** ("must be authenticated", "must
> have completed onboarding"). NO PERM-NNN references — the permission ID
> layer is Phase 2.
> **Phase 2 — enriched.** Adds PERM-NNN refs under Permissions; business-level
> constraints from Phase 1 stay.

- Authentication state:
- Permissions:                <!-- Phase 1: business-language only. Phase 2: PERM-NNN refs. -->
- Other:

## Commands they trigger

> **Phase 2 — required.** CMD-NNN IDs. Do NOT author at Phase 1 — CMD nodes
> are Phase-2-born, the IDs don't exist yet.

- CMD-NNN — <one line>
- CMD-NNN — …

## Queries they issue

> **Phase 2 — optional.** QRY-NNN IDs. Do NOT author at Phase 1.

- QRY-NNN — <one line>

## Flows they initiate

> **Phase 1 — required.** Lists real FLW-NNN IDs — FLW is also Phase-1-born,
> so the IDs resolve. One row per flow this actor starts.

- FLW-NNN — <one line>
