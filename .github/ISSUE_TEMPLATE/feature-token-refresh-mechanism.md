---
name: Feature - Token Refresh Mechanism
about: Implement automatic token refresh to prevent user session interruption
title: '[FEATURE] Implement Token Refresh Mechanism'
labels: ['feature', 'authentication', 'security', 'backend', 'frontend']
assignees: ''
---

## Description
**Found During:** PR #19 code review - discussing auth token expiration

Currently, JWT tokens may expire while users are actively using the application, forcing them to log in again and potentially losing their work. Implement a token refresh mechanism to automatically renew tokens before they expire.

## Problem

**Without Token Refresh:**
- Users get logged out unexpectedly after token expires
- Lost work if filling out forms
- Poor user experience (constant re-logins)
- Confusion ("Why did I get logged out?")

**Example User Journey (Bad):**
```
1. User logs in at 9:00 AM (token expires at 1:00 PM)
2. User actively using app from 12:00 PM - 2:00 PM
3. At 1:00 PM, token silently expires
4. User tries to add expense at 1:30 PM → 401 Error
5. User gets kicked to login page
6. User frustrated, has to log in again
```

## Proposed Solution

Implement **Refresh Token Pattern**:
1. Issue two tokens on login:
   - **Access Token** (short-lived, 15-30 minutes)
   - **Refresh Token** (long-lived, 7-30 days)
2. Frontend uses access token for API requests
3. When access token expires, automatically use refresh token to get new access token
4. User stays logged in without interruption

## User Story

**As a user,**
- I want to stay logged in while actively using the app
- So that I don't lose my work or get interrupted with login screens

## Architecture

### Backend Changes

#### 1. Update Login Endpoint
```javascript
POST /api/auth/login
Response:
{
  "accessToken": "eyJhbGc...",  // 15-30 min expiration
  "refreshToken": "eyJhbGc...", // 7-30 days expiration
  "expiresIn": 900,              // seconds until access token expires
  "user": { ... }
}
```

#### 2. New Refresh Endpoint
```javascript
POST /api/auth/refresh
Headers:
  Authorization: Bearer <refresh_token>

Response:
{
  "accessToken": "eyJhbGc...",  // New access token
  "expiresIn": 900
}

Errors:
  400 - No refresh token provided
  401 - Invalid or expired refresh token
  403 - Refresh token revoked
```

#### 3. Token Storage
- Store refresh tokens in database with:
  - User ID
  - Token hash (not plain text)
  - Issued at
  - Expires at
  - Revoked flag (for logout)

### Frontend Changes

#### 1. Store Both Tokens
```typescript
// Store tokens securely
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
localStorage.setItem('tokenExpiresAt', Date.now() + response.expiresIn * 1000);
```

#### 2. Auto-Refresh Logic
```typescript
// Before each API call, check if token is about to expire
async function makeApiCall() {
  const expiresAt = parseInt(localStorage.getItem('tokenExpiresAt'));
  const now = Date.now();
  const timeUntilExpiry = expiresAt - now;
  
  // Refresh if token expires in less than 5 minutes
  if (timeUntilExpiry < 5 * 60 * 1000) {
    await refreshAccessToken();
  }
  
  // Proceed with API call
  return fetch('/api/expenses', {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  });
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` }
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('tokenExpiresAt', Date.now() + data.expiresIn * 1000);
  } else {
    // Refresh token invalid/expired → logout user
    logout();
  }
}
```

#### 3. Handle 401 Responses
```typescript
// API interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await refreshAccessToken();
        // Retry original request with new token
        return apiClient.request(error.config);
      } catch {
        // Refresh failed → logout
        logout();
      }
    }
    return Promise.reject(error);
  }
);
```

## Acceptance Criteria

### Backend
- [ ] Login endpoint returns both access and refresh tokens
- [ ] Access token expires in 15-30 minutes (configurable)
- [ ] Refresh token expires in 7-30 days (configurable)
- [ ] `/api/auth/refresh` endpoint implemented
- [ ] Refresh tokens stored in database
- [ ] Refresh tokens can be revoked on logout
- [ ] Old refresh tokens are cleaned up (expired ones deleted)
- [ ] Secure token generation (cryptographically random)
- [ ] Tokens include proper claims (user ID, expiration, issued at)

### Frontend
- [ ] Store both tokens securely
- [ ] Automatically refresh access token before expiration
- [ ] Retry failed requests after token refresh
- [ ] Logout if refresh token is invalid/expired
- [ ] Show user-friendly message on session expiration
- [ ] Clear tokens on logout
- [ ] Handle multiple tabs (token refresh in one tab updates others)

### Security
- [ ] Refresh tokens stored as hashes in database (not plain text)
- [ ] Refresh tokens transmitted over HTTPS only
- [ ] Tokens include standard JWT claims (exp, iat, nbf)
- [ ] Rate limiting on refresh endpoint (prevent abuse)
- [ ] Refresh token rotation (optional: issue new refresh token on each refresh)
- [ ] Revoked tokens cannot be used

### UX
- [ ] User never sees unexpected "Session expired" errors during active use
- [ ] Smooth token refresh (no UI flicker/interruption)
- [ ] Clear message if session truly expired (after 30 days idle)
- [ ] Logout button revokes refresh token

### Testing
- [ ] Unit tests for token generation and validation
- [ ] Integration tests for refresh endpoint
- [ ] E2E test: User stays logged in after access token expires
- [ ] E2E test: User logged out after refresh token expires
- [ ] E2E test: Multiple tabs handle refresh correctly
- [ ] Security test: Cannot use revoked refresh token
- [ ] Security test: Cannot use expired refresh token

## Implementation Steps

### Phase 1: Backend (4-6 hours)
1. Add `refresh_tokens` table to database
2. Update login logic to issue both tokens
3. Implement `/api/auth/refresh` endpoint
4. Add token revocation on logout
5. Add cleanup job for expired refresh tokens

### Phase 2: Frontend (3-4 hours)
1. Update auth service to store both tokens
2. Implement auto-refresh logic
3. Add API interceptor for 401 handling
4. Test token refresh flow

### Phase 3: Testing (2-3 hours)
1. Write unit and integration tests
2. Write E2E tests
3. Manual testing with short-lived tokens

### Phase 4: Documentation (1 hour)
1. Update API documentation
2. Update security documentation
3. Add developer guide for token management

## Configuration

**Environment Variables:**
```bash
# Auth Service
JWT_ACCESS_TOKEN_SECRET=<secret>
JWT_REFRESH_TOKEN_SECRET=<different_secret>
ACCESS_TOKEN_EXPIRATION=30m
REFRESH_TOKEN_EXPIRATION=30d

# Optional: Token rotation
ROTATE_REFRESH_TOKENS=true
```

## Security Considerations

### Do's
✅ Use different secrets for access and refresh tokens
✅ Store refresh tokens as hashes in database
✅ Implement token revocation
✅ Rate limit refresh endpoint
✅ Use HTTPS only
✅ Rotate refresh tokens (issue new one on each refresh)
✅ Set appropriate expiration times

### Don'ts
❌ Store tokens in cookies without HttpOnly flag
❌ Store refresh tokens in localStorage on untrusted devices
❌ Reuse same secret for all token types
❌ Allow refresh tokens to never expire
❌ Forget to revoke tokens on logout
❌ Store plain text refresh tokens in database

## Alternative Solutions

### Option 1: Sliding Session (Simpler)
- Single long-lived token (24 hours)
- Extend expiration on each API call
- **Pros:** Simpler to implement
- **Cons:** Less secure, harder to revoke

### Option 2: No Refresh Token (Current State?)
- Access token expires, user logs out
- **Pros:** Very simple
- **Cons:** Poor UX, users frustrated

### Option 3: Refresh Token Pattern (Recommended)
- Dual tokens, automatic refresh
- **Pros:** Secure, great UX
- **Cons:** More complex

## Priority
**Medium-High** - Important for UX, but verify if already implemented first

## Dependencies
- First complete: Task #XX - Test Auth Token Expiration (to verify current behavior)

## Related Issues
- #XX - Task: Test Auth Token Expiration
- Security audit of authentication system

## References
- [OAuth 2.0 Refresh Tokens](https://tools.ietf.org/html/rfc6749#section-1.5)
- [JWT Refresh Token Best Practices](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
