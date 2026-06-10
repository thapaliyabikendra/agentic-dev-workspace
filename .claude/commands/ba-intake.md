---
description: BA intake — translate raw business requirements (plain language, meeting notes, journey prose) into draft FLW/SCR/ACT nodes (status proposed) via prototype-generation.md Sub-flow C. Does NOT author FRSs (that is /author-frs) and does NOT generate the prototype (that is /generate-prototype).
argument-hint: [raw requirements text, or a path to a requirements/notes doc]
---

Translate raw Business-Analyst requirements into draft business-facing KB nodes, ready for `/generate-prototype` (visual validation) and `/author-frs` (the canonical Phase 1 contract). The BA stays in plain language throughout — frontmatter, ID allocation, and index touches are handled here, never by the BA (persona lens: `sdlc/KB-LAYOUT.md § Persona lens`).

**Raw requirements:** $ARGUMENTS
(If empty, ask for the requirements text or doc path before starting.)

> **Canonical flow:** load `sdlc/workflow/prototype-generation.md` in full before starting (this command runs its **Sub-flow C**) — CLAUDE.md § Hard rules requires the relevant flow file at phase entry. Node templates load on demand: `sdlc/_templates/nodes/FLOW.md`, `SCREEN.md`, `ACTOR.md`. This command sets scope; the flow file governs. If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Pre-FRS input utility — no upstream phase gates it. Precondition: requirements specific enough to identify at least one end-to-end journey. Component must exist per CLAUDE.md HARD-GATE (`docs/<component>/COMPONENT.md` with `id_prefix:`) before any draft lands in a canonical type folder — run `sdlc/workflow/new-component-bootstrap.md` first if not.

**HARD-GATE (restate — defense-in-depth):** intake drafts ONLY the business-facing types — FLW, SCR, ACT (per the persona lens). Entity / command / contract / integration signals in the raw notes are flagged in the output as "route to `/author-frs`" — never drafted here, never shoehorned into a FLW.

## Phase & boundaries

Phase-0 / pre-Phase-1. Drafts are `status: proposed` with business-language-only bodies (no node IDs in Phase-1 sections — R-NEW-8 applies even to pre-FRS drafts). One question per turn during clarification (CLAUDE.md rule 10): journey boundaries (one journey or two?), actor identity, missing edge/fault behavior. Present all drafts for BA approval **before** writing into `docs/<component>/nodes/` — draft review first, canonical ingest second.

## Produces

- Draft FLW-NNN per journey (Trigger + happy/edge/fault Scenarios + Journey walkthrough — plain language).
- Draft SCR-NNN per described surface (Description, Layout/UI intent, Display states; `shows:`/`invokes:`/`observes:` empty — Phase 2 concern).
- Draft ACT-NNN only when the actor is absent from the ACT index.
- Per-type `index.md` rows for each ingested draft (tiered touch).
- A flagged list of non-business signals routed forward to `/author-frs`.

## On completion

Drafts approved + ingested. Next: `/generate-prototype FLW-NNN ...` for visual validation, then `/author-frs` for the canonical contract. Chain:
`/ba-intake` → `/generate-prototype` → stakeholder review → `/author-frs` →[`/clear`]→ `/author-fs` →[`/clear`]→ `/implement-milestone` → `/api-integration`
