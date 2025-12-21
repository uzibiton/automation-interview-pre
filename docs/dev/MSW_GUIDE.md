# Mock Service Worker (MSW) Guide

## What is MSW?

**Mock Service Worker (MSW)** is a library that intercepts HTTP requests at the network level using browser Service Workers (in browser) or Node.js request interceptors (in tests). Instead of requests going to a real server, MSW catches them and returns mock data.

### The Magic

```typescript
// Your frontend code makes a real fetch call
fetch('/api/groups/current');

// MSW intercepts it BEFORE it leaves the browser
http.get('/api/groups/current', () => {
  return HttpResponse.json({
    id: '123',
    name: 'Smith Family',
    memberCount: 4,
  });
});

// Your code receives the response as if it came from a real server
```

**Key Insight**: Your application code doesn't know it's using mocks. It makes real `fetch()` calls, MSW just intercepts them.

---

## Why Use MSW?

### 1. **Frontend-Backend Decoupling**

- Frontend team can start development without waiting for backend
- Backend team can develop independently
- Both teams work in parallel

### 2. **Consistent Development Experience**

- Everyone on the team gets the same data
- No need to maintain a shared dev database
- Works offline

### 3. **Superior Testing**

- Fast tests (no network calls)
- Predictable data
- Easy to simulate edge cases (errors, slow responses, race conditions)
- Same mocks for unit, integration, and E2E tests

### 4. **Better Debugging**

- See exactly what data flows through your app
- Test error handling without breaking real data
- Simulate production scenarios locally

---

## How MSW Works

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Application                      │
│  Component calls: fetch('/api/groups/current')          │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────┐
            │   Service Worker Layer    │
            │   (MSW intercepts here)   │
            └───────────┬───────────────┘
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
    ┌──────────────┐    ┌──────────────┐
    │  MSW Handler │    │  Real Network│
    │  (Mock Data) │    │  (Production)│
    └──────────────┘    └──────────────┘
         DEV/TEST           PRODUCTION
```

### Service Worker Lifecycle

**In Browser (Development):**

1. Service Worker is registered on app startup
2. All `fetch()` requests pass through the Service Worker
3. MSW handlers match request patterns
4. Matching handlers return mock responses
5. Non-matching requests pass through to network

**In Node (Tests):**

1. MSW patches Node's `http`/`https` modules
2. All outgoing requests are intercepted
3. Same handler logic as browser
4. Perfect for unit and integration tests

---

## Usage Modes

### 1. Development Mode (Browser)

**File:** `app/frontend/src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Conditionally start MSW in development
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK_API !== 'true') {
    return
  }

  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'warn', // Warn about unhandled requests
  })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
```

**File:** `app/frontend/src/mocks/browser.ts`

```typescript
import { setupWorker } from 'msw/browser';
import { groupHandlers } from './handlers/groupHandlers';
import { invitationHandlers } from './handlers/invitationHandlers';

// Combine all handlers
export const worker = setupWorker(...groupHandlers, ...invitationHandlers);
```

**Environment:** `.env.development`

```bash
VITE_USE_MOCK_API=true
```

### 2. Testing Mode (Node/Vitest)

**File:** `app/frontend/src/mocks/server.ts`

```typescript
import { setupServer } from 'msw/node';
import { groupHandlers } from './handlers/groupHandlers';
import { invitationHandlers } from './handlers/invitationHandlers';

export const server = setupServer(...groupHandlers, ...invitationHandlers);
```

**File:** `app/frontend/tests/setup.ts`

```typescript
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../src/mocks/server';

// Start MSW before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
```

**Test Example:**

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useGroupStore } from '../stores/useGroupStore';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

test('fetches current group successfully', async () => {
  const { result } = renderHook(() => useGroupStore());

  await result.current.fetchCurrentGroup();

  await waitFor(() => {
    expect(result.current.currentGroup).toEqual({
      id: '1',
      name: 'Smith Family',
      memberCount: 4,
    });
  });
});

test('handles error when group fetch fails', async () => {
  // Override handler for this specific test
  server.use(
    http.get('/api/groups/current', () => {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }),
  );

  const { result } = renderHook(() => useGroupStore());

  await expect(result.current.fetchCurrentGroup()).rejects.toThrow();

  await waitFor(() => {
    expect(result.current.error).toBe('HTTP 404: Not Found');
  });
});
```

### 3. Production (Disabled)

**File:** `.env.production`

```bash
VITE_USE_MOCK_API=false
```

**Result:**

- MSW code is never imported
- Tree-shaking eliminates dead code
- Zero bundle size impact
- All requests go to real backend

---

## Project Structure

```
app/frontend/src/mocks/
├── data/                           # Mock data fixtures
│   ├── groups.ts                   # Sample groups
│   ├── members.ts                  # Sample members
│   ├── invitations.ts              # Sample invitations
│   └── inviteLinks.ts              # Sample invite links
├── handlers/                       # Request handlers
│   ├── groupHandlers.ts            # Group CRUD operations
│   └── invitationHandlers.ts       # Invitation operations
├── browser.ts                      # Browser setup (development)
└── server.ts                       # Node setup (tests)
```

### Handler Example

**File:** `app/frontend/src/mocks/handlers/groupHandlers.ts`

```typescript
import { http, HttpResponse, delay } from 'msw';
import { groups, members } from '../data';

export const groupHandlers = [
  // GET current user's group
  http.get('/api/groups/current', async () => {
    await delay(200); // Simulate network delay

    const currentGroup = groups.find((g) => g.createdBy === 'user-1');

    if (!currentGroup) {
      return HttpResponse.json({ error: 'No group found' }, { status: 404 });
    }

    return HttpResponse.json(currentGroup);
  }),

  // POST create new group
  http.post('/api/groups', async ({ request }) => {
    await delay(300);

    const body = await request.json();

    // Validation
    if (!body.name || body.name.length < 3) {
      return HttpResponse.json(
        { error: 'Group name must be at least 3 characters' },
        { status: 400 },
      );
    }

    const newGroup = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description || '',
      createdBy: 'user-1',
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    groups.push(newGroup);

    return HttpResponse.json(newGroup, { status: 201 });
  }),

  // PATCH update group
  http.patch('/api/groups/:id', async ({ params, request }) => {
    await delay(200);

    const groupId = params.id;
    const updates = await request.json();

    const group = groups.find((g) => g.id === groupId);

    if (!group) {
      return HttpResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    Object.assign(group, updates);

    return HttpResponse.json(group);
  }),

  // GET group members
  http.get('/api/groups/:id/members', async ({ params }) => {
    await delay(150);

    const groupId = params.id;
    const groupMembers = members.filter((m) => m.groupId === groupId);

    return HttpResponse.json(groupMembers);
  }),
];
```

### Fixture Data Example

**File:** `app/frontend/src/mocks/data/groups.ts`

```typescript
import { Group } from '../../types/Group';

export const groups: Group[] = [
  {
    id: '1',
    name: 'Smith Family',
    description: 'Our household expenses',
    createdBy: 'user-1',
    memberCount: 4,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Roommates',
    description: 'Apartment 4B shared expenses',
    createdBy: 'user-2',
    memberCount: 3,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
];
```

---

## MSW + Zustand Integration

### The Stack

```
Component (UI)
    ↓ uses
Zustand Store (State Management)
    ↓ makes fetch() call
Environment Variable Check
    ↓ routes to
MSW Mocks  OR  Real Backend
```

### How They Work Together

**1. Store makes API call:**

```typescript
// useGroupStore.ts
export const useGroupStore = create<GroupState>((set) => ({
  currentGroup: null,
  loading: false,

  fetchCurrentGroup: async () => {
    set({ loading: true });

    // This fetch goes through MSW in dev/test
    const response = await fetch('/api/groups/current');
    const group = await response.json();

    set({ currentGroup: group, loading: false });
  },
}));
```

**2. MSW intercepts (if enabled):**

```typescript
// groupHandlers.ts
http.get('/api/groups/current', () => {
  return HttpResponse.json({
    id: '1',
    name: 'Smith Family',
    memberCount: 4,
  });
});
```

**3. Component uses store:**

```typescript
function Dashboard() {
  const { currentGroup, fetchCurrentGroup } = useGroupStore()

  useEffect(() => {
    fetchCurrentGroup() // Works with MSW or real backend
  }, [])

  return <h1>{currentGroup?.name}</h1>
}
```

### Benefits of This Architecture

| Layer             | Responsibility               | Benefit                              |
| ----------------- | ---------------------------- | ------------------------------------ |
| **Component**     | Display UI                   | Clean, testable, no API logic        |
| **Zustand Store** | State management + API calls | Centralized logic, reusable          |
| **MSW**           | Mock backend responses       | Fast development, easy testing       |
| **Real Backend**  | Production API               | Actual data, validation, persistence |

**Key Insight:** Same component and store code works in all environments. Only the data source changes (MSW vs real backend).

---

## MSW and Contract Testing

### What MSW Provides

MSW helps you define **what the frontend expects** from the backend:

```typescript
// This handler IS a contract definition
http.get('/api/groups/current', () => {
  return HttpResponse.json({
    id: string, // Frontend expects string ID
    name: string, // Frontend expects string name
    memberCount: number, // Frontend expects number count
  });
});
```

### What MSW Doesn't Provide

- ❌ Verification that backend actually implements this contract
- ❌ Automated contract testing
- ❌ Contract versioning
- ❌ Breaking change detection

### Contract Testing Tools

For full contract testing, use tools like **Pact**:

```typescript
// 1. Frontend defines what it needs (consumer contract)
await pact
  .uponReceiving('GET current group')
  .withRequest({
    method: 'GET',
    path: '/api/groups/current',
  })
  .willRespondWith({
    status: 200,
    body: {
      id: like('1'),
      name: like('Smith Family'),
      memberCount: like(4),
    },
  });

// 2. This generates a contract file

// 3. Backend verifies it can fulfill this contract (provider verification)
// (Runs on backend CI/CD)
```

### MSW → Contract Testing Bridge

You can convert MSW handlers into Pact contracts:

```typescript
// MSW handler (existing)
export const groupHandlers = [
  http.get('/api/groups/current', () => {
    return HttpResponse.json({
      id: '1',
      name: 'Smith Family',
      memberCount: 4,
    });
  }),
];

// Generate Pact contract from MSW structure
const contractFromMSW = {
  consumer: 'frontend',
  provider: 'api-service',
  interactions: groupHandlers.map((handler) => ({
    description: handler.info.method + ' ' + handler.info.path,
    request: extractRequest(handler),
    response: extractResponse(handler),
  })),
};
```

**Project Structure for Contract Testing:**

```
tests/contract/
├── consumers/          # Frontend contract tests
│   └── group-api.contract.test.ts
├── providers/          # Backend verification tests
│   └── group-api.provider.test.ts
└── pacts/             # Generated contract files
    └── frontend-api-service.json
```

### Testing Pyramid with MSW

```
        ┌────────────────┐
        │   E2E Tests    │  Use MSW or real backend
        │   (Slow)       │
        └────────────────┘
       ┌──────────────────┐
       │ Contract Tests   │  Verify API agreement
       │  (Medium)        │
       └──────────────────┘
      ┌────────────────────┐
      │ Integration Tests  │  Use MSW
      │   (Fast)           │
      └────────────────────┘
     ┌──────────────────────┐
     │    Unit Tests        │  Use MSW
     │  (Very Fast)         │
     └──────────────────────┘
```

---

## Advanced MSW Patterns

### 1. Dynamic Responses

```typescript
http.get('/api/groups/:id/members', ({ params }) => {
  const groupId = params.id;
  const members = mockMembers.filter((m) => m.groupId === groupId);

  return HttpResponse.json(members);
});
```

### 2. Stateful Mocks

```typescript
// Mock database that persists across requests
let mockGroups = [...initialGroups];

http.post('/api/groups', async ({ request }) => {
  const newGroup = await request.json();
  mockGroups.push(newGroup);
  return HttpResponse.json(newGroup);
});

http.get('/api/groups', () => {
  return HttpResponse.json(mockGroups); // Returns updated data
});
```

### 3. Simulating Errors

```typescript
http.delete('/api/groups/:id', ({ params }) => {
  const group = groups.find((g) => g.id === params.id);

  if (!group) {
    return HttpResponse.json({ error: 'Group not found' }, { status: 404 });
  }

  if (group.memberCount > 1) {
    return HttpResponse.json({ error: 'Cannot delete group with members' }, { status: 400 });
  }

  return HttpResponse.json({ message: 'Group deleted' });
});
```

### 4. Simulating Network Delays

```typescript
import { delay } from 'msw';

http.get('/api/groups/current', async () => {
  await delay(2000); // 2 second delay
  return HttpResponse.json(group);
});
```

### 5. Simulating Race Conditions

```typescript
let requestCount = 0;

http.get('/api/groups/current', async () => {
  const currentRequest = ++requestCount;
  await delay(Math.random() * 1000); // Random delay

  // First request takes longer, second arrives first
  return HttpResponse.json({
    id: '1',
    name: `Request #${currentRequest}`,
  });
});
```

### 6. Per-Test Handler Overrides

```typescript
test('handles 500 error', async () => {
  // Override for this test only
  server.use(
    http.get('/api/groups/current', () => {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
    }),
  );

  // Test error handling...
});

// Next test uses original handlers (server.resetHandlers() runs)
```

---

## Best Practices

### 1. Match Production API Structure

```typescript
// ❌ Bad: Different from production
http.get('/groups', ...)

// ✅ Good: Matches production
http.get('/api/groups/current', ...)
```

### 2. Use TypeScript for Type Safety

```typescript
import { Group } from '../../types/Group';

http.get('/api/groups/current', (): HttpResponse<Group> => {
  return HttpResponse.json({
    id: '1',
    name: 'Smith Family',
    memberCount: 4,
  });
});
```

### 3. Simulate Realistic Delays

```typescript
// Too fast (unrealistic)
await delay(0);

// Good for development
await delay(200);

// Good for testing slow networks
await delay(3000);
```

### 4. Handle All Error Cases

```typescript
http.post('/api/groups', async ({ request }) => {
  const body = await request.json();

  // Validation errors
  if (!body.name) {
    return HttpResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  // Authorization errors
  if (!request.headers.get('Authorization')) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Success
  return HttpResponse.json(newGroup, { status: 201 });
});
```

### 5. Keep Fixtures Realistic

```typescript
// ❌ Bad: Unrealistic data
export const groups = [
  {
    id: '1',
    name: 'Test',
    memberCount: 999999,
  },
];

// ✅ Good: Realistic data
export const groups = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Smith Family',
    description: 'Our household expenses',
    memberCount: 4,
    createdAt: '2025-01-01T00:00:00Z',
  },
];
```

### 6. Environment-Specific Configuration

```typescript
const API_DELAY = import.meta.env.DEV ? 200 : 0;

http.get('/api/groups/current', async () => {
  await delay(API_DELAY);
  return HttpResponse.json(group);
});
```

---

## Debugging MSW

### 1. Enable Request Logging

```typescript
worker.start({
  onUnhandledRequest: 'warn', // Log unhandled requests
});
```

### 2. Check Handler Registration

```typescript
console.log('Registered handlers:', worker.listHandlers());
```

### 3. Network Tab

MSW requests appear in browser DevTools Network tab with:

- Status code
- Response body
- Headers
- Timing

### 4. MSW DevTools

Browser extension available for visualizing intercepted requests.

---

## Migration Path: MSW → Real Backend

### Step 1: Develop with MSW

```bash
VITE_USE_MOCK_API=true npm run dev
```

### Step 2: Test with MSW

```bash
npm test  # MSW enabled in tests
```

### Step 3: Switch to Real Backend

```bash
VITE_USE_MOCK_API=false npm run dev
```

### Step 4: Fix API Mismatches

```typescript
// MSW returned this
{ id: '1', name: 'Smith Family' }

// Real API returns this
{ id: 1, name: 'Smith Family' } // id is number, not string!

// Fix: Update TypeScript types and components
```

### Step 5: Keep MSW for Tests

```bash
# Development: Real backend
VITE_USE_MOCK_API=false

# Tests: Still use MSW
npm test
```

---

## Common Pitfalls

### 1. Forgetting to Start Worker

```typescript
// ❌ Forgot to start
import { worker } from './mocks/browser';
// Requests go to network, not MSW

// ✅ Start worker
worker.start();
```

### 2. Wrong Request Path

```typescript
// Frontend calls
fetch('/api/groups/current')

// Handler uses different path
http.get('/groups/current', ...) // ❌ Won't match!

// Fix
http.get('/api/groups/current', ...) // ✅ Matches
```

### 3. Not Resetting Handlers

```typescript
// Test 1 overrides handler
server.use(http.get('/api/groups/current', () => error));

// Test 2 expects original handler, but override persists!

// Fix: Add to test setup
afterEach(() => {
  server.resetHandlers(); // Restore original handlers
});
```

### 4. Async Handler Without Await

```typescript
// ❌ Delay not awaited
http.get('/api/groups/current', () => {
  delay(200); // Does nothing!
  return HttpResponse.json(group);
});

// ✅ Await delay
http.get('/api/groups/current', async () => {
  await delay(200);
  return HttpResponse.json(group);
});
```

---

## Resources

### Official Documentation

- [MSW Documentation](https://mswjs.io/)
- [MSW Examples](https://github.com/mswjs/examples)

### Project Files

- Handlers: `app/frontend/src/mocks/handlers/`
- Fixtures: `app/frontend/src/mocks/data/`
- Setup: `app/frontend/src/mocks/browser.ts` and `server.ts`

### Related Guides

- [Zustand State Management](./STATE_MANAGEMENT.md)
- [Contract Testing Guide](./CONTRACT_TESTING.md)
- [Testing Strategy](../qa/TESTING_STRATEGY.md)

---

## Learning Path

### Beginner

1. Read "What is MSW?" section
2. Look at existing handlers in `app/frontend/src/mocks/handlers/`
3. Try modifying mock data in `app/frontend/src/mocks/data/`
4. Run app with `VITE_USE_MOCK_API=true`

### Intermediate

1. Create a new handler for a new endpoint
2. Add error simulation
3. Write tests using MSW
4. Override handlers per-test

### Advanced

1. Create stateful mocks
2. Simulate race conditions
3. Set up contract testing with Pact
4. Debug complex MSW scenarios

---

**Last Updated:** December 21, 2025  
**Related Tasks:** TASK-002-015, TASK-002-016, TASK-002-017
