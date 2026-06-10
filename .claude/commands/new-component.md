---
description: Declare a new standalone component — new-component-bootstrap.md. Coins a unique id_prefix, creates COMPONENT.md, lazy-seeds per-type index.md folders, registers the component in LAYOUT.md / CLAUDE.md / docs/home.md. Runs BEFORE the first node ingest for the component (CLAUDE.md HARD-GATE).
argument-hint: [component name/slug — plus the FRS/FS/absorption that motivates it]
---

Declare a new standalone deployable component in the workspace. Components are declared before they are used: this bootstrap runs in the same session as the work that motivates it (an FRS introducing `produced_flw:` with a new prefix, an FS introducing Phase-2-born nodes into an undeclared path, or an absorption) and **finishes before the first node ingest**. Steps 1–5 and the checklist are owned by the flow file.

**Component (+ motivating work):** $ARGUMENTS
(If empty, ask for the component name and what work motivates it — a component with no motivating FRS/FS/absorption is premature structure.)

> **Canonical flow:** load `sdlc/workflow/new-component-bootstrap.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry.
> `sdlc/workflow/maintenance-discipline.md` governs the lazy per-type `index.md`
> creation on first node. This command sets scope and names the contract; the flow
> file governs. If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

**HARD-GATE (restate — defense-in-depth, = CLAUDE.md Hard rule):** do NOT ingest a node into a component path without `docs/<component>/COMPONENT.md` with `id_prefix:` set — bootstrap runs before, never alongside, the first node ingest. Trigger timing (post-2026-05-17): Phase 1 when the FRS's `produced_flw:` carries the new prefix (earliest trigger; `produced_actor:` alone does NOT fire it — ACT births at Phase 2); Phase 2 when the FS introduces Phase-2-born nodes into the undeclared component; absorption when legacy content brings nodes in. The flow file's named anti-pattern is "The Implicit Component".

Reroute first: artifacts belong to an existing component → just use its `id_prefix:`; a new node *type* for an existing component → `evolving-the-workflow.md`, not here.

## Phase & boundaries

One-shot utility, fired from inside Phase 1 / Phase 2 / absorption — same session as the motivating work, completed before any ID is minted with the new prefix. The `shared/` component is a special one-time bootstrap (no `nodes/`, no `id_prefix`; cross-component ADRs + glossary + ccc/ + tech-stack) per the flow file.

## Produces

`docs/<slug>/COMPONENT.md` from `sdlc/_templates/COMPONENT.md` (`id_prefix:` unique 2–4 char uppercase across all `docs/*/COMPONENT.md`; `type: standalone`; `depends_on:`; `node_definitions:` — `[]` unless the component coins NDFs per STD-007); lazy `nodes/<type>/` folders + `index.md` from `sdlc/_templates/INDEX.md` (only types needed immediately); three registrations — `sdlc/LAYOUT.md` component inventory row, `CLAUDE.md § Where to look`, `docs/home.md` Module Inventory. First nodes mint `{PREFIX}-{TYPE}-001` upward, globally-unique-checked against `docs/home.md` high-water marks. The flow file owns the checklist.

## On completion

Walk the flow file's bootstrap checklist — all seven boxes — then hand straight back to the motivating work (the FRS/FS/absorption ingest that was gated on this). Report the prefix coined and the registrations touched.

**Commit discipline (rule 11):** never `git commit` without explicit user authorization, per commit.
