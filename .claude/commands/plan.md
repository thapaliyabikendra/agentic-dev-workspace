---
description: Plan a large work item — author a multi-phase plan, track it with TaskCreate todos, gate it, then drive execution via background/foreground subagents with per-phase progress updates.
argument-hint: [work item to plan]
---

Plan and drive a large work item. Author a multi-phase plan, mirror it into the todo tool (TaskCreate), execute todo items via background and foreground subagents where feasible — parallel where independent, to avoid polluting or consuming the main agent's context — and update progress after each phase completes.

**Work item:** $ARGUMENTS
(If empty, ask what to plan before proceeding.)

> **Canonical doctrine:** `sdlc/workflow/planning-conventions.md` (plan structure + Karpathy gate) and `sdlc/workflow/agent-contracts.md` (TaskCreate discipline + dispatch shapes). For a non-trivial plan, load `planning-conventions.md` first — it is the relevant flow file (CLAUDE.md HARD-GATE: load the flow file before the phase). The rules below distill them; if they diverge, the canonical files win — reconcile, don't fork.

---

## 1 — Right-size first

Multi-phase is the default for large items. Collapse to a single pass **only** if the task is one-shot and reversible (typo, rename, single-file edit). If unsure, multi-phase.

## 2 — Author the plan (multi-phase)

Each phase carries:
- **Goal** — one sentence; the observable outcome.
- **Sub-agents** — `N × <Explore|Plan|general-purpose>`, parallel | sequential, with each one's focus. `none` = main thread.
- **Steps** — checkboxed `[ ]`, one line each.
- **Done signal** — observable predicate ("file exists at X", "command exits 0", "link A→B resolves").

Number phases contiguously; the last is usually **Verification**. Lead with the recommended approach. State **success criteria** (observable, up front), a **Reversibility** note (two-way vs one-way doors; name irreversible parts), and **Out of scope** (adjacent issues + where they route). Surface 2–3 alternatives only for non-routine decisions.

## 3 — Mirror into the todo tool

Create one TaskCreate task per phase outcome (or per major step). Discipline (`agent-contracts.md § TaskCreate`):
- One task = one outcome — no bundled "do A and B".
- Exactly one task `in_progress` at a time; set on start, flip to `completed` on finish.
- Skip the tracker only for genuinely single-step work.

## 4 — Gate before executing (HARD-GATE)

Before running a large plan, clear the **Karpathy gate** (`planning-conventions.md § Karpathy gate`): scorecard ≥ PARTIAL on all seven principles and STRONG on 1 / 3 / 5 / 6 / 7; reversibility surfaced; success criteria observable and stated up front; out-of-scope listed. Present the plan and get the user's nod — do not auto-execute large or irreversible work. (PRINCIPLES.md anti-pattern: "The Helpful Continuation".)

## 5 — Execute, phase by phase

Run under the same orchestrator contract as `/execute-plan` (distilled in `planning-conventions.md § Execution invocation` + `agent-contracts.md`):
- **Dispatch todo items to subagents** where feasible — **background** for write-only work that does not gate the next step; **foreground** for work whose result feeds a decision.
- **Parallel** independent items in one message; **max 3 per round**; batch larger fan-outs by phase.
- **Context protection** — sub-agent returns ≤ 400 words; never wholesale-read large files / diffs / outputs into the main turn.
- **Don't dispatch** for trivial one-file reads, work needing mid-run clarification, or when the main thread already holds the context.

## 6 — Update progress after each phase

When a phase's done-signal is green:
1. **Verify** any write-capable output (diff / grep / canary re-read) — do not trust the return message alone.
2. Mark the phase's steps `[x]` and flip its TaskCreate task to `completed`.
3. Briefly report the phase outcome to the user, then start the next phase's task.

> **Durability:** TaskCreate is session-scoped — it does not survive `/clear`. For multi-session work, persist the plan (a `.claude/plans/*.md` file) or emit `/handoff` so the next session can resume.
