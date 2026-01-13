import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { GroupRole } from '../../types/GroupMember';

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess?: () => void;
}

type ActiveTab = 'email' | 'link';

interface FormErrors {
  email?: string;
  role?: string;
  maxUses?: string;
}

function InvitationModal({ isOpen, onClose, groupId, onSuccess }: InvitationModalProps) {
  const { t: translation } = useTranslation();
  const {
    sendEmailInvitation,
    generateInviteLink,
    loading,
    error: storeError,
    clearError,
  } = useInvitationStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>('email');

  // Email tab form data
  const [email, setEmail] = useState('');
  const [emailRole, setEmailRole] = useState<GroupRole | ''>('');
  const [message, setMessage] = useState('');

  // Link tab form data
  const [linkRole, setLinkRole] = useState<GroupRole | ''>('');
  const [maxUses, setMaxUses] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; role: boolean; maxUses: boolean }>({
    email: false,
    role: false,
    maxUses: false,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const prevIsOpenRef = useRef(false);

  // Reset form when dialog opens - use ref to track previous state
  if (isOpen && !prevIsOpenRef.current) {
    prevIsOpenRef.current = true;
  } else if (!isOpen && prevIsOpenRef.current) {
    prevIsOpenRef.current = false;
  }

  // Perform reset actions in effect when dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('email');
      setEmail('');
      setEmailRole('');
      setMessage('');
      setLinkRole('');
      setMaxUses('');
      setGeneratedLink('');
      setErrors({});
      setTouched({ email: false, role: false, maxUses: false });
      setSuccessMessage(null);
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen ? 'opened' : 'closed']);

  // Email validation
  const validateEmail = useCallback(
    (emailValue: string): string | undefined => {
      const trimmedEmail = emailValue.trim();
      if (!trimmedEmail) {
        return translation('groups.invitation.emailRequired');
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return translation('groups.invitation.emailInvalid');
      }
      return undefined;
    },
    [translation],
  );

  // Role validation
  const validateRole = useCallback(
    (role: string): string | undefined => {
      if (!role) {
        return translation('groups.invitation.roleRequired');
      }
      return undefined;
    },
    [translation],
  );

  // Max uses validation
  const validateMaxUses = useCallback(
    (maxUsesValue: string): string | undefined => {
      if (maxUsesValue.trim() === '') {
        return undefined; // Optional field
      }
      const num = parseInt(maxUsesValue, 10);
      if (isNaN(num) || num <= 0) {
        return translation('groups.invitation.maxUsesInvalid');
      }
      return undefined;
    },
    [translation],
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (touched.email) {
      const error = validateEmail(value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors.email = error;
        } else {
          delete newErrors.email;
        }
        return newErrors;
      });
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>, tab: ActiveTab) => {
    const value = e.target.value as GroupRole;

    if (tab === 'email') {
      setEmailRole(value);
    } else {
      setLinkRole(value);
    }

    if (touched.role) {
      const error = validateRole(value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors.role = error;
        } else {
          delete newErrors.role;
        }
        return newErrors;
      });
    }
  };

  const handleMaxUsesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxUses(value);

    if (touched.maxUses) {
      const error = validateMaxUses(value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors.maxUses = error;
        } else {
          delete newErrors.maxUses;
        }
        return newErrors;
      });
    }
  };

  const handleBlur = (field: 'email' | 'role' | 'maxUses') => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const newErrors = { ...errors };
    if (field === 'email') {
      const error = validateEmail(email);
      if (error) {
        newErrors.email = error;
      } else {
        delete newErrors.email;
      }
    } else if (field === 'role') {
      const role = activeTab === 'email' ? emailRole : linkRole;
      const error = validateRole(role);
      if (error) {
        newErrors.role = error;
      } else {
        delete newErrors.role;
      }
    } else if (field === 'maxUses') {
      const error = validateMaxUses(maxUses);
      if (error) {
        newErrors.maxUses = error;
      } else {
        delete newErrors.maxUses;
      }
    }
    setErrors(newErrors);
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark fields as touched
    setTouched({ email: true, role: true, maxUses: false });

    // Validate
    const emailError = validateEmail(email);
    const roleError = validateRole(emailRole);

    if (emailError || roleError) {
      setErrors({
        email: emailError,
        role: roleError,
      });
      return;
    }

    try {
      await sendEmailInvitation(
        groupId,
        email.trim(),
        emailRole as GroupRole,
        message.trim() || undefined,
      );

      setSuccessMessage(translation('groups.invitation.invitationSent'));

      // Trigger success callback to refresh data
      if (onSuccess) {
        onSuccess();
      }

      // Reset email form
      setEmail('');
      setEmailRole('');
      setMessage('');
      setErrors({});
      setTouched({ email: false, role: false, maxUses: false });

      // Close dialog after a brief delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
  };

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark fields as touched
    setTouched({ email: false, role: true, maxUses: true });

    // Validate
    const roleError = validateRole(linkRole);
    const maxUsesError = validateMaxUses(maxUses);

    if (roleError || maxUsesError) {
      setErrors({
        role: roleError,
        maxUses: maxUsesError,
      });
      return;
    }

    try {
      const maxUsesNum = maxUses.trim() ? parseInt(maxUses, 10) : null;
      const inviteLink = await generateInviteLink(groupId, linkRole as GroupRole, maxUsesNum);

      // Generate the full URL for the invite link
      const baseUrl = window.location.origin;
      const linkUrl = `${baseUrl}/invite/${inviteLink.token}`;
      setGeneratedLink(linkUrl);

      setSuccessMessage(translation('groups.invitation.linkGeneratedSuccess'));

      // Trigger success callback to refresh data
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to generate invite link:', error);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink).then(() => {
        setSuccessMessage(translation('groups.invitation.linkCopied'));
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      });
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setErrors({});
    setTouched({ email: false, role: false, maxUses: false });
    setSuccessMessage(null);
    clearError();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} data-testid="invitation-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} data-testid="invitation-modal">
        <div className="modal-header">
          <h3>{translation('groups.invitation.title')}</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
            aria-label={translation('common.cancel')}
            data-testid="invitation-modal-close-button"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => handleTabChange('email')}
            type="button"
            data-testid="invitation-modal-email-tab"
          >
            {translation('groups.invitation.emailTab')}
          </button>
          <button
            className={`tab-button ${activeTab === 'link' ? 'active' : ''}`}
            onClick={() => handleTabChange('link')}
            type="button"
            data-testid="invitation-modal-link-tab"
          >
            {translation('groups.invitation.linkTab')}
          </button>
        </div>

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

        {/* Email Invitation Tab */}
        {activeTab === 'email' && (
          <div className="tab-content">
            <form onSubmit={handleSendInvitation} data-testid="invitation-modal-email-form">
              {/* Email field */}
              <div className="form-group">
                <label htmlFor="inviteEmail">
                  {translation('groups.invitation.emailLabel')} <span className="required">*</span>
                </label>
                <input
                  id="inviteEmail"
                  name="email"
                  type="email"
                  className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  disabled={loading}
                  placeholder={translation('groups.invitation.emailPlaceholder')}
                  aria-required="true"
                  aria-invalid={!!errors.email && touched.email}
                  aria-describedby={errors.email && touched.email ? 'emailError' : undefined}
                  data-testid="invitation-modal-email-input"
                />
                {errors.email && touched.email && (
                  <span id="emailError" className="error-message" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Role selector */}
              <div className="form-group">
                <label htmlFor="emailRole">
                  {translation('groups.invitation.roleLabel')} <span className="required">*</span>
                </label>
                <select
                  id="emailRole"
                  name="role"
                  className={`form-control ${errors.role && touched.role ? 'error' : ''}`}
                  value={emailRole}
                  onChange={(e) => handleRoleChange(e, 'email')}
                  onBlur={() => handleBlur('role')}
                  disabled={loading}
                  aria-required="true"
                  aria-invalid={!!errors.role && touched.role}
                  aria-describedby={errors.role && touched.role ? 'roleError' : undefined}
                  data-testid="invitation-modal-email-role-select"
                >
                  <option value="">{translation('groups.invitation.rolePlaceholder')}</option>
                  <option value={GroupRole.ADMIN}>
                    {translation('groups.invitation.roles.admin')}
                  </option>
                  <option value={GroupRole.MEMBER}>
                    {translation('groups.invitation.roles.member')}
                  </option>
                  <option value={GroupRole.VIEWER}>
                    {translation('groups.invitation.roles.viewer')}
                  </option>
                </select>
                {errors.role && touched.role && (
                  <span id="roleError" className="error-message" role="alert">
                    {errors.role}
                  </span>
                )}
              </div>

              {/* Optional message */}
              <div className="form-group">
                <label htmlFor="inviteMessage">
                  {translation('groups.invitation.messageLabel')}
                </label>
                <textarea
                  id="inviteMessage"
                  name="message"
                  className="form-control"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  placeholder={translation('groups.invitation.messagePlaceholder')}
                  rows={3}
                  data-testid="invitation-modal-message-input"
                />
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={loading}
                  data-testid="invitation-modal-email-cancel-button"
                >
                  {translation('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || Object.keys(errors).length > 0}
                  data-testid="invitation-modal-send-button"
                >
                  {loading
                    ? translation('groups.invitation.sending')
                    : translation('groups.invitation.sendInvitation')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Shareable Link Tab */}
        {activeTab === 'link' && (
          <div className="tab-content">
            <form onSubmit={handleGenerateLink} data-testid="invitation-modal-link-form">
              {/* Role selector */}
              <div className="form-group">
                <label htmlFor="linkRole">
                  {translation('groups.invitation.roleLabel')} <span className="required">*</span>
                </label>
                <select
                  id="linkRole"
                  name="role"
                  className={`form-control ${errors.role && touched.role ? 'error' : ''}`}
                  value={linkRole}
                  onChange={(e) => handleRoleChange(e, 'link')}
                  onBlur={() => handleBlur('role')}
                  disabled={loading}
                  aria-required="true"
                  aria-invalid={!!errors.role && touched.role}
                  aria-describedby={errors.role && touched.role ? 'linkRoleError' : undefined}
                  data-testid="invitation-modal-link-role-select"
                >
                  <option value="">{translation('groups.invitation.rolePlaceholder')}</option>
                  <option value={GroupRole.ADMIN}>
                    {translation('groups.invitation.roles.admin')}
                  </option>
                  <option value={GroupRole.MEMBER}>
                    {translation('groups.invitation.roles.member')}
                  </option>
                  <option value={GroupRole.VIEWER}>
                    {translation('groups.invitation.roles.viewer')}
                  </option>
                </select>
                {errors.role && touched.role && (
                  <span id="linkRoleError" className="error-message" role="alert">
                    {errors.role}
                  </span>
                )}
              </div>

              {/* Max uses */}
              <div className="form-group">
                <label htmlFor="maxUses">{translation('groups.invitation.maxUsesLabel')}</label>
                <input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  className={`form-control ${errors.maxUses && touched.maxUses ? 'error' : ''}`}
                  value={maxUses}
                  onChange={handleMaxUsesChange}
                  onBlur={() => handleBlur('maxUses')}
                  disabled={loading}
                  placeholder={translation('groups.invitation.maxUsesPlaceholder')}
                  min="1"
                  aria-invalid={!!errors.maxUses && touched.maxUses}
                  aria-describedby={errors.maxUses && touched.maxUses ? 'maxUsesError' : undefined}
                  data-testid="invitation-modal-max-uses-input"
                />
                {errors.maxUses && touched.maxUses && (
                  <span id="maxUsesError" className="error-message" role="alert">
                    {errors.maxUses}
                  </span>
                )}
              </div>

              {/* Display generated link */}
              {generatedLink && (
                <div className="link-display" data-testid="invitation-modal-generated-link-container">
                  <div className="link-display-header">
                    <h4>{translation('groups.invitation.linkGenerated')}</h4>
                  </div>
                  <div className="link-url">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      data-testid="invitation-modal-generated-link-input"
                    />
                    <button type="button" className="btn btn-secondary" onClick={handleCopyLink} data-testid="invitation-modal-copy-link-button">
                      {translation('groups.invitation.copyLink')}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={loading}
                  data-testid="invitation-modal-link-cancel-button"
                >
                  {translation('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || Object.keys(errors).length > 0}
                  data-testid="invitation-modal-generate-link-button"
                >
                  {loading
                    ? translation('groups.invitation.generating')
                    : translation('groups.invitation.generateLink')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationModal;
