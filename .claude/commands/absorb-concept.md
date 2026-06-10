---
description: Absorb a concept — absorb-concept.md. Routes an insight surfaced during report synthesis (or a synthesized docs/research/ entry) into the canonical KB via a RESEARCH staging node, then promotes reviewed implications to canonical DDD nodes. Sibling of /absorb-docs (legacy documents) and /derived-report.
argument-hint: [the concept to capture, or a RESEARCH-NNN ID whose implications are ready to promote]
---

Capture a genuinely new domain concept as a `RESEARCH-NNN` staging node and promote its reviewed canonical implications to DDD nodes. The RESEARCH node is **always** the first landing — never a direct canonical-node write; its `## Canonical implications` table is the promotion bridge.

**Concept / RESEARCH ID:** $ARGUMENTS
(If empty, ask what surfaced and during which report-synthesis or research-review pass.)

> **Canonical flow:** load `sdlc/workflow/absorb-concept.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at operation entry.
> `sdlc/workflow/maintenance-discipline.md` governs the touches fired.
> This command sets scope and names the contract; the flow file governs.
> If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

**Check the per-type `index.md` first** — if a canonical node already covers the concept, this command is the wrong tool (duplicate nodes are worse than uncaptured concepts; route to `maintenance-discipline.md` to update the existing node). Also wrong tool for: glossary terms / CCC baselines (`baseline-references.md`), cross-cutting architectural decisions (`/author-adr`), and legacy documents (`/absorb-docs`).

## Phase & boundaries

Maintenance operation, not a phase — fires from inside a report-regeneration session or standalone when a wiki knowledge gap becomes apparent. No `/clear` boundary.

## Produces

`docs/research/RESEARCH-NNN-<slug>.md` at `status: raw` (3-file touch: file + `research/index.md` + `research/log.md`; lazy-create the tree on first use) with Abstract, Key findings, Gaps-and-conflicts, and a Canonical-implications table naming a target artifact per row; on promotion: canonical nodes via the standard 2-file (+N `related:`) touch, RESEARCH status advancing `raw → synthesized` (→ `superseded` when fully landed); `OQ-NNN` with `origin: synthesis` for type-ambiguous implications.

## On completion

Report the RESEARCH-NNN created or advanced, every canonical artifact promoted (ID + type), every implication still `proposed`, and any OQs raised. Suggest regenerating the affected derived report (`/derived-report`) once promotions land.

**Commit discipline (rule 11):** never `git commit` without explicit user authorization, per commit.
