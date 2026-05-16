---
id: SVC-NNN
type: service
title: <Service name — short summary>
status: proposed              # proposed | active | superseded | deprecated
kind: api                     # frontend | api | middleware | stream-processor | batch-pipeline | worker | scheduled-job
source_ref: []                # [{frs: FRS-NNN, fs: FS-NNN, op: introduce | modify}] · brownfield: [{absorption: <path>, op: introduce | detail}]
modules: []                   # MOD-NNN IDs whose bounded contexts this service realizes
functional_areas: []          # FA-NNN IDs this service contributes to
exposes: []                   # CON-NNN IDs this service owns (owner_service on the contract)
consumes: []                  # CON-NNN IDs this service depends on (cross-service)
integrates: []                # INT-NNN IDs for third-party services this consumes
repo: null                    # path under workspace, e.g. ./api-repo  (only set when realized)
branch_convention: feat/FS-NNN-<slug>
related: []
version: 1
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# SVC-NNN: <Title>

> A **service** is one independently deployable unit. The `kind:` enum is
> intentionally project-agnostic — Kafka / Flink / Kubernetes / ABP are
> realizations and belong under `## Stack`, not in the type taxonomy.
>
> Use whichever single `kind:` best describes the role. A service rarely
> serves two roles in production; if yours seems to, surface that in
> `## Brownfield notes` rather than blurring the kind.

## Role

One sentence on what this service does in the cluster — what it answers
for, what its upstream and downstream look like.

## Modules realized

Mirrors the `modules:` frontmatter. Bounded contexts (MOD-NNN) whose
behavior this service implements. A service usually realizes one MOD;
realizing several is legitimate but worth a note.

- MOD-NNN — <bounded context this service realizes>

## Functional areas contributed to

Mirrors `functional_areas:`. Cross-cutting feature areas (FA-NNN) this
service contributes to. Empty is the common case for single-MOD
services.

- FA-NNN — <contribution shape>

## Contracts exposed

Mirrors `exposes:`. CON nodes this service owns — i.e., this service is
the contract's `owner_service:`. Cross-service consumers appear in each
contract's `consumed_by_services:` and need not be repeated here.

- CON-NNN — <protocol + headline shape>

## Contracts consumed

Mirrors `consumes:`. Cross-service CON nodes this service depends on
(owned by another SVC). Third-party services are INT nodes, not CON
consumes.

- CON-NNN — <protocol + counterparty service>

## Stack

Per-service operational reference. Pinned versions, repo URL, build /
run / test / deploy commands, deployment target. The project-level
[`docs/shared/tech-stack.md`](../../../shared/tech-stack.md) carries cross-cutting
shared infrastructure only; service-local stack lives here.

- **Runtime / framework:** <e.g., .NET 9 + ABP 8.x>
- **Repo:** `./<svc>-repo/` (workspace-relative; see Multi-repo
  layout in `WORKFLOW.md`)
- **Branch convention:** `feat/FS-NNN-<slug>`
- **Directory layout:** <brief>
- **Build / test / run:** <commands>
- **Deploy target:** <e.g., k8s namespace, AWS account>
- **Environment variables:** <names; values out of band>

## Operations

Per-service operational truths. Stable facts about how the service runs in
production — distinct from cross-cutting NFRs (those live as CCCs under
`docs/shared/ccc/`, with operation-specific deviations as ADRs back-linked
via `related: [CCC-NNN]`).

- **Deployment cardinality:** `single-instance` \| `N-replicas` \| `autoscaled`
- **Health endpoint:** <path or signal — e.g., `/healthz`, k8s liveness probe>
- **Readiness model:** <when this service is ready to serve — warm caches, DB
  reachable, dependent SVC contracts reachable, etc.>
- **SLO target:** <availability and latency targets, e.g., 99.9% availability,
  p95 < 200ms — omit if no formal SLO is committed>

## Brownfield notes

Existing repo / package / deployment unit this service maps to:

## Decisions

> **Inline DEC** — single-node atomic rationale lives here. Promote to a
> standalone DEC under `docs/nodes/decisions/` when **any** of these
> trigger: scope spans ≥2 nodes; lifecycle (`status` / `superseded_by`) is
> needed; rationale grows past ~5 sentences with explicit Alternatives /
> Revisit-if blocks; external nodes need to cite by ID. See
> [`../../workflow/authoring-adr.md`](../../workflow/authoring-adr.md).
>
> Omit this section if the node has no node-local decisions worth recording.

### DEC-inline-1 — <slug>

**Decision:** <one or two sentences>
**Why:** <one or two sentences>
**Related:** <node IDs this rationale touches beyond the host, if any>

<!-- Add additional inline DECs as needed; promote to standalone when triggers fire. -->
