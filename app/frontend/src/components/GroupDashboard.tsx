import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGroupStore } from '../stores/useGroupStore';
import { useInvitationStore } from '../stores/useInvitationStore';
import { GroupRole, DEFAULT_PERMISSIONS } from '../types/GroupMember';
import MembersListTable from './groups/MembersListTable';
import InvitationModal from './groups/InvitationModal';
import GroupCreationDialog from './groups/GroupCreationDialog';
import ConfirmationDialog from './ConfirmationDialog';

interface GroupDashboardProps {
  user?: {
    id: number;
    email: string;
    name: string;
    avatarUrl?: string;
    firestoreId?: string;
    userId?: string;
  } | null;
}

function GroupDashboard({ user }: GroupDashboardProps) {
  const { t: translation } = useTranslation();

  // Group store state
  const {
    currentGroup,
    members,
    loading: groupLoading,
    error: groupError,
    fetchCurrentGroup,
    fetchMembers,
    updateGroup,
    deleteGroup,
  } = useGroupStore();

  // Invitation store state
  const { invitations, loading: invitationsLoading, fetchInvitations } = useInvitationStore();

  // Local state
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });

  // Fetch data on mount
  useEffect(() => {
    fetchCurrentGroup();
  }, [fetchCurrentGroup]);

  // Fetch members and invitations when group is loaded
  useEffect(() => {
    if (currentGroup) {
      fetchMembers(currentGroup.id);
      fetchInvitations(currentGroup.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup?.id]); // Only re-fetch when group ID changes

  // Early guard: user must be authenticated to view groups (after all hooks)
  if (!user) {
    return (
      <div className="error-message" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>{translation('groups.dashboard.authRequired', 'Authentication Required')}</h2>
        <p>
          {translation(
            'groups.dashboard.authRequiredMessage',
            'Please log in to view and manage groups.',
          )}
        </p>
      </div>
    );
  }

  // Get current user's role from authenticated user
  // Use firestoreId/userId (Firestore document ID) for group membership, fallback to numeric id
  const currentUserId = user.firestoreId || user.userId || user.id.toString();
  const currentMember = members.find((m) => m.userId === currentUserId);
  const currentUserRole = currentMember?.role || GroupRole.VIEWER;

  // Check if user is a member of the current group
  const isGroupMember = currentGroup && members.length > 0 ? !!currentMember : true; // Allow access if no group or loading

  // Check permissions
  const canInviteMembers = DEFAULT_PERMISSIONS.invite_members.includes(currentUserRole);
  const canEditGroup = DEFAULT_PERMISSIONS.edit_group.includes(currentUserRole);
  const canDeleteGroup = DEFAULT_PERMISSIONS.delete_group.includes(currentUserRole);

  // Calculate stats
  const totalMembers = members.length;
  const ownerCount = members.filter((m) => m.role === GroupRole.OWNER).length;
  const adminCount = members.filter((m) => m.role === GroupRole.ADMIN).length;
  const memberCount = members.filter((m) => m.role === GroupRole.MEMBER).length;
  const viewerCount = members.filter((m) => m.role === GroupRole.VIEWER).length;
  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending');

  // Handlers
  const handleInvitationSuccess = () => {
    setShowInvitationModal(false);
    if (currentGroup?.id) {
      fetchInvitations(currentGroup.id);
    }
  };

  const handleGroupCreated = (_groupId: string) => {
    setShowCreateGroupDialog(false);
    fetchCurrentGroup();
  };

  const handleEditClick = () => {
    if (currentGroup) {
      setEditFormData({
        name: currentGroup.name,
        description: currentGroup.description || '',
      });
      setShowEditDialog(true);
    }
  };

  const handleEditSubmit = async () => {
    if (!currentGroup) return;

    try {
      await updateGroup(currentGroup.id, editFormData);
      setShowEditDialog(false);
      fetchCurrentGroup();
    } catch (error) {
      console.error('Failed to update group:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentGroup) return;

    try {
      await deleteGroup(currentGroup.id);
      setShowDeleteDialog(false);
      // TODO: Use React Router navigation when user context is available
      // For now, using window.location for full reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  // Loading state
  if (groupLoading && !currentGroup) {
    return (
      <div className="container">
        <div className="page-header">
          <h2>{translation('groups.dashboard.title')}</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {translation('groups.dashboard.loading')}
        </div>
      </div>
    );
  }

  // Not a member of the group
  if (currentGroup && !groupLoading && !isGroupMember) {
    return (
      <div className="container">
        <div className="page-header">
          <h2>{translation('groups.dashboard.title')}</h2>
        </div>
        <div className="error-message" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>{translation('groups.dashboard.notMember', 'Not a Member')}</h3>
          <p>
            {translation(
              'groups.dashboard.notMemberMessage',
              'You are not a member of this group.',
            )}
          </p>
        </div>
      </div>
    );
  }

  // Empty state - no group
  if (!currentGroup && !groupLoading) {
    return (
      <div className="container">
        <div className="page-header">
          <h2>{translation('groups.dashboard.title')}</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
          <h3 style={{ marginBottom: '10px' }}>{translation('groups.dashboard.noGroupTitle')}</h3>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            {translation('groups.dashboard.noGroupDescription')}
          </p>
          <button className="btn btn-primary" onClick={() => setShowCreateGroupDialog(true)}>
            {translation('groups.createGroup')}
          </button>
        </div>
        <GroupCreationDialog
          isOpen={showCreateGroupDialog}
          onClose={() => setShowCreateGroupDialog(false)}
          onSuccess={handleGroupCreated}
        />
      </div>
    );
  }

  // Error state
  if (groupError) {
    return (
      <div className="container">
        <div className="page-header">
          <h2>{translation('groups.dashboard.title')}</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#f44336' }}>
          {translation('groups.dashboard.error')}: {groupError}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>{currentGroup?.name}</h2>
          <p className="page-description">{currentGroup?.description || ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {canEditGroup && (
            <button className="btn btn-secondary" onClick={handleEditClick}>
              {translation('groups.dashboard.editGroup')}
            </button>
          )}
          {canDeleteGroup && (
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteDialog(true)}
              style={{ backgroundColor: '#f44336', color: 'white' }}
            >
              {translation('groups.dashboard.deleteGroup')}
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats">
        <div className="stat-card">
          <h3>{translation('groups.dashboard.totalMembers')}</h3>
          <div className="value">{totalMembers}</div>
        </div>
        <div className="stat-card">
          <h3>{translation('groups.dashboard.totalExpenses')}</h3>
          <div className="value" style={{ color: '#4caf50' }}>
            $0.00
          </div>
        </div>
        <div className="stat-card">
          <h3>{translation('groups.dashboard.memberRoles')}</h3>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>
            <div>
              👑 {translation('groups.roles.owner')}: {ownerCount}
            </div>
            <div>
              ⚙️ {translation('groups.roles.admin')}: {adminCount}
            </div>
            <div>
              👤 {translation('groups.roles.member')}: {memberCount}
            </div>
            <div>
              👁️ {translation('groups.roles.viewer')}: {viewerCount}
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div style={{ marginTop: '30px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3>{translation('groups.members.title')}</h3>
          {canInviteMembers && (
            <button className="btn btn-primary" onClick={() => setShowInvitationModal(true)}>
              {translation('groups.dashboard.inviteMember')}
            </button>
          )}
        </div>
        <MembersListTable
          groupId={currentGroup?.id}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
        />
      </div>

      {/* Pending Invitations Section */}
      {pendingInvitations.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '20px' }}>
            {translation('groups.dashboard.pendingInvitations')}
          </h3>
          <div style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '20px' }}>
            {invitationsLoading ? (
              <div>{translation('groups.dashboard.loadingInvitations')}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{invitation.email}</div>
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                        {translation('groups.invitation.role')}: {invitation.role} •{' '}
                        {translation('groups.invitation.invitedBy')}: {invitation.inviterName}
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#ff9800' }}>
                      {translation('groups.invitation.pending')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {currentGroup && (
        <InvitationModal
          isOpen={showInvitationModal}
          onClose={() => setShowInvitationModal(false)}
          groupId={currentGroup.id}
          onSuccess={handleInvitationSuccess}
        />
      )}

      {/* Edit Group Dialog */}
      <ConfirmationDialog
        isOpen={showEditDialog}
        title={translation('groups.dashboard.editGroupTitle')}
        message=""
        confirmText={translation('groups.dashboard.save')}
        cancelText={translation('groups.dashboard.cancel')}
        onConfirm={handleEditSubmit}
        onCancel={() => setShowEditDialog(false)}
      >
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            {translation('groups.nameLabel')}
          </label>
          <input
            type="text"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            {translation('groups.descriptionLabel')}
          </label>
          <textarea
            value={editFormData.description}
            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>
      </ConfirmationDialog>

      {/* Delete Group Confirmation */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title={translation('groups.dashboard.deleteGroupTitle')}
        message={translation('groups.dashboard.deleteGroupConfirm')}
        confirmText={translation('groups.dashboard.delete')}
        cancelText={translation('groups.dashboard.cancel')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}

export default GroupDashboard;
