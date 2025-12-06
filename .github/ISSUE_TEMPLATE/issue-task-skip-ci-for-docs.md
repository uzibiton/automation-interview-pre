---
name: Skip CI for Documentation Changes
about: Configure CI to run only for code and configuration changes, not documentation
title: '[TASK] Skip CI for Documentation Changes'
labels: ['task', 'ci-cd', 'optimization']
assignees: ''
---

## Description
Currently, every commit triggers the full CI/CD pipeline, including commits that only change documentation files. This wastes CI resources and time, especially when working on documentation updates.

## Problem
- Documentation commits (e.g., to `doc/`, `README.md`, `.github/ISSUE_TEMPLATE/`) trigger full CI pipeline
- CI runs tests, builds Docker images, and deploys preview environments unnecessarily
- Slows down documentation work and uses GitHub Actions minutes

## Proposed Solution
Configure CI workflow to skip execution for documentation-only changes using `paths-ignore` or conditional execution.

## Acceptance Criteria
- [ ] CI skips when only documentation files are changed:
  - `doc/**`
  - `*.md` (root level)
  - `.github/ISSUE_TEMPLATE/**`
  - `README.md`, `RUN-LOCALLY.md`, etc.
- [ ] CI runs for code changes:
  - `app/**`
  - `services/**`
  - `tests/**`
  - `.github/workflows/**`
  - `docker-compose.yml`
  - `package.json`, `package-lock.json`
- [ ] CI can be manually triggered even for doc changes (workflow_dispatch)
- [ ] Clear message in GitHub UI when CI is skipped

## Implementation Options

### Option 1: paths-ignore (Simple)
```yaml
on:
  push:
    branches: [ main, 'copilot/**', 'test/**', 'feature/**' ]
    paths-ignore:
      - 'doc/**'
      - '*.md'
      - '.github/ISSUE_TEMPLATE/**'
  pull_request:
    branches: [ main ]
    paths-ignore:
      - 'doc/**'
      - '*.md'
      - '.github/ISSUE_TEMPLATE/**'
  workflow_dispatch:
```

**Pros:** Simple, clear
**Cons:** All-or-nothing (entire workflow skipped)

### Option 2: Conditional Jobs (Flexible)
```yaml
jobs:
  check-changes:
    runs-on: ubuntu-latest
    outputs:
      code-changed: ${{ steps.filter.outputs.code }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            code:
              - 'app/**'
              - 'services/**'
              - 'tests/**'
              - '.github/workflows/**'

  build:
    needs: check-changes
    if: needs.check-changes.outputs.code-changed == 'true'
    runs-on: ubuntu-latest
    # ... rest of build job
```

**Pros:** Granular control, can run some jobs but not others
**Cons:** More complex, requires paths-filter action

### Option 3: Skip Condition in Job (Hybrid)
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Check for code changes
        id: check
        run: |
          FILES=$(git diff --name-only ${{ github.event.before }} ${{ github.sha }})
          if echo "$FILES" | grep -qvE '^(doc/|.*\.md$|\.github/ISSUE_TEMPLATE/)'; then
            echo "code-changed=true" >> $GITHUB_OUTPUT
          else
            echo "code-changed=false" >> $GITHUB_OUTPUT
          fi
      
      - name: Build
        if: steps.check.outputs.code-changed == 'true'
        # ... build steps
```

**Pros:** No extra actions, full control
**Cons:** Bash scripting in workflow, harder to maintain

## Recommended Approach
**Option 1 (paths-ignore)** is recommended for simplicity. It clearly documents what triggers CI and keeps the workflow readable.

## Files to Modify
- `.github/workflows/ci-cd.yml` - Add paths-ignore to trigger conditions

## Testing
1. Commit documentation-only changes → CI should skip
2. Commit code changes → CI should run
3. Commit mixed changes (doc + code) → CI should run
4. Manually trigger workflow → CI should run regardless

## Additional Considerations
- [ ] Update documentation to explain when CI runs
- [ ] Consider adding a "docs-only" label to PRs that skip CI
- [ ] Ensure merge protection rules still work (may need to mark jobs as required/not-required)

## References
- [GitHub Actions: paths-ignore](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)
- [dorny/paths-filter action](https://github.com/dorny/paths-filter)

## Related Issues
- #XX - Skip CI with merge protection (similar discussion)
