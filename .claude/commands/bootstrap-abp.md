---
description: Bootstrap an ABP api/ solution — abp-project-bootstrap.md. Detection banner (SCAFFOLD_NEEDED / CONFIGURE_ONLY / NO_OP / ANOMALY), toolchain preflight, gated `abp new` scaffold, then baseline hardening + opt-in feature packs on HttpApi.Host and AuthServer. Operator-invoked, runtime surface only. Binds only when stack=api, framework=abp-net.
argument-hint: [solution name — plus opt-in feature packs if known]
---

Bring up (or harden) an ABP `api/` solution. Runs detection first — the banner decides the path: `SCAFFOLD_NEEDED` (full run), `CONFIGURE_ONLY` (skip scaffold, jump to hardening), `NO_OP` (verify checklist, exit), `ANOMALY` (stop and surface; manual remediation before this op can continue). Then toolchain preflight (dotnet ≥ 9, abp CLI ≥ 8, node ≥ 20 — hard-fail on miss, never install inline), the gated scaffold, and the Program.cs / module-hardening / feature-pack / appsettings steps the flow file owns.

**Solution (+ packs):** $ARGUMENTS
(If empty, ask for the solution name before starting; feature-pack selection can be decided at the pack step.)

> **Canonical flow:** load `sdlc/workflow/abp-project-bootstrap.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Binds only when the target is ABP/.NET (`applies_when: { stack: [api], framework: [abp-net] }`) — stop and report on any other stack. Do NOT use for adding business features to an already-hardened project, or for ABP/.NET version upgrades (out of this op's scope).

**HARD-GATE (restate — workflow-local, defense-in-depth):**
1. **No auto-`abp new`.** Print the exact scaffold command in a fenced block and wait for explicit operator authorization — per invocation, no carry-forward (the scaffold is irreversible without `git clean`; it predates the commit gate in the lifecycle, so it carries its own gate).
2. **No split-pack apply.** Paired packs ship together or neither ships (Pack C ↔ Pack G — Concurrent-Login host half + auth half); splitting produces silent 401 storms that mask the root cause.

## Phase & boundaries

Standalone operator workflow — independent of the dev-track and QA-track flows, and of `/new-component` (that declares the docs-side planning surface; this builds the runtime surface — both may apply to one project, neither requires the other). Post-scaffold sanity must pass before hardening (`.slnx` + both host projects exist, `dotnet build` exits 0); never paper over scaffold errors with manual edits.

## Produces

`api/<Name>.slnx` + `api/src/<Name>.HttpApi.Host/` + `api/src/<Name>.AuthServer/` (scaffold path); Program.cs delta, both modules' baseline hardening, the selected opt-in feature packs, full `appsettings.json` schema (all paths). The flow file owns the step detail and the end-of-file verification checklist.

## On completion

Walk the flow file's verification checklist and report the banner path taken, packs applied (named pairs intact), and any gaps surfaced.

**Commit discipline (rule 11):** never `git commit` without explicit user authorization, per commit.
