# PRINCIPLES.md — Doctrinal Rules

This file states the doctrinal rules — the *why* — that govern every AI
agent action across all phases. Procedural details (how to enact the
rules) live in [`sdlc/WORKFLOW.md`](WORKFLOW.md) and the per-operation
files under [`sdlc/workflow/`](workflow/); this file is consulted to
resolve disputes about what a rule actually demands.

> **HARD-GATE:** Do NOT change a doctrinal rule in this file without
> atomically checking that the procedural rule in `sdlc/WORKFLOW.md` or
> the relevant `sdlc/workflow/<op>.md` does not contradict it.
> Doctrinal–procedural drift is silent corruption.

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

- **QA hat is a moment, not a document.** The Flow node's three scenarios
  (happy / edge / fault) *are* the test plan. The FRS's "Test plan view"
  section is a view onto them, not a parallel artifact. Drafting a separate
  test plan creates a sibling that drifts.
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
- **The legacy KB is a quarry, not an authority.** When absorbing a
  `docs-backup/` artifact, the canonical wiki + ADRs are the
  destination — legacy text is source material. Surface conflicts in
  the absorbing FRS or as an `OQ-NNN` under
  `docs/discovery/open-questions/` with `origin: legacy-absorption`;
  never carry legacy assertions into canonical silently. ID collisions
  resolve upward. Procedural detail in
  [`sdlc/WORKFLOW.md → Legacy absorption`](WORKFLOW.md) and
  [`sdlc/workflow/legacy-absorption.md`](workflow/legacy-absorption.md).
- **Standalone component ID prefix convention.** Component ID prefixes are
  globally unique across the workspace — no two components share one. This
  prevents cross-component ID collisions and makes any node ID self-locating.
  Procedural detail in
  [`LAYOUT.md § Component structure`](LAYOUT.md#component-structure-docs)
  and [`workflow/new-component-bootstrap.md`](workflow/new-component-bootstrap.md).
- **If it can drift, the operation isn't atomic enough.** When the engine
  defines an "operation" (create, supersede, migrate, link), the operation
  must enumerate every artifact it touches — both directly and by
  reachability — and is incomplete until all of them are updated together.
  Half-completed operations are how stale references, legacy slugs, and
  one-sided `related:` links survive in the corpus. Concrete instances:
  the tiered touch on a node lifecycle event is (3 + N) where N is
  the count of `related:` targets that need reciprocal back-link updates;
  a brownfield-schema renormalization is incomplete until pointed-at nodes
  carry the new IDs; a DEC's `related:` expansion re-fires the
  ADR-vs-DEC discriminator. Procedural detail in
  [`sdlc/workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md)
  and [`sdlc/workflow/legacy-absorption.md`](workflow/legacy-absorption.md).

## Anti-patterns to refuse

Each pair below names the failure mode and its correct alternative. The
shared framing — *"this case is exceptional"* — is captured by
[`## Anti-Pattern: "Doctrinal Override by Convenience"`](#anti-pattern-doctrinal-override-by-convenience)
at the foot of this file.

- **❌ "Too simple to need a spec."** Skipping the FS because the work feels small.
  **✅ Write the short FS anyway.** Simple work is where unexamined assumptions cause the most wasted effort.

- **❌ Asking multiple questions per turn during FRS / FS drafting.** Depth drops; threads get lost.
  **✅ One question per message.**

- **❌ Listing three options where two are strawmen.** That's one option dressed up.
  **✅ Either write real trade-offs for each alternative, or omit the section.**

- **❌ Typing method bodies, brace bodies, SQL, or YAML in Phase 2 because the path looks "obvious."** Plans contain no syntax — you're over the line into Phase 3.
  **✅ Phase 2 names structures; Phase 3 writes them.** Finish the FS, ingest its new nodes (with `status: proposed`) and any CHG, then context-reset before code lands.

- **❌ Absorbing adjacent problems silently into a spec.** Hidden scope expansion drifts the spec from what was agreed.
  **✅ Raise an `OQ-NNN`** under `docs/discovery/open-questions/` with the appropriate `origin:` (typically `frs-authoring` or `fs-authoring`), or surface under the FRS's "Brownfield impact". Let the user decide what's in scope.

- **❌ Drive-by refactors of code the FS doesn't require.** Slip outside the slice and the change-set drifts from the spec.
  **✅ Stay in the slice.** Improve adjacent code only when it directly serves the goal.

- **❌ Pre-loading the whole KB "to be safe."** If the FRS doesn't declare a node touched, you don't read it in Phase 2 (Ingest) or Phase 3 (Merge + Code).
  **✅ Read narrowly.** If a node turns out to be necessary mid-draft, stop and update the FRS — don't silently broaden the load. The Phase 0 change-request scan is the one exception.

- **❌ Dispatching a judgment task to a subagent because the instructions look complete.** Unreliable output is the signal about task shape, not a prompt-quality problem.
  **✅ Reroute to the main session, or split into smaller mechanical units.**

- **❌ Assuming subagent delegation is cheaper without auditing.** Bulky prose returns and re-verification passes can erase the savings.
  **✅ Count the orchestrator's re-read cost.** Audit a real run before treating a dispatch pattern as a token win.

- **❌ Wholesale-reading `docs/*/adrs/**` or globbing ADR pages directly.** Defeats the index's purpose.
  **✅ Read `docs/<component>/adrs/index.md` first**, pick relevant IDs, then narrow-load.

- **❌ Inlining a cross-cutting decision in an FS body.** If it constrains future nodes we haven't met yet, it's an ADR.
  **✅ Promote the decision to an ADR and reduce the FS prose to a reference.**

- **❌ Embedding structured metadata in prose, or narrative prose in frontmatter.** Crossing the line lets the two drift silently.
  **✅ IDs, statuses, links, and dates belong in YAML frontmatter; rationale, behavior, and explanation belong in the body.**

- **❌ Silent node or ADR edits — no `index.md` re-sync (nodes) or no `adrs/log.md` entry (ADR lifecycle events).** Indexes are a source of truth only as long as nothing slips past them.
  **✅ For nodes: run the 2-file touch atomically (node + per-type `index.md`). For ADR lifecycle events: run the 3-file touch (ADR + `adrs/index.md` + `adrs/log.md`).** If you can't re-sync the index (or write the log entry for an ADR event), the edit isn't ready. See [`workflow/maintenance-discipline.md`](workflow/maintenance-discipline.md).

- **❌ Coining a new node type when only one node would ever live under it.** Fragments the index without buying retrieval clarity.
  **✅ Extend an existing type, or capture the content as an ADR (cross-cutting) or DEC (node-scoped).** Apply the ADR-vs-DEC discriminator and the type-extension discriminator together. See [`WORKFLOW.md → Evolving the workflow → Defining a new node type`](WORKFLOW.md).

- **❌ Hand-authoring or patching an overview or report file.** Turns a build artifact into a silent fork.
  **✅ Fill the wiki first, then regenerate.** If you can't derive the report from the wiki, the wiki is the gap — not the report.

- **❌ Copying `docs-backup/<file>.md` (or any legacy doc) directly into `docs/<topic>.md` or `docs/architecture.md`.** Bypasses the node + ADR + glossary discipline.
  **✅ Route through nodes + ADRs + glossary first; the derived report under `reports/` comes after.** The legacy original stays in `docs-backup/` as audit trail.

- **❌ Restating another node's field table, invariant, SQL block, or failure scenario inline.** "Reference, never copy" applies node-to-node just as it applies spec-to-node — a restatement is a drift surface, not a convenience.
  **✅ Replace the restatement with `NODE-ID §Section` plus a one-sentence context note.** Own your content, reference everything else. Procedural detail in [`WORKFLOW.md → Node content ownership`](WORKFLOW.md).

- **❌ A `related:` entry with no body link, or a body link with no `related:` entry.** Orphan pointers and undeclared dependencies — both are maintenance failures.
  **✅ Every `related:` ID appears as a navigable link in the body prose** (e.g., `see INT-046 §Blast radius`), and every body reference to another node appears in `related:`. They are two surfaces of the same fact.

- **❌ Editing a canonical node outside an active Phase 3 merge of an approved FS.** Process violation; the canonical node would diverge from what an approved CHG says it should be.
  **✅ Record the intent in a CHG node first** (under the active milestone's `specs/FS-NNN.../nodes/changes/`, `status: draft`). Apply the delta to the canonical target only at Phase 3 merge. Do not edit the canonical target directly — including during brownfield research passes or Phase 2 absorption.

- **❌ "The Helpful Continuation" — treating remembered context from a prior session as a substitute for loading the current flow file.** "Good context" from the previous session is not a signal to skip the reload; retained context drifts silently across phases.
  **✅ Run `/clear` at every flow boundary and reload the next flow file only.** Context that survives a phase boundary is a bug, not a feature.

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

## Integration

- **Relationship to CLAUDE.md:** [`CLAUDE.md ## Hard rules`](../CLAUDE.md#hard-rules)
  is the always-on summary — auto-loaded every session. This file is the
  doctrinal expansion — load it when a rule's basis is in dispute, a named
  anti-pattern is being applied, or a workflow file references a rule by name.
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
  needs its doctrinal anchor.
