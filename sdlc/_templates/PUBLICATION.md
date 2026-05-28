---
title: <human title — what a reader sees on the page>
category: release-notes | articles | api | overviews
audience: developer | stakeholder | api-consumer | contributor
status: draft | published | superseded
scope: app | shared | cross-component
pulls_from:
  # Canonical sources synthesized. Link by ID — every row below
  # dereferences to an artifact at the moment of authoring (cross-ref
  # guard: sdlc/workflow/cross-ref-guard.md).
  - FRS-NNN
  - FS-NNN
  - ENT-NNN
  - CMD-NNN
  - ADR-NNN
  - CCC-NNN
regenerate_when:
  # Subset of pulls_from: — when any ID here changes in canonical,
  # flag this publication for re-synthesis.
  - <subset of pulls_from:>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Title>

> **Derived publication. Do not edit by hand.** Regenerate by walking
> the `pulls_from:` list above against the wiki. The wiki — nodes,
> ADRs, FRSs, milestones, CCCs — is the source of truth. If a fact in
> this file is wrong, fix the source and regenerate; never patch the
> publication.
>
> See [`../workflow/derived-reports.md § Multi-instance category outputs`](../workflow/derived-reports.md#multi-instance-category-outputs).
>
> File location when rendered: `docs/reports/<category>/<slug>.md`. Add a
> row to `docs/reports/<category>/index.md` on author / regenerate.

---

## Summary

_One-paragraph framing. What this publication covers, who it is for,
what the reader will leave knowing._

`_no content yet_`

---

## Body

_Section structure is audience-tuned per category. Suggested defaults
below — adapt as the category matures, but keep every claim
link-by-ID (reference, never copy):_

### Release-notes shape (when `category: release-notes`)

- **What's new** — link-by-ID list of new FRSs / CMDs / ENTs /
  CONTRACTs shipped in this release.
- **Changes** — link-by-ID list of CHG-NNN deltas applied to existing
  canonical nodes; one line per change.
- **Removed / deprecated** — link-by-ID list of `superseded` /
  `deprecated` transitions.
- **Migration notes** — links to ADRs and CHG migration_steps[] for
  breaking changes.

### Articles shape (when `category: articles`)

- **Problem** — one paragraph; link the discovery / OQ that motivated
  the article.
- **Approach** — link-by-ID walk over the relevant ADRs / DECs.
- **Implementation** — link-by-ID walk over the FRSs / FSs / nodes
  that realize the approach.
- **Trade-offs** — link the ADR's Rationale / Alternatives sections.

### API shape (when `category: api`)

- **Surface** — link-by-ID list of CONTRACT (CON-NNN) nodes published
  in this version; group by `protocol:` (http / events / queue / grpc).
- **Auth & permissions** — link the PERM-NNN nodes that gate the
  surface.
- **Versioning & compatibility** — link the relevant ADR(s).
- **Breaking changes since last version** — CHG-NNN diffs.

### Overviews shape (when `category: overviews`)

- **What it is** — link the FA-NNN (functional area) or MOD-NNN
  (module) the overview covers.
- **Pieces** — link-by-ID list of the FRSs, ENTs, CMDs, FLWs that
  make it up.
- **How it fits together** — link the orchestrating FLW-NNN nodes.
- **Where to look next** — link the relevant ADRs / nodes for
  deeper reading.

---

## Source map

_Optional appendix: the explicit ID→section mapping. Useful for
larger publications where the reader wants to trace a claim back to
its source. Drop when content fits on one screen._

| Section | Source IDs |
| ------- | ---------- |
| _none yet_ |  |
