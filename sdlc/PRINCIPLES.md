# PRINCIPLES.md — Doctrinal Rules

This file states the doctrinal rules — the *why* — that govern every AI
agent action across all phases. Procedural details (how to enact the
rules) live in [`sdlc/WORKFLOW.md`](WORKFLOW.md) and the per-operation
files under [`sdlc/workflow/`](workflow/); this file is consulted to
resolve disputes about what a rule actually demands.

> **HARD-GATE (HG-DRIFT):** Do NOT change a doctrinal rule in this file
> without atomically checking that the procedural rule in
> `sdlc/WORKFLOW.md` or the relevant `sdlc/workflow/<op>.md` does not
> contradict it. Doctrinal–procedural drift is silent corruption.

<!-- 2026-06-10: phase-scoped practices and anti-patterns relocated to
their scoped workflow files; the one-line registry stubs below keep
by-name citations resolvable. Cross-phase doctrine stays here in full. -->

## When to Use

**Use when:** evaluating any cross-cutting practice, resolving a doctrine
question, determining whether a proposed approach violates the rule
set, or when CLAUDE.md or a workflow file references a named anti-pattern
here. Load on demand — not automatically with every session.

**Do NOT use when:** looking up coding conventions, stack choices, or
implementation constraints — those live in `docs/<component>/adrs/` or
`docs/shared/adrs/` and are injected via index lookup, not inline here.

**Vs. sibling files:** When a practice has a procedural dimension (how
to do it) alongside a doctrinal one (why it holds), the procedural
detail lives in [`sdlc/workflow/`](workflow/); this file carries only
the doctrinal *why*. The named anti-pattern set below is the
recognition surface; [`CLAUDE.md ## Hard rules`](../CLAUDE.md#hard-rules)
is the always-on summary.

---

## Core principles

- Leverage inherent model intelligence by omitting foundational explanations.

## Practices to keep

> Procedural details (retrieval, indexes-and-logs, derived reports,
> extending the workflow, legacy absorption) live in
> [`sdlc/WORKFLOW.md`](WORKFLOW.md). This file carries only practices
> that are doctrinal in nature — *why* something holds, in a phrase the
> rest of the docs cite by name.

- **Retrieval is the token lever.** Skill compaction helps at the
  margin; not re-deriving the KB each session is the 10× win. The
  procedural rules — exactly which nodes to read at Phase 2 / Phase 3
  (always canonical; status field signals in-flight), the ADR index
  posture — live in [`workflow/retrieval-discipline.md`](workflow/retrieval-discipline.md).
  This bullet is the *why* the anti-pattern below is an anti-pattern.
  The same logic governs subagent delegation: delegate work whose result
  is much smaller than its input. Audit a real run before assuming a
  dispatch pattern is cheaper — bulky prose returns erase the savings.
- **Mechanical work ≠ judgment work.** Subagents are reliable for:
  searching, listing, applying explicit string replacements, extracting
  structured data, classifying files by predicate. They are unreliable
  for: choosing names, designing APIs, judging quality, multi-step
  refactors with conditional logic. Test: would someone with no
  codebase knowledge but clear instructions complete this correctly?
  If not, keep it in the main session. (Engine-recommended — capability
  tiers vary across teams and tooling.)
- **If it can drift, the operation isn't atomic enough.** When the engine
  defines an "operation" (create, supersede, migrate, link), the operation
  must enumerate every artifact it touches — both directly and by
  reachability — and is incomplete until all of them are updated together.
  Half-completed operations are how stale references, legacy slugs, and
  one-sided `related:` links survive in the corpus. Concrete instances +
  procedural detail:
  [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md)
  and [`workflow/legacy-absorption.md`](workflow/legacy-absorption.md).

Phase-scoped practices — registry stubs; canonical detail in the scoped file:

- **QA hat is a moment, not a document** →
  [`workflow/test-plan-ingest.md § Traceability chain`](workflow/test-plan-ingest.md#traceability-chain)
- **The legacy KB is a quarry, not an authority** →
  [`workflow/legacy-absorption.md`](workflow/legacy-absorption.md)
  (file-level HARD-GATE + Per-op invariants)
- **Standalone component ID prefix convention** →
  [`LAYOUT.md § Component structure`](LAYOUT.md#component-structure-docs) +
  [`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md)

## Anti-patterns to refuse

Each full entry below names the failure mode and its correct
alternative. Phase-scoped entries are **registry stubs** — the name
survives here so by-name citations resolve; the canonical ❌/✅
narrative lives in the scoped workflow file. The shared framing —
*"this case is exceptional"* — is captured by
[`## Anti-Pattern: "Doctrinal Override by Convenience"`](#anti-pattern-doctrinal-override-by-convenience)
at the foot of this file.

Cross-phase (full doctrine here):

- **❌ Dispatching a judgment task to a subagent because the instructions look complete.** Unreliable output is the signal about task shape, not a prompt-quality problem.
  **✅ Reroute to the main session, or split into smaller mechanical units.**

- **❌ Assuming subagent delegation is cheaper without auditing.** Bulky prose returns and re-verification passes can erase the savings.
  **✅ Count the orchestrator's re-read cost.** Audit a real run before treating a dispatch pattern as a token win.

- **❌ Embedding structured metadata in prose, or narrative prose in frontmatter.** Crossing the line lets the two drift silently.
  **✅ IDs, statuses, links, and dates belong in YAML frontmatter; rationale, behavior, and explanation belong in the body.**

- **❌ Restating another node's field table, invariant, SQL block, or failure scenario inline.** "Reference, never copy" applies node-to-node just as it applies spec-to-node — a restatement is a drift surface, not a convenience.
  **✅ Replace the restatement with `NODE-ID §Section` plus a one-sentence context note.** Own your content, reference everything else. Procedural detail in [`WORKFLOW.md → Node content ownership`](WORKFLOW.md).

- **❌ Editing a canonical node outside an active Phase 3 merge of an approved FS.** Process violation; the canonical node would diverge from what an approved CHG says it should be.
  **✅ Record the intent in a CHG node first; apply the delta only at Phase 3 merge.** Do not edit the canonical target directly — including during brownfield research passes or Phase 2 absorption. CHG lifecycle mechanics: [`workflow/plan.md § 4`](workflow/plan.md#4-chg-node-consumption--enrichment) and [`workflow/in-flight-nodes.md`](workflow/in-flight-nodes.md).

- **❌ "The Helpful Continuation" — treating remembered context from a prior session as a substitute for loading the current flow file.** "Good context" from the previous session is not a signal to skip the reload; retained context drifts silently across phases.
  **✅ Run `/clear` at every flow boundary and reload the next flow file only.** Context that survives a phase boundary is a bug, not a feature.

Phase-scoped (registry stubs — canonical narrative in the scoped file):

- **"Too simple to need a spec"** →
  [`workflow/plan/anti-pattern.md`](workflow/plan/anti-pattern.md)
- **Asking multiple questions per turn during FRS / FS drafting** →
  [`workflow/design/phase1-authoring.md § Dialog discipline`](workflow/design/phase1-authoring.md#dialog-discipline-while-drafting)
  (FRS) + [`workflow/plan/fs-authoring.md § Section-by-section drafting`](workflow/plan/fs-authoring.md#section-by-section-drafting) (FS)
- **Listing three options where two are strawmen** →
  [`workflow/plan/fs-authoring.md § Generate before converging`](workflow/plan/fs-authoring.md#generate-before-converging)
- **Typing syntax in Phase 2 — "The Obvious Path"** →
  [`workflow/plan/anti-pattern.md`](workflow/plan/anti-pattern.md)
  (phase-birth schedule: [`CLAUDE.md` HR-PLAN](../CLAUDE.md#hard-rules) +
  [`workflow/plan.md`](workflow/plan.md) HARD-GATE)
- **Absorbing adjacent problems silently into a spec** →
  [`workflow/design/phase1-authoring.md § Dialog discipline`](workflow/design/phase1-authoring.md#dialog-discipline-while-drafting)
- **Drive-by refactors of code the FS doesn't require** →
  [`workflow/implementation.md § Common Mistakes`](workflow/implementation.md#common-mistakes)
- **Pre-loading the whole KB "to be safe"** →
  [`workflow/retrieval-discipline.md`](workflow/retrieval-discipline.md)
- **Wholesale-reading `docs/*/adrs/**` or globbing ADR pages directly** →
  [`workflow/retrieval-discipline.md`](workflow/retrieval-discipline.md)
  (ADR index posture)
- **Inlining a cross-cutting decision in an FS body** →
  [`workflow/plan/fs-authoring.md § Promote to ADR vs file a DEC vs keep inline`](workflow/plan/fs-authoring.md#promote-to-adr-vs-file-a-dec-vs-keep-inline)
- **Silent canonical edits — "The Lightweight Shortcut"** (also cited as
  "Silent node or ADR edits") →
  [`workflow/anti-pattern-lightweight.md`](workflow/anti-pattern-lightweight.md)
- **Coining a new node type when only one node would ever live under it —
  "The Motivated Invention"** →
  [`workflow/evolving-the-workflow.md`](workflow/evolving-the-workflow.md)
- **Hand-authoring or patching an overview or report file —
  "The Report Patch"** →
  [`workflow/derived-reports.md`](workflow/derived-reports.md)
- **Copying a legacy doc directly into canonical — "The Verbatim Import"** →
  [`workflow/legacy-absorption.md`](workflow/legacy-absorption.md)
- **Orphan `related:` entries** →
  [`workflow/bidirectional-link.md`](workflow/bidirectional-link.md)
  (the 2026-06-10 wiki-link carve-out governs the body-link direction:
  `related:` demands a body link; a display-only body citation demands
  nothing)

## Anti-Pattern: "Doctrinal Override by Convenience"

The framing that every entry in `## Anti-patterns to refuse` shares: a
moment where the rule is about to be suspended because the current case
feels exceptional, the shortcut feels efficient, or following the rule
feels like ceremony.

**Recognition signals — when any of these phrasings surface in
reasoning, slow down and reapply the canonical rule:**

- "Just this once" / "this case is different" / "this is the exception."
- "The full procedure feels heavy for what's needed here."
- "I already have the context — no need to reload / re-read / re-verify."
- "We can fix the index / log / CHG afterwards."
- "It's faster to just edit the canonical directly."

The doctrinal stance: the rule is doctrinal *because* exceptions felt
reasonable in the cases that produced it. Every override of a doctrinal
rule must be promoted to an ADR change first, never absorbed silently
in the act.

## Common Mistakes

These are misreadings of the rules, distinct from the failures listed
in `## Anti-patterns to refuse`. Each is a category of confusion about
what a rule is actually demanding.

- **Confusing "doctrinal" with "advisory."** Doctrinal rules are *more*
  binding than procedural ones, not less — they survive across phases,
  components, and tooling. Procedural details flex per task and tool;
  doctrinal rules do not.
- **Reading a `→ Procedural detail in <file>` pointer as a delegation
  that absolves this file.** The pointer routes you to *how* to enact
  the principle; the *why* still binds and resolves disputes. When the
  procedural file and this file disagree, this file wins — flag the
  drift and update the procedural file, do not silently invert.
- **Treating "Practices to keep" as separate from "Anti-patterns to
  refuse."** They are two framings of the same rule set — what to do
  vs. what not to do. Both are doctrinal; neither is optional.
- **Reading a registry stub as a demotion.** A stubbed practice or
  anti-pattern is no less doctrinal — the canonical narrative simply
  lives in the scoped workflow file that loads when the rule can fire.
  The stub keeps the name citable from anywhere.

## Integration

- **Relationship to CLAUDE.md:** [`CLAUDE.md ## Hard rules`](../CLAUDE.md#hard-rules)
  is the always-on summary — auto-loaded every session (named IDs:
  `HG-*` gates, `HR-*` rules). This file is the doctrinal expansion —
  load it when a rule's basis is in dispute, a named anti-pattern is
  being applied, or a workflow file references a rule by name.
- **Required after:** [`sdlc/WORKFLOW.md`](WORKFLOW.md) — once doctrine
  is in scope, WORKFLOW.md routes to the phase-specific procedural
  details and to the per-operation files under
  [`sdlc/workflow/`](workflow/).
- **Sibling reference:** [`sdlc/BOUNDARY.md`](BOUNDARY.md) — the
  engine-vs-project axis governs which doctrinal rules survive engine
  extraction and which are project-local.
- **Cited by name** (anti-patterns are referenced by name, not number,
  because the numbering shifts as the list grows): files in
  [`sdlc/workflow/`](workflow/) link back here when an operational rule
  needs its doctrinal anchor. Registry stubs above keep every historical
  name resolvable even after relocation.
