---
id: PERM-NNN
type: permission
title: <Subject can action on resource — one line>
status: proposed              # proposed | active | superseded | deprecated
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
subject: ACT-NNN              # who
action: CMD-NNN               # CMD-NNN or FLW-NNN — what operation
resource: ENT-NNN             # on what
guard: ""                     # boolean expression in domain terms
related: []
created: YYYY-MM-DD
version: 1
updated: YYYY-MM-DD
---

# PERM-NNN: <Title>

> **First-class authorization rule.** Promote to PERM when the
> ACT.Permissions bullet on the actor node outgrows itself — e.g., when
> you need to reason about a real RBAC / ABAC matrix or when the same
> guard is reused across multiple commands. For simple role checks, keep
> authorization on the actor and skip PERM.

## Description

One or two sentences naming the rule in domain terms. "Account admins can
freeze accounts they do not own."

## Guard expression

The boolean expression that must evaluate true for the action to proceed.
Write in domain terms — not as code.

```
<guard expression>
```

Examples:

- `subject.role == 'admin' && resource.owner_id != subject.id`
- `subject.tenant_id == resource.tenant_id && resource.status != 'frozen'`

## Failure behavior

What happens when the guard fails? Reference any FLW-NNN fault-scenario or
error-handling pattern.

- Response: …
- Logging / audit: …
- User-visible message: …

## Brownfield notes

Existing policy / middleware / decorator / check this permission maps to:
