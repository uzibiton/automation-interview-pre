/**
 * Example usage of useGroupStore
 *
 * This file demonstrates how to use the Group Management Store in React components.
 */

import React, { useEffect } from 'react';
import { useGroupStore } from '../stores/useGroupStore';
import { GroupRole } from '../types/GroupMember';

/**
 * Example Component: Display Current Group
 */
export function CurrentGroupExample() {
  const { currentGroup, loading, error, fetchCurrentGroup } = useGroupStore();

  useEffect(() => {
    fetchCurrentGroup();
  }, [fetchCurrentGroup]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentGroup) return <div>No group found</div>;

  return (
    <div>
      <h2>{currentGroup.name}</h2>
      <p>{currentGroup.description}</p>
      <p>Members: {currentGroup.memberCount}</p>
    </div>
  );
}

/**
 * Example Component: Create Group Form
 */
export function CreateGroupExample() {
  const { createGroup, loading, error, clearError } = useGroupStore();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await createGroup({ name, description });
      alert('Group created successfully!');
      setName('');
      setDescription('');
    } catch (err) {
      // Error is already set in the store
      console.error('Failed to create group:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Group</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <label>Group Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={3}
          maxLength={100}
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  );
}

/**
 * Example Component: Members List
 */
export function MembersListExample() {
  const { members, loading, error, fetchMembers, currentGroup } = useGroupStore();

  useEffect(() => {
    if (currentGroup?.id) {
      fetchMembers(currentGroup.id);
    }
  }, [currentGroup?.id, fetchMembers]);

  if (loading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Group Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name} - {member.email} - {member.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example Component: Change Member Role
 */
export function ChangeRoleExample({ memberId }: { memberId: string }) {
  const { changeRole, currentGroup, loading } = useGroupStore();
  const [selectedRole, setSelectedRole] = React.useState<GroupRole>(GroupRole.MEMBER);

  const handleChangeRole = async () => {
    if (!currentGroup) return;

    try {
      await changeRole(currentGroup.id, memberId, selectedRole);
      alert('Role changed successfully!');
    } catch (err) {
      console.error('Failed to change role:', err);
    }
  };

  return (
    <div>
      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as GroupRole)}>
        <option value={GroupRole.VIEWER}>Viewer</option>
        <option value={GroupRole.MEMBER}>Member</option>
        <option value={GroupRole.ADMIN}>Admin</option>
        <option value={GroupRole.OWNER}>Owner</option>
      </select>

      <button onClick={handleChangeRole} disabled={loading}>
        {loading ? 'Changing...' : 'Change Role'}
      </button>
    </div>
  );
}

/**
 * Example Component: Send Invitation
 */
export function SendInvitationExample() {
  const { sendEmailInvitation, currentGroup, loading } = useGroupStore();
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<GroupRole>(GroupRole.MEMBER);
  const [message, setMessage] = React.useState('');

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGroup) return;

    try {
      await sendEmailInvitation(currentGroup.id, { email, role, message });
      alert('Invitation sent successfully!');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Failed to send invitation:', err);
    }
  };

  return (
    <form onSubmit={handleSendInvitation}>
      <h2>Send Email Invitation</h2>

      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value as GroupRole)}>
          <option value={GroupRole.VIEWER}>Viewer</option>
          <option value={GroupRole.MEMBER}>Member</option>
          <option value={GroupRole.ADMIN}>Admin</option>
        </select>
      </div>

      <div>
        <label>Message (optional):</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Invitation'}
      </button>
    </form>
  );
}

/**
 * Example Component: Generate Invite Link
 */
export function GenerateInviteLinkExample() {
  const { generateInviteLink, currentGroup, loading } = useGroupStore();
  const [role, setRole] = React.useState<GroupRole>(GroupRole.MEMBER);
  const [maxUses, setMaxUses] = React.useState<number | null>(null);
  const [generatedLink, setGeneratedLink] = React.useState<string | null>(null);

  const handleGenerateLink = async () => {
    if (!currentGroup) return;

    try {
      const link = await generateInviteLink(currentGroup.id, { role, maxUses });
      setGeneratedLink(`${window.location.origin}/invite/${link.token}`);
      alert('Invite link generated successfully!');
    } catch (err) {
      console.error('Failed to generate invite link:', err);
    }
  };

  return (
    <div>
      <h2>Generate Invite Link</h2>

      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value as GroupRole)}>
          <option value={GroupRole.VIEWER}>Viewer</option>
          <option value={GroupRole.MEMBER}>Member</option>
          <option value={GroupRole.ADMIN}>Admin</option>
        </select>
      </div>

      <div>
        <label>Max Uses (optional):</label>
        <input
          type="number"
          min="1"
          value={maxUses || ''}
          onChange={(e) => setMaxUses(e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>

      <button onClick={handleGenerateLink} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Link'}
      </button>

      {generatedLink && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0' }}>
          <strong>Generated Link:</strong>
          <br />
          <a href={generatedLink} target="_blank" rel="noopener noreferrer">
            {generatedLink}
          </a>
        </div>
      )}
    </div>
  );
}
