---
name: Task - Test Auth Token Expiration
about: Add tests for authentication token expiration and refresh behavior
title: '[TASK] Test Auth Token Expiration and Session Handling'
labels: ['task', 'testing', 'authentication', 'security']
assignees: ''
---

## Description
**Found During:** PR #19 code review - discussing `refreshKey` vs token expiration

Currently, there are no explicit tests for authentication token expiration behavior. We need to verify:
1. Does the auth token expire?
2. What happens when token expires?
3. Is there a token refresh mechanism?
4. How does the UI handle expired tokens?

## Problem
Without testing token expiration:
- Users might get stuck with expired tokens
- Silent failures could occur
- Security vulnerabilities (tokens that never expire)
- Poor user experience (unexpected logouts, lost work)
- Unknown behavior in production

## Acceptance Criteria

### Investigation Phase
- [ ] Determine current token expiration configuration
  - Check JWT settings in auth service
  - Find token TTL (time to live)
  - Check if token refresh is implemented
- [ ] Document current behavior
  - What happens when token expires?
  - Does user get logged out automatically?
  - Is there a refresh token mechanism?
  - Are there any error messages shown?

### Test Implementation Phase
- [ ] **Unit Tests** - Token validation logic
  - Test token creation with expiration
  - Test token validation (valid vs expired)
  - Test token parsing and claims extraction

- [ ] **Integration Tests** - API behavior with expired tokens
  - API request with valid token → Success
  - API request with expired token → 401 Unauthorized
  - API request with no token → 401 Unauthorized
  - API request with invalid token → 401 Unauthorized

- [ ] **E2E Tests** - User experience with token expiration
  - **Test 1**: Token expires while user is active
    - Set short token TTL (e.g., 1 minute)
    - Login user
    - Wait for token to expire
    - Try to perform action (add expense)
    - **Expected**: User redirected to login OR token auto-refreshed
  
  - **Test 2**: Token expires while user is idle
    - Login user
    - Leave page idle until token expires
    - Refresh page
    - **Expected**: User redirected to login
  
  - **Test 3**: Token refresh (if implemented)
    - Login user
    - Perform actions continuously
    - Verify token gets refreshed before expiration
    - **Expected**: User stays logged in
  
  - **Test 4**: Multiple tabs with same user
    - Login in tab 1
    - Open tab 2 (same user)
    - Token expires
    - **Expected**: Both tabs handle expiration gracefully

### Documentation Phase
- [ ] Document token expiration behavior in README
- [ ] Document how to test token expiration locally
- [ ] Add token expiration to security documentation

## Technical Details

### Current Token Flow (To Verify)
```
1. User logs in → Auth service issues JWT token
2. Token stored in localStorage (or cookies?)
3. Frontend includes token in API requests (Authorization header)
4. Backend validates token on each request
5. Token expires after X hours
6. What happens next? ← THIS IS THE QUESTION
```

### Token Expiration Testing Approaches

**Option 1: Reduce TTL in Test Environment**
```javascript
// In auth service config for testing
JWT_EXPIRATION=60s  // 1 minute instead of 24 hours
```

**Option 2: Mock Time in Tests**
```javascript
// Fast-forward time to simulate expiration
jest.useFakeTimers();
jest.advanceTimersByTime(24 * 60 * 60 * 1000); // 24 hours
```

**Option 3: Manual Token Manipulation**
```javascript
// Create a token with past expiration
const expiredToken = jwt.sign(
  { userId: 123 },
  SECRET,
  { expiresIn: '-1h' } // Already expired
);
```

### Files to Check
- `services/auth-service/src/routes/auth.ts` - Token generation
- `services/auth-service/src/middleware/authenticateToken.ts` - Token validation
- `app/frontend/src/services/authService.ts` - Frontend token handling
- `app/frontend/src/services/apiClient.ts` - API error handling

### Questions to Answer
1. **Token Storage**: Where is token stored? (localStorage, sessionStorage, cookies?)
2. **Token TTL**: What is the current expiration time?
3. **Refresh Token**: Is there a refresh token mechanism?
4. **Error Handling**: What error codes/messages for expired tokens?
5. **UI Behavior**: Does UI show "Session expired" message?
6. **Auto-Refresh**: Does token auto-refresh before expiration?
7. **Logout**: Does token expiration trigger automatic logout?

## Test Scenarios

### Scenario 1: Normal Token Lifecycle
```
1. User logs in → Token issued (valid for 24h)
2. User performs actions → Token validated
3. User logs out → Token removed
4. Try to use expired token → 401 error
```

### Scenario 2: Token Expires During Use
```
1. User logs in → Token issued (TTL: 1 min for testing)
2. User adds expense → Success
3. Wait 1 minute
4. User adds another expense → What happens?
   a) 401 error + redirect to login? OR
   b) Token auto-refreshed? OR
   c) Silent failure?
```

### Scenario 3: Token Expires While Idle
```
1. User logs in → Token issued
2. User leaves browser open
3. Return after token expiration
4. Try to perform action → Should redirect to login
```

### Scenario 4: Invalid Token
```
1. Manually modify token in localStorage
2. Try to perform action
3. Should get 401 and redirect to login
```

## Implementation Steps

### Phase 1: Investigation (30 min)
1. Check auth service JWT configuration
2. Check frontend token handling
3. Test manually: login, wait for expiration, try action
4. Document findings

### Phase 2: Write Tests (2-3 hours)
1. Unit tests for token validation
2. Integration tests for expired token API responses
3. E2E tests for user-facing token expiration

### Phase 3: Fix Issues (If Found)
- See related issue: Feature - Token Refresh Mechanism (if needed)

## Expected Outcomes

**Good Scenario** (Token refresh exists):
- Token automatically refreshes before expiration
- User never experiences interruption
- Tests verify refresh mechanism works

**Bad Scenario** (No token refresh):
- User gets logged out after expiration
- Lost work if in the middle of form entry
- Need to implement token refresh (new issue)

## Priority
**High** - Security and user experience critical

## Related Issues
- #XX - Feature: Implement Token Refresh Mechanism (if not exists)
- #XX - Bug: Users get logged out unexpectedly (if reported)

## References
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Token-Based Authentication](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
