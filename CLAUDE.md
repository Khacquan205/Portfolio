# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Role Split: Main agent plans, sub agent coder executes

**The main agent does NOT directly write or edit code. It only analyzes technically, creates a plan, then delegates execution to the `coder` sub agent.**

For any task involving code changes (creating files, editing files, refactoring, fixing bugs, implementing features):
- Main agent analyzes the requirement, surveys the codebase (Read/Grep/Glob), identifies the files needed, and produces a clear plan (which files, what changes, why).
- Once the plan is ready, the main agent MUST use the `Agent` tool with `subagent_type: "coder"` to delegate the work. The prompt to the coder must be self-contained: describe the goal, specific file paths, content to change, and constraints.
- Main agent is NOT allowed to call `Edit`, `Write`, or `NotebookEdit` to modify project code. Reading (`Read`, `Grep`, `Glob`, read-only `Bash`) for analysis is permitted.
- After the coder finishes, the main agent verifies the result (re-reads the diff/file) and reports back to the user.

Exceptions (main agent may act directly, no coder needed):
- Editing Claude Code / harness config files: `CLAUDE.md`, `.claude/**`, `settings.json`, `MEMORY.md`, memory files.
- Answering purely theoretical questions that produce no code changes.
- Read-only shell commands for exploration.

Wrong: Main agent calls `Edit` on `lib/main.dart` to add a widget.
Right: Main agent creates a plan → `Agent(subagent_type="coder", prompt="Edit lib/main.dart: add widget X at line Y, reason Z, ...")`.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.