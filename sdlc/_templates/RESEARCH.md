---
id: RESEARCH-NNN
title: <Short noun-phrase naming what was researched, e.g. "EFMS hybrid fraud detection engine">
source_url_or_path: <URL or repo-relative path to the primary external source; multiple sources go under ## Sources>
status: raw                   # raw | synthesized | superseded
confidence: medium            # low | medium | high — agent's confidence in the source's authority and the synthesis quality
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: []                      # free-form; drives index filtering (e.g. fraud-detection, streaming, vendor-architecture)
adrs_produced: []             # ADR IDs this research seeded (filled as ADRs are authored)
frss_informed: []             # FRS IDs that consulted this research (filled at FRS-author time)
related_research: []          # other RESEARCH-NNN IDs that share scope
resolves: []                  # OQ-NNN IDs this research closes (typically OQs with `origin: research`); reciprocal — each OQ's `resolved_by:` cites this RESEARCH
---

# RESEARCH-NNN: <Title>

> **External / competitive research artifact.** Captures findings from
> outside the project — vendor docs, industry papers, competitor wikis,
> domain whitepapers — that inform future ADRs and FRSs. Not a DDD node.
> Not a canonical commitment. It is a *cited reference*: ADRs and FRSs
> link to RESEARCH-NNN by ID rather than restating its content.
>
> **Source posture.** The legacy KB is a quarry, not an authority — the
> same rule applies to RESEARCH. External material is source material;
> canonical ADRs + DECs + nodes are the authority. If RESEARCH contradicts
> a canonical artifact, surface the conflict in `Gaps and Conflicts`; do
> not let RESEARCH silently override the canonical wiki.
>
> **Location.** `docs/research/RESEARCH-NNN-<slug>.md`. Lazy-creates
> `docs/research/index.md` + `docs/research/log.md` on the first instance,
> per `sdlc/workflow/maintenance-discipline.md → Lazy creation`.
>
> **Lifecycle.** `raw` (just absorbed, not yet processed) → `synthesized`
> (key findings extracted, canonical implications named) → `superseded`
> (newer research or canonical decision replaces it; record the
> replacement in frontmatter `related_research:` or via the log).

## Abstract

Two-to-four sentences. What the source covers, why it is relevant to the
project, and the headline finding(s). A reader should be able to decide
from this section alone whether to load the full page.

## Key findings

Bullet list of the concrete claims, facts, or patterns extracted from the
source. Each bullet stands on its own; no narrative paragraphs.

- <finding>
- <finding>
- …

## Gaps and conflicts

What the source does NOT answer for our project, and where it disagrees
with canonical commitments. Each conflict gets surfaced — not absorbed.

- **Gap:** <what we still need to determine>
- **Conflict with <ADR-NNN | DEC-NNN | node ID>:** <one-line description; if unresolved, raise as `OQ-NNN` under `docs/discovery/open-questions/` with `origin: research, origin_ref: <this RESEARCH ID>` and cite the OQ ID here>

## Canonical implications

What the project's canonical wiki should do with this research. Names the
target artifacts. Filled as `synthesized` lands; may be empty at `raw`.

| Implication | Target artifact (proposed) | Status |
| ----------- | -------------------------- | ------ |
| <one-line implication> | <ADR-NNN proposed \| DEC-NNN proposed \| FRS-NNN candidate \| glossary term \| CCC category> | proposed \| landed \| rejected |

## Sources

Every external citation used in this research, with enough detail to
re-locate the original. Repo-relative paths preferred for sources already
under `docs-backup/` or similar; URLs otherwise.

- <repo-relative path or URL> — <one-line description; date accessed if URL>
- …
