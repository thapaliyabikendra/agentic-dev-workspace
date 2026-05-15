#!/usr/bin/env bash
#
# check-branch-coherence.sh — Phase 3 pre-merge guard for multi-service FSs.
#
# Reads service_repos: from the FS frontmatter and verifies each listed
# service repo is on the expected feature branch (feat/FS-NNN-<slug>).
# If any repo is on the wrong branch, exits non-zero. Run before the
# Phase 3 Merge stage; do not begin merge if mismatched.
#
# Usage:
#   ./check-branch-coherence.sh path/to/FS-NNN.md
#
# Source: sdlc-framework-refinement-v3.md Δ8.

set -euo pipefail

fs="${1:?usage: $0 path/to/FS-NNN.md}"

if [[ ! -f "$fs" ]]; then
    echo "error: FS file not found: $fs" >&2
    exit 2
fi

# FS-NNN-<slug> derived from filename, e.g. FS-007-list-management.md -> FS-007-list-management
expected_branch="feat/$(basename "$fs" .md | sed 's/^\([A-Z]*-[0-9]*\)\(.*\)$/\1\2/')"

# Extract service_repos: list from frontmatter. Accepts either inline
# YAML (service_repos: [a, b]) or block form (one path per "- " line).
service_repos=$(awk '
    /^service_repos:/ {
        line = $0
        sub(/^service_repos:[[:space:]]*/, "", line)
        # Inline form: [a, b, c]
        if (line ~ /^\[/) {
            gsub(/[\[\]]/, "", line)
            n = split(line, arr, ",")
            for (i = 1; i <= n; i++) {
                gsub(/^[[:space:]]+|[[:space:]]+$|"|'\''/, "", arr[i])
                if (arr[i] != "") print arr[i]
            }
            in_list = 0
        } else {
            in_list = 1
        }
        next
    }
    in_list && /^- / { sub(/^- /, ""); gsub(/^[[:space:]]+|[[:space:]]+$|"|'\''/, ""); print; next }
    in_list && /^[^[:space:]-]/ { in_list = 0 }
' "$fs")

if [[ -z "$service_repos" ]]; then
    echo "no service_repos declared on $fs — single-repo / monolith FS"
    exit 0
fi

mismatches=0
while IFS= read -r repo; do
    [[ -z "$repo" ]] && continue
    if [[ ! -d "$repo/.git" ]]; then
        echo "MISSING: $repo (not a git repo at this path)" >&2
        mismatches=$((mismatches + 1))
        continue
    fi
    actual=$(git -C "$repo" rev-parse --abbrev-ref HEAD)
    if [[ "$actual" != "$expected_branch" ]]; then
        echo "MISMATCH: $repo on '$actual', expected '$expected_branch'" >&2
        mismatches=$((mismatches + 1))
    else
        echo "ok: $repo on $actual"
    fi
done <<< "$service_repos"

if (( mismatches > 0 )); then
    echo "" >&2
    echo "$mismatches service repo(s) not on expected branch; halt Phase 3." >&2
    exit 1
fi

echo ""
echo "all service repos coherent on $expected_branch"
