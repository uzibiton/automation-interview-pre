# Development Insights & Best Practices

This document captures learnings, patterns, and best practices discovered during development of this project.

## Table of Contents

- [Bug Fixing Workflow](#bug-fixing-workflow)
- [CI/CD Challenges](#cicd-challenges)
- [Testing Strategy](#testing-strategy)
- [Deployment Patterns](#deployment-patterns)

---

## Bug Fixing Workflow

### Question: Should bugs be fixed before or after PR review?

**Real-world best practices:**

#### Fix Before Review (Recommended for CI-caught issues)

**When:**

- Bug is caught by automated tests (CI/CD)
- Bug is obvious and quick to fix (typo, syntax error)
- Bug blocks the main feature from working
- You're still in active development on the PR

**Why:**

- ✅ Reviewers see clean, working code
- ✅ Saves reviewer time (no review wasted on broken code)
- ✅ Shows attention to quality
- ✅ Faster merge (no "fix and re-review" cycle)

**Process:**

1. CI fails or obvious bug discovered
2. Fix immediately in same branch
3. Push fix
4. Wait for CI to pass
5. Request review only when green ✅

**Important Note:** CI doesn't catch everything! See "Early QA Intervention" below.

#### Fix After Review Started (Sometimes necessary)

**When:**

- Bug is found during code review
- Bug is in edge case reviewer discovered
- Breaking change in main branch causes conflict
- Bug is environment-specific (works locally, fails in staging)

**Why:**

- ✅ Reviewer is already engaged
- ✅ Shows responsiveness to feedback
- ✅ Some bugs only visible to fresh eyes

**Process:**

1. Review submitted -> bug found
2. Comment acknowledging the bug
3. Push fix quickly
4. Comment "Fixed in commit abc123"
5. Re-request review if needed

#### Early QA Intervention (Real-world QA perspective)

**The Reality:** CI only catches technical bugs, not:

- UX issues
- Requirements misalignment
- Missing functionality
- Edge cases not covered by tests
- Visual/design problems
- Integration issues between services

**QA-Developer Collaboration Pattern:**

1. **Developer Self-Check Phase**
   - Fix CI failures
   - Manual smoke test locally
   - Check requirements/acceptance criteria

2. **Stable Branch Notification**
   - Developer: "Feature branch is stable and ready for QA review"
   - Branch: `feature/xyz` or PR preview environment
   - CI: Green ✅ (but this doesn't mean bug-free!)

3. **Early QA Testing (Before Code Review)**
   - QA tests the feature manually
   - Validates against requirements
   - Finds bugs CI doesn't catch
   - Documents findings in PR comments or separate issue

4. **Bug Fixing Cycle**
   - Developer fixes QA-found bugs
   - QA retests
   - Iterate until QA approves

5. **Code Review Phase**
   - Only after QA approval (or in parallel)
   - Reviewers focus on code quality, not functionality
   - Both QA and code review must pass before merge

**Benefits:**

- ✅ Catches bugs early (cheaper to fix)
- ✅ QA has time to prepare test coverage
- ✅ Requirements validation happens before code review
- ✅ Reviewers don't waste time on broken features
- ✅ Higher quality merges to main

**Process Flow:**

```
Developer -> Stable Branch -> QA Testing -> Bug Fixes -> QA Approval
                                                          ↓
                                              Code Review -> Merge
```

**Communication Pattern:**

- Developer: "Branch `feature/xyz` ready for QA - PR preview at [URL]"
- QA: Tests, finds 3 bugs, comments on PR
- Developer: Fixes bugs, pushes, comments "Fixed in commit abc123"
- QA: Retests, approves
- Developer: Requests code review from team
- Team: Reviews code (knowing feature is already QA-approved)

#### The Golden Rule:

**"Never request review on a failing build"**

- Always wait for CI to be green before asking for review
- Exception: If you specifically want help debugging a CI failure

**The QA Corollary:**
**"Green CI doesn't mean ready for merge - QA validation is separate"**

- CI = Technical correctness (syntax, tests pass)
- QA = Functional correctness (requirements, UX, edge cases)
- Both needed before merge

---

## CI/CD Challenges

### Challenge: "Works Locally, Fails in CI/Deploy"

**Common Causes:**

1. **Environment Variables**
   - Missing in CI
   - Different values in CI vs local
   - Secrets not configured

2. **Database/Dependencies**
   - Different versions
   - Missing seed data
   - Connection strings differ

3. **File Paths**
   - Absolute vs relative paths
   - Case sensitivity (Linux vs Windows)
   - Missing directories

4. **Build Context**
   - Docker build context differences
   - Node modules not installed
   - Different Node/npm versions

5. **Service Communication**
   - Localhost vs service names in Docker
   - Port conflicts
   - Network configuration

### Solution 1: CI Integration Testing (Recommended)

Add a stage to CI that runs full Docker stack:

```yaml
integration-test:
  runs-on: ubuntu-latest
  steps:
    - name: Start full stack
      run: docker-compose up -d

    - name: Wait for services
      run: sleep 30

    - name: Run smoke tests
      run: npm run test:integration

    - name: Cleanup
      run: docker-compose down
```

**Benefits:**

- Catches environment issues before deploy
- Tests service-to-service communication
- Validates Docker configuration
- Builds confidence in deploys

### Solution 2: Local CI Simulation

Run CI commands locally before pushing:

```bash
# Simulate CI build
docker-compose -f docker-compose.test.yml build

# Simulate CI tests
docker-compose -f docker-compose.test.yml run --rm test-runner

# Simulate deployment
./scripts/deploy-dry-run.sh
```

### Solution 3: Error Reporting Workflow

When remote deploy fails:

**Option A: Quick Fix (Recommended)**

1. Copy error from CI/logs
2. Share with team/AI assistant in chat
3. Fix immediately
4. Push and verify

**Option B: Tracked Fix (For complex bugs)**

1. Create GitHub issue with error details
2. Link issue to PR
3. Fix and reference issue in commit
4. Close issue when merged

**When to use which:**

- **Option A**: Obvious fixes, typos, missing imports, config errors
- **Option B**: Complex bugs, unclear root cause, needs investigation, affects multiple PRs

---

## Testing Strategy

### Test Pyramid for This Project

```
        /\
       /  \  E2E (Playwright - 6 tests)
      /____\
     /      \  Integration (API + Service)
    /________\
   /          \  Unit (Jest - per service)
  /____________\
```

### Testing Levels

1. **Unit Tests** (Fast, many)
   - Individual functions/components
   - No external dependencies
   - Run on every commit

2. **Integration Tests** (Medium, moderate)
   - Service-to-service communication
   - Database interactions
   - API contract validation

3. **E2E Tests** (Slow, few)
   - Full user workflows
   - Browser automation
   - Critical paths only

### CI Testing Flow

```
Push -> Unit Tests -> Integration Tests -> E2E Tests -> Deploy
       (2 min)      (5 min)            (10 min)     (if green)
```

---

## Deployment Patterns

### Current Setup

**Environments:**

- **Local**: Docker Compose
- **PR Preview**: Cloud Run (per-PR environments)
- **Staging**: Cloud Run (auto-deploy from main)
- **Production**: Cloud Run (manual approval)

### PR Preview Environments

**Lifecycle:**

1. PR opened -> Deploy to `service-pr-{number}`
2. PR updated -> Redeploy
3. PR closed -> Auto-cleanup (via workflow)
4. Timeout -> Cleanup after 30 days (proposed)

**Benefits:**

- Test in production-like environment
- Share working demo with stakeholders
- Catch deployment issues early
- No impact on staging/production

---

## Lessons Learned

### 1. Always Run Tests Locally First

Before pushing:

```bash
npm run test:unit
npm run test:e2e:local
docker-compose up  # Verify services start
```

### 2. Fix CI Failures Immediately

- Don't let broken builds linger
- Don't request review on red builds
- Quick fixes show professionalism

### 3. Use Descriptive Commit Messages

Bad: `fix bug`
Good: `fix: Correct API endpoint path in frontend config`

### 4. Test Deployment Changes in PR Previews

- Don't wait for staging to catch deploy issues
- Use PR previews as pre-staging validation

### 5. Document Decisions

- Add insights to this file
- Update README when processes change
- Keep team aligned

---

## Common Deployment Issues

### Issue: OAuth Redirect URI Mismatch

**Symptom:** Google Sign-In works locally but fails on staging/production with `Error 400: redirect_uri_mismatch`

**Root Cause:** Google Cloud Console doesn't have staging/production URLs in authorized redirect URIs

**Solution:**

1. Get deployed auth service URL from Cloud Run
2. Add `{auth-service-url}/auth/google/callback` to Google Console
3. Wait 1-2 minutes for propagation
4. Test authentication

**Prevention:** Add OAuth setup to deployment checklist

### Issue: Shared Firestore Database

**Symptom:** Test users accumulate across all environments (local, staging, production)

**Root Cause:** All environments use same Firestore database

**Impact:**

- Cannot start with clean database state
- Test data pollutes production
- Manual cleanup is tedious

**Short-term Solution:** Create user cleanup script
**Long-term Solution:** Separate Firestore per environment + use Firestore emulator locally

---

## Future Improvements

### Proposed Enhancements

1. ✅ Add CI integration test stage (run full Docker stack)
2. ⏳ Add timeout-based PR environment cleanup
3. ⏳ Improve error reporting (send CI failures to Slack)
4. ⏳ Add deployment smoke tests (verify services after deploy)
5. ⏳ Create deployment rollback automation
6. ⏳ Separate Firestore databases per environment
7. ⏳ Use Firestore emulator for local development

### Questions to Address

- Should we add visual regression testing?
- How to handle database migrations in PR previews?
- Should E2E tests run against PR previews?
- How to manage OAuth configuration for PR preview environments?

---

## Contributing to This Document

This is a living document. When you learn something valuable:

1. Add it to the relevant section
2. Use clear examples
3. Explain the "why" not just the "what"
4. Update table of contents if needed

**Last Updated:** December 6, 2025
