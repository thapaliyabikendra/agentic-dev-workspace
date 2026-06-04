---
description: Absorb an existing codebase into the canonical KB — ADR / CCC / DDD nodes / glossary at status:active, NO FRS or feature spec. Reads code as the prior-project artifact, routes structure to canonical, surfaces every code-inferred intent as an OQ.
argument-hint: [path or module/area scope to absorb]
---

Absorb the codebase at the given scope into the **canonical wiki** —
DDD nodes, ADRs, CCCs, glossary terms — and nothing else. This command
does **not** author FRSs or feature specs; live source is treated as the
prior-project artifact being made canonical, exactly as
`legacy-absorption.md` treats a `docs-backup/` document.

**Scope to absorb:** $ARGUMENTS
(If empty, ask for the path or module/area scope before starting — never
fan out across a whole repo unscoped.)

> **Canonical procedure:** [`sdlc/workflow/legacy-absorption.md`](../../sdlc/workflow/legacy-absorption.md)
> is the authority for everything below — routing, the brownfield
> conflict gate, `status: active`, the 2-file touch, ID reservation, and
> OQ surfacing. [`sdlc/workflow/frs-code-extraction-rules.md`](../../sdlc/workflow/frs-code-extraction-rules.md)
> is the **reading lens only** — its signal table, translation
> discipline, logical source names, and one-hop traversal tell you how to
> read code; its FRS *targets are overridden* by the canonical targets
> below. The distilled rules here mirror those files for context economy —
> do not re-read them wholesale into this turn. If they diverge, the
> canonical files win; reconcile, don't fork.

---

## What changes vs. the FRS code path

`frs-code-extraction-rules.md` reads code into an FRS, tags inferred
intent `[inferred from code]`, and lets the Phase 1.5 gate carry it.
There is **no FRS here**, so:

- **Targets are canonical, direct.** Absorb to nodes / ADRs / CCCs /
  glossary at `status: active` (per legacy-absorption's "absorbed nodes
  go straight to `status: active`" invariant — existing reality, not
  design intent awaiting implementation). No `proposed` stage.
- **Code-inferred intent surfaces as an OQ, not a tag.** Every
  business rule, edge path, fault path, actor, or precondition you infer
  from code *alone* (no prose to confirm it) → raise `OQ-NNN` under
  [`docs/discovery/open-questions/`](../../docs/discovery/open-questions/)
  with `origin: legacy-absorption, origin_ref: <logical name>`. Surface,
  never absorb silently — there is no Phase 1.5 gate to catch it later.
- **The feature-tracker → FRS row is dropped.** It is the only
  FRS-producing row in legacy-absorption's signal-to-target map, and it
  is out of scope for this command. If the scope is genuinely a feature
  tracker / roadmap rather than code, this is the wrong command.

---

## Signal → canonical target

Read each source with the `frs-code-extraction-rules.md` signal table,
then route **structure** to these canonical targets (the
legacy-absorption map, FRS row removed):

| Signal in code | Lands in (canonical, `status: active`) |
|---|---|
| Module / bounded context (route groups, project/folder topology) | MOD node (+ glossary term) |
| Write operation (`[HttpPost]`, command handler, mutation) | CMD node |
| Read operation (query handler, projection, list/get endpoint) | QRY node |
| Domain entity / aggregate / DTO schema | ENT node (translate types → business language) |
| Lifecycle with ≥3 states or ≥2 transitions | STA node (else inline on ENT — KB-LAYOUT discriminator) |
| HTTP route / event topic / queue / gRPC method | CON node (discriminated by `protocol:`) |
| UI surface / page / view | SCR node (`code_ref:` → realizing file, ADR-035) |
| Outbound seam to an external system (`IEmailSender`, payment SDK, object store, …) | INT node |
| Distributed event publish (Kafka / RabbitMQ) | EVT node + `linked_contract: CON-NNN` |
| Role / permission guard (`hasRole`, `[Authorize]`, `Can`) | ACT node + PERM node |
| Architecture / coding convention baked into the code | ADR (component-scoped `docs/<component>/adrs/`, or `docs/shared/adrs/` if cross-component) — discriminator: [`authoring-adr.md`](../../sdlc/workflow/authoring-adr.md) |
| Process / NFR concern (auth, audit, retention, validation, caching, …) | CCC page under `docs/shared/ccc/` — see [`ccc-edit.md`](../../sdlc/workflow/ccc-edit.md) |

Apply the translation discipline (code → business language) and the
logical-source-name composition from `frs-code-extraction-rules.md` on
every node — both `path` and `logical` go into each node's `source_ref`.
**`source_ref` is the traceability mechanism here** — there is no
`docs-backup/` footer to mark on live source, so the node's `source_ref`
(path + logical name) substitutes for legacy-absorption's "mark file
absorbed" step.

---

## Dispatch posture

Read-heavy and exploratory — forked Explore shape, same as
legacy-absorption + `execute-plan.md`:

1. **Classify first, on the main thread** — walk the scope's topology
   (folders / route groups / project structure) and split into per-kind
   passes (one MOD-area or one signal-kind per pass). A codebase is large;
   never absorb it in one undifferentiated read.
2. **Fan out** `Agent(subagent_type=Explore, …)` — ≤ 3 per round, one per
   module/area. Each returns ≤ 600 words in the legacy-absorption return
   contract:

   ```
   ## Classified artifacts
   - <source path + logical name>: <signal kind>

   ## Canonical targets to author
   - <node IDs / ADR IDs / CCC pages / glossary terms> + rationale

   ## Conflicts surfaced
   - <conflict>: existing <canonical> vs code <behavior> (raise as OQ-NNN)

   ## Code-inferred intent (no prose to confirm)
   - <business rule / actor / edge / fault> (raise as OQ-NNN, origin: legacy-absorption)

   ## ID remaps
   - <legacy/code ID> → canonical <ID>
   ```

   Cite by file path; never restate code verbatim into the return.
3. **Author canonical in main context** — the subagent surfaces routing;
   the main session writes the nodes / ADRs / CCCs and fires the 2-file
   touch (artifact + per-type `index.md`) on each, for visibility. Batch
   round 2 only after synthesising round 1.

---

## Per-pass invariants (from legacy-absorption — non-negotiable)

- **Reference, never copy.** Extract structure + behavior and re-author
  against the canonical template. Code is a quarry, not an authority. No
  verbatim paste into node bodies.
- **Existing canonical wins.** When code contradicts an existing node /
  ADR / CCC, **halt at the conflict** and raise `OQ-NNN`
  (`origin: legacy-absorption`). Do not silently rewrite canonical to
  match the code.
- **IDs resolve upward.** Reserve from the authoritative home — per-type
  `docs/<component>/nodes/<type>/index.md` for nodes, `adrs/index.md` for
  ADRs, `ccc/index.md` for CCCs. On collision, land at the next free ID;
  record the remap.
- **New component?** If the scope introduces a component with no
  `docs/<component>/COMPONENT.md`, run
  [`new-component-bootstrap.md`](../../sdlc/workflow/new-component-bootstrap.md)
  **before** authoring any node there (HARD-GATE).
- **New node type or report type?** Follow
  [`evolving-the-workflow.md`](../../sdlc/workflow/evolving-the-workflow.md).
- **Target-side rewrites are part of the pass.** Repoint stale slugs;
  `grep`-empty gate before considering a pass complete.
- **Derived reports last** — fill the wiki first, regenerate any derived
  report only once canonical coverage is dense.

---

## Progress and completion

- Track each absorption pass with TaskCreate (one task = one MOD-area /
  signal-kind pass); flip to `completed` only after the 2-file touch
  lands and conflicts/inferences are filed as OQs.
- On finish, summarise: canonical artifacts authored (by type), OQs
  raised, conflicts halted on. Call `advisor()` before declaring the
  absorption complete (per CLAUDE.md Advisor gate — completing an
  operation).
