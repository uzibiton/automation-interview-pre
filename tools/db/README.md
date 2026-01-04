# Database Tools

Scripts for managing database seeding and data operations.

## Test User Credentials

All seeding tools use standardized test users:

| Email                 | Auth Type    | Password | Name        | Role  |
| --------------------- | ------------ | -------- | ----------- | ----- |
| test@expenses.local   | Local        | Test123! | Test User   | Owner |
| uzibdocs@gmail.com    | Google OAuth | N/A      | Uzi Bdocs   | Owner |
| admin@expenses.local  | Local        | Test123! | Admin User  | Admin |
| member@expenses.local | Local        | Test123! | Member User | Member|
| viewer@expenses.local | Local        | Test123! | Viewer User | Viewer|
| solo@expenses.local   | Local        | Test123! | Solo User   | Solo  |

## Scripts

### seed-enhanced.js (Recommended)

Enhanced seeding tool with Faker.js for realistic test data and CLI argument support.

**Usage:**

```bash
# Initialize develop environment with predefined users, groups, and expenses
node tools/db/seed-enhanced.js --env develop --init

# Seed with random data (Faker.js)
node tools/db/seed-enhanced.js --env develop

# Seed both databases with defaults (30 expenses, 2 groups, 3 members/group)
npm run seed:enhanced

# Customize for PostgreSQL only
npm run seed:enhanced -- --target postgres --expenses 50 --groups 3

# Customize for Firestore only
npm run seed:enhanced -- --target firestore --expenses 100 --members 5

# Full customization
node tools/db/seed-enhanced.js --target all --expenses 100 --groups 5 --members 8 --days 90
```

**CLI Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-t, --target <type>` | Database: `postgres`, `firestore`, or `all` | `all` |
| `--env <name>` | Environment: `develop`, `staging`, `production` | - |
| `--init` | Use predefined init data instead of random Faker data | `false` |
| `-e, --expenses <n>` | Number of expenses to generate | `30` |
| `-g, --groups <n>` | Number of groups to create | `2` |
| `-m, --members <n>` | Members per group | `3` |
| `--days <n>` | Days back for expense dates | `60` |

**Features:**

- **Init mode** (`--init`) - Creates predefined users, groups, and expenses for consistent testing
- **Environment support** (`--env`) - Target specific GCP environments (develop, staging, production)
- Faker.js integration - Realistic names, emails, descriptions, merchants
- Flexible CLI - Customize record counts per run
- Both databases - Seeds PostgreSQL and Firestore with same structure
- Category-aware descriptions - Expenses get relevant descriptions

### Init Mode (`--init`)

Creates a deterministic data set for testing:

**Users Created:**
- 2 owner users with 2 groups each
- 4 role-based test users (admin, member, viewer, solo)

**Groups Created:**
- "Family Budget" and "Vacation Fund" (owned by test@expenses.local)
- "Work Budget" and "Project Fund" (owned by uzibdocs@gmail.com)
- Each group has admin, member, and viewer users

**Expenses:**
- 3-5 expenses per user with realistic amounts and descriptions
- Uses existing categories from Firestore
- Member name included in description for attribution

**Data Structure:**
```
groups/
  {auto-id}/
    name: "Family Budget"
    ownerId: "{firestore-user-id}"
    members: ["{user-id-1}", "{user-id-2}", ...]
    memberDetails: [
      { id: "{user-id}", name: "Test User", role: "owner", joinedAt: "..." }
    ]
```

> **Note:** The `--init` flag uses auto-generated Firestore document IDs to match the app's authentication flow. User IDs in groups reference the actual Firestore document IDs, not hardcoded values.

---

### seed-develop.js

Clears and populates Firestore for the develop environment. Creates both test users.

```bash
node tools/db/seed-develop.js
```

**What it does:**
1. Clears all existing data (users, groups, expenses, invitations)
2. Creates two test users (local + Google OAuth)
3. Creates two groups per user
4. Adds members to each user's primary group
5. Creates 15 expenses per user

---

### seed-postgres-test-data.js

Seeds PostgreSQL with groups, members, and expenses.

```bash
npm run seed:postgres
```

---

### seed-firestore-test-data.js

Seeds Firestore with groups, members, and expenses.

```bash
npm run seed:firestore
```

---

### seed-all-environments.js

Runs both PostgreSQL and Firestore seeders sequentially.

```bash
npm run seed:all
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | PostgreSQL database | `testdb` |
| `DB_USER` | PostgreSQL user | `testuser` |
| `DB_PASSWORD` | PostgreSQL password | `testpass` |
| `FIREBASE_PROJECT_ID` | Firestore project | `skillful-eon-477917-b7` |

## Library Files

### lib/faker-generators.js

Shared Faker.js data generators used by seed-enhanced.js:

- `generateUser()` - Random user with name and email
- `generateExpense(options)` - Expense with category-aware description
- `generateGroup(options)` - Group with creative name
- `generateMember(options)` - Group member with role
