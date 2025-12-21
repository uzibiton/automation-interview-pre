# Group Management Store (Zustand)

**Task**: TASK-002-016  
**Dependencies**: TASK-002-015 (Mock API Infrastructure)

## Overview

Global state management for groups using Zustand. This store provides a centralized way to manage group-related data including:
- Group CRUD operations
- Member management
- Email invitations
- Shareable invite links

## Installation

Zustand is already installed as a dependency:

```bash
npm install zustand
```

## Store Structure

### State

```typescript
interface GroupState {
  // Data
  currentGroup: Group | null;
  members: GroupMember[];
  invitations: Invitation[];
  inviteLinks: InviteLink[];
  
  // UI State
  loading: boolean;
  error: string | null;
}
```

### Actions

#### Group Management
- `fetchCurrentGroup()` - Get current user's group
- `createGroup(dto)` - Create a new group
- `updateGroup(id, dto)` - Update group details
- `deleteGroup(id)` - Delete group (Owner only)

#### Member Management
- `fetchMembers(groupId?)` - Get group members list
- `changeRole(groupId, memberId, role)` - Change member's role
- `removeMember(groupId, memberId)` - Remove member from group

#### Invitation Management
- `fetchInvitations(groupId)` - Get pending invitations
- `sendEmailInvitation(groupId, dto)` - Send email invitation
- `fetchInviteLinks(groupId)` - Get active invite links
- `generateInviteLink(groupId, dto)` - Create shareable invite link
- `revokeInviteLink(linkId)` - Deactivate invite link

#### Utilities
- `clearError()` - Clear error state
- `reset()` - Reset store to initial state

## Usage Examples

### Basic Usage - Fetch Current Group

```typescript
import { useGroupStore } from './stores/useGroupStore';

function MyComponent() {
  const { currentGroup, loading, error, fetchCurrentGroup } = useGroupStore();

  useEffect(() => {
    fetchCurrentGroup();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentGroup) return <div>No group found</div>;

  return <div>{currentGroup.name}</div>;
}
```

### Create a New Group

```typescript
function CreateGroupForm() {
  const { createGroup, loading, error } = useGroupStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await createGroup({
        name: formData.get('name'),
        description: formData.get('description'),
      });
      alert('Group created!');
    } catch (err) {
      // Error is already in store.error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input name="name" placeholder="Group name" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  );
}
```

### Fetch and Display Members

```typescript
function MembersList() {
  const { members, loading, fetchMembers, currentGroup } = useGroupStore();

  useEffect(() => {
    if (currentGroup?.id) {
      fetchMembers(currentGroup.id);
    }
  }, [currentGroup?.id]);

  return (
    <div>
      <h2>Members</h2>
      {loading ? (
        <div>Loading members...</div>
      ) : (
        <ul>
          {members.map(member => (
            <li key={member.id}>
              {member.name} - {member.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Change Member Role

```typescript
function ChangeMemberRole({ memberId }) {
  const { changeRole, currentGroup, loading } = useGroupStore();
  const [newRole, setNewRole] = useState(GroupRole.MEMBER);

  const handleChange = async () => {
    try {
      await changeRole(currentGroup.id, memberId, newRole);
      alert('Role changed!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <select value={newRole} onChange={e => setNewRole(e.target.value)}>
        <option value="viewer">Viewer</option>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleChange} disabled={loading}>
        Change Role
      </button>
    </div>
  );
}
```

### Send Email Invitation

```typescript
function InviteMember() {
  const { sendEmailInvitation, currentGroup, loading } = useGroupStore();

  const handleInvite = async (email, role, message) => {
    try {
      await sendEmailInvitation(currentGroup.id, { email, role, message });
      alert('Invitation sent!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={() => handleInvite('user@example.com', 'member', 'Welcome!')}>
      Send Invitation
    </button>
  );
}
```

### Generate Invite Link

```typescript
function GenerateLink() {
  const { generateInviteLink, currentGroup } = useGroupStore();
  const [link, setLink] = useState(null);

  const handleGenerate = async () => {
    try {
      const inviteLink = await generateInviteLink(currentGroup.id, {
        role: GroupRole.MEMBER,
        maxUses: 10,
      });
      setLink(inviteLink.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate}>Generate Link</button>
      {link && <div>Link: {link}</div>}
    </div>
  );
}
```

## Mock API Integration

The store integrates with the Mock Service Worker (MSW) from TASK-002-015.

### Environment Configuration

Set in `.env.development`:

```bash
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3002
```

- When `VITE_USE_MOCK_API=true`: Uses MSW handlers (mock data)
- When `VITE_USE_MOCK_API=false`: Uses real API at `VITE_API_BASE_URL`

### API Endpoints

The store makes requests to these endpoints:

- `GET /api/groups/current` - Get current user's group
- `POST /api/groups` - Create group
- `PATCH /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `GET /api/groups/:id/members` - List members
- `PATCH /api/groups/:groupId/members/:memberId/role` - Change role
- `DELETE /api/groups/:groupId/members/:memberId` - Remove member
- `GET /api/invitations?groupId=xxx` - List invitations
- `POST /api/invitations` - Send invitation
- `GET /api/invite-links?groupId=xxx` - List invite links
- `POST /api/invite-links` - Generate invite link
- `DELETE /api/invite-links/:id` - Revoke invite link

## Error Handling

All actions handle errors gracefully:

1. Errors are caught and stored in `state.error`
2. Loading state is set to `false`
3. Error is thrown so component can handle it if needed

```typescript
try {
  await createGroup({ name: 'My Group' });
} catch (error) {
  // error is already in store.error
  console.error('Component-level handling:', error);
}
```

Clear errors manually when needed:

```typescript
const { error, clearError } = useGroupStore();

// Clear error before new action
clearError();
await createGroup(...);
```

## Mock Data

The store uses mock data from fixtures:
- `groups.fixture.ts` - 2 test groups
- `members.fixture.ts` - 7 test members
- `invitations.fixture.ts` - 5 test invitations
- `inviteLinks.fixture.ts` - 3 test invite links

Mock behaviors:
- Random delays: 200-500ms
- Validation errors: Empty names, invalid emails
- Authorization errors: 403 for insufficient permissions
- Not found errors: 404 for invalid IDs

## Testing

See `useGroupStore.examples.tsx` for comprehensive usage examples covering:
- Group CRUD operations
- Member management
- Invitations
- Invite links

## Type Definitions

All types are imported from:
- `../types/Group.ts` - Group, CreateGroupDto, UpdateGroupDto
- `../types/GroupMember.ts` - GroupMember, GroupRole
- `../types/Invitation.ts` - Invitation, CreateInvitationDto
- `../types/InviteLink.ts` - InviteLink, CreateInviteLinkDto

## Related Files

- `useGroupStore.ts` - Main store implementation
- `useGroupStore.examples.tsx` - Usage examples
- `../mocks/handlers/groupHandlers.ts` - Mock API handlers
- `../mocks/handlers/invitationHandlers.ts` - Mock invitation handlers
- `../mocks/fixtures/*` - Mock data

## Next Steps

This store is ready for use in Phase 3 UI components:
- TASK-002-018: Group Creation Dialog
- TASK-002-019: Members List Table
- TASK-002-020: Invitation Modal
- TASK-002-021: Role Change Dialog
- TASK-002-022: Group Dashboard Page
