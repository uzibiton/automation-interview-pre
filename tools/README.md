# Tools

Utility scripts for development and maintenance.

## Directory Structure

```
tools/
├── db/                    # Database seeding and management
│   ├── lib/              # Shared libraries
│   │   └── faker-generators.js
│   ├── seed-enhanced.js  # Recommended - Faker.js + CLI
│   ├── seed-develop.js   # Develop environment seeder
│   ├── seed-postgres-test-data.js
│   ├── seed-firestore-test-data.js
│   ├── seed-all-environments.js
│   └── README.md
├── arc/                   # Archived one-time scripts
│   ├── create-task-issues.js
│   ├── create-task-002-issues.js
│   ├── retrofit-task-003-issues.js
│   └── setup-github-labels.js
└── README.md
```

## Database Tools

See [db/README.md](db/README.md) for detailed documentation.

### Quick Start

```bash
# Recommended - enhanced seeder with Faker.js
npm run seed:enhanced

# With options
npm run seed:enhanced -- --target firestore --expenses 50

# Legacy seeders
npm run seed:postgres
npm run seed:firestore
npm run seed:all
```

## Archived Scripts

The `arc/` folder contains one-time utility scripts that were used during project setup:

- `create-task-issues.js` - GitHub issue creation for TASK-002
- `create-task-002-issues.js` - Additional TASK-002 issues
- `retrofit-task-003-issues.js` - TASK-003 issue retrofitting
- `setup-github-labels.js` - GitHub label setup

These scripts are kept for reference but are not part of the regular workflow.
