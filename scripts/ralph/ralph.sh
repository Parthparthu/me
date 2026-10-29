#!/usr/bin/env bash
# Ralph - Autonomous AI agent loop for Portfolio
# Usage: ./scripts/ralph/ralph.sh [--tool claude|agy|amp] [max_iterations]

set -e

TOOL="claude"
MAX_ITERATIONS=10

while [[ $# -gt 0 ]]; do
  case $1 in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

if [ -f "$PROJECT_ROOT/prd.json" ]; then
  PRD_FILE="$PROJECT_ROOT/prd.json"
elif [ -f "$SCRIPT_DIR/prd.json" ]; then
  PRD_FILE="$SCRIPT_DIR/prd.json"
else
  echo "Error: No prd.json found in $PROJECT_ROOT."
  echo "Run '/prd' and '/ralph' to create one, or copy $SCRIPT_DIR/prd.json.example"
  exit 1
fi

WORKING_DIR="$(dirname "$PRD_FILE")"
PROGRESS_FILE="$WORKING_DIR/progress.txt"
ARCHIVE_DIR="$WORKING_DIR/archive"
LAST_BRANCH_FILE="$WORKING_DIR/.last-branch"

if [ "$TOOL" == "claude" ] && [ -f "$SCRIPT_DIR/CLAUDE.md" ]; then
  PROMPT_FILE="$SCRIPT_DIR/CLAUDE.md"
elif [ -f "$SCRIPT_DIR/prompt.md" ]; then
  PROMPT_FILE="$SCRIPT_DIR/prompt.md"
else
  PROMPT_FILE="$WORKING_DIR/CLAUDE.md"
fi

if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ] && command -v jq >/dev/null 2>&1; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")
  
  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    DATE=$(date +%Y-%m-%d)
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"
    
    echo "Archiving previous run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    echo "   Archived to: $ARCHIVE_FOLDER"
    
    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

if [ -f "$PRD_FILE" ] && command -v jq >/dev/null 2>&1; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
  fi
fi

if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

echo "Starting Ralph - Tool: $TOOL - Max iterations: $MAX_ITERATIONS"
echo "Working directory: $WORKING_DIR"
echo "Prompt file: $PROMPT_FILE"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "==============================================================="
  echo "  Ralph Iteration $i of $MAX_ITERATIONS ($TOOL)"
  echo "==============================================================="

  if [[ "$TOOL" == "amp" ]]; then
    OUTPUT=$(cat "$PROMPT_FILE" | amp --dangerously-allow-all 2>&1 | tee /dev/stderr) || true
  elif [[ "$TOOL" == "agy" ]]; then
    PROMPT_CONTENT=$(cat "$PROMPT_FILE")
    OUTPUT=$(agy --dangerously-skip-permissions --print "$PROMPT_CONTENT" 2>&1 | tee /dev/stderr) || true
  else
    OUTPUT=$(claude --dangerously-skip-permissions --print < "$PROMPT_FILE" 2>&1 | tee /dev/stderr) || true
  fi
  
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "Ralph completed all tasks!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi
  
  echo "Iteration $i complete. Continuing..."
  sleep 2
done

echo ""
echo "Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE for status."
exit 1
