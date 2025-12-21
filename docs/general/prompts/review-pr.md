# PR Review Workflow Prompt

## Purpose

Automated workflow where Copilot Agent prepares a branch diff and outputs a complete, ready-to-paste prompt for Codex (Copilot Chat) to perform a senior-level PR review with GitHub-pasteable output.

## When to Use

- You have a PR ready for review (or a feature branch)
- You want a comprehensive code review before merging
- You need review comments formatted for GitHub PR
- You want to automate the prepare-diff → review workflow

## Required Information

- **Option 1**: PR number (e.g., `145` or `#145`)
- **Option 2**: Current branch name (if no PR number, uses current branch)
- **Optional**: Base branch to compare against (default: `main`)

## Workflow

1. **Agent detects context** - Tries to get PR number from current branch via `gh pr view`, or uses user-provided PR number, or falls back to branch name
2. **Agent checks out branch** - If PR number given and not on that branch, checks it out
3. **Agent creates diff** - Runs `git diff <base-branch>` and saves to `temp/diff-<identifier>.txt` (identifier = PR number or branch name)
4. **Agent cleans up** - Deletes old diff files in `temp/` before creating new one
5. **Agent outputs Codex prompt** - Provides a complete, standalone prompt block to copy/paste into Copilot Chat
6. **User pastes to Codex** - Copy the output block and paste into Copilot Chat
7. **Codex reviews** - Reads diff file and outputs GitHub-formatted review comments
8. **User pastes to GitHub** - Copy Codex output and paste into PR as a single review comment

## Usage Examples

### With PR Number

```
load review-pr #145
```

or

```
load review-pr 145
```

### Current Branch (No PR Number)

```
load review-pr
```

Uses current branch name as identifier (e.g., creates `temp/diff-feature-auth.txt`)

### Different Base Branch

```
load review-pr #145 develop
```

Compare PR #145 against `develop` instead of `main`

### Current Branch Against Different Base

```
load review-pr develop
```

Compare current branch against `develop`

---

## The Prompt (For Copilot Agent)

````markdown
I need you to prepare a PR review workflow with the following steps:

## Step 1: Detect PR Context

1. Check if user provided a PR number (format: `#145`, `145`, or just the number)
2. If PR number provided:
   - Use GitHub CLI to get branch name: `gh pr view <number> --json headRefName --jq .headRefName`
   - If command fails or `gh` not available, ask user for branch name
3. If no PR number:
   - Use current branch: `git branch --show-current`
   - Set identifier to branch name (sanitized for filename)

4. Determine base branch:
   - If user specified (e.g., `develop`), use that
   - Otherwise, try to detect from PR: `gh pr view <number> --json baseRefName --jq .baseRefName`
   - Fallback to `main`

## Step 2: Checkout Branch (If Needed)

1. Get current branch: `git branch --show-current`
2. If PR branch is different from current:
   - Ensure working directory is clean: `git status --porcelain`
   - If dirty, warn user and abort (don't lose changes)
   - Checkout: `git checkout <branch-name>`
   - Pull latest: `git pull origin <branch-name>`

## Step 3: Create Diff File

1. Create `temp/` directory if it doesn't exist:
   ```bash
   mkdir -p temp
   ```
````

2. Delete old diff files in `temp/`:

   ```bash
   rm -f temp/diff-*.txt
   ```

3. Generate diff file:
   - Identifier = PR number (if available) or sanitized branch name
   - Filename = `temp/diff-<identifier>.txt`
   - Command: `git diff <base-branch> > temp/diff-<identifier>.txt`

4. Get diff stats for summary:
   ```bash
   git diff <base-branch> --stat
   ```

## Step 4: Output Codex Prompt

Provide a message with:

1. **Status summary**:

   ```
   ✅ PR Review Preparation Complete

   Branch: <branch-name>
   PR: #<number> (if available)
   Base: <base-branch>
   Diff: temp/diff-<identifier>.txt
   Changes: <X> files changed, <+Y> insertions, <-Z> deletions
   ```

2. **Instruction**:

   ```
   📋 Copy the entire block below and paste into Copilot Chat:
   ```

3. **The Complete Codex Prompt** (standalone, ready to paste):

````
---COPY FROM HERE---

# PR Review (Current Branch vs <BASE_BRANCH>)

You are a senior engineer performing a PR review.

## Context

- **Base branch**: <BASE_BRANCH>
- **Compare branch**: <BRANCH_NAME>
- **Diff file**: Read the file `temp/diff-<IDENTIFIER>.txt` in the workspace
- **PR**: #<NUMBER> (if available)

## Your Task

Review ONLY what changed between <BASE_BRANCH> and the current branch.

### Focus Areas

1. **Correctness**
   - Bugs, logic errors, edge cases not handled
   - Incorrect assumptions or missing validations
   - Race conditions or concurrency issues

2. **Security**
   - Input validation missing or insufficient
   - SQL injection risks (TypeORM queries)
   - XSS vulnerabilities (React rendering)
   - Authentication/authorization bypasses (Passport, JWT, Guards)
   - Sensitive data exposure (tokens, passwords in logs)
   - Firebase security rules violations

3. **Performance**
   - N+1 queries or inefficient database access
   - Missing indexes or slow queries
   - Memory leaks (event listeners, subscriptions)
   - Large payload transfers
   - Unoptimized React renders (missing memo, useMemo, useCallback)

4. **Maintainability**
   - Unclear naming or confusing logic
   - Excessive complexity (consider extracting functions/services)
   - Tight coupling (hard to test or reuse)
   - Missing error handling
   - Code duplication

5. **Technology-Specific**
   - **React/TypeScript**: Hooks dependency arrays correct, prop types defined, no `any` types
   - **NestJS**: DTOs properly validated, dependency injection used, Guards/Interceptors applied correctly
   - **TypeORM**: Relations loaded correctly, transactions used where needed, migrations provided
   - **Testing**: Playwright tests use correct selectors (data-testid), API contract tests present

6. **Tests**
   - Missing test coverage for new logic
   - Edge cases not tested
   - Flaky test patterns (hardcoded waits, race conditions)
   - Test data using mutable fixtures correctly

7. **Backward Compatibility**
   - Breaking API changes without versioning
   - Database migrations needed
   - Environment variable changes documented

### Do NOT Comment On

- Minor formatting issues (handled by Prettier/ESLint)
- Personal style preferences
- Refactoring suggestions unrelated to the change
- File contents not shown in the diff

## Output Format (CRITICAL - GitHub Pasteable)

Return a **SINGLE comment** that I can paste directly into GitHub PR.

Use this exact structure:

### 📊 Summary

- **Risk Level**: [Low/Medium/High]
- **Files Changed**: [number] files
- **Key Findings**: 3-6 bullet points max
  - Overall assessment
  - Main themes (security, performance, testing gaps)
  - Recommendation (approve/request changes/needs discussion)

---

### 🔧 Blocking Issues

> **These MUST be fixed before merge**

For each blocking issue (if any):

**[File Path]** (e.g., `app/services/api-service/src/auth/auth.service.ts`)

- **Location**: `functionName()` / `className` / line hint
- **Issue**: [Specific description of what's wrong]
- **Impact**: [What breaks, risk level, consequences]
- **Fix**: [Exact change needed, include code snippet if helpful]

```typescript
// Example fix
if (!userId) {
  throw new BadRequestException('userId is required');
}
```

---

### 💡 Non-Blocking Suggestions

> **Consider these for quality improvements**

For each suggestion (if any):

**[File Path]**

- **Location**: `functionName()` / `className`
- **Suggestion**: [Improvement idea]
- **Benefit**: [Why this helps - performance, clarity, maintainability]
- **Optional Fix**:

```typescript
// Example improvement
const memoizedValue = useMemo(() => computeExpensive(data), [data]);
```

---

### 🧪 Testing Recommendations

- **Missing Coverage**:
  - [ ] [Specific test case needed, e.g., "Test expense creation with missing userId"]
  - [ ] [Edge case to cover]

- **Test Improvements**:
  - [ ] [Suggestion for existing tests]

- **If tests are sufficient**: State why current coverage is adequate

---

### ✅ Pre-Merge Checklist

Verify before merging:

- [ ] All blocking issues resolved
- [ ] Environment variables documented (if added/changed)
- [ ] Database migrations included (if schema changed)
- [ ] API docs updated (if endpoints changed)
- [ ] Tests pass locally: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] TypeScript compiles: `npm run typecheck`

---

## Severity Rules

- **🔧 Blocking** = bug, security flaw, data loss risk, crash, incorrect behavior, major reliability issue, breaking change without migration
- **💡 Non-blocking** = maintainability improvement, minor performance optimization, code clarity, best practice suggestion

## Instructions

1. Read the diff file: `temp/diff-<IDENTIFIER>.txt`
2. Analyze changes systematically
3. Output review in the format above
4. If diff file is missing or unreadable, tell me exactly what you need

---COPY TO HERE---
````

## Key Guidelines for Agent

- **Always check if `gh` CLI is available** before using it (fallback gracefully)
- **Never force checkout** if working directory has uncommitted changes
- **Create `temp/` directory** if it doesn't exist
- **Clean up old diffs** before creating new ones (avoids confusion)
- **Use sanitized identifiers** for filenames (replace `/` with `-`, remove special chars)
- **Provide clear status** at each step (what's happening and why)
- **Error handling**: If any step fails, explain what went wrong and what user should do

## Example Agent Output

```
✅ PR Review Preparation Complete

Branch: feature/expense-filtering
PR: #145
Base: main
Diff: temp/diff-145.txt
Changes: 8 files changed, 287 insertions(+), 143 deletions(-)

📋 Copy the entire block below and paste into Copilot Chat:

---COPY FROM HERE---

# PR Review (Current Branch vs main)

[... complete Codex prompt as shown above with placeholders filled ...]

---COPY TO HERE---
```

## Tips

- Agent handles all git operations automatically
- You just copy/paste the output block into Copilot Chat
- Codex reads the diff file from workspace and performs review
- Final output from Codex pastes directly into GitHub PR
- Works with or without GitHub CLI (`gh`)
- Supports any base branch (not just `main`)

## Related Prompts

- `load pr-fix` - Automatically fix PR review comments after review
- `load review` - General code review for specific files
- `load test` - Generate tests for changed code

## Output Files

- `temp/diff-<identifier>.txt` - Git diff file (auto-cleaned on next run)
- `temp/` directory created if needed (should be in `.gitignore`)

---

**See Also**: [PR Fix](pr-fix.md) | [Code Review](code-review.md) | [PR Workflow Guide](../../qa/PR_WORKFLOW_GUIDE.md)

```

```
