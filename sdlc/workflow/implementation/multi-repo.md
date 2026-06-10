---
name: implementation-multi-repo
description: "Detail file of implementation.md — multi-repo Phase 3 model: workspace layout, pre-merge branch-coherence check, cross-repo Stage 2, per-SVC stack discipline. Load when the FS's service_repos: is non-empty."
applies_when:
  stack: [agnostic]
---

# Multi-repo Phase 3 model

> Detail file of [`implementation.md`](../implementation.md) (Phase 3 flow).
> Load only when the FS declares non-empty `service_repos:`. Single-service /
> monolith projects never load this file.

Service repos are clones **inside** the workspace repo. The workspace
`.gitignore` excludes every `*-repo/` path; each service repo keeps its
own git history and tracks code commits independently of the planning
workspace.

```
workspace/                          # this repo
  .gitignore                        # ignores *-repo/
  CLAUDE.md
  sdlc/
  docs/
  ui-repo/                          # clone of the UI service repo
  api-repo/                         # clone of the API service repo
  fraud-detection-repo/             # clone of the stream-processor repo
  ...
```

Workspace root is the agent's CWD; service-relative paths look like
`./api-repo/src/controllers/...`. No worktrees, no submodules.

## Pre-merge branch-coherence check

Before Stage 1 Merge begins, run:

```
sdlc/scripts/check-branch-coherence.sh docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/FS-NNN.md
```

The script reads `service_repos:` from the FS frontmatter and verifies
every listed repo is on `feat/FS-NNN-<slug>`. Any mismatch halts Phase
3 — the merge does not begin until every service repo is on the
expected branch. The script also flags missing clones (paths declared
in `service_repos:` but absent from disk).

A monolith FS — `service_repos:` empty — skips the check trivially
(the script exits 0 with "no service_repos declared").

## Stage 2 Code across repos

Code edits in Stage 2 land in the appropriate service repo's working
tree. Each service repo's commit history is independent; the workspace
does not track those commits. The FS's `merge_sha:` records the **workspace**
HEAD at merge time — service-repo SHAs live in each service repo's own
log.

## Reading tech stack across repos

[`Context loading`](../implementation.md#context-loading-before-merging-or-coding) reads
`docs/shared/tech-stack.md` wholesale for cross-cutting infrastructure. In
multi-service projects, **also** read the `## Stack` section of every
SVC node listed in (or implied by) the FS's `service_repos:` — that is
where per-service runtime, build, test, and deploy commands live. See
[Per-SVC stack discipline](#per-svc-stack-discipline) below.

## Per-SVC stack discipline

`docs/shared/tech-stack.md` carries **cross-cutting** shared infrastructure
only — Kafka cluster, databases, observability stack, CI/CD platform,
language / ecosystem standards, project-wide runtime state. **Per-service**
runtime, repo URL, branch convention, directory layout, build / test /
run / deploy commands, environment variables, and deploy target live
in each SVC node's `## Stack` section. Linking nodes to the stack they
use is **implicit by containment**: an ENT in MOD-NNN realized by
SVC-NNN uses SVC-NNN's stack; no per-node tech link.

Source: `sdlc-framework-refinement-v3.md` Δ5 + Δ8.
