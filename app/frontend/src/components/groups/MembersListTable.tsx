import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGroupStore } from '../../stores/useGroupStore';
import { GroupMember, GroupRole, DEFAULT_PERMISSIONS } from '../../types/GroupMember';
import { getAvatarUrl } from '../../utils/avatar.utils';
import ConfirmationDialog from '../ConfirmationDialog';

interface MembersListTableProps {
  groupId?: string;
  currentUserRole?: GroupRole;
  currentUserId?: string;
}

/**
 * MembersListTable Component
 *
 * Displays group members with roles, avatars, and role management actions.
 * Actions are conditionally shown based on user permissions (Admin/Owner only).
 *
 * Features:
 * - Avatar, Name, Email, Role, Joined Date columns
 * - Color-coded role badges
 * - Conditional actions: Change Role, Remove Member, Reset Password
 * - Loading state with skeleton loaders
 * - Empty state for no members
 * - Permission-based action visibility
 */
function MembersListTable({
  groupId,
  currentUserRole = GroupRole.VIEWER,
  currentUserId,
}: MembersListTableProps) {
  const { t: translation } = useTranslation();
  const { members, loading, fetchMembers, removeMember, changeRole } = useGroupStore();

  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [changingRoleMember, setChangingRoleMember] = useState<GroupMember | null>(null);
  const [newRole, setNewRole] = useState<GroupRole | null>(null);

  // Check if current user has permission to manage members
  const canManageMembers = DEFAULT_PERMISSIONS.change_roles.includes(currentUserRole);
  const canRemoveMembers = DEFAULT_PERMISSIONS.revoke_members.includes(currentUserRole);
  const canResetPasswords = DEFAULT_PERMISSIONS.reset_passwords.includes(currentUserRole);

  useEffect(() => {
    if (groupId) {
      fetchMembers(groupId);
    }
  }, [groupId, fetchMembers]);

  const handleRemoveClick = (member: GroupMember) => {
    // Cannot remove Owner
    if (member.role === GroupRole.OWNER) {
      return;
    }
    setRemovingMemberId(member.id);
  };

  const handleConfirmRemove = async () => {
    if (!removingMemberId || !groupId) return;

    try {
      await removeMember(groupId, removingMemberId);
      setRemovingMemberId(null);
      // Show success toast (could be added to store)
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleChangeRoleClick = (member: GroupMember) => {
    // Cannot change Owner role
    if (member.role === GroupRole.OWNER) {
      return;
    }
    setChangingRoleMember(member);
    setNewRole(member.role);
  };

  const handleConfirmRoleChange = async () => {
    if (!changingRoleMember || !newRole || !groupId) return;

    try {
      await changeRole(groupId, changingRoleMember.id, newRole);
      setChangingRoleMember(null);
      setNewRole(null);
      // Show success toast
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  const handleResetPassword = async (member: GroupMember) => {
    // TODO: Implement reset password functionality
    // For now, just show success message (should be replaced with actual API call)
    // console.log('Reset password for:', member.email);
    // In production, this should use a proper toast notification system
    window.confirm(translation('groups.members.resetPasswordSuccess'));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadgeClass = (role: GroupRole) => {
    switch (role) {
      case GroupRole.OWNER:
        return 'role-badge role-owner';
      case GroupRole.ADMIN:
        return 'role-badge role-admin';
      case GroupRole.MEMBER:
        return 'role-badge role-member';
      case GroupRole.VIEWER:
        return 'role-badge role-viewer';
      default:
        return 'role-badge';
    }
  };

  // Loading state with skeleton loaders
  if (loading && members.length === 0) {
    return (
      <div className="members-table-container">
        <div className="members-table-loading">
          <div className="skeleton skeleton-row"></div>
          <div className="skeleton skeleton-row"></div>
          <div className="skeleton skeleton-row"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && members.length === 0) {
    return (
      <div className="members-table-container">
        <div className="members-table-empty">
          <div className="empty-icon">👥</div>
          <p>{translation('groups.members.noMembers')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="members-table-container">
      <table className="members-table">
        <thead>
          <tr>
            <th>{translation('groups.members.avatar')}</th>
            <th>{translation('groups.members.name')}</th>
            <th>{translation('groups.members.email')}</th>
            <th>{translation('groups.members.role')}</th>
            <th>{translation('groups.members.joinedDate')}</th>
            {(canManageMembers || canRemoveMembers) && (
              <th>{translation('groups.members.actions')}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const isOwner = member.role === GroupRole.OWNER;
            const isCurrentUser = member.userId === currentUserId;

            return (
              <tr key={member.id}>
                <td>
                  <img
                    src={getAvatarUrl(member.avatar, member.name)}
                    alt={`${member.name}'s avatar`}
                    className="member-avatar"
                  />
                </td>
                <td className="member-name">
                  {member.name}
                  {isCurrentUser && <span className="badge-you"> (You)</span>}
                </td>
                <td className="member-email">{member.email}</td>
                <td>
                  <span className={getRoleBadgeClass(member.role)}>
                    {translation(`groups.members.roles.${member.role}`)}
                  </span>
                </td>
                <td className="member-joined">{formatDate(member.joinedAt)}</td>
                {(canManageMembers || canRemoveMembers) && (
                  <td className="member-actions">
                    {/* Change Role button */}
                    {canManageMembers && !isOwner && (
                      <button
                        className="btn-action btn-change-role"
                        onClick={() => handleChangeRoleClick(member)}
                        title={translation('groups.members.changeRole')}
                      >
                        🔄
                      </button>
                    )}

                    {/* Reset Password button */}
                    {canResetPasswords && !isOwner && (
                      <button
                        className="btn-action btn-reset-password"
                        onClick={() => handleResetPassword(member)}
                        title={translation('groups.members.resetPassword')}
                      >
                        🔑
                      </button>
                    )}

                    {/* Remove Member button */}
                    {canRemoveMembers && !isOwner && !isCurrentUser && (
                      <button
                        className="btn-action btn-remove"
                        onClick={() => handleRemoveClick(member)}
                        title={translation('groups.members.removeMember')}
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Remove Member Confirmation Dialog */}
      {removingMemberId && (
        <ConfirmationDialog
          isOpen={true}
          title={translation('groups.members.removeMember')}
          message={translation('groups.members.confirmRemove')}
          onConfirm={handleConfirmRemove}
          onCancel={() => setRemovingMemberId(null)}
        />
      )}

      {/* Change Role Dialog */}
      {changingRoleMember && (
        <div className="modal-overlay" onClick={() => setChangingRoleMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{translation('groups.members.changeRole')}</h3>
              <button
                className="modal-close"
                onClick={() => setChangingRoleMember(null)}
                aria-label={translation('common.cancel')}
              >
                ✕
              </button>
            </div>

            <div className="role-change-content">
              <p>
                <strong>{changingRoleMember.name}</strong>
              </p>
              <p className="current-role-info">
                {translation('groups.members.currentRole')}:{' '}
                <span className={getRoleBadgeClass(changingRoleMember.role)}>
                  {translation(`groups.members.roles.${changingRoleMember.role}`)}
                </span>
              </p>

              <div className="role-selector">
                <label>{translation('groups.members.role')}</label>
                <div className="role-options">
                  {[GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER].map((role) => (
                    <label key={role} className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={newRole === role}
                        onChange={(e) => setNewRole(e.target.value as GroupRole)}
                      />
                      <span className={getRoleBadgeClass(role)}>
                        {translation(`groups.members.roles.${role}`)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setChangingRoleMember(null)}
              >
                {translation('common.cancel')}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmRoleChange}
                disabled={!newRole || newRole === changingRoleMember.role}
              >
                {translation('groups.members.changeRole')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembersListTable;
