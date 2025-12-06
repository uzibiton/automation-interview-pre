---
name: Add script to reset database and populate with random data
about: Create utility script for database reset and seeding with test data
title: 'TASK: Add script to reset database and populate with random data'
labels: enhancement, database, tooling
assignees: ''

---

## Description
Create a utility script that resets the database (deletes all data) and populates it with random test data. This is useful for development, testing, and demos to quickly get a fresh database with realistic data.

## Problem
- No easy way to reset database to clean state
- Manual data entry is time-consuming for testing
- Need consistent test data for demos
- Developers need quick way to recreate database state
- Testing edge cases requires various data scenarios

## Proposed Solution
Create a script `app/scripts/reset-and-seed-db.js` that:
1. Connects to the database
2. Deletes all existing data (truncate tables)
3. Resets sequences/auto-increment values
4. Generates random test data using a library like Faker
5. Inserts realistic test data for all entities

## Implementation Tasks

### Script Creation
- [ ] Create `app/scripts/reset-and-seed-db.js`
- [ ] Add dependencies: `faker` or `@faker-js/faker` for random data
- [ ] Add database connection using existing config
- [ ] Add command-line arguments:
  - `--users <number>` - Number of users to create (default: 10)
  - `--expenses <number>` - Number of expenses per user (default: 20)
  - `--tasks <number>` - Number of tasks per user (default: 15)
  - `--categories` - Use existing categories or generate new ones
  - `--confirm` - Skip confirmation prompt (for CI/scripts)

### Database Reset
- [ ] Drop all tables or truncate all data
- [ ] Reset primary key sequences
- [ ] Preserve schema structure
- [ ] Handle foreign key constraints properly
- [ ] Add safety check - confirm before deleting (unless --confirm flag)
- [ ] Add environment check - prevent running on production

### Data Generation

#### Users
- [ ] Generate random users with:
  - Email (faker.internet.email)
  - Username (faker.internet.userName)
  - Password (bcrypt hash of 'password123')
  - Full name (faker.person.fullName)
  - Created dates (realistic timestamps)
  
#### Categories
- [ ] Create realistic expense categories:
  - Food & Dining (with subcategories: Restaurants, Groceries, Coffee Shops)
  - Transportation (Gas, Public Transit, Parking)
  - Shopping (Clothing, Electronics, Home)
  - Entertainment (Movies, Games, Hobbies)
  - Bills & Utilities (Electric, Water, Internet, Phone)
  - Healthcare (Doctor, Pharmacy, Insurance)
  - Travel (Hotels, Flights, Activities)
  
#### Expenses
- [ ] Generate random expenses for each user:
  - Amount (realistic ranges per category)
  - Description (category-appropriate descriptions)
  - Date (spread over last 6 months)
  - Category and subcategory
  - Random distribution (more frequent categories have more entries)
  
#### Tasks
- [ ] Generate random tasks for each user:
  - Title (faker.lorem.sentence)
  - Description (faker.lorem.paragraph)
  - Status (random: pending, in-progress, completed)
  - Priority (random: low, medium, high)
  - Due date (mix of past, present, future)
  - Completed date (for completed tasks)

### Script Features
- [ ] Progress logging (show what's being created)
- [ ] Error handling (rollback on failure)
- [ ] Transaction support (all-or-nothing)
- [ ] Dry run mode (`--dry-run` - show what would be created)
- [ ] Seed file option (`--seed-file data.json` - use specific data)
- [ ] Output summary (X users, Y expenses, Z tasks created)

### Package.json Scripts
- [ ] Add script to root `package.json`:
  ```json
  "db:reset": "node app/scripts/reset-and-seed-db.js",
  "db:seed": "node app/scripts/reset-and-seed-db.js --no-reset",
  "db:seed:small": "node app/scripts/reset-and-seed-db.js --users 5 --expenses 10 --tasks 5",
  "db:seed:large": "node app/scripts/reset-and-seed-db.js --users 50 --expenses 100 --tasks 50"
  ```

### Documentation
- [ ] Add usage instructions to `README.md`
- [ ] Create `app/database/SEEDING.md` with:
  - Script usage examples
  - Command-line options
  - Data generation patterns
  - Troubleshooting guide
- [ ] Update `RUN-LOCALLY.md` with seeding instructions

### Safety & Validation
- [ ] Add environment check - only allow in development
- [ ] Add confirmation prompt before deletion
- [ ] Add `--force` flag to bypass safety checks
- [ ] Validate database connection before proceeding
- [ ] Check if database is empty before seeding

## Usage Examples

### Reset and seed with defaults
```bash
npm run db:reset
```

### Seed without resetting
```bash
npm run db:seed
```

### Custom data amounts
```bash
npm run db:reset -- --users 20 --expenses 50 --tasks 30
```

### Quick small dataset
```bash
npm run db:seed:small
```

### Large dataset for performance testing
```bash
npm run db:seed:large
```

### Skip confirmation (for CI/scripts)
```bash
npm run db:reset -- --confirm
```

### Dry run (see what would be created)
```bash
npm run db:reset -- --dry-run
```

## Benefits
- ✅ Quick database reset for development
- ✅ Consistent test data for demos
- ✅ Realistic data for testing
- ✅ Easy to reproduce bugs with specific data
- ✅ Performance testing with large datasets
- ✅ Onboarding new developers (instant working environment)
- ✅ Automated testing setup

## Acceptance Criteria
- [ ] Script successfully connects to database
- [ ] All existing data is deleted when reset flag used
- [ ] Random users are created with valid data
- [ ] Random expenses are created with realistic amounts/categories
- [ ] Random tasks are created with varied statuses
- [ ] Script outputs progress and summary
- [ ] Safety checks prevent accidental production use
- [ ] Command-line arguments work as documented
- [ ] Package.json scripts are functional
- [ ] Documentation is complete and accurate
- [ ] Script handles errors gracefully
- [ ] Can run multiple times without issues

## Technical Considerations
- Use transactions to ensure atomicity
- Handle database connection pooling
- Consider timezone handling for dates
- Ensure password hashing is consistent
- Validate foreign key relationships
- Handle unique constraints (emails, usernames)
- Performance optimization for large datasets
- Memory usage for bulk inserts

## Dependencies to Add
```json
{
  "@faker-js/faker": "^8.0.0"
}
```

## References
- Existing seed script: `app/scripts/seed-firestore-categories.js`
- Database schema: `app/database/init.sql`
- Check expenses script: `app/scripts/check-expenses.js`
- Faker.js docs: https://fakerjs.dev/
