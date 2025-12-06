# Issue Template Tracking

This file tracks which issue templates have been created as actual GitHub issues.

## Legend
- ✅ Created - Issue opened in GitHub
- 🔄 In Progress - Issue assigned/being worked on
- ❓ Similar - Existing issue might cover this
- ⏳ Pending - Not yet created

---

## Issue Templates Status

### Tasks
- ⏳ `issue-task-clean-users-firestore.md` - Add script to clean/manage users in Firestore
- ⏳ `issue-task-enable-oauth-pr-testing.md` - Enable OAuth testing in PR preview environments
- ⏳ `issue-task-reset-and-seed-database.md` - Add script to reset database and populate with random data
- ⏳ `issue-task-run-without-docker.md` - Add support for running application locally without Docker
- ✅ `issue-task-separate-graph-and-table-pages.md` - Separate expense graph and table into different pages
  - **Issue**: #20 (Copilot assigned)
  - **Status**: In development
- ⏳ `issue-task-skip-ci-with-merge-protection.md` - Add support for skipping CI with merge protection
- ⏳ `issue-task-timeout-cleanup-pr-envs.md` - Add timeout-based cleanup for abandoned PR environments
- ⏳ `issue-task-workflow-run-names.md` - Add dynamic workflow run names to show branch and trigger event

### Bugs
- ⏳ `bug-oauth-redirect-uri-mismatch.md` - Google OAuth fails on staging with redirect_uri_mismatch error

### Features
- ⏳ `feature-user-groups-and-admin.md` - Add user groups, admin role, and user invitation system

### Templates (Reusable)
- `template-bug-report.md` - General bug report template
- `template-feature-request.md` - General feature request template
- `template-task.md` - General task template
- `template-test-case.md` - Test case template

---

## Notes

### How to Update This File
When creating a new issue from a template:
1. Change status from ⏳ to ✅
2. Add issue number and link
3. Add any relevant notes

### Fuzzy Matching Guidelines
When checking if an issue already exists, I'll look for:
- **Exact title match** - Same or very similar title
- **Similar description** - Core problem/solution matches
- **Same labels** - Similar categorization
- **Content overlap** - 70%+ of key points match

**When unsure, I'll ask you:**
- "Found issue #X with similar title, is this the same?"
- "Issue #Y covers part of this, should we merge or keep separate?"

### Example Entry Format
```
- ✅ `template-name.md` - Brief description
  - **Issue**: #123
  - **Created**: 2025-12-06
  - **Status**: Open/In Progress/Closed
  - **Notes**: Any relevant context
```

---

**Last Updated**: December 6, 2025
