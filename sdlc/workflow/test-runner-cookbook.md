---
applies_when:
  stack: [test]
---

# Test-Runner Cookbook

> **Type:** Project-owned test-runner cookbook. Consulted at Phase 3
> (Test suite codegen). See
> [`test-suite-codegen.md`](test-suite-codegen.md)
> for how codegen consumes this file. Codifies the action inference
> table (step text → runner verb), code emission table (verb →
> runner call), selector resolution, value substitution, URL
> resolution, the full spec-file template, and the
> "every-step-produces-output" rule (no silent drops).
>
> **Scope — project-owned.** This file is authored and maintained by
> the project, not the engine. The workflow files reference it by the
> stable filename `test-runner-cookbook.md`; a project on a different
> runner replaces this file's content while keeping the filename. A
> testing-convention ADR should formalize the runner choice — see
> [`../BOUNDARY.md`](../BOUNDARY.md).
>
> **This file's content uses Playwright / TypeScript as its working
> example.** Replace with your stack's equivalent when adopting the
> engine on a different runner.

## When to Use

**Use when:** Phase 3 codegen is converting a TC's Steps table into a
`.spec.ts` file, a TC's step text needs a Playwright equivalent, or
the selector / value / URL resolution needs to be checked against
project convention.

**Do NOT use when:** the work is identifying which TCs should exist
(use [`coverage-matrix.md`](coverage-matrix.md)), generating Test
Data values for a TC (use [`test-data-generation.md`](test-data-generation.md)),
or the artifact is the TC file itself (this file converts TC steps to
code; TC files are sacred input — never modified by codegen).

**Vs. sibling files:** [`coverage-matrix.md`](coverage-matrix.md)
identifies which TCs to emit; [`test-data-generation.md`](test-data-generation.md)
generates the values inside each TC; this file generates the code
that consumes those values. The three are the **TC authoring trio**
at Phase 2 / Phase 3.

Converts each TC step from
[`plan.md → Test plan ingest`](plan.md#test-plan-ingest-after-fs-validation)
into executable Playwright TypeScript. The Steps table's `Step` column
text is mapped to a Playwright action; the `Selector` column is mapped
to either a CSS locator, a role-based selector, or a TODO comment; the
`Expected Result` column drives the assertion after the action.

## Anti-Pattern: "The Silent Drop"

A TC step doesn't cleanly match an entry in the action inference
table — the verb is unusual, the selector is a placeholder, the
expected result is prose that doesn't map to an assertion — and
codegen **silently omits the step** from the generated `.spec.ts`
because emitting nothing "feels cleaner than emitting a broken line."
The cost: the resulting spec file passes ("no failing assertions"),
but it tests less than the TC specifies; the developer who reviews
the spec sees a green run and assumes coverage; the gap surfaces
months later as a production bug the TC was supposed to catch.
**Every step produces output — either a generated code line or an
explicit `// TODO` comment.** Ambiguity emits both interpretations as
a TODO; unmappable verbs emit `// TODO: Manual step required — "{step
text}"`; placeholder selectors emit `// TODO: selector not found`.
Zero-assertion specs emit `// TODO: no assertions found — add
expected result to TC`. **A TODO is honest; a silent omission is
not.** Doctrinal anchor:
[`../PRINCIPLES.md`](../PRINCIPLES.md) — generated artifacts that
under-specify their input are a worse failure mode than artifacts
that surface gaps as TODOs.

---

## Action inference table

Map step text → action by the leading verb / phrase:

| Step text starts with… | Action |
|---|---|
| `Navigate to` | `navigate` |
| `Click "{label}"` | `click` |
| `Enter "{value}"` | `fill` |
| `Select "{option}"` | `select` |
| `Toggle` | `click` |
| `Verify {x} visible/present/displays` | `assert_visible` |
| `Verify {x} contains/reads/shows "{text}"` | `assert_text` |
| `Verify {x} not visible/hidden/gone` | `assert_hidden` |
| `Verify URL` | `assert_url` |
| `Wait for` | `wait` |
| Anything else | `unknown` (emit TODO) |

**Ambiguity rule.** If a step text could plausibly map to two actions
(click vs fill), emit a TODO listing both interpretations — don't pick
silently.

**Every step produces output.** Either a generated code line or a
`// TODO` comment. No silent drops.

---

## Code emission table

| Action | Playwright code |
|---|---|
| `navigate` | `await page.goto('{url}');` |
| `fill` | `await page.fill('{selector}', '{value}');` |
| `click` | `await page.click('{selector}');` |
| `select` | `await page.selectOption('{selector}', '{value}');` or `await page.getByRole('option', { name: '{value}' }).click();` |
| `assert_url` | `await expect(page).toHaveURL('{url}');` |
| `assert_visible` | `await expect(page.locator('{selector}')).toBeVisible();` |
| `assert_text` | `await expect(page.locator('{selector}')).toContainText('{value}');` |
| `assert_hidden` | `await expect(page.locator('{selector}')).toBeHidden();` |
| `wait` | `await page.locator('{selector}').waitFor();` |
| `unknown` | `// TODO: Manual step required — "{original step text}"` |

**Never** emit `page.waitForTimeout()` for timing. Use
`page.locator().waitFor()` or Playwright's auto-wait.

---

## Selector resolution

The TC's `Selector` column carries one of:

- A CSS selector (`[data-testid="..."]`, `#id`, `.class`, tag) → use
  `page.locator('{selector}')` or `page.fill('{selector}', ...)`.
- A role-based selector (`role=button[name='Sign In']`) → use
  `page.getByRole(...)`:

| Selector column value | Generated code |
|---|---|
| `role=button[name='Sign In']` | `await page.getByRole('button', { name: 'Sign In' }).click();` |
| `role=textbox[name='Username']` | `await page.getByRole('textbox', { name: 'Username' }).fill(...);` |
| CSS selector (starts with `#`, `.`, `[`, tag) | `page.locator('{selector}')` |

- `n/a` → navigation or page-level assertion, no element targeting.
- `(discovered by explorer)` → emit a TODO and skip code emission for
  this step:

```typescript
// TODO: selector not found for step {N} — replace `(discovered by explorer)`
// in the TC and regenerate.
```

**Never guess a selector.** If the TC's Selector column is still a
placeholder, the right move is to add the missing `data-testid` to the
UI, update the TC, and regenerate — not to invent a selector that
looks plausible.

**Never use positional selectors** (`:nth-child`, `div > div > span`).
They break on DOM shape changes.

---

## Value substitution for `fill`

Test Data entries from
[`test-data-generation.md`](test-data-generation.md) drive what value
gets typed. Codegen interpolates per these rules:

| Step value | Playwright value |
|---|---|
| `"valid_email"` | `process.env.TEST_EMAIL!` |
| `"valid_password"` | `process.env.TEST_PASSWORD!` |
| `"invalid_email"` | `'invalid@test.com'` |
| `"invalid_password"` | `'wrongpassword123'` |
| `{timestamp}` token | `` `${Date.now()}` `` |
| `{uuid}` token | `` `${crypto.randomUUID()}` `` |
| `{tcNumber}` token | `'TC001'` (literal, baked at codegen time) |
| `{counter}` token | incrementing counter per spec file |
| Templated string (`TC{tcNumber}-{kebab-feature}-{timestamp}`) | `` `TC001-{feature}-${Date.now()}` `` |
| Any other string literal | Use the string verbatim |
| `null` directive | Omit the value argument |

Directive-driven values (`violatesMaxLength(50)`, `duplicate('TC-DUP-001')`,
`invalidFormat(email)`) are interpolated per the rules in
[`test-data-generation.md → Directive vocabulary`](test-data-generation.md#directive-vocabulary-matrix-driven-tcs).

---

## URL resolution

For `navigate` and `assert_url` actions, derive the URL from the step
text (`Navigate to /verification-table` → `/verification-table`):

- URLs starting with `/` — relative; Playwright's `baseURL`
  (configured in `playwright.config.ts`) handles them.
- Absolute URLs (`https://...`) — use verbatim.

---

## Expected Result column → assertion

If the Expected Result describes visibility, text content, or
navigation, generate the matching assertion immediately after the
action:

- "Modal is displayed" → `await expect(page.locator('[role=dialog]')).toBeVisible();`
- "Success toast reads 'Saved'" → `await expect(page.locator('.toast-success')).toContainText('Saved');`
- "URL is /verification-table" → `await expect(page).toHaveURL('/verification-table');`

If the Expected Result doesn't map cleanly to an assertion, append it
as a comment: `// Expected: {expected result text}`. Don't silently
drop it.

**Every test must have at least one `expect()`.** If a TC has zero
assertions across all its steps, emit
`// TODO: no assertions found — add expected result to TC`.

---

## Auth override for login tests

Tests that navigate to a login page AND fill credentials need an
explicit auth-state override so the global `storageState` in
`playwright.config.ts` doesn't pre-authenticate the session and hide
the login form:

```typescript
test.use({ storageState: { cookies: [], origins: [] } });
```

Place this inside the `test.describe()` block, before the `test()`
call. Emit this only for TCs in `auth/` or `login/` use-case
sub-folders, or when a TC explicitly carries a `@no-auth` tag.

---

## Wait strategy for SSO / OAuth redirects

After clicking a login button that triggers an OAuth/SSO flow, the
redirect chain may land on intermediate URLs before the final
destination. Don't `toHaveURL` immediately after the click:

```typescript
await page.waitForURL(url => !url.href.includes('/sso/'), { timeout: 15000 });
await page.waitForLoadState('networkidle');
```

---

## Full spec file template

One spec file per use-case sub-folder. One `test.describe()` per spec
file, named `{Feature Name} — {Use Case Title}`. One `test()` per TC,
in TC number order.

```typescript
import { test, expect } from '@playwright/test';

// Feature: {feature_name}
// Source: {docs_repo}/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/test-plans/{use-case}/

test.describe('{Feature Name} — {Use Case Title}', () => {
  // Include only for login/auth tests:
  // test.use({ storageState: { cookies: [], origins: [] } });

  // Track records created during each test for cleanup
  let createdRecords: string[] = [];

  test.afterEach(async ({ page }) => {
    // Clean up any records created during this test
    // Swallow errors gracefully — do not fail the test if cleanup fails
    for (const record of createdRecords) {
      try {
        // TODO: implement cleanup for this feature's record type
        // Example: search for `record`, click Delete, confirm
      } catch {
        // record already gone or cleanup failed — safe to ignore
      }
    }
    createdRecords = [];
  });

  test('{TC title} @smoke @{feature} @TC-001', async ({ page }) => {
    // {original step text}
    // ... generated Playwright calls ...
    // After creating a record: createdRecords.push(createdName);
  });

});
```

**Test title format.** TC title + space-separated tags:
`'Display Items (Happy Path) @smoke @checklist @TC-001'`. The
`@smoke` tag appears only on happy-path TCs; the `@{feature}` and
`@TC-NNN` tags appear on every test (per the TC header's `Tags:`
line).

**`@skip` tag handling.** If a TC carries `@skip`, emit
`test.skip(...)` instead of `test(...)`.

**Comments.** One comment line before each step with the original step
text. One comment after with the expected result, when the expected
result didn't directly produce an assertion.

**Imports.** Only `{ test, expect }` from `@playwright/test`. Don't
add other imports unless the TC explicitly requires them.

**`// Source:` comment.** Carries the path to the TC files this spec
was generated from — the FS-staged `test-plans/{use-case}/` folder.

---

## afterEach cleanup rules

- Always emit the `createdRecords` array and `afterEach` block in every
  generated file, even when the use case is read-only. Spec files are
  generated artifacts — re-emitting the block costs nothing and makes
  the pattern uniform across the suite.
- After any step that creates a record (e.g. clicking Save on a create
  form), append: `createdRecords.push(createdName);`.
- Use a timestamped unique name for all test-created records:
  `` `TC001 ${Date.now()}` ``. This pattern mirrors the
  `{tcNumber}+{timestamp}` directive in
  [`test-data-generation.md → Templated value vocabulary`](test-data-generation.md#templated-value-vocabulary).
- The `afterEach` cleanup body is a `// TODO` — the developer fills in
  the real delete steps using the selectors resolved during the TC's
  explorer pass.
- If the feature has no create / delete operations, keep the
  `afterEach` block but leave the body as a comment.

---

## What NOT to generate

- No page objects, no helper functions, no utility wrappers. Raw
  Playwright calls only.
- No retry logic, no custom waits beyond what the TC's `Wait for`
  steps specify.
- No assertions beyond what the TC's Steps table defines. The TC is the
  contract.
- No auto-commit, no auto-push, no auto-merge. Branch + files only.
- No modification of TC files. TC files are the input — sacred.
- No silent drops of unmappable steps. Every step produces a code line
  or a TODO.

If a generated test exceeds 50 lines, the TC probably needs splitting.
Surface that upstream rather than papering over with helper extraction.

---

## Output target

Spec files land at:

```
tests/{test_dir}/{feature}/{use-case}.spec.ts
```

where `{test_dir}` is resolved from `tests/playwright.config.ts`
(`testDir` setting) and `{feature}` matches the FS folder slug. See
[`test-suite-codegen.md`](test-suite-codegen.md)
for the resolution rules and the one-time `playwright.config.ts`
bootstrap step.

Spec files are **disposable** — regenerated end-to-end from TC files
each run. Hand edits to spec files will be lost. If a spec needs to
change, change the TC and regenerate.

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Reference, never copy" governs the spec-file regeneration
  contract; specs are derived from TCs and are not independent
  artifacts.
- **Required before:** [`../BOUNDARY.md`](../BOUNDARY.md) — the
  test-runner choice (Playwright) sits in the project-owned axis; a
  future testing-convention ADR formalizes the choice.
- **Required before:** [`test-suite-codegen.md`](test-suite-codegen.md)
  — Phase 3 caller; codegen reads this file to convert TC steps to
  Playwright.
- **Caller:** [`test-suite-codegen.md`](test-suite-codegen.md) — Phase 3 Test
  suite codegen.
- **Adjacent (not callers but consulted):**
  [`test-data-generation.md`](test-data-generation.md) — provides the
  templated tokens this file substitutes at codegen;
  [`coverage-matrix.md`](coverage-matrix.md) — identifies the TCs
  whose steps this file converts.
- **Sibling rule books:**
  [`test-data-generation.md`](test-data-generation.md),
  [`coverage-matrix.md`](coverage-matrix.md),
  [`frs-validation-rules.md`](frs-validation-rules.md).
