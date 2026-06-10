---
name: planning-conventions
description: "Conventions governing Claude plan files (e.g. `.claude/plans/*.md`, in-conversation execution plans). Default to multi-phase; mark sub-agent dispatch points; run the Karpathy gate before declaring a plan ready. Load when authoring or reviewing a plan."
applies_when:
  stack: [agnostic]
---

# Planning Conventions

> Procedure for authoring forward-looking plan files — when to multi-phase
> vs single-pass, where to dispatch sub-agents (Explore / Plan / general-purpose),
> and the seven-principle Karpathy gate every non-trivial plan must clear before
> the user is asked to approve it. Doctrinal anchor:
> [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) HR-PLAN (plan
> mechanics) and HR-STYLE (token-optimized output, lead with the recommendation).

> **HARD-GATE:** Do NOT declare a plan ready for user approval until (a) the
> Karpathy scorecard scores at least PARTIAL on every principle and STRONG on
> 1 / 3 / 5 / 6 / 7, (b) reversibility is surfaced, (c) success criteria are
> observable and stated up front. A plan that fails any of these is silently
> shifting synthesis onto the user — the named anti-pattern is "The Helpful
> Continuation" ([`../PRINCIPLES.md`](../PRINCIPLES.md#anti-patterns-to-refuse)).

## When to Use

**Use when:** authoring a new plan file (in plan mode or otherwise), reviewing
a sibling plan file, or escalating a multi-step task that needs progress
tracking across phases. Applies to `.claude/plans/*.md` files and to in-flow
execution plans surfaced inside this workspace (e.g. milestone-level
implementation orchestration).

**Do NOT use when:** the task is one-shot and trivial (typo fix, single-line
change, simple rename) — write the change, skip the plan ceremony. Do not use
for FRS / FS / TC authoring — those have dedicated flow files
([`design.md`](design.md), [`plan.md`](plan.md), [`test-plan-ingest.md`](test-plan-ingest.md))
that override these conventions.

**Vs. sibling files:** [`plan.md`](plan.md) is the Phase 2 *Feature Spec* flow
(node ingest + CHG enrichment) — not what this file governs.
[`authoring-adr.md`](authoring-adr.md) governs ADR authoring; this file governs
the *plan* that may produce or consume an ADR. The two are file-disjoint.

## Multi-phase by default

Forward-looking plans default to **multi-phase** structure. Phases are not
report sections — each phase is an execution boundary with an observable
signal that says "Phase N is done; Phase N+1 may begin". A flat step list is
appropriate **only** when:

- the task is one-shot and reversible (typo, rename, single-file edit), or
- every step shares the same context, runs without checkpoints, and emits no
  signal a reader could verify mid-flight.

If either condition fails, multi-phase. Each phase carries:

1. **Goal** — one sentence; the observable outcome the phase delivers.
2. **Sub-agents** — `N × <type>`, parallel or sequential, with the focus each
   carries. `none` is a valid value (main thread runs it).
3. **Steps** — checkboxed (`[ ]`) per the progress-checklist requirement
   below; one line per step where possible.
4. **Signal Phase N is done** — observable predicate. Examples: "file exists
   at path X with frontmatter Y", "test command exits 0", "link from A
   resolves to B".

Phase numbering is contiguous (`Phase 1` → `Phase 2` → …); the last phase is
typically `Verification`. A reader picking up the plan cold should be able to
tell which phase is in progress without re-reading the conversation.

### Progress-checklist requirement

Multi-stage plans (≥2 phases) carry a progress checklist using `[ ]` / `[x]`
per step. Mark each step `[x]` before advancing — the checklist is the
durable signal that survives `/clear`. Canonical procedure:
[`../WORKFLOW.md § Validation gates`](../WORKFLOW.md#validation-gates) and
[`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) HR-PLAN.

## Sub-agent dispatch

Sub-agents parallelize independent work and isolate context. Dispatch is
**explicit in the plan** — mark each phase's sub-agent count, type, and
focus. Anti-pattern: invoking sub-agents ad-hoc without surfacing them in
the plan, which makes the parallel structure invisible to the reader.

### Dispatch rule of thumb

| Task shape | Sub-agent type | When |
|---|---|---|
| "Where is X / which files reference Y" — single targeted lookup | `Explore` (one) | Locating code by known pattern; single round |
| "Audit / review / find issues across N files" — independent per-file work | `Explore` × N (parallel, max 3 per round) | Each file's audit is independent; main thread synthesizes |
| "Design implementation for module Z" — needs an implementation plan | `Plan` | Before committing to an approach on non-trivial work |
| "Open-ended research, may need multiple passes" | `general-purpose` | Don't know what you'll find; agent needs latitude |
| "Long-running task I don't need results for now" | `general-purpose` with `run_in_background: true` | Genuine parallel work; main thread proceeds without |
| "Code review / second opinion" on a draft | `Plan` or `general-purpose` | Independent check on a decision |

### Parallelism rules

- **Max 3 sub-agents per round** (in a single message). If N > 3, batch by
  phase: round 1 fires 3, round 2 fires 3, … main thread synthesizes
  between rounds.
- **Independent tool calls go in one message.** When dispatching multiple
  agents at once, send them in a single tool-use block — sequential
  dispatch defeats the parallelism.
- **Surface independence in the plan.** If the plan says "no dependencies
  between rows", those rows are sub-agent candidates by definition — name
  the agents, do not stop at the independence claim.

### When NOT to sub-agent

- Trivial reads (one file, known path) — use the dedicated tool (`Read`,
  `Glob`, `Grep`).
- Tasks that mostly write code in one place — sub-agents return summaries,
  not durable file edits; if you need the edit, do it on the main thread
  (or dispatch carefully and verify the diff).
- Tasks where the main thread already has the context loaded — re-loading
  it in a sub-agent wastes tokens.

### Phase 3 layer dispatch

Phase 3 layer dispatch is per-layer batched by cohort
([`implementation.md § Stage 2 Code — per-layer dispatch`](implementation.md#stage-2-code--per-layer-dispatch)).
Five layers map across three rounds: Round 1 (Cohort A, parallel) dispatches
`shared` + `domain` agents; Round 2 (Cohort B, parallel) dispatches `contracts`
+ `application` agents; Round 3 (Cohort C) dispatches the `infrastructure`
agent. Cohort D (`HttpApi.Host`) is out of scope and stays in the main session.
The 3-per-round cap holds. The `/clear` HARD-GATE is not violated — sub-agents
are dispatched within Phase 3 and run in their own isolated contexts.

## Karpathy gate

Every non-trivial plan clears the seven principles below before user
approval. Score each STRONG / PARTIAL / WEAK with one-line evidence. A plan
that scores WEAK on any principle is incomplete — repair before declaring
ready.

| # | Principle | What it means for a plan |
|---|---|---|
| 1 | **Think Before Proposing** | Assumptions and interpretations stated up front. Sources cited (files, ADRs, prior decisions) with paths or IDs. No silent inference. |
| 2 | **Generate Before Converging** | For non-routine decisions, 2–3 alternatives surfaced before the recommendation. Drop alternatives only when they would be procrastination (obvious / low-stakes calls). |
| 3 | **Right-Size the Plan** | Phase count matches task complexity. No invented future-proofing. If a 4-step plan could deliver the same outcome as a 12-step plan, compress. |
| 4 | **Reversible vs Irreversible** | Reversibility surfaced in its own section. Two-way doors → bias to speed; one-way doors → slow down, surface options. Irreversible operations named explicitly. |
| 5 | **Stay In Scope** | Every phase traces back to the user's request. Adjacent issues flagged under "Out of scope" rather than absorbed silently. |
| 6 | **Don't Fabricate** | Every cited file / ADR / line number resolves. Cross-reference checks fire before user approval. |
| 7 | **Define Success Up Front** | Success criteria are observable signals stated before the phases. The reader can verify "done" without re-reading the conversation. |

**Lead with the recommendation.** The first non-context section names the
proposed approach; alternatives, rationale, and trade-offs follow. Token-
economy and pointer-heavy output style applies (CLAUDE.md HR-STYLE).

## Reversibility surfacing

Every plan carries a `## Reversibility` section (one paragraph) classifying
its edits as:

- **Two-way doors** — markdown edits, code edits behind a feature flag,
  changes confined to a branch. Bias toward speed; the cost of "wrong" is
  a re-edit.
- **One-way doors** — schema migrations, public-interface deletions, force
  pushes, data loss, deployed-to-prod artifacts. Slow down. Surface
  alternatives. Bias toward correctness.

Name irreversible parts explicitly. A plan that is silent about
reversibility forces the reader to compute it from the phase steps — that
is synthesis the plan owes the reader.

## Out of scope

Every plan carries a `## Out of scope (deliberately)` section listing
adjacent issues the plan does NOT absorb. Each item is one line: the issue
+ where it routes (separate plan, ADR, OQ, future enhancement). The
section is the audit trail that the plan author considered the issue and
deliberately deferred it — not an oversight.

## Recommended plan template

Apply for new plans. Skip sections only when the task is genuinely
one-shot (typo, single-line change). Multi-phase is the default; collapse
to a single phase only when the task fits the "Do NOT multi-phase"
conditions above.

```markdown
# <Plan title>

## Context
Why this plan exists. The problem / need / prompt. The intended outcome.
Cite sources the plan rests on (files, ADRs, prior decisions) by path / ID.

## Success criteria (observable, defined up front)
- Criterion 1 — a reader / tool can verify this by <X>
- Criterion 2 — measurable: <Y>
- Criterion 3 — checkpoint signal: <Z>

## Reversibility
One paragraph: two-way doors or one-way? Name the irreversible parts.

## Alternatives considered
(Non-routine decisions only. Skip for clear-cut tasks.)
- Option A — optimizes for <X>, trades off <Y>
- Option B — optimizes for <X>, trades off <Y>
- **Recommended:** Option <N>, because <reason>.

## Out of scope (deliberately)
- <Adjacent issue 1> — flagged, routes to <where>
- <Adjacent issue 2> — defer to <where>

## Critical files
- `<path>` — <one-line: what about it; reuse signal if applicable>
- `<path>` — …

## Phases

### Phase 1 — <name>
**Goal:** <observable outcome>
**Sub-agents:** N × <Explore|Plan|general-purpose>, in parallel | sequential,
  each with <focus>. (Or: none — main thread.)
**Steps:**
- [ ] Step 1.1
- [ ] Step 1.2
**Signal Phase 1 is done:** <observable predicate>

### Phase 2 — <name>
(only if Phase 1's signal is green)
…

### Phase N — Verification
**Goal:** confirm success criteria met.
**Steps:**
- [ ] Run <command / check>
- [ ] Cross-ref check <X>
**Signal Phase N is done:** <observable>
```

## Requirement→step coverage map

Plans that originate from a list of stated requirements (a spec, a user
enumeration, an approved design) and run ≥ 2 phases end with a footer
table mapping each requirement to the step implementing it:

| Requirement | Implementing step | Status |
|---|---|---|

A requirement with no implementing step is a coverage gap — repair
before declaring the plan ready. This is the proof obligation for
Principle 5 (Stay In Scope): the map shows every requirement was
absorbed or explicitly routed to `## Out of scope`, not silently
dropped. Skip only when the request was a single requirement (the plan
*is* the map).

## Self-review pass

Before declaring a plan ready, the author re-applies the Karpathy
scorecard to the plan itself (one-line evidence per principle). A plan
that fails its own scorecard is mis-specified — repair before user
approval. Worked example: the plan that produced this convention file
includes a Phase 4 verification step that re-applies the scorecard to
the plan file as a self-test (see
`.claude/plans/c-users-bikendrathapaliya-claude-plans-c-mutable-lamport.md` § Phase 4).

## Common Mistakes

**❌ Flat step list for a multi-phase task** — collapses execution
checkpoints into prose; no signal a reader can verify mid-flight.
**✅ Group steps by phase** with one observable signal per phase.

**❌ Sub-agents dispatched ad-hoc, not surfaced in the plan** — parallel
structure becomes invisible; reader can't tell what's running where.
**✅ Mark sub-agents per phase** with type, count, focus.

**❌ "Based on your findings, fix the bug" / "Based on the research,
implement it"** — pushes synthesis onto a sub-agent that doesn't have the
full context. The agent's report comes back; the main thread integrates.
**✅ Sub-agent returns evidence**; main thread decides what to do with it.

**❌ Reversibility silent** — reader must compute it from the phase steps.
**✅ Section: `## Reversibility`** — one paragraph, two-way vs one-way,
irreversible parts named.

**❌ Success criteria stated as vibes** ("looks good", "tests pass") with
no observable predicate.
**✅ Observable signal** ("file exists at path X", "command exits 0",
"link from A resolves to B").

**❌ Adjacent issues silently absorbed** into the plan's phases.
**✅ `## Out of scope`** lists them with route-to destinations.

## Red Flags

**Never:**

- Declare a plan ready without running the Karpathy scorecard on it.
- Use sub-agents to make decisions the main thread should make ("agent,
  decide whether to refactor or not"). Sub-agents return evidence; the
  main thread synthesizes.
- Fabricate file paths, line numbers, or ADR IDs. Cross-reference checks
  fire before user approval (Principle 6).
- Skip the reversibility section because "it's obvious". If it's obvious,
  one sentence costs nothing; if it's not obvious, the section is the
  safeguard.
- Run sub-agents in series when they could run in parallel — dispatch in
  one message, max 3 per round.

## Execution invocation

**Standard invocation:**
> execute the plan. use subagents where feasible and needed to not pollute
> the main agent context.
>   `<plan-file-path>`

**What this triggers (orchestrator contract):**

- Main agent reads the plan file and becomes a **pure orchestrator** — it
  routes, sequences, and verifies; it does not perform substantive reads or
  writes itself.
- Each phase or stage with file I/O (reads, node ingest, code writes) is
  dispatched to a sub-agent (`subagent_type` per the dispatch table above).
- Sub-agents return the 3-block shape (`## Findings` / `## Risks` /
  `## Open questions`) or the code-writing envelope (`## Files written`)
  per [`agent-contracts.md`](agent-contracts.md).
- Main agent advances to the next phase only after verifying the prior
  sub-agent's output (mutation-verification rule,
  `agent-contracts.md § Mutation verification`).
- Progress checklist in the plan file is marked `[x]` by the orchestrator
  after each verified step — this is the durable state across `/clear`
  boundaries.

**Context-protection rule:** "not pollute the main agent context" means: do
not wholesale-read large files, diffs, or generated outputs into the
orchestrator turn. If a result is needed for routing decisions, have the
sub-agent summarize it to ≤400 words; full content stays inside the
sub-agent's context window.

**Shorthand:** once this rule is loaded, the user may invoke with just the
plan path and the phrase "execute the plan" — the subagent constraint is
implied.

### Per-step failure handling (fail-stop discipline)

Execution never improvises recovery. Defaults apply when the plan is
silent; a plan may override per phase, explicitly:

- **Failure clause per phase.** Each phase may declare what constitutes
  failure for its steps and whether recovery is `self-heal` (retry /
  fallback named in the plan) or `stop-and-ask`. **Default:
  `stop-and-ask`** — on failure, stop, show the exact tool/command
  output, report what state the workspace was left in, and ask. Silent
  recovery masks the signal the failure carries.
- **Least-privilege tool declaration.** A phase that only reads
  declares read-only sub-agents/tools; write access is declared only by
  phases that write. A read-shaped phase requesting write access is a
  scope violation — flag it at plan review.
- **Invocation-scoped authorization.** Operator approval for a
  destructive step authorizes that invocation only — it does not carry
  to subsequent phases, retries, or sessions. Anchor for the
  commit-specific case:
  [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) HR-COMMIT
  (commit authorization never carries forward); this clause is its
  plan-execution generalization for every destructive action class.

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
  HR-PLAN (plans contain no syntax; multi-stage progress-checklist
  requirement); HR-STYLE (token-optimized output style, lead with the
  recommendation); HARD-GATE on doctrinal–procedural drift (any change to
  this file must atomically check `PRINCIPLES.md`).
- **Required before:** [`../WORKFLOW.md § Validation gates`](../WORKFLOW.md#validation-gates) —
  canonical home of the progress-checklist procedure; this file references
  but does not re-state it.
- **Required before:** [`../PRINCIPLES.md`](../PRINCIPLES.md) — "The Helpful
  Continuation" anti-pattern this file's HARD-GATE prevents; "Adding rules
  without removing the old ones" governs scope-creep on plans.
- **Rule books wholesale-read during this op:**
  [`agent-contracts.md`](agent-contracts.md) — subagent dispatch return
  shape (Layer 1) + TaskCreate discipline (session task tracker).
- **Callers (this file is wholesale-read by):** any plan-authoring
  context — in-conversation plan mode, `.claude/plans/*.md` review,
  ad-hoc multi-step execution plans surfaced inside flow files.
- **Sibling operation files:** [`authoring-adr.md`](authoring-adr.md)
  (ADR discriminator), [`discuss.md`](discuss.md) (pre-plan decision
  capture), [`lint.md`](lint.md) (debt scan), [`review.md`](review.md)
  (review pass).
