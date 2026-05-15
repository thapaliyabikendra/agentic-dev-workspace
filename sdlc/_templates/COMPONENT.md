---
id: <COMPONENT_SLUG>
title: <Human title>
type: standalone    # standalone | shared
id_prefix: <PREFIX>   # 2-4 uppercase chars; omit for shared component
description: <one line>
depends_on: []        # other component slugs this component references
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

## ADRs

Link to `adrs/index.md` for this component.
