# Glossary

> **Type:** Project-owned reference template. Seed once per project into
> `docs/shared/glossary.md`. Maintained by the project's curator (typically the
> solo developer wearing a curator hat) — see
> [`../workflow/baseline-references.md`](../workflow/baseline-references.md)
> for Add / Change / Retire / Drift procedures.
> **Template path:** `sdlc/_templates/GLOSSARY.md`
> **Seed path:** `docs/shared/glossary.md`

Project-wide domain vocabulary. Each FRS that uses a domain term references
this file rather than restating the definition — terms live here, FRSs link
to them. When a definition changes, every FRS that references it picks up
the change automatically.

The glossary is the bridge between business-stakeholder language and FRS
bodies. When a reviewer hits an unfamiliar term in an FRS, they should be
able to find the canonical definition here without hunting across documents.

---

## Seeding instructions

When seeding this file into a project:

1. Copy the file to `docs/shared/glossary.md`.
2. Replace the seed-path note above with the project's path.
3. Keep the Baseline terms section intact — Audit Trail, Audit Trail
   Entry, and Cross-Cutting Concerns are universal across audited
   business domains. Removing any of them warrants a major version
   bump.
4. Leave the Project-specific terms section empty — it populates as
   domain vocabulary lands.
5. Set the revision-history `Date` to the seeding date and the
   `Author` to your name (or `seeding` if the seed is unattended).

---

## Read contract

The Phase 1.5 validation gate snapshots the glossary at gate entry and
captures the version in any Validation finding that fires
([audit reproducibility set](../workflow/frs-validation-rules.md#audit-reproducibility-set)).
Drafters reference the glossary while writing the FRS Behavior section;
the gate cross-checks that every term used in the FRS body resolves to an
entry here.

The glossary version is captured as `glossary_version` in every Validation
finding's audit reproducibility set.

---

## Glossary format

Each entry is one term with one definition. Definitions are written in
business language — no technical surfaces, no schema references. When a
term has both a long form and an abbreviation, list both at the term head
and use either consistently across FRS bodies.

Format:

```
### Term Name (TLA, if any)

One- or two-sentence business definition. The definition explains what the
term means in this project, not what it means in the dictionary or in
another industry. If the term is regulator-defined, cite the regulation.

**Examples** *(when helpful):*
- Concrete example 1
- Concrete example 2

**See also:** RelatedTerm1, RelatedTerm2 *(when relevant)*
```

Avoid nesting subterms inside an entry. If a sub-term needs its own
definition, give it its own entry and cross-reference.

**Matching is case-insensitive** and resolves `See also` synonyms — so a
body mention of "audit log" matches an entry titled `Audit Trail` if that
entry's `See also` lists it (or vice versa).

---

## Project glossary

### Baseline terms

*Seeded with the project from the shared template. Universally applicable
across audited business domains. Adding to this subsection is rare and
warrants a major version bump.*

### Audit Trail

An immutable, append-only record of operations performed in the system,
captured for compliance review and incident reconstruction. Every
state-changing operation contributes at least one entry; every entry
attributes the operation to an actor identity, a timestamp, and an outcome.

**See also:** Audit Trail Entry

### Audit Trail Entry

A single record within the Audit Trail capturing one operation attempt.
Includes actor identity, timestamp, outcome (accepted / refused / failed),
and any operation-specific fields the spec mandates be captured verbatim
(e.g., a rationale, a captured policy version).

### Cross-Cutting Concerns

The set of project-wide non-functional requirements, defaults, and
obligations defined as per-CCC pages under
[`docs/shared/ccc/`](../../docs/shared/ccc/index.md) (one file per concern;
index at `docs/shared/ccc/index.md`). Every FRS declares the CCCs it
inherits in its `ccc:` frontmatter; FRS sections that touch NFR territory
reference CCCs by ID rather than restate them. Operation-specific
deviations are filed as ADRs back-linked via `related: [CCC-NNN]`.

### Project-specific terms

*Project-curated domain vocabulary. Add entries via Op 1 — see
[`../workflow/baseline-references.md`](../workflow/baseline-references.md).*

*(empty — populated as the project's domain vocabulary lands.)*

---

## Revision history

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | seeding | Seeded from `_templates/GLOSSARY.md` v1.0. Universal baseline only (Audit Trail, Audit Trail Entry, Cross-Cutting Concerns); Project-specific terms subsection empty. |
