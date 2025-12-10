# Database Tools

Scripts for seeding and managing test data.

## Test User Constants

All tools use a standardized test user for consistency across development and testing.

**Login Credentials:**

- Email: `test@expenses.local`
- Password: `Test123!`
- Name: `Test User`

This user is automatically created by the seeding tools and is used in all E2E tests.

## seed-test-data.js

Populates the database with sample expenses for the test user.

### Usage

```bash
# From project root (uses env variables from .env)
node tools/seed-test-data.js

# With custom database connection
DB_HOST=localhost DB_PORT=5432 DB_NAME=testdb DB_USER=testuser DB_PASSWORD=testpass node tools/seed-test-data.js
```

### What it does

- Ensures test user exists (test@expenses.local)
- Generates 50 random expenses across all categories
- Spreads expenses over the last 90 days
- Uses realistic descriptions and amounts ($10-$210)
- Shows summary statistics after seeding

### Prerequisites

```bash
# Install required packages
npm install pg bcrypt

# Ensure categories are seeded first (automatic with Docker)
# Or manually: psql "host=localhost dbname=testdb user=testuser" -f app/database/seed-categories.sql
```

### Environment Variables

Configure in `.env` file:

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: expenses)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres123)
- `TEST_USER_EMAIL` - Test user email (default: test@expenses.local)
- `TEST_USER_PASSWORD` - Test user password (default: Test123!)
- `TEST_USER_NAME` - Test user name (default: Test User)
