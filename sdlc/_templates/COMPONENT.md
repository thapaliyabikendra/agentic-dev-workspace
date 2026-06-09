---
id: <COMPONENT_SLUG>
title: <Human title>
type: standalone    # standalone | shared
id_prefix: <PREFIX>   # 2-4 uppercase chars; omit for shared component
description: <one line>
depends_on: []        # other component slugs this component references
node_definitions: [] # NDF IDs this component has authored (e.g., [FDE-NDF-001, FDE-NDF-002]); empty when the component uses only the engine-default 16-type catalog. Per STD-007 (sdlc/standards/STD-007-ndf-governance.md).
created: YYYY-MM-DD
---
# <COMPONENT_SLUG>: <title>

## Role

One paragraph. What is this component responsible for? What are its deployment boundaries?

## Node inventory (links to per-type indexes within this component)

- [contracts](nodes/contracts/index.md) — `{PREFIX}-CON-NNN`
- [flows](nodes/flows/index.md) — `{PREFIX}-FLW-NNN`
- [services](nodes/services/index.md) — `{PREFIX}-SVC-NNN`
- _add other types as they are created_

## Depends on

List other components this component's nodes reference by ID. Match `depends_on:` frontmatter.

## Node definitions

List the NDF IDs this component has authored. Each NDF declares a custom
node-type contract (frontmatter, body sections, allowed `related:` types,
lifecycle) for shapes the engine-default 16-type catalog does not cover.
NDFs live at `docs/<component>/node-definitions/{PREFIX}-NDF-NNN-<slug>.md`.
Per `STD-007` (`sdlc/standards/STD-007-ndf-governance.md`).

Empty when the component uses only the engine-default 16-type catalog.

## ADRs

Link to `adrs/index.md` for this component.
