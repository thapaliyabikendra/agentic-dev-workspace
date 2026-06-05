---
name: change-request
description: "Lightweight CR track — standalone, isolated change requests that don't warrant milestone grouping. CR portal + single FRS + per-FRS gate (Pass 1 only) + FS + CHG + implementation. Escalation to milestone track when scope grows."
applies_when:
  stack: [agnostic]
---

# Change-Request Flow

Lightweight track for isolated, standalone change requests that don't belong
in a milestone group. Produces a CR-scoped container
(`docs/change-requests/CR-NNN-<slug>/`) instead of a milestone folder. FRS,
FS, and CHG artifacts are CR-scoped. Phase 0 (milestone scoping) and Phase
1.5 Pass 2 (cross-FRS sweep) are omitted — one FRS per CR is the ceiling.
Phase mechanics delegate to `design.md` / `plan.md` / `implementation.md`;
this file owns the container layout, path substitutions, and escalation
procedure only.

<HARD-GATE>
Do NOT begin Phase CR-2 (FS authoring) until the single FRS has cleared
Phase CR-1.5 (Pass 1 per-FRS gate, zero unresolved-without-OQ findings)
AND a `/clear` + reload of [`plan.md`](plan.md) has happened.
Do NOT write method bodies, brace-delimited blocks, SQL bodies, YAML
payloads, implementation file paths, or line-level code in the FS or any
CHG node. Phase CR-2 names structures; Phase CR-3 writes them.
(Cross-cutting rules: [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules).)
</HARD-GATE>

## When to Use

**Use when** the change is self-contained, scope is known at start, and no
related in-flight work should group it under a milestone. Reroute when:

| Signal | Routing |
|---|---|
| Multiple related user journeys surface | milestone track ([`design.md`](design.md)) |
| Cross-FRS conflicts surface at Phase CR-1.5 | escalate to milestone track |
| Change restores broken behavior (intent unchanged) | [`bug-fix.md`](bug-fix.md) |
| Several unrelated small CRs accumulate | `kind: accumulator` milestone |

Significant new UI surface → consider building a prototype first via CR-0.5 ([`prototype-first.md`](prototype-first.md)).

## CR Container Structure

```
docs/change-requests/CR-NNN-<slug>/
  CR-NNN-<slug>.md          # Portal (template: _templates/CR-PORTAL.md)
  id-claims.md              # modify+released ledger (lazy; R-NEW-9 amended 2026-05-17)
  frs/FRS-NNN-<slug>.md     # Single FRS per CR
  chg/CHG-NNN-<slug>.md     # Phase-1-born; permanent CR-scoped home
  specs/FS-NNN-<slug>/
    FS-NNN.md               # `cr: CR-NNN`; `consumes_chgs:` lists CR-1 CHGs
    test-plans/<use-case>/TC-NNN-<slug>.md
```

New canonical DDD nodes the FS introduces land in
`docs/<component>/nodes/<type>/` with `status: proposed` (same as milestone
track).

> **Frozen pre-2026-05-17 layout (grandfathered).** Pre-cutover CR containers
> nested CHG nodes under `specs/FS-NNN-<slug>/nodes/changes/CHG-NNN-<slug>.md`.
> Those CRs stay where they are; new CRs use `chg/` as a sibling of `frs/`
> and `specs/`, CHGs are Phase-1-born per R-CHG-1, and the consuming FS lists
> them in `consumes_chgs:` at Phase CR-2.

## Phase delegations

| Phase | Delegates to | CR-specific differences |
|---|---|---|
| CR-0 (Portal) | [`_templates/CR-PORTAL.md`](../_templates/CR-PORTAL.md) | Assign next free `CR-NNN` by globbing `docs/change-requests/`. Leave `frs:` / `specs:` empty; fill iteratively. |
| CR-0.5 (Prototype) — optional | [`prototype-first.md`](prototype-first.md) | Applies only when the change introduces significant new UI surface. Build a clickable prototype first to visualize and validate the change before FRS authoring and implementation. The CR/CHG/milestone is recorded in the prototype's `motivated_by:`. Skip if no meaningful new UI surface. |
| CR-1 (FRS) | [`design.md § Phase 1 — FRS Authoring`](design.md#phase-1--frs-authoring) | FRS at `frs/FRS-NNN-<slug>.md`; frontmatter `cr: CR-NNN` (leave `milestone:` blank). FLW + CHG born by FRS; ACT-NNN claimed via FRS `produced_actor:` (file at CR-2). |
| CR-1.5 (Gate) | [`design.md § Pass 1 — Per-FRS gate`](design.md#pass-1--per-frs-gate-runs-after-each-frs-is-authored) + [`frs-validation-rules.md`](frs-validation-rules.md) | Pass 1 only; Pass 2 N/A. Run escalation check below before `/clear` + CR-2. |
| CR-2 (FS + CHG) | [`plan.md`](plan.md) (follow exactly) | Path substitutions below; CHG mechanics per [`in-flight-nodes.md`](in-flight-nodes.md) + [`plan.md § 4`](plan.md#4-chg-node-consumption--enrichment). |
| CR-3 (Impl) | [`implementation.md`](implementation.md) (no differences) | — |

### Phase CR-2 path substitution

| Milestone path / field | CR path / field |
|---|---|
| `milestones/M-NN-<slug>/specs/FS-NNN-<slug>/FS-NNN.md` | `docs/change-requests/CR-NNN-<slug>/specs/FS-NNN-<slug>/FS-NNN.md` |
| `milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` | `docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md` |
| `milestone: M-NN` in FS frontmatter | `cr: CR-NNN`; leave `milestone:` blank |

## Escalation procedure (→ milestone track)

Run the escalation check at Phase CR-1.5 (after Pass 1 passes):

| Signal | Action |
|---|---|
| Pass 1 surfaces a second user journey in scope | Escalate |
| Pass 1 flags a cross-cutting architectural decision spanning components | Escalate |
| CR is related to other planned work that shares a domain | Escalate or group under existing milestone |
| All signals absent | Proceed to Phase CR-2 after `/clear` + `plan.md` reload |

When escalating: (1) stop the CR track; (2) load [`design.md`](design.md)
under a new or existing milestone; (3) adopt the CR FRS into the milestone
by adding `from_cr: [CR-NNN]` to its frontmatter and flipping the CR portal
to `status: escalated`, `escalated_to: [M-NNN]`; (4) keep the portal as the
audit trail — do not delete.

## QA track

After CR-3, the QA track applies without modification. Load
[`test-plan-ingest.md`](test-plan-ingest.md),
[`test-suite-codegen.md`](test-suite-codegen.md), and
[`qa-gate.md`](qa-gate.md) on their own cadence. `/clear` boundaries:
QA-track entry (into `test-plan-ingest`) and between `test-plan-ingest`
↔ `test-suite-codegen`; `test-suite-codegen` ↔ `qa-gate` share a
session (back-to-back; gate inherits codegen context per CLAUDE.md
Rule 5).
TC files live under
`docs/change-requests/CR-NNN-<slug>/specs/FS-NNN-<slug>/test-plans/`.

## Integration

- **Routing:** [`index.md`](index.md)
- **Phase delegates:** [`design.md`](design.md) (CR-1, CR-1.5), [`plan.md`](plan.md) (CR-2), [`implementation.md`](implementation.md) (CR-3)
- **Canonical-edit + ID discipline:** [`maintenance-discipline.md`](maintenance-discipline.md) — 2-file touch on every node edit; ID assignment via per-type `index.md` + CR `chg/` folder glob + FRS frontmatter (R-NEW-9 amended 2026-05-17 — `id-claims.md` is modify+released only)
- **Escalation target:** [`design.md`](design.md) under new or existing milestone
