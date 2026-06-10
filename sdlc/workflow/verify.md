---
applies_when:
  stack: [agnostic]
---

# Verification Flow

> Post-implementation confirmation — verifies that a milestone's delivered
> code satisfies the FRS acceptance criteria that Phase 3 QA walked. This
> is **not** a second blocking gate; Phase 3's QA checklist is the canonical
> gate. `verify.md` is a structured pass to surface gaps before milestone
> close, route them to the right track, and produce a durable UAT record.
> Mirrors `lint.md`'s non-blocking, confirmatory posture.

## When to Use

**Use when:** Phase 3 QA has passed for every FS in the milestone AND any
of the following apply:
- The milestone contains ≥ 3 FSs (each QA pass was scoped to one FS —
  cross-FS criterion coverage has not been verified in aggregate).
- Phase 3 QA was tightly scoped (acceptance criteria spot-checked, not
  walked exhaustively).
- The human BA/QA hat wants a durable UAT record before declaring the
  milestone done.

**Do NOT use when:**
- Phase 3 QA has not yet passed for every FS — verify.md is confirmation,
  not remediation. Finish Phase 3 QA first.
- The milestone is single-FS and the Phase 3 QA checklist explicitly walked
  every FRS acceptance criterion. A UAT.md adds no coverage in that case.
- The milestone is a `kind: refactor` or `kind: absorption` — those have no
  FRS acceptance criteria to verify.

## Vs. sibling files

| File | Posture | Fires when |
|------|---------|-----------|
| `lint.md` | Non-blocking scan for structural gaps | Between phases, at any time |
| `review.md` | Code quality / conformance review | At Phase 3 QA gate |
| `verify.md` ← this file | Post-QA confirmation + gap routing | After Phase 3 QA, before milestone close |

---

## Process Flow

```
Phase 3 QA passed (all FSs)
        ↓
V-1: Load scope (milestone portal → FRS acceptance criteria + FS Coverage tables)
        ↓
V-2: Success criteria check (per criterion: confirmed-passing / failed / not-yet-verified)
        ↓
V-3: Gap handling (route each failed/not-yet-verified criterion)
        ↓
V-4: Emit docs/milestones/M-NN-<slug>/UAT.md
        ↓
V-5 (optional): Emit VERIFICATION.md per FS with ≥1 gap
        ↓
[All criteria confirmed-passing?]
   yes → emit ## VERIFICATION PASSED
   no  → UAT.md records partial status; milestone close is human decision
```

---

## Procedure

### V-1 — Load scope

1. Open the milestone portal at `docs/milestones/M-NN-<slug>/M-NN-<slug>.md`.
   Collect the `frs:` list and the `specs:` list.
2. For every FRS-NNN in `frs:`, open the FRS file at
   `docs/milestones/M-NN-<slug>/frs/FRS-NNN-<slug>.md`.
   Collect the `## Acceptance criteria` section. These are the test objects.
3. For every FS-NNN in `specs:`, open the FS file at
   `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/FS-NNN.md`.
   Collect the `## Coverage` or `## Test plan` table — it shows which FRS
   acceptance criteria this FS claimed to satisfy.
4. Do **not** reload implementation code or canonical nodes wholesale.
   The QA gate already verified those; verify.md reads specs and criteria,
   not source files.

### V-2 — Success criteria check

For each FRS acceptance criterion collected in V-1, classify:

- **confirmed-passing** — the Phase 3 QA pass (or a named test) explicitly
  covered this criterion and it passed.
- **failed** — the criterion was checked and it did not pass, or a test
  that covers it is failing.
- **not-yet-verified** — the criterion was not explicitly checked in Phase 3
  QA (could be a coverage gap or a deliberately deferred check).

Record the classification for every criterion; do not skip.

### V-3 — Gap handling

For each criterion classified `failed` or `not-yet-verified`:

1. Create a gap entry (see UAT.md template `## Gaps` section).
2. Route to one of:
   - **Code-only fix** — the fix requires no design; route to `bug-fix.md`
     track. The UAT.md gap entry records `routing: bug-fix`.
   - **Requires design** — the criterion cannot be met without a new or
     revised FRS. Raise an `OQ-NNN` under
     `docs/discovery/open-questions/` with `origin: verify, origin_ref:
     FRS-NNN, needed_by: <next-milestone>`. The UAT.md gap entry records
     `routing: new-frs, oq: OQ-NNN`.
   - **Out-of-scope** — the criterion is genuinely deferred; record in
     `## Deferred items` with target milestone.

Do **not** re-open Phase 3 or re-run QA from within verify.md. Gaps go to
their routing track and UAT.md records the decision.

### V-4 — Emit UAT.md

Write `docs/milestones/M-NN-<slug>/UAT.md` from the template at
`sdlc/_templates/UAT.md`. Fill every section:

- `status:` — `passed` if all criteria confirmed-passing; `failed` if any
  criterion failed; `partial` if any criterion is not-yet-verified but none
  failed; `draft` until the pass is complete.
- The `## Acceptance criteria status` table must carry every criterion from
  every FRS — no omissions.

#### Confidence disclosure

Each criterion classification in the `## Acceptance criteria status`
table carries a `confidence:` annotation:

- **code-verified** — the classification rests on execution evidence
  (a named passing test, or the QA pass opened the running
  implementation).
- **kb-inferred** — the classification rests on spec/checklist prose
  only, with no execution evidence.

A `kb-inferred` "confirmed" is weaker than it looks — classify it
`not-yet-verified` rather than `confirmed-passing` when execution
evidence is absent. **Scope guard:** confidence annotates evidence
strength only; it does not change V-3 routing and does not re-open
Phase 3 QA (see Anti-Pattern: "The Second Gate").

### V-5 — Emit VERIFICATION.md (optional)

For each FS that has ≥ 1 gap entry, write a short
`docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/VERIFICATION.md`
with the gap entries that belong to this FS. This is optional and
lightweight — a pointer to the UAT.md gap entries, not a new gate.

---

## Completion marker

After V-4 is emitted with `status: passed` — meaning every FRS acceptance
criterion from V-2 is classified `confirmed-passing` — emit the following
marker as the last line of the verify.md operation's output:

```
## VERIFICATION PASSED
```

This marker is on its own H2 line with no inline content. It signals to
any orchestrator or downstream consumer that the milestone's UAT is clean.
When `status:` is `partial` or `failed`, the marker is **not** emitted.

---

## Report immutability

The UAT.md emitted at V-4 is the durable record — never edit it
retroactively. When a subsequent fix or decision changes a gap's
routing, append a dated amendment at the bottom of the file:

```
## Amendment YYYY-MM-DD — <gap ref> rerouted from <X> to <Y>
```

The original classification stands as an accurate snapshot; the
amendment is the audit trail. Same convention as the dated E2E
run-reports ([`qa-gate.md § E2E run-report`](qa-gate.md#e2e-run-report))
and prototype eval reports
([`prototype-eval-rubric.md`](prototype-eval-rubric.md)).

---

## Anti-Pattern: "The Second Gate"

verify.md is **confirmation**, not a second blocking gate.

The temptation: re-run the Phase 3 QA checklist inside verify.md ("let me
just re-verify everything from scratch"). The cost: the human QA hat now
runs the same checklist twice under two different names; Phase 3 QA becomes
a formality rather than the gate.

verify.md reads specs and criteria — it does not re-read code or re-run
tests. Any gap it surfaces routes to `bug-fix.md` or a new FRS, neither
of which re-opens Phase 3. The Phase 3 QA gate is the canonical gate;
verify.md audits the coverage of that gate after the fact.

Doctrinal anchor: [`../PRINCIPLES.md`](../PRINCIPLES.md) — "If it can
drift, the operation isn't atomic enough." The inverse applies here: don't
repeat an atomic gate.

---

## Integration

- **Required after:** [`qa-gate.md`](qa-gate.md) QA verification checklist
  has passed for every FS in the milestone. Do not invoke before QA is done.
- **Required before (if invoked):** milestone close — flip milestone status
  to `done` only after UAT.md is written (regardless of its `status:` value).
  Run [`close-milestone.md`](close-milestone.md) for the complete close
  checklist (status flip, MILESTONE-STATE.md finalization, home.md update,
  and roadmap regen).
- **Emits:** `docs/milestones/M-NN-<slug>/UAT.md` (mandatory when invoked);
  `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/VERIFICATION.md`
  (optional, per-FS with gaps).
- **Routes gaps to:** [`bug-fix.md`](bug-fix.md) (code-only fixes);
  `docs/discovery/open-questions/` + new FRS (requires design).
- **Template:** [`sdlc/_templates/UAT.md`](../_templates/UAT.md).
- **Sibling ops:** [`lint.md`](lint.md), [`review.md`](review.md).
