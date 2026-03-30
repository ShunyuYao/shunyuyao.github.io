#!/bin/bash
# run-all-modules.sh
# Orchestrator: converts each tasks/prd-module-N-*.md into a prd.json,
# then calls ralph.sh (--tool claude) until all modules are complete.
#
# Usage (from repo root or anywhere):
#   ./scripts/ralph/run-all-modules.sh [OPTIONS]
#
# Options:
#   --start N        Start from module N (default: auto-detect from merged git branches)
#   --iterations N   Max ralph iterations per module (default: 15)
#   --dry-run        Print what would happen without executing
#
# Requirements:
#   - claude CLI available in PATH
#   - python3 available in PATH
#   - git and jq available in PATH

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TASKS_DIR="$REPO_ROOT/tasks"
PRD_FILE="$SCRIPT_DIR/prd.json"
RALPH_SH="$SCRIPT_DIR/ralph.sh"
PRD_BUILDER="$SCRIPT_DIR/prd_builder.py"

# ── defaults ──────────────────────────────────────────────────────────────────
START_MODULE=0
MAX_ITERATIONS=15
DRY_RUN=false

# ── arg parsing ───────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --start)       START_MODULE="$2"; shift 2 ;;
    --iterations)  MAX_ITERATIONS="$2"; shift 2 ;;
    --dry-run)     DRY_RUN=true; shift ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

# ── helpers ───────────────────────────────────────────────────────────────────
log()  { echo ""; echo ">>> $*"; }
info() { echo "    $*"; }
die()  { echo ""; echo "ERROR: $*" >&2; exit 1; }

# ── locate ordered module files ───────────────────────────────────────────────
# Collect into a plain array, sorted numerically by module number
MODULE_FILES=()
while IFS= read -r f; do
  MODULE_FILES+=("$f")
done < <(ls "$TASKS_DIR"/prd-module-[0-9]*.md 2>/dev/null | sort -t'-' -k3 -n)

if [[ ${#MODULE_FILES[@]} -eq 0 ]]; then
  die "No prd-module-*.md files found in $TASKS_DIR"
fi

log "Found ${#MODULE_FILES[@]} module files:"
for f in "${MODULE_FILES[@]}"; do
  info "$(basename "$f")"
done

# ── auto-detect start module from merged branches ─────────────────────────────
detect_start_module() {
  local highest_done=1
  for f in "${MODULE_FILES[@]}"; do
    local num slug branch
    num=$(basename "$f" | sed 's/prd-module-\([0-9]*\)-.*/\1/')
    slug=$(basename "$f" .md | sed 's/prd-module-[0-9]*-//')
    branch="ralph/module-${num}-${slug}"
    if git -C "$REPO_ROOT" branch --merged main 2>/dev/null | grep -qF "$branch"; then
      [[ "$num" -gt "$highest_done" ]] && highest_done="$num"
    fi
  done
  echo $(( highest_done + 1 ))
}

if [[ "$START_MODULE" -eq 0 ]]; then
  START_MODULE=$(detect_start_module)
  log "Auto-detected start module: $START_MODULE"
fi

# ── main loop ─────────────────────────────────────────────────────────────────
log "Starting orchestration | start_module=$START_MODULE | max_iterations=$MAX_ITERATIONS"

TOTAL_MODULES=${#MODULE_FILES[@]}
COMPLETED=0
FAILED=0

for md_file in "${MODULE_FILES[@]}"; do
  module_num=$(basename "$md_file" | sed 's/prd-module-\([0-9]*\)-.*/\1/')

  # Skip already-done modules
  if [[ "$module_num" -lt "$START_MODULE" ]]; then
    info "⏭  Skipping module $module_num (before start)"
    continue
  fi

  slug=$(basename "$md_file" .md | sed 's/prd-module-[0-9]*-//')
  branch_name="ralph/module-${module_num}-${slug}"

  echo ""
  echo "================================================================"
  echo "  MODULE $module_num / $TOTAL_MODULES"
  echo "  File  : $(basename "$md_file")"
  echo "  Branch: $branch_name"
  echo "================================================================"

  # 1. Generate prd.json from the markdown task file
  if [[ "$DRY_RUN" == "true" ]]; then
    info "[dry-run] Would build prd.json via prd_builder.py"
    info "[dry-run] Would run: bash $RALPH_SH --tool claude $MAX_ITERATIONS"
    continue
  fi

  python3 "$PRD_BUILDER" "$md_file" "$branch_name" "$PRD_FILE"

  # 2. Run ralph
  set +e
  bash "$RALPH_SH" --tool claude "$MAX_ITERATIONS"
  RALPH_EXIT=$?
  set -e

  if [[ $RALPH_EXIT -eq 0 ]]; then
    log "✅ Module $module_num COMPLETE"
    COMPLETED=$(( COMPLETED + 1 ))
  else
    log "❌ Module $module_num did not complete within $MAX_ITERATIONS iterations (exit $RALPH_EXIT)"
    FAILED=$(( FAILED + 1 ))

    echo ""
    echo "Options:"
    echo "  Resume this module : $0 --start $module_num --iterations $((MAX_ITERATIONS * 2))"
    echo "  Skip to next       : $0 --start $((module_num + 1))"
    echo ""
    # In non-interactive environments, stop automatically
    if [[ -t 0 ]]; then
      read -r -p "Continue to next module anyway? [y/N] " answer
      if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
        echo "Stopping. Resume with: $0 --start $module_num"
        exit 1
      fi
    else
      echo "Non-interactive mode: stopping on failure."
      exit 1
    fi
  fi
done

echo ""
echo "================================================================"
echo "  ORCHESTRATION COMPLETE"
echo "  Modules completed : $COMPLETED"
echo "  Modules failed    : $FAILED"
echo "================================================================"

[[ $FAILED -gt 0 ]] && exit 1
exit 0
