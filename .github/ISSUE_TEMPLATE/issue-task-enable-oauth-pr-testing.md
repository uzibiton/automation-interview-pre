---
name: Enable OAuth testing in PR preview environments
about: Implement solution to test Google OAuth in PR environments without manual setup
title: 'TASK: Enable OAuth testing in PR preview environments'
labels: enhancement, authentication, ci-cd, testing
assignees: ''

---

## Description
Currently, Google OAuth testing cannot run on PR preview environments because each PR has a unique callback URL that must be manually added to Google Cloud Console. This blocks E2E tests for OAuth login/registration flows in PRs. Need automated solution.

## Problem
- Each PR creates unique auth service URL: `auth-service-pr-{N}-{id}.us-central1.run.app`
- Google OAuth requires exact callback URL whitelist
- Manual addition to Google Console is tedious and error-prone
- E2E tests for Google OAuth are skipped in PRs
- QA cannot test OAuth functionality in PR environments
- OAuth bugs only caught in staging/production

## Current State
**What Works:**
- ✅ Email/password authentication in PRs
- ✅ OAuth works locally (localhost callback URL)
- ✅ OAuth works in staging (manual setup)

**What Doesn't Work:**
- ❌ Google OAuth in PR environments
- ❌ E2E tests for OAuth in PRs
- ❌ Automated OAuth testing in CI/CD

## Proposed Solutions

### Solution 1: Development OAuth Client (Recommended)
Create separate OAuth client for non-production environments.

**Implementation:**
1. Create new OAuth 2.0 Client in Google Console
2. Name: "Development Client" or "Test Client"
3. Add callback URLs for common patterns:
   - `http://localhost:3001/auth/google/callback`
   - `https://auth-service-staging-*.us-central1.run.app/auth/google/callback`
   - Add ~20 PR URLs (pr-1 through pr-20)
4. Use different client ID/secret for non-production
5. Configure via environment variables

**Benefits:**
- ✅ Separate production from testing
- ✅ More permissive for development
- ✅ Can pre-populate common PR URLs
- ✅ Easy to manage

**Drawbacks:**
- Still need to add new PR URLs occasionally
- Two sets of credentials to manage

### Solution 2: OAuth Proxy Service
Create proxy service that handles OAuth for all PR environments.

**Implementation:**
1. Deploy single OAuth proxy service: `oauth-proxy.run.app`
2. Register only proxy URL in Google Console
3. Proxy forwards requests to correct PR environment
4. Route based on state parameter or session

**Benefits:**
- ✅ Single callback URL for all PRs
- ✅ No manual Google Console updates
- ✅ Fully automated

**Drawbacks:**
- Complex implementation
- Additional service to maintain
- Potential security concerns

### Solution 3: Wildcard Domain with Custom Domain (Advanced)
Use custom domain with wildcard DNS.

**Implementation:**
1. Register domain: `preview.yourapp.com`
2. Setup wildcard: `*.preview.yourapp.com`
3. Map PR environments: `pr-15.preview.yourapp.com`
4. Google allows: `https://*.preview.yourapp.com/auth/google/callback`

**Benefits:**
- ✅ True wildcard support
- ✅ Professional setup
- ✅ Works for all future PRs

**Drawbacks:**
- Requires custom domain
- Cloud Run custom domain setup
- Additional cost and complexity

### Solution 4: Mock OAuth in Tests (Partial Solution)
Mock Google OAuth for E2E tests in PR environments.

**Implementation:**
1. Detect PR environment in tests
2. Use mock OAuth provider instead of real Google
3. Bypass actual Google authentication
4. Test OAuth flow with fake credentials

**Benefits:**
- ✅ Tests can run without Google Console setup
- ✅ Faster tests (no external API calls)
- ✅ Deterministic test results

**Drawbacks:**
- Not testing real OAuth integration
- Bugs in actual OAuth flow won't be caught
- Still need manual testing for OAuth

## Recommended Approach

**Phase 1: Development OAuth Client (Quick Win)**
- Create separate OAuth client for dev/staging/PR
- Pre-populate 20-30 PR callback URLs
- Update CI/CD to use dev client for PRs

**Phase 2: Mock OAuth for E2E Tests**
- Add OAuth mocking to test suite
- Tests run automatically in all PRs
- Manual OAuth testing optional

**Phase 3: Custom Domain (Long-term)**
- When ready for production-grade setup
- Implement wildcard domain solution
- Remove dependency on manual setup

## Implementation Tasks

### Phase 1: Development OAuth Client

#### Google Console Setup
- [ ] Create new OAuth 2.0 Client ID
- [ ] Name: "Development & Testing Client"
- [ ] Add authorized origins
- [ ] Add callback URLs:
  - localhost
  - staging
  - PR patterns (pr-1 to pr-30)
- [ ] Copy Client ID and Secret

#### Environment Configuration
- [ ] Add secrets to GitHub:
  - `GOOGLE_CLIENT_ID_DEV`
  - `GOOGLE_CLIENT_SECRET_DEV`
- [ ] Update CI/CD workflow:
  - Use dev credentials for PR/staging
  - Use production credentials for production
- [ ] Update local .env files

#### Code Updates
- [ ] Auth service reads correct client ID based on env
- [ ] Frontend uses correct OAuth client
- [ ] Add environment detection logic

#### Documentation
- [ ] Document two OAuth client setup
- [ ] Update SETUP.md with instructions
- [ ] Add to deployment checklist

### Phase 2: OAuth Mocking

#### Test Infrastructure
- [ ] Install mock OAuth library (e.g., `msw`, `nock`)
- [ ] Create mock Google OAuth endpoints
- [ ] Mock token exchange
- [ ] Mock user info endpoint

#### Test Updates
- [ ] Detect test environment
- [ ] Enable mocks for PR environments
- [ ] Disable mocks for manual testing
- [ ] Update E2E tests to use mocks

#### CI/CD Integration
- [ ] Enable OAuth tests in PR workflows
- [ ] Run full authentication E2E suite
- [ ] Generate test reports

## Usage Examples

### With Development Client
```yaml
# .github/workflows/ci-cd.yml
- name: Set OAuth Client
  run: |
    if [ "${{ needs.setup.outputs.env_name }}" == "production" ]; then
      echo "GOOGLE_CLIENT_ID=${{ secrets.GOOGLE_CLIENT_ID }}" >> $GITHUB_ENV
      echo "GOOGLE_CLIENT_SECRET=${{ secrets.GOOGLE_CLIENT_SECRET }}" >> $GITHUB_ENV
    else
      echo "GOOGLE_CLIENT_ID=${{ secrets.GOOGLE_CLIENT_ID_DEV }}" >> $GITHUB_ENV
      echo "GOOGLE_CLIENT_SECRET=${{ secrets.GOOGLE_CLIENT_SECRET_DEV }}" >> $GITHUB_ENV
    fi
```

### With OAuth Mocking
```javascript
// tests/e2e/auth.spec.ts
test('Sign in with Google', async ({ page }) => {
  if (process.env.TEST_ENV === 'pr') {
    // Use mock OAuth
    await mockGoogleOAuth(page);
  }
  
  await page.click('[data-testid="google-sign-in"]');
  // ... rest of test
});
```

## Benefits
- ✅ OAuth E2E tests can run in PRs
- ✅ QA can test OAuth in PR environments
- ✅ Catch OAuth bugs earlier
- ✅ No manual Google Console updates per PR
- ✅ Consistent testing across environments
- ✅ Automated CI/CD coverage for OAuth

## Acceptance Criteria
- [ ] Development OAuth client created in Google Console
- [ ] PR environments use development client
- [ ] Production uses production client
- [ ] E2E tests for OAuth run in PR workflows
- [ ] Tests pass consistently
- [ ] Documentation updated
- [ ] QA can test OAuth in PRs without manual setup
- [ ] No breaking changes to existing functionality

## Technical Considerations
- Security: Keep prod and dev clients separate
- Credential management: Use GitHub Secrets
- Environment detection: Reliable logic to choose client
- Testing: Mock vs real OAuth trade-offs
- Monitoring: Track OAuth success rates per environment

## Success Metrics
- OAuth E2E tests run in 100% of PRs
- Zero manual Google Console updates for PR testing
- OAuth bugs caught in PR phase (not staging/production)
- Reduced time to test authentication features

## Future Enhancements (Out of Scope)
- Support for multiple OAuth providers (Facebook, GitHub, etc.)
- Custom domain with wildcard for clean PR URLs
- OAuth proxy service for ultimate flexibility
- Automated OAuth credential rotation

## References
- Current OAuth setup: `doc/SETUP.md`
- Auth service: `app/services/auth-service/`
- Google Console: https://console.cloud.google.com/apis/credentials
- E2E tests: `tests/e2e/`
- CI/CD workflow: `.github/workflows/ci-cd.yml`
