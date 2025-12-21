import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MembersListTable from './groups/MembersListTable';
import { useGroupStore } from '../stores/useGroupStore';
import { GroupRole } from '../types/GroupMember';

interface MembersTestPageProps {
  token: string;
}

/**
 * Test/Demo page for MembersListTable component
 *
 * This page demonstrates the MembersListTable component with mock data.
 * It shows different user roles and permission-based action visibility.
 */
function MembersTestPage({ token }: MembersTestPageProps) {
  const { t: translation } = useTranslation();
  const { currentGroup, fetchCurrentGroup } = useGroupStore();

  useEffect(() => {
    // Fetch the current user's group
    fetchCurrentGroup().catch((error) => {
      console.log('No current group found or error fetching:', error);
    });
  }, [fetchCurrentGroup]);

  // For demo purposes, use group-1 as the default group ID
  const groupId = currentGroup?.id || 'group-1';

  // Demo: Show the component as an Admin user
  const demoUserRole = GroupRole.ADMIN;
  const demoUserId = 'user-2'; // Jane Smith (Admin)

  return (
    <div className="container">
      <div className="page-header">
        <h1>{translation('groups.members.title')}</h1>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Demo page for Members List Table component - Viewing as: {demoUserRole}
        </p>
      </div>

      <div style={{ marginTop: '24px' }}>
        <MembersListTable
          groupId={groupId}
          currentUserRole={demoUserRole}
          currentUserId={demoUserId}
        />
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ marginBottom: '12px' }}>Component Features:</h3>
        <ul style={{ lineHeight: '1.8', color: '#666' }}>
          <li>✓ Displays members with avatar, name, email, role, and joined date</li>
          <li>✓ Color-coded role badges (Owner, Admin, Member, Viewer)</li>
          <li>✓ Conditional action buttons based on permissions</li>
          <li>✓ Change Role button (Admin/Owner only, not for Owner role)</li>
          <li>✓ Remove Member button (Admin/Owner only, not for Owner or self)</li>
          <li>✓ Reset Password button (Admin/Owner only, not for Owner)</li>
          <li>✓ Loading state with skeleton loaders</li>
          <li>✓ Empty state when no members</li>
          <li>✓ Confirmation dialogs for destructive actions</li>
          <li>✓ Role change dialog with radio buttons</li>
          <li>✓ Mobile responsive design</li>
        </ul>
      </div>
    </div>
  );
}

export default MembersTestPage;
