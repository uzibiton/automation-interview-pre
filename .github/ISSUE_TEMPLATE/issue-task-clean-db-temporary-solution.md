---
name: Task - Add Database Cleanup Stage (Temporary Solution)
about: Create a script to clean old test data from database as a temporary solution
title: '[TASK] Add Database Cleanup Stage for Old Test Data'
labels: ['task', 'database', 'testing', 'temporary-solution']
assignees: ''
---

## Description
**Found During:** Manual testing - discovered old test data accumulating in the database

The database contains old test data from previous testing sessions. This causes:
- Confusion during testing (which expenses are from current test vs. old tests?)
- Inaccurate test results (test might pass/fail due to old data)
- Performance degradation (large amounts of test data)
- Difficulty reproducing bugs (unknown data state)

## Problem
**Current State:**
- Test users and expenses accumulate over time
- No easy way to reset to clean state
- Shared Firestore database across all environments
- Manual cleanup is tedious and error-prone

**Impact:**
- QA needs to manually identify and delete test data
- Test scenarios may interact with old data unexpectedly
- Database grows with orphaned test data

## Proposed Solution
Create a database cleanup script/stage as a **temporary solution** until we have:
1. Separate databases per environment
2. Automated database seeding/reset in CI
3. Firestore emulator for local development

## Acceptance Criteria
- [ ] Script to clean database of test data
- [ ] Script can run locally and in deployed environments
- [ ] Options for what to clean:
  - [ ] All test users (identified by email pattern or flag)
  - [ ] All expenses for test users
  - [ ] Optionally: ALL data (full reset - use with caution!)
- [ ] Script shows what will be deleted before confirming
- [ ] Script requires explicit confirmation (not accidental)
- [ ] Script logs what was deleted
- [ ] Script has dry-run mode (show what would be deleted without deleting)
- [ ] Documentation on how to use the script

## Temporary Solution Features

### Script: `scripts/clean-test-data.js`

**Capabilities:**
```bash
# Dry run - see what would be deleted
npm run clean:db -- --dry-run

# Clean test users and their expenses
npm run clean:db -- --test-users

# Clean all expenses (keep users)
npm run clean:db -- --all-expenses

# Full reset (DANGEROUS - requires confirmation)
npm run clean:db -- --full-reset

# Clean specific user by email
npm run clean:db -- --user "test@example.com"

# Clean expenses older than X days
npm run clean:db -- --older-than 7
```

**Safety Features:**
- Dry-run mode by default
- Requires `--confirm` flag for actual deletion
- Shows count of items to be deleted before proceeding
- Asks for Y/N confirmation
- Logs all deletions
- Cannot be run in production environment (safeguard)

### Identify Test Data

**Test User Patterns:**
- Email contains `test@`, `qa@`, `temp@`
- Email matches pattern `*+test@*`
- User has `isTestUser: true` flag (if we add this)
- Username starts with `test_`, `qa_`, `temp_`

### Script Output Example:
```
$ npm run clean:db -- --test-users

🔍 Scanning database for test data...

Found:
  - 12 test users
  - 156 expenses belonging to test users
  - 3 categories created by test users

⚠️  This will DELETE:
  ❌ 12 users
  ❌ 156 expenses
  ❌ 3 categories

Are you sure you want to proceed? (y/N): y

✅ Cleaning database...
  ✓ Deleted 156 expenses
  ✓ Deleted 3 categories
  ✓ Deleted 12 users

✅ Database cleanup complete!
```

## Implementation Details

### Files to Create/Modify
- `scripts/clean-test-data.js` - Main cleanup script
- `package.json` - Add `clean:db` npm script
- `README.md` - Document usage
- `.env.example` - Add any needed environment variables

### Database Operations
**For Firestore:**
```javascript
// Identify test users
const testUsers = await db.collection('users')
  .where('email', '>=', 'test@')
  .where('email', '<=', 'test@\uf8ff')
  .get();

// Delete expenses for test users
const expensesToDelete = await db.collection('expenses')
  .where('userId', 'in', testUserIds)
  .get();

// Batch delete
const batch = db.batch();
expensesToDelete.forEach(doc => batch.delete(doc.ref));
await batch.commit();
```

**For PostgreSQL:**
```sql
-- Identify test users
SELECT * FROM users WHERE email LIKE '%test@%' OR email LIKE '%qa@%';

-- Delete expenses for test users
DELETE FROM expenses WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test@%'
);

-- Delete test users
DELETE FROM users WHERE email LIKE '%test@%';
```

## Testing the Script

**Test Cases:**
1. **TC-1: Dry Run**
   - Run with `--dry-run`
   - Verify it shows what would be deleted
   - Verify nothing is actually deleted

2. **TC-2: Clean Test Users**
   - Create test users with test emails
   - Run cleanup script
   - Verify test users deleted
   - Verify real users NOT deleted

3. **TC-3: Clean Specific User**
   - Run with specific email
   - Verify only that user and their data deleted

4. **TC-4: Safety Checks**
   - Try to run in production → Should fail
   - Try without confirmation → Should prompt

5. **TC-5: Edge Cases**
   - Run when no test data exists → Graceful message
   - Run with invalid arguments → Show help

## Long-Term Solution (Future Issues)

This is a **temporary workaround**. Long-term solutions needed:
- [ ] Issue #XX: Separate Firestore databases per environment
- [ ] Issue #XX: Database seeding/reset functionality (related to this issue)
- [ ] Issue #XX: Firestore emulator for local development
- [ ] Issue #XX: Automated test data management in CI

## Database Reset & Seeding (Related Work)

This script is related to the broader database management task. Consider also:
- Seed database with known good data
- Reset to baseline state before test runs
- Version-controlled seed data files
- Database migrations for schema changes

**See also:** Issue #XX - Reset and Seed Database

## Documentation Required
- README section: "Cleaning Test Data"
- Comment in script explaining safety features
- Warning in script: "This is a temporary solution"

## Priority
**High** - Needed for effective testing right now

## Notes
- This is explicitly a **temporary solution**
- Should be replaced with proper database management
- Useful for local development and testing
- Consider making this work for both Firestore and PostgreSQL
