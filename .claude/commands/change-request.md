---
description: Standalone CR track — change-request.md. CR portal + single FRS + per-FRS gate (Pass 1 only) + FS + CHG + implementation under docs/change-requests/CR-NNN-<slug>/, no milestone grouping. Escalates to the milestone track when scope grows.
argument-hint: [the change to request — brief, prototype path, or scope description]
---

Run the lightweight change-request track for an isolated, standalone change that doesn't warrant milestone grouping. Produces a CR-scoped container instead of a milestone folder; one FRS per CR is the ceiling. Phase mechanics delegate to `design.md` / `plan.md` / `implementation.md` — the CR flow file owns only the container layout, path substitutions, and escalation procedure. Phases: CR-0 (portal) → optional CR-0.5 (prototype, when significant new UI surface — `/create-prototype` with the CR in `motivated_by:`) → CR-1 (FRS) → CR-1.5 (Pass-1 gate + escalation check) → CR-2 (FS + CHG) → CR-3 (implementation) → QA track unchanged.

**Change:** $ARGUMENTS
(If empty, ask what the change is — and whether it is genuinely self-contained — before starting.)

> **Canonical flow:** load `sdlc/workflow/change-request.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. The
> delegated phase files (`design.md`, `plan.md`, `implementation.md`) load at
> their own phase entries per the delegation table. This command sets scope and
> names the contract; the flow file governs. If they diverge, the flow file
> wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Use only when the change is self-contained, scope is known at start, and no related in-flight work should group it under a milestone. Reroute before starting: multiple related user journeys → milestone track (`/author-frs` under `/open-milestone`); restores broken behavior with intent unchanged → `/bug-fix`; several unrelated small CRs accumulating → `kind: accumulator` milestone.

**HARD-GATE (restate — defense-in-depth):** do NOT begin Phase CR-2 (FS authoring) until the single FRS clears Phase CR-1.5 (Pass 1, zero unresolved-without-OQ) AND the escalation check ran AND a `/clear` + reload of `sdlc/workflow/plan.md` happened. No method bodies / brace blocks / SQL / YAML payloads / file paths in the FS or any CHG — CR-2 names structures; CR-3 writes them.

**HARD-GATE (restate — defense-in-depth):** every FRS/FS authored here declares `framework:` + `stack:` in frontmatter (CLAUDE.md HARD-GATE, 2026-05-22).

## Phase & boundaries

Standalone track, milestone-free. `/clear` boundaries mirror the milestone track: CR-1.5 → CR-2 and CR-2 → CR-3. The escalation check at CR-1.5 exit is mandatory — second user journey, cross-cutting architectural decision, or shared-domain overlap with planned work escalates to the milestone track (portal → `status: escalated`, FRS adopted via `from_cr:`; the portal stays as audit trail).

## Produces

`docs/change-requests/CR-NNN-<slug>/` — portal (template `sdlc/_templates/CR-PORTAL.md`; next free CR-NNN by globbing `docs/change-requests/`), `frs/FRS-NNN-<slug>.md` (`cr: CR-NNN`, `milestone:` blank), `chg/CHG-NNN-<slug>.md`, `specs/FS-NNN-<slug>/FS-NNN.md` + test-plans. New canonical nodes land in `docs/<component>/nodes/<type>/` at `status: proposed`, same as the milestone track. The flow file owns the detail.

## On completion

CR-3 done → QA track unchanged: `/test-plan` →[`/clear`]→ `/test-suite` (TC files under the CR's `specs/.../test-plans/`). No milestone close — the CR portal's status is the terminal record.

**Commit discipline (rule 11):** never `git commit` without explicit user authorization, per commit.
