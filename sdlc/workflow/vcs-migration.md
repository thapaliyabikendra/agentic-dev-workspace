---
name: vcs-migration
description: "Filesystem-to-issue-tracker mapping table and deprecated path notes for when the team adopts GitLab, GitHub, Azure DevOps, Jira, or similar. Load only when planning or executing a platform migration."
---

# VCS / Issue-Tracker Migration

When the team adopts an issue tracker (GitLab, GitHub, Azure DevOps,
Jira, etc.), map the filesystem artifacts as follows:

## Filesystem-to-issue-tracker mapping

| Filesystem                                                          | Issue tracker concept                               |
| ------------------------------------------------------------------- | --------------------------------------------------- |
| `docs/milestones/M-NN-<slug>/M-NN-<slug>.md`                        | Platform milestone                                  |
| `docs/milestones/M-NN-<slug>/frs/FRS-NNN-*.md`                      | Issue labeled `FRS`, linked to the milestone        |
| `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/FS-NNN.md`         | Issue labeled `Feature Spec`, linked to the milestone |
| `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/nodes/changes/**`  | Stays in repo — CHG permanent home                  |
| `docs/milestones/M-NN-<slug>/discovery/**`                          | Stays in repo — working notes                       |
| `docs/milestones/M-NN-<slug>/id-claims.md`                          | Stays in repo — claim ledger                        |
| `docs/<component>/nodes/**`                                         | Stays in repo — wiki is the right home              |
| `docs/<component>/adrs/**`                                          | Stays in repo — wiki is the right home              |
| `docs/research/**`                                                  | Stays in repo — wiki is the right home              |
| `docs/discovery/open-questions/**`                                  | Stays in repo — per-OQ files + index + log          |
| `docs/discovery/open-questions.md`                                  | Stays in repo — frozen legacy log (pre-cut-over OQs) |

Nodes, ADRs, discoveries, and per-FS CHG nodes remain filesystem-based
even after platform adoption. Issues are for trackable work; everything
under `nodes/`, `adrs/`, and the per-milestone `discovery/`,
`specs/<FS>/nodes/changes/`, `id-claims.md` is durable knowledge that
stays in the repo.

## Deprecated paths

The previous top-level `docs/frs/`, `docs/specs/`, and
`docs/discovery/<scope>.md` (per-feature) trees no longer exist — everything
moves under `docs/milestones/M-NN-<slug>/`. At the original discovery root,
two artifacts remain: the per-OQ folder `docs/discovery/open-questions/`
(authoritative for new OQs) and the frozen legacy file
`docs/discovery/open-questions.md` (pre-2026-05-13 entries; migrates
opportunistically when touched).

---

## Integration

**Parent:** [`../WORKFLOW.md → Migration to a VCS / issue-tracking platform`](../WORKFLOW.md#migration-to-a-vcs--issue-tracking-platform) —
WORKFLOW.md carries the pointer; this file is the full reference.

**Related:** [`../LAYOUT.md`](../LAYOUT.md) — physical workspace folder map;
[`../KB-LAYOUT.md`](../KB-LAYOUT.md) — the DDD wiki structure that stays
in the repo post-migration.
