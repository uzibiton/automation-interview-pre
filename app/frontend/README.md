# Frontend Application

React + TypeScript + Vite frontend for the Expense Tracker application.

## Mock API Infrastructure

This application includes a comprehensive mock API infrastructure using [Mock Service Worker (MSW)](https://mswjs.io/) to enable frontend development without backend dependencies.

### Features

- ✅ Complete mock API for Group Management feature
- ✅ Realistic network delays (200-500ms)
- ✅ Error simulation (validation, 400, 403, 404, 500)
- ✅ State persistence during testing session
- ✅ Easy toggle between mock and real API

### Using Mock API

#### Enable/Disable Mock Mode

The mock API is controlled by the `VITE_USE_MOCK_API` environment variable in `.env.development`:

```bash
# Enable mock API (default for development)
VITE_USE_MOCK_API=true

# Disable mock API (use real backend)
VITE_USE_MOCK_API=false
```

#### Starting the Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server with mock API
npm run dev

# The console will show:
# [App] Initializing with Mock API...
# [MSW] Mock API worker started successfully
```

### Mock API Endpoints

#### Group Management

| Method | Endpoint                                  | Description                    |
| ------ | ----------------------------------------- | ------------------------------ |
| GET    | `/api/groups/current`                     | Get current user's group       |
| POST   | `/api/groups`                             | Create a new group             |
| GET    | `/api/groups/:id`                         | Get group details              |
| PATCH  | `/api/groups/:id`                         | Update group                   |
| DELETE | `/api/groups/:id`                         | Delete group (Owner only)      |
| GET    | `/api/groups/:id/members`                 | List group members             |
| PATCH  | `/api/groups/:groupId/members/:memberId/role` | Change member role       |
| DELETE | `/api/groups/:groupId/members/:memberId`  | Remove member                  |

#### Invitations

| Method | Endpoint                          | Description                |
| ------ | --------------------------------- | -------------------------- |
| POST   | `/api/invitations`                | Send email invitation      |
| POST   | `/api/invitations/:token/accept`  | Accept invitation          |
| POST   | `/api/invitations/:token/decline` | Decline invitation         |
| GET    | `/api/invitations?groupId=xxx`    | Get pending invitations    |

#### Invite Links

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| POST   | `/api/invite-links`              | Generate invite link     |
| POST   | `/api/invite-links/:token/join`  | Join via invite link     |
| DELETE | `/api/invite-links/:id`          | Revoke invite link       |
| GET    | `/api/invite-links?groupId=xxx`  | Get active invite links  |

### Mock Data

Mock fixture data is available in `src/mocks/fixtures/`:

- **groups.fixture.ts**: 2 test groups (Family Expenses, Work Team)
- **members.fixture.ts**: 7 test members with different roles (Owner, Admin, Member, Viewer)
- **invitations.fixture.ts**: 5 invitations in various states (pending, accepted, expired, declined)
- **inviteLinks.fixture.ts**: 3 invite links with different configurations
- **expenses.fixture.ts**: 15 expenses with `createdBy` field for group collaboration

### TypeScript Types

All types for Group Management are defined in `src/types/`:

- **Group.ts**: Group, CreateGroupDto, UpdateGroupDto
- **GroupMember.ts**: GroupMember, GroupRole enum, PermissionMatrix
- **Invitation.ts**: Invitation, InvitationStatus enum, CreateInvitationDto
- **InviteLink.ts**: InviteLink, CreateInviteLinkDto

### Error Scenarios

The mock API simulates realistic error scenarios:

#### Validation Errors (400)
- Empty or invalid group name
- Invalid email format
- Invalid role values
- Duplicate invitations

#### Authorization Errors (403)
- Insufficient permissions (non-Owner trying to delete group)
- Cannot change Owner role
- Cannot revoke Owner

#### Not Found Errors (404)
- Group not found
- Member not found
- Invitation not found
- Invite link not found

#### Business Rule Errors (400)
- User already in a group
- Invitation already accepted/declined
- Invite link expired or max uses reached
- Revoked invite link

### Example Usage

```typescript
// Example: Create a new group
const response = await fetch('/api/groups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My New Group',
    description: 'A test group',
  }),
});

const group = await response.json();
console.log('Created group:', group);
```

### Development Workflow

1. **Start with Mock API**: Develop UI components with mock data
2. **Test Scenarios**: Use mock API to test success and error flows
3. **Switch to Real API**: Change `VITE_USE_MOCK_API=false` when backend is ready
4. **Integration Testing**: Run E2E tests with both mock and real API

### Benefits

- 🚀 **Faster Development**: No waiting for API responses
- 🧪 **Easy Testing**: Predictable mock data and error scenarios
- 🔄 **Parallel Work**: Frontend and backend teams can work independently
- 📱 **Offline Development**: Work without backend connection
- 🎯 **E2E Tests**: Reuse mocks for automated testing

## Development

```bash
# Install dependencies
npm install

# Start development server (with mock API)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env.development` file (or use the existing one):

```env
# Mock API toggle
VITE_USE_MOCK_API=true

# Real API base URL (used when mock is disabled)
VITE_API_BASE_URL=http://localhost:3002
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **MSW (Mock Service Worker)** - API mocking
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Router** - Client-side routing
- **i18next** - Internationalization

## Project Structure

```
src/
├── components/       # React components
├── types/            # TypeScript type definitions
│   ├── Group.ts
│   ├── GroupMember.ts
│   ├── Invitation.ts
│   ├── InviteLink.ts
│   └── expense.types.ts
├── mocks/            # Mock API infrastructure
│   ├── fixtures/     # Mock data
│   │   ├── groups.fixture.ts
│   │   ├── members.fixture.ts
│   │   ├── invitations.fixture.ts
│   │   ├── inviteLinks.fixture.ts
│   │   └── expenses.fixture.ts
│   ├── handlers/     # MSW request handlers
│   │   ├── groupHandlers.ts
│   │   └── invitationHandlers.ts
│   └── browser.ts    # MSW setup
├── utils/            # Utility functions
├── i18n/             # Internationalization
├── App.tsx           # Root component
└── index.tsx         # Application entry point
```

## Related Documentation

- [Application Architecture](../README.md)
- [Group Management Requirements](../../docs/product/requirements/REQ-002-group-management.md)
- [Group Management Design](../../docs/dev/designs/HLD-002-group-management.md)
- [Group Management Tasks](../../docs/dev/TASKS-002-group-management.md)
