---
name: Fix Google OAuth redirect URI mismatch for staging
about: Add staging auth service URL to Google Console authorized redirect URIs
title: 'BUG: Google OAuth fails on staging with redirect_uri_mismatch error'
labels: bug, authentication, deployment, staging
assignees: ''

---

## Bug Description
Google Sign-In fails on staging environment with error:
```
Error 400: redirect_uri_mismatch
Access blocked: This app's request is invalid
```

Email/password authentication works correctly. Only Google OAuth is affected.

## Environment
- **Affected**: Staging (Cloud Run)
- **Working**: Local development
- **Status**: Blocking Google authentication on staging

## Root Cause
The staging auth service URL is not registered in Google Cloud Console as an authorized redirect URI.

**Current authorized URIs** (in Google Console):
- ✅ `http://localhost:3001/auth/google/callback` (local)
- ❓ Staging URL missing

**Needed URI**:
- ❌ `https://auth-service-staging-{project-id}.us-central1.run.app/auth/google/callback`

## Steps to Reproduce
1. Deploy to staging (or access existing staging environment)
2. Navigate to staging frontend URL
3. Click "Sign in with Google"
4. Get error 400: redirect_uri_mismatch

## Expected Behavior
- User should be redirected to Google OAuth consent screen
- After authorization, redirect back to staging frontend
- User successfully signed in

## Actual Behavior
- Google blocks the request
- Error message displayed
- No authentication occurs

## Solution

### Step 1: Get Staging Auth Service URL
```bash
gcloud run services describe auth-service-staging --region us-central1 --format="value(status.url)"
```

Output example: `https://auth-service-staging-773292472093.us-central1.run.app`

### Step 2: Update Google Cloud Console
1. Go to https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", click "+ ADD URI"
4. Add: `https://auth-service-staging-{your-id}.us-central1.run.app/auth/google/callback`
5. Click "Save"

### Step 3: Verify Fix
1. Wait 1-2 minutes for changes to propagate
2. Try signing in with Google on staging
3. Should work successfully

## Additional Context

### Current Configuration
The CI/CD workflow correctly sets the callback URL:
```yaml
GOOGLE_CALLBACK_URL="$AUTH_URL/auth/google/callback"
```

The application configuration is correct. The issue is in Google Console configuration.

### For PR Preview Environments
Each PR preview also needs its own redirect URI:
```
https://auth-service-pr-{PR_NUMBER}-{project-id}.us-central1.run.app/auth/google/callback
```

**Options:**
1. Add each PR environment manually (tedious)
2. Use wildcard (not supported by Google)
3. Use different OAuth client for testing (recommended)

### Recommended: Testing OAuth Client
Create a separate OAuth client for PR previews:
- Production Client: For staging/production only
- Development Client: For local + PR previews (less restrictive)

## Tasks
- [ ] Get current staging auth service URL
- [ ] Add redirect URI to Google Cloud Console
- [ ] Test Google Sign-In on staging
- [ ] Verify email/password still works
- [ ] Document correct URIs in `doc/SETUP.md`
- [ ] Consider creating development OAuth client for PR previews
- [ ] Add to deployment checklist

## Documentation to Update
- [ ] `doc/SETUP.md` - Add staging URL to authorized URIs list
- [ ] `doc/DEPLOYMENT.md` - Add OAuth configuration step
- [ ] `.github/workflows/ci-cd.yml` - Add comment about Google Console setup

## Prevention
Add to deployment checklist:
1. Deploy new environment
2. Get auth service URL
3. Add to Google Console redirect URIs
4. Test authentication

## References
- Google OAuth Setup: `doc/SETUP.md`
- Auth Service: `app/services/auth-service/`
- Deployment Workflow: `.github/workflows/ci-cd.yml`
- Google Console: https://console.cloud.google.com/apis/credentials

## Priority
**HIGH** - Blocks testing of authentication on staging environment
