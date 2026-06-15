#!/usr/bin/env bash
set -euo pipefail

# Clones the child repos registered in `docs/project.md § Repo layout`
# into the workspace root if missing. The registry is project-owned;
# this script is engine-shared and carries no project-specific URLs.
#
# - The registry lives in the docs/ repo, so on a fresh devpod docs/ is
#   cloned first: set DOCS_REPO_URL (and optionally DOCS_REPO_BRANCH,
#   default master) when docs/ is missing.
# - The workspace row (local path `.`) is skipped — that's the repo the
#   devpod is created from.
# - Each child repo dir is appended to .git/info/exclude so it never
#   shows as untracked in the workspace repo.
# - Auth: git credential helper / SSH agent by default. Set GIT_TOKEN
#   (or GITLAB_TOKEN) to clone https remotes with oauth2:<token>; the
#   token is used for the clone only and not persisted in .git/config.

# Usage: bootstrap-repos.sh [--best-effort]
#   --best-effort: used by postCreateCommand — when docs/ is missing and
#   DOCS_REPO_URL is unset, print instructions and exit 0 instead of
#   failing (a failing postCreateCommand aborts devpod creation).

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="${ROOT}/docs/project.md"
EXCLUDE="${ROOT}/.git/info/exclude"
TOKEN="${GIT_TOKEN:-${GITLAB_TOKEN:-}}"
BEST_EFFORT=0
[ "${1:-}" = "--best-effort" ] && BEST_EFFORT=1

with_token() {
  if [ -n "$TOKEN" ] && [[ "$1" == https://* ]]; then
    echo "https://oauth2:${TOKEN}@${1#https://}"
  else
    echo "$1"
  fi
}

if [ ! -d "${ROOT}/docs/.git" ]; then
  if [ -z "${DOCS_REPO_URL:-}" ]; then
    msg="docs/ is missing and DOCS_REPO_URL is not set — child repos not cloned.
Set DOCS_REPO_URL (and GIT_TOKEN), then run: bash .devcontainer/bootstrap-repos.sh"
    if [ "$BEST_EFFORT" = 1 ]; then echo "notice: ${msg}"; exit 0; fi
    echo "error: ${msg}" >&2; exit 1
  fi
  echo "clone: docs (${DOCS_REPO_BRANCH:-master})"
  git clone --branch "${DOCS_REPO_BRANCH:-master}" "$(with_token "$DOCS_REPO_URL")" "${ROOT}/docs"
  git -C "${ROOT}/docs" remote set-url origin "$DOCS_REPO_URL"
fi

[ -f "$MANIFEST" ] || { echo "error: ${MANIFEST} not found" >&2; exit 1; }

awk '/^## Repo layout/{s=1; next} s && /^## /{exit} s && /^\|/' "$MANIFEST" |
while IFS='|' read -r _ concern path remote branch _; do
  path="${path//[\` ]/}"
  remote="${remote//[\` ]/}"
  branch="${branch//[\` ]/}"
  case "$path" in ""|.|-*|Localpath) continue ;; esac
  dir="${path%/}"

  if [ -d "${ROOT}/${dir}/.git" ]; then
    echo "skip: ${dir} already cloned"
  else
    echo "clone: ${dir} (${branch})"
    git clone --branch "$branch" "$(with_token "$remote")" "${ROOT}/${dir}"
    git -C "${ROOT}/${dir}" remote set-url origin "$remote"
  fi

  grep -qxF "/${dir}/" "$EXCLUDE" 2>/dev/null || echo "/${dir}/" >> "$EXCLUDE"
done

echo "bootstrap complete"
