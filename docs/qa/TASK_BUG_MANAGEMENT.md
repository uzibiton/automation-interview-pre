# Task & Bug Management Guide

**Purpose**: Comprehensive guide for managing issues, tasks, bugs, and feature requests throughout the project lifecycle.

---

## 📋 Table of Contents

1. [Issue Classification](#issue-classification)
2. [Issue Templates](#issue-templates)
3. [Issue Lifecycle](#issue-lifecycle)
4. [Priority & Severity](#priority--severity)
5. [Workflow States](#workflow-states)
6. [Best Practices](#best-practices)
7. [Traceability](#traceability)
8. [Metrics & Reporting](#metrics--reporting)

---

## 🏷️ Issue Classification

### Issue Types

| Type            | Description                           | Template          | Example                                 |
| --------------- | ------------------------------------- | ----------------- | --------------------------------------- |
| **Bug**         | Defects in existing functionality     | `bug-*.md`        | Login fails with valid credentials      |
| **Feature**     | New functionality requests            | `feature-*.md`    | Add expense filtering by date range     |
| **Task**        | Development/maintenance work          | `issue-task-*.md` | Refactor authentication module          |
| **Enhancement** | Improvements to existing features     | N/A               | Improve page load performance           |
| **Question**    | Clarification or investigation needed | N/A               | How should token expiration be handled? |

### When to Create What

**Create a Bug when:**

- Existing feature doesn't work as expected
- User reports incorrect behavior
- Tests fail unexpectedly
- Data inconsistency found

**Create a Feature when:**

- Adding new user-facing functionality
- Implementing new user story
- Adding new API endpoint
- Building new component

**Create a Task when:**

- Technical debt needs addressing
- Refactoring required
- Infrastructure/tooling setup needed
- Documentation updates needed
- Test coverage improvements

---

## 📝 Issue Templates

### Available Templates

All templates located in `.github/ISSUE_TEMPLATE/`

#### Bug Templates

- `bug-delete-expense-confirmation.md` - Missing delete confirmation
- `bug-oauth-redirect-uri-mismatch.md` - OAuth configuration issues
- `bug-data-inconsistency-across-pages.md` - Data sync issues

#### Feature Templates

- `feature-edit-expense.md` - Edit expense functionality
- `feature-table-ordering-and-filtering.md` - Data table enhancements
- `feature-add-edit-expense-in-dialog.md` - Modal-based forms
- `feature-token-refresh-mechanism.md` - Auth improvements
- `feature-user-groups-and-admin.md` - Role management

#### Task Templates

- `issue-task-centralize-typescript-interfaces.md` - Code organization
- `issue-task-test-auth-token-expiration.md` - Testing improvements
- `issue-task-clean-db-temporary-solution.md` - Database maintenance
- `issue-task-enable-hot-reload-docker.md` - Developer experience
- `issue-task-data-migration-strategy.md` - Data management
- `issue-task-consistent-date-filtering.md` - Feature consistency

### Template Structure

Each template includes:

```markdown
---
name: Issue Title
about: Brief description
title: '[TYPE] Short descriptive title'
labels: 'label1, label2, label3'
assignees: ''
---

## 📋 Description

Clear problem statement

## 🎯 Goal

What success looks like

## 📝 Implementation Steps

1. Step 1
2. Step 2
3. Step 3

## ✅ Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## 🔗 Related Issues

Links to dependencies

## 🏷️ Labels

Suggested labels
```

---

## 🔄 Issue Lifecycle

### States and Transitions

```
[Backlog] -> [To Do] -> [In Progress] -> [In Review] -> [Testing] -> [Done]
     ↓         ↓            ↓              ↓            ↓         ↓
[Blocked] ← [Needs Info] ← [Needs Rework] ← [Failed Tests]
```

### State Definitions

| State            | Description                          | Actions            |
| ---------------- | ------------------------------------ | ------------------ |
| **Backlog**      | Issue created, not yet prioritized   | Triage, estimate   |
| **To Do**        | Ready to work, prioritized           | Assign, start work |
| **In Progress**  | Actively being worked on             | Update progress    |
| **In Review**    | PR submitted, awaiting review        | Code review        |
| **Testing**      | Changes deployed to test environment | QA validation      |
| **Blocked**      | Cannot proceed due to dependency     | Document blocker   |
| **Needs Info**   | Requires clarification               | Add questions      |
| **Needs Rework** | Review feedback to address           | Fix issues         |
| **Failed Tests** | Tests failing in CI/CD               | Debug, fix         |
| **Done**         | Completed and verified               | Close issue        |

### Typical Flow

1. **Issue Created** -> Add to backlog
2. **Triage** -> Assign priority/severity, add labels
3. **Estimation** -> Add effort estimate (S/M/L or hours)
4. **Assignment** -> Assign to developer/QA
5. **Development** -> Move to "In Progress", create branch
6. **PR Creation** -> Link issue in PR (`Fixes #123`)
7. **Review** -> Move to "In Review"
8. **Testing** -> Deploy to test env, QA validates
9. **Merge** -> PR merged, deployed to staging/production
10. **Verification** -> Verify in production, close issue

---

## ⚠️ Priority & Severity

### Priority Levels

| Priority          | Description                  | SLA               | Example              |
| ----------------- | ---------------------------- | ----------------- | -------------------- |
| **P0 - Critical** | System down, security breach | Fix immediately   | Database unavailable |
| **P1 - High**     | Major feature broken         | Fix within 24h    | Login not working    |
| **P2 - Medium**   | Feature degraded             | Fix within 1 week | Slow page load       |
| **P3 - Low**      | Minor issue, cosmetic        | Fix when possible | Typo in UI           |

### Severity Levels (for Bugs)

| Severity     | Impact                         | User Affected | Example                               |
| ------------ | ------------------------------ | ------------- | ------------------------------------- |
| **Critical** | Complete feature failure       | All users     | Cannot add expenses                   |
| **High**     | Significant functionality loss | Most users    | Delete button not working             |
| **Medium**   | Partial functionality loss     | Some users    | Filter doesn't work for certain dates |
| **Low**      | Minor inconvenience            | Few users     | UI alignment issue                    |

### Priority vs Severity Matrix

| Severity ↓ / Priority -> | High | Medium | Low |
| ----------------------- | ---- | ------ | --- |
| **Critical**            | P0   | P1     | P2  |
| **High**                | P1   | P2     | P3  |
| **Medium**              | P2   | P3     | P3  |
| **Low**                 | P3   | P3     | P3  |

---

## 🏷️ Workflow States

### GitHub Labels

#### Type Labels

- `bug` - Defect in functionality
- `feature` - New functionality
- `enhancement` - Improvement to existing feature
- `task` - Development/maintenance work
- `documentation` - Documentation updates
- `question` - Needs clarification

#### Priority Labels

- `priority:critical` - P0, immediate action
- `priority:high` - P1, urgent
- `priority:medium` - P2, normal
- `priority:low` - P3, when possible

#### Status Labels

- `status:blocked` - Cannot proceed
- `status:needs-info` - Requires clarification
- `status:in-progress` - Actively being worked
- `status:ready-for-review` - PR submitted
- `status:testing` - In QA validation

#### Component Labels

- `frontend` - React frontend changes
- `backend` - NestJS services changes
- `database` - Schema or data changes
- `api` - API endpoint changes
- `ci-cd` - Pipeline changes
- `infrastructure` - Cloud/Docker changes

#### Effort Labels

- `effort:small` - < 2 hours
- `effort:medium` - 2-8 hours
- `effort:large` - > 8 hours

---

## ✅ Best Practices

### Creating Issues

**✅ DO:**

- Use descriptive titles
- Include reproduction steps for bugs
- Add acceptance criteria
- Link related issues
- Add screenshots/logs when relevant
- Tag appropriate team members
- Estimate effort
- Set priority/severity

**❌ DON'T:**

- Create duplicate issues (search first)
- Leave description empty
- Mix multiple unrelated issues
- Use vague titles like "Fix bug"
- Skip acceptance criteria
- Forget to link PRs

### Example: Good Bug Report

```markdown
# [BUG] Unable to delete expense - confirmation dialog not appearing

## 🐛 Description

When clicking the delete button on an expense, the confirmation dialog
does not appear, and the expense is not deleted.

## 📝 Reproduction Steps

1. Navigate to Expenses page
2. Click delete icon (🗑️) next to any expense
3. Observe: Nothing happens
4. Expected: Confirmation dialog should appear

## ✅ Expected Behavior

- Confirmation dialog displays: "Are you sure you want to delete this expense?"
- User can confirm or cancel
- On confirm, expense is deleted and list updates

## 🖥️ Environment

- Browser: Chrome 120
- Environment: Staging
- User: test@example.com

## 📸 Screenshots

[Screenshot of expenses page with delete button]

## 🔍 Investigation

- Console error: `handleDelete is not defined`
- Likely missing event handler in ExpenseList component

## 🏷️ Labels

`bug`, `frontend`, `priority:high`, `severity:high`
```

### Managing Issues

**Daily:**

- Review new issues, add labels
- Update progress on assigned issues
- Respond to questions/comments
- Move issues through workflow states

**Weekly:**

- Triage backlog
- Reprioritize based on feedback
- Close stale issues
- Review metrics

**Sprint/Milestone:**

- Plan upcoming work
- Assign issues to sprint
- Estimate effort
- Set goals/objectives

---

## 🔗 Traceability

### Linking Issues to Code

**In Commits:**

```bash
git commit -m "Fix delete confirmation dialog

Fixes #45
Related to #48"
```

**In PRs:**

```markdown
## Description

Add confirmation dialog for expense deletion

## Related Issues

- Fixes #45 (delete confirmation)
- Addresses feedback from #48 (UX improvements)
```

**In Code Comments:**

```typescript
// TODO: Refactor after #67 (centralize interfaces)
// FIXME: Temporary workaround for #89 (data migration)
// See issue #102 for context on this approach
```

### Issue Dependencies

Track dependencies explicitly:

```markdown
## Dependencies

- Blocked by #45 (need delete confirmation first)
- Depends on #67 (interface centralization)
- Related to #89 (same data layer)

## Blocks

- #102 (edit functionality needs this first)
- #105 (table refresh depends on this)
```

---

## 📊 Metrics & Reporting

### Key Metrics to Track

| Metric                  | Description                 | Target          |
| ----------------------- | --------------------------- | --------------- |
| **Open Issues**         | Total open issues           | Trending down   |
| **Avg Resolution Time** | Time from open to close     | < 1 week for P2 |
| **Bug Backlog**         | Number of open bugs         | < 10            |
| **Reopened Issues**     | Issues reopened after close | < 5%            |
| **Stale Issues**        | No activity > 30 days       | < 20%           |

### Reports to Generate

**Weekly Status:**

```markdown
## Week of Dec 6, 2025

### Completed (5)

- #45 Delete confirmation dialog ✅
- #48 UX improvements ✅
- #67 Centralize interfaces ✅
- #89 Data migration ✅
- #102 Edit functionality ✅

### In Progress (3)

- #105 Table refresh (80% complete)
- #112 Date filtering (50% complete)
- #120 Token expiration (25% complete)

### Blocked (1)

- #125 OAuth testing (waiting for credentials)

### New Issues (4)

- #130 Data inconsistency (P1, assigned)
- #131 Hot reload Docker (P2, backlog)
- #132 Test coverage (P3, backlog)
- #133 Documentation (P3, backlog)
```

**Bug Burndown:**
Track bugs opened vs closed over time

**Velocity:**
Track story points/issues completed per sprint

---

## 📚 Additional Resources

### Related Documentation

- [Testing Strategy](TESTING_STRATEGY.md) - How testing relates to issue management
- [PR Workflow Guide](PR_WORKFLOW_GUIDE.md) - How PRs link to issues
- [Issue Template Tracking](.github/ISSUE_TEMPLATE/TRACKING.md) - Template status

### Tools

- **GitHub Issues** - Issue tracking
- **GitHub Projects** - Kanban boards
- **GitHub Milestones** - Sprint planning
- **Labels** - Organization and filtering

### Templates Location

- **Browse all**: `.github/ISSUE_TEMPLATE/`
- **Create issue**: Click "New Issue" -> Choose template
- **Track usage**: [TRACKING.md](.github/ISSUE_TEMPLATE/TRACKING.md)

---

## 🎯 Quick Reference

### Common Commands

```bash
# List open issues
gh issue list --state open

# Create issue from template
gh issue create --template bug-template.md

# View issue details
gh issue view 123

# Close issue
gh issue close 123 --comment "Fixed in PR #456"

# Add labels
gh issue edit 123 --add-label "bug,priority:high"

# Link PR to issue (in PR description)
# Fixes #123
# Resolves #123
# Closes #123
```

### Label Shortcuts

- `bug + priority:critical` = P0 bug
- `feature + effort:large` = Major feature request
- `task + status:blocked` = Blocked task

### Workflow Tips

1. **One issue = One fix** - Keep scope focused
2. **Link early** - Connect issues/PRs from the start
3. **Update often** - Keep status current
4. **Close promptly** - Don't leave verified issues open
5. **Archive old** - Close stale issues after 60 days

---

**Last Updated**: December 6, 2025  
**Maintained By**: QA/SDET Team  
**Review Frequency**: Monthly
