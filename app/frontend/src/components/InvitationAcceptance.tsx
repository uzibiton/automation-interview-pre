/**
 * Invitation Acceptance Page Component
 *
 * Page for accepting or declining email and link invitations.
 * Handles invalid/expired tokens with appropriate error messages.
 *
 * Route: /invitations/:token
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvitationStore } from '../stores/useInvitationStore';
import { Invitation } from '../types/Invitation';

function InvitationAcceptance() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { getInvitationByToken, acceptInvitation, declineInvitation, loading, error } =
    useInvitationStore();

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch invitation details on load
    const fetchInvitation = async () => {
      if (!token) {
        setFetchError('Invalid invitation link');
        return;
      }

      try {
        const invitationData = await getInvitationByToken(token);
        setInvitation(invitationData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load invitation';
        setFetchError(errorMessage);
      }
    };

    fetchInvitation();
  }, [token, getInvitationByToken]);

  const handleAccept = async () => {
    if (!token) return;

    setActionLoading(true);
    try {
      await acceptInvitation(token);
      setSuccessMessage('Invitation accepted! Redirecting to your group...');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch {
      // Error is already set in the store
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!token) return;

    setActionLoading(true);
    try {
      await declineInvitation(token);
      setSuccessMessage('Invitation declined. Redirecting to home...');

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch {
      // Error is already set in the store
    } finally {
      setActionLoading(false);
    }
  };

  // Show loading state
  if (loading && !invitation) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #4285f4',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}
            />
            <p style={{ color: '#666' }}>Loading invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (fetchError || (!loading && !invitation)) {
    const errorMsg = fetchError || error || 'Invitation not found';
    const isExpired = errorMsg.toLowerCase().includes('expired');
    const isAlreadyAccepted = errorMsg.toLowerCase().includes('already');

    return (
      <div className="login-page">
        <div className="login-card">
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#fee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <span style={{ fontSize: '30px', color: '#e53e3e' }}>⚠️</span>
            </div>
            <h2 style={{ marginBottom: '15px', color: '#333' }}>
              {isExpired
                ? 'Invitation Expired'
                : isAlreadyAccepted
                  ? 'Already a Member'
                  : 'Invalid Invitation'}
            </h2>
            <p style={{ color: '#666', marginBottom: '25px' }}>{errorMsg}</p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (successMessage) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#e6ffed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <span style={{ fontSize: '30px', color: '#22c55e' }}>✓</span>
            </div>
            <h2 style={{ marginBottom: '15px', color: '#333' }}>Success!</h2>
            <p style={{ color: '#666' }}>{successMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show invitation details and action buttons
  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: 'center' }}>
          {/* Invitation Icon */}
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <span style={{ fontSize: '30px' }}>📧</span>
          </div>

          {/* Title */}
          <h2 style={{ marginBottom: '10px', color: '#333' }}>Group Invitation</h2>

          {/* Invitation Details */}
          <div
            style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '25px',
              textAlign: 'left',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>Group:</span>
              <div style={{ fontWeight: '600', fontSize: '16px', marginTop: '4px' }}>
                {invitation?.groupName}
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>Invited by:</span>
              <div style={{ fontWeight: '500', fontSize: '15px', marginTop: '4px' }}>
                {invitation?.inviterName}
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>Email:</span>
              <div style={{ fontWeight: '500', fontSize: '15px', marginTop: '4px' }}>
                {invitation?.email}
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>Role:</span>
              <div style={{ fontWeight: '500', fontSize: '15px', marginTop: '4px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  {invitation?.role}
                </span>
              </div>
            </div>
            {invitation?.message && (
              <div>
                <span style={{ color: '#666', fontSize: '14px' }}>Message:</span>
                <div
                  style={{
                    fontStyle: 'italic',
                    color: '#555',
                    marginTop: '4px',
                    fontSize: '14px',
                  }}
                >
                  &quot;{invitation.message}&quot;
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: '#fee',
                color: '#c53030',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleDecline}
              disabled={actionLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: actionLoading ? 0.6 : 1,
              }}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={actionLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: actionLoading ? 0.6 : 1,
              }}
            >
              {actionLoading ? 'Processing...' : 'Accept Invitation'}
            </button>
          </div>
        </div>
      </div>

      {/* Add spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default InvitationAcceptance;
