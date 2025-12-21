# Invitation Store (Zustand)

**Task**: TASK-002-017  
**Dependencies**: TASK-002-015 (Mock API Infrastructure)

## Overview

Dedicated state management for invitations and invite links using Zustand. This store provides a focused API for managing:

- Email invitations to join groups
- Shareable invite links with customizable permissions and usage limits

## Installation

Zustand is already installed as a dependency (v5.0.9+).

## Store Structure

### State

```typescript
interface InvitationState {
  // Data
  invitations: Invitation[];
  links: InviteLink[];

  // UI State
  loading: boolean;
  error: string | null;
}
```

### Actions

#### Invitation Management

- `fetchInvitations(groupId)` - Get all pending invitations for a group
- `sendEmailInvitation(groupId, email, role, message?)` - Send email invitation

#### Invite Link Management

- `fetchInviteLinks(groupId)` - Get all active invite links for a group
- `generateInviteLink(groupId, role, maxUses?)` - Create shareable invite link
- `revokeLink(linkId)` - Deactivate an invite link

#### Utilities

- `clearError()` - Clear error state
- `reset()` - Reset store to initial state

## Usage Examples

### Fetch Invitations

```typescript
import { useInvitationStore } from './stores/useInvitationStore';

function InvitationsPanel() {
  const { invitations, loading, fetchInvitations } = useInvitationStore();
  const groupId = 'group-1';

  useEffect(() => {
    fetchInvitations(groupId);
  }, [groupId]);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {invitations.map(inv => (
        <li key={inv.id}>
          {inv.email} - {inv.role} - {inv.status}
        </li>
      ))}
    </ul>
  );
}
```

### Send Email Invitation

```typescript
function InviteByEmail() {
  const { sendEmailInvitation, loading, error } = useInvitationStore();
  const groupId = 'group-1';

  const handleInvite = async () => {
    try {
      await sendEmailInvitation(
        groupId,
        'user@example.com',
        GroupRole.MEMBER,
        'Welcome to our group!'
      );
      alert('Invitation sent!');
    } catch (err) {
      console.error('Failed to send invitation:', err);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleInvite} disabled={loading}>
        {loading ? 'Sending...' : 'Send Invitation'}
      </button>
    </div>
  );
}
```

### Generate Invite Link

```typescript
function GenerateLinkButton() {
  const { generateInviteLink, links, loading } = useInvitationStore();
  const groupId = 'group-1';

  const handleGenerate = async () => {
    try {
      const link = await generateInviteLink(
        groupId,
        GroupRole.MEMBER,
        10 // Max 10 uses
      );
      navigator.clipboard.writeText(link.token);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to generate link:', err);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        Generate Link
      </button>
      {links.map(link => (
        <div key={link.id}>
          {link.token} - {link.usesCount}/{link.maxUses || '∞'} uses
        </div>
      ))}
    </div>
  );
}
```

### Revoke Invite Link

```typescript
function RevokeButton({ linkId }) {
  const { revokeLink, loading } = useInvitationStore();

  const handleRevoke = async () => {
    if (confirm('Revoke this invite link?')) {
      try {
        await revokeLink(linkId);
        alert('Link revoked successfully');
      } catch (err) {
        console.error('Failed to revoke link:', err);
      }
    }
  };

  return (
    <button onClick={handleRevoke} disabled={loading}>
      Revoke
    </button>
  );
}
```

## Mock API Integration

The store integrates with Mock Service Worker (MSW) from TASK-002-015.

### Environment Configuration

Set in `.env.development`:

```bash
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3002
```

- When `VITE_USE_MOCK_API=true`: Uses MSW handlers (mock data)
- When `VITE_USE_MOCK_API=false`: Uses real API at `VITE_API_BASE_URL`

### API Endpoints

The store makes requests to:

- `GET /api/invitations?groupId=xxx` - List pending invitations
- `POST /api/invitations` - Send email invitation
- `GET /api/invite-links?groupId=xxx` - List active invite links
- `POST /api/invite-links` - Generate invite link
- `DELETE /api/invite-links/:id` - Revoke invite link

## Mock Data

From TASK-002-015 fixtures:

- **invitations.fixture.ts**: 2 pending invitations, 1 accepted, 1 expired
- **inviteLinks.fixture.ts**: 1 single-use link, 1 multi-use link (3/10 used)

Mock behaviors:

- Random delays: 200-500ms
- Validation errors: Invalid emails, duplicate invitations
- Authorization errors: 403 for insufficient permissions
- Not found errors: 404 for invalid IDs

## Error Handling

All actions handle errors gracefully:

1. Errors are caught and stored in `state.error`
2. Loading state is set to `false`
3. Error is thrown so component can handle it if needed

```typescript
const { sendEmailInvitation, error, clearError } = useInvitationStore();

// Clear previous errors before new action
clearError();

try {
  await sendEmailInvitation(groupId, email, role);
} catch (err) {
  // Error is already in store.error
  console.error('Component-level handling:', err);
}
```

## Testing

See `tests/unit/stores/useInvitationStore.test.ts` for comprehensive unit tests covering:

- All store actions
- Success and error scenarios
- State management
- Edge cases

Run tests:

```bash
npm run test:unit -- useInvitationStore.test.ts
```

## Type Definitions

All types are imported from:

- `../types/Invitation.ts` - Invitation, InvitationStatus, CreateInvitationDto
- `../types/InviteLink.ts` - InviteLink, CreateInviteLinkDto
- `../types/GroupMember.ts` - GroupRole

## Comparison with useGroupStore

While `useGroupStore` includes invitation management, `useInvitationStore` provides:

- Focused API specifically for invitation operations
- Cleaner separation of concerns
- Easier to use in invitation-specific components (TASK-002-020: Invitation Modal)
- Simplified function signatures (parameters instead of DTOs)

Both stores can coexist and be used based on the component's needs.

## Next Steps

This store is ready for use in:

- **TASK-002-020**: Invitation Modal Component
- Any other UI components that manage group invitations

## Related Files

- `useInvitationStore.ts` - Main store implementation
- `tests/unit/stores/useInvitationStore.test.ts` - Unit tests
- `../mocks/handlers/invitationHandlers.ts` - Mock API handlers
- `../mocks/fixtures/invitations.fixture.ts` - Mock invitations data
- `../mocks/fixtures/inviteLinks.fixture.ts` - Mock invite links data
