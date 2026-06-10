---
name: prototype-eval-rubric
description: "Advisory evaluation rubric for generated/iterated UI prototypes — scored dimensions, severity tiers with consequence classes, 5-field finding shape, dated report procedure, confidence disclosure. Load when judging prototype quality against KB intent."
applies_when:
  stack: [ui]
---

# Prototype Evaluation Rubric

> **Type:** Rule book — wholesale-read when an evaluation pass fires.
> Judges a prototype's *quality* against KB intent; complements
> [`lint.md § prototype-drift`](lint.md#prototype-drift) (structural
> drift detection) and
> [`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md)
> (mining). Lint asks "do the joins resolve?"; this rubric asks "is the
> prototype good?". **Advisory, not gating** — the PROTO `draft →
> adopted` flip does not require an eval report; see Anti-Pattern below.

## When to Use

**Use when:** a generation pass completed
([`prototype-generation.md` Sub-flow A or B](prototype-generation.md)),
a BA review round wants a structured quality read before iterating, or a
[`review.md`](review.md) pass scopes prototype screens.

**Do NOT use when:** the question is structural KB↔prototype drift
(that is [`lint.md § prototype-drift`](lint.md#prototype-drift) /
`kb:trace`), or the prototype is being *mined* for FRSs
([`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md)),
or code conformance is the question ([`qa-gate.md`](qa-gate.md) — that
gate fires on implemented code, not mock prototypes).

## Scoring dimensions

Six dimensions, each scored /10 with a one-line rationale. Each
dimension's rule source is its canonical home — cite it, never restate.
Scoring guide (reproducibility anchor, enables trend-tracking across
runs): 9–10 excellent, minor polish · 7–8 solid, some gaps · 5–6
functional, notable issues · 3–4 significant problems · 0–2 broken or
absent.

| # | Dimension | What it measures | Rule source |
|---|---|---|---|
| 1 | KB alignment | Screens realize SCR Description / Layout intent; journeys realize FLW scenarios | SCR / FLW node bodies |
| 2 | Journey completeness | Every scenario reachable end-to-end; all four display states rendered per screen | [`../_templates/UI-REPO-CONTRACT.md § Mock-mode conventions`](../_templates/UI-REPO-CONTRACT.md#mock-mode-conventions) |
| 3 | Component-catalog conformance | Same visual role → same catalog component, never a reinvented variant | [`../_templates/UI-REPO-CONTRACT.md § Component catalog`](../_templates/UI-REPO-CONTRACT.md#component-catalog) |
| 4 | Fixture discipline | Per-entity fixtures; no cross-screen data contradiction; no inline mock data | [`../_templates/UI-REPO-CONTRACT.md § Shared entity fixtures`](../_templates/UI-REPO-CONTRACT.md#shared-entity-fixtures) |
| 5 | Design-token conformance | Semantic tokens only; no hard-coded literal values | project copy of [`../_templates/UI-GUIDELINES.md`](../_templates/UI-GUIDELINES.md) |
| 6 | Anti-regression compliance | Scoped change respected; overwrite guard honored; out-of-scope screens untouched | [`prototype-generation.md § Anti-regression doctrine`](prototype-generation.md#anti-regression-doctrine) |

> **Your project:** concrete tech-specific sub-bullets per dimension
> (framework idioms, accessibility baselines, named token files) live in
> a project-owned rubric extension recorded as a project ADR — this
> engine file stays stack-shape only.

## Severity tiers

Defined by **consequence class**, not by feel:

| Tier | Consequence class | Routing |
|---|---|---|
| CRITICAL | Broken journey, cross-screen data contradiction, silent canonical overwrite, data-classification leak (restricted data on an audience surface it must never reach) | Fix before the prototype is shown to stakeholders |
| HIGH | Missing display state, missing catalog row, scenario unreachable | Fix before the next BA review round |
| MEDIUM | Design-system drift, fixture shape mismatch | Route to [`lint.md § prototype-drift`](lint.md#prototype-drift) / next scoped pass |
| LOW | Cosmetic | Note; batch opportunistically |

**Anti-inflation guard.** Reserve CRITICAL for genuine breakage, data,
or classification issues — do not inflate cosmetic findings. Documented
intentional divergences (KB-recorded decisions, `[inferred from
prototype]`-tagged behavior per
[`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md))
are **correct, not findings**.

## Finding shape

Five mandatory fields per finding — *a finding without a file or
screen-ID reference is not a valid finding*:

```
[SEVERITY] Dimension · Short title
  Location:  <file path or screen ID> (+ route if relevant)
  Problem:   What is wrong, observed in the prototype/code.
  Impact:    Why it matters (consequence class).
  Fix:       Concrete suggested change.
```

Each finding also carries a confidence mark: `code-verified` (evaluator
opened the running prototype or traced the source) or `kb-inferred`
(judged from node prose only — weaker; say so).

## Procedure

1. Read the PROTO descriptor (`docs/prototypes/<slug>/PROTO-<slug>.md`)
   and the in-scope SCR / FLW node bodies
   ([`retrieval-discipline.md`](retrieval-discipline.md): index-first).
2. Read this rubric + the project rubric-extension ADR + the project's
   UI-GUIDELINES copy.
3. Traverse the in-scope screens — open files, follow navigation, check
   display states. Evidence per finding is mandatory.
4. Score the six dimensions; collect findings in the shape above,
   grouped by severity.
5. Emit the report at `docs/prototypes/<slug>/eval-YYYY-MM-DD.md`:
   scorecard table → findings by severity → top-priorities table with a
   "why first" column (effort-vs-risk reasoning stated, so the ranking
   is contestable).
6. If a previous eval exists, diff the scorecards and state the deltas.

**Assessment only.** The evaluation never modifies prototype code — it
produces the report; fixes route per the severity table.

**Report immutability.** Historical eval reports are never edited. When
later context invalidates a finding (format migration, superseding
decision), append a dated note to the affected report; the original
stands as an accurate snapshot.

## Anti-Pattern: "The Eval Gate"

Refusing the PROTO `draft → adopted` flip (or a BA iteration round)
until an eval scores clean. The flip's gate is the consuming FRS
reaching `approved` at Phase 1.5
([`prototype-generation.md § Phase position`](prototype-generation.md#phase-position--the-two-pass-identity)) —
that gate already checks KB alignment where it matters. The eval is a
quality instrument: it informs iteration, it does not block the
pipeline. Same posture as [`lint.md`](lint.md)'s "The Lint Gate"
anti-pattern.

## Integration

- **Callers:** [`prototype-generation.md`](prototype-generation.md)
  (advisory check after Sub-flow A / B); [`review.md`](review.md) (when
  the scoped corpus includes prototype screens); operator on demand.
- **Reads:** PROTO descriptor + Stakeholder iteration log; SCR / FLW
  bodies; [`../_templates/UI-REPO-CONTRACT.md`](../_templates/UI-REPO-CONTRACT.md);
  project UI-GUIDELINES copy.
- **Routes findings to:** severity table above —
  [`lint.md § prototype-drift`](lint.md#prototype-drift) (structural),
  `OQ-NNN` (KB-alignment gaps needing judgment), Sub-flow B (scoped
  regeneration).
- **Emits:** `docs/prototypes/<slug>/eval-YYYY-MM-DD.md` (dated,
  immutable; one per run).
- **Sibling rule books:**
  [`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md),
  [`lint.md`](lint.md), [`review.md`](review.md).
