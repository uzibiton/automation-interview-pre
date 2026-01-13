import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GroupRole, GroupMember } from '../../types/GroupMember';
import { useGroupStore } from '../../stores/useGroupStore';

interface RoleChangeDialogProps {
  isOpen: boolean;
  member: GroupMember | null;
  onClose: () => void;
  onSuccess?: () => void;
}

function RoleChangeDialog({ isOpen, member, onClose, onSuccess }: RoleChangeDialogProps) {
  const { t: translation } = useTranslation();
  const { changeRole, loading, error: storeError, clearError } = useGroupStore();

  const [selectedRole, setSelectedRole] = useState<GroupRole | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const prevIsOpenRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track dialog open/close transitions
  if (isOpen && !prevIsOpenRef.current) {
    prevIsOpenRef.current = true;
  } else if (!isOpen && prevIsOpenRef.current) {
    prevIsOpenRef.current = false;
  }

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && member) {
      setSelectedRole(member.role);
      setSuccessMessage(null);
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, member?.id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member || !selectedRole || selectedRole === member.role) {
      return;
    }

    try {
      await changeRole(member.groupId, member.id, selectedRole);

      // Show success message
      setSuccessMessage(translation('groups.roleChangeSuccess'));

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }

      // Close dialog after a brief delay to show success message
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      // Error is already set in the store
      console.error('Failed to change role:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const getRoleBadgeClass = (role: GroupRole): string => {
    switch (role) {
      case GroupRole.OWNER:
        return 'role-badge role-badge-owner';
      case GroupRole.ADMIN:
        return 'role-badge role-badge-admin';
      case GroupRole.MEMBER:
        return 'role-badge role-badge-member';
      case GroupRole.VIEWER:
        return 'role-badge role-badge-viewer';
      default:
        return 'role-badge';
    }
  };

  const getRoleLabel = (role: GroupRole): string => {
    return translation(`groups.roles.${role}`);
  };

  const getRoleDescription = (role: GroupRole): string => {
    return translation(`groups.roleDescriptions.${role}`);
  };

  const canChangeRole = member?.role !== GroupRole.OWNER;
  const isRoleChanged = selectedRole && selectedRole !== member?.role;

  if (!isOpen || !member) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} data-testid="role-change-dialog-overlay">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        data-testid="role-change-dialog"
      >
        <div className="modal-header">
          <h3>{translation('groups.changeRoleTitle')}</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
            aria-label={translation('common.cancel')}
            data-testid="role-change-dialog-close-button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Success message */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {/* Error message from store */}
          {storeError && (
            <div className="alert alert-error" role="alert">
              {storeError}
            </div>
          )}

          {/* Member information */}
          <div className="member-info">
            <div className="member-header">
              {member.avatar && (
                <img src={member.avatar} alt={member.name} className="member-avatar" />
              )}
              {!member.avatar && (
                <div className="member-avatar-placeholder">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="member-details">
                <h4>{member.name}</h4>
                <p className="member-email">{member.email}</p>
              </div>
            </div>

            <div className="current-role-display">
              <span className="label">{translation('groups.currentRole')}:</span>
              <span className={getRoleBadgeClass(member.role)}>{getRoleLabel(member.role)}</span>
            </div>
          </div>

          {/* Warning for Owner role */}
          {!canChangeRole && (
            <div className="alert alert-warning" role="alert">
              {translation('groups.cannotChangeOwnerRole')}
            </div>
          )}

          {/* Role selector */}
          {canChangeRole && (
            <div className="form-group">
              <label htmlFor="newRole">
                {translation('groups.selectNewRole')} <span className="required">*</span>
              </label>

              <div
                className="role-options"
                role="radiogroup"
                aria-label={translation('groups.selectNewRole')}
              >
                {[GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER].map((role) => (
                  <label
                    key={role}
                    className={`role-option ${selectedRole === role ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={(e) => setSelectedRole(e.target.value as GroupRole)}
                      disabled={loading}
                      aria-describedby={`role-desc-${role}`}
                      data-testid={`role-change-dialog-role-${role.toLowerCase()}`}
                    />
                    <div className="role-option-content">
                      <div className="role-option-header">
                        <span className={getRoleBadgeClass(role)}>{getRoleLabel(role)}</span>
                      </div>
                      <p id={`role-desc-${role}`} className="role-option-description">
                        {getRoleDescription(role)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="confirmation-note">
                <p>{translation('groups.roleChangeConfirmation')}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {canChangeRole && (
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
                data-testid="role-change-dialog-cancel-button"
              >
                {translation('common.cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !isRoleChanged}
                data-testid="role-change-dialog-submit-button"
              >
                {loading ? translation('groups.changingRole') : translation('groups.changeRole')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RoleChangeDialog;
