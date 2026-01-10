# Initial Data Setup

This document describes the initial data structure for the develop environment.

## Overview

The develop environment is seeded with a specific data structure for testing different user roles and scenarios.

## Users

### Owner Users (2)

| Email                 | Auth Type    | Password   | Role  |
| --------------------- | ------------ | ---------- | ----- |
| `test@expenses.local` | Local        | `Test123!` | Owner |
| `uzibdocs@gmail.com`  | Google OAuth | N/A        | Owner |

### Role Test Users (4)

Each role has a test user to verify permission levels:

| Email                   | Auth Type | Password   | Role              |
| ----------------------- | --------- | ---------- | ----------------- |
| `admin@expenses.local`  | Local     | `Test123!` | Admin             |
| `member@expenses.local` | Local     | `Test123!` | Member            |
| `viewer@expenses.local` | Local     | `Test123!` | Viewer            |
| `solo@expenses.local`   | Local     | `Test123!` | Owner (no groups) |

## Data Structure

### Per Owner User (test@expenses.local, uzibdocs@gmail.com)

Each owner has:

- **2 Groups** with different themes
- **Group 1**: 4 members (owner + admin + member + viewer)
- **Group 2**: 4 members (owner + admin + member + viewer)
- **3-5 Expenses** per user

### Group Membership

```
Group 1 (e.g., "Family Budget")
├── Owner: test@expenses.local
├── Admin: admin@expenses.local
├── Member: member@expenses.local
└── Viewer: viewer@expenses.local

Group 2 (e.g., "Vacation Fund")
├── Owner: test@expenses.local
├── Admin: admin@expenses.local
├── Member: member@expenses.local
└── Viewer: viewer@expenses.local
```

Same structure for `uzibdocs@gmail.com` with different group names.

## Usage

### Clear and Initialize Develop

```bash
node tools/db/seed-enhanced.js --env develop --reset --init
```

### Clear Only

```bash
node tools/db/seed-enhanced.js --env develop --reset --expenses 0 --groups 0
```

### Initialize Without Clearing

```bash
node tools/db/seed-enhanced.js --env develop --init
```

## Test Scenarios

### Login Testing

1. **Local Auth**: Login with `test@expenses.local` / `Test123!`
2. **Google OAuth**: Login with `uzibdocs@gmail.com` via Google
3. **Role Testing**: Login with `admin@expenses.local`, `member@expenses.local`, `viewer@expenses.local`

### Permission Testing

| User   | Can View | Can Edit | Can Delete | Can Manage Members |
| ------ | -------- | -------- | ---------- | ------------------ |
| Owner  | ✅       | ✅       | ✅         | ✅                 |
| Admin  | ✅       | ✅       | ✅         | ✅                 |
| Member | ✅       | ✅       | ❌         | ❌                 |
| Viewer | ✅       | ❌       | ❌         | ❌                 |

### Solo User Testing

`solo@expenses.local` has no groups - useful for testing:

- Empty state UI
- Group creation flow
- Invitation acceptance

## Password Hash

All local users use the same password hash for `Test123!`:

```
$2b$10$deWzoV5fs/.zOkxXdeETueCRNaSVF.xuR/4K0TSgMes5xB.cmNhFu
```
