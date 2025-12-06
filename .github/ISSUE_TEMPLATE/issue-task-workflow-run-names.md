---
name: Add dynamic workflow run names
about: Enhance workflow visibility in GitHub Actions dashboard
title: 'TASK: Add dynamic workflow run names to show branch and trigger event'
labels: enhancement, ci-cd, good-first-issue
assignees: ''

---

## Description
Add dynamic run names to CI/CD workflow to improve visibility in the GitHub Actions dashboard. Currently, all workflow runs show the same static name "CI/CD Pipeline", making it difficult to identify which branch or trigger event initiated each run.

## Problem
- All workflow runs display "CI/CD Pipeline" in the Actions view
- Cannot quickly identify branch name or trigger type (PR vs push)
- Difficult to track specific workflow runs across multiple branches
- No visual distinction between PR workflows and push workflows

## Proposed Solution
Add a `run-name` field to `.github/workflows/ci-cd.yml` that dynamically displays:
- **For Pull Requests**: `PR #15 - Add dynamic workflow names`
- **For Push Events**: `main → push` or `feature-branch → push`
- **For Manual Triggers**: `branch-name → workflow_dispatch`

## Implementation
Add the following after line 1 in `.github/workflows/ci-cd.yml`:

```yaml
run-name: ${{ github.event_name == 'pull_request' && format('PR #{0} - {1}', github.event.pull_request.number, github.event.pull_request.title) || format('{0} → {1}', github.ref_name, github.event_name) }}
```

## Benefits
- ✅ Instantly identify which branch triggered the workflow
- ✅ See PR number and title directly in Actions dashboard
- ✅ Distinguish between push, PR, and manual workflow runs
- ✅ Easier debugging and monitoring of CI/CD pipelines
- ✅ Better team collaboration and visibility

## Acceptance Criteria
- [ ] `run-name` added to ci-cd.yml workflow file
- [ ] PR workflows display format: `PR #X - PR Title`
- [ ] Push workflows display format: `branch-name → push`
- [ ] Manual workflows display format: `branch-name → workflow_dispatch`
- [ ] Workflow runs visible in Actions dashboard with new naming
- [ ] Changes tested on test branch before merging to main

## References
- GitHub Actions run-name documentation: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#run-name
- Related workflow file: `.github/workflows/ci-cd.yml`
