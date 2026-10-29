# Ralph Agent Instructions — Portfolio Project

You are an autonomous AI coding agent working on the Pradyumna Portfolio project (Next.js 15, React 19, TypeScript, Tailwind CSS).

## Your Task

1. Read `prd.json` in the project root.
2. Read `progress.txt` (check the `## Codebase Patterns` section first for critical patterns and gotchas).
3. Ensure you are on the git branch specified by `branchName` in `prd.json`. If not on it, create or switch to it (`git checkout -b <branchName>`).
4. Pick the **highest priority** user story where `passes: false`.
5. Implement that **single** user story with clean, focused changes.
6. Run the project quality checks:
   - Type check: `npm run typecheck` (`tsc --noEmit`)
   - Lint check: `npm run lint` (`next lint`)
7. For any UI changes, ensure compliance with [`AGENTS.md`](file:///c:/Users/MS/OneDrive/Desktop/Portfolio/AGENTS.md):
   - Keyboard accessible (`:focus-visible` rings, no dead clicks).
   - Respect `prefers-reduced-motion`.
   - Hit target >= 24px (mobile >= 44px).
   - Use semantic tags and proper TypeScript typings.
8. If checks pass, commit ALL changes with message:
   `feat: [Story ID] - [Story Title]`
9. Update `prd.json` to mark the completed story as `"passes": true`.
10. Update `AGENTS.md` if you discovered reusable codebase patterns or gotchas.
11. Append your progress report to `progress.txt`.

## Progress Report Format

APPEND to `progress.txt` (never replace, always append):
```markdown
## [YYYY-MM-DD HH:mm] - [Story ID]: [Story Title]
- What was implemented
- Files changed
- **Learnings for future iterations:**
  - Patterns discovered (e.g. "Three.js scenes should be mounted dynamically with ssr: false")
  - Gotchas encountered (e.g. "React 19 types require explicit children typings in props")
  - Useful context (e.g. "Navigation states are managed in store/...")
---
```

## Consolidate Patterns

If you discover a **reusable pattern** that future iterations should know, add it to the `## Codebase Patterns` section at the TOP of `progress.txt` and update the relevant sections of `AGENTS.md`.

## Quality Requirements

- ALL commits must pass `npm run typecheck` and `npm run lint`.
- Do NOT commit broken code under any circumstances.
- Keep changes focused and minimal to fit comfortably within the iteration.
- Work on exactly ONE story per iteration.

## Stop Condition

After completing the user story, inspect `prd.json`.
- If **ALL** stories have `"passes": true`, output:
  <promise>COMPLETE</promise>
- If there are still stories with `"passes": false`, conclude your turn cleanly. The next Ralph iteration will pick up the next story with fresh context.
