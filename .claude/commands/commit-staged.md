---
description: Review the staged changes in a target git repo for regressions, then commit them if clean. Runs on Sonnet; user-invoked only.
argument-hint: [path to git repo] (optional — defaults to current dir)
model: sonnet
disable-model-invocation: true
---

Review the staged changes in a git repository for regressions, and commit them **only if** the review is clean.

**Target repo:** $ARGUMENTS
(If empty, use the current working directory — but first confirm it is a git repo. The repo may live *outside* this workspace; do not assume it equals the workspace root.)

---

## Authorization note

This command is user-invoked. Invoking it **is** the explicit per-commit authorization required by `CLAUDE.md` rule 11. Authorization covers exactly one commit of the currently-staged changes — nothing more (no push, no amend of others' commits, no staging of new files unless asked below).

## Procedure

1. **Resolve the repo.**
   - Take the path from `$ARGUMENTS`; if empty, use the current directory.
   - The git repo path can differ from this workspace. Run every git command against that repo — pass `-C "<repo>"` to git (e.g. `git -C "<repo>" status`) rather than relying on the shell's working directory. This avoids `cd` permission prompts and keeps the workspace dir intact.
   - Verify it is a git work tree: `git -C "<repo>" rev-parse --is-inside-work-tree`. If not, stop and report.

2. **Inspect what is staged.**
   - `git -C "<repo>" status --short` — confirm there *are* staged changes. If nothing is staged, stop and tell the user; do not stage anything yourself.
   - `git -C "<repo>" diff --cached` — read the full staged diff. This is the review surface. Do **not** review unstaged changes for the commit, but note them if they look related (a half-staged change is a regression risk worth flagging).

3. **Regression review.** Read the staged diff critically and check for:
   - Logic errors, off-by-one, inverted conditions, broken control flow.
   - Removed/altered behavior that callers still depend on (signature changes, deleted branches, changed return shapes).
   - Debug leftovers: stray prints/logs, commented-out code, `TODO`/`FIXME` introduced, hard-coded secrets, credentials, tokens, or local paths.
   - Partial edits: a function changed in one place but not its call sites; an import added but unused or used but not imported.
   - Tests or types that the change would break.
   - Anything that looks accidentally staged (unrelated files, large binaries, lockfile churn that doesn't match the diff).
   - If the repo has a fast lint/typecheck/test command and it is safe and quick to run, run it and factor the result in. If unsure, skip and say so.

4. **Decide.**
   - **Clean** → proceed to commit.
   - **Concerns found** → do **not** commit. Report each concern with `file:line` and a one-line explanation, ordered by severity, and ask the user how to proceed. Stop here.

5. **Commit (clean path only).**
   - Write a concise, conventional commit message derived from the staged diff (summary line ≤ ~72 chars, body only if it adds signal).
   - End the message with the trailer required by this project (model-agnostic
     — do not hardcode a model name; it goes stale across model upgrades):

     ```
     Co-Authored-By: Claude <noreply@anthropic.com>
     ```
   - Commit: `git -C "<repo>" commit -m "<message>"`. Commit **only** what is already staged — do not `git add` anything new and do not use `-a`.
   - Do **not** push, and do **not** create a branch unless the user asked. If the staged commit would land on a protected/default branch and that seems wrong, flag it before committing.

6. **Report.** Show the resulting `git -C "<repo>" log -1 --stat` (or the short hash + summary) so the user can confirm what landed.

## Guardrails

- Never bypass hooks (`--no-verify`) or signing unless the user explicitly asks. If a pre-commit hook fails, surface the failure and stop — do not work around it.
- If the diff is too large to review responsibly, say so and ask whether to proceed rather than rubber-stamping it.
- When in doubt about whether something is a regression, flag it rather than committing.
