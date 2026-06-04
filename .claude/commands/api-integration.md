---
description: Wire a ui/ prototype page/domain from mock data to the real api/ backend — declare @endpoint/@permission/@implements slots, add apiFetch callers + mock handlers, gate permissions UI<->backend, then extract CON/SCR/PERM/FRS nodes to the planning KB.
argument-hint: [page or domain to wire — e.g. "BG review" or "/bank/bg/:id"]
---

Wire a prototype page or domain from mock data to the real backend. This command is cross-repo: it operates mainly on the `ui/` subdir (its own git repo, nested under the working dir) and `api/` (ABP backend); KB-node extraction lands in `planning/`. Canonical pointers therefore live in `ui/docs/` and `ui/.claude/`, not under `sdlc/` — load those first.

**Page / domain to wire:** $ARGUMENTS
(If empty, ask which page or domain before starting — this command is page-by-page.)

> **Canonical flow:** load `ui/docs/PROTOTYPE-API-INTEGRATION.md` in full before starting,
> together with `ui/CLAUDE.md` and `ui/.claude/rules/kb-context.md`. Those files govern
> the wiring protocol, file locations, and KB-extraction contract. `sdlc/workflow/frs-prototype-extraction-rules.md`
> governs FRS extraction from prototype. ADR-035 governs `code_ref:` on SCR nodes;
> ADR-036 governs permission-string source of truth. If this command and those files
> diverge, the canonical files win — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Verify the target page/domain is identified and the prototype screen exists before starting. This command is standalone and cross-repo — no preceding `/clear` is prescribed by this flow, but enter with a clean scope. Page-by-page: do not batch unrelated domains in a single run.

**The one rule (restate for defense-in-depth):** app code always calls `apiFetch('/api/...')`; never call `fetch` directly; never branch mock-vs-real in a component. The flow file owns the enforcement details and exceptions.

## Phase & boundaries

Cross-repo / standalone — not bound to a numbered SDLC phase. Runs any time after a prototype screen exists; feeds KB nodes back into `planning/` as CON/SCR/PERM nodes and (via `frs-prototype-extraction-rules.md`) into FRS extraction.

High-level steps (detail owned by `ui/docs/PROTOTYPE-API-INTEGRATION.md`):

1. **Declare the contract slot** — docblock `@endpoint`, `@permission`, `@implements` (or `@exploration` for net-new screens).
2. **Add the endpoint** — DTO types, real caller, mock handler, api-factory wiring.
3. **Gate permissions** — permission catalog, `<PermissionGuard>`, endpoint-permissions map; byte-identical string in the ABP backend (ADR-036).
4. **Extract KB nodes** — each `@endpoint` → CON node (`protocol: http`); screen → SCR node (`code_ref:` per ADR-035); behavior → FRS via `EXP-<slug>` with `[inferred from prototype]` tags (`frs-prototype-extraction-rules.md`).
5. **Verify** — `bun run kb:trace` (0 broken/dangling) + coverage tests.

## Produces

Per page: `@endpoint`/`@permission`/`@implements` docblock slots declared; real caller + mock handler registered; permission guard wired UI and backend; CON-NNN, SCR-NNN, PERM-NNN nodes in `planning/`; FRS extraction queued via `EXP-<slug>`.

## On completion

See `ui/docs/PROTOTYPE-API-INTEGRATION.md` for the page-level exit checklist. Run `bun run kb:trace` to confirm zero broken or dangling refs before declaring a page done.

**Catalog-dark caveat:** catalog-dark routes cannot be route-guarded until their permissions are minted (per CCC-002 / backend and ADR-036 follow-up). Do not block on this — note the gap and proceed; the follow-up is a separate pass.

**Commit discipline:** commits to `ui/` need explicit user authorization, per commit (rule 11). Authorization for one commit does not carry forward to the next.
