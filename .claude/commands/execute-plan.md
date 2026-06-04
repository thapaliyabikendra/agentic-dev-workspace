---
description: Execute a plan as a pure orchestrator — delegate file I/O to background/foreground subagents, protect main-thread context, hand off cleanly near the context limit.
argument-hint: [plan-file-path]
---

Execute the plan as a **pure orchestrator**. Use background and foreground subagents where feasible and appropriate for parallel work — both to parallelise and to avoid polluting or consuming the main agent's context. If you approach the end of your context window, generate a handoff prompt (see § Handoff trigger).

**Plan to execute:** $ARGUMENTS
(If empty, use the plan already in context, or ask which plan file before starting.)

> **Canonical contract:** `sdlc/workflow/planning-conventions.md § Execution invocation` + `sdlc/workflow/agent-contracts.md`. The distilled rules below mirror them for context economy — do not re-read those files into this turn. If the two diverge, the canonical files win; reconcile, don't fork.

---

## Orchestrator posture

**Role:** route, sequence, and verify only. Do NOT perform substantive reads or writes on the main thread — delegate all file I/O, code generation, and doc scans to sub-agents.

**Context protection:** never wholesale-read large files, diffs, or generated outputs into this session. Every sub-agent summarises its return to ≤ 400 words; full content stays inside the sub-agent's context window.

---

## Dispatch rules

| Task shape | Agent type | Mode |
|---|---|---|
| Targeted read — single known file/pattern | `Explore` | foreground |
| Multi-file audit, independent per file | `Explore` × N (≤ 3/round) | foreground, parallel |
| Design / second opinion on an approach | `Plan` | foreground |
| Open-ended research or multi-pass scan | `general-purpose` | foreground |
| Write-only work that does not gate the next step | `general-purpose` | **background** |

**Parallelism:** dispatch independent agents in one message (one tool-use block). Max 3 per round; batch larger fan-outs by phase — fire round 2 only after synthesising round 1.

**Don't dispatch** for trivial one-file reads, tasks needing mid-run user clarification, or prose authoring (FRS / FS / OQ) — keep those on the main thread.

---

## Sub-agent return shape

Every dispatched sub-agent must return exactly:

```
## Findings
- <severity>: <finding> (file:line)

## Risks
- <severity>: <risk>

## Open questions
- <question> (raise as OQ-NNN if blocking)
```

Write-capable agents additionally return:

```
## Files written
- <path> — <one-line description>
```

---

## Outcome routing

| Handle | Condition | Action |
|---|---|---|
| `DONE` | No findings, risks, or OQs | Advance to next step |
| `DONE_WITH_CONCERNS` | Risks or low-severity findings | Log; proceed; flag at phase exit |
| `NEEDS_CONTEXT` | Agent lacked required files or scope | Re-dispatch with corrected scope |
| `BLOCKED` | Blocking finding or blocking OQ raised | Stop; surface to user; raise OQ-NNN |

`BLOCKED` is the only handle that halts the phase. `DONE_WITH_CONCERNS` accumulates to the exit summary — it does not stop progress.

---

## Mutation verification

After any write-capable dispatch: confirm via diff, grep, or canary file re-read before marking the step done. Do not trust the return message alone — sub-agents reliably report success on edits they partially applied.

On wrong or empty result: re-dispatch to a stronger model or split the task into smaller units. Do not retry the identical dispatch blindly.

---

## Progress and task tracking

- Mark each plan step `[x]` immediately after verifying the sub-agent's output — this is the durable state that survives `/clear`.
- TaskCreate: one task = one outcome; only one `in_progress` at a time; flip to `completed` immediately on finish; skip for single-step work.

---

## Handoff trigger

If the context window is approaching its limit before the plan is complete, emit a session handover per `CLAUDE.md § Session handover` — one fenced code block, five fields (Task / Progress / Next step / Re-load first / Open threads), no prose around it — as your final output, then stop. This is the same artifact the `/handoff` command produces; keep them identical.
