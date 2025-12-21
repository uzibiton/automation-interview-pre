# RoleChangeDialog Component

## Overview

The `RoleChangeDialog` component provides a user interface for changing a group member's role with validation to prevent changing the Owner role.

## Features

- **Member Information Display**: Shows member name, email, and avatar
- **Current Role Badge**: Displays the member's current role with color-coded badge
- **Role Selection**: Radio button interface for selecting Admin, Member, or Viewer roles
- **Owner Protection**: Prevents changing the Owner role (displays warning instead)
- **Role Descriptions**: Each role option includes a description of permissions
- **Validation**: Ensures role has changed before allowing submission
- **Success Feedback**: Shows success message before closing dialog
- **Error Handling**: Displays API errors from the store
- **Accessibility**: Full ARIA labels and keyboard navigation support
- **Internationalization**: Uses react-i18next for multi-language support

## Props

```typescript
interface RoleChangeDialogProps {
  isOpen: boolean; // Controls dialog visibility
  member: GroupMember | null; // Member whose role is being changed
  onClose: () => void; // Callback when dialog is closed
  onSuccess?: () => void; // Optional callback after successful role change
}
```

## Usage

### Basic Example

```tsx
import React, { useState } from 'react';
import RoleChangeDialog from './components/groups/RoleChangeDialog';
import { GroupMember } from './types/GroupMember';

function MemberManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);

  const handleChangeRole = (member: GroupMember) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMember(null);
  };

  const handleSuccess = () => {
    console.log('Role changed successfully!');
    // Optionally refresh member list here
  };

  return (
    <div>
      {/* Your member list UI */}
      <button onClick={() => handleChangeRole(someMember)}>Change Role</button>

      {/* Role Change Dialog */}
      <RoleChangeDialog
        isOpen={isDialogOpen}
        member={selectedMember}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
```

### Integration with useGroupStore

The component automatically integrates with the Zustand `useGroupStore` for state management:

```typescript
import { useGroupStore } from '../../stores/useGroupStore';

// Inside the component
const { changeRole, loading, error, clearError } = useGroupStore();

// The changeRole action is called automatically on form submission
await changeRole(member.groupId, member.id, selectedRole);
```

## Role Types

The component supports four role types defined in `GroupRole` enum:

- **OWNER**: Full control (cannot be changed via this dialog)
- **ADMIN**: Can manage members and edit group settings
- **MEMBER**: Can add, edit, and delete own expenses
- **VIEWER**: Can only view group expenses

## Styling

The component uses the following CSS classes (defined in `index.css`):

- `.member-info` - Container for member information
- `.member-avatar` - Member avatar image
- `.member-avatar-placeholder` - Placeholder when no avatar exists
- `.role-badge` - Base role badge style
- `.role-badge-owner`, `.role-badge-admin`, etc. - Role-specific badge colors
- `.role-options` - Container for role radio buttons
- `.role-option` - Individual role option card
- `.alert-success`, `.alert-error`, `.alert-warning` - Alert messages

## Translations

The component requires the following translation keys in your i18n files:

### English (en.json)

```json
{
  "groups": {
    "changeRoleTitle": "Change Member Role",
    "changeRole": "Change Role",
    "changingRole": "Changing...",
    "roleChangeSuccess": "Role changed successfully!",
    "currentRole": "Current Role",
    "selectNewRole": "Select New Role",
    "roleChangeConfirmation": "The member's permissions will be updated immediately.",
    "cannotChangeOwnerRole": "The Owner role cannot be changed.",
    "roles": {
      "owner": "Owner",
      "admin": "Admin",
      "member": "Member",
      "viewer": "Viewer"
    },
    "roleDescriptions": {
      "owner": "Full control over the group",
      "admin": "Can manage members and edit group settings",
      "member": "Can add, edit, and delete own expenses",
      "viewer": "Can only view group expenses"
    }
  }
}
```

## Accessibility

The component follows WCAG 2.1 guidelines:

- All interactive elements have ARIA labels
- Radio buttons use proper `role="radiogroup"`
- Error messages are announced via `role="alert"`
- Keyboard navigation is fully supported
- Focus management for modal dialogs

## Behavior

1. **Opening**: Dialog opens with the member's current role pre-selected
2. **Selection**: User can select a new role from Admin, Member, or Viewer
3. **Validation**: Submit button is disabled if no role change is selected
4. **Submission**: Calls `changeRole` action from store
5. **Success**: Shows success message for 1.5 seconds, then closes
6. **Error**: Displays error message from store
7. **Closing**: Can be closed via X button, Cancel button, or overlay click

## Owner Role Protection

When a member with the Owner role is selected:

- The role selector is hidden
- A warning message is displayed
- The submit button is not shown
- Only the Cancel button is available

This prevents accidental or unauthorized changes to the Owner role.

## Dependencies

- React 18+
- react-i18next (for translations)
- Zustand (for state management via useGroupStore)
- GroupMember and GroupRole types

## Related Components

- `GroupCreationDialog` - For creating new groups
- `InvitationModal` - For inviting new members
- `MembersListTable` - For displaying the members list

## Testing

A comprehensive example component is available at:

- `src/components/groups/RoleChangeDialog.example.tsx`

This example demonstrates integration with a member list and can be used for manual testing during development.
