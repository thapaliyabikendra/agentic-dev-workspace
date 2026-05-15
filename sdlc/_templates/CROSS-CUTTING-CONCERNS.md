# Cross-Cutting Concerns

> **Type:** Project-owned reference template. Seed once per project into
> `docs/cross-cutting-concerns.md`. Maintained by the project's curator
> (typically the solo developer wearing a curator hat) — see
> [`../workflow/baseline-references.md`](../workflow/baseline-references.md)
> for Add / Change / Retire / Drift procedures.
> **Template path:** `sdlc/_templates/CROSS-CUTTING-CONCERNS.md`
> **Seed path:** `docs/cross-cutting-concerns.md`

Cross-cutting non-functional requirements and obligations that apply to
every FRS in the project. FRSs reference categories here rather than
restating their content. Operation-specific deviations belong in an ADR
that back-links to the baseline category — not in this file, and not as
silent inline prose in the FRS itself.

This file exists so that tightening the default audit retention or adding
a session policy is a one-file change with project-wide effect.

---

## Seeding instructions

When seeding this file into a project, replace every `[bracketed slot]`
with the project's chosen default. Surface any open question (e.g., "what
retention period does our regulator require?") as an `OQ-NNN` under
`docs/discovery/open-questions/` with `origin: workflow-evolution,
needed_by: <phase | M-NN>` rather than guessing. Bracketed slots in the
template below:

- Category 5 — `[retention years]`: the project's default retention
  window for operational records.
- Category 6 — `[timezone]` (two occurrences): the timezone in which the
  project renders timestamps; usually the operating region's local zone
  or `UTC` if the project operates cross-region.
- Category 6 — `[audit-read role]`: the role that may review the full
  audit trail (e.g., "Compliance Officer", "Internal Audit", "Privacy
  Officer").
- Category 7 — `[primary language]`: the default operating language
  (e.g., "English (en-US)", "Japanese (ja-JP)").

After seeding, record the chosen values in the file's revision history
table at the bottom, so a future reader can see when each was set.

---

## Baselines vs ADRs

This file is the **NFR baseline** — operational defaults the project
commits to by default (auth, session, performance, availability,
retention, audit, security, localization, multi-tenancy).
[`adrs/`](../adrs/) is the **architectural-commitment** store — stack
choices, layering rules, framework idioms, tooling. The two mechanisms do
not overlap and do not compete:

- An FRS that wants to **deviate from a baseline category** (a stricter
  retention, a different audit shape, a custom session policy) files the
  deviation as an **ADR** — not as a paragraph in this file, and not as
  silent inline prose in the FRS body. The ADR back-links to the baseline
  category it deviates from.
- A new baseline category (a new project-wide NFR area not yet covered
  here) is added via Op 1 — see
  [`../workflow/baseline-references.md`](../workflow/baseline-references.md).
- A change to an existing baseline that constrains all future FRSs is an
  edit here (Op 2; with a version bump and breaking / non-breaking
  classification).

Reference rule: an FRS section that touches NFR territory **cites this
file by category name** rather than restating its content. The Phase 1.5
validation gate flags any FRS that restates a baseline as a
`baseline-not-cited` finding — see
[`workflow/frs-validation-rules.md → NFR rubric`](../workflow/frs-validation-rules.md#nfr-rubric).

---

## Read contract

The Phase 1.5 validation gate snapshots this file at gate entry. The
version is captured as `baseline_version` in every Validation finding's
audit reproducibility set.

---

## Categories

Each category below is referenceable from the FRS Behavior, Brownfield
impact, or Validation findings sections. Reference format:

```
**Cross-cutting concerns apply** — see `cross-cutting-concerns.md`,
specifically the Authentication & Authorization, Session Management, and
Audit Logging Defaults categories. No operation-specific deviations.
```

Do not restate the content of a category in the FRS. State only the
operation-specific deviation (filed as an ADR) and cite the category.

---

### 1. Authentication & Authorization

Every operation in the project requires the actor to be authenticated.
Authentication mechanisms are platform-managed; FRS bodies state "the
actor is authenticated and holds the [Role Name] role" rather than
specifying authentication technology.

- All actors are authenticated against the platform identity provider
  before any operation begins.
- Role-based access control is platform-enforced; an FRS specifies which
  roles may initiate the operation, but does not specify how role checks
  are implemented.
- Multi-factor authentication, where required by policy, is enforced at
  session establishment, not per-operation.

**Operation-specific deviations** are filed as ADRs back-linking to this
category (e.g., "this operation additionally requires step-up
authentication for transactions above threshold X").

**Origin:** baseline (template v1.0)

---

### 2. Session Management

- Authenticated sessions remain active for a duration consistent with the
  platform's session policy. The exact duration is platform-configurable
  and not stated in FRS bodies.
- Session expiry mid-operation requires re-authentication; in-progress
  unsubmitted state is preserved within the session-policy retention
  window when the operation supports drafting.
- Concurrent sessions for the same actor are governed by platform policy;
  FRSs do not enforce per-operation concurrent-session rules unless the
  operation has a domain-specific concurrency constraint (in which case
  state it as a business rule in the FRS Behavior section).

**Origin:** baseline (template v1.0)

---

### 3. Performance Defaults

- Operator-facing screens render within a duration that does not disrupt
  the user's task under typical load.
- Customer-facing flows respond within timeframes consistent with stated
  business expectations for the channel.
- Specific performance targets (millisecond latencies, throughput) are
  engineering concerns and do NOT belong in FRS NFR statements — they
  belong in feature specs or tech specs.

**Operation-specific deviations** are filed as ADRs back-linking to this
category (e.g., "for batch end-of-day reconciliation, the operation may
run overnight; the daytime performance default does not apply").

**Origin:** baseline (template v1.0)

---

### 4. Availability

- Standard service window: the platform's published business hours for
  the operating region.
- Operations outside the service window may be unavailable; emergency
  operations explicitly designated as 24/7 are filed as ADR-level
  deviations.

**Origin:** baseline (template v1.0)

---

### 5. Data Retention Defaults

- All operational records are retained for **[retention years] years**
  from the date of the operation, unless a stricter applicable regulation
  requires longer.
- Records under regulatory hold are retained until the hold is lifted,
  regardless of default.
- Operation-specific retention extensions are filed as ADRs back-linking
  to this category (e.g., "revisions in this operation are retained for
  10 years per regulation X — extends baseline").

**Origin:** baseline (template v1.0)

---

### 6. Audit Logging Defaults

Every state-changing operation produces at least one Audit Trail entry.
The default capture set:

- Actor identity (authenticated user; role at the time of the operation).
- Timestamp in **[timezone]**, captured at server time.
- Outcome (accepted / refused / failed) and, on refused or failed, the
  reason in business terms.
- Key business identifiers of the affected entities (the FRS specifies
  which).

Operations whose audit obligations exceed the default — verbatim capture
of free-text rationale, captured policy version at time of action,
additional fields visible to specific roles — file the deviation as an
ADR back-linking to this category, rather than restating defaults in the
FRS body.

**Read access to the audit trail.** The **[audit-read role]** role may
review the full audit trail. Other roles' read access is
operation-specific and stated as a business rule in the FRS Behavior
section.

**Origin:** baseline (template v1.0)

---

### 7. Localization & Language

- Operating language is **[primary language]** unless an FRS states
  otherwise.
- Timestamps are rendered in **[timezone]**.
- Multi-language support is opt-in per FRS; an operation that supports
  additional languages declares so in the FRS Behavior section.

**Origin:** baseline (template v1.0)

---

### 8. Security Defaults

- Sensitive data is not exposed to unauthorised actors at any point in
  any flow. Operation-specific exposure rules (e.g., "the customer never
  sees the internal checklist") are stated as business rules in the FRS
  Behavior section.
- Specific cryptographic primitives, transport security versions, and
  key-management mechanisms are platform-managed and do NOT belong in
  FRS NFR statements — they belong in feature specs, tech specs, or
  ADRs.

**Origin:** baseline (template v1.0)

---

### 9. Multi-Tenancy

- Operations are scoped to the active legal entity unless explicitly
  cross-entity.
- Switching the active entity resets per-operation context; partially
  completed operations do not survive an entity switch.
- Operation-specific cross-entity behaviours (rare) are stated explicitly
  in the FRS Behavior section.

**Origin:** baseline (template v1.0)

---

## How an FRS cites a category

**Minimum form (most FRSs):**

```
**Cross-cutting concerns apply** — see `cross-cutting-concerns.md`,
specifically the Authentication & Authorization, Session Management, and
Audit Logging Defaults categories. No operation-specific deviations.
```

**With operation-specific deviation (filed as ADR back-link):**

```
**Cross-cutting concerns apply** — see `cross-cutting-concerns.md`. This
operation deviates from category 5 (Data Retention) — see
[ADR-NNN](adrs/ADR-NNN-extended-retention-for-regulation-X.md): revisions
retained for 10 years per regulation X.
```

---

## Revision history

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | seeding | Seeded from `_templates/CROSS-CUTTING-CONCERNS.md` v1.0. Slots filled inline: category 5 retention = `[retention years]`; category 6 timezone = `[timezone]`, audit-read role = `[audit-read role]`; category 7 language = `[primary language]`, timezone = `[timezone]`. |
