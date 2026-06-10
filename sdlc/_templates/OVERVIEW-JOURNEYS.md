---
generated_at: YYYY-MM-DD
source_commit: <git sha at regenerate time, or "filesystem-snapshot">
audience: business-analyst
---

# User Journeys — BA Reference

> **Derived report. Do not edit by hand.** Regenerate by walking the
> "Pulls from" list below against the wiki ("regenerate the journeys
> overview"). The wiki — FLW / SCR / ACT nodes, glossary — is the
> source of truth. If a fact in this file is wrong, fix the source and
> regenerate; never patch the overview.
>
> See [`../workflow/derived-reports.md`](../workflow/derived-reports.md).
>
> File location when rendered: `docs/reports/JOURNEYS.md` (lazy —
> created on first regenerate).

## Pulls from

- `docs/<component>/nodes/flows/index.md` — FLW titles + statuses; the
  journey list spine.
- `docs/<component>/nodes/flows/FLW-NNN-*.md` — Trigger (actor +
  plain-language trigger line), `## Journey walkthrough` section when
  present (else summarize the `#happy` scenario narratively), scenario
  anchors.
- `docs/<component>/nodes/screens/index.md` — SCR titles; filter per
  journey by `source_ref:` / `nav_from:`–`nav_to:` adjacency.
- `docs/<component>/nodes/actors/index.md` — actor names + one-liners.
- `docs/shared/glossary.md` — only the terms actually referenced by the
  walkthrough prose included below.
- `docs/prototypes/index.md` — active PROTO rows, for the per-journey
  prototype column (omit the column when no prototypes exist).

Reference-never-copy applies: every row below links by ID, never
paraphrases the source page's body. ID citations may use wiki-link form
(`[[FLW-002#happy|happy path]]`) per
[`../KB-LAYOUT.md § Wiki-link syntax`](../KB-LAYOUT.md#wiki-link-syntax-docs-only).

---

## How to use this report (Business Analyst)

This is your front door to every user journey in the system. Each
journey section names who performs it, what starts it, the
plain-language walkthrough, and the screens involved — all in business
language, no technical terms. Click through by ID for the full record
(the linked FLW/SCR/ACT pages are also plain language in their
business sections). To change a journey or screen, describe the change
in plain language — `/ba-intake` for new material,
`/generate-prototype` for prototype updates — never edit nodes
directly. This report is a dated snapshot (`generated_at:` above) —
the per-type indexes are the live truth.

---

## Journeys

_One subsection per FLW with status `proposed` or `active`, grouped by
functional area (FA) when FA nodes exist, flat otherwise. Drop the
Prototype line when no PROTO cites the journey._

### [[FLW-NNN]] — <Journey title>

- **Who:** <actor name(s), linked `[[ACT-NNN|role name]]`>
- **Starts when:** <Trigger line, plain language>
- **Walkthrough:** <`## Journey walkthrough` prose, or a 1–3 sentence
  narrative rendering of [[FLW-NNN#happy]]>
- **Screens:** <`[[SCR-NNN|screen title]]`, in journey order>
- **Prototype:** <`[[PROTO-<slug>]]` + status, when one cites this journey>
- **Status:** <FLW status>

---

## Actors quick-reference

| Actor | Who they are (one line) |
| ----- | ----------------------- |
| _none yet_ | |

---

## Glossary quick-reference

Terms referenced by the walkthroughs above — full definitions in
[`../shared/glossary.md`](../shared/glossary.md).

| Term | Plain-language definition |
| ---- | ------------------------- |
| _none yet_ | |
