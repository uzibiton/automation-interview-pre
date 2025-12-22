# Test Data Seeding Tools

This directory contains scripts to populate test data for the Expense Tracker application in both local (PostgreSQL) and deployed (Firestore) environments.

## Overview

The seeding tools create comprehensive test data for the default test user (`test@expenses.local`), including:

- **Groups**: 2 test groups (Family Budget, Vacation Fund)
- **Members**: 6 group members with different roles (owner, admin, member, viewer)
- **Expenses**: 30 sample expenses across various categories over the past 60 days

## Scripts

### 1. PostgreSQL Local Seeding

Seeds the local PostgreSQL database with test data.

```bash
npm run seed:postgres
```

**Prerequisites:**

- Local PostgreSQL database running (use `npm run db:start`)
- Categories already seeded (run `app/database/seed-categories.sql` first if needed)
- Environment variables set in `.env` file

**What it does:**

- Ensures test user exists
- Creates groups and group_members tables if they don't exist
- Adds 2 groups owned by test user
- Adds 6 group members across the groups
- Creates 30 random expenses
- Displays statistics summary

### 2. Firestore Deployed Seeding

Seeds the deployed Firestore database with test data.

```bash
npm run seed:firestore
```

**Prerequisites:**

- Firebase project configured (skillful-eon-477917-b7)
- Google Cloud credentials available
- Categories already seeded in Firestore

**What it does:**

- Ensures test user exists in Firestore
- Adds 2 groups to `groups` collection
- Adds 6 members to `group_members` collection
- Creates 30 expenses in `expenses` collection
- Displays statistics summary

### 3. Unified Seeding (Both Environments)

Seeds both local and deployed environments in one command.

```bash
npm run seed:all
```

**What it does:**

- Runs PostgreSQL seeding script
- Runs Firestore seeding script
- Provides comprehensive summary of both operations
- Shows success/failure status for each environment

## Test User Credentials

All seeding scripts use the same test user:

- **Email**: `test@expenses.local`
- **Password**: `Test123!`

Use these credentials to log in and view the seeded data.

## Generated Test Data

### Groups

1. **Family Budget**
   - Description: "Shared household expenses and bills"
   - Members: 4 (Test User as owner, plus 3 others)

2. **Vacation Fund**
   - Description: "Saving for our summer vacation"
   - Members: 2 (Test User as owner, plus 1 admin)

### Group Members

- Test User (owner in both groups)
- Jane Smith (admin in Family Budget)
- Bob Johnson (member in Family Budget)
- Alice Williams (viewer in Family Budget)
- Charlie Brown (admin in Vacation Fund)

### Expenses

30 random expenses distributed across:

- 9 different categories (Entertainment, Food, Health, etc.)
- Last 60 days
- Amount range: $10-$210
- Payment methods: credit_card, debit_card, cash, bank_transfer
- Currencies: USD, EUR, ILS

## Configuration

### Environment Variables

PostgreSQL (`.env`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expenses
DB_USER=postgres
DB_PASSWORD=postgres123

TEST_USER_EMAIL=test@expenses.local
TEST_USER_PASSWORD=Test123!
TEST_USER_NAME=Test User
```

Firestore:

```env
FIREBASE_PROJECT_ID=skillful-eon-477917-b7
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

## Troubleshooting

### PostgreSQL Issues

**"No categories found"**

```bash
psql "host=localhost dbname=expenses user=postgres" -f app/database/seed-categories.sql
```

**"Connection refused"**

```bash
npm run db:start
```

**"Tables already exist"**

- The scripts handle existing data gracefully
- Duplicate entries will be skipped with warnings

### Firestore Issues

**"Permission denied"**

- Ensure GOOGLE_APPLICATION_CREDENTIALS is set
- Verify service account has Firestore write permissions

**"Collection not found"**

- Categories must be seeded first
- Run `node app/scripts/seed-firestore-categories.js`

## Direct Script Execution

You can also run the scripts directly:

```bash
# PostgreSQL
node tools/seed-postgres-test-data.js

# Firestore
node tools/seed-firestore-test-data.js

# Both
node tools/seed-all-environments.js
```

## Output Example

```
🚀 Starting PostgreSQL test data seeding...
   Host: localhost:5432
   Database: expenses
   User: test@expenses.local

✅ Connected!

📊 Found 9 categories
👤 Ensuring test user exists...
   ✅ User already exists: test@expenses.local (ID: 1)

👥 Seeding groups...
   ✅ Created group: Family Budget (ID: 1)
   ✅ Created group: Vacation Fund (ID: 2)

👤 Seeding group members...
   ✅ Added member: Test User (owner) to group 1
   ✅ Added member: Jane Smith (admin) to group 1
   ... and 4 more members

💰 Seeding expenses...
   Found 0 existing expenses for test user
   ✅ Created expense: Grocery shopping - $87.50
   ✅ Created expense: Gas station - $45.00
   ... and 25 more expenses

📊 Statistics Summary:
   Food: 8 expenses, $432.50
   Transportation: 6 expenses, $278.00
   Entertainment: 5 expenses, $389.75
   ...

✅ Seeding completed successfully!
   Groups created: 2
   Members created: 6
   Expenses created: 30

🔐 Login credentials:
   Email: test@expenses.local
   Password: Test123!
```

## Resetting Data

To completely reset and reseed:

### PostgreSQL

```bash
npm run db:reset
# Wait for PostgreSQL to start
npm run seed:postgres
```

### Firestore

Delete the collections manually in Firebase Console, then:

```bash
npm run seed:firestore
```

## Related Files

- `seed-test-data.js` - Legacy PostgreSQL expense-only seeding
- `test-user.js` - Test user helper functions
- `app/database/init.sql` - Database schema
- `app/database/seed-categories.sql` - Category seeding
- `app/scripts/seed-firestore-categories.js` - Firestore category seeding

## Notes

- Scripts are idempotent - safe to run multiple times
- Existing data is preserved (duplicates skipped)
- All IDs are deterministic for consistency
- Group members can exist without being in the users table (guest members)
