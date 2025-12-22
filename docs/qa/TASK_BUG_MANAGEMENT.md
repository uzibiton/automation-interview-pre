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

---

## 🏗️ Task Naming Convention

### Standard Format

All implementation tasks for features follow a standardized naming convention:

**Format**: `[TASK-XXX-YYY] Descriptive Title`

- **XXX** = Feature/Epic number (e.g., 002 for Group Management, 003 for AI Expense Input)
- **YYY** = Sequential task number within the feature (001, 002, 003...)
- **Descriptive Title** = Clear, action-oriented description

**Examples**:

- `[TASK-002-015] Setup Mock API Infrastructure`
- `[TASK-003-008] Create NLP Parser Service with Prompt Engineering`
- `[TASK-004-001] Create Budget Alerts Table Migration`

### Benefits

- **Filterability**: Quick GitHub filtering using `label:TASK-XXX`
- **Traceability**: Direct mapping to requirements (REQ-XXX) and designs (HLD-XXX)
- **Organization**: Sequential numbering shows implementation order
- **Professionalism**: Consistent, structured task management

### Naming Rules

1. **Always use brackets**: `[TASK-XXX-YYY]` format (not parentheses or none)
2. **Zero-pad numbers**: Use `TASK-003-001` not `TASK-3-1`
3. **Descriptive titles**: Should clearly indicate what's being built
4. **Action-oriented**: Start with verbs (Create, Setup, Implement, Add, Configure)
5. **No abbreviations**: Write "API" not "Appl Programming Interface", but be clear

### Task Document Structure

Each feature has a `TASKS-XXX-feature-name.md` document containing:

- Complete task breakdown across all phases
- Dependencies between tasks
- Effort estimates (in days)
- Acceptance criteria (8-15 per task)
- File paths for all changes
- Proper label assignments

**Reference Template**: [TASKS-002-group-management.md](../dev/TASKS-002-group-management.md) (Gold Standard)

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

## 🏷️ GitHub Labeling Strategy

### Label Categories

Implementation tasks (following [TASK-XXX-YYY] naming convention) use a comprehensive labeling system:

#### 1. **Core Task Label** (Required)

- **Format**: `TASK-XXX` (matches feature number)
- **Purpose**: Enable GitHub filtering for all tasks in a feature
- **Examples**: `TASK-002`, `TASK-003`, `TASK-004`
- **Usage**: `label:TASK-003` to see all AI Expense Input tasks

#### 2. **Phase Labels** (Required)

Indicate which development phase the task belongs to:

| Label          | Description                  | Examples                            |
| -------------- | ---------------------------- | ----------------------------------- |
| `phase-0-db`   | Database schema/migrations   | Create tables, add columns, indexes |
| `phase-1-auth` | Authentication/authorization | JWT, OAuth, permissions             |
| `phase-1-nlp`  | NLP/AI backend services      | AI adapters, parsers, consultations |
| `phase-2-api`  | API endpoints/controllers    | REST APIs, DTOs, validators         |
| `phase-3-ui`   | Frontend UI components       | React components, pages, forms      |
| `phase-4-test` | Testing & QA                 | Unit tests, E2E tests, integration  |

#### 3. **Priority Labels** (Required)

Indicate urgency and importance:

| Label               | Description                        | SLA         |
| ------------------- | ---------------------------------- | ----------- |
| `priority-critical` | Blocking issue, must be done first | < 1 day     |
| `priority-high`     | Important, should be done soon     | < 3 days    |
| `priority-medium`   | Normal priority, regular workflow  | < 1 week    |
| `priority-low`      | Nice to have, can be deferred      | No deadline |

#### 4. **Technology Stack Labels**

Indicate which part of the codebase is affected:

| Label      | Scope                           |
| ---------- | ------------------------------- |
| `frontend` | React, Vite, UI components      |
| `backend`  | NestJS, services, controllers   |
| `database` | PostgreSQL, migrations, queries |
| `testing`  | Test files, test infrastructure |
| `security` | Auth, encryption, PII handling  |
| `ai-ml`    | AI/ML features, NLP, prompts    |
| `devops`   | Docker, CI/CD, deployment       |

#### 5. **Service Labels**

For microservices architecture:

| Label          | Service                     |
| -------------- | --------------------------- |
| `auth-service` | Authentication microservice |
| `api-service`  | Main API microservice       |
| `frontend`     | Frontend application        |

#### 6. **Component Type Labels**

Specific component types:

| Label               | Use Case                         |
| ------------------- | -------------------------------- |
| `ui`                | UI-related tasks                 |
| `component`         | React component creation/updates |
| `page`              | Full page implementation         |
| `api`               | API endpoint                     |
| `migration`         | Database migration               |
| `integration`       | External service integration     |
| `monitoring`        | Logging, metrics, tracking       |
| `cost-optimization` | Performance/cost improvements    |
| `architecture`      | System design, patterns          |

### Complete Labeling Example

For task: `[TASK-003-008] Create NLP Parser Service with Prompt Engineering`

**Applied Labels**:

```
TASK-003
phase-1-nlp
priority-critical
backend
ai-ml
api-service
```

### GitHub Filtering Examples

**Find all Phase 3 UI tasks for AI feature**:

```
label:TASK-003 label:phase-3-ui
```

**Find all critical priority database tasks**:

```
label:phase-0-db label:priority-critical
```

**Find all backend tasks across all features**:

```
label:backend is:issue
```

**Find testing tasks for specific feature**:

```
label:TASK-002 label:phase-4-test
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
| ------------------------ | ---- | ------ | --- |
| **Critical**             | P0   | P1     | P2  |
| **High**                 | P1   | P2     | P3  |
| **Medium**               | P2   | P3     | P3  |
| **Low**                  | P3   | P3     | P3  |

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
