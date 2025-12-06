---
name: Support commits that skip CI with merge protection
about: Allow commits to skip CI while maintaining branch protection rules
title: 'TASK: Add support for skipping CI with merge protection'
labels: enhancement, ci-cd, workflow
assignees: ''

---

## Description
Add capability to commit and push changes without triggering CI/CD pipeline, while ensuring that branch protection rules prevent merging when tests haven't run. This is useful for documentation-only changes, work-in-progress commits, or commits that don't require full CI validation.

## Problem
- Every commit triggers the full CI/CD pipeline, even for minor changes
- No way to skip CI for documentation-only or WIP commits
- Cannot distinguish between "tests failed" and "tests not run"
- Wastes CI/CD minutes and time for non-code changes
- Developers need option to skip CI while maintaining merge safety

## Proposed Solution
Implement a system where:
1. Commits can include `[skip ci]` or `[ci skip]` in commit message to skip CI
2. When CI is skipped, a neutral status check marks tests as "not run"
3. Branch protection rules prevent merge when status is "not run"
4. Same protection as failed tests - merge disabled until tests pass

## Implementation Tasks

### Workflow Configuration
- [ ] Update `.github/workflows/ci-cd.yml` to respect skip CI keywords
- [ ] Add conditional check at workflow start:
  ```yaml
  if: "!contains(github.event.head_commit.message, '[skip ci]') && !contains(github.event.head_commit.message, '[ci skip]')"
  ```
- [ ] Test that workflow doesn't trigger with skip keywords

### Status Check Workflow
- [ ] Create new workflow file `.github/workflows/ci-status-check.yml`
- [ ] This workflow always runs (even when main CI is skipped)
- [ ] Checks if main CI was skipped via commit message
- [ ] If skipped, posts neutral/pending status check
- [ ] Status check title: "CI Tests - Not Run (Skipped)"
- [ ] Status check description: "Tests were skipped. Run full CI before merging."

### Branch Protection Rules
- [ ] Update GitHub branch protection settings for `main`
- [ ] Require status check "CI Tests" or equivalent
- [ ] Ensure neutral/pending status blocks merge (same as failure)
- [ ] Document required status checks in README

### Documentation
- [ ] Add section to README.md explaining skip CI usage
- [ ] Document commit message formats:
  - `[skip ci]` - Skip CI pipeline
  - `[ci skip]` - Alternative format
  - `docs: Update README [skip ci]` - Example
- [ ] Explain merge protection behavior
- [ ] Add guidelines for when to skip CI (docs only, typo fixes, etc.)
- [ ] Add warning that PR cannot merge with skipped CI

### Alternative Approach (GitHub Actions)
If neutral status doesn't block merge, implement fallback:
- [ ] Create required status check that always runs
- [ ] If main CI skipped, this check reports as "failed"
- [ ] Failure message: "CI tests not run - cannot merge"
- [ ] Add manual approval option or "Run CI" button

## Usage Examples

### Skip CI for Documentation
```bash
git commit -m "docs: Fix typo in README [skip ci]"
git push origin feature-branch
```

### Skip CI for Work in Progress
```bash
git commit -m "WIP: Refactoring auth service [ci skip]"
git push origin wip-branch
```

### Force CI Run (Normal)
```bash
git commit -m "feat: Add new expense category feature"
git push origin feature-branch
# CI runs automatically
```

## Benefits
- ✅ Save CI/CD minutes on documentation changes
- ✅ Faster pushes for WIP commits
- ✅ Maintain merge safety - cannot merge without tests
- ✅ Clear status indication when tests not run
- ✅ Flexible workflow for different commit types
- ✅ Reduced CI queue congestion
- ✅ Better resource utilization

## Acceptance Criteria
- [ ] Commits with `[skip ci]` don't trigger main CI/CD pipeline
- [ ] Commits with `[ci skip]` don't trigger main CI/CD pipeline
- [ ] Status check shows "Tests not run" when CI skipped
- [ ] Branch protection prevents merge when tests not run
- [ ] Normal commits (without skip keywords) run full CI
- [ ] PR view clearly shows CI was skipped
- [ ] Documentation updated with usage instructions
- [ ] Team informed of new capability
- [ ] Tested on multiple commit scenarios

## Technical Implementation

### Sample Workflow Condition
```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  check-skip:
    runs-on: ubuntu-latest
    outputs:
      skip_ci: ${{ steps.check.outputs.skip_ci }}
    steps:
      - name: Check for skip CI
        id: check
        run: |
          if [[ "${{ github.event.head_commit.message }}" =~ \[skip\ ci\]|\[ci\ skip\] ]]; then
            echo "skip_ci=true" >> $GITHUB_OUTPUT
          else
            echo "skip_ci=false" >> $GITHUB_OUTPUT
          fi
  
  run-tests:
    needs: check-skip
    if: needs.check-skip.outputs.skip_ci != 'true'
    runs-on: ubuntu-latest
    steps:
      # ... existing test steps
```

### Sample Status Check Workflow
```yaml
name: CI Status Check

on: [push, pull_request]

jobs:
  status:
    runs-on: ubuntu-latest
    steps:
      - name: Check CI Status
        run: |
          if [[ "${{ github.event.head_commit.message }}" =~ \[skip\ ci\]|\[ci\ skip\] ]]; then
            echo "::error::CI tests were skipped. Run full CI before merging."
            exit 1
          fi
```

## Considerations
- Ensure branch protection rules properly configured
- Test behavior in PRs vs direct pushes
- Consider if some checks should always run (security scans?)
- Document any exceptions to skip CI rule
- Consider adding GitHub Action button to manually trigger CI
- May need repository admin access to configure protection rules

## References
- GitHub Actions: Skip workflows - https://docs.github.com/en/actions/managing-workflow-runs/skipping-workflow-runs
- Branch protection rules - https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- Status checks - https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks
- Current workflow: `.github/workflows/ci-cd.yml`
