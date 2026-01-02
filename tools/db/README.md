# Database Tools

Scripts for managing database seeding and data operations.

## Scripts

### seed-develop.js

Clears and populates the Firestore database for the develop environment.

**Usage:**

```bash
node tools/db/seed-develop.js
```

**What it does:**

1. Clears all existing data (users, groups, expenses, invitations)
2. Creates two test users:
   - `test@expenses.local` / `Test123!` (local auth)
   - `uzibdocs@gmail.com` (Google OAuth - login via Google)
3. Creates two groups per user (Family Budget, Vacation Fund)
4. Adds additional members to each user's primary group
5. Creates 15 expenses per user

**Prerequisites:**

- Google Cloud credentials configured
- `FIREBASE_PROJECT_ID` environment variable (defaults to `skillful-eon-477917-b7`)

## Test Users

| Email | Auth Type | Password | Name |
|-------|-----------|----------|------|
| test@expenses.local | Local | Test123! | Test User |
| uzibdocs@gmail.com | Google OAuth | N/A | Uzi Bdocs |

## Future Improvements

- Add environment-specific seeding (staging, production)
- Add data export/backup functionality
- Add selective clearing (only specific collections)
- Add data migration scripts
