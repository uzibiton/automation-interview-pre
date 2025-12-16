# Complete PR Workflow: From Task to Merge

## Table of Contents

1. [Take a Task](#1-take-a-task)
2. [Create Feature Branch](#2-create-feature-branch)
3. [Implement Changes](#3-implement-changes)
4. [Push Branch & Create PR](#4-push-branch--create-pr)
5. [PR Review Process](#5-pr-review-process)
   - [Review Comment Types](#review-comment-types)
6. [Address Review Feedback](#6-address-review-feedback)
7. [Final Approval](#7-final-approval)
8. [Merge PR](#8-merge-pr)
9. [Common Gotchas & Lessons Learned](#common-gotchas--lessons-learned)

## 1. Take a Task

- Review issue/task description
- Understand requirements and acceptance criteria
- Ask clarifying questions if needed
- Plan implementation approach

## 2. Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/descriptive-name
# or: copilot/task-name if Copilot creates it
```

## 3. Implement Changes

- Write code following requirements
- Make incremental commits with clear messages
- Test changes locally as you go

```bash
git add <files>
git commit -m "Clear description of what changed"
```

## 4. Push Branch & Create PR

```bash
git push origin feature/descriptive-name
```

**Create PR on GitHub:**

- Click "Compare & pull request" button
- Fill in PR template:
  - Title: Brief summary
  - Description: What, why, how
  - Link related issues: `Fixes #18`
  - Add screenshots if UI changes
- Choose: **Draft** (work in progress) or **Ready for review**
- Click "Create pull request"

## 5. PR Review Process

### Developer (You):

- Monitor CI/CD pipeline - ensure checks pass
- Review your own code first (catch obvious issues)
- Wait for reviewer feedback

### Reviewer:

**Start Review:**

1. Go to PR → "Files changed" tab
2. Review code changes
3. Click line numbers to add comments
4. Click "Start a review" (first comment)

**Add Comments:**

### Review Comment Types

Use these prefixes to clarify comment intent:

- **❓ Question:** - Need clarification, no action required until answered
  - Example: `❓ Question: Why did we choose ISO format here instead of timestamp?`
  - Author answers, may or may not change code

- **💬 Comment:** - FYI/observation, non-blocking, no action needed
  - Example: `💬 Comment: Nice error handling here`
  - Example: `💬 Comment: This could be refactored later (not blocking)`

- **🔧 Fix (blocking):** - Must be addressed before merge
  - Example: `🔧 Fix: This will throw error if userId is undefined`
  - Example: `🔧 Fix: Missing test coverage for edge case`

- **💡 Suggestion (non-blocking):** - Improvement idea, author decides
  - Example: `💡 Suggestion: Consider extracting this to a helper function`
  - Example: `💡 Suggestion: Could use optional chaining here`

**Submit Review:**

1. Click "Review changes" button (top right)
2. Choose action:
   - **Comment** - Just feedback, no approval
   - **Approve** - Code looks good, ready to merge
   - **Request changes** - Must fix before merge
3. Add summary comment
4. Click "Submit review"

**Important:** Comments are invisible until you click "Submit review"!

## 6. Address Review Feedback

### Developer responds:

```bash
# Make requested changes
git add <files>
git commit -m "Address PR review feedback: fix variable names"
git push origin feature/descriptive-name
```

**Reply to comments:**

- Go back to PR → "Conversation" tab
- Click "Reply" on each comment thread
- Explain changes made
- Mark conversations as "Resolved" when fixed

**Re-request review:**

- Click "Re-request review" icon next to reviewer name
- This notifies them to look again

## 7. Final Approval

- Reviewer approves PR
- All CI/CD checks pass (green checkmarks)
- All requested changes addressed
- All comment threads resolved

## 8. Mark PR Ready (if Draft)

If PR is marked as Draft:

1. Scroll to bottom of PR page
2. Click **"Ready for review"** button
3. PR converts to regular (mergeable) status

## 9. Merge the PR

**Choose merge strategy:**

### Option A: Squash and Merge (Recommended for features)

- Combines all commits into one
- Clean history: one commit per feature
- Good when: Many small "fix typo" commits

```
Before: Fix bug → Fix typo → Address review → Fix another typo
After:  Add feature X with all fixes
```

### Option B: Create Merge Commit

- Keeps all individual commits
- Adds merge commit on top
- Good when: Each commit is meaningful and tested

```
Preserves: Commit 1 → Commit 2 → Commit 3
Adds: "Merge branch feature/x into main"
```

### Option C: Rebase and Merge

- Replays commits on top of main
- Linear history, no merge commit
- Good when: Clean commit history, each commit buildable

**Execute merge:**

1. Click "Merge pull request" dropdown
2. Select strategy (usually "Squash and merge")
3. Edit commit message if squashing
4. Click "Confirm merge"
5. Click "Delete branch" (cleanup)

## 10. Post-Merge

```bash
# Update local main branch
git checkout main
git pull origin main

# Delete local feature branch (optional)
git branch -d feature/descriptive-name

# Verify merge
git log --oneline -5
```

**Close related issues:**

- If PR description had `Fixes #18`, issue closes automatically
- Otherwise manually close and reference PR number

## 11. Verify Deployment

- Check production CI/CD runs successfully
- Test deployed changes in production
- Monitor for errors/issues
- Celebrate! 🎉

---

## Common Gotchas

❌ **Merge button disabled?**

- Check: Is it a Draft PR? → Click "Ready for review"
- Check: Are CI checks passing? → Wait for green
- Check: Is approval required? → Get reviewer approval
- Check: Branch protection rules? → Check repo settings

❌ **Review comments not visible?**

- Did you click "Submit review"? → Pending comments are hidden

❌ **Merge conflicts?**

- Update your branch:

```bash
git checkout main
git pull origin main
git checkout feature/your-branch
git merge main
# Resolve conflicts
git push origin feature/your-branch
```

❌ **CI/CD failed?**

- Click on failed check for details
- Fix issues
- Push new commit
- CI automatically re-runs

---

## Best Practices

✅ Keep PRs small and focused (easier to review)
✅ Write clear commit messages
✅ Test locally before pushing
✅ Self-review before requesting review
✅ Respond promptly to review feedback
✅ Keep PR description updated
✅ Link related issues
✅ Delete branch after merge
✅ Don't force push after review starts
✅ Use draft PRs for work-in-progress

---

## Key Lessons from Real Experience

### 1. Test Coverage Doesn't Equal Working Software

- **Lesson:** E2E tests passed but app was broken (i18n bug)
- **Why:** Tests checked page loads, not actual content rendering
- **Fix:** Add smoke tests that verify critical functionality displays
- **Example:** Test that translations appear, not just that page exists

### 2. Always Understand the API You're Using

- **Lesson:** `useTranslation()` returns `{ t }` not `{ translate }`
- **Why:** Renamed variable without checking documentation
- **Fix:** Always verify library APIs before refactoring
- **Rule:** Meaningful names must still match actual API contracts

### 3. Docker Development Workflow

- **Lesson:** Code changes didn't appear until rebuild
- **Why:** No volume mounts for hot reload
- **Fix:** Add volume mounts: `./src:/app/src`
- **Command:** `docker-compose up -d --build` when volumes not set
- **Better:** Configure hot reload so restart (not rebuild) is enough

### 4. GitHub PR Review Process

- **Lesson:** Comments were "lost" because not submitted
- **Why:** Didn't click "Submit review" button
- **Fix:** Always complete the review flow
- **Rule:** Draft comments are invisible to everyone else
- **Flow:** Add comments → Review changes → Choose action → Submit

### 5. Data Consistency Across Pages

- **Lesson:** Dashboard, Analytics, and Expenses showed different data
- **Why:** Different API endpoints with different filters
- **Fix:** Implement consistent date filtering across all pages
- **Best Practice:** Same timeframe = same data everywhere

### 6. Draft PRs Cannot Be Merged

- **Lesson:** Merge button disabled even with approval
- **Why:** PR marked as "Draft" (work in progress)
- **Fix:** Click "Ready for review" to make mergeable
- **Use Case:** Use drafts for early feedback, not for ready code

### 7. Issue Templates = Developer Documentation

- **Lesson:** Good templates guide teams through complex fixes
- **Why:** They document root cause, steps, and acceptance criteria
- **Best Practice:** Include investigation steps, not just symptoms
- **Example:** Data migration template with SQL queries and rollback plan

### 8. Back-and-Forth Frustration

- **Lesson:** Multiple rebuild cycles waste time and patience
- **Why:** Didn't verify fix before pushing
- **Fix:** Test locally first, then push
- **Respect:** Consider reviewer's time - get it right the first time

### 9. Effective Bug Reporting

- **Lesson:** Report what you see, where, and expected vs actual
- **Format:**
  - **Current behavior:** Old data in table but not graphs
  - **Expected:** All pages show consistent data
  - **Investigation:** Which APIs are called? What filters?
  - **Tasks:** Migration strategy, date filtering, validation tests
