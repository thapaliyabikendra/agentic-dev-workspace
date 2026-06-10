---
description: Open a new milestone container only — allocate M-NN, create the folder + portal + MILESTONE-STATE.md from a prototype or raw-requirements seed, surface it in the roadmap. No SURVEY or FRSs (that is /author-frs).
argument-hint: [prototype path or raw requirements describing the milestone scope]
---

Open a new milestone container from a seed input. The seed (prototype path or raw requirements) is used only to derive `title` / `kind` / `slug` for the portal — this command is container-only. Steps O-1…O-6 are owned by the flow file. Do NOT author the SURVEY, the `PROTO-<slug>` prototype disposition, or any FRS here; the SURVEY and FRSs belong to Phase 0/1 in `/author-frs`, the prototype disposition to `/create-prototype`. The prototype or raw-requirements seed flows forward by re-passing it to `/author-frs` after this command completes.

**Seed input:** $ARGUMENTS
(If empty, ask for a prototype path or raw requirements scope before starting.)

> **Canonical flow:** load `sdlc/workflow/open-milestone.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Pre-Phase-0 utility — no upstream phase gates it. Precondition: a seed must be present (prototype path or raw requirements); do not open a container with no scope anchor. Container-only scope: this command allocates M-NN and creates the folder / portal / MILESTONE-STATE.md and roadmap entry only. No SURVEY, no `PROTO-<slug>` prototype disposition, no FRS.

## Phase & boundaries

Pre-Phase-0 utility. No `/clear` required on entry. On completion, re-pass the seed to `/author-frs` without a `/clear` — the container identity established here is the input to that command.

## Produces

`docs/milestones/M-NN-<slug>/` folder, milestone portal `M-NN.md`, `MILESTONE-STATE.md`, roadmap entry. M-NN allocated from `docs/home.md` high-water mark. The flow file owns the detail.

## On completion

Flow emits `## MILESTONE OPENED`. Next command: `/author-frs <same seed>` — pass the original seed so Phase 0 (SURVEY + extraction-rules routing) has its input.

Command chain for reference:
`/open-milestone` → [`/create-prototype` → `/clear`] → `/author-frs` →[`/clear`]→ `/author-fs` →[`/clear`]→ `/implement-milestone`
QA track: `/test-plan` →[`/clear`]→ `/test-suite` → `/verify-milestone` → `/close-milestone`
Standalone: `/change-request` · `/bug-fix` · `/api-integration` (cross-repo `ui/` ↔ `api/` + KB)
