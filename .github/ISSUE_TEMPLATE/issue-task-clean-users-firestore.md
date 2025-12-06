---
name: Add script to clean/manage users in Firestore
about: Create utility to delete test users from shared Firestore database
title: 'TASK: Add script to clean/manage users in Firestore database'
labels: enhancement, database, tooling, firestore
assignees: ''

---

## Description
Create a utility script to clean up test users from Firestore database. Currently, the database is shared across all environments (local, staging, production) and accumulates test users over time. Need ability to:
- Delete all test users
- Delete specific users by email
- Delete users by pattern (e.g., test emails)
- Preserve production users

## Problem
- Firestore database is shared across all environments
- Test users accumulate during development and testing
- No easy way to clean up test accounts
- Database doesn't start clean between test runs
- Manual deletion is tedious via Firebase Console
- Risk of accidentally deleting production users

## Current State
- Database: Firestore (shared across all environments)
- No isolation between local/staging/production
- No cleanup mechanism
- Users collection grows indefinitely

## Proposed Solution
Create script `app/scripts/clean-users.js` that:
1. Connects to Firestore
2. Provides options to delete users safely
3. Has dry-run mode by default
4. Requires explicit confirmation for deletion
5. Logs all actions for audit

## Implementation Tasks

### Script Creation
- [ ] Create `app/scripts/clean-users.js`
- [ ] Add Firebase Admin SDK for Firestore access
- [ ] Add command-line argument parsing
- [ ] Implement user query and deletion logic

### Command-Line Options
- [ ] `--all` - Delete all users (dangerous, requires --force)
- [ ] `--email <email>` - Delete specific user by email
- [ ] `--pattern <regex>` - Delete users matching email pattern
- [ ] `--test-users` - Delete users with test email patterns (default)
- [ ] `--dry-run` - Show what would be deleted (default: true)
- [ ] `--force` - Actually delete (bypass dry-run)
- [ ] `--env <env>` - Specify environment (to prevent prod deletion)
- [ ] `--limit <number>` - Limit number of deletions

### Safety Features
- [ ] Dry-run mode by default
- [ ] Confirmation prompt before deletion
- [ ] Environment check (prevent running in production)
- [ ] Whitelist emails to never delete
- [ ] Batch deletion with progress logging
- [ ] Rollback capability (store deleted user IDs)

### User Deletion Logic

#### Test User Patterns
Default patterns for test users:
```javascript
const TEST_PATTERNS = [
  /^test.*@/,           // test123@gmail.com
  /.*@test\./,          // user@test.com
  /.*\+test@/,          // user+test@gmail.com
  /^demo.*@/,           // demo@example.com
  /.*@example\./,       // anything@example.com
  /^temp.*@/,           // temp@gmail.com
  /^fake.*@/,           // fake@email.com
];
```

#### Safe Deletion Process
```javascript
1. Query users matching criteria
2. Filter against whitelist
3. Show summary (count, sample emails)
4. Ask for confirmation
5. Delete in batches (100 at a time)
6. Log each deletion
7. Show final summary
```

### Script Structure
```javascript
const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID
});

const db = admin.firestore();

async function cleanUsers(options) {
  // 1. Query users
  // 2. Filter based on options
  // 3. Dry run or confirm
  // 4. Delete users
  // 5. Return summary
}

// CLI handling
const args = parseArgs();
cleanUsers(args).then(summary => {
  console.log('Cleanup complete:', summary);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
```

### Package.json Scripts
Add to root `package.json`:
```json
{
  "scripts": {
    "users:clean": "node app/scripts/clean-users.js --test-users",
    "users:clean:all": "node app/scripts/clean-users.js --all --dry-run",
    "users:delete": "node app/scripts/clean-users.js --email",
    "users:list": "node app/scripts/clean-users.js --list"
  }
}
```

### Firestore Structure
Assuming users collection structure:
```javascript
{
  users: {
    userId: {
      email: "test@example.com",
      username: "testuser",
      createdAt: timestamp,
      provider: "google" | "email",
      // ... other fields
    }
  }
}
```

### Related Data Cleanup
Users may have related data:
- [ ] Delete user's expenses
- [ ] Delete user's tasks
- [ ] Handle orphaned data
- [ ] Option to cascade delete (--cascade flag)

### Documentation
- [ ] Add usage examples to README.md
- [ ] Create `app/scripts/USER_CLEANUP.md` with:
  - Script usage
  - Safety considerations
  - Examples for common scenarios
  - Recovery procedures
- [ ] Update RUN-LOCALLY.md with cleanup steps

### Environment Isolation (Future Enhancement)
**Problem:** Shared database across environments

**Long-term Solution:**
- [ ] Create separate Firestore databases per environment
- [ ] Local: Use Firestore emulator
- [ ] Staging: Use staging Firestore project
- [ ] Production: Use production Firestore project

## Usage Examples

### Dry run - see what would be deleted
```bash
npm run users:clean -- --dry-run
```

### Delete test users (safe patterns)
```bash
npm run users:clean -- --test-users --force
```

### Delete specific user
```bash
npm run users:clean -- --email test@example.com --force
```

### Delete by pattern
```bash
npm run users:clean -- --pattern "^test.*@gmail.com" --force
```

### Delete all (dangerous!)
```bash
npm run users:clean -- --all --force --env staging
```

### List users without deleting
```bash
npm run users:clean -- --list
```

## Benefits
- ✅ Quick cleanup of test users
- ✅ Safe deletion with dry-run
- ✅ Pattern-based deletion for flexibility
- ✅ Audit trail of deletions
- ✅ Prevents accidental production deletions
- ✅ Helps maintain clean database
- ✅ Easier testing with fresh state

## Acceptance Criteria
- [ ] Script connects to Firestore successfully
- [ ] Dry-run shows users that would be deleted
- [ ] Test user patterns correctly identify test accounts
- [ ] Confirmation prompt works
- [ ] Users are deleted when --force flag used
- [ ] Whitelist prevents deletion of protected users
- [ ] Environment check prevents production deletion
- [ ] Script logs all actions
- [ ] Package.json scripts work
- [ ] Documentation is complete
- [ ] Error handling for network issues
- [ ] Can handle large number of users (pagination)

## Safety Checklist
- [ ] Never delete without --force flag
- [ ] Always show summary before deletion
- [ ] Check environment before destructive operations
- [ ] Maintain whitelist of protected emails
- [ ] Log all deletions for audit
- [ ] Test on small dataset first
- [ ] Have backup/recovery plan

## Technical Considerations
- Use Firebase Admin SDK for authentication
- Handle pagination for large user lists
- Implement rate limiting to avoid API quotas
- Consider using batch operations (500 writes per batch)
- Handle Firebase errors gracefully
- Use transactions for consistency
- Log to file for audit trail

## Future Enhancements (Out of Scope)
- Web UI for user management
- Scheduled cleanup (cron job)
- User export before deletion
- Soft delete (mark as deleted, don't actually remove)
- Restore deleted users
- User analytics (most active, inactive, etc.)

## Related Issues
- Issue #X: Database reset and seeding script (complementary)
- Need: Environment-specific Firestore databases

## References
- Firestore Admin SDK: https://firebase.google.com/docs/admin/setup
- Firebase Console: https://console.firebase.google.com/
- User management: `app/services/auth-service/src/users/`
- Firestore repository: `app/services/auth-service/src/users/firestore-users.service.ts`
