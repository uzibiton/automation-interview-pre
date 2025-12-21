# PR Fix Prompt

## Purpose

Automatically read PR review comments from GitHub and fix them locally with an interactive workflow.

## When to Use

- You have a PR with review comments that need to be addressed
- You want to quickly fix all unresolved comments
- You need to ensure all reviewer feedback is incorporated

## Required Information

- PR number (e.g., `127`) OR
- Full PR URL (e.g., `https://github.com/uzibiton/automation-interview-pre/pull/127`)

## Workflow

1. **Fetch PR details** - Read PR body, comments, and unresolved review threads
2. **Analyze feedback** - Identify all P1/P2 issues and specific code change requests
3. **Make fixes locally** - Apply all necessary code changes to address comments
4. **Verify changes** - Show diff of what was changed
5. **Prompt for next action** - Ask whether to:
   - Run tests locally first
   - Commit and push directly
   - Review changes before deciding

## Usage Examples

### Basic Usage

```
load pr-fix
```

Then provide:

```
Fix PR #127
```

Or:

```
Fix https://github.com/uzibiton/automation-interview-pre/pull/127
```

### With Context

```
Fix PR review comments for #127 - focus on the P1 issues first
```

## The Prompt

````markdown
I need you to fix PR review comments with the following workflow:

1. **Fetch PR Information**
   - Use `gh pr view <number> --json body,comments,reviews` to get PR details
   - Use `gh api repos/<owner>/<repo>/pulls/<number>/comments` to get unresolved review comments
   - Identify the PR branch and check it out if not already on it

2. **Analyze Review Comments**
   - List all unresolved comments with:
     - File path and line number
     - Priority level (P1, P2, etc.)
     - Comment body with specific feedback
     - Any suggested code changes
   - Group comments by file for efficient fixing
   - Prioritize P1 issues first

3. **Apply Fixes**
   - For each unresolved comment:
     - Read the relevant file sections
     - Understand the context
     - Apply the fix using appropriate edit tools
     - Ensure fixes don't break existing functionality
   - Use `multi_replace_string_in_file` when possible for efficiency
   - Verify TypeScript/linting passes after changes

4. **Verify Changes**
   - Show `git diff --staged` to display all changes
   - Summarize what was fixed:
     - Number of comments addressed
     - Files modified
     - Key changes made

5. **Interactive Decision**
   Ask the user: "Changes are ready. What would you like to do?"
   - Option A: Run tests locally first (`npm test` or relevant test command)
   - Option B: Commit and push directly
   - Option C: Show me more details before deciding

6. **Execute Action**
   Based on user choice:
   - **If tests**: Run appropriate test commands and show results
   - **If commit**: Create descriptive commit message and push
   - **If review**: Provide detailed file-by-file breakdown

## Key Guidelines

- Always checkout the correct branch before making changes
- Preserve existing code formatting and style
- Don't introduce new issues while fixing old ones
- Create atomic, well-described commits
- Reference the PR number in commit messages
- If a comment is unclear, explain what you understood and ask for clarification

## Commit Message Format

```
fix: Address PR #<number> review feedback

- <Brief description of fix 1>
- <Brief description of fix 2>
- <Brief description of fix 3>

Resolves comments from @<reviewer> on PR #<number>
```

## Error Handling

- If PR doesn't exist or can't be accessed, explain the error
- If comments conflict with each other, flag for manual review
- If a fix requires design decisions, ask before proceeding
- If tests fail after fixes, show errors and ask how to proceed

## Example Interaction

**User:**

```
load pr-fix
Fix PR #127
```

**Assistant:**

```
Found PR #127 on branch copilot/setup-mock-api-infrastructure

Analyzing unresolved comments...

Found 3 P1 issues:
1. [invitationHandlers.ts:125] Use findInvitationByToken instead of getInvitationByToken
2. [invitationHandlers.ts:182] Same issue with getInvitationByToken
3. [groupHandlers.ts:201] Use mutable members array instead of fixture

Applying fixes...
✓ Fixed invitation handlers to use findInvitationByToken
✓ Verified groupHandlers already uses mutable members array

Changes ready:
- 1 file modified: invitationHandlers.ts
- 2 function calls fixed to use mutable stores
- All P1 issues addressed

What would you like to do?
A) Run tests locally first
B) Commit and push directly
C) Show me more details
```

**User:**

```
B
```

**Assistant:**

```
Committing and pushing...

✓ Committed: fix: Address PR #127 review feedback
✓ Pushed to copilot/setup-mock-api-infrastructure

All unresolved PR comments have been addressed!
```
````

## Copilot + Codex PR Workflow

This prompt integrates with the Copilot + Codex workflow for efficient PR reviews:

1. **Write and update code with Copilot**
   - Use Copilot inline or Copilot Chat inside the IDE to implement changes.

2. **Open a Pull Request (non-draft)**

3. **Review the PR with Codex**
   - In the PR conversation, comment:
     ```text
     @codex review
     ```
   - Codex analyzes the PR and leaves review comments.

4. **Ask Codex to propose fixes**
   - If there are review comments, run:
     ```text
     @codex address the review comments and propose concrete code changes
     ```
   - Codex responds with diffs, code blocks, and clear instructions.

5. **Fix the PR inline with Copilot** (This is where `load pr-fix` comes in!)
   - Use this prompt: `load pr-fix` and provide the PR number
   - Copilot fetches all comments and applies fixes locally
   - Review the changes and choose to test or commit
   - Alternatively, open files manually and use Copilot to adapt Codex's suggestions

6. **Commit, push, and re-review**
   - Commit and push the changes.
   - (Optional) Run Codex again:
     ```text
     @codex review
     ```

> **Copilot implements changes.  
> Codex reviews and proposes fixes.  
> This prompt automates the fix application.  
> You stay in control of commits.**

## Tips

- Use this prompt when you see "P1" or "P2" priority comments
- The assistant will automatically use the correct branch
- You can interrupt and make manual changes if needed
- Works with both GitHub CLI (`gh`) and GitHub API
- Integrates seamlessly with Codex review workflow

## Related Prompts

- `load review` - For performing code reviews
- `load test` - For running comprehensive tests
- `load docs` - For updating documentation based on PR feedback

## Output Files

No files created - this prompt performs in-place code fixes

---

**See Also**: [Code Review](code-review.md) | [Task Planning](task-planning.md)
