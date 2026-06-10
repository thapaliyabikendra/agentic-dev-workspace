---
name: frs-validation-additional-rules-full
description: "Detail file of frs-validation-rules.md — the seven Additional Sanity Rules in full (triggers, exemptions, doctrinal anchors, violation tables) plus the expanded findings-table sub-flavor map. Load when a named sanity sub-flavor fires."
applies_when:
  stack: [agnostic]
---

# Additional sanity rules — full text

> Detail file of [`frs-validation-rules.md`](../frs-validation-rules.md).
> Load when a finding classifies as one of the named sanity sub-flavors
> and the full trigger / exemption / example text is needed. The core
> file's per-rule summary rows carry the binding severity.

**Grandfather clause.** Rules in this section apply **prospectively** to
FRSs whose Phase 1.5 gate first runs after the rule's introduction date.
FRSs whose gate already ran on or before the rule's introduction date
are not retroactively re-classified — their existing `Validation
findings` rows stand. A revision of a grandfathered FRS that
re-triggers the gate is subject to these rules from the re-run
forward; the grandfather is one-shot. Per-rule introduction dates:

- `ac-single-outcome`, `deferred-finding-raises-oq`,
  `nfr-baseline-trace` — 2026-05-16.
- `R-WITHIN-FRS-RULE-RESTATEMENT` — 2026-05-17.
- `protocol-surface-leak` — 2026-05-17.
- `external-boundary-undeclared` — 2026-05-17 (v1.2).
- `state-promotion-deferred` — 2026-05-17 (v1.3).

## Rule: ac-single-outcome

| Trigger | An acceptance-criteria bullet contains "OR" / "either…or" / "and/or" between two distinct observable outcomes (different HTTP status codes, redirect-vs-error, success-vs-fail). |
| ------- | --- |
| Type | `sanity` |
| Severity | **Major** |
| Resolution | Split the AC into two rows (one per outcome), pin to one outcome (revise the other to a separate criterion), or carry the ambiguity as an OQ with `gate_effect: blocking` until the stakeholder picks. |
| Rationale prefix | `"Major: ac-single-outcome — …"` |

An AC must be a single testable claim. Test runners assert one expected
shape per assertion; an OR-bridged AC forces the test author to pick
silently, defeating the trace from FRS → FLW scenario → TC. The
"the platform default does whichever" intuition — see FRS-002's original
"400 or redirect" row — is exactly the trap: the FRS reader cannot tell
whether `200` is a defect or a tolerated path.

## Rule: deferred-finding-raises-oq

| Trigger | A Validation findings row carries `resolution: deferred` and the Rationale column does not cite an `OQ-NNN`. |
| ------- | --- |
| Type | (matches the underlying finding type) |
| Severity | **Major** |
| Resolution | Either resolve the finding inline (revise the FRS / file the ADR / drop the line) and flip to `resolved`, or raise the OQ now and cite the ID in Rationale. Deferral without an OQ is a half-fired touch. |
| Rationale prefix | `"Major: deferred-finding-raises-oq — …"` |

The `Pre-resolved Gate` anti-pattern (see [`design.md`](../design.md#anti-pattern-the-pre-resolved-gate))
catches resolutions claimed without artifact change. This rule catches
the dual failure: a deferral claimed without the OQ that carries the
deferred question forward. Without the OQ, the deferred finding has
nowhere to live after the FRS is closed — it falls off the surface and
silently expires.

## Rule: nfr-baseline-trace

| Trigger | An NFR-shaped sentence appears in any FRS body section (Business rules, Postconditions, Auditability, Acceptance criteria) without a CCC-NNN citation in the immediate surrounding clause **or** an explicit "deviates from CCC-NNN via ADR-NNN" annotation. |
| ------- | --- |
| Type | `ccc-deviation` |
| Severity | **Minor** |
| Resolution | Cite the relevant CCC by ID, or replace the NFR claim with a CCC reference, or file the operation-specific override as an ADR back-linked via `related: [CCC-NNN]` and cite both IDs in the FRS. |
| Rationale prefix | `"Minor: nfr-baseline-trace — …"` |

Distinct from the existing `Major: baseline-not-cited` rule
(see [`frs-validation-rules.md → NFR rubric`](../frs-validation-rules.md#nfr-rubric)).
`baseline-not-cited` fires when the
FRS restates a baseline's content as if it were operation-specific;
`nfr-baseline-trace` fires when the FRS makes a valid operation-specific
NFR claim but omits the baseline citation. The Minor severity reflects
the gap (traceability, not duplication); the Major reflects the
violation (duplication of authority).

| Violation example | Classification |
|---|---|
| Body says "retention is 10 years" and no CCC-012 cited | Minor: nfr-baseline-trace (cite CCC-012 or file ADR) |
| Body says "the audit log retains operation attempts for 7 years" verbatim from CCC-004 | Major: baseline-not-cited (delete; rely on `ccc:` frontmatter) |
| Body says "this operation extends CCC-012's retention from 7 to 25 years per ADR-014" | Pass (cited + deviation annotated) |

## Rule: R-WITHIN-FRS-RULE-RESTATEMENT

| Trigger | The same constraint appears as prose in **two or more** of: the FRS's narrative sections (Use case paragraph, Edge cases) **and** Business rules **and** Acceptance criteria. Distinct from baseline restatement (`baseline-not-cited`) — this rule catches duplication **within** the FRS body across section roles, not duplication across the FRS and a baseline. |
| ------- | --- |
| Type | `sanity` |
| Severity | **Minor** |
| Resolution | State the constraint once in the declarative section (`BR-NN` in Business rules), then reference `BR-NN` from the others. Use case and AC may cite the BR ID; they must not restate the BR text verbatim. If the restatement is genuinely a paraphrase that serves a distinct section role (e.g., AC making the BR testable in a specific Flow scenario), keep both — the rule fires on verbatim restatement, not on legitimate role-specific phrasing. |
| Rationale prefix | `"Minor: within-frs-rule-restatement — …"` |

Companion to the section-role discipline declared in the FRS template
([`../../_templates/FRS.md`](../../_templates/FRS.md) → Business rules and
Acceptance criteria headings). Section roles assigned 2026-05-17:

- **Business rules** — declarative policy claims, each stated once.
- **Acceptance criteria** — testable claims; cite `BR-NN`, never
  restate.
- **Use case / Edge cases** — narrative framing for the operation;
  cite `BR-NN` rather than restate.

The rule applies prospectively (grandfather clause above) and is Minor
because the section-role tightening is new — pre-2026-05-17 FRSs may
carry historical restatements that the template did not previously
forbid.

| Violation example | Classification |
|---|---|
| BR-03 says "passwords must be ≥ 12 characters"; AC says "the system rejects passwords shorter than 12 characters"; Use case paragraph also says "users must choose a password of at least 12 characters" | Minor: within-frs-rule-restatement (state once in BR-03; cite from Use case + AC) |
| BR-03 says "passwords must be ≥ 12 characters"; AC-01 says "AC-01 — actor submits a 10-character password → system rejects with the message defined in BR-03" | Pass (AC cites BR-03 and adds testable specificity — legitimate role-specific phrasing) |

## Rule: protocol-surface-leak

| Trigger | Protocol-wire surface appears inline in the FRS body's **operation-specifying** sections (Behavior, Postconditions, Business rules, Edge cases, Acceptance criteria). Detected patterns include: HTTP status-code tokens (`HTTP\s+\d{3}` — "HTTP 200", "HTTP 400"), HTTP verb-with-path tokens (`(GET\|POST\|PUT\|PATCH\|DELETE)\s+/\S+`), query-string syntax (`\?\w+=`), fenced JSON / XML response shapes (a ``` fence whose body contains `{` or `<`), OAuth2 / OpenIddict protocol literals (`grant_type=password`, `error:\s*["'][\w_]+["']`), and error-code string identifiers (`IdentityErrors\.\w+`, `ERR_\w+`, `EmailNotConfirmed`-style ABP error strings). **Scope explicitly excludes** the Validation findings table (which is a meta-audit log of past leaks — legitimate to name the leaked surface there) and the Out of scope section when the literal is a *deferred-feature identifier* rather than specifying this FRS's behavior (e.g., "Token refresh (`grant_type=refresh_token`) → future milestone" is a Pass; "Out of scope: HTTP 400 fault paths" is a leak). |
| ------- | --- |
| Type | `sanity` |
| Severity | **Major** |
| Resolution | Author or extend a `CON-NNN` node carrying the protocol surface (route, request / response schema, status codes, error-code map). Recast the FRS body in terms of business outcomes ("registration is rejected as a duplicate-email outcome"; "the actor is redirected to the login page"). Reference `CON-NNN` from the FRS where wire-level detail is needed; integration tests verify the wire mapping. |
| Rationale prefix | `"Major: protocol-surface-leak — …"` |

**Exemptions.**

- **Trigger-line surface identifier.** A single HTTP verb-with-path token MAY
  appear once in the Use case Trigger line as a compact surface identifier
  (e.g., "the browser issues a GET against `/api/account/confirm-email`").
  The Trigger is the one sanctioned home; further occurrences trigger the
  rule.
- **CON-NNN reference is the cure.** Inline references to a `CON-NNN` node
  in adjacent prose (e.g., "wire surface canonical in CON-002") are not a
  leak — they are how the rule is satisfied. The rule fires on inline
  protocol-surface *tokens*, not on `CON-NNN` *citations*.
- **ABP public-API symbol names** (ABP classes, methods, interfaces,
  configuration option keys, entity property names) remain governed by
  ADR-001 and do not trigger this rule. Routes, status codes, payload
  shapes, and error-code string literals do, even when they appear next
  to an ADR-001-covered symbol.

**Doctrinal anchor.** Formalizes the "Common language traps" guidance
(see [`frs-validation-rules.md → Common language traps`](../frs-validation-rules.md#common-language-traps)
— the second trap, "The API will return a 404 if the user is not found",
is now enforced rather than aspirational) and the
[`frs-code-extraction-rules.md → Translation discipline`](../frs-code-extraction-rules.md#translation-discipline-code--business-language)
table's "drop entirely" entries for endpoint paths, status codes, and
payload shapes.

| Violation example | Classification |
|---|---|
| FRS AC: "Submitting a duplicate email → HTTP 400, error code `IdentityErrors.DuplicateEmail`" | Major: protocol-surface-leak (status code + error-code literal; relocate to CON-NNN, recast AC as "registration is rejected as a duplicate-email outcome — see CON-NNN") |
| FRS Behavior: fenced ```json block with `access_token` / `refresh_token` fields | Major: protocol-surface-leak (response-shape JSON in FRS body; move to CON-NNN response shape table) |
| FRS Trigger: "POSTs to `/api/account/register`" + FRS Behavior: "the actor calls `POST /api/account/register` with…" | Major: protocol-surface-leak (verb+path appears twice; Trigger may keep it once, Behavior must drop) |
| FRS Trigger: "the browser issues a GET against `/api/account/confirm-email`" + FRS Behavior: "wire surface canonical in CON-002" | Pass (Trigger is the sanctioned single-occurrence; Behavior cites CON by ID) |
| FRS Behavior: "CMD-002 invokes `UserManager.ConfirmEmailAsync` and flips `IdentityUser.EmailConfirmed` to true; wire surface canonical in CON-002" | Pass (ABP method + property names covered by ADR-001; CON-002 cited for wire) |

## Rule: external-boundary-undeclared

| Trigger | An outbound external boundary is implied by the FRS body but no `INT-NNN` node is declared or cited. Both (a) and (b) hold. **(a) Signal of an outbound boundary:** any of — the FRS Notifications table has a row with `Channel ∈ {Email, SMS, Push, Webhook}` (any non-`In-app` channel) and `Recipient ≠ _None_`; OR an operation-specifying section (Behavior, Postconditions, Business rules, Edge cases, Acceptance criteria) names a recognized outbound framework abstraction. Inline seed list of recognized abstractions: `IAccountEmailer`, `IEmailSender`, `IEmailService`, `ISmsSender`, `IPushNotificationService`, named `IHttpClientFactory` clients addressing an external service, vendor SDK client interfaces (e.g., `IStripeClient`, `IS3Client`, `ISendGridClient`, payment-processor SDKs). **(b) No INT-NNN handle:** `produces_nodes:` does not include an `INT-NNN`, AND `touches_nodes:` does not include an `INT-NNN`, AND the FRS body does not cite an `INT-NNN` inline. **Scope explicitly excludes** distributed events (Kafka topics / RabbitMQ exchanges via `IDistributedEventBus.PublishAsync` to an external bus) — those route to `EVT-NNN` + `linked_contract: CON-NNN` per [`KB-LAYOUT.md → Node-type discriminators`](../../KB-LAYOUT.md#node-type-discriminators), not to INT. |
| ------- | --- |
| Type | `sanity` |
| Severity | **Major** |
| Resolution | Author or extend an `INT-NNN` node carrying the external boundary's implementation context (System, Trigger, Contract, SLA, Idempotency, Failure handling, Blast radius). Add to `produces_nodes:` when newly introduced; to `touches_nodes:` with a Phase-1-born CHG when modifying an existing INT; or cite the existing canonical `INT-NNN` inline in the FRS body (Behavior or Brownfield notes) when consuming an unchanged boundary. The lazy `integrations/` folder auto-bootstraps on first INT ingest. |
| Rationale prefix | `"Major: external-boundary-undeclared — …"` |

**Exemptions.**

- **INT-NNN reference is the cure.** Inline references to an `INT-NNN` node in FRS body prose (e.g., "verification email is dispatched via INT-001") satisfy the rule the same way `CON-NNN` references satisfy `protocol-surface-leak` — by handing the external-boundary concern to a canonical node. The rule fires on undeclared boundaries, not on inline citations of declared ones.
- **CCC citation does NOT exempt.** A `ccc:` frontmatter entry covers the policy layer (notification cadence, audit obligation, retention) — it is not a substitute for the INT node, which carries the boundary's SLA / idempotency / failure-handling / blast-radius decisions. Cite both: `ccc:` for policy, `INT-NNN` for the boundary. (A notifications-policy CCC does not yet exist in this project's `docs/shared/ccc/`; the principle stands for future CCCs in this category.)
- **Explicit no-INT annotation.** When the framework abstraction does not actually cross a process boundary in this deployment (rare — e.g., a no-op stub `IEmailSender` in a dev profile), the FRS body MUST carry a one-sentence annotation in Brownfield impact: `"No INT-NNN: <rationale>"`. Annotation absence with the trigger present is the rule firing.

**Doctrinal anchor.** Companion to `protocol-surface-leak`: that rule routes wire-format surface to `CON-NNN`; this rule routes external-boundary concerns (SLA, idempotency, blast radius) to `INT-NNN`. The two together formalize the principle that an FRS body describes *operation outcomes in business language* — protocol-wire surface and external-system boundaries are both relocated to canonical nodes for separate-of-concerns review at Phase 2 ingest.

| Violation example | Classification |
|---|---|
| FRS Notifications: `Registrant \| Registration succeeds \| Email \| Deliver verification link`; `produces_nodes: [..., CMD-001, FLW-001]` (no INT-NNN, no INT-NNN cited inline) | Major: external-boundary-undeclared (declare INT-NNN for the email-dispatch boundary; add to produces_nodes:) |
| FRS Behavior: "CMD-NNN invokes `IEmailSender.SendAsync` to dispatch the receipt"; `produces_nodes:` lists no INT-NNN; no inline INT citation | Major: external-boundary-undeclared (named outbound abstraction without a boundary handle; author INT-NNN or cite existing one) |
| FRS Behavior: "verification email is dispatched via INT-001"; `produces_nodes:` does not include INT-001 because FRS-001 already introduced it | Pass (inline INT-NNN citation satisfies the rule — consumer-of-existing-INT path) |
| FRS Behavior: `IDistributedEventBus.PublishAsync` publishes `OrderPlaced` to the external Kafka cluster; no EVT-NNN declared | Out of this rule's scope (route to EVT-NNN + linked CON-NNN per KB-LAYOUT; a separate sanity rule may apply) |
| FRS Notifications: `_None_ \| — \| — \| no notifications fire` | Pass (Recipient `_None_` does not trigger signal (a)) |

## Rule: state-promotion-deferred

| Trigger | An FRS describes a lifecycle transition that would push an entity past the inline-on-entity threshold defined in [`KB-LAYOUT.md → Node-type discriminators`](../../KB-LAYOUT.md#node-type-discriminators) (STA vs. inline-on-entity) AND the FRS does not declare `STA-NNN` in `produces_nodes:` AND the touched / produced entity does not reference an `STA-NNN` in its `Lifecycle` subsection. Two trigger paths. **(a) Modify-existing:** `touches_nodes:` includes `ENT-NNN`, the existing `ENT-NNN` file's Lifecycle says `State machine: none` (or omits the line), and the FRS's Postconditions / Behavior / Acceptance criteria introduces a transition that brings the entity's total transitions to ≥2, OR introduces a new named state taking the count to ≥3, OR introduces a transition with a named guard beyond the triggering CMD's preconditions, OR introduces a transition that raises a domain event consumed by another node. **(b) Introduce-new:** `produces_nodes:` includes a new `ENT-NNN` AND the FRS's Postconditions / Behavior describes a lifecycle that, evaluated against the KB-LAYOUT discriminator's six criteria, crosses the threshold from the start (e.g., introduces an entity with ≥3 states or ≥2 transitions on day one). |
| ------- | --- |
| Type | `sanity` |
| Severity | **Minor** |
| Resolution | Either **(promote)** declare `STA-NNN` in `produces_nodes:`, queue the STA node for Phase 2 ingest, and at Phase 2 flip the entity's inline `State machine: none` to `State machine: STA-NNN` (or set it on the newly introduced entity); or **(defer)** add an inline `DEC-inline-N` on the entity (or a paragraph in the FRS's Brownfield impact) citing the specific KB-LAYOUT criterion the lifecycle still does not cross, and re-evaluate at the next FRS touching this entity. Silent continuation past the threshold is the violation; either path resolves it. |
| Rationale prefix | `"Minor: state-promotion-deferred — …"` |

**Exemptions.**

- **STA-NNN reference is the cure.** Declaring `STA-NNN` in `produces_nodes:` (or having an existing STA already referenced on the touched entity) satisfies the rule.
- **Inline-on-entity is a legitimate choice.** The KB-LAYOUT discriminator is a checklist, not a forced-promotion rule — entities legitimately below all six criteria stay inline. The rule fires only when the lifecycle crosses ≥1 criterion without an STA-NNN or a citable inline-DEC justification, not on every multi-state entity.
- **In-process framework state.** ASP.NET request lifecycle, ABP unit-of-work scopes, in-memory caching state, and other framework-managed transients are not domain lifecycle and do not trigger this rule. The rule fires on `ENT-NNN`-scoped domain state only.
- **Field mutations are not transitions.** Updates to fields like `LastLoginAt`, `RetryCount`, or audit timestamps are field writes, not lifecycle transitions. The trigger fires on changes to the entity's lifecycle position (state-flag flip, enum change, or modeled status field), not on every mutation.

**Doctrinal anchor.** Companion to the KB-LAYOUT discriminator: that file
defines when STA is warranted; this rule enforces the discriminator at
the Phase 1.5 gate so that a multi-FRS milestone cannot incrementally
grow an entity's state machine past the threshold without either
promoting to STA or carrying a citable inline-DEC justification. Minor
severity reflects that this is a modeling judgement — Phase 2 can still
ingest the FRS — and that historic entities below the threshold are
unaffected by retroactive trigger evaluation (grandfather clause
applies).

| Violation example | Classification |
|---|---|
| `touches_nodes: [ENT-001]`; ENT-001 currently has `State machine: none` with a single `EmailConfirmed` transition from a prior FRS; FRS-007 Postconditions: "`LockedOut = true` is persisted on the 5th consecutive failed login" — adds a 2nd transition (and arguably a 3rd state if `LockedOut` is modeled distinctly). `produces_nodes:` does not include `STA-NNN`. | Minor: state-promotion-deferred (declare STA-NNN in produces_nodes; Phase 2 ingest authors STA-001 covering `EmailConfirmed` + `LockedOut` transitions; flip ENT-001 inline `Lifecycle` to `State machine: STA-001`) |
| `produces_nodes: [ENT-005, CMD-009, FLW-005]`; FRS-009 introduces an `Order` entity with `draft → submitted → fulfilled → cancelled` lifecycle described in Postconditions; no `STA-NNN` in produces_nodes. | Minor: state-promotion-deferred (introduce-new path; threshold crossed at birth — declare STA-005 alongside ENT-005) |
| `touches_nodes: [ENT-001]`; FRS-NN Postconditions: "the actor's `LastLoginAt` timestamp is updated" — a field write, no new state value, no transition. | Pass (timestamp write is field mutation, not a lifecycle transition; the entity remains a 2-state machine) |
| `touches_nodes: [ENT-001]`; FRS-NN adds a second transition; `produces_nodes:` includes `STA-NNN`; STA is queued for Phase 2 ingest. | Pass (STA-NNN declared — the cure has fired) |
| `touches_nodes: [ENT-001]`; FRS-NN adds a second transition; FRS's Brownfield impact says "`EmailConfirmed` and `MarketingOptIn` are independent flags, not a 3-state machine — inline modeling retained per DEC-inline-2 on ENT-001". | Pass (defer path — inline DEC justifies continued inline modeling against the discriminator criteria) |

## Expanded findings-table sub-flavor map

The FRS template's `Validation findings` `type` column is one of
`existence`, `sanity`, `adr-conflict`, `standard-conflict`,
`ccc-deviation`, `chg-sanity`, or `cross-frs`.
`standard-conflict` and `ccc-deviation` are first-class types (one per
Pass 1 check 4 and 5 respectively — see
[`design.md → Pass 1`](../design.md#pass-1--per-frs-gate-runs-after-each-frs-is-authored));
`chg-sanity` is a first-class type (Pass 1 check 8 — fires only when the
FRS declares non-empty `touches_nodes:`, per R-CHG-5); `cross-frs` is the
Pass 2 type (includes the **CHG-conflict** sub-flavor per R-CHG-6 —
sibling-FRS-born CHGs targeting the same canonical node, contradicting
deltas, or contradicting invariants). `sanity` itself expands to cover
bundling, NFR rubric failure, `baseline-not-cited` (FRS restates a
baseline category instead of citing it), `inferred-from-code` /
`inferred-from-prototype` items present without a corresponding Open
Question, `flw-coverage` (an AC that does not map to a scenario anchor
on a real FLW — per R-NEW-3, design.md Pass 1 check 6),
`phase-1-bare-body-shape` (a Phase-1-born FLW or CHG whose body shape
violates R-NEW-2 / R-CHG-4 — forward node IDs in scenarios, Sequence
populated at Phase 1, structural before/after on CHG `modifies[]` at
Phase 1, `adds[]` or `migration_steps[]` filled at Phase 1, illegitimate
`created_under:` marker — design.md Pass 1 check 7; ACT body-shape is no
longer checked at this gate because ACT is born at Phase 2, not Phase 1 —
R-NEW-2a retired 2026-05-17), `within-frs-rule-restatement`,
`protocol-surface-leak`, `external-boundary-undeclared` (distributed-event
publishing to external Kafka / RabbitMQ is out of scope and routes to
`EVT-NNN` + linked `CON-NNN` per
[`KB-LAYOUT.md → Node-type discriminators`](../../KB-LAYOUT.md#node-type-discriminators)),
and `state-promotion-deferred` — each per its rule section above.
Severity (Blocker / Major / Minor) and the audit reproducibility set go in
the Rationale prefix.
