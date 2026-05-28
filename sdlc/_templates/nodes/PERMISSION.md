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

> **Do not create a PERM whose guard reduces to the CCC-002 baseline.** A
> guard of `CurrentUser.IsAuthenticated` (or any expression equivalent to
> "permission is registered and the caller holds it") is what CCC-002
> already mandates by default — the permission name belongs in the
> single per-project `<Project>Permissions.cs` (nested portal → page →
> action; wire pattern `<Project>.<Portal>.<Page>.<Action>`) and
> `<Project>PermissionDefinitionProvider` (per STD-005 R15) and the
> claim belongs inline on the actor's `Permissions:` bullet.
> Promote to PERM only when the guard adds content beyond the baseline:
> ownership / tenancy / state predicates, attribute combinations, or the
> same non-trivial expression cited from multiple commands.

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
