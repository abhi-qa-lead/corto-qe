#!/usr/bin/env bash
#
# Generates the GitHub Pages landing page that links to the UI and API
# Playwright HTML reports.
#
# Reads from environment:
#   GITHUB_SHA, GITHUB_REPOSITORY, GITHUB_SERVER_URL, GITHUB_RUN_ID
#       (set automatically by GitHub Actions)
#   UI_RESULT, API_RESULT
#       Job result of each test job — one of: success, failure, skipped, cancelled
#   SITE_DIR
#       Output directory. Defaults to ./site. Each report should already
#       live at ${SITE_DIR}/ui/index.html and ${SITE_DIR}/api/index.html
#       (downloaded by the workflow before this script runs).
#
# Renders ${SITE_DIR}/index.html using envsubst against landing-page.html.tmpl.
# A card is only rendered for a project if its index.html actually exists, so
# manual workflow_dispatch runs that target a single project gracefully omit
# the missing card.

set -euo pipefail

SITE_DIR="${SITE_DIR:-./site}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="${SCRIPT_DIR}/landing-page.html.tmpl"

mkdir -p "${SITE_DIR}"

# Build a single report card. Echoes empty string if the report isn't present.
build_card() {
  local label="$1"   # "UI" or "API"
  local slug="$2"    # "ui" or "api"
  local target="$3"  # e.g. "DemoQA Book Store"
  local desc="$4"    # one-line description
  local result="$5"  # success | failure | skipped | cancelled

  if [ ! -f "${SITE_DIR}/${slug}/index.html" ]; then
    return
  fi

  local status="failed"
  if [ "${result}" = "success" ]; then
    status="passed"
  fi

  cat <<CARD
<a class="card card--${status}" href="./${slug}/">
          <div class="card-header">
            <h2>${label} Tests</h2>
            <span class="badge badge--${status}">${status}</span>
          </div>
          <p class="card-target">${target}</p>
          <p class="card-desc">${desc}</p>
          <span class="card-link">View report →</span>
        </a>
CARD
}

# Substitution variables for envsubst.
export TIMESTAMP="$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
export COMMIT_SHORT="${GITHUB_SHA:0:7}"
export COMMIT_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}"
export REPO_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}"
export RUN_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"

export UI_CARD="$(build_card \
  "UI" "ui" \
  "DemoQA Book Store" \
  "Page Object Model · custom fixtures · risk-prioritized scenarios" \
  "${UI_RESULT:-skipped}")"

export API_CARD="$(build_card \
  "API" "api" \
  "Restful Booker" \
  "CRUD lifecycle · data-driven negatives · auth flow" \
  "${API_RESULT:-skipped}")"

# Substitute only our named variables — leaves any other $-references in the
# template untouched (defensive against accidental shell-like syntax in HTML/CSS).
envsubst '${TIMESTAMP} ${COMMIT_SHORT} ${COMMIT_URL} ${REPO_URL} ${RUN_URL} ${UI_CARD} ${API_CARD}' \
  < "${TEMPLATE}" \
  > "${SITE_DIR}/index.html"

echo "Generated ${SITE_DIR}/index.html"
